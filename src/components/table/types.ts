import {
  GridColumns,
  GridRowId,
  GridRowParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import { DocumentNode } from "graphql";
import { SetterOrUpdater } from "recoil";

export interface TableProps {
  field: string;
  rows: GridRowsProp;
  columns: GridColumns;
  buttonLabel: string;
  count: number;
  searchLabel: string;
  setItemList: (data: any) => void;
  deleteMutation: DocumentNode;
  refetchQuery: DocumentNode;
  editPermission?: string;
  deletePermission?: string;
  isViewVerified?: boolean;
  isAddVerified?: boolean;
  filterList?: never[];
  filterName?: string[];
  firstFilter?: never[];
  isViewFilterVerified?: boolean;
  setFirstFilter?: SetterOrUpdater<never[]>;
  secondFilter?: never[];
  setSecondFilter?: SetterOrUpdater<never[]>;
  handleRowClick?: (params: GridRowParams) => void;
  onAdd: () => void;
  onEdit: (id: GridRowId) => void;
}
