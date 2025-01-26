import { Google } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { useValue } from '../../context/ContextProvider'
import { jwtDecode } from 'jwt-decode'

const GoogleOneTapLogin = () => {
  const { dispatch } = useValue()
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    const initializeGoogleOneTap = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleResponse,
          prompt_parent_id: 'google-one-tap'
        })
        window.google.accounts.id.prompt()
      } catch (error) {
        console.error('Error initializing Google One Tap:', error)
      }
    }

    initializeGoogleOneTap()
  }, [])

  const handleResponse = (response) => {
    const token = response.credential
    const decodedToken = jwtDecode(token)
    const { sub: id, email, name, picture: photoURL } = decodedToken
    dispatch({
      type: 'UPDATE_USER',
      payload: { id, email, name, photoURL, token, google: true },
    })
    dispatch({ type: 'CLOSE_LOGIN' })
  }

  const handleGoogleLogin = () => {
    setDisabled(true)
    try {
      window.google.accounts.id.prompt()
    } catch (error) {
      console.error('Error prompting Google One Tap:', error)
    }
  }

  return (
    <div id="google-one-tap">
      <Button
        variant="contained"
        color="primary"
        startIcon={<Google />}
        onClick={handleGoogleLogin}
        disabled={disabled}
      >
        Login with Google
      </Button>
    </div>
  )
}

export default GoogleOneTapLogin