import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Record from "./Record";
import axios from "axios";
function TVDetail() {
  let { id, tv } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [tView, setTView] = useState({});
  const [roles, setRoles] = useState("");
  const [tViewSet, setTViewSet] = useState(false);

  let goBack = () => {
    navigate(`/app/${id}`);
  };
  
  useEffect(() => {
    axios
      .post("http://localhost:4000/getTableView", {
        tableView: tv,
      })
      .then((response) => {
        setTView(response.data);
        var str = "";
        const tViewRoles = response.data.view.roles
        for(var i=0; i<tViewRoles.length; i++) {
          str = str.concat(tViewRoles[i]);
          str = str.concat(",");
        }
        str = str.slice(0, str.length-1);
        setRoles(str);
        setTViewSet(true);
      });

    axios
      .post("http://localhost:4000/getDisplayColumns", {
        appId: id,
        tableView: tv,
      })
      .then((response) => {
        setRecords(response.data);
      });
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    var tViewCopy = JSON.parse(JSON.stringify(tView));
    if(name === "name") {
      tViewCopy.view.name = value;
    }
    else if(name === "table") {
      tViewCopy.view.table = value;
    }
    else if(name === "viewType") {
      tViewCopy.view.viewType = value;
    }
    else if(name === "add") {
      tViewCopy.view.allowedActions[0] = !tViewCopy.view.allowedActions[0]
    }
    else if(name === "edit") {
      tViewCopy.view.allowedActions[1] = !tViewCopy.view.allowedActions[1]
    }
    else if(name === "delete") {
      tViewCopy.view.allowedActions[2] = !tViewCopy.view.allowedActions[2]
    }
    else if(name === "roles") {
      setRoles(value);
    }
    setTView(tViewCopy);
    // setDataSource({ ...dataSource, [name]: value });
  };

  const handleEdit = (event) => {
    event.preventDefault();
    axios.post("http://localhost:4000/editTableView", {
      appId: id,
      tView : tView,
      roles : roles
    });
  };

  return (tViewSet ?
    <div>
      <div>TVDetail</div>
      <button onClick={goBack}>back</button>
      <form onSubmit={handleEdit}>
        Name:
        <input
          type="text"
          value={tView.view.name || ""}
          name="name"
          onChange={handleChange}
        />
        <br />
        Table:
        <input
          type="text"
          value={tView.view.table || ""}
          name="table"
          onChange={handleChange}
        />
        <br />
        View Type:
        <input
          type="text"
          value={tView.view.viewType || ""}
          name="viewType"
          onChange={handleChange}
        />
        <br/>
        {tView.view.allowedActions[0] 
        ? <><input
          type="checkbox"
          value="add"
          onChange={handleChange}
          name="add"
          defaultChecked/>{" "} </>
        : <><input
          type="checkbox"
          value="add"
          onChange={handleChange}
          name="add"
        />{" "} </>}add

        {tView.view.allowedActions[1] 
        ? <><input
          type="checkbox"
          value="edit"
          onChange={handleChange}
          name="edit"
          defaultChecked/>{" "} </>
        : <><input
          type="checkbox"
          value="edit"
          onChange={handleChange}
          name="edit"
        />{" "} </>}edit

        {tView.view.allowedActions[2] 
        ? <><input
          type="checkbox"
          value="delete"
          onChange={handleChange}
          name="delete"
          defaultChecked/>{" "} </>
        : <><input
          type="checkbox"
          value="delete"
          onChange={handleChange}
          name="delete"
        />{" "} </>}delete<br/>
        Roles (Separated by /) :{' '}
        <input
          type="text"
          value={roles || ""}
          name="roles"
          onChange={handleChange}
        />
        <br/>
        <button type="submit">save edit</button>
      </form>
      <Record records={records}></Record>
    </div>
    : null
  );
}

export default TVDetail;
