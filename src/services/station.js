import fetchData from './utils/fetchData'

const url = import.meta.env.VITE_REACT_APP_SERVER_URL + '/api/stations'

const createStation = async (station, currentUser, dispatch, setPage) => {
  dispatch({ type: 'START_LOADING' })
  const result = await fetchData(
    { url, body: station, token: currentUser?.token },
    dispatch
  )
  if (result) {
    dispatch({
      type: 'UPDATE_ALERT',
      payload: {
        open: true,
        severity: 'success',
        message: 'The station has been added successfully',
      },
    })
    dispatch({ type: 'RESET_STATION' })
    setPage(0)
    dispatch({ type: 'UPDATE_STATION', payload: result })
  }
  dispatch({ type: 'STOP_LOADING' })
}

const getStations = async (dispatch) => {
  const result = await fetchData({ url, method: 'GET' }, dispatch)
  if (result) {
    dispatch({ type: 'UPDATE_STATIONS', payload: result })
  }
}

export default {
  createStation,
  getStations,
}
