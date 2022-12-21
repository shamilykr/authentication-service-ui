import { DocumentNode } from "graphql";
import { SetterOrUpdater } from "recoil";

export interface TableToolBarProps {
  field: string;
  buttonLabel: string;
  searchLabel: string;
  searchQuery: DocumentNode;
  setItemList: any;
  firstFilter?: never[];
  filterName?: string[];
  setFirstFilter?: SetterOrUpdater<never[]>;
  secondFilter?: never[];
  setSecondFilter?: SetterOrUpdater<never[]>;
  isAddVerified?: boolean;
  filterList?: never[];
  isViewFilterVerified?: boolean;
  onAdd?: () => void;
}
