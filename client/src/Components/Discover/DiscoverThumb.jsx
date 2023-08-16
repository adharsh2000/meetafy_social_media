import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function DiscoverThumb({posts, result}) {
  return (
    <ImageList
      sx={{ width: '75%', height: 'auto' }}
      variant="quilted"
      cols={4}
      rowHeight={200}
    >
      {posts?.map((item, index) => (
        <ImageListItem key={item?.index} cols={item.cols || 1} rows={item.rows || 1}>
          <img
            {...srcset(item?.images[0].url, 121, item.rows, item.cols)}
            alt={item?.images}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

