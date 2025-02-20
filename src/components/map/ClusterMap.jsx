import { useEffect, useState } from 'react'
import { useValue } from '../../context/ContextProvider'
import stationServices from '../../services/station.js'
import ReactMapGL, { Marker, Popup, Source, Layer, GeolocateControl, NavigationControl } from 'react-map-gl'
import { findNearbyStations } from '../../utils/distance.js'
import SuperCluster from 'supercluster'
import './cluster.css'
import { Avatar, Paper, Tooltip } from '@mui/material'
import GeocoderInput from '../sidebar/GeocoderInput.jsx'
import PopupStation from './PopupStation.jsx'
import mapboxgl from 'mapbox-gl';

const supercluster = new SuperCluster({
  radius: 75,
  maxZoom: 20,
})

const ClusterMap = () => {
  const {
    state: { filteredStations },
    dispatch,
    mapRef,
  } = useValue()
  const [points, setPoints] = useState([])
  const [clusters, setClusters] = useState([])
  const [bounds, setBounds] = useState([-180, -85, 180, 85])
  const [zoom, setZoom] = useState(0)
  const [popupInfo, setPopupInfo] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [routeData, setRouteData] = useState(null)
  const [nearbyStations, setNearbyStations] = useState([])

  useEffect(() => {
    stationServices.getStations(dispatch)
  }, [])
  useEffect(() => {
    const points = filteredStations.map((station) => ({
      type: 'Feature',
      properties: {
        cluster: false,
        stationId: station._id,
        price: station.price,
        name: station.name,
        description: station.description,
        lng: station.lng,
        lat: station.lat,
        images: station.images,
        uPhoto: station.uPhoto,
        uName: station.uName,
      },
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(station.lng), parseFloat(station.lat)],
      },
    }))
    setPoints(points)
  }, [filteredStations])

  useEffect(() => {
    supercluster.load(points)
    setClusters(supercluster.getClusters(bounds, zoom))
  }, [points, zoom, bounds])

  useEffect(() => {
    if (mapRef.current) {
      setBounds(mapRef.current.getMap().getBounds().toArray().flat())
    }
  }, [mapRef?.current])


  const getRoute = async (station) => {
    if (!userLocation) {
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'warning',
          message: 'Please enable location first using the top-left button',
        },
      });
      return;
    }
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.lng},${userLocation.lat};${station.lng},${station.lat}?steps=true&geometries=geojson&access_token=${import.meta.env.VITE_REACT_APP_MAP_TOKEN}`
      );
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        setRouteData({
          type: 'Feature',
          properties: {},
          geometry: data.routes[0].geometry
        });
  
        // Create bounds
        const coordinates = data.routes[0].geometry.coordinates;
        const bounds = coordinates.reduce((bounds, coord) => {
          return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
  
        // Fit map to route
        mapRef.current?.getMap().fitBounds(bounds, {
          padding: 100,
          duration: 1000
        });
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Error getting route. Please try again.',
        },
      });
    }
  };

  useEffect(() => {
    if (userLocation && filteredStations.length) {
      const nearby = findNearbyStations(userLocation, filteredStations);
      setNearbyStations(nearby);
    }
  }, [userLocation, filteredStations]);

  return (
    <ReactMapGL
      initialViewState={{
        longitude: 77.7523,
        latitude: 20.932,
      }}
      mapboxAccessToken={import.meta.env.VITE_REACT_APP_MAP_TOKEN}
      mapStyle='mapbox://styles/mapbox/streets-v11'
      style={{ width: '100%', height: '100vh' }}
      ref={mapRef}
      onZoomEnd={(e) => setZoom(Math.round(e.viewState.zoom))}
    >
      {clusters.map((cluster) => {
        const { cluster: isCluster, point_count } = cluster.properties
        const [longitude, latitude] = cluster.geometry.coordinates
        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              longitude={longitude}
              latitude={latitude}
            >
              <div
                className='cluster-marker'
                style={{
                  width: `${10 + (point_count / points.length) * 20}px`,
                  height: `${10 + (point_count / points.length) * 20}px`,
                }}
                onClick={() => {
                  const zoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  )
                  mapRef.current.flyTo({
                    center: [longitude, latitude],
                    zoom,
                    speed: 1,
                  })
                }}
              >
                {point_count}
              </div>
            </Marker>
          )
        }

        return (
          <Marker
            key={`station-${cluster.properties.stationId}`}
            longitude={longitude}
            latitude={latitude}
          >
            <Tooltip title={cluster.properties.uName}>
              <Avatar
                src={cluster.properties.uPhoto}
                component={Paper}
                elevation={2}
                onClick={() => setPopupInfo(cluster.properties)}
              />
            </Tooltip>
          </Marker>
        )
      })}
      <GeolocateControl
        position="top-left"
        trackUserLocation
        onGeolocate={(e) => {
          setUserLocation({
            lng: e.coords.longitude,
            lat: e.coords.latitude
          });
        }}
      />
      <NavigationControl position="bottom-right" />

      {routeData && (
        <Source id="route" type="geojson" data={routeData}>
          <Layer
            id="route"
            type="line"
            layout={{
              "line-join": "round",
              "line-cap": "round"
            }}
            paint={{
              "line-color": "#3887be",
              "line-width": 5,
              "line-opacity": 0.75
            }}
          />
        </Source>
      )}
      {popupInfo && (
        <Popup
          longitude={popupInfo.lng}
          latitude={popupInfo.lat}
          maxWidth='auto'
          closeOnClick={false}
          focusAfterOpen={false}
          offset={25}
          onClose={() => {
            setPopupInfo(null);
            setRouteData(null);
          }}
        >
          <PopupStation {...{ popupInfo }} />
          <button 
            className="view-route-btn"
            onClick={() => getRoute(popupInfo)}
            style={{ marginTop: '10px' }}
          >
            Get Directions
          </button>
        </Popup>
      )}
    </ReactMapGL>
  )
}

export default ClusterMap
