import { DocumentNode } from "graphql";
import { SetterOrUpdater } from "recoil";

export interface TableToolBarProps {
  field: string;
  buttonLabel: string;
  text: string;
  searchLabel: string;
  searchQuery: DocumentNode;
  setItemList: any;
  firstFilter?: never[];
  firstFilterName?: string;
  secondFilterName?: string;
  setFirstFilter?: SetterOrUpdater<never[]>;
  secondFilter?: never[];
  setSecondFilter?: SetterOrUpdater<never[]>;
  isAddVerified?: boolean;
  filterList?: any;
  onAdd?: () => void;
}
