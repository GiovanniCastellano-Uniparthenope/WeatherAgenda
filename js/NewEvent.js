window.onload = () => {
    var LeafletKey = "";
    var OpenWeatherKey = "";
    var lat = 0.0;
    var lon = 0.0;

    const mymap = L.map('mapid')

    const date = document.getElementById("date");
    const nametext = document.getElementById("name");
    nametext.onfocus = function (){
        nametext.value = "";
        nametext.style.color = "#000000"
    }

    nametext.onblur = function (){
        if(nametext.value === "")
        {
            nametext.style.color = "#a9a9a9"
            nametext.value = "Event name...";
        }
    }

    const searchtext = document.getElementById("search");
    searchtext.onkeypress = function (ke){
        if(ke.key === "Enter")
            searchtext.blur();
    }

    searchtext.onfocus = function (){
        searchtext.value = "";
        searchtext.style.color = "#000000"
    }

    searchtext.onblur = function (){
        if (searchtext.value === "")
        {
            searchtext.style.color = "#a9a9a9"
            searchtext.value = "Search city...";
        }
        else
        {
            var path = "https://api.openweathermap.org/data/2.5/weather?q="+ searchtext.value
                +"&units=metric&appid=" + OpenWeatherKey;

            fetch(path)
                .then( e => e.json())
                .then(weather => {
                    const cod = weather.cod;
                    if(cod === 200)
                    {
                        lat = weather.coord.lat;
                        lon = weather.coord.lon;
                        mymap.setView([lat , lon], 13)
                    }
                    else
                    {
                        searchtext.style.color = "#a9a9a9"
                        searchtext.value = "City not found...";
                    }
                })
                .catch()
        }
    }

    mymap.locate()
    .on("locationfound", function(coords){
        lat = coords.latitude;
        lon = coords.longitude
        mymap.setView([lat, lon], 18)
    })
    .on("locationerror", function (error){
        lat = 40.856721;
        lon = 14.28451;
        mymap.setView([lat, lon], 18)
    });

    mymap.on("click", function(coords){
        console.log(mymap.getCenter().lat + "   -   " + mymap.getCenter().lng);
    });

    var LeafletFile = new XMLHttpRequest();
    LeafletFile.open("GET", "js/LeafletKey.txt", true);
    LeafletFile.onload = function ()
    {
        if(LeafletFile.readyState === 4)
        {
            if(LeafletFile.status === 200 || LeafletFile.status === 0)
            {
                LeafletKey = LeafletFile.responseText;
                L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1,
                    accessToken: LeafletKey
                }).addTo(mymap);
            }
        }
    }
    LeafletFile.send(null);

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

    document.getElementById("createEvent").onclick = function(e){
        second(nametext.value, date.value, lat, lon);
    }
}

function createEvent(name, date, lat, lon)
{
    let data = JSON.stringify({
        name: name,
        date: date,
        lat: lat,
        lon: lon
    });

    fetch('http://localhost:3000',{
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Content-Length': data.length.toString()
        },
        body: data
    });
}

function second(name, date, lat, lon)
{
    let data = JSON.stringify({
        name: name,
        date: date,
        lat: lat,
        lon: lon
    });

    fetch('http://localhost:3000',{
        method: 'GET',
        headers: {
            'Content-Type': 'text/plain',
        },
    })
    .then(e => e.json())
    .then(events => {
        console.log(events);
    })
}