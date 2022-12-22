import { SetterOrUpdater } from "recoil";

export interface FilterProps {
  itemList: string[] | never[];
  onAddFilter: (
    name: string,
    e: React.ChangeEvent<HTMLInputElement>,
    checkedItems: never[],
    setCheckedItems: React.Dispatch<React.SetStateAction<never[]>>
  ) => void;
  checkedItems: never[];
  setCheckedItems: SetterOrUpdater<never[]>;
  handleCheckedItems: (item: string, checkedItems: never[]) => boolean;
}
