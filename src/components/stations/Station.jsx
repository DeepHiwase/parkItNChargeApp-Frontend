import {
  AppBar,
  Avatar,
  Box,
  Container,
  Dialog,
  IconButton,
  Rating,
  Slide,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { useValue } from '../../context/ContextProvider'
import { forwardRef, useEffect, useState } from 'react'
import { Close, StarBorder } from '@mui/icons-material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, EffectCoverflow, Zoom } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-coverflow'
// import 'swiper/css/lazy'
import 'swiper/css/zoom'
import './swiper.css'

const Transition = forwardRef((props, ref) => {
  return <Slide direction='up' {...props} ref={ref} />
})

const Station = () => {
  const {
    state: { station },
    dispatch,
  } = useValue()

  const [place, setPlace] = useState(null)

  useEffect(() => {
    if (station) {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${
        station.lng
      },${station.lat}.json?access_token=${
        import.meta.env.VITE_REACT_APP_MAP_TOKEN
      }`
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setPlace(data.features[0])
        })
    }
  }, [station])

  const handleClose = () => {
    dispatch({ type: 'UPDATE_STATION', payload: null })
  }
  return (
    <Dialog
      fullScreen
      open={Boolean(station)}
      onClose={handleClose}
      slots={{ transition: Transition }}
    >
      <AppBar position='relative'>
        <Toolbar>
          <Typography variant='h6' component='h3' sx={{ ml: 2, flex: 1 }}>
            {station?.name}
          </Typography>
          <IconButton color='inherit' onClick={handleClose}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container sx={{ pt: 5 }}>
        <Swiper
          modules={[Navigation, Autoplay, EffectCoverflow, Zoom]}
          centeredSlides
          slidesPerView={2}
          grabCursor
          navigation
          autoplay
          lazy='true'
          zoom
          effect='coverflow'
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
        >
          {station?.images?.map((url, index) => (
            <SwiperSlide key={`image-${index}`}>
              <div className='swiper-zoom-container'>
                <img
                  src={url}
                  alt={`station-${index + 1}`}
                  style={{ width: '100%', objectFit: 'cover' }}
                />
              </div>
            </SwiperSlide>
          ))}
          <Tooltip
            title={station?.uName || ''}
            sx={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              zIndex: 2,
            }}
          >
            <Avatar src={station?.uPhoto} />
          </Tooltip>
        </Swiper>
        <Stack sx={{ p: 3 }} spacing={2}>
          <Stack
            direction='row'
            sx={{
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography variant='h6' component='span'>
                {'Price Per Unit:'}
              </Typography>
              <Typography component='span'>
                {station?.price === 10
                  ? 'Normal Charge Speed'
                  : '$' + station?.price}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant='h6' component='span'>
                {'Ratings:'}
              </Typography>
              <Rating
                name='station-rating'
                defaultValue={3.5}
                precision={0.5}
                emptyIcon={<StarBorder />}
              />
            </Box>
          </Stack>
          <Stack
            direction='row'
            sx={{
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography variant='h6' component='span'>
                {'Place Name:'}
              </Typography>
              <Typography component='span'>{place?.text}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant='h6' component='span'>
                {'Address:'}
              </Typography>
              <Typography component='span'>{place?.place_name}</Typography>
            </Box>
          </Stack>
          <Stack>
            <Typography variant='h6' component='span'>
              {'Details:'}
            </Typography>
            <Typography component='span'>{station?.description}</Typography>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  )
}

export default Station
