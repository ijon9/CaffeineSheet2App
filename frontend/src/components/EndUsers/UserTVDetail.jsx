import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Record from "../Record";
import RecordModal from "../Modals/RecordModal";
import axios from "axios";

function TVDetail() {
  let { id, tv } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [tView, setTView] = useState({});
  const [roles, setRoles] = useState("");
  const [columns, setColumns] = useState("");
  const [tViewSet, setTViewSet] = useState(false);
  const [RecordModalOpen, setRecordModalOpen] = useState(false);
  const [allowed, setAllowed] = useState("");

  let goBack = () => {
    navigate(`/userApp/${id}`);
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
        for(var i=0; i<tViewCols.length; i++) {
          str = str.concat(tViewCols[i].name);
          str = str.concat("/");
        }
        str = str.slice(0, str.length - 1);
        setColumns(str);
        setTViewSet(true);
        var a = "";
        if(response.data.view.allowedActions[0]) a += "add ";
        if(response.data.view.allowedActions[1]) a += "edit ";
        if(response.data.view.allowedActions[2]) a += "delete ";
        setAllowed(a);
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

  return tViewSet ? (
    <div>
      <div>TVDetail</div>
      <button onClick={goBack}>back</button><br/>
        <b>Name:</b> {tView.view.name}
        <br />
        <b>Table:</b> {tView.view.table}
        <br />
        <b>View Type:</b> {tView.view.viewType}
        <br />
        <b>Allowed Actions:</b> {allowed}
        <br />
        <b>Roles (Separated by /) :</b> {roles}
        <br />
        <b>Columns (Separated by /) :</b> {columns}
        <br />
        <b>Filter Column :</b> {tView.filter.name}
        <br />
        <b>User Filter Column :</b> {tView.userFilter.name}
        <br />
      <Record records={records}></Record>
      <button onClick={() => setRecordModalOpen(true)}>Add Record</button>
      <RecordModal
        open={RecordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        onSubmit={handleAddRecord}
        records={records}
      />
    </div>
  ) : null;
}

export default TVDetail;
