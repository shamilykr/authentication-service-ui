import { FC } from "react";
import { NavLink } from "react-router-dom";

import { ReactComponent as UsersIcon } from "assets/sidebar-icons/users.svg";
import { ReactComponent as GroupsIcon } from "assets/sidebar-icons/groups.svg";
import { ReactComponent as RolesIcon } from "assets/sidebar-icons/roles.svg";
import { Entities } from "types/generic";
import "./styles.css";

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
