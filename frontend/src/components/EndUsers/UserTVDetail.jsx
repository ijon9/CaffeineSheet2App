import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Record from "../Record";
import RecordModal from "../Modals/RecordModal";
import axios from "axios";
import DetailViewModal from "../Modals/DetailViewModal";
import DeleteRecordModal from "../Modals/DeleteRecordModal";

function TVDetail() {
  axios.defaults.withCredentials = true;
  let { id, tv } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [addRecordCols, setAddRecordCols] = useState([]);
  const [tView, setTView] = useState({});
  const [dView, setDView] = useState({});
  const [roles, setRoles] = useState("");
  const [setOfRoles, setSetOfRoles] = useState([]);
  const [columns, setColumns] = useState("");
  const [tViewSet, setTViewSet] = useState(false);
  const [RecordModalOpen, setRecordModalOpen] = useState(false);
  const [allowed, setAllowed] = useState("");
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [recordDetail, setRecordDetail] = useState(null);
  const [recordDetailOpen, setRecordDetailOpen] = useState(null);
  const [isARole, setIsARole] = useState(false);
  const [isARoleSet, setIsARoleSet] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [recordIndex, setRecordIndex] = useState("");

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
        setEdit(response.data.view.allowedActions[1]);
        setDel(response.data.view.allowedActions[2]);
        setTViewSet(true);
      });

    axios
      .post("http://localhost:4000/getDisplayColumns", {
        appId: id,
        tableView: tv,
      })
      .then((response) => {
        console.log(response.data);
        setRecords(response.data.dataValues);
        setAllRecords(response.data.allCols);
      });

    axios
      .post("http://localhost:4000/isUserARole", {
        id: id,
        tv: tv,
      })
      .then((response) => {
        setIsARole(response.data.isARole);
        setSetOfRoles(response.data.setOfRoles);

        axios
        .post("http://localhost:4000/getFirstDetailView", {
          id: id,
          tv: tv,
          setOfRoles : response.data.setOfRoles
        })
        .then((response) => {
          setDView(response.data);
          let arr = [];
          for(let col of response.data.view.columns) {
            arr.push(col.name);
          }
          let temp = [];
          temp.push(arr);
          setAddRecordCols(temp);
        });

        setIsARoleSet(true);
      });

  }, []);

  const handleAddRecord = async (newRow) => {
    try {
      const response = await axios.post("http://localhost:4000/addRecord", {
        appId: id,
        tableView: tv,
        newRow: newRow,
        title: tView.view.dsurl.split("/")[5],
        addRecordCols: addRecordCols
      });
      if (response.data) {
        // setRecords((prevRecords) => [...prevRecords, newRow]);
        axios
        .post("http://localhost:4000/getDisplayColumns", {
          appId: id,
          tableView: tv,
        })
        .then((response) => {
          setRecords(response.data.dataValues);
          setAllRecords(response.data.allCols);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetIndexRow = async (index) => {
    const getRow = await axios.post("http://localhost:4000/getDetailRecord", {
      appId: id,
      index: index,
      records: allRecords,
      tableView: tv,
      dView: dView
    });
    setRecordDetail(getRow.data);
    setRecordIndex(index);
    setRecordDetailOpen(true);
  };
  
  const handleEditRecord = async (updatedRow) => {
    try {
      const response = await axios.post("http://localhost:4000/editRecord", {
        appId: id,
        tableView: tv,
        updatedRow: updatedRow,
        recordIndex: recordIndex,
        title: tView.view.dsurl.split("/")[5],
        records: allRecords,
        recordCols : addRecordCols
      });
      if (response.data) {
        // const updatedRecords = records.map((record, index) =>
        //   index === recordIndex ? updatedRow : record
        // );
        // setRecords(updatedRecords);
        axios
        .post("http://localhost:4000/getDisplayColumns", {
          appId: id,
          tableView: tv,
        })
        .then((response) => {
          setRecords(response.data.dataValues);
          setAllRecords(response.data.allCols);
        });
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
        records: allRecords,
        title: tView.view.dsurl.split("/")[5],
      });
      if (response.data) {
        // setRecords((prevRecords) =>
        //   prevRecords.filter((_, index) => index !== recordIndex)
        // );
        axios
        .post("http://localhost:4000/getDisplayColumns", {
          appId: id,
          tableView: tv,
        })
        .then((response) => {
          setRecords(response.data.dataValues);
          setAllRecords(response.data.allCols);
        });  
      }
    } catch (error) {
      console.log(error);
    }
    setDeleteModalOpen(false);
  };


  return tViewSet && isARoleSet ? (
    isARole ? (
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
          onDelete={(index) => {
            setRecordToDelete(index);
            setDeleteModalOpen(true);
          }}
          onDetailOpen={(index) => {
            handleGetIndexRow(index);
          }}
          endUser={true}
        ></Record>
        {(() => {
          if (add) {
            return (
              <button onClick={() => setRecordModalOpen(true)}>
                Add Record
              </button>
            );
          } else {
            return "";
          }
        })()}
        <RecordModal
          open={RecordModalOpen}
          onClose={() => setRecordModalOpen(false)}
          onSubmit={handleAddRecord}
          records={addRecordCols}
        />
        <DetailViewModal
          open={recordDetailOpen}
          onClose={() => setRecordDetailOpen(false)}
          recordIndex={recordDetail}
          onSubmit={handleEditRecord}
          edit={edit}
        />
        <DeleteRecordModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={handleDeleteRecord}
          recordIndex={recordToDelete}
        />
      </div>
    ) : (
      "You do not have access to this view"
    )
  ) : null;
}

export default TVDetail;
