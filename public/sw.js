// This file is outside client-js folder due to scope problems.


// self refers to windows(HTML).
//Event listender which will fire on the install event.
// var locations=['Chennai','Mumbai','Kolkata','Delhi']
// module.exports={locations}
var dataCacheName='weatherdata5'
var cacheName='weatherPWA4'
// Providing cache name allows us to version files or separate name from the 
// app shell so that we can easily update but not affect other content.
var filestoCache=[
    '/client-js/app.js',
    '/node_modules/materialize-css/dist/css/materialize.min.css',
    '/node_modules/materialize-css/dist/js/materialize.min.js',
    '/templates/partials/footer.hbs',
    '/templates/partials/link_js.hbs',
    '/templates/partials/links_head.hbs',
    '/templates/partials/navbar.hbs',
    '/templates/views/index.hbs',
    '/images/clear.png',
    '/images/cloudy.png',
    '/images/rain.png',
    '/images/snow.png',
    '/images/icons/4-icon-48.png',
    '/images/icons/4-icon-96.png',
    '/images/icons/4-icon-128.png',
    '/images/icons/4-icon-144.png',
    '/images/icons/4-icon-192.png',
    '/images/icons/4-icon-256.png',
    '/images/icons/4-icon-384.png',
    '/images/icons/4-icon-512.png',
    '/manifest.json',
    'htmls/home.html'
]
self.addEventListener('install', function(e) {
    // console.log('[ServiceWorker] Install')
    e.waitUntil(
      caches.open(cacheName).then(function(cache) {
            // console.log('Caching up App Shell')
            return cache.addAll(filestoCache);
            // The above function is atomic.
            // If there is an error in the above process, it simply doesnt
            // cache anything.
      })
    )
})


// Activate event is used for , updating the cache.
// Removing old cache.
self.addEventListener('activate',function(e){
    // console.log('[ServiceWorker] Activate')
    e.waitUntil(
        // Get the list of current cache keys, and iterate through them 
        // using a map function.
        caches.keys().then(function(keyList){
            return Promise.all(keyList.map(function(key){
                if(key!==cacheName){
                    // console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
                // We compare the keys with the current cache key,
                // if they are not equal , it will delete them.
            }))
        })
    )
})

const dataURL='http://localhost:3000/weather?address'
self.addEventListener('fetch',function(e){

    // console.log('[ServiceWorker]Fetch',e.request.url)
    // console.log(e.request.url.startsWith(dataURL))
    if(e.request.url.startsWith(dataURL)){
        e.respondWith(
            fetch(e.request).then(function(response){
                return caches.open(dataCacheName).then(function(cache){
                    // console.log("Reached")
                    console.log(response)
                    cache.put(e.request.url,response.clone())
                    // console.log('[Service Worker] Fetched and cached data.',e.request.url)
                    return response
                
                })
            })
        )
    }
    else{
        e.respondWith(
            // caches.match evaluates the request that triggered the fetch
            // and checks to see if its available in the cache.
            caches.match(e.request).then(function(response){
                // console.log(response)
                if(response){
                    // console.log("responding from the cache.")
                    return response
                }
                else{
                    // console.log("responding from server")
                    return fetch(e.request);
                }
                    
                // respons either with a cached version, or gets it from 
                //  the internet.
            })
        )
    }
})

// Disadvantages of the above method:
// 1.Every time, the resource of app shell resource is changed , we need to 
// update the cacheName.
// 2. Needs to be downloaded everytime,a single file change happens.


// https://stackoverflow.com/questions/45778465/node-js-how-caching-handlebars-js-using-service-worker
// https://www.youtube.com/watch?v=wEPeaJgbIxQ&list=PLNYkxOF6rcIB2xHBZ7opgc2Mv009X87Hh&index=7&t=
// https://developers.google.com/web/ilt/pwa/lab-caching-files-with-service-worker

// https://gist.github.com/Rich-Harris/fd6c3c73e6e707e312d7c5d7d0f3b2f9