// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function AppHome(props) {
//     axios.defaults.withCredentials = true;
//     const [dataSource, setDataSource] = useState([]);
//     const navigate = useNavigate();
//     const dataSourceID = props;
    
//     useEffect(() => {
//         axios
//           .get("http://localhost:4000/get", {
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
        
//     )
// };
// export default AppHome;