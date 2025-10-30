import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import sunny from "./assets/sunny.png";
import partlyCloudy from "./assets/partlyCloudy.png";
import cloudy from "./assets/cloudy.png";
import rain from "./assets/rain.png";
import drizzle from "./assets/drizzle.png";
import snow from "./assets/snow.png";
import thunder from "./assets/thunder.png";
import fog from "./assets/fog.png";
import TodayHighlight from "./components/TodayHighlight";
import WeekWeather from "./components/WeekWeather";
import moon from "./assets/moon.png"
import home from "/home.gif"




const getWeatherImage = (code) => {
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 6; // 🌙 between 7 PM and 6 AM

  if (code === 0) return isNight ? moon : sunny;
  if ([1, 2].includes(code)) return isNight ? moon : partlyCloudy;
  if (code === 3) return cloudy;
  if ([45, 48].includes(code)) return fog;
  if (code >= 51 && code <= 57) return drizzle;
  if (code >= 61 && code <= 67) return rain;
  if (code >= 71 && code <= 77) return snow;
  if (code >= 80 && code <= 82) return rain;
  if (code >= 95 && code <= 99) return thunder;
  return cloudy; // default fallback
};



const getWeatherText = (code) => {
  const map = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Foggy",
    51: "Light Drizzle",
    61: "Light Rain",
    71: "Snowy",
    80: "Rain Showers",
    95: "Thunderstorm",
  };
  return map[code] || "Unknown";
};


const App = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C"); // toggle unit (C or F)

  // Fetch weather by city
  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    try {
      setLoading(true);
      setError(null);

      // Step 1: get coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`
      );
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset,precipitation_probability_max,uv_index_max,relative_humidity_2m_max&timezone=auto`
);

      
      const weatherData = await weatherRes.json();

      // --- Process Hourly Forecast (next 7 hours) ---
const hourly = weatherData.hourly.time.slice(0, 7).map((time, i) => {
  const hour = new Date(time).getHours();
  return {
    time: `${hour}:00`,
    temp: Math.round(weatherData.hourly.temperature_2m[i]),
    icon: getWeatherImage(weatherData.hourly.weathercode[i]),
  };
});

// --- Tomorrow’s Data ---
const tomorrow = {
  description: getWeatherText(weatherData.daily.weathercode[1]),
  temp: Math.round(weatherData.daily.temperature_2m_max[1]),
  icon: getWeatherImage(weatherData.daily.weathercode[1]),
};

// --- Sunrise & Sunset (Today) ---
const sunrise = new Date(weatherData.daily.sunrise[0])
  .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const sunset = new Date(weatherData.daily.sunset[0])
  .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });



      const current = weatherData.current_weather;
      const daily = weatherData.daily;

      setWeather({
  ...current,
  name,
  country,
  daily,
  high: daily.temperature_2m_max[0],
  low: daily.temperature_2m_min[0],
  hourly,
  tomorrow,
  sunrise,
  sunset,
});
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 2) {
        fetchWeather(query);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [query]);

  // Celsius ↔ Fahrenheit conversion
  const convertTemp = (tempC) =>
    unit === "C" ? tempC : (tempC * 9) / 5 + 32;

  // Format day/date
  const formatDate = () => {
    const today = new Date();
    const options = { weekday: "long", day: "numeric", month: "short", year: "numeric" };
    return today.toLocaleDateString("en-US", options);
  };

    const data = {
     chanceOfRain: weather?.daily?.precipitation_probability_max?.[0] ?? 0,
     uvIndex: weather?.daily?.uv_index_max?.[0] ?? 0,
     windSpeed: weather?.windspeed ?? 0,
     humidity: weather?.daily?.relative_humidity_2m_max?.[0] ?? 0,
    };


  return (
       <div className="min-h-screen flex flex-col bg-[#0B0E17] text-white py-10 px-4">
  {/* 🔍 Search Bar */}
  <div className="flex justify-center">
    <div className="flex items-center w-full max-w-md bg-[#0B0E17] rounded-full px-4 py-2 shadow-md border border-gray-700">
      <FiSearch className="text-gray-400 text-xl mr-2" />
      <input
        type="text"
        placeholder="Search City...."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500"
      />
    </div>
  </div>
   {!weather && !loading ? (
        <div className="flex flex-col max-w-[130] items-center justify-center">
          <img
            src={home}
            alt="Loading weather..."
            className="w-130 h-65  mt-4"
          />
          <h1 className="text-center">Discover the weather around you — live, accurate, and beautiful.</h1>
          </div>)
              : null 
   }

  {/* ⚙️ Loader/Error */}
  {loading && <p className="text-gray-400 mt-6 text-center">Fetching weather...</p>}
  {error && <p className="text-red-400 mt-6 text-center">{error}</p>}

  {/* 🌤 Main Weather Grid */}
  {weather && !loading && (
    <div className="mt-10 w-full max-w-[1000px] mx-auto space-y-8">
  {/* 🌤️ Row 1: Weather Card + Today Highlight */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* 🌡️ Weather Card */}
    <div className="bg-[#121625] rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center shadow-xl">
      {/* Left Info */}
      <div className="flex flex-col items-start space-y-4">
        <div className="flex items-center bg-purple-600 px-4 py-1 rounded-full text-sm">
          <MdLocationOn className="mr-2" /> {weather.name}, {weather.country}
        </div>

        <h2 className="text-3xl font-semibold">{formatDate().split(",")[0]}</h2>
        <p className="text-gray-400">{formatDate().replace(/^[^,]+, /, "")}</p>

        <div className="flex items-center space-x-2">
          <p className="text-6xl font-bold">
            {Math.round(convertTemp(weather.temperature))}°{unit}
          </p>
        </div>

        <p className="text-gray-400">
          High: {Math.round(convertTemp(weather.high))}° Low:{" "}
          {Math.round(convertTemp(weather.low))}°
        </p>
      </div>

      {/* Right Icon + Unit Toggle */}
      <div className="flex flex-col h-full items-center space-y-3 mt-6 md:mt-0">
        <div className="flex items-center bg-[#0B0E17] rounded-full p-1 w-20 justify-between">
          <button
            onClick={() => setUnit("F")}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              unit === "F" ? "bg-[#121625] text-white" : "text-gray-400"
            }`}
          >
            F
          </button>
          <button
            onClick={() => setUnit("C")}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              unit === "C" ? "bg-[#121625] text-white" : "text-gray-400"
            }`}
          >
            C
          </button>
        </div>

        <img
          src={getWeatherImage(weather.weathercode)}
          alt="weather"
          className="w-32 h-32 object-contain"
        />

        <p className="text-xl font-medium">{getWeatherText(weather.weathercode)}</p>
        <p className="text-gray-400">
          Feels like {Math.round(convertTemp(weather.temperature))}°
        </p>
      </div>
    </div>

    {/* 🌟 Today’s Highlight */}
    <div className="bg-[#121625] rounded-3xl p-8 shadow-xl flex justify-center">
      <TodayHighlight data={data} city={`${weather.name}, ${weather.country}`} />
    </div>
  </div>

  {/* 🔲 Row 2: Combined Feature Section */}
  <div className=" h-60 max-w-[750px]  mt-20 mb-10 rounded-3xl shadow-xl flex items-center justify-center text-gray-500">
      <WeekWeather
  hourly={weather.hourly}
  daily={weather.tomorrow}
  sunrise={weather.sunrise}
  sunset={weather.sunset}
/>

  </div>
</div>

  )}
</div>

  );
};

export default App;
