import {
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material'
import { useValue } from '../../../context/ContextProvider'
import { Cancel } from '@mui/icons-material'
import { useEffect } from 'react'
import supabase from '../../../supabase/supabase'
import deleteFile from '../../../supabase/deleteFile'

const ImagesList = () => {
  const {
    state: { images, currentUser },
    dispatch,
  } = useValue()
  useEffect(() => {
    const fetchImages = async () => {
      if (currentUser?.id) {
        try {
          // List all files in the user's folder
          const { data, error } = await supabase.storage
            .from('parkitnchargeapp')
            .list(`stations/${currentUser.id}`)

          if (error) throw error

          // Get public URLs for all images and update context one by one
          data.forEach(async (file) => {
            const { data: urlData } = supabase.storage
              .from('parkitnchargeapp')
              .getPublicUrl(`stations/${currentUser.id}/${file.name}`)

            dispatch({
              type: 'UPDATE_IMAGES',
              payload: {
                url: urlData.publicUrl,
                name: file.name,
              },
            })
          })
        } catch (error) {
          console.error('Error fetching images:', error)
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Error fetching images',
            },
          })
        }
      }
    }

    fetchImages()
  }, [currentUser, dispatch])
  const handleDelete = async (image) => {

    if (!image || typeof image !== 'object' || !image.url) {
      console.error('Invalid image object:', image);
      return;
    }
    const imageUrl = image.url;
    dispatch({ type: 'DELETE_IMAGE', payload: image })
    const filePath = imageUrl?.split('/public/')[1]
    if (!filePath) {
      console.error('File path could not be extracted from the URL')
      return
    }
    // const imageName = image?.split(`${currentUser?.id}%2F`)[1]?.split('?')[0]
    try {
      // await deleteFile(`stations/${currentUser?.id}/${imageName}`)
      await deleteFile(filePath)
    } catch (error) {
      // console.log(error)
      console.error('Error deleting file:', error)
    }
  }
  return (
    <ImageList
      rowHeight={250}
      sx={{
        '&.MuiImageList-root': {
          gridTemplateColumns:
            'repeat(auto-fill, minmax(250px, 1fr))!important',
        },
      }}
    >
      {images.map((image, index) => (
        <ImageListItem key={index} cols={1} rows={1}>
          <img
            src={image ? image.url : image}
            alt='stations'
            loading='lazy'
            style={{ height: '100%' }}
          />
          <ImageListItemBar
            position='top'
            sx={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.3)70%, rgba(0,0,0,0)100%)',
            }}
            actionIcon={
              <IconButton
                sx={{ color: 'white' }}
                onClick={() => handleDelete(image)}
              >
                <Cancel />
              </IconButton>
            }
          ></ImageListItemBar>
        </ImageListItem>
      ))}
    </ImageList>
  )
}

export default ImagesList
