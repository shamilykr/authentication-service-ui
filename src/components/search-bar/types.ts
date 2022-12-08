import { DocumentNode } from "graphql";
export interface SearchBarProps {
  searchLabel: string;
  searchQuery: DocumentNode;
  setItemList: (data: any) => void;
  customSearchStyle?: any;
  customBarStyle?: any;
  customIconStyle?: any;
}
