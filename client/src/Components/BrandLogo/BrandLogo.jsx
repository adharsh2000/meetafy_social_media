import { Box } from '@mui/material'
import React from 'react'

const BrandLogo = ({color}) => {
  return (
    <Box>
      <img width={200} color={color} src='https://www.meetafy.dk/wp-content/uploads/2019/07/Meetafy-logo-2.png' alt='MEETAFY'
      style={{filter: 'invert(100%)'}}
      />
    </Box>
  )
}

export default BrandLogo
