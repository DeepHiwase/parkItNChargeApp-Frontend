import supabase from './supabase'

const uploadFile = async (file, filePath) => {
  try {
    const { error } = await supabase.storage
      .from('parkitnchargeapp')
      .upload(filePath, file)

    if (error) {
      throw error
    }

    const { data } = supabase.storage
      .from('parkitnchargeapp')
      .getPublicUrl(filePath)

    if (!data) {
      throw new Error('Failed to get public URL.')
    }
    console.log(data)
    return data.publicUrl
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export default uploadFile
