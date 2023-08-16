// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Popper from '@mui/material/Popper';
// import { useState } from 'react';
// import "emoji-mart/css/emoji-mart.css";
// import { Picker } from 'emoji-mart';

// export default function PopperC() {
    
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleClick = (event) => {
//     setAnchorEl(anchorEl ? null : event.currentTarget);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? 'simple-popper' : undefined;
//   const [content, setContent] = useState("");

//   const addEmoji = (emoji) => {
//     const updatedDescription = content + emoji.native;
//     setContent(updatedDescription);
//   };

//   return (
//     <div>
//       <button aria-describedby={id} type="button" onClick={handleClick}>
//         Toggle Popper
//       </button>
//       <Popper id={id} open={open} anchorEl={anchorEl} placement='right-end'>
//         <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
//         <Picker
//           onSelect={addEmoji}
//         />
//         </Box>
//       </Popper>
//     </div>
//   );
// }




///

import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function BasicPopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Popover
      </Button>
      
<Popover 
  anchorOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'bottom',
    horizontal: 'center',
  }}
>
  The content of the Popover.
</Popover>

    </div>
  );
}