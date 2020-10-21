window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js').then(function (registration) {
                
            // Service worker registered correctly.
            console.log('ServiceWorker registration successful with scope: ' + registration.scope);
        });
    }

    var key = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "js/OpenWeatherKey.txt", true);
    rawFile.onload = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                key = rawFile.responseText;
                L.map("mapid").locate()
                .on("locationfound", function(coords){
                    afterInitialize(key, coords.latitude, coords.longitude)
                })
                .on("locationerror", function (error){
                    afterInitialize(key,40.856721, 14.28451)
                })
            }
        }
    }
    rawFile.send(null);
}

function afterInitialize(key, lat, lon)
{
    var path = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat.toString()
        + "&lon="+ lon.toString() +"&units=metric&appid=" + key;

    fetch(path)
    .then( e => e.json())
    .then(weather => {
        const wtr = weather.weather;
        document.getElementById("temp").innerText = weather.main.temp.toString() + "°C";

        if (wtr[0].main.toString().toLowerCase() === "clear") {
            document.getElementById("WImage").src = "images/sun.png";
            document.getElementsByClassName("weather")[0].style.backgroundColor = "#3388ff";
        }
        else if (wtr[0].main.toString().toLowerCase() === "rain"){
            document.getElementById("WImage").src = "images/rain.png";
            document.getElementsByClassName("weather")[0].style.backgroundColor = "#808080";
        }
        else if (wtr[0].main.toString().toLowerCase() === "clouds"){
            document.getElementById("WImage").src = "images/sunclouds.png";
            document.getElementsByClassName("weather")[0].style.backgroundColor = "#3388ff";
        }
        else if (wtr[0].main.toString().toLowerCase() === "thunderstorm") {
            document.getElementById("WImage").src = "images/storm.png";
            document.getElementsByClassName("weather")[0].style.backgroundColor = "#808080";
        }
        else if (wtr[0].main.toString().toLowerCase() === "drizzle") {
            document.getElementById("WImage").src = "images/cloudy.png";
            document.getElementsByClassName("weather")[0].style.backgroundColor = "#d3d3d3";
        }
        else if (wtr[0].main.toString().toLowerCase() === "snow") {
            document.getElementById("WImage").src = "images/snow.png";
            document.getElementsByClassName("weather")[0].style.backgroundColor = "#d3d3d3";
        }
        else {
            document.getElementById("WImage").src = "images/exclamation.png";
            document.getElementsByClassName("weather")[0].style.backgroundColor = "#ff8787";
        }

        document.getElementById("wind").innerText = weather.wind.speed.toString() + " Km/h";
        document.getElementById("pressure").innerText = weather.main.pressure.toString() + " hPa";
        document.getElementById("moisture").innerText = "H: " + weather.main.humidity.toString() + "%";
        document.getElementById("clouds").innerText = "C: " + weather.clouds.all.toString() + "%";
    })
    .catch()

    deleteOldEvents();
    /*
    Notification.requestPermission().then( function(permission)
    {
        if(Notification.permission === 'granted')
            console.log("Notifications permission granted");
        else
            console.log("Notifications permission denied");

        const notification = new Notification("Notification test");
    });
    */
}

function deleteOldEvents()
{
    var data = "";
    const today = new Date();

    fetch('http://localhost:3000', {
        method: 'GET',
    })
    .then(e => e.text())
    .then(textfile => {
        var jsonfile;
        try {
            jsonfile = JSON.parse(textfile.toString());

            var indices = new Int8Array(jsonfile.events.length);
            var i = 0;

            for(i = 0; i < jsonfile.events.length; i++)
            {
                var strdate = jsonfile.events[i].date;
                var eventDate = new Date(parseInt(strdate.substr(0, 4)), parseInt(strdate.substr(5, 2)) - 1, parseInt(strdate.substr(8, 2)));
                if(today > eventDate)
                {
                    indices[i]++
                }
            }


            for(i = indices.length; i >= 0 ; i--)
            {
                if(indices[i] > 0)
                    jsonfile.events.splice(i, 1);
            }

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