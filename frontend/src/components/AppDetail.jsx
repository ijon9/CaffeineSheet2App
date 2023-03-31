import React, { useEffect, useState } from "react";
import "../style/AppHome.css";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatasourceModal from "./Modals/DatasourceModal";
import TableModal from "./Modals/TableModal";

function AppDetail() {
  let { id } = useParams();
  const [user, setUser] = useState("");
  const [app, setApp] = useState({});
  const [dataSources, setDataSources] = useState([]);
  const [datasourceModal, setDatasourceModal] = useState(false);
  const [tableView, setTableView] = useState([]);
  const [tableModal, setTableModal] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:4000/getUser")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .post("http://localhost:4000/getOneApp", { id: id })
      .then((response) => {
        setApp(response.data);
        setDataSources(response.data.dataSources);
        setTableView(response.data.tViews);
      });
  }, [user]);

  function handleBackToApp() {
    navigate("/yourapps");
  }

  const handleSubmitds = (formData) => {
    setDatasourceModal(false);
    axios
      .post("http://localhost:4000/addDataSource", {
        appId: id,
        name: formData.name,
        url: formData.url,
        sheetIndex: formData.sheetIndex,
      })
      .then((response) => {
        navigate(`/app/${id}/table/${response.data._id}`);
        setDataSources((value) => [...value, response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmittv = (formData) => {
    console.log(formData);
    setTableModal(false);
    axios
      .post("http://localhost:4000/addTableView", {
        appId: id,
        data: formData,
        selectApp: app,
      })
      .then((response) => navigate(`/app/${id}/table/${response.data._id}`));
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setApp({ ...app, [name]: value });
  };

  const handleEdit = (event) => {
    event.preventDefault();
    axios.post("http://localhost:4000/editApp", {
      appId: app._id,
      name: app.name,
      creator: app.creator,
      publish: app.publish,
      roleSheet: app.roleSheet,
    });
  };

  var publish;
  var notPublish;
  if (app.published) {
    publish = <input type="radio" value="yes" name="publish" defaultChecked />;
    notPublish = <input type="radio" value="no" name="publish" />;
  } else {
    publish = <input type="radio" value="yes" name="publish" />;
    notPublish = (
      <input type="radio" value="no" name="publish" defaultChecked />
    );
  }

  return (
    <div>
      <div>{user}</div>
      <form onSubmit={handleEdit}>
        Name
        <input
          type="text"
          value={app.name || ""}
          name="name"
          onChange={handleChange}
        />
        <br />
        Rolesheet
        <input
          type="text"
          value={app.roleSheet || ""}
          name="roleSheet"
          onChange={handleChange}
        />
        <br />
        <div onChange={handleChange}>
          {publish} Publish
          {notPublish} Don't Publish
        </div>
        <button type="submit">save edit</button>
      </form>
      <div>
        <button onClick={handleBackToApp}>Back to apps</button>
      </div>
      <div className="left">
        Datasource{" "}
        <button
          onClick={() => {
            setDatasourceModal(true);
          }}
        >
          Add
        </button>
        <div>
          {dataSources.length > 0 ? (
            dataSources.map((ds) => (
              <div key={ds._id}>
                <Link to={`/app/${id}/${ds._id}`}>{ds.name}</Link>
              </div>
            ))
          ) : (
            <div>No Datasource</div>
          )}
        </div>
      </div>
      <DatasourceModal
        open={datasourceModal}
        closeDS={() => setDatasourceModal(false)}
        onSubmitds={handleSubmitds}
      ></DatasourceModal>
      <div className="right">
        Add Table{" "}
        <button
          onClick={() => {
            setTableModal(true);
          }}
        >
          Add
        </button>
        <div>
          {tableView.length > 0 ? (
            tableView.map((tv) => (
              <div key={tv.view._id}>
                <Link to={`/app/${id}/table/${tv.view._id}`}>
                  {tv.view.name}
                </Link>
              </div>
            ))
          ) : (
            <div>No Table Views</div>
          )}
        </div>
      </div>
      <TableModal
        open={tableModal}
        closetv={() => setTableModal(false)}
        onSubmittv={handleSubmittv}
      ></TableModal>
    </div>
  );
}

export default AppDetail;
