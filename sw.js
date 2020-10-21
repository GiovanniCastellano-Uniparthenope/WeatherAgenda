if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

let cacheName = 'AppFiles';
let filesToCache = [
    './',
    'index.html',
    'MyEvents.html',
    'NewEvent.html',
    'manifest.json',
    'css/index.css',
    'css/MyEvents.css',
    'css/NewEvent.css',
    'js/main.js',
    'js/MyEvents.js',
    'js/NewEvent.js',
    'images/sun.png',
    'images/sunclouds.png',
    'images/cloudy.png',
    'images/rain.png',
    'images/storm.png',
    'images/snow.png',
    'images/exclamation.png',
    'images/cloudframe.png',
    'images/question_mark.png',
    'images/earth-100.png'
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            if(response !== undefined) return response
            else return fetch(e.request);
        })
    );
});