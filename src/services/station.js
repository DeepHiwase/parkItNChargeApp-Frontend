import fetchData from './utils/fetchData'

// const url = import.meta.env.VITE_REACT_APP_SERVER_URL + '/api/stations'
const url = '/api/stations'

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

const submitFeedback = async (stationId, feedbackData, token, dispatch) => {
  if (!token) {
    dispatch({
      type: 'UPDATE_ALERT',
      payload: {
        open: true,
        severity: 'error',
        message: 'Please login to submit feedback',
      },
    });
    return null;
  }

  dispatch({ type: 'START_LOADING' });
  
  const result = await fetchData({
    url: `${url}/${stationId}/feedback`,
    method: 'POST',
    body: feedbackData,
    token
  }, dispatch);

  if (result) {
    dispatch({
      type: 'UPDATE_STATION',
      payload: result
    });
  }
  
  dispatch({ type: 'STOP_LOADING' });
  return result;
};

export default {
  createStation,
  getStations,
  submitFeedback 
}
