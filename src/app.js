const express=require('express')
const path=require('path')
const hbs=require('hbs')
const geocode=require('./geocode.js')
const forecast=require('./forecast.js')

const app=express()

const publicdirectoryRoute=path.join(__dirname,'../public')
console.log(publicdirectoryRoute)
app.use(express.static(publicdirectoryRoute))

app.set('view engine','hbs')
app.set('views',path.join(__dirname,'../public/templates/views'))

console.log(__dirname)
const partialspath=path.join(__dirname,'../public/templates/partials')
hbs.registerPartials(partialspath)

app.get('',(req,res)=>{
    res.render('index')
})
app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error:'No address provided.'
        })
    }

    geocode(req.query.address,(error,{lat,lon,location}={})=>{
        if(error){
            console.log(error.error)
            return res.send({error})
        }
        // console.log(data)
        forecast(lat,lon,(error,forecast_data)=>{
            if(error){
                return res.send({error})
            }
            res.send({
                forecast:forecast_data,
                location,
                address:req.query.address
            })
            console.log(location)
            console.log(forecast_data)
        })
    })

})


// app.get('/products',(req,res)=>{
//     if(!req.query.address)
//     {
//         return res.send({
//             error:'No address provided.'
//         })
//     }
//     res.send({
//         products:[]
//     })
//     // console.log(typeof(req.query));
//     // req.querry returns an object which has key=value pairs present in the querry string
// });

app.listen(3000,()=>{
    console.log('Live on port no 3000');
})