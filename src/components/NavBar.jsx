import {
  AppBar,
  Container,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Button,
} from '@mui/material'
import { Menu, Lock } from '@mui/icons-material'
import photoUrl from '../user1.jpeg'
import { useValue } from '../context/ContextProvider'
import UserIcons from './user/UserIcons'

const user = { name: 'test', photoUrl }

const NavBar = () => {
  const {
    state: { currentUser },
    dispatch,
  } = useValue()

  return (
    <AppBar>
      <Container maxWidth='lg'>
        <Toolbar disableGutters>
          <Box sx={{ mr: 1 }}>
            <IconButton size='large' color='inherit'>
              <Menu />
            </IconButton>
          </Box>
          <Typography
            variant='h6'
            component='h1'
            noWrap
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
          >
            You Are Welcome
          </Typography>
          <Typography
            variant='h6'
            component='h1'
            noWrap
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            YRW
          </Typography>
          {!currentUser ? (
            <Button
              color='inherit'
              startIcon={<Lock />}
              onClick={() => dispatch({ type: 'UPDATE_USER', payload: user })}
            >
              Login
            </Button>
          ) : (
            <UserIcons />
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default NavBar
