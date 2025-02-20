import { Box, Typography, Rating, Divider, Chip } from '@mui/material';
import { formatDistance } from 'date-fns';

const FeedbackList = ({ feedback = [] }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        User Reviews ({feedback.length})
      </Typography>

      {feedback.map((review, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={review.rating} readOnly precision={0.5} />
            <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
              {formatDistance(new Date(review.createdAt), new Date(), { addSuffix: true })}
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 1 }}>
            {review.text}
          </Typography>

          <Chip 
            label={review.sentiment}
            color={
              review.sentiment === 'positive' ? 'success' : 
              review.sentiment === 'negative' ? 'error' : 
              'default'
            }
            size="small"
          />

          {index < feedback.length - 1 && (
            <Divider sx={{ my: 2 }} />
          )}
        </Box>
      ))}

      {feedback.length === 0 && (
        <Typography color="text.secondary">
          No reviews yet. Be the first to review this station!
        </Typography>
      )}
    </Box>
  );
};

export default FeedbackList;