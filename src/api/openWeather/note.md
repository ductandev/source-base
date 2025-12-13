📍 Current Weather API (Bắt buộc)
GET https://api.openweathermap.org/data/2.5/weather
Data: Temperature, humidity, wind, pressure, visibility, feels like, weather condition
====================================================================================================
📅 5-Day Forecast API (Bắt buộc)
GET https://api.openweathermap.org/data/2.5/forecast
Data: Weekly forecast (Mon-Fri), hourly data
====================================================================================================
🌤️ Air Pollution API (Optional cho UV Index)
GET https://api.openweathermap.org/data/2.5/air_pollution
Data: UV Index, air quality
====================================================================================================
⚠️ Weather Alerts API (Cho Early Warning)
Cần dùng One Call API 3.0 (có thể tính phí)
GET https://api.openweathermap.org/data/3.0/onecall
====================================================================================================

const REFRESH_INTERVALS = {
CURRENT_WEATHER: 10 _ 60 _ 1000, // 10 phút (144 calls/day)
FORECAST: 30 _ 60 _ 1000, // 30 phút (48 calls/day)  
AIR_POLLUTION: 60 _ 60 _ 1000, // 60 phút (24 calls/day)
ALERTS: 30 _ 60 _ 1000, // 30 phút (48 calls/day)
};

// Total: ~264 calls/day (an toàn trong limit 1,000)


Recommendation:

Current weather: 10-15 phút
Forecast: 30 phút (data ít thay đổi)
Air pollution/UV: 1 giờ