const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// Defining paths for express config
const publicDirPath = path.join(__dirname , "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setting up Handlebars(i.e template) engine and views location
app.set('view engine','hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);

// Setting up static files to serve
app.use(express.static(publicDirPath));


app.get('',(req,res) => {
    res.render('index',{
        title : 'Weather App',
        name : 'Rishab'
    });
});

app.get('/about',(req,res) => {
    res.render('about',{
        title : 'About Page',
        name : 'Rishab'
    });
});


app.get('/weather',(req,res)=>{

    if(!req.query.location){
        return res.send({
            error : "Please provide the location"
        })
    }

    // default parameter is used for the case when the api cant find location
    // and according to geocode in our util it will return undefined , so we can't destructure it
    // thats why we provide an empty object 
    geocode(req.query.location,(error,{longitude,latitude,location} = {})=>{
        if(error){
            return res.send({
                error
            });
        }else{
            console.log("Location is" + req.query.location);
            forecast(longitude,latitude,(error,{current,dailyData} = {})=>{
                if(error){
                    return res.send({
                        error
                    });
                }else{
                    console.log(location);
                    // console.log(`Temperature at ${location} is ${temp} degree celcius`);
                    console.log(current);
                    console.log(dailyData);


                    res.send({
                        location,
                        current,
                        dailyData
                    });
                }
            });
        }
    });
});

app.get('/help/*',(req,res) => {
    res.render('404',{
        name: "Rishab",
        title: "404",
        message : "Help Article Not found",
    });
});

app.get('*',(req,res) => {
    res.render('404',{
        name: "Rishab",
        title: "404",
        message : "Page not found",
    });
});

app.listen(port , () => {
    console.log("Server is up on port : " + port);
})