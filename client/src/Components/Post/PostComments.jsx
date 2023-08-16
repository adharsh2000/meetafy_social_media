// import { Box } from "@mui/material";
// import React from "react";

// const PostComments = () => {
//   return (
//     <Box>
//       {showComments.map((comment, index) => (
//         <CommentDisplay
//           key={index}
//           comment={comment}
//           post={post}
//           replyCm={replyComments.filter((item) => item.reply === comment._id)}
//         />
//       ))}

//       {comments.length - next > 0 ? (
//         <div
//           className="p-2 border-top"
//           style={{ cursor: "pointer", color: "crimson" }}
//           onClick={() => setNext(next + 10)}
//         >
//           See more comments...
//         </div>
//       ) : (
//         comments.length > 2 && (
//           <div
//             className="p-2 border-top"
//             style={{ cursor: "pointer", color: "crimson" }}
//             onClick={() => setNext(2)}
//           >
//             Hide comments...
//           </div>
//         )
//       )}
//     </Box>
//   );
// };

// export default PostComments;
