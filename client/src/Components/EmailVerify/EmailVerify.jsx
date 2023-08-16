import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from '../../Axios/axiosInstance'
import success from "../../Images/success.png";
import { Box, Button, styled } from "@mui/material";

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
  const param = useParams();

  useEffect(()=>{
      const verifyEmailUrl = async () => {
          try {
              const url = `/api/${param.id}/verify`;
              axios.get(url)
              .then((res=>{
                  console.log(res);
                  setValidUrl(true)
              }))
              .catch((err => {
                  console.log(err);
                  setValidUrl(false)
              }))
          } catch (error) {
              console.log(error);
              setValidUrl(false)
          }
      };
      verifyEmailUrl();
  },[param])

  // useEffect(() => {
  //     const verifyEmailUrl = async () => {
  //       try {
  //         if (mongoose.Types.ObjectId.isValid(param.id)) {
  //           const url = `http://localhost:4000/api/${param.id}/verify/${param.token}`;
  //           console.log(param.id);
  //           console.log(param.token);
  //           const {data} = await axios.get(url)
  //           console.log(data);
  //           setValidUrl(true)
  //         } else {
  //           console.log('Invalid ObjectId');
  //           setValidUrl(false);
  //         }
  //       } catch (error) {
  //         console.log(error);
  //         setValidUrl(false);
  //       }
  //     };

  //     verifyEmailUrl();
  //   }, [param]);

  const LoginButton = styled(Button)(({theme})=> ({
    backgroundColor: "black",
    color: "white",
    //do this for the login button
    
}))

  return (
    <Box
      display={"fles"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      height={"100vh"}
    >
      <>
        {validUrl ? (
          <Box>
            <Box display={"flex"} justifyContent={"center"}>
              <img src={success} alt="success_img" />
            </Box>
            <h1>Email verified successfully</h1>
            <Box display={"flex"} justifyContent={"center"}>
              <Link to="/login">
                <LoginButton>Login</LoginButton>
              </Link>
            </Box>
          </Box>
        ) : (
          <h1>404 Not Found</h1>
        )}
      </>
    </Box>
  );
};

export default EmailVerify;
