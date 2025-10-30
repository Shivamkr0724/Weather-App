import React from "react";

const TodayHighlight = ({ data, city }) => {
  if (!data) {
    return (
      <div className="bg-[#0A0E1B] text-white p-6 rounded-3xl shadow-lg max-w-[450px]">
        <h2 className="text-xl font-semibold mb-2">Today Highlight</h2>
        <p className="text-gray-400">Search a city to see highlights 🌍</p>
      </div>
    );
  }

  const {
    chanceOfRain = 0,
    uvIndex = 0,
    windSpeed = 0,
    humidity = 0,
  } = data;

  const cards = [
    {
      title: "Chance of Rain",
      value: `${chanceOfRain}%`,
      icon: "🌧️",
    },
    {
      title: "UV Index",
      value: uvIndex,
      icon: "☀️",
    },
    {
      title: "Wind Status",
      value: `${windSpeed} km/h`,
      icon: "🌬️",
    },
    {
      title: "Humidity",
      value: `${humidity}%`,
      icon: "💧",
    },
  ];

  return (
    <div className=" bg-[#0A0E1B] text-white p-5 rounded-3xl shadow-lg flex flex-col">
      {/* 🌍 City Name Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Today Highlights</h2>
        {city && (
          <p className="text-sm text-gray-400">
            {city}
          </p>
        )}
      </div>

      {/* 🧩 Highlight Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-gradient-to-b from-[#12182A] to-[#0A0E1B] rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform"
          >
            <p className="text-gray-300 text-sm">{card.title}</p>
            <div className="flex flex-col items-center mt-2 space-y-1">
              <span className="text-5xl">{card.icon}</span>
              <p className="text-2xl font-semibold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayHighlight;
