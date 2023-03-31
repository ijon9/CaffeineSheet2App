import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
      <div>LandingPage</div>
      <div>
        Get Started <Link to="/login">Here</Link>
      </div>
    </div>
  );
}

export default LandingPage;
