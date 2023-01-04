import { FC } from "react";
import { NavLink } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { ReactComponent as UsersIcon } from "assets/sidebar-icons/users.svg";
import { ReactComponent as GroupsIcon } from "assets/sidebar-icons/groups.svg";
import { ReactComponent as RolesIcon } from "assets/sidebar-icons/roles.svg";
import { Entities } from "types/generic";
import "./styles.css";

const SideBar: FC = () => {
  const isDesktopScreen = useMediaQuery({ query: "(min-width: 1240px)" });
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
          {isDesktopScreen && Entities.USERS}
        </NavLink>
        <NavLink
          to="/home/groups"
          className={({ isActive }) =>
            isActive ? "active-text-link" : "text-link"
          }
        >
          <GroupsIcon className="sidebar-icon" />
          {isDesktopScreen && Entities.GROUPS}
        </NavLink>

        <NavLink
          to="/home/roles"
          className={({ isActive }) =>
            isActive ? "active-text-link" : "text-link"
          }
        >
          <RolesIcon className="sidebar-icon" />
          {isDesktopScreen && Entities.ROLES}
        </NavLink>
      </div>
    </nav>
  );
};
export default SideBar;
