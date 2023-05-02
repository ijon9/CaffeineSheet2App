import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function DVDetail() {
  axios.defaults.withCredentials = true;
  let { id, dv } = useParams();
  const navigate = useNavigate();
  const [dView, setDView] = useState({});
  const [dViewSet, setDViewSet] = useState(false);
  const [roles, setRoles] = useState("");
  const [editable, setEditable] = useState("");
  const [colArray, setColArray] = useState([]);

  let goBack = () => {
    navigate(`/app/${id}/table/${dView.tView}`);
  };

  useEffect(() => {
    axios
      .post("http://localhost:4000/getDetailView", {
        dv: dv,
      })
      .then((response) => {
        //===================================
        setDView(response.data);
        var str = "";
        const dViewRoles = response.data.view.roles;
        for (var i = 0; i < dViewRoles.length; i++) {
          str = str.concat(dViewRoles[i]);
          str = str.concat("/");
        }
        str = str.slice(0, str.length - 1);
        setRoles(str);
        //===================================
        str = "";
        const dViewEditable = response.data.editableColumns;
        for (var i = 0; i < dViewEditable.length; i++) {
          str = str.concat(dViewEditable[i]);
          str = str.concat("/");
        }
        str = str.slice(0, str.length - 1);
        setEditable(str);
        console.log("editableColumns(DVDeetail.jsx) = ", str);
        //===================================
        var arr = [];
        var currColNames = [];
        for (let col of response.data.view.columns) {
          currColNames.push(col.name);
        }
        for (var i = 0; i < response.data.view.allColumns.length; i++) {
          if (currColNames.includes(response.data.view.allColumns[i].name)) {
            arr[i] = true;
          } else {
            arr[i] = false;
          }
        }
        setColArray(arr);
        //===================================
        setDViewSet(true);
      });
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    var dViewCopy = JSON.parse(JSON.stringify(dView));
    if (name === "name") {
      dViewCopy.view.name = value;
    } else if (name === "table") {
      dViewCopy.view.table = value;
    } else if (name === "viewType") {
      dViewCopy.view.viewType = value;
    } else if (name === "roles") {
      setRoles(value);
    } else if (name === "editable") {
      setEditable(value);
    } else if (name === "editFilter") {
      dViewCopy.editFilter = value;
    } else if (name === "col") {
      const ind = parseInt(value);
      var colArrCopy = JSON.parse(JSON.stringify(colArray));
      colArrCopy[ind] = !colArrCopy[ind];
      setColArray(colArrCopy);
    }
    setDView(dViewCopy);
  };

  const handleEdit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:4000/editDetailView", {
        appId: id,
        dView: dView,
        roles: roles,
        colArray: colArray,
        editable: editable
      })
      .then((response) => {
        window.location.reload(false);
      });
  };


  return dViewSet ? (
    <div>
      <div>TVDetail</div>
      <button onClick={goBack}>back</button>
      <form onSubmit={handleEdit}>
        Name:
        <input
          type="text"
          value={dView.view.name || ""}
          name="name"
          onChange={handleChange}
        />
        <br />
        Table:
        <input
          type="text"
          value={dView.view.table || ""}
          name="table"
          onChange={handleChange}
        />
        <br />
        View Type:
        <input
          type="text"
          value={dView.view.viewType || ""}
          name="viewType"
          onChange={handleChange}
        />
        <br />
        Roles (Separated by /) :{" "}
        <input
          type="text"
          value={roles || ""}
          name="roles"
          onChange={handleChange}
        />
        <br />
        Edit Filter Column:{" "}
        <input
          type="text"
          value={dView.editFilter || ""}
          name="editFilter"
          onChange={handleChange}
        />
        <br />
        Editable Columns (Separated by /) :{" "}
        <input
          type="text"
          value={editable || ""}
          name="editable"
          onChange={handleChange}
        />
        <br />
        All Columns:
        <ol>
          {dView.view.allColumns.map((c, ind) => (
            <li>
              {c.name}
              {colArray[ind] ? (
                <input
                  type="checkbox"
                  value={ind}
                  onChange={handleChange}
                  name="col"
                  defaultChecked
                />
              ) : (
                <input
                  type="checkbox"
                  value={ind}
                  onChange={handleChange}
                  name="col"
                />
              )}
            </li>
          ))}
        </ol>
        <button type="submit">save edit</button>
      </form><br/>

    </div>
  ) : null;
}

export default DVDetail;
