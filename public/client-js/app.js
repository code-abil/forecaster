// if(navigator.serviceWorker)
// {
//     //when registering a service worker, it is limited to the scope provided.
//     // If we register like '/foler/sw.js' Service workers will only work 
//     // for urls having '/folder/'.
//     // If we register as sw.js ,it service-worker scope will the 
//     // be entire origin.
//     navigator.serviceWorker.register('/sw.js').then(function(registration) {
//         console.log('Excellent, registered with scope: ', registration.scope);
//     });
// }

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      // console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      // console.log('ServiceWorker registration failed: ', err);
    });
  });
}

console.log('Client Side JS loaded')

var initial_locations=['Chennai','Mumbai','Delhi','Bangalore']
var locations_data=[{},{},{},{}]
var buffer_location

const display_locations=()=>{
  console.log("Display locations called.")
  for(i=0;i<4;i++){
    if(!locations_data[i]){
      continue;
    }
    var id="card-title"+(i+1).toString()
    // console.log(id,typeof(i.toString()))
    document.getElementById(id).innerHTML=locations_data[i].location
    var id_data="card-content-"+(i+1).toString()
    console.log(locations_data[i])
    var data_to_insert="<b>"+locations_data[i].location+"</b></br>"+"Summary:"+locations_data[i].forecast.summary+'</br>'+
                       "Precipitaion Intensity:"+locations_data[i].forecast.precipIntensity+'</br>'+
                       "Precipitaion Probability:"+locations_data[i].forecast.precipProbability+'</br>'+
                       "Temperature:"+locations_data[i].forecast.temperature+'</br>'+
                       "WindSpeed:"+locations_data[i].forecast.windSpeed+'</br>';
    document.getElementById(id_data).innerHTML=data_to_insert
  }
}
const fetchdata=(guest)=>{
    if(guest){
      input_location=buffer_location
    }else{
      input_location=document.getElementById("input_location").value
    }
    console.log(input_location)
    if(input_location==''){
        console.log('empty string found')
        document.getElementById("error-message").innerHTML='forecaster has not learnt to process EMPTY LOCATION '
        return undefined;
    }  
    const url='http://localhost:3000/weather?address='+input_location
    if('caches' in window){
      // console.log("We have found some caches")
      caches.match(url).then(function(response){
        if(response){
          console.log("Response from Cached Data"+response)
          response.json().then(function(data){
              console.log("Cachedddddd"+data.address)
              if(guest){
                //Do nothing.
              }
              else{
                updateCard_cache(data)
              }
          })
        }
      })
    }
    fetch('http://localhost:3000/weather?address='+input_location).then((response)=>{
        
        //To Check for network errors.
        if(!response.ok){
          return 
        }
        document.getElementById("error-message").innerHTML=''
        // console.log("Cool")
        response.json().then((data)=>{
            if(data.error){
              console.log(locations_data)
              console.log("Error printing here",data.error)
            }
            else{
              if(guest){
                for(i=0;i<4;i++){
                  if(initial_locations[i]===data.address){
                    index=i
                    break;
                  }
                }
                locations_data[index]=data;
                display_locations()
              }
              else{
                updateCard_network(data);
                // display_locations()
              }
            }    
            console.log(data)
        })
    }).catch(()=>{console.log("Error occured while fetching.")})
}

const firstfetch=()=>{
  cache_loaded=0
  for(i=0;i<4;i++){
    const url='http://localhost:3000/weather?address='+initial_locations[i]
    if('caches' in window){
      // console.log("We have found some caches")
      caches.match(url).then(function(response){
        if(response){
          console.log("Response from Cached Data"+response)
          response.json().then(function(data){
              console.log("Added into locations_data")
              console.log("Checking for",data.address)
              for(i=0;i<4;i++){
                // === for typechecking+comparing.
                if(data.address===initial_locations[i]){
                  index=i;
                  break;
                }
              }
              console.log("index=",index)
              console.log("Data added is",data)
              locations_data[index]=data
              display_locations()
          })
        }
      })
    }
  }
  console.log(locations_data)
  for(i=0;i<4;i++){
    // document.getElementById("input_location").innerHTML=initial_locations[i]
    // console.log("Initial Location",initial_locations[i])
    buffer_location=initial_locations[i]
    // setTimeout(3000,()=>{console.log("Waited for 3secs.")})
    // console.log(document.getElementById("input_location").value)
    fetchdata(true)
    console.log(locations_data)
   }
   
}

window.onload=firstfetch()


const updateCard_cache=(data)=>{
  if(data){
    console.log('UpdateCard_cache')
    for(i=3;i>0;i--){
        locations_data[i]=locations_data[i-1]
    }
    locations_data[0]=data
    display_locations()
    buffer_location=data.address
  }
}
const updateCard_network=(data)=>{
  if(data){
    console.log("updateCard_network")
    if(data.address!==buffer_location){
      for(i=3;i>0;i--){
        locations_data[i]=locations_data[i-1]
      }  
    }
    locations_data[0]=data
    display_locations()
  }
}

