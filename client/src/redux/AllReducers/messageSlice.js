// import { createSlice } from '@reduxjs/toolkit';
// // import {EditData} from "../../utils/helper"

// const initialState = {
//     users: [],
//     resultUsers: 0,
//     data: [],
//     firstLoad: false,
//     result: 0,
//     page: 2
// }

// const messageSlice = createSlice({
//     name: 'message',
//     initialState,
//     reducers: {
//         addUser: (state, action) => {
//             if (state.users.every(item => item._id !== action.payload._id)) {
//                 state.users.unshift(action.payload);
//             }
//         },
//         addMessage: (state, action) => {
//             const { recipient, sender, text, media, call } = action.payload;
//             // state.data.forEach(item => {
//             //     if (item._id === recipient || item._id === sender) {
//             //         item.messages.push({ text, media, call });
//             //         item.result += 1;
//             //     }
//             // });
//             state.data = [...state.data, action.payload]

//             // Find the index of the chat user in state.data
//             // const chatIndex = state.data.findIndex(
//             //     (item) => item._id === recipient || item._id === sender
//             // );

//             // if (chatIndex !== -1) {
//             //     // If the chat user is found, update their messages
//             //     state.data[chatIndex].messages.push({ text, media, call });
//             //     state.data[chatIndex].result += 1;
//             // } else {
//             //     // If the chat user is not found, add them to state.data
//             //     state.data.push({
//             //         _id: recipient || sender,
//             //         messages: [{ text, media, call }],
//             //         result: 1,
//             //     });
//             // }

//             state.users.forEach(user => {
//                 if (user._id === recipient || user._id === sender) {
//                     user.text = text;
//                     user.media = media;
//                     user.call = call;
//                 }
//             });
//         },
//         getConversations: (state, action) => {
//             // state.users = action.payload.newArr;
//             // state.resultUsers = action.payload.result;
//             // state.firstLoad = true;
//             return {
//                 ...state,
//                 users: action.payload.newArr,
//                 resultUsers: action.payload.result,
//                 firstLoad: true,
//             };
//         },
//         getMessages: (state, action) => {
//             // state.data.push(action.payload);
//             // state.data.push(...action.payload);

//             // Create a new array with unique messages
//             const newMessages = Array.isArray(action.payload)
//                 ? action.payload.filter((message) => {
//                     // Filter messages that have a unique ID not already present in state.data
//                     return !state.data.some((existingMessage) => existingMessage?._id === message?._id);
//                 })
//                 : [];

//             // Replace the existing messages in state.data with the newMessages array
//             state.data = newMessages;

//             // Return the updated state
//             return state;
//         },
//         updateMessages: (state, action) => {
//             state.data = state.data.map(item =>
//                 item._id === action.payload._id ? action.payload : item
//             );
//         },
//         deleteMessages: (state, action) => {
//             state.data = state.data.map(item =>
//                 item._id === action.payload._id ? { ...item, messages: action.payload.newData } : item
//             );
//         },
//         deleteConversation: (state, action) => {
//             state.users = state.users.filter(user => user._id !== action.payload);
//             state.data = state.data.filter(item => item._id !== action.payload);
//         },
//         checkOnlineOffline: (state, action) => {
//             state.users = state.users.map(user =>
//                 action.payload.includes(user._id) ? { ...user, online: true } : { ...user, online: false }
//             );
//         },
//     },
// });


// export default messageSlice.reducer;
// export const { addUser, addMessage, getConversations, getMessages, updateMessages, deleteMessages, deleteConversation, checkOnlineOffline } = messageSlice.actions;



import { createSlice } from '@reduxjs/toolkit';
import { DeleteData, EditData } from '../../utils/helper';

const initialState = {
    users: [],
    resultUsers: 0,
    data: [],
    // resultData: 0,
    firstLoad: false
}


const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addUser: (state, action) => {
            if (state.users.every(item => item._id !== action.payload._id)) {
                state.users.unshift(action.payload);
            }
        },
        addMessage: (state, action) => {
            const { recipient, sender, text, media, call } = action.payload;
            state.data = state.data.map(item =>
                item._id === action.payload.recipient || item._id === action.payload.sender
                    ? {
                        ...item,
                        messages: [...item.messages, action.payload],
                        result: item.result + 1
                    }
                    : item
            )
            // state.data = [...state.data, action.payload]
            state.users = state.users.map(user => {
                if (user._id === recipient || user._id === sender) {
                    return {
                        ...user,
                        text,
                        media,
                        call,
                    };
                }
                return user;
            });
        },
        getConversations: (state, action) => {
            state.users = action.payload.newArr;
            state.resultUsers = action.payload.result;
            state.firstLoad = true;
            //             return {
            //                 ...state,
            //                 users: action.payload.newArr,
            //                 resultUsers: action.payload.result,
            //                 firstLoad: true,
            //             };
        },
        // getMessages: (state, action) => {
        //     return {
        //         ...state,
        //         data: action.payload.message.reverse(),
        //         resultData: action.payload.result,
        //     };
        // },

        // getMessages: (state, action) => {
        // if (action.payload && action.payload.messages && Array.isArray(action.payload.messages)) {
        //     return {
        //         ...state,
        //         data: action.payload.messages.reverse(),
        //         resultData: action.payload.result,
        //     };
        // } else {
        //     // If the payload is not in the expected format, return the current state
        //     return state;
        // }
        // },

        getMessages: (state, action) => {
            if (action.payload?.messages?.length > 0) {
                const { _id, messages, page, result } = action.payload;
                // Check if the payload's _id is already present in the state.data array
                const isDuplicate = state.data.some((item) => item._id === _id);

                if (!isDuplicate) {
                    // If the payload's _id is not a duplicate, update the state
                    return {
                        ...state,
                        data: [...state.data, { _id, messages, page, result }],
                    };
                }
            }
            // If the payload does not contain any new messages or duplicates, return the current state
            return state;
        },
        updateMessages: (state, action) => {
            return {
                ...state,
                data: EditData(state.data, action.payload._id, action.payload)
            };
        },
        deleteMessages: (state, action) => {
            const { _id, newData } = action.payload;
            return {
                ...state,
                data: state.data.map((item) =>
                    item._id === _id ? { ...item, messages: newData } : item
                ),
            };
        },
        deleteConversation: (state,action) => {
            return {
                ...state,
                users: DeleteData(state.users, action.payload),
                data: DeleteData(state.data, action.payload),
              };
        },
        checkOnlineOffline: (state,action) => {
            return {
                ...state,
                users: state.users.map(user => 
                    action.payload.includes(user._id)
                    ? {...user, online: true}
                    : {...user, online: false}
                )
            }
        }
    }
});

export default messageSlice.reducer;
export const { addUser, addMessage, getConversations, getMessages, updateMessages, deleteMessages, deleteConversation, checkOnlineOffline } = messageSlice.actions;
