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
    const colId = event.target.name.slice(0, event.target.name.length-1);
    const field = event.target.name[event.target.name.length-1];
    var colCopy = JSON.parse(JSON.stringify(columns));
    for(var i=0; i<colCopy.length; i++) {
      if(colCopy[i]._id === colId) {
        // colLetter
        if(field === 'C') colCopy[i].colLetter = event.target.value;
        // name
        if(field === "N") colCopy[i].name = event.target.value;
        // initialValue
        if(field === 'I') colCopy[i].initialValue = event.target.value;
        // label
        if(field === "L") {
          colCopy[i].label = event.target.value === "yes" ? true : false;
        }
        // reference
        if(field === "R") colCopy[i].reference = event.target.value;
        // type
        if(field === 'T') {
          colCopy[i].type = event.target.value;
        }
        // key
        if(field === "K") {
          colCopy[i].key = !colCopy[i].key;
        }
      }
    }
    setColumns(colCopy);
  }


  const handleEdit = (event) => {
    event.preventDefault();
    console.log(columns);
    axios.post("http://localhost:4000/editDataSource", {
      appId: id,
      dsId: ds,
      name: dataSource.name,
      url: dataSource.url,
      cols: columns
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
          <th>Name</th>
          <th>initialValue</th>
          <th>label</th>
          <th>reference</th>
          <th>type</th>
          <th>key</th>
        </tr>
        {columns.map((c) => (
        <tr>
          <td><input type="text" value={c.colLetter || ""} name={c._id+"C"} onChange={handleColChange}/></td>
          <td><input type="text" value={c.name || ""} name={c._id+"N"} onChange={handleColChange}/></td>
          <td>{<input type="text" value={c.initialValue || "none"} name={c._id+"I"} onChange={handleColChange}/>}</td>
          <td><div onChange={handleColChange}>{c.label 
            ? (<><input type="radio" value="yes" name={c._id+"L"} defaultChecked />Yes<input type="radio" value="no" name={c._id+"L"}/>No</>)
            : (<><input type="radio" value="yes" name={c._id+"L"} />Yes<input type="radio" value="no" name={c._id+"L"} defaultChecked />No</>)}
          </div></td>
          <td>{<input type="text" value={c.reference || "false"} name={c._id+"R"} onChange={handleColChange}/>}</td>
          <td>{<input type="text" value={c.type || "no type"} name={c._id+"T"} onChange={handleColChange}/>}</td>
          <td>{c.key ? <input type="checkbox" value="key" onChange={handleColChange} name={c._id+"K"} defaultChecked/>
              : <input type="checkbox" value="key" onChange={handleColChange} name={c._id+"K"}/>}</td>
          
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
