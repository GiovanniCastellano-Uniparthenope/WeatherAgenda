window.onload = () => {
    const eventsDiv = document.getElementById("events");
    const eventDiv = document.getElementById("event")
    const eventDivPrototype = eventDiv.cloneNode(true);

    eventDiv.remove()

    var OpenWeatherKey = "";
    var OpenWeatherFile = new XMLHttpRequest();
    OpenWeatherFile.open("GET", "js/OpenWeatherKey.txt", true);
    OpenWeatherFile.onload = function ()
    {
        if(OpenWeatherFile.readyState === 4)
        {
            if(OpenWeatherFile.status === 200 || OpenWeatherFile.status === 0)
            {
                OpenWeatherKey = OpenWeatherFile.responseText;
            }
        }
    }
    OpenWeatherFile.send(null);

    fetch('http://localhost:3000', {
        method: 'GET',
    })
    .then(e => e.text())
    .then(textfile => {

    var jsonfile;
    try {
        jsonfile = JSON.parse(textfile.toString());

        const today = new Date()
        const todayplus5 = new Date();
        todayplus5.setDate(today.getDate() + 5);
        var i;
        for(i = 0; i < jsonfile.events.length; i++)
        {
            var newDiv = eventDivPrototype.cloneNode(true)
            var j;
            var image = null;
            var label = null;
            for(j = 0; j < newDiv.childNodes.length; j++)
            {
                if (newDiv.childNodes[j].nodeName === "LABEL")
                    label = newDiv.childNodes[j];
                else if (newDiv.childNodes[j].nodeName === "IMG")
                    image = newDiv.childNodes[j];
            }
            if(image != null && label != null)
            {
                while(OpenWeatherKey === ""){ console.log("OWK: " + OpenWeatherKey); }
                var path = "https://api.openweathermap.org/data/2.5/forecast?lat=" + jsonfile.events[i].lat.toString()
                    + "&lon="+ jsonfile.events[i].lon.toString() +"&units=metric&appid=" + OpenWeatherKey;
                var weather;
                async function request() {
                    var response = await fetch(path).catch(function (e) {console.log("Fetch error: " + e)})
                    var wtr = await response.json()
                    return wtr;
                }

                (async (jsonfile, i, label, image, newDiv) => {
                    weather = await request()

                    var strdate = jsonfile.events[i].date;

                    var str = "";
                    str += jsonfile.events[i].name + ", ";
                    str += weather.city.name + ", ";
                    str += strdate;
                    label.innerHTML = str;

                    var eventDate = new Date(parseInt(strdate.substr(0, 4)), parseInt(strdate.substr(5, 2)) - 1, parseInt(strdate.substr(8, 2)));

                    if(eventDate <= todayplus5) {
                        var days = Math.min((eventDate.getDate() - today.getDate()), 5);
                        var index = Math.max(8 * days - 1, 0)
                        var forecastedWeather = weather.list[index].weather[0].main;

                        if (forecastedWeather.toString().toLowerCase() === "clear") {
                            image.src = "images/sun.png";
                        } else if (forecastedWeather.toString().toLowerCase() === "rain") {
                            image.src = "images/rain.png";
                        } else if (forecastedWeather.toString().toLowerCase() === "clouds") {
                            image.src = "images/sunclouds.png";
                        } else if (forecastedWeather.toString().toLowerCase() === "thunderstorm") {
                            image.src = "images/storm.png";
                        } else if (forecastedWeather.toString().toLowerCase() === "drizzle") {
                            image.src = "images/cloudy.png";
                        } else if (forecastedWeather.toString().toLowerCase() === "snow") {
                            image.src = "images/snow.png";
                        } else {
                            image.src = "images/exclamation.png";
                        }
                    }

                    newDiv.style.visibility = "visible";
                    eventsDiv.appendChild(newDiv);
                    newDiv.onclick = function (event) {
                        clickToDelete(event);
                    }
                })(jsonfile, i, label, image, newDiv)
            }
        }
    }
    catch (e)
    {

    }
    });
}

function clickToDelete(event){
    var clicked = event.target;
    if(clicked.nodeName === "LABEL" || clicked.nodeName === "IMG")
        clicked = clicked.parentNode;
    console.log(clicked.nodeName);
    if(confirm("Do you really want to delete this event?"))
    {
        if(clicked != null)
        {
            const children = clicked.childNodes;
            var label;
            var i;
            for(i = 0; i < children.length; i++)
            {

                if(children[i].nodeName === "LABEL")
                {
                    label = children[i];
                    break;
                }
            }
            var name = ""
            var i = 0;
            while(label.innerHTML[i] !== ',')
            {
                name += label.innerHTML[i];
                i++;
            }
            console.log(name);
            deleteEvent(name)
            clicked.remove();
        }
    }
}

function deleteEvent(name)
{
    var data = ""

    fetch('http://localhost:3000', {
        method: 'GET',
    })
        .then(e => e.text())
        .then(textfile => {
            var jsonfile;
            try {
                jsonfile = JSON.parse(textfile.toString());

                var index = -1
                var i = 0
                console.log(jsonfile);

                for(i = 0; i < jsonfile.events.length; i++)
                {
                    if(jsonfile.events[i].name === name)
                    {
                        index = i;
                        break;
                    }
                }


                if(index >= 0)
                {
                    jsonfile.events.splice(index, 1);
                }

                console.log(jsonfile);

                data = JSON.stringify(jsonfile);

                fetch('http://localhost:3000', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain',
                        'Content-Length': data.length.toString()
                    },
                    body: data
                });
            } catch (e) {
                console.log(e);
            }
        });
}

