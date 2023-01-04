import { InputBase } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ReactComponent as SearchIcon } from "assets/toolbar-icons/search.svg";

import { useSetRecoilState } from "recoil";
import { searchAtom } from "states/searchSortFilterStates";
import { useFetchEntities } from "hooks/useFetchEntities";
import { SearchBarProps } from "./types";
import "./styles.css";

const SearchBar: FC<SearchBarProps> = ({
  searchLabel,
  setItemList,
  searchQuery,
  customSearchStyle,
  customBarStyle,
  customIconStyle,
}) => {
  const setSearchValue = useSetRecoilState(searchAtom);
  const [field, setField] = useState("");

  useEffect(() => {
    if (
      searchLabel.includes("First Name") ||
      searchLabel.includes("Search Members")
    ) {
      setField("firstName");
    } else {
      setField("name");
    }
  }, []);

  const fetchEntities = useFetchEntities({
    userParams: { setList: setItemList, query: searchQuery, field: field },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const delayedSearch = (text?: string) => {
      fetchEntities({ searchText: text });
    };
    const delayDebounce = setTimeout(() => {
      setSearchValue(e.target.value);
      delayedSearch(e.target.value);
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
          sx={{ width: "87%", ml: "30px", fontFamily: "Manrope" }}
        />
      </div>
      <div className="search-icon" style={customIconStyle}>
        <SearchIcon id="search-icon" />
      </div>
    </div>
  );
};
export default SearchBar;
