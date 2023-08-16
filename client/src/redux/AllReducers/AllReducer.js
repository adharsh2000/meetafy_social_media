import { combineReducers } from "redux";
import authReducer from "./authReducer";
import loadingReducer from "./loadingReducer";
import errorSlice from "./errorSlice";
import userSlice from "./userSlice";
import themeSlice from "./themeSlice";
import postSlice from "./postSlice";
import profileSlice from "./profileSlice";
import detailedPostSlice from "./detailedPostSlice";
import discoverSlice from "./discoverSlice";
import suggestionSlice from "./suggestionSlice";
import socketSlice from "./socketSlice";
import notifySlice from "./notifySlice";
import messageSlice from "./messageSlice";
import onlineSlice from "./onlineSlice";
import callSlice from "./callSlice";
import peerSlice from "./peerSlice";

const AllReducers = combineReducers({
    auth:authReducer,
    load:loadingReducer,
    error:errorSlice,
    user:userSlice,
    appearance:themeSlice,
    posts:postSlice,
    profile:profileSlice,
    detailedPost:detailedPostSlice,
    discover:discoverSlice,
    suggestions:suggestionSlice,
    socket:socketSlice,
    notify:notifySlice,
    message:messageSlice,
    online:onlineSlice,
    call:callSlice,
    peer:peerSlice,
})

export default AllReducers;