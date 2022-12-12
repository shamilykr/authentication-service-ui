import React from "react";

import "./styles.css";

const AccessDenied: React.FC = () => {
  return (
    <div className="access-denied">
      <img
        src="./assets/access-denied.png"
        alt="Access Denied"
        id="access-denied"
      />
      <p id="access-denied-heading">Access Denied</p>
      <p id="access-denied-description">
        Sorry, you are not allowed to view this page.
      </p>
    </div>
  );
};
export default AccessDenied;
