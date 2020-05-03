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

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=ada09817b302edc8ce6573f5d8d86b58";

    return queryURL;
}


// Click handlers
$("#searchButton").on("click". storeHistory());
$("#searchButton").on("click". renderHistory());

