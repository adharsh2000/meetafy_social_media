import { Box, IconButton, InputBase } from "@mui/material";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import loadingGif from "../../Images/loading.gif";
import axios from "../../Axios/axiosInstance";
import Usercard from "../UserCard/UserCard";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching...");
    if (!search) return;

    setLoad(true);
    axios
      .get(`/api/user/search?username=${search}`)
      .then(({ data }) => {
        setUsers(data?.users);
        console.log(data?.users);
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  const handleClose = () => {
    setSearch("");
    setUsers([]);
  };

  return (
    <>
      <Box
        component="form"
        width="100%"
        onSubmit={handleSearch}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <InputBase
          placeholder="search..."
          sx={{ color: "black", width: "90%" }}
          onChange={(e) =>
            setSearch(e.target.value.toLowerCase().replace(/ /g, ""))
          }
          value={search}
        />
        {load ? (
          <img
            className="loading"
            src={loadingGif}
            alt="loading"
            style={{ width: "1.2rem" }}
          />
        ) : (
          <>
            {users.length > 0 ? (
              <IconButton aria-label="close" size="small">
                <Box component="span" color={"red"} onClick={handleClose}>
                  &times;
                </Box>
              </IconButton>
            ) : (
              <IconButton aria-label="search" type="submit" disabled={!search}>
                <SearchIcon />
              </IconButton>
            )}
          </>
        )}
        {search && (
          <Box
            sx={{
              width: "100%",
              maxWidth: 300,
              bgcolor: "background.paper",
              top: "100%",
              position:'absolute',
            //   backgroundColor:'red'
            }}
          >
            {users.map((user) => (
              <Usercard key={user._id} user={user} handleClose={handleClose}/>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default SearchBar;
