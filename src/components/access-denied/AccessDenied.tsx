import React from "react";

import "./styles.css";
interface AccessDeniedProps {
  customStyle?: any;
}
const AccessDenied: React.FC<AccessDeniedProps> = ({ customStyle }) => {
  return (
    <div className="access-denied">
      <img
        src="./assets/access-denied.png"
        alt="Access Denied"
        id="access-denied"
      />
      <p id="access-denied-heading" style={customStyle}>
        Access Denied
      </p>
      <p id="access-denied-description" style={customStyle}>
        Sorry, you are not allowed to view this page.
      </p>
    </div>
  );
};
export default AccessDenied;
