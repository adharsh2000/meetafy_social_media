import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { MoreHoriz } from "@mui/icons-material";
import Skeleton from '@mui/material/Skeleton';
import { Box } from '@mui/material';

function Media() {

  return (
    <Card sx={{ width:'94%', m: 3,height:400 }}>
      <CardHeader
        avatar={
            <Skeleton animation="wave" variant="circular" width={40} height={40} />
        }
        action={
         (
            <IconButton aria-label="settings">
              <MoreHoriz />
            </IconButton>
          )
        }
        title={
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
        }
        subheader={
            <Skeleton animation="wave" height={10} width="40%" />
        }
      />
        <Skeleton sx={{ height: 250 }} animation="wave" variant="rectangular" />
      <CardContent>
          <React.Fragment>
            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
      </CardContent>
    </Card>
  );
}

export default function PostCard() {
  return (
    <Box>
      <Media />
      <Media />
    </Box>
  );
}