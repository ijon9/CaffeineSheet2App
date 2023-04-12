import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Record from "./Record";
import RecordModal from "./Modals/RecordModal";
import DeleteRecordModal from "./Modals/DeleteRecordModal";
import axios from "axios";
import DetailViewModal from "./Modals/DetailViewModal";

function TVDetail() {
  axios.defaults.withCredentials = true;
  let { id, tv } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [tView, setTView] = useState({});
  const [roles, setRoles] = useState("");
  const [columns, setColumns] = useState("");
  const [tViewSet, setTViewSet] = useState(false);
  const [RecordModalOpen, setRecordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [recordDetail, setRecordDetail] = useState(null);
  const [recordDetailOpen, setRecordDetailOpen] = useState(null);

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
        const tViewRoles = response.data.view.roles;
        for (var i = 0; i < tViewRoles.length; i++) {
          str = str.concat(tViewRoles[i]);
          str = str.concat("/");
        }
        str = str.slice(0, str.length - 1);
        setRoles(str);
        str = "";
        const tViewCols = response.data.view.columns;
        for (var i = 0; i < tViewCols.length; i++) {
          str = str.concat(tViewCols[i].name);
          str = str.concat("/");
        }
        str = str.slice(0, str.length - 1);
        setColumns(str);
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
    if (name === "name") {
      tViewCopy.view.name = value;
    } else if (name === "table") {
      tViewCopy.view.table = value;
    } else if (name === "viewType") {
      tViewCopy.view.viewType = value;
    } else if (name === "add") {
      tViewCopy.view.allowedActions[0] = !tViewCopy.view.allowedActions[0];
    } else if (name === "edit") {
      tViewCopy.view.allowedActions[1] = !tViewCopy.view.allowedActions[1];
    } else if (name === "delete") {
      tViewCopy.view.allowedActions[2] = !tViewCopy.view.allowedActions[2];
    } else if (name === "roles") {
      setRoles(value);
    } else if (name === "columns") {
      setColumns(value);
    } else if (name === "filter") {
      tViewCopy.filter.name = value;
    } else if (name === "userfilter") {
      tViewCopy.userFilter.name = value;
    }
    setTView(tViewCopy);
    // setDataSource({ ...dataSource, [name]: value });
  };

  const handleAddRecord = async (newRow) => {
    try {
      const response = await axios.post("http://localhost:4000/addRecord", {
        appId: id,
        tableView: tv,
        newRow: newRow,
        title: tView.view.dsurl.split("/")[5],
      });
      if (response.data) {
        setRecords((prevRecords) => [...prevRecords, newRow]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRecord = async (recordIndex) => {
    console.log("recordIndex:", recordIndex);
    try {
      const response = await axios.post("http://localhost:4000/deleteRecord", {
        appId: id,
        tableView: tv,
        rowIndex: recordIndex,
        title: tView.view.dsurl.split("/")[5],
      });
      if (response.data) {
        setRecords((prevRecords) =>
          prevRecords.filter((_, index) => index !== recordIndex)
        );
      }
    } catch (error) {
      console.log(error);
    }
    setDeleteModalOpen(false);
  };

  const handleEdit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:4000/editTableView", {
        appId: id,
        tView: tView,
        roles: roles,
        columns: columns,
      })
      .then((response) => {
        window.location.reload(false);
      });
  };

  const handleGetIndexRow = async (index) => {
    const getRow = await axios.post("http://localhost:4000/getDetailRecord", {
      appId: id,
      index: index,
      tableView: tv,
    });

    setRecordDetail(getRow.data);
    setRecordDetailOpen(true);
  };

  return tViewSet ? (
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
        <br />
        {tView.view.allowedActions[0] ? (
          <>
            <input
              type="checkbox"
              value="add"
              onChange={handleChange}
              name="add"
              defaultChecked
            />{" "}
          </>
        ) : (
          <>
            <input
              type="checkbox"
              value="add"
              onChange={handleChange}
              name="add"
            />{" "}
          </>
        )}
        add
        {tView.view.allowedActions[1] ? (
          <>
            <input
              type="checkbox"
              value="edit"
              onChange={handleChange}
              name="edit"
              defaultChecked
            />{" "}
          </>
        ) : (
          <>
            <input
              type="checkbox"
              value="edit"
              onChange={handleChange}
              name="edit"
            />{" "}
          </>
        )}
        edit
        {tView.view.allowedActions[2] ? (
          <>
            <input
              type="checkbox"
              value="delete"
              onChange={handleChange}
              name="delete"
              defaultChecked
            />{" "}
          </>
        ) : (
          <>
            <input
              type="checkbox"
              value="delete"
              onChange={handleChange}
              name="delete"
            />{" "}
          </>
        )}
        delete
        <br />
        Roles (Separated by /) :{" "}
        <input
          type="text"
          value={roles || ""}
          name="roles"
          onChange={handleChange}
        />
        <br />
        Columns (Separated by /) :{" "}
        <input
          type="text"
          value={columns || ""}
          name="columns"
          onChange={handleChange}
        />
        <br />
        Filter Column (Enter Column Name) :{" "}
        <input
          type="text"
          value={tView.filter.name || ""}
          name="filter"
          onChange={handleChange}
        />
        <br />
        User Filter Column (Enter Column Name) :{" "}
        <input
          type="text"
          value={tView.userFilter.name || ""}
          name="userfilter"
          onChange={handleChange}
        />
        <br />
        <button type="submit">save edit</button>
      </form>
      <Record
        records={records}
        onDelete={(index) => {
          setRecordToDelete(index);
          setDeleteModalOpen(true);
        }}
        onDetailOpen={(index) => {
          handleGetIndexRow(index);
        }}
      />
      <button onClick={() => setRecordModalOpen(true)}>Add Record</button>
      <RecordModal
        open={RecordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        onSubmit={handleAddRecord}
        records={records}
      />
      <DeleteRecordModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteRecord}
        recordIndex={recordToDelete}
      />
      <DetailViewModal
        open={recordDetailOpen}
        onClose={() => setRecordDetailOpen(false)}
        recordIndex={recordDetail}
      />
    </div>
  ) : null;
}

export default TVDetail;
