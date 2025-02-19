import { CheckCircleOutline } from '@mui/icons-material'
import { Box, ImageListItem } from '@mui/material'
import { useEffect, useState, useCallback } from 'react'
import CircularProgressWithLabel from './CircularProgressWithLabel'
import { v4 as uuidv4 } from 'uuid'
import uploadFileProgress from '../../../../supabase/uploadFileProgress.js'
import { useValue } from '../../../../context/ContextProvider'

const ProgressItem = ({ file }) => {
  const [progress, setProgress] = useState(0)
  const [imageURL, setImageURL] = useState(null)
  const [uploadComplete, setUploadComplete] = useState(false)
  const {
    state: { currentUser },
    dispatch,
  } = useValue()

  const uploadImage = useCallback(async () => {
    const imageName = uuidv4() + '.' + file.name.split('.').pop()
    try {
      const url = await uploadFileProgress(
        file,
        `stations/${currentUser?.id}`,
        imageName,
        setProgress
      )

      dispatch({ type: 'UPDATE_IMAGES', payload: url })
      setProgress(100)
      setUploadComplete(true) // Mark upload as complete

      // Wait for 2 seconds to show the checkmark before hiding the image
      setTimeout(() => {
        setImageURL(null)
      }, 2000)
    } catch (error) {
      dispatch({
        type: 'UPDATE_ALERT',
        payload: { open: true, severity: 'error', message: error.message },
      })
      console.log(error)
    }
  }, [file, currentUser, dispatch])

  useEffect(() => {
    if (file) {
      setImageURL(URL.createObjectURL(file)) // Set image URL for preview
      uploadImage()
    }
  }, [file, uploadImage])

  return (
    imageURL && (
      <ImageListItem cols={1} rows={1}>
        <img src={imageURL} alt='gallery' loading='lazy' />
        <Box sx={backDrop}>
          {!uploadComplete ? (
            <CircularProgressWithLabel value={progress} />
          ) : (
            <CheckCircleOutline
              sx={{ width: 60, height: 60, color: 'lightgreen' }}
            />
          )}
        </Box>
      </ImageListItem>
    )
  )
}

export default ProgressItem

const backDrop = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0, .5)',
}
