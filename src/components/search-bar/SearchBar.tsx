import { InputBase } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ReactComponent as SearchIcon } from "assets/search.svg";

import { SearchBarProps } from "./types";
import "./styles.css";
import { useRecoilState } from "recoil";
import { searchAtom } from "../../states/searchSortFilterStates";
import { useUsersFetch } from "../../hooks/usersFetch";

const SearchBar: FC<SearchBarProps> = ({
  searchLabel,
  setItemList,
  searchQuery,
  customSearchStyle,
  customBarStyle,
  customIconStyle,
}) => {
  const [searchValue, setSearchValue] = useRecoilState(searchAtom);
  const [field, setField] = useState("");
  useEffect(() => {
    if (searchLabel.includes("First Name")) {
      setField("firstName");
    } else {
      setField("name");
    }
  }, []);
  const fetchUsers = useUsersFetch({
    userParams: { setList: setItemList, query: searchQuery, field: field },
  });

  useEffect(() => {
    fetchUsers();
  }, [searchValue]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const delayDebounce = setTimeout(() => {
      setSearchValue(e.target.value);
    }, 1000);
    return () => clearTimeout(delayDebounce);
  };

  return (
    <div className="search" style={customSearchStyle}>
      <div className="search-bar" style={customBarStyle}>
        <InputBase
          placeholder={searchLabel}
          onChange={(e) => {
            handleChange(e);
          }}
        />
      </div>
      <div className="search-icon" style={customIconStyle}>
        <SearchIcon />
      </div>
    </div>
  );
};
export default SearchBar;
