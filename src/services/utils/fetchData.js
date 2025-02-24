const fetchData = async (
  { url, method = 'POST', token = '', body = null },
  dispatch
) => {
  const headers = token
    ? { 'Content-Type': 'application/json', authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
  body = body ? { body: JSON.stringify(body) } : {}
  try {
    const response = await fetch(url, { method, headers, ...body })
    const data = await response.json()
    // if (!data.success) {
    //   if (response.status === 401)
    //     dispatch({ type: 'UPDATE_USER', payload: null })
    //   throw new Error(data.message)
    // }
    // console.log(data)
    // console.log(data.result)
    // return data.result

    // Check if the request is for login
    if (url.includes('/login')) {
      if (!data.success) {
        if (response.status === 401)
          dispatch({ type: 'UPDATE_USER', payload: null })
        throw new Error(data.message)
      }
      return data; // Return the token directly for login
    } else {
      if (!data.success) {
        if (response.status === 401)
          dispatch({ type: 'UPDATE_USER', payload: null })
        throw new Error(data.message)
      }
      return data.result; // Return result for other requests
    }
  } catch (error) {
    dispatch({
      type: 'UPDATE_ALERT',
      payload: { open: true, severity: 'error', message: error.message },
    })
    console.log(error)
    return null
  }
}

export default fetchData
