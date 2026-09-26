// ============================================
// WEATHER WIDGET — Sentra Mina Argo
// Data dari Open-Meteo API (gratis, no API key)
// ============================================

const WEATHER_LAT = -6.2856868;
const WEATHER_LON = 107.1629263;

const weatherMap = {
  0: { desc: "Cerah", icon: "fa-sun", color: "text-amber-400" },
  1: { desc: "Cerah Berawan", icon: "fa-cloud-sun", color: "text-amber-400" },
  2: { desc: "Berawan", icon: "fa-cloud-sun", color: "text-cyan-400" },
  3: { desc: "Mendung", icon: "fa-cloud", color: "text-cyan-400" },
  45: { desc: "Berkabut", icon: "fa-smog", color: "text-slate-400" },
  48: { desc: "Berkabut", icon: "fa-smog", color: "text-slate-400" },
  51: { desc: "Gerimis Ringan", icon: "fa-cloud-rain", color: "text-cyan-400" },
  53: { desc: "Gerimis", icon: "fa-cloud-rain", color: "text-cyan-400" },
  55: { desc: "Gerimis Lebat", icon: "fa-cloud-rain", color: "text-cyan-400" },
  61: { desc: "Hujan Ringan", icon: "fa-cloud-rain", color: "text-cyan-400" },
  63: { desc: "Hujan", icon: "fa-cloud-showers-heavy", color: "text-cyan-400" },
  65: { desc: "Hujan Lebat", icon: "fa-cloud-showers-heavy", color: "text-cyan-400" },
  71: { desc: "Salju Ringan", icon: "fa-snowflake", color: "text-slate-200" },
  73: { desc: "Salju", icon: "fa-snowflake", color: "text-slate-200" },
  80: { desc: "Hujan Lokal", icon: "fa-cloud-rain", color: "text-cyan-400" },
  81: { desc: "Hujan Lokal Lebat", icon: "fa-cloud-showers-heavy", color: "text-cyan-400" },
  95: { desc: "Badai Petir", icon: "fa-cloud-bolt", color: "text-amber-400" },
  96: { desc: "Badai Petir + Es", icon: "fa-cloud-bolt", color: "text-amber-400" },
  99: { desc: "Badai Petir Hebat", icon: "fa-cloud-bolt", color: "text-amber-400" },
};

async function loadWeather() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LAT}&longitude=${WEATHER_LON}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=Asia%2FJakarta`;
    const res = await fetch(url);
    const data = await res.json();

    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    const humidity = data.current.relative_humidity_2m;
    const wind = Math.round(data.current.wind_speed_10m);
    const weather = weatherMap[code] || { desc: "N/A", icon: "fa-cloud", color: "text-slate-400" };

    document.querySelectorAll(".weather-temp").forEach((el) => {
      el.textContent = `${temp}°C`;
    });

    document.querySelectorAll(".weather-desc").forEach((el) => {
      el.textContent = weather.desc;
    });

    document.querySelectorAll(".weather-icon").forEach((el) => {
      el.className = `weather-icon fa-solid ${weather.icon} ${weather.color}`;
    });

    document.querySelectorAll(".weather-detail").forEach((el) => {
      el.textContent = `💧 ${humidity}%  •  💨 ${wind} km/h`;
    });

    console.log(`✅ Cuaca loaded: ${temp}°C · ${weather.desc} · ${humidity}% · ${wind} km/h`);
  } catch (err) {
    console.error("❌ Gagal load cuaca:", err.message);

    document.querySelectorAll(".weather-temp").forEach((el) => {
      el.textContent = "--°C";
    });
    document.querySelectorAll(".weather-desc").forEach((el) => {
      el.textContent = "Cuaca tidak tersedia";
    });
  }
}

document.addEventListener("DOMContentLoaded", loadWeather);
setInterval(loadWeather, 15 * 60 * 1000);