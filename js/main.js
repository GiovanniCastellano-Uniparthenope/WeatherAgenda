window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js').then(function (registration) {
                
            // Service worker registered correctly.
            console.log('ServiceWorker registration successful with scope: ' + registration.scope);
        });
    }

    L.map("mapid").locate()
    .on("locationfound", function(coords){
        afterInitialize(coords.latitude, coords.longitude)
    })
    .on("locationerror", function (error){
        afterInitialize(40.856721, 14.28451)
    })
}

function afterInitialize(lat, lon)
{
    var path = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat.toString()
        + "&lon="+ lon.toString() +"&units=metric&appid=" + "";

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
                document.getElementsByClassName("weather")[0].style.backgroundColor = "#b22222";
            }

            document.getElementById("wind").innerText = weather.wind.speed.toString() + " Km/h";
            document.getElementById("pressure").innerText = weather.main.pressure.toString() + " hPa";
            document.getElementById("moisture").innerText = "H: " + weather.main.humidity.toString() + "%";
            document.getElementById("clouds").innerText = "C: " + weather.clouds.all.toString() + "%";
        })
        .catch(console.error)

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

