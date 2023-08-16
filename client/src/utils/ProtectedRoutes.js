import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
    const auth = useSelector(state => state.auth)
    // console.log(auth);
    return auth ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoutes


// import React, { Suspense } from 'react';
// import { useSelector } from 'react-redux';
// import { Navigate, Outlet } from 'react-router-dom';
// // import LoaderHOC from '../Components/LoaderHOC/LoaderHOC';

// const ProtectedRoutes = () => {
//   const auth = useSelector(state => state.auth);
//   // console.log(auth);

//   const renderOutlet = () => {
//     return <Outlet />;
//   };

//   return (
//     <>
//     {auth ? renderOutlet() : <Navigate to="/login" />}
//     </>
//     // <Suspense fallback={<LoaderHOC />}>
//     //   {auth ? renderOutlet() : <Navigate to="/login" />}
//     // </Suspense>
//   );
// };

// export default ProtectedRoutes;

// import React, { useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Navigate, Outlet } from 'react-router-dom';
// import LoaderHOC from '../Components/LoaderHOC/LoaderHOC';
// import { setLoad } from '../redux/AllReducers/loadingReducer';

// const ProtectedRoutes = () => {
//   const auth = useSelector(state => state.auth);
//   const loadingRef = useRef(false);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     loadingRef.current = true; // Set loading to true

//     // Use setTimeout to set loading back to false after a brief period (e.g., 2 seconds)
//     const timer = setTimeout(() => {
//       loadingRef.current = false; // Set loading back to false
//       dispatch(setLoad(false)); // Update the state using the dispatch function
//     }, 2000);

//     // Clean up the timer when the component unmounts
//     return () => {
//       clearTimeout(timer); // Clear the timeout to prevent it from firing after unmounting
//     };
//   }, [dispatch]);

//   return (
//     <LoaderHOC>
//       {auth ? <Outlet /> : <Navigate to="/login" />}
//     </LoaderHOC>
//   );
// };

// export default ProtectedRoutes;

// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Navigate, Outlet } from 'react-router-dom';
// import LoaderHOC from '../Components/LoaderHOC/LoaderHOC';

// const ProtectedRoutes = () => {
//   const auth = useSelector(state => state.auth);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate an asynchronous operation (e.g., fetching data, initializing, etc.)
//     // Replace this with your actual data fetching logic or remove the setTimeout if not needed
//     setTimeout(() => {
//       setLoading(false); // Set loading to false to hide the loader
//     }, 2000); // Adjust the duration as needed
//   }, []);

//   if (loading) {
//     // Show the loader while loading is true
//     return (
//       <LoaderHOC />
//     );
//   }

//   // Render the actual page content once loading is done
//   return (
//     <>
//       {auth ? <Outlet /> : <Navigate to="/login" />}
//     </>
//   );
// };

// export default ProtectedRoutes;


// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Navigate, Outlet } from 'react-router-dom';
// import PageLoader from '../Components/PageLoader/PageLoader';
// import { setLoad } from '../redux/AllReducers/loadingReducer';

// const ProtectedRoutes = () => {
//   const auth = useSelector(state => state.auth);
//   const load = useSelector(state => state.load.loading);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     // Simulate an asynchronous operation (e.g., fetching data, initializing, etc.)
//     // Replace this with your actual data fetching logic or remove the setTimeout if not needed
//     dispatch(setLoad(true)); // Set loading to true before starting the data fetching

//     const timeoutId = setTimeout(() => {
//       dispatch(setLoad(false)); // Set loading to false to hide the loader
//     }, 2000); // Adjust the duration as needed

//     // Clean up the timeout when the component unmounts
//     return () => {
//       setLoad(false);
//       clearTimeout(timeoutId);
//       }
//   }, [dispatch]);

//   if (load) {
//     // Show the loader while loading is true
//     return (
//       <PageLoader/>
//     );
//   }

//   // Render the actual page content once loading is done
//   return auth ? <Outlet /> : <Navigate to="/login" />;
// };

// export default ProtectedRoutes;

