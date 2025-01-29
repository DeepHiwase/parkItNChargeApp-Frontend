import supabase from './supabase';

const uploadFileProgress = (file, subFolder, imageName, setProgress) => {
  return new Promise((resolve, reject) => {
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
        try {
          const url = await supabase.storage
            .from('parkitnchargeapp')
            .getPublicUrl(subFolder + '/' + imageName)
          resolve(url.publicUrl)
        } catch (error) {
          reject(error)
        }
      },
      (error) => {
        reject(error)
      }
    )
  })
}

export default uploadFileProgress