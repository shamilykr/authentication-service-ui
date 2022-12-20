import {
  ACCESS_DENIED_DESCRIPTION,
  ACCESS_DENIED_MESSAGE,
} from "constants/messages";
import DisplayMessage from "components/display-message";

export const renderAccessDenied = () => (
  <DisplayMessage
    customStyle={{ fontSize: 16 }}
    altMessage={ACCESS_DENIED_MESSAGE}
    image="./assets/access-denied.png"
    heading={ACCESS_DENIED_MESSAGE}
    description={ACCESS_DENIED_DESCRIPTION}
    imageStyles={{ width: "33%" }}
    className="access-denied-mini"
  />
);
