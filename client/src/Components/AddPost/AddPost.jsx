import {
  Avatar,
  Backdrop,
  Button,
  ButtonGroup,
  Card,
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
  //   Fab,
  //   InputBase,
  Modal,
  Stack,
  styled,
  TextField,
  //   Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  //   Add as AddIcon,
  // DateRange,
  EmojiEmotions,
  Image,
  //   PersonAdd,
  // VideoCameraBack,
} from "@mui/icons-material";
import { Box } from "@mui/system";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
// import data from "@emoji-mart/data";
// import Picker from "@emoji-mart/react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { toast } from "react-toastify";
import axios from "../../Axios/axiosInstance";
import { imageUpload } from "../../utils/imageUploads";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { createPost, loadMorePosts, setOnEdit, setUpdatePost } from "../../redux/AllReducers/postSlice";
import { updateDetailedPost } from "../../redux/AllReducers/detailedPostSlice";

const SytledModal = styled(Modal)({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  overflow: "auto",
  marginTop: "1.5rem",
});

const UserBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
});

const MainCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shape.shadow,
}));

const Search = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: "0 10px",
  borderRadius: "10px",
  width: "100%",
  height: "2.6rem",
  display: "flex",
  alignItems: "center",
}));

const AddPost = () => {
  const user = useSelector((state) => state?.user);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [showemoji, setShowemoji] = useState(false);
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [showprogress, setShowprogress] = useState(false);
  const theme = useTheme();
  const backgroundColor = theme.palette.background.papper;
  const dispatch = useDispatch()
  const fileInputRef = useRef(null);
  const textFieldRef = useRef(null);
  const { posts } = useSelector((state) => state);
  const socket = useSelector((state) => state?.socket?.socket)

  useEffect(() => {
    const limit = 9;
    dispatch(loadMorePosts(limit));
  }, [posts?.page, dispatch]);

  const handleModalClose = () => {
    setOpen(false);
    dispatch(setOnEdit(false));
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const toggleEmojipicker = () => {
    setShowemoji(!showemoji);
  };

  const addEmoji = (emoji) => {
    const updatedDescription = description + emoji.native;
    setDescription(updatedDescription);
  };

  const handleChangeImages = (e) => {
    // console.log(e.target.files);
    const files = [...e.target.files];
    let err = "";
    let newImages = [];

    files.forEach((file) => {
      if (!file) return (err = "File does not exist.");

      if (file.size > 1024 * 1024 * 5) {
        return (err = "The image/video largest is 5mb.");
      }

      return newImages.push(file);
    });

    if (err) {
      setImageError(err);
      return;
    }
    setImages([...images, ...newImages]);
  };

  const handleDeleteImage = (index) => {
    const newArr = [...images]
    newArr.splice(index, 1)
    setImages(newArr)
  }

  useEffect(()=>{
    if(posts?.onEdit){
      setOpen(true);
      setDescription(posts?.currentPost?.content)
      setImages(posts?.currentPost?.images)
    }
  },[posts?.onEdit,posts?.currentPost])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(posts?.onEdit){
      // const formData = new FormData();
      let media =[];
      // const imgNewUrl = posts?.currentPost?.images.filter(img => !img.url);
      const imgNewUrl = images.filter(img => !img.url)
      const imgOldUrl = posts?.currentPost?.images.filter(img => img.url);

      if(posts?.currentPost?.content === description 
        && imgNewUrl?.length === 0
        && imgOldUrl?.length === posts?.currentPost?.images?.length
    ) return setOpen(false);;
    setOpen(false)
    setShowprogress(true)
    if(imgNewUrl?.length > 0) media = await imageUpload(imgNewUrl)
      
    axios.patch(`/api/post/${posts?.currentPost?._id}`, {
      content:description,
      images: [...imgOldUrl, ...media],
    })
    .then(({ data }) => {
      // const newData = {...data.post, user}
      dispatch(setUpdatePost(data.newPost));
      dispatch(updateDetailedPost(data.newPost));
      dispatch(setOnEdit(false))
      setDescription('')
      setImages([])
      setShowprogress(false)
      toast.success(data?.msg)
    })
    .catch(({ response }) => {
      // // console.log(response?.data?.msg);
      setShowprogress(false)
      dispatch(setOnEdit(false))
      toast.error(response?.data?.msg)
    });

    }else{
      let msg;
      if (!description) {
        toast.error("Please add the description!");
        return;
      }
      if (images.length === 0) {
        toast.error(imageError);
        return;
      }
      const formData = new FormData();
      formData.append("description", description);
      // console.log(images);
      let media = [];
      setOpen(false)
      setShowprogress(true)
      if (images.length > 0) media = await imageUpload(images);
      // console.log(media);
      const mediaString = JSON.stringify(media);
  
      formData.append("images", mediaString);
      formData.append("user", JSON.stringify(user));
  
      // const formDataObject = Object.fromEntries(formData.entries());
      // console.log(formDataObject);
      
      await axios
        .post("/api/post/createpost", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(({ data }) => {
          console.log(data);
          const newData = {...data.post, user}
          dispatch(createPost(newData))
          setDescription('')
          setImages([])
          setShowprogress(false)
          toast.success(data?.msg)
          msg = {
            id: data.post._id,
            text: 'added a new post.',
            recipients: data.post.user.followers,
            url: `/post/${data.post._id}`,
            content:data.post.content, 
            image: data.post.images[0].url,
            user:user,
          }
        })
        .catch(({ response }) => {
          // console.log(response?.data?.msg);
          setShowprogress(false)
          toast.error(response?.data?.msg)
        });

      await axios.post('/api/notify',msg)
      .then(({data})=>{
        console.log(data);
        socket.emit('createNotify', {
          ...data.notify,
          user:{
            username:user.username,
            profilePicture:user.profilePicture
          }
        })
      })
      .catch((err)=>console.log('Error in notifying followers'))
    }
    dispatch(setOnEdit(false))
  };

  return (
    <>
      <MainCard
        sx={{ margin: 3, backgroundColor: backgroundColor, padding: "0.5rem" }}
      >
        <Stack direction="row" spacing={2} onClick={(e) => setOpen(true)}>
          <Avatar alt="Remy Sharp" src={user?.profilePicture} />
          <Search>
            <Typography variant="overline" display="block" color={"grey"}>
              {user?.username} , What's on your mind?
            </Typography>
          </Search>
        </Stack>
      </MainCard>
      <SytledModal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width={400}
          height="auto"
          bgcolor={"background.paper"}
          color={"text.primary"}
          p={3}
          borderRadius={2}
          component={"form"}
          noValidate
          onSubmit={handleSubmit}
        >
          <Typography variant="h6" color="gray" textAlign="center">
            Create post
          </Typography>
          <UserBox>
            <Avatar src={user?.profilePicture} sx={{ width: 30, height: 30 }} />
            <Typography fontWeight={500} variant="span">
              {user?.username}
            </Typography>
          </UserBox>
          <TextField
            sx={{ width: "100%" }}
            id="standard-multiline-static"
            multiline
            rows={3}
            placeholder="What's on your mind?"
            variant="standard"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            inputRef={textFieldRef}
          />
          <Stack direction="row" gap={1} mt={2} mb={3}>
            <EmojiEmotions
              color="primary"
              onClick={toggleEmojipicker}
              sx={{ cursor: "pointer" }}
            />
            {showemoji && (
              <Picker
                onSelect={addEmoji}
                style={{ position: "absolute", top: "20%", right: "11%" }}
              />
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{
                display: "none",
              }}
              multiple
              accept="image/*,video/*"
              name="file"
              onChange={handleChangeImages}
            />
            <Image
              color="secondary"
              onClick={handleButtonClick}
              sx={{ cursor: "pointer" }}
            />
            {/* <VideoCameraBack color="success" /> */}
            {/* <PersonAdd color="error" /> */}
          </Stack>
          {images?.length > 0 && (
            <ImageList
              sx={{ width: 400, maxHeight: 350, overflow: "auto" }}
              cols={3}
              rowHeight={164}
            >
              {images?.map((item,index) => (
                <ImageListItem key={index}>
                  <IconButton
                    onClick={() => handleDeleteImage(index)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "red",
                    }}
                  >
                    <HighlightOffIcon />
                  </IconButton>
                  <img
                    src={item?.url ? item?.url : URL.createObjectURL(item)}
                    alt={item.name}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
          <ButtonGroup
            fullWidth
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button type="submit">Post</Button>
            {/* <Button sx={{ width: "100px" }}>
              <DateRange />
            </Button> */}
          </ButtonGroup>
        </Box>
      </SytledModal>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showprogress}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default AddPost;
