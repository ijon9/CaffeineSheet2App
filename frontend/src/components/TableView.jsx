import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AppHome(props) {
    axios.defaults.withCredentials = true;
    const [dataSource, setDataSource] = useState([]);
    const [table, setTable] = useState([]);
    const dataSourceID = props;
    
    
    useEffect(() => {
        axios
          .post("http://localhost:4000/getDataSource", {
            dataSourceID: dataSourceID
          })
          .then((response) => {
            setDataSource(response.data)
          })
          .catch((error) => {
            console.log(error);
          });
        
        axios
          .post("http://localhost:4000/tableView", {
            url: dataSource.url,
            range: dataSource.sheetIndex,
          })
          .then((response) => {
            setTable(JSON.stringify(response, null, 2));
            //printTable(response)
          })
          .catch((error) => {
            console.log(error);
          });
    });

    return (
        <div className="container">
            <h1>Table</h1>
                {table}
        </div>
    )
};
export default AppHome;