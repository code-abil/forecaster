const request =require('request')

const geocode= (address,callback)=>{
    const geocode_url='https://api.mapbox.com/geocoding/v5/mapbox.places/'+encodeURIComponent(address)+'.json?access_token=pk.eyJ1IjoiYWJpbGFzaDEwMSIsImEiOiJjandjM21mbGMwb2V5NGJvNXY5aHNmMTJnIn0.pjEZK-NNfdxrNvTJhBgkQw&limit=1';
    // encodeURIComponent is used ,bcoz sometimes user may give a address having special characters. like comma ,question mark
    request({url:geocode_url,json:true},(error,{body}=response={})=>{
        if(error){
            callback('Not able to connect with the Geocoding API',undefined)
        }
        else if(body.features.length ===0)
        {
            callback('Didnt find any marching results.Try another search.')//By default the second parameter is undefined.
        }
        else
        {
            callback(undefined,{
                lat:body.features[0].center[1],
                lon:body.features[0].center[0],
                location:body.features[0].place_name
            })
        }
    });
}
// geocode('starbucks',(error,data)=>{
//     console.log(error)
//     console.log(data)
// });

module.exports=geocode