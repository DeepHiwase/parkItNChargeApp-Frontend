import supabase from './supabase'

const deleteFile = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('parkitnchargeapp')
      .remove([filePath])
    console.log('Deleted from Supabase')
    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

export default deleteFile
