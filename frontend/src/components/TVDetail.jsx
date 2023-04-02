import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Record from "./Record";
import axios from "axios";
function TVDetail() {
  let { id, tv } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);

  let goBack = () => {
    navigate(`/app/${id}`);
  };

  useEffect(() => {
    axios
      .post("http://localhost:4000/getDisplayColumns", {
        appId: id,
        tableView: tv,
      })
      .then((response) => {
        setRecords(response.data);
      });
  }, []);

  return (
    <div>
      <div>TVDetail</div>
      <button onClick={goBack}>back</button>
      <Record records={records}></Record>
    </div>
  );
}

export default TVDetail;
