const apiKey = "f8a417b6d53e41c2b60153524242911";
const findButton = document.querySelector(".location-button");
const locationInput = document.querySelector(".location-input");
const title = document.querySelector("h1");

// Event listener for the "Find" button
findButton.addEventListener("click", () => {
    const city = locationInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert("Please enter a city name!");
    }
});

// Function to format time to AM/PM
function formatTime(localtime) {
    const hours = parseInt(localtime.split(" ")[1].split(":")[0]);
    const minutes = localtime.split(" ")[1].split(":")[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12; // Convert to 12-hour format
    return `${hour12}:${minutes} ${ampm}`;
}

// Function to fetch weather data for the specified city
function fetchWeather(city) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("City not found!");
            }
            return response.json();
        })
        .then((data) => {
            title.textContent = `${city} Weather Forecast`;
            // Update the weather cards with data
            updateCard("today", data.forecast.forecastday[0]);
            updateCard("next-day-1", data.forecast.forecastday[1]);
            updateCard("next-day-2", data.forecast.forecastday[2]);

            // Update the time in the "Today" card
            const timeElement = document.querySelector("#today .time");
            timeElement.textContent = `Current Time: ${formatTime(data.location.localtime)}`;
        })
        .catch((error) => {
            alert(error.message);
        });
}

// Function to update the weather cards
function updateCard(id, forecast) {
    const card = document.getElementById(id);
    const date = new Date(forecast.date); // Convert the date string to a Date object
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const temperature = forecast.day.avgtemp_c;
    const description = forecast.day.condition.text;
    const rain = forecast.day.daily_chance_of_rain;
    const wind = forecast.day.maxwind_kph;
    const icon = forecast.day.condition.icon;

    // Update date and general information
    card.querySelector(".date").textContent = `${dayOfWeek}, ${forecast.date}`;
    card.querySelector(".temperature").textContent = `${temperature}°C`;
    card.querySelector(".description").textContent = description;

    // Update rain text
    const rainElement = card.querySelector(".rain");
    rainElement.innerHTML = `<i class="fas fa-cloud-rain"></i> Rain: ${rain}%`; // Replace the entire HTML

    // Update wind text
    const windElement = card.querySelector(".wind");
    windElement.innerHTML = `<i class="fas fa-wind"></i> Wind: ${wind} km/h`; // Replace the entire HTML

    // Update the weather condition icon
    const imgElement = card.querySelector(".weather-icon");
    if (imgElement) {
        imgElement.src = `https:${icon}`;
        imgElement.alt = description;
    }
}
