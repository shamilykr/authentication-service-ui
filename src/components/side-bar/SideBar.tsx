import { FC } from "react";
import { NavLink } from "react-router-dom";

import "./styles.css";
import { ReactComponent as UsersIcon } from "assets/users.svg";
import { ReactComponent as GroupsIcon } from "assets/groups.svg";
import { ReactComponent as RolesIcon } from "assets/roles.svg";
import { Entities } from "types/generic";

const SideBar: FC = () => {
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
          {Entities.USERS}
        </NavLink>
        <NavLink
          to="/home/groups"
          className={({ isActive }) =>
            isActive ? "active-text-link" : "text-link"
          }
        >
          <GroupsIcon className="sidebar-icon" />
          {Entities.GROUPS}
        </NavLink>

        <NavLink
          to="/home/roles"
          className={({ isActive }) =>
            isActive ? "active-text-link" : "text-link"
          }
        >
          <RolesIcon className="sidebar-icon" />
          {Entities.ROLES}
        </NavLink>
      </div>
    </nav>
  );
};
export default SideBar;
