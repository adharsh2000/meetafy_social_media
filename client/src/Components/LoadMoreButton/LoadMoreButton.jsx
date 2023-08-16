import { Box, Button } from '@mui/material'
import React from 'react'

const LoadMoreButton = ({result,page,load,handleLoadMore}) => {
  return (
    <Box >
      {
        result < 9 * (page - 1) ? '' :
        !load && <Button variant="contained" size="small" onClick={handleLoadMore}>
            Load More
        </Button>
      }
    </Box>
  )
}

export default LoadMoreButton
