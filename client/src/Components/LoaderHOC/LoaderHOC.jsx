// import React, { useState, useEffect } from 'react';
// import PageLoaderWithHoc from '../PageLoader/PageLoaderWithHoc';

// const LoaderHOC = ({ children }) => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//   }, []);

//   if (loading) {
//     return (
//       <div>
//         <PageLoaderWithHoc/>
//       </div>
//     );
//   }
//   return <>{children}</>;
// };

// export default LoaderHOC;


import React from 'react';
import PageLoader from '../PageLoader/PageLoader';

const LoaderHOC = ({ children }) => {
  return (
    <div>
      <PageLoader />
      {children}
    </div>
  );
};

export default LoaderHOC;
