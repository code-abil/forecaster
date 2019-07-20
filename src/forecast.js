const request=require('request')
console.log(typeof(request))
const forecast=(lat,lon,callback)=>{
    const forecast_url='https://api.darksky.net/forecast/78fac81089a4c803b29f3882a1f734f1/'+lat+','+lon+'?units=us&lang=en'
    request({url:forecast_url,json:true},(error,{body}=response)=>{
        if(error){
            callback('Unable to connect with darksky_api.',undefined)
        }
        else if(body.error){
            callback('Unable to get matching results')
        }
        else{
            callback(undefined,{
                "summary":body.currently.summary,
                "precipIntensity":body.currently.precipIntensity,
                "precipProbability":body.currently.precipProbability,
                "temperature":body.currently.temperature,
                "windSpeed":body.currently.windSpeed,
            })
        }

    });
}

// forecast(37.8267,-121.4233,(error,data)=>{
//     console.log(error)
//     console.log(data)
// })

module.exports=forecast