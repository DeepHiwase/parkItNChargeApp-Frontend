import { useEffect, useState } from 'react'
import { useValue } from '../../context/ContextProvider'
import stationServices from '../../services/station.js'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import SuperCluster from 'supercluster'
import './cluster.css'
import { Avatar, Paper, Tooltip } from '@mui/material'
import GeocoderInput from '../sidebar/GeocoderInput.jsx'
import PopupStation from './PopupStation.jsx'

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
      <GeocoderInput />
      {popupInfo && (
        <Popup
          longitude={popupInfo.lng}
          latitude={popupInfo.lat}
          maxWidth='auto'
          closeOnClick={false}
          focusAfterOpen={false}
          onClose={() => setPopupInfo(null)}
        >
          <PopupStation {...{ popupInfo }} />
        </Popup>
      )}
    </ReactMapGL>
  )
}

export default ClusterMap
