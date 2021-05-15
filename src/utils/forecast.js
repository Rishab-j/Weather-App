const request = require("request");
const date = require('date-and-time');

function toDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return date.format(t, 'ddd, MMM DD YYYY');
}

const forecast = (longitude, latitude, callback) => {
  
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&exclude=hourly,minutely&appid=10c637f2546262ea2a2237b1a19997b8&units=metric`;
  request({ url, json: true }, (error, {body}) => {
    if (error) {
      callback(
        "Something went wrong. Can't connect to Forecast Services",
        undefined
      );
    } else if (body.cod && body.message) {
      console.log(body.cod,body.message);
      callback("Unable to find location", undefined);
    } else {

      const current = {
        temp: body.current.temp,
        feels_like: body.current.feels_like,
        weather: {
          main: body.current.weather[0].main,
          desc: body.current.weather[0].description,
          icon: body.current.weather[0].icon,
        }
      }

      const daily = body.daily;
      const dailyData = daily.map((d) => {
        return {
          date : toDateTime(d.dt),
          temp : {
            day : d.temp.day,
            min: d.temp.min,
            max: d.temp.max,
          },
          weather : {
            main : d.weather[0].main,
            desc: d.weather[0].description,
            icon: d.weather[0].icon,
          }
        }
      });

      callback(undefined, {
        current,
        dailyData
      });
    }
  });
};

module.exports = forecast;
