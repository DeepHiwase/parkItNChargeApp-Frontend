import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Avatar,
} from '@mui/material'
import { Close, Send } from '@mui/icons-material'
import { useValue } from '../../context/ContextProvider'
import { useRef } from 'react'
import userServices from '../../services/user.js'
const { updateProfile } = userServices

const Profile = () => {
  const {
    state: { profile, currentUser },
    dispatch,
  } = useValue()
  const nameRef = useRef()
  const handleClose = () => {
    dispatch({ type: 'UPDATE_PROFILE', payload: { ...profile, open: false } })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = nameRef.current.value
    updateProfile(currentUser, { name, file: profile.file }, dispatch)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const photoURL = URL.createObjectURL(file)
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: { ...profile, file, photoURL },
      })
    }
  }
  return (
    <Dialog open={profile.open} onClose={handleClose}>
      <DialogTitle>
        Profile
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
            You can update your profile by updating these fields:
          </DialogContentText>

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
            defaultValue={currentUser?.name}
          />
          <label htmlFor='profilePhoto'>
            <input
              accept='image/*'
              id='profilePhoto'
              type='file'
              style={{ display: 'none' }}
              onChange={handleChange}
            />
            <Avatar
              src={profile.photoURL}
              sx={{ width: 75, cursor: 'pointer' }}
            />
          </label>
        </DialogContent>
        <DialogActions sx={{ px: '19px' }}>
          <Button type='submit' varient='contained' endIcon={<Send />}>
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default Profile
