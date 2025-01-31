import { useEffect } from 'react'
import { useValue } from '../../context/ContextProvider'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'

const ctrl = new MapboxGeocoder({
  marker: false,
  accessToken: import.meta.env.VITE_REACT_APP_MAP_TOKEN,
})

const GeocoderInput = () => {
  const { mapRef, containerRef, dispatch } = useValue()
  useEffect(() => {
    if (containerRef?.current?.children[0]) {
      containerRef.current.removeChild(containerRef.current.children[0])
    }
    containerRef.current.appendChild(ctrl.onAdd(mapRef.current.getMap()))

    ctrl.on('result', (e) => {
      const coords = e.result.geometry.coordinates
      dispatch({
        type: 'FILTER_ADDRESS',
        payload: { lng: coords[0], lat: coords[1] },
      })
    })

    ctrl.on('clear', () => dispatch({ type: 'CLEAR_ADDRESS' }))
  }, [])
  return null
}

export default GeocoderInput
