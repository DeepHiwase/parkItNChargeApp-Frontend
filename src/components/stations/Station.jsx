import {
  AppBar,
  Container,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from '@mui/material'
import { useValue } from '../../context/ContextProvider'
import { forwardRef } from 'react'
import { Close } from '@mui/icons-material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, EffectCoverflow, Lazy, Zoom } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-coverflow'
import 'swiper/css/lazy'
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
          modules={[Navigation, Autoplay, EffectCoverflow, Lazy, Zoom]}
          centeredSlides
          slidesPerView={2}
          grabCursor
          navigation
          autoplay
          lazy
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
          {station?.images?.map((url) => (
            <SwiperSlide key={url}>
              <div className='swapper-zoom-container'>
                <img src={url} alt='station' />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Dialog>
  )
}

export default Station
