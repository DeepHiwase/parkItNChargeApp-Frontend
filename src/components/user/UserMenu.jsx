import { Logout, Settings } from '@mui/icons-material'
import { ListItemIcon, Menu, MenuItem } from '@mui/material'
import { useValue } from '../../context/ContextProvider'
import useCheckToken from '../../hooks/useCheckToken'

const UserMenu = ({ anchorUserMenu, setAnchorUserMenu }) => {
  useCheckToken()
  const {
    dispatch,
    state: { currentUser },
  } = useValue()
  const handleCloseUserMenu = () => {
    setAnchorUserMenu(null)
  }

  const testAuthorization = async () => {
    const url = import.meta.env.VITE_REACT_APP_SERVER_URL + '/api/stations'
    console.log(url)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${currentUser.token}`,
        },
      })
      const data = await response.json()
      console.log(data)
      if (!data.success) {
        if (response.status === 401) {
          dispatch({ type: 'UPDATE_USER', payload: null })
        }
        throw new Error(data.message)
      }
    } catch (error) {
      dispatch({
        type: 'UPDATE_ALERT',
        payload: { message: error.message, severity: 'error' },
      })
      console.error(error)
    }
  }

  return (
    <Menu
      anchorEl={anchorUserMenu}
      open={Boolean(anchorUserMenu)}
      onClose={handleCloseUserMenu}
      onClick={handleCloseUserMenu}
    >
      <MenuItem onClick={testAuthorization}>
        <ListItemIcon>
          <Settings fontSize='small' />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem
        onClick={() => dispatch({ type: 'UPDATE_USER', payload: null })}
      >
        <ListItemIcon>
          <Logout fontSize='small' />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  )
}

export default UserMenu
