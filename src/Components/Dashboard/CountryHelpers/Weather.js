import React from 'react';
import { Column, Message } from 'rbx';
import fetchWithTimeout from './fetchWithTimeout';
import { getCityLat, getCityLng } from './CountryDataHelpers';

const Weather = async (country, city, startDate, dateRange) => {
  let latitude;
  let longitude;
  try {
    if (!city) {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${country}.json?access_token=pk.eyJ1IjoiY2xlbWVuc3RpZ2F0b3IiLCJhIjoiY2p6dm8xeWowMHM0djNnbG02ZWM5ZHo4dSJ9.GNbHIUUjyUdJfazjBuExmw&limit=1`;
      const response = await fetchWithTimeout(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }, 1500);
      const res = await response.json();
      [longitude, latitude] = res.features[0].center;
    } else {
      [longitude, latitude] = [getCityLng(city, country), getCityLat(city, country)];
    }
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    const weatherUrl = `http://api.worldweatheronline.com/premium/v1/weather.ashx?key=0d7b6c6176f04e12a1523034202802&q=${latitude.toFixed(3)},${longitude.toFixed(3)}&format=json&num_of_days=${dateRange}`;
    const weatherResponse = await fetchWithTimeout(proxyurl + weatherUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Transfer-Encoding': 'chunked',
        Connection: 'keep-alive',
        Vary: 'Accept-Encoding',
        'CDN-PullZone': '61832',
        'CDN-Uid': '8fa3a04a-75d9-4707-8056-b7b33c8ac7fe',
        'CDN-RequestCountryCode': 'FI',
        'CDN-EdgeStorageId': '601',
        'X-WWO-Qpd-Left': '488',
        'CDN-CachedAt': '2020-02-28 05:30:52',
        'CDN-RequestId': '744f78f6ea6a7638ab04e662745144fc',
        'CDN-Cache': 'HIT',
        'Cache-Control': 'public, max-age=180',
        'Content-Type': 'application/json',
        Date: 'Fri, 28 Feb 2020 04:31:24 GMT',
        Server: 'BunnyCDN-DE1-601',
      },
    }, 1500);
    const weatherRes = await weatherResponse.json();
    const weatherObj = {};
    let i;
    let dailyWeather;
    for (i = 0; i < dateRange; i += 1) {
      dailyWeather = [];
      dailyWeather.push(Math.round(weatherRes.data.weather[i].maxtempF));
      dailyWeather.push(Math.round(weatherRes.data.weather[i].mintempF));
      dailyWeather.push(Math.round(weatherRes.data.weather[i].avgtempF));
      dailyWeather.push(weatherRes.data.weather[i].date);
      weatherObj[i] = dailyWeather;
    }
    const arr = Object.values(weatherObj);
    const returnObject = {
      title: 'Weather',
      contents: (
        arr.map((_, index) => (
          <Column.Group>
            <Column size={3}>
              <Message.Header>
                {weatherObj[index][3]}
              </Message.Header>
              <p>
                Daytime Hi:
                  {' '}
                {weatherObj[index][0]}
                {' '}
                &deg;F
                </p>
              <p>
                Daytime Low:
                  {' '}
                {weatherObj[index][1]}
                {' '}
                &deg;F
                </p>
              <p className="degrees-text">
                {' '}
                {weatherObj[index][2]}
                {' '}
                &deg;F
                </p>
            </Column>
          </Column.Group>
        ))


      ),
    };
    return (returnObject);
  } catch {
    return 'No information found.';
  }
};

export default Weather;
