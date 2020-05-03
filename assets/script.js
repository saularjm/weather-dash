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

    var jumboHeader = $("<h3>");
    var currentDay = moment().format("dddd, MMMM Do");

    var iconCode = weatherData.weather[0].icon
    var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
    var icon = $("<img>");
    icon.attr("src", iconURL);
    
    jumboHeader.text(weatherData.name + " - " + currentDay + " - ");
    jumboHeader.append(icon);
    $("#weatherJumbo").append(jumboHeader);
}


// Click handlers
$("#searchButton").on("click", storeHistory());
$("#searchButton").on("click", renderHistory());

$("#searchButton").on("click", function(event) {
    event.preventDefault();

    $("#weatherJumbo").empty();

    var queryURL = buildQueryURL();

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(updatePage);
})

