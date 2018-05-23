
const http = require('http');
//const functions = require('firebase-functions');
const express =require('express');
const bodyParser = require('body-parser');

const host = 'api.worldweatheronline.com';
const wwoApiKey = 'd39a3c387837421685761154180605';

const {
  dialogflow,
  SimpleResponse,
  BasicCard,
  Button,
  Carousel,
  BrowseCarousel,
  List,
  Suggestions,
  Image
} =require('actions-on-google');

const WELCOME_INTENT =                'Default Welcome Intent';
  // // Get the city and date from the request
  // let city = req.body.queryResult.parameters['geo-city']; // city is a required param

  // // Get the date for the weather forecast (if present)
  // let date = '';
  // if (req.body.queryResult.parameters['date']) {
  //   date = req.body.queryResult.parameters['date'];
  //   console.log('Date: ' + date);
  // }

  const app = dialogflow({debug:true});
  app.intent('Default Welcome Intent',(conv)=>{
    
    let city='kolkata';
    let date='23-05-2018';
   var object = {
     callWeatherApi(city,date);
   }
   console.log("object: "+object);
    conv.ask(new SimpleResponse({
     speech:"hi welcome, this is defaultelcome intent",
     text:"hii dbfhfh"
   }));
  
    // Call the weather API
    callWeatherApi(city, date).then((output) => {
   
     console.log(output);
    }).catch(() => {
    //  res.json({ 'fulfillmentText': `I don't know the weather but I hope it's good!` });
    console.log('error');
    });


  })
  
  



  function callWeatherApi (city, date) {
    return new Promise((resolve, reject) => {
      // Create the path for the HTTP request to get the weather
      let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
        '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date;
      console.log('API Request: ' + host + path);
  
      // Make the HTTP request to get the weather
      http.get({host: host, path: path}, (res) => {
        let body = ''; // var to store the response chunks
        res.on('data', (d) => { body += d; }); // store each response chunk
        res.on('end', () => {
          // After all the data has been received parse the JSON for desired data
          let response = JSON.parse(body);
        //  console.log("Response....................:"+response);
          let forecast = response['data']['weather'][0];
          let location = response['data']['request'][0];
          let conditions = response['data']['current_condition'][0];
          let currentConditions = conditions['weatherDesc'][0]['value'];
  
          // Create response
          let output = `Current conditions in the ${location['type']} 
          ${location['query']} are ${currentConditions} with a projected high of
          ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
          ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on 
          ${forecast['date']}.`;
  
          // Resolve the promise with the output text
         // console.log(output);
          return resolve(output);
        });
        res.on('error', (error) => {
          console.log(`Error calling the weather API: ${error}`)
          reject();
        });
      });
    });
  }
express().use(bodyParser.json(),app).listen(process.env.PORT || 80);