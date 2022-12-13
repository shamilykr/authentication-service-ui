import { FC } from "react";
import { NavLink } from "react-router-dom";

import "./styles.css";
import { ReactComponent as UsersIcon } from "assets/users.svg";
import { ReactComponent as GroupsIcon } from "assets/groups.svg";
import { ReactComponent as RolesIcon } from "assets/roles.svg";
import {
  groupFilterAtom,
  searchAtom,
  sortCountAtom,
  statusFilterAtom,
} from "../../states/searchSortFilterStates";
import { useSetRecoilState } from "recoil";

const SideBar: FC = ({}) => {
  const setCheckedStatus = useSetRecoilState(statusFilterAtom);
  const setCheckedGroups = useSetRecoilState(groupFilterAtom);
  const setCount = useSetRecoilState(sortCountAtom);
  const setSearchValue = useSetRecoilState(searchAtom);
  const clearAll = () => {
    setCheckedGroups([]);
    setCheckedStatus([]);
    setCount(0);
    setSearchValue("");
  };
  return (
    <nav>
      <div className="sideBarContainer">
        <NavLink
          to="/home/users"
          className={({ isActive }) =>
            isActive ? "active-text-link" : "text-link"
          }
          onClick={clearAll}
        >
          <UsersIcon className="sidebar-icon" />
          Users
        </NavLink>
        <NavLink
          to="/home/groups"
          className={({ isActive }) =>
            isActive ? "active-text-link" : "text-link"
          }
          onClick={clearAll}
        >
          <GroupsIcon className="sidebar-icon" />
          Groups
        </NavLink>

        <NavLink
          to="/home/roles"
          className={({ isActive }) =>
            isActive ? "active-text-link" : "text-link"
          }
          onClick={clearAll}
        >
          <RolesIcon className="sidebar-icon" />
          Roles
        </NavLink>
      </div>
    </nav>
  );
};
export default SideBar;
