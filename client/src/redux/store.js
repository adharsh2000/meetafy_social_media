import {configureStore} from '@reduxjs/toolkit'
import AllReducers from './AllReducers/AllReducer';

const store = configureStore({reducer:AllReducers});

export default store;