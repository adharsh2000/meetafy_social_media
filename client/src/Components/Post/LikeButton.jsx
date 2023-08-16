import { IconButton } from '@mui/material';
import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const LikeButton = ({ isLike, handleLike, handleUnLike,fontSize }) => {
  return (
    <>
      {isLike ? (
        <IconButton aria-label="add to favorites" onClick={handleUnLike}>
          <FavoriteIcon color="error" sx={{
            fontSize: fontSize || 'inherit',
          }}/>
        </IconButton>
      ) : (
        <IconButton aria-label="add to favorites" onClick={handleLike}>
          <FavoriteBorderIcon sx={{
            fontSize: fontSize || 'inherit',
          }}/>
        </IconButton>
      )}
    </>
  );
};

export default LikeButton;
