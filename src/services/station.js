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
    dispatch({ type: 'RESET_STATION'})
    setPage(0)
  }
  dispatch({ type: 'STOP_LOADING' })
}

export default createStation
