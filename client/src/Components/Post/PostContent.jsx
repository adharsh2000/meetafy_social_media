import React, { useState } from "react";
import {
  Box,
  //  CardMedia,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
// import Box from '@mui/material/Box';
import MobileStepper from "@mui/material/MobileStepper";
// import Paper from '@mui/material/Paper';
// import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const PostContent = ({ post }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = post?.images.length;
  const [readMore, setReadMore] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  return (
    // <Box>
    //     <Typography gutterBottom variant="h8" component="p" px={2}>
    //       {post?.content}
    //     </Typography>
    //     <CardMedia
    //     component="img"
    //     // height="300"
    //     image={post?.images[0]?.url}
    //     alt="Paella dish"
    //   />
    // </Box>
    <Box>
      <Typography gutterBottom variant="h8" component="p" mx={2}>
        {post.content.length < 60
          ? post.content
          : readMore
          ? post.content + " "
          : post.content.slice(0, 60) + "....."}
          {
                    post.content.length > 60 &&
                    <Box component={'span'} display={'inline'}  onClick={() => setReadMore(!readMore)}
                      sx={{
                        cursor:'pointer',
                        color:'blue'
                      }}
                    >
                        {readMore ? 'show less' : 'show more'}
                    </Box>
          }
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center">
        <AutoPlaySwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          autoplay={false}
        >
          {post?.images?.map((step, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {Math.abs(activeStep - index) <= 2 ? (
                <Box
                  component="img"
                  sx={{
                    height: 400,
                    display: "block",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  src={step?.url}
                  alt={step?.url}
                />
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
      </Box>
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </Box>
  );
};

export default PostContent;
