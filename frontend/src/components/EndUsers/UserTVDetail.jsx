import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Record from "../Record";
import RecordModal from "../Modals/RecordModal";
import axios from "axios";
import DetailViewModal from "../Modals/DetailViewModal";

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
  const [add, setAdd] = useState(false);
  const [del, setDel] = useState(false);
  const [recordDetail, setRecordDetail] = useState(null);
  const [recordDetailOpen, setRecordDetailOpen] = useState(null);

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
        for (var i = 0; i < tViewCols.length; i++) {
          str = str.concat(tViewCols[i].name);
          str = str.concat("/");
        }
        str = str.slice(0, str.length - 1);
        setColumns(str);
        var a = "";
        if (response.data.view.allowedActions[0]) a += "add ";
        if (response.data.view.allowedActions[1]) a += "edit ";
        if (response.data.view.allowedActions[2]) a += "delete ";
        setAllowed(a);
        setAdd(response.data.view.allowedActions[0]);
        setDel(response.data.view.allowedActions[2]);
        setTViewSet(true);
      });

    axios
      .post("http://localhost:4000/getDisplayColumns", {
        appId: id,
        tableView: tv,
      })
      .then((response) => {
        setRecords(response.data);
        // console.log(response.data);
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

  const handleGetIndexRow = async (index) => {
    const getRow = await axios.post("http://localhost:4000/getDetailRecord", {
      appId: id,
      index: index,
      records: records,
      tableView: tv,
    });

    setRecordDetail(getRow.data);
    setRecordDetailOpen(true);
  };

  return tViewSet ? (
    <div>
      <div>TVDetail</div>
      <button onClick={goBack}>back</button>
      <br />
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
      <Record
        records={records}
        del={del}
        onDetailOpen={(index) => {
          handleGetIndexRow(index);
        }}
      ></Record>
      {(() => {
        if (add) {
          return (
            <button onClick={() => setRecordModalOpen(true)}>Add Record</button>
          );
        } else {
          return "";
        }
      })()}
      <RecordModal
        open={RecordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        onSubmit={handleAddRecord}
        records={records}
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
