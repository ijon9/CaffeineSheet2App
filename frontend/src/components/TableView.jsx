// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function AppHome(props) {
//     axios.defaults.withCredentials = true;
//     //const navigate = useNavigate();

//     useEffect(() => {
//         axios
//           .get("http://localhost:4000/tableView", {
//             url: inputs.url,
//             range: inputs.sheetIndex,
//           })
//           .then((response) => {
//             console.log(response.data);
//           })
//           .catch((error) => {
//             console.log(error);
//           });
//       }, []);

//     return (
//         <div className="container">
//             <h1>Table View</h1>
//             <div className="innerContainer">
                
//             </div>
//         </div>
//     )
// }
// export default AppHome;