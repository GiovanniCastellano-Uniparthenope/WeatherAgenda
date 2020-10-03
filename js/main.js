window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js').then(function (registration) {
                
            // Service worker registered correctly.
            console.log('ServiceWorker registration successful with scope: ' + registration.scope);
        });
    }

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

