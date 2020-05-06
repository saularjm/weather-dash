// Create array for storing search history
var cityHistory = [];

// Functions for on document load
$(document).ready(function() {
  $("#searchHistory").empty();

    // Populate search history on page load
    var history = JSON.parse(localStorage.getItem("history"));

    if (history !== null) {
        
        cityHistory = history;
        
        // Create search history list and populate page
        for (var i=0; i< cityHistory.length; i++) {

            var city = cityHistory[i];
            var listEl = $("<button class='list-group-item list-group-item-action'>");
            listEl.text(city);

            $("#searchHistory").append(listEl);   
        }
    }

    // Populate last city searched weather data on page load
    // Get city name from localStorage
    var prevName = cityHistory[cityHistory.length-1];

    // Build query URL
    var prevQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + prevName + "&units=imperial&appid=ada09817b302edc8ce6573f5d8d86b58";

    // API call and update page
    $.ajax({
      url: prevQueryURL,
      method: "GET"
    }).then(updatePage);
})

// Function to store search history
function storeHistory() {
    cityHistory.push($("#citySearch").val().trim())
    localStorage.setItem("history", JSON.stringify(cityHistory));
}

// Function to render search history
function renderHistory() {

    // Empty history list
    $("#searchHistory").empty();

    // Retrieve history from localStorage
    var history = JSON.parse(localStorage.getItem("history"));

    if (history !== null) {

        // Create search history list and populate page
        for (var i=0; i< cityHistory.length; i++) {

            var city = cityHistory[i];
            var listEl = $("<button class='list-group-item list-group-item-action'>");
            listEl.text(city);

            $("#searchHistory").append(listEl);   
        }
    }
}

// Function to build query URL
function buildQueryURL() {

    // Get city to search from user input
    var cityName = $("#citySearch").val().trim();

    // Build query URL
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=ada09817b302edc8ce6573f5d8d86b58";

    return queryURL;
}

// Function to update page with API data
function updatePage(weatherData) {

    // Create header for weather data
    var jumboHeader = $("<h3>");
    
    // Set date
    var currentDay = moment().format("dddd, MMMM Do");

    // Get weather conditions icon and create HTML img element
    var iconCode = weatherData.weather[0].icon;
    var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
    var icon = $("<img>");
    icon.attr("src", iconURL);
    
    // Set header with text and icon and append to jumbotron
    jumboHeader.text(weatherData.name + " - " + currentDay + " - ");
    jumboHeader.append(icon);
    $("#weatherJumbo").append(jumboHeader);

    // Create div for temperature and append to jumbotron
    var tempDiv = $("<div>");
    tempDiv.html("Temperature: " + weatherData.main.temp + " &#8457;");
    $("#weatherJumbo").append(tempDiv);
    $("#weatherJumbo").append($("<br>"));

    // Create div for humidity and append to jumbotron
    var humidDiv = $("<div>");
    humidDiv.html("Humidity: " + weatherData.main.humidity + "%");
    $("#weatherJumbo").append(humidDiv);
    $("#weatherJumbo").append($("<br>"));

    // Create div for wind speed and append to jumbotron
    var windDiv = $("<div>");
    windDiv.html("Wind Speed: " + weatherData.wind.speed + " MPH");
    $("#weatherJumbo").append(windDiv);
    $("#weatherJumbo").append($("<br>"));

    // Call UV Index API using lat and lon
    var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=ada09817b302edc8ce6573f5d8d86b58&lat=" + weatherData.coord.lat + "&lon=" + weatherData.coord.lon;

    $.ajax({
        url: uvQueryURL,
        method: "GET"
      }).then(function(response) {

        // Create div for UV index
        var uvDiv = $("<div>");
        uvDiv.html("UV Index: " + response.value);

        // Set warning color for UV index
        if (response.value <= 3) {
          uvDiv.addClass("favorable");
        }
        else if ((response.value > 3) && (response.value <= 6)) {
          uvDiv.addClass("moderate");
        }
        else {
          uvDiv.addClass("severe");
        }

        // append to jumbotron
        $("#weatherJumbo").append(uvDiv);
      })  
      
    // Call five day forecast API, pull data, create HTML elements and append to fiveDay div
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + weatherData.coord.lat + "&lon=" + weatherData.coord.lon + "&exclude=current,hourly&units=imperial&appid=ada09817b302edc8ce6573f5d8d86b58";  

    $.ajax({
        url: fiveDayURL,
        method: "GET"
      }).then(function(response) {

          // Loop through five days of weather data
          for (var i=1;i<6;i++) {
            // Create div to hold daily forecast  
            var dayDiv = $("<div>");
            dayDiv.css("display", "inline-block");
            dayDiv.addClass("mx-3 pb-5");
            dayDiv.addClass("btn-primary");

            // Get date and append to dayDiv
            var date = moment().add(i, 'days');
            date = date.format("dddd, MMMM Do");
            var dateDiv = $("<div>").text(date);
            dayDiv.append(dateDiv);
            dayDiv.append($("<br>"));

            // Get icon and append to dayDiv
            var fiveDayIconCode = response.daily[i].weather[0].icon;
            var fiveDayIconURL = "https://openweathermap.org/img/w/" + fiveDayIconCode + ".png";
            var fiveDayIcon = $("<img>");
            fiveDayIcon.attr("src", fiveDayIconURL);
            dayDiv.append(fiveDayIcon);
            dayDiv.append($("<br>"));

            // Get temp and append to dayDiv
            var fiveDayTempDiv = $("<div>");
            fiveDayTempDiv.html("Temperature: " + response.daily[i].temp.max + " &#8457;");
            dayDiv.append(fiveDayTempDiv);
            dayDiv.append($("<br>"));

            // Get humidity and append to dayDiv
            var fiveDayHumidDiv = $("<div>");
            fiveDayHumidDiv.html("Humidity: " + response.daily[i].humidity + "%");
            dayDiv.append(fiveDayHumidDiv);

            // Append dayDiv to 5day forecast area
            $("#fiveDay").append(dayDiv);
          }
      })
}

// Click handler for search button
$("#searchButton").on("click", function(event) {
    event.preventDefault();

    // Empty weather info divs
    $("#weatherJumbo").empty();
    $("#fiveDay").empty();

    // Build query URL
    var queryURL = buildQueryURL();

    // Call weather API and update page
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(updatePage);

    // Store city in search history and update list
    storeHistory();
    renderHistory(); 
    $("#citySearch").val(""); 
})

// Click handler for search history elements
$("#searchHistory").on("click", "button", function(event) {
  event.preventDefault();
  event.stopPropagation();

  // Empty weather info divs
  $("#weatherJumbo").empty();
  $("#fiveDay").empty();

  // Build query URL using city name from history link
  var historyName = $(this).text();

  var historyQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + historyName + "&units=imperial&appid=ada09817b302edc8ce6573f5d8d86b58";

  // Call weather API and update page
  $.ajax({
    url: historyQueryURL,
    method: "GET"
  }).then(updatePage);
})
