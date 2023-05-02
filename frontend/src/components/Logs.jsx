import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
function Logs() {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`http://localhost:4000/logs/${id}`).then((response) => {
      setLogs(response.data);
    });
  }, []);

  return (
    <div>
      <div>Logs</div>
      <button onClick={() => navigate(`/app/${id}`)}>Back</button>
      <div>
        {logs.map((l) => (
          <div>{l}</div>
        ))}
      </div>
    </div>
  );
}

export default Logs;
