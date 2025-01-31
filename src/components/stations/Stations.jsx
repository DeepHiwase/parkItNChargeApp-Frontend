import {
  Avatar,
  Card,
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Rating,
  Tooltip,
} from '@mui/material'
import { useValue } from '../../context/ContextProvider'
import { StarBorder } from '@mui/icons-material'

const Stations = () => {
  const {
    state: { filteredStations },
  } = useValue()
  return (
    <Container>
      <ImageList
        gap={12}
        sx={{
          mb: 8,
          gridTemplateColumns:
            'repeat(auto-fill, minmax(280px, 1fr)) !important',
        }}
      >
        {filteredStations.map((station) => (
          <Card key={station._id}>
            <ImageListItem sx={{ height: '100% !important' }}>
              <ImageListItemBar
                sx={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.3)70%, rgba(0,0,0,0)100%',
                }}
                title={
                  station.price === 10
                    ? 'Cost-Efficient'
                    : '$' + station.price + 'Rapid Charger'
                }
                actionIcon={
                  <Tooltip
                    title={station.uName}
                    sx={{
                      mr: '5px',
                    }}
                  >
                    <Avatar src={station.uPhoto} />
                  </Tooltip>
                }
                position='top'
              />
              <img
                src={station.images[0]}
                alt={station.name}
                loading='lazy'
                style={{ cursor: 'pointer' }}
              />
              <ImageListItemBar
                title={station.name}
                actionIcon={
                  <Rating
                    sx={{ color: 'rgba(255, 255, 255, 0.8)', mr: '5px' }}
                    name='station-rating'
                    defaultValue={3.5}
                    precision={0.5}
                    emptyIcon={
                      <StarBorder sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                    }
                  />
                }
              />
            </ImageListItem>
          </Card>
        ))}
      </ImageList>
    </Container>
  )
}

export default Stations
