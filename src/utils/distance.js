import { distance } from '@turf/turf';

export const findNearbyStations = (userLocation, stations, maxDistance = 10) => {
  if (!userLocation || !stations.length) return [];
  
  return stations
    .map(station => {
      const dist = distance(
        [userLocation.lng, userLocation.lat],
        [parseFloat(station.lng), parseFloat(station.lat)],
        { units: 'kilometers' }
      );
      return { ...station, distance: dist };
    })
    .filter(station => station.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};