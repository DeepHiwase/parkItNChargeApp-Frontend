import supabase from './supabase';

const uploadFileProgress = (file, subFolder, imageName, setProgress) => {
  return new Promise((resolve, reject) => {
    console.log('Starting upload with:', { subFolder, imageName })
    const storageRef = supabase.storage
      .from('parkitnchargeapp')
      .upload(subFolder + '/' + imageName, file, {
        onProgress: (progress) => {
          const progressPercentage = (progress.loaded / progress.total) * 100
          setProgress(progressPercentage)
        },
      })

    storageRef.then(
      async (data) => {
        console.log('Upload result:', data)
        
        if (data.error) {
          console.error('Upload error:', data.error)
          reject(data.error)
          return
        }
        try {
          const { data, error } = await supabase.storage
            .from('parkitnchargeapp')
            .getPublicUrl(`${subFolder}/${imageName}`)

          if (error) {
            console.error('Error getting public URL:', error)
            reject(error)
            return
          }

          if (!data || !data.publicUrl) {
            const err = new Error('Failed to get public URL')
            console.error(err)
            reject(err)
            return
          }

          console.log('Successfully got public URL:', data.publicUrl)
          resolve(data.publicUrl)
        } catch (error) {
          console.error('Get URL error:', error)
          reject(error)
        }
      },
      (error) => {
        console.error('Storage error:', error)
        reject(error)
      }
    )
  })
}

export default uploadFileProgress