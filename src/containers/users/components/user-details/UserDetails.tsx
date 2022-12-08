import { useNavigate } from "react-router-dom";
import { Box, Button, Divider, Tab, Tabs, Chip } from "@mui/material";
import "./styles.css";
import { useState } from "react";
import GroupCard from "../../../../components/group-card/GroupCard";
import { ApolloError, useQuery } from "@apollo/client";
import { useSetRecoilState } from "recoil";

import { GET_USER } from "../../services/queries";
import { User } from "../../../../types/user";
import { useParams } from "react-router-dom";
import "./styles.css";
import {
  apiRequestAtom,
  toastMessageAtom,
} from "../../../../states/apiRequestState";
import { CustomAvatar } from "../../../../components/custom-avatar/CustomAvatar";
import { TabPanel } from "../create-edit-user/UserForm";

const UserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState<User>();
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const [value, setValue] = useState(0);
  const onBackNavigation = (e: React.MouseEvent<HTMLElement>) => {
    navigate(-1);
  };
  const onRedirectToEdit = (e: React.MouseEvent<HTMLElement>) => {
    navigate(`/home/users/add/${id}`);
  };

  useQuery(GET_USER, {
    variables: { id: id },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setUser(data?.getUser);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
  });

  const getClassName = () => {
    if (user?.status === "ACTIVE") return "active-user-style";
    else if (user?.status === "INACTIVE") return "inactive-user-style";
    else return "pending-style";
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div className="cntr">
      <div className="personal-details">
        <div className="details">
          <div style={{ display: "flex" }}>
            <CustomAvatar
              firstName={user?.firstName || ""}
              lastName={user?.lastName || ""}
              email={user?.email || ""}
            />
            <Chip
              label={
                user?.status &&
                user?.status.charAt(0) + user?.status.toLowerCase().slice(1)
              }
              className={getClassName()}
            />
          </div>
        </div>
        <Divider flexItem orientation="vertical" />
        <div className="contact">
          <div className="contact-number">Contact Number</div>
          <div>{user?.phone || "-"}</div>
        </div>
        <div style={{ display: "flex", marginLeft: "auto" }}>
          <Button
            variant="outlined"
            id="cancel-button"
            onClick={onBackNavigation}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <div className="submit-buttom-style">
            <Button
              variant="contained"
              id="submit-button"
              onClick={onRedirectToEdit}
              sx={{ textTransform: "none" }}
            >
              Edit user
            </Button>
          </div>
        </div>
      </div>
      <div className="group-details">
        <Box>
          <Box sx={{ display: "flex" }}>
            <Tabs
              value={value}
              onChange={handleTabChange}
              className="custom-tabs"
            >
              <Tab label="Groups" />
              <Tab label="Permissions" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <div id="groups-permissions">
              <div id="user-groups">
                {user?.groups?.map((item: any) => {
                  return (
                    <div style={{ marginTop: 15 }}>
                      <GroupCard group={item} showCheckBox={false} isViewPage />
                    </div>
                  );
                })}
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            Need to update it
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};

export default UserDetails;
