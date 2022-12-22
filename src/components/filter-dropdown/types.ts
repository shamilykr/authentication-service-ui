import { DocumentNode } from "graphql";
import { SetterOrUpdater } from "recoil";

export interface FilterDropdownProps {
  firstFilter?: never[];
  setFirstFilter?: SetterOrUpdater<never[]>;
  secondFilter?: never[];
  setSecondFilter?: SetterOrUpdater<never[]>;
  isViewFilterVerified?: boolean;
  searchQuery: DocumentNode;
  setItemList: any;
  field: string;
  filterList?: never[];
  open: boolean;
  anchorEl: any;
  onApply: (count: number) => void;
  filterName: string[];
  currentFilters: any;
}
