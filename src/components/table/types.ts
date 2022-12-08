import {
  GridColumns,
  GridRowId,
  GridRowParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import { DocumentNode } from "graphql";

export interface TableProps {
  rows: GridRowsProp;
  columns: GridColumns;
  buttonLabel: string;
  text: string;
  count: number;
  searchLabel: string;
  setItemList: (data: any) => void;
  entity: string;
  deleteMutation: DocumentNode;
  refetchQuery: DocumentNode;
  editPermission?: string;
  deletePermission?: string;
  isViewVerified?: boolean;
  isAddVerified?: boolean;
  actionFlex: number;
  cursorType: string;
  handleRowClick?: (params: GridRowParams) => void;
  onAdd: () => void;
  onEdit: (id: GridRowId) => void;
}
