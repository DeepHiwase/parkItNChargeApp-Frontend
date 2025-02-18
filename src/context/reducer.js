const reducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_LOGIN':
      return { ...state, openLogin: true }
    case 'CLOSE_LOGIN':
      return { ...state, openLogin: false }

    case 'START_LOADING':
      return { ...state, loading: true }
    case 'STOP_LOADING':
      return { ...state, loading: false }

    case 'UPDATE_ALERT':
      return { ...state, alert: action.payload }

    case 'UPDATE_PROFILE':
      return { ...state, profile: action.payload }
    case 'UPDATE_USER':
      localStorage.setItem('currentUser', JSON.stringify(action.payload))
      return { ...state, currentUser: action.payload }

    case 'UPDATE_IMAGES':
      return { ...state, images: [...state.images, action.payload] }
    case 'DELETE_IMAGE':
      return {
        ...state,
        images: state.images.filter((image) => image !== action.payload),
      }

    case 'UPDATE_LOCATION':
      return { ...state, location: action.payload }

    case 'UPDATE_DETAILS':
      return { ...state, details: { ...state.details, ...action.payload } }

    case 'RESET_STATION':
      return {
        ...state,
        images: [],
        details: { title: '', description: '', price: 10 },
        location: { lng: 0, lat: 0 },
      }

    case 'UPDATE_STATIONS':
      return {
        ...state,
        stations: action.payload,
        addressFilter: null,
        priceFilter: 50,
        filteredStations: action.payload,
      }

    case 'FILTER_PRICE':
      return {
        ...state,
        priceFilter: action.payload,
        filteredStations: applyFilter(
          state.stations,
          state.addressFilter,
          action.payload
        ),
      }
    case 'FILTER_ADDRESS':
      return {
        ...state,
        addressFilter: action.payload,
        filteredStations: applyFilter(
          state.stations,
          action.payload,
          state.priceFilter
        ),
      }
    case 'CLEAR_ADDRESS':
      return {
        ...state,
        addressFilter: null,
        priceFilter: 50,
        filteredStations: state.stations,
      }

    case 'UPDATE_STATION':
      return { ...state, station: action.payload }

    default:
      throw new Error('No matched action!')
  }
}

export default reducer

const applyFilter = (stations, address, price) => {
  let filteredStations = stations
  if (address) {
    const { lng, lat } = address
    filteredStations = filteredStations.filter((station) => {
      const lngDifference =
        lng > station.lng ? lng - station.lng : station.lng - lng
      const latDifference =
        lat > station.lat ? lat - station.lat : station.lat - lat
      return lngDifference <= 1 && latDifference <= 1
    })
  }

  if (price < 50) {
    filteredStations = filteredStations.filter(
      (station) => station.price <= price
    )
  }

  return filteredStations
}
