# Weather Dashboard

- I created a web application that lets you view current and future weather 
conditions for a city.

## Overview

- This application displays current weather conditions, including:
    - Name of city
    - Date
    - Icon depicting weather conditions
    - Temperature in F
    - Humidity percentage
    - Wind speed in MPH
    - UV Index
        - This section is color-coded based on the UV warning level:
        - Green = Favorable
        - Yellow = Moderate
        - Red = Severe

- This application also displays a five-day forecast, including:
    - Date
    - Icon depicting weather conditions
    - Temperature in F
    - Humidity percentage

- This application also includes a city search input box and
a list of links to your search history from localStorage.        

## Methods

- This webpage is styled using Bootstrap CSS, Font Awesome, and some
custom CSS features.

- The webpage runs on JQuery, uses Moment for date information, 
and uses AJAX to retrieve weather information.

- Weather data is pulled from the OpenWeatherMap API.

## Usage

- Upon loading, the webpage will display the weather information
for the last city the user searched for.

- The user can type in any city into the search box and the page
will be populated with the corresponding weather information.

- After searching, the city will be added to a list of cities the user
has previously searched.
    - Each city in the search history is a button that, when clicked,
    will repopulate the page with that city's weather information.

- Check out the deployed application here: https://saularjm.github.io/weather-dash/ 


