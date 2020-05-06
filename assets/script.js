var cityHistory = [];

$(document).ready(function() {
  $("#searchHistory").empty();

    // Populate search history on page load
    var history = JSON.parse(localStorage.getItem("history"));

    if (history !== null) {
        
        cityHistory = history;
        
        for (var i=0; i< cityHistory.length; i++) {

            var city = cityHistory[i];
            var listEl = $("<button class='list-group-item list-group-item-action'>");
            listEl.text(city);

            $("#searchHistory").append(listEl);   
        }
    }

    // Populate last city searched weather data on page load
    var prevName = cityHistory[cityHistory.length-1];

    var prevQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + prevName + "&units=imperial&appid=ada09817b302edc8ce6573f5d8d86b58";

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

    $("#searchHistory").empty();

    var history = JSON.parse(localStorage.getItem("history"));

    if (history !== null) {

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

    var cityName = $("#citySearch").val().trim();

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=ada09817b302edc8ce6573f5d8d86b58";

    return queryURL;
}

// Function to update page with API data
function updatePage(weatherData) {

    // Create header for weather data
    var jumboHeader = $("<h3>");
    
    // Set date
    var currentDay = moment().format("dddd, MMMM Do");

    // Get weather conditions icon
    var iconCode = weatherData.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
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

    // Call UV Index API, create div, and append to jumbotron
    var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=ada09817b302edc8ce6573f5d8d86b58&lat=" + weatherData.coord.lat + "&lon=" + weatherData.coord.lon;

    $.ajax({
        url: uvQueryURL,
        method: "GET"
      }).then(function(response) {
        var uvDiv = $("<div>");
        uvDiv.html("UV Index: " + response.value);
        $("#weatherJumbo").append(uvDiv);
      })  
      
    // Call forecast API, pull data, create HTML elements and append to fiveDay div
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

            // Get date and append to dayDiv
            var date = moment().add(i, 'days');
            date = date.format("dddd, MMMM Do");
            var dateDiv = $("<div>").text(date);
            dayDiv.append(dateDiv);
            dayDiv.append($("<br>"));

            // Get icon and append to dayDiv
            var fiveDayIconCode = response.daily[i].weather[0].icon;
            var fiveDayIconURL = "http://openweathermap.org/img/w/" + fiveDayIconCode + ".png";
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

// Click handlers
$("#searchButton").on("click", function(event) {
    event.preventDefault();

    $("#weatherJumbo").empty();
    $("#fiveDay").empty();

    var queryURL = buildQueryURL();

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(updatePage);

    storeHistory();
    renderHistory(); 
    $("#citySearch").val(""); 
})

$("#searchHistory").on("click", "button", function(event) {
  event.preventDefault();
  event.stopPropagation();

  $("#weatherJumbo").empty();
  $("#fiveDay").empty();

  var historyName = $(this).text();

  var historyQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + historyName + "&units=imperial&appid=ada09817b302edc8ce6573f5d8d86b58";

  $.ajax({
    url: historyQueryURL,
    method: "GET"
  }).then(updatePage);
})
