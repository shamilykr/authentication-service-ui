import { FC } from "react";
import { NavLink } from "react-router-dom";

import "./styles.css";
import { ReactComponent as UsersIcon } from "../../assets/users.svg";
import { ReactComponent as GroupsIcon } from "../../assets/groups.svg";
import { ReactComponent as RolesIcon } from "../../assets/roles.svg";

const SideBar: FC = ({}) => {
  return (
    <nav>
      <div className="sideBarContainer">
        <NavLink
          to="/home/users"
          className={({ isActive }) =>
            isActive ? "active-text-link" : "text-link"
          }
        >
          <UsersIcon className="sidebar-icon" />
          Users
        </NavLink>
        <NavLink
          to="/home/groups"
          className={({ isActive }) =>
            isActive ? "active-text-link" : "text-link"
          }
        >
          <GroupsIcon className="sidebar-icon" />
          Groups
        </NavLink>

        <NavLink
          to="/home/roles"
          className={({ isActive }) =>
            isActive ? "active-text-link" : "text-link"
          }
        >
          <RolesIcon className="sidebar-icon" />
          Roles
        </NavLink>
      </div>
    </nav>
  );
};
export default SideBar;
