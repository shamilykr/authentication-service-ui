export interface BottomControllerProps {
  primarybuttonLabel: string;
  onSubmit: (data: any) => void;
  formId: string;
  onCancel: () => void;
  secondaryButtonLabel: string;
}
