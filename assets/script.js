var cityHistory = [];

// Function to store search history
function storeHistory() {
    localStorage.setItem("history", JSON.stringify(cityHistory));
}

// Function to render search history
function renderHistory() {

    $("#searchHistory").empty();

    for (var i=0; i< cityHistory.length; i++) {

        var city = cityHistory[i];

        var listEl = $("<a class='list-group-item list-group-item-action'>");

        // TODO: set link to that city's weather data info page
        //listEl.attr("href", )
        listEl.text(city);

        $("#searchHistory").append(listEl);   
    }
}

// Function to build query URL
function buildQueryURL() {

    var cityName = $("#citySearch").val().trim();

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=ada09817b302edc8ce6573f5d8d86b58";

    return queryURL;
}

// Function to update page display with API data
function updatePage(weatherData) {
    console.log(weatherData);

    // Create header for weather data
    var jumboHeader = $("<h3>");
    
    // Set date
    var currentDay = moment().format("dddd, MMMM Do");

    // Get weather conditions icon
    var iconCode = weatherData.weather[0].icon
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
}


// Click handlers
$("#searchButton").on("click", function(event) {
    event.preventDefault();

    $("#weatherJumbo").empty();

    var queryURL = buildQueryURL();

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(updatePage);

    storeHistory();
    renderHistory();  
})

