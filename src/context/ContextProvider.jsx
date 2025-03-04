import { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import reducer from './reducer'

const initialState = {
  currentUser: null,
  openLogin: false,
  alert: { open: false, severity: 'info', message: '' },
  loading: false,
  profile: { open: false, file: null, photoURL: '' },
  images: [],
  location: { lng: 0, lat: 0 },
  details: { name: '', description: '', price: 10 },
  stations: [],
  priceFilter: 50,
  addressFilter: null,
  filteredStations: [],
  station: null,
}

const Context = createContext(initialState)

export const useValue = () => {
  return useContext(Context)
}

const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const mapRef = useRef()
  const containerRef = useRef()
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (currentUser) {
      dispatch({ type: 'UPDATE_USER', payload: currentUser })
    }
  }, [])
  return (
    <Context.Provider value={{ state, dispatch, mapRef, containerRef }}>
      {children}
    </Context.Provider>
  )
}

export default ContextProvider
