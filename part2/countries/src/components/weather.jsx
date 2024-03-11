import { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ capital, code }) => {
    const api_key = import.meta.env.VITE_API_KEY

    const [weather, setWeather] = useState({})

    useEffect(() => {
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital},${code}&APPID=${api_key}&units=metric`)
            .then((response) => {
            setWeather(response.data.main)
        })
    }, [capital, code, api_key])

    useEffect(() => {
      console.log(weather)
  }, [weather])

  return (
    <div>
      <h2>
        Weather in {capital}
      </h2>
      <p>temperature: {weather.temp} Celsius</p>
      <p>feels like: {weather.feels_like}</p>
    </div>
  )
}

export default Weather