import uploadFile from '../supabase/uploadFile'
import fetchData from './utils/fetchData'
import {v4 as uuidv4} from 'uuid'
const url = import.meta.env.VITE_REACT_APP_SERVER_URL + '/api/users'

const register = async (user, dispatch) => {
  dispatch({ type: 'START_LOADING' })

  const result = await fetchData(
    { url: url + '/register', body: user },
    dispatch
  )
  if (result) {
    dispatch({ type: 'UPDATE_USER', payload: result })
    dispatch({ type: 'CLOSE_LOGIN' })
    dispatch({
      type: 'UPDATE_ALERT',
      payload: {
        open: true,
        severity: 'success',
        message: 'Your account has been created successfully',
      },
    })
  }

  dispatch({ type: 'STOP_LOADING' })
}

const login = async (user, dispatch) => {
  dispatch({ type: 'START_LOADING' })

  const result = await fetchData({ url: url + '/login', body: user }, dispatch)
  if (result) {
    dispatch({ type: 'UPDATE_USER', payload: result })
    dispatch({ type: 'CLOSE_LOGIN' })
  }

  dispatch({ type: 'STOP_LOADING' })
}

const updateProfile = async (currentUser, updatedFields, dispatch) => {
  dispatch({ type: 'START_LOADING' })

  const { name, file} = updatedFields
  let body = {name}
  try {
    if (file) {
      const imageName = uuidv4() + '.' + file?.name?.split('.')?.pop()
      let photoURL;
      try {
        const publicUrl = await uploadFile(file, `profile/${currentUser?.id}/${imageName}`)
        if (!publicUrl) {
          throw new Error('Failed to get public URL after uploading the file.')
        }
        photoURL = publicUrl
      } catch (error) {
        console.error('Error uploading file:', error) }
      body = {...body, photoURL}
    }
    const result = await fetchData({ url: url + '/updateProfile', method: 'PATCH', body, token: currentUser.token }, dispatch)
    if (result) {
      dispatch({ type: 'UPDATE_USER', payload: {...currentUser, ...result} })
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'success',
          message: 'Your profile has been updated successfully',
        },
      })
      dispatch({ type: 'UPDATE_PROFILE', payload: {open: false, file: null, photoURL: result.photoURL} })
    }
  } catch (error) {
    dispatch({
      type: 'UPDATE_ALERT',
      payload: {
        open: true,
        severity: 'error',
        message: error.message,
      },
    })
    console.log(error)
  }

  dispatch({ type: 'STOP_LOADING' })
}

export default {
  register,
  login,
  updateProfile,
}
