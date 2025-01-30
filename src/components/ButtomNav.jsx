import { LocationOn, AddLocationAlt } from '@mui/icons-material'
import EvStationIcon from '@mui/icons-material/EvStation';
import {
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import ClusterMap from './map/ClusterMap';
import Stations from './stations/Stations';
import AddStation from './addStation/AddStation';
import Protected from './protected/Protected';

const ButtonNav = () => {
  const [value, setValue] = useState(0)
  const ref = useRef()
  useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0
  }, [value])
  return (
    <Box ref={ref}>
      {{
        0: <ClusterMap />,
        1: <Stations />,
        2: <Protected><AddStation setPage={setValue} /></Protected>,
      }[value]}
      <Paper
        elevation={3}
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue)
          }}
        >
          <BottomNavigationAction label='Map' icon={<LocationOn />} />
          <BottomNavigationAction label='Stations' icon={<EvStationIcon />} />
          <BottomNavigationAction label='Add' icon={<AddLocationAlt />} />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}

export default ButtonNav
