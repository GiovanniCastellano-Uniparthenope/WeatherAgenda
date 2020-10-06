window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js').then(function (registration) {
                
            // Service worker registered correctly.
            console.log('ServiceWorker registration successful with scope: ' + registration.scope);
        });
    }

    fetch("") //ADD PATH
        .then(function (e){
        const jsonfile = e.json();
        const weather = JSON.parse(jsonfile);

        const wtr = weather.weather;
        document.getElementById("temp").innerText = weather.main.temp.toString() + "°C";

        if(wtr[0].main.toString().toLowerCase() === "clear")
            document.getElementById("WImage").src = "images/sun.png";
        else if(wtr[0].main.toString().toLowerCase() === "rain")
            document.getElementById("WImage").src = "images/rain.png";
        else if(wtr[0].main.toString().toLowerCase() === "clouds")
            document.getElementById("WImage").src = "images/sunclouds.png";
        else if(wtr[0].main.toString().toLowerCase() === "thunderstorm")
            document.getElementById("WImage").src = "images/storm.png";
        else if(wtr[0].main.toString().toLowerCase() === "drizzle")
            document.getElementById("WImage").src = "images/cloudy.png";
        else if(wtr[0].main.toString().toLowerCase() === "snow")
            document.getElementById("WImage").src = "images/snow.png";
        else
            document.getElementById("WImage").src = "images/exclamation.png";

        document.getElementById("wind").innerText = weather.wind.speed.toString() + " Km/h";
        document.getElementById("pressure").innerText = weather.main.pressure.toString() + " hPa";
        document.getElementById("moisture").innerText = "H: " + weather.main.humidity.toString() + "%";
        document.getElementById("clouds").innerText = "C: " + weather.clouds.all.toString() + "%";
    });

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

