import { FC, useState } from "react";
import { useRecoilState } from "recoil";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { TextField, Button } from "@mui/material";

import { paginationAtom } from "states/searchSortFilterStates";
import { ApiParams } from "utils/table";

interface CustomPaginationProps {
  fetchEntities: ({ searchText, countValue, page }: ApiParams) => void;
  count: number;
}

const CustomPagination: FC<CustomPaginationProps> = ({
  fetchEntities,
  count,
}) => {
  const [currentPage, setCurrentPage] = useRecoilState(paginationAtom);

  const [pageValue, setPageValue] = useState(currentPage);
  const [pageCount] = useState(
    count % 15 > 0 ? Math.floor(count / 15) + 1 : Math.floor(count / 15)
  );
  const onClickGo = () => {
    if (!isNaN(pageValue)) {
      if (pageValue > pageCount) setCurrentPage(pageCount);
      else if (pageValue < 1) setCurrentPage(1);
      else setCurrentPage(Number(pageValue));
      fetchEntities({
        page:
          pageValue > pageCount
            ? pageCount - 1
            : pageValue < 1
            ? 0
            : pageValue - 1,
      });
    }
  };

  return (
    <>
      <div className="pagination-count">
        Total {`${count}`} item{count > 1 && `s`}
      </div>
      <Pagination
        color="primary"
        variant="outlined"
        shape="rounded"
        page={currentPage}
        count={pageCount}
        // @ts-expect-error
        renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
        onChange={(event, value) => {
          setPageValue(value);
          setCurrentPage(value);
          fetchEntities({ page: value - 1 });
        }}
      />
      <div className="go-to-page">
        <div id="pagination-text">Go to Page</div>
        <div>
          <TextField
            type="number"
            defaultValue={currentPage}
            onChange={(e: any) => {
              setPageValue(e.target.value);
            }}
            inputProps={{
              min: 0,
              style: { textAlign: "center", padding: 0 },
            }}
            sx={{ ml: "9px", mr: "9px" }}
          />
        </div>
        <div>
          <Button id="go-button" onClick={onClickGo}>
            Go
          </Button>
        </div>
      </div>
    </>
  );
};

export default CustomPagination;
