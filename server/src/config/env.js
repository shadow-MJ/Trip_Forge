import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'development-only-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  weatherBaseUrl: process.env.WEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
};
