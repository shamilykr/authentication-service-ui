import { InputBase } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { ReactComponent as SearchIcon } from "assets/search.svg";

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
  const [searchValue, setSearchValue] = useState("");

  const [searchItemQuery] = useLazyQuery(searchQuery, {
    variables: {
      value: searchValue,
    },
    onCompleted: (data) => {
      setItemList(data);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const delayDebounce = setTimeout(() => {
      setSearchValue(e.target.value);
    }, 1000);
    return () => clearTimeout(delayDebounce);
  };

  useEffect(() => {
    if (searchValue.length !== 0) searchItemQuery(); // eslint-disable-next-line
  }, [searchValue]);

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
