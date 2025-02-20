import { useState } from 'react';
import { Box, TextField, Button, Rating, Typography } from '@mui/material';
import { useValue } from '../../../context/ContextProvider';
import stationServices from '../../../services/station'

const AddFeedback = ({ stationId }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const { dispatch, state: { currentUser} } = useValue();

  const handleSubmit = async () => {
    if (!currentUser?.token) {
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Please login to submit feedback',
        },
      });
      return;
    }
    if (!feedback || !rating) {
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Please provide both rating and feedback',
        },
      });
      return;
    }

    console.log('Submitting feedback:', { stationId, feedback, rating });
    try {
      const result = await stationServices.submitFeedback(
        stationId, 
        { text: feedback, rating },
        currentUser.token,
        dispatch
      );
      
      if (result) {
        setFeedback('');
        setRating(0);
      }

    } catch (error) {
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: error.message,
        },
      });
    } finally {
      dispatch({ type: 'STOP_LOADING' });
    }
  };

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Rate Your Experience
      </Typography>
      
      <Rating
        value={rating}
        onChange={(_, newValue) => setRating(newValue)}
        precision={0.5}
        size="large"
        sx={{ mb: 2 }}
      />
      
      <TextField
        fullWidth
        multiline
        rows={3}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Share your experience with this charging station..."
        sx={{ mb: 2 }}
      />
      
      <Button 
        variant="contained" 
        onClick={handleSubmit}
        disabled={!feedback || !rating}
      >
        Submit Review
      </Button>
    </Box>
  );
};

export default AddFeedback;