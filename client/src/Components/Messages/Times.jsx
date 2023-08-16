import { Box } from '@mui/material'
import React from 'react'

const Times = ({total}) => {
    return (
        <Box>
            <Box component="span">
                {
                    (parseInt(total/3600)).toString().length < 2
                    ? '0' + (parseInt(total/3600))
                    : (parseInt(total/3600))
                }
            </Box>
            <Box component="span">:</Box>

            <Box component="span">
                {
                    (parseInt(total/60)).toString().length < 2
                    ? '0' + (parseInt(total/60))
                    : (parseInt(total/60))
                }
            </Box>
            <Box component="span">:</Box>

            <Box component="span">
                {
                    (total%60).toString().length < 2
                    ? '0' + (total%60) + 's'
                    : (total%60) + 's'
                }
            </Box>
        </Box>
    )
}

export default Times
