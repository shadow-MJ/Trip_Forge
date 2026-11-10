import { useEffect, useState } from 'react';
import { getWeatherForDestination } from '../api/weatherApi';
import Card from './Card';
import { AlertCircleIcon, CloudIcon, RefreshIcon, SunIcon } from './Icons';
import Loader from './Loader';
import './WeatherCard.css';

export default function WeatherCard({ destination, readOnly = false }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forceFallback, setForceFallback] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function fetchWeather() {
      try {
        const data = await getWeatherForDestination(destination, {
          forceFallback,
        });
        if (!active) return;
        setWeather(data);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load weather forecast.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchWeather();
    return () => {
      active = false;
    };
  }, [destination, forceFallback, reloadKey]);

  function handleRefresh(nextFallback = forceFallback) {
    setLoading(true);
    setError('');
    setForceFallback(nextFallback);
    setReloadKey((k) => k + 1);
  }

  return (
    <Card
      title="Weather forecast"
      subtitle={destination || 'Destination forecast'}
      action={
        !readOnly && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleRefresh(forceFallback)}
            aria-label="Refresh weather"
          >
            <RefreshIcon size={14} />
            Refresh
          </button>
        )
      }
    >
      {loading ? (
        <Loader inline label="Checking weather forecast..." />
      ) : error ? (
        <div className="tf-weather__fallback" role="alert">
          <div className="tf-weather__fallback-head">
            <AlertCircleIcon size={18} />
            <div>
              <p className="tf-weather__fallback-title">Weather unavailable</p>
              <p className="tf-weather__fallback-text">{error}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleRefresh(false)}
          >
            Try again
          </button>
        </div>
      ) : !weather || !weather.available ? (
        <div className="tf-weather__fallback">
          <div className="tf-weather__fallback-head">
            <CloudIcon size={18} />
            <div>
              <p className="tf-weather__fallback-title">Forecast currently unavailable</p>
              <p className="tf-weather__fallback-text">
                {weather?.reason ||
                  'Weather details could not be retrieved right now. Pack layers and check again closer to departure.'}
              </p>
            </div>
          </div>
          {!readOnly && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleRefresh(false)}
            >
              Retry weather
            </button>
          )}
        </div>
      ) : (
        <div className="tf-weather">
          <div className="tf-weather__current">
            <div className="tf-weather__temp-group">
              <span className="tf-weather__sun-pill" aria-hidden="true">
                <SunIcon size={18} />
              </span>
              <span className="tf-weather__temp">{weather.temperatureC}°C</span>
              <div>
                <p className="tf-weather__condition">{weather.condition}</p>
                <p className="tf-weather__location">{weather.location}</p>
              </div>
            </div>
            <div className="tf-weather__metrics">
              <span>Feels like {weather.feelsLikeC}°C</span>
              <span>Rain {weather.rainChancePercent}%</span>
              <span>Wind {weather.windKmh} km/h</span>
              <span>Humidity {weather.humidityPercent}%</span>
            </div>
          </div>

          {weather.outlook?.length > 0 && (
            <div className="tf-weather__outlook">
              {weather.outlook.map((day) => (
                <div key={day.day} className="tf-weather__day">
                  <span className="tf-weather__day-name">{day.day}</span>
                  <span className="tf-weather__day-range">
                    {day.highC}° / {day.lowC}°
                  </span>
                  <span className="tf-weather__day-summary">{day.summary}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!readOnly && !loading && !error && weather && weather.available && (
        <div className="tf-weather__footer">
          <span className="tf-weather__footer-note">Weather preview data</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => handleRefresh(!forceFallback)}
          >
            Test fallback state
          </button>
        </div>
      )}
    </Card>
  );
}
