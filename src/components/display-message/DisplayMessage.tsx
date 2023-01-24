import React from "react";

import "./styles.css";
import { DisplayMessageProps } from "./types";

const DisplayMessage: React.FC<DisplayMessageProps> = ({
  customStyle,
  altMessage,
  image,
  heading,
  description,
  imageStyles,
  containerStyles,
  className,
}) => {
  return (
    <div
      className={className ? `${className}` : "display-message"}
      style={containerStyles}
    >
      <img
        src={image}
        alt={altMessage}
        id="display-message"
        style={imageStyles}
      />
      <p id="display-message-heading" style={customStyle}>
        {heading}
      </p>
      <p id="display-message-description" style={customStyle}>
        {description}
      </p>
    </div>
  );
};
export default DisplayMessage;
