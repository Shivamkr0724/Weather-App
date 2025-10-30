import React from "react";

const WeekWeather = ({ hourly, daily, sunrise, sunset }) => {
  // Calculate length of day
  const dayLength = (() => {
  if (!sunrise || !sunset) return "";

  // Helper function to convert "6:45 AM" → Date
  const parseTime = (timeStr) => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return null;

    let [_, hours, minutes, period] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (period) {
      period = period.toUpperCase();
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
    }

    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const sunriseDate = parseTime(sunrise);
  const sunsetDate = parseTime(sunset);
  if (!sunriseDate || !sunsetDate) return "";

  const diffMins = (sunsetDate - sunriseDate) / 60000;
  const hrs = Math.floor(diffMins / 60);
  const mins = Math.round(diffMins % 60);

  return `${hrs}h ${mins}m`;
})();


  return (
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#121625] rounded-3xl p-4 sm:p-6 shadow-lg text-white w-full">

  {/* ===== Left Section ===== */}
  <div className="md:col-span-2">
    <h2 className="text-base sm:text-lg font-semibold mb-3 opacity-80">
      Today / Week
    </h2>

    {/* Hourly Forecast */}
    <div className="flex items-center gap-3 bg-[#1a1f35] rounded-2xl p-3 overflow-x-auto w-full scrollbar-thin scrollbar-thumb-[#2a3152] lg:w-[520px]">
      {hourly.slice(0, 7).map((hour, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center bg-[#1f243b] rounded-2xl p-3 min-w-[60px] sm:min-w-[70px] md:min-w-[80px]"
        >
          <span className="text-xs sm:text-sm opacity-70">{hour.time}</span>
          <img src={hour.icon} alt="weather" className="w-6 h-6 sm:w-8 sm:h-8 my-2" />
          <span className="text-sm sm:text-base font-medium">{hour.temp}°</span>
        </div>
      ))}
    </div>

    {/* Tomorrow Card */}
    <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-[#1e233a] to-[#1b1f33] mt-4 rounded-2xl p-4 sm:p-5 w-full lg:w-[520px]">
      <div className="text-center sm:text-left">
        <h3 className="text-xs sm:text-sm opacity-70">Tomorrow</h3>
        <h2 className="text-base sm:text-lg font-semibold">{daily.description}</h2>
      </div>
      <div className="flex items-center gap-3 mt-3 sm:mt-0">
        <img src={daily.icon} alt="tomorrow weather" className="w-8 h-8 sm:w-10 sm:h-10" />
        <span className="text-xl sm:text-2xl font-bold">{daily.temp}°</span>
      </div>
    </div>
  </div>

  {/* ===== Right Section ===== */}
  <div className="flex flex-row md:flex-col justify-between bg-[#1a1f35] rounded-2xl p-4 sm:p-5 w-full md:max-w-[150px] lg:ml-17">
    <div className="flex-1 text-center md:text-left mb-2 md:mb-0">
      <h3 className="text-xs sm:text-sm opacity-70">Sunrise</h3>
      <p className="text-lg sm:text-2xl font-semibold">{sunrise}</p>
      <span className="text-xs opacity-70">AM</span>
    </div>

    <div className="flex-1 text-center md:text-left mb-2 md:mb-0">
      <h3 className="text-xs sm:text-sm opacity-70">Sunset</h3>
      <p className="text-lg sm:text-2xl font-semibold">{sunset}</p>
      <span className="text-xs opacity-70">PM</span>
    </div>

    <div className="flex-1 text-center md:text-left">
      <h3 className="text-xs sm:text-sm opacity-70">Length of day</h3>
      <p className="text-sm sm:text-lg font-semibold">{dayLength}</p>
    </div>
  </div>

</div>

  );
};

export default WeekWeather;
