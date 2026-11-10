import apiClient, { cloneData, simulateNetworkDelay } from './client';
import { mockWeatherByDestination } from './mockDb';

export async function getWeatherForDestination(destination, { forceFallback = false } = {}) {
  // TODO: Replace mock forecast with real REST endpoint / Weather API proxy:
  // const response = await apiClient.get('/weather', { params: { destination } });
  // return response.data;
  void apiClient;
  await simulateNetworkDelay(240);

  if (forceFallback) {
    return {
      available: false,
      reason: 'Weather service could not be reached. Showing fallback guidance.',
    };
  }

  const exact = mockWeatherByDestination[destination];
  if (exact) {
    return cloneData(exact);
  }

  // Newly created custom destinations also degrade cleanly to the fallback state
  // or return a calm unavailable response until real Weather API integration is added.
  return {
    available: false,
    reason: `Live forecast data for "${destination || 'this destination'}" will appear once the weather API is connected.`,
  };
}

