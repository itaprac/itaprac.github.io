const API_KEY = "f46522c872ccc2c177e42394632c95fd";

function iconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function createCard(time, item) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <p class="time">${time}</p>
    <img src="${iconUrl(item.weather[0].icon)}" alt="${item.weather[0].description}">
    <p class="temp">${Math.round(item.main.temp)}°C</p>
    <p>${item.weather[0].description}</p>
    <p>odczuwalna ${Math.round(item.main.feels_like)}°C</p>
  `;
  return card;
}

function getCurrent(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.addEventListener("load", () => {
    const data = JSON.parse(xhr.responseText);
    console.log("Current (XMLHttpRequest):", data);

    const current = document.getElementById("current");
    current.innerHTML = "";
    if (xhr.status !== 200) {
      current.textContent = `Błąd: ${data.message}`;
      return;
    }
    current.append(createCard(data.name, data));
  });
  xhr.send();
}

function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("Forecast (fetch):", data);

      const forecast = document.getElementById("forecast");
      forecast.innerHTML = "";
      if (data.cod !== "200") {
        forecast.textContent = `Błąd: ${data.message}`;
        return;
      }
      for (const item of data.list) {
        const time = new Date(item.dt * 1000).toLocaleString("pl-PL", {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
        forecast.append(createCard(time, item));
      }
    });
}

document.getElementById("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const city = document.getElementById("city").value.trim();
  if (city === "") {
    return;
  }
  getCurrent(city);
  getForecast(city);
});
