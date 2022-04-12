# WeatherForecastApp

This is an angular web app that consumes [Open weather API](https://openweathermap.org/api/) 

## Development setup

First create a `.env` file based on the .env.example

`cp .env.example .env`

Add your Open Weather API Key to the `.env` file

Run `ocker-compose up --build` to build and  start the docker container. Navigate to `http://localhost:8000/`. 
