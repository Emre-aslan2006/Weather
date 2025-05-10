import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    const apiKey = "650c91b81d9dbe18ff5d98b3899e06ac";
    if (!city.trim()) {
      setError("Please enter a valid city name.");
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setWeather(null);
        setError(data.message || "City not found");
      }
    } catch (err) {
      console.error(err);
      setWeather(null);
      setError("Something went wrong. Please try again later.");
    }
  };

  const getBackground = () => {
    if (!weather || !weather.weather || !weather.weather[0]) return "";
    const condition = weather.weather[0].main.toLowerCase();
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;

    const backgrounds = {
      clear: isNight
        ? "url(https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80)"
        : "url(https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80)",
      clouds: "url(https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1600&q=80)",
      rain: "url(https://images.unsplash.com/photo-1527766833261-b09c3163a791?auto=format&fit=crop&w=1600&q=80)",
      snow: "url(https://images.unsplash.com/photo-1608889177794-42e7d88daac4?auto=format&fit=crop&w=1600&q=80)",
      thunderstorm: "url(https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80)",
      drizzle: "url(https://images.unsplash.com/photo-1518173946687-a4c8892bbd1d?auto=format&fit=crop&w=1600&q=80)",
      mist: "url(https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80)",
    };

    return backgrounds[condition] || "";
  };

  useEffect(() => {
    const bg = getBackground();
    if (bg) {
      document.body.style.backgroundImage = bg;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.transition = "background 0.5s ease";
    }
  }, [weather]);

  return (
    <div className="app">
      <h1>🌤️ Emre's Weather App</h1>
      <div className="search">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && weather.weather && weather.sys && (
        <div className="weather-card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p>{weather.weather[0].description}</p>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <img
              src={`https://flagcdn.com/64x48/${weather.sys.country.toLowerCase()}.png`}
              alt={`${weather.sys.country} flag`}
              style={{ borderRadius: "5px" }}
            />
          </div>

          <h3>{weather.main.temp}°C</h3>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}
