import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material'
import { Close, Send } from '@mui/icons-material'
import { useState, useRef, useEffect } from 'react'
import { useValue } from '../../context/ContextProvider'
import PasswordField from './PasswordField'
import GoogleOneTapLogin from './GoogleOneTapLogin'
import userService from '../../services/user.js'

const Login = () => {
  const {
    state: { openLogin },
    dispatch,
  } = useValue()
  const [title, setTitle] = useState('Login')
  const [isRegister, setIsRegister] = useState(false)
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()

  useEffect(() => {
    isRegister ? setTitle('Register') : setTitle('Login')
  }, [isRegister])

  const handleClose = () => {
    dispatch({ type: 'CLOSE_LOGIN' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const email = emailRef.current.value
    const password = passwordRef.current.value
    if (!isRegister) return userService.login({ email, password }, dispatch)
    const name = nameRef.current.value
    const confirmPassword = confirmPasswordRef.current.value
    if (password !== confirmPassword)
      return dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Passwords do not match',
        },
      })
    userService.register({ name, email, password }, dispatch)
  }

  return (
    <Dialog open={openLogin} onClose={handleClose}>
      <DialogTitle>
        {title}
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Please fill your information in the fields below:
          </DialogContentText>
          {isRegister && (
            <TextField
              margin='normal'
              label='Username'
              type='text'
              fullWidth
              required
              autoFocus
              variant='standard'
              id='username'
              inputRef={nameRef}
              slotProps={{
                htmlInput: { minLength: 2 },
              }}
            />
          )}
          <TextField
            autoFocus={!isRegister}
            margin='normal'
            label='Email'
            type='email'
            fullWidth
            required
            variant='standard'
            id='email'
            inputRef={emailRef}
          />
          <PasswordField {...{ passwordRef }} />
          {isRegister && (
            <PasswordField
              passwordRef={confirmPasswordRef}
              id='confirmPassword'
              label='Confirm Password'
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: '19px' }}>
          <Button type='submit' varient='contained' endIcon={<Send />}>
            Submit
          </Button>
        </DialogActions>
      </form>
      <DialogActions sx={{ justifyContent: 'left', p: '5px 24px' }}>
        {isRegister
          ? 'Do you have an account? Sign in now'
          : "Don't you have an account? Create one now"}
        <Button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Login' : 'Register'}
        </Button>
      </DialogActions>
      <DialogActions sx={{ justifyContent: 'center', py: '24px' }}>
        <GoogleOneTapLogin />
      </DialogActions>
    </Dialog>
  )
}

export default Login
