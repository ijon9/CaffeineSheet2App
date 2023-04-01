import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DSColumn from "./DSColumn";

function DSDetail() {
  let { id, ds } = useParams();
  const [columns, setColumns] = useState([]);
  const [name, setName] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .post("http://localhost:4000/getDataSource", { dataSourceID: ds })
      .then((response) => {
        setColumns(response.data.columns);
        setName(response.data.name);
        setDataSource(response.data);
      });
  }, []);

  let goBack = () => {
    navigate(`/app/${id}`);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDataSource({ ...dataSource, [name]: value });
  };
  
  const handleColChange = (event) => {
    const thisCol = event.target.name[0];
    var temp;
    for(var i=0; i<columns.length; i++) {
      if(columns[i].colLetter === thisCol) {
        columns[i].colLetter = "Z";
        temp = columns[i];
      }
    }
    console.log(temp);
  }

  const handleEdit = (event) => {
    event.preventDefault();
    axios.post("http://localhost:4000/editDataSource", {
      appId: id,
      dsId: ds,
      name: dataSource.name,
      url: dataSource.url
    });
  };

  return (
    <div>
      <div>DSDetail {name}</div>
      <button onClick={goBack}>back</button>
      <form onSubmit={handleEdit}>
        Name:
        <input
          type="text"
          value={dataSource.name || ""}
          name="name"
          onChange={handleChange}
        />
        <br />
        URL:
        <input
          type="text"
          value={dataSource.url || ""}
          name="url"
          onChange={handleChange}
        />
        <br /><br/>
        <table border="2px">
        <tr>
          <th>ColumnLetter</th>
          <th>initialValue</th>
          <th>label</th>
          <th>reference</th>
          <th>type</th>
          <th>key</th>
        </tr>
        {columns.map((c) => (
        <tr>
          <td><input type="text" value={c.colLetter || ""} name={c.colLetter+"N"} onChange={handleColChange}/></td>
          <td>{c.initialValue === "" ? "none" : c.initialValue}</td>
          <td>{c.label ? "true" : "false"}</td>
          <td>{c.reference === "" ? "false" : c.reference}</td>
          <td>{c.type === "" ? "no type" : c.type}</td>
          <td>{c.key ? "true" : "false"}</td>
        </tr>
      ))}
      </table>
      <br/>
      <button type="submit">save edit</button>
      </form>
      <br/>
      {/* <DSColumn columns={columns}></DSColumn> */}
      
    </div>
  );
}

export default DSDetail;
