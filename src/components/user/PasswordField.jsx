import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';

// FIXME: PasswordField component eye icon is not working
const PasswordField = ({ passwordRef, id='password', label='Password' }) => {

  const [showPassword, setShowPassword] = useState(false)
  const handleClick = () => setShowPassword(!showPassword)
  const handleMouseDown = (e) => e.preventDefault()

  return (
    <TextField
      margin='normal'
      label={label}
      type={showPassword ? 'text' : 'password'}
      fullWidth
      required
      variant='standard'
      id={id}
      inputRef={passwordRef}
      slotProps={{
        htmlInput: { minLength: 6 },
        endAdorment: (
          <InputAdornment position='end'>
            <IconButton onClick={handleClick} onMouseDown={handleMouseDown}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
}

export default PasswordField
