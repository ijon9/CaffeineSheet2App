import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function TVDetail() {
  let { id, tv } = useParams();
  const navigate = useNavigate();

  let goBack = () => {
    navigate(`/app/${id}`);
  };

  return (
    <div>
      <div>TVDetail</div>
      <button onClick={goBack}>back</button>
    </div>
  );
}

export default TVDetail;
