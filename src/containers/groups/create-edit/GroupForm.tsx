import { FC } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import BottomFormController from "components/bottom-form-controller";

import { GroupFormSchema } from "utils/groups";
import FormInputText from "components/input-text";
import { RoutePaths } from "constants/routes";
import { AddEntity, UpdateEntity } from "types/generic";
import "./styles.css";

interface GroupFormProps {
  name: string;
  createGroup: (inputs: FieldValues) => void;
  editGroup: (inputs: FieldValues) => void;
}

const GroupForm: FC<GroupFormProps> = ({ name, createGroup, editGroup }) => {
  const navigate = useNavigate();

  const { id } = useParams();

  const initialValues = {
    name: name,
  };

  const methods = useForm({
    resolver: yupResolver(GroupFormSchema),
    defaultValues: initialValues,
  });
  const { handleSubmit } = methods;

  const onSubmitForm = (input: FieldValues) => {
    id ? editGroup(input) : createGroup(input);
  };

  const onBackNavigation = () => {
    navigate(RoutePaths.groupsUrl);
  };

  return (
    <>
      <div>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className="group-form"
            id="group-form"
          >
            <FormInputText
              name="name"
              label="Group Name"
              type="text"
              className="group-name"
              defaultText={name}
            />
          </form>
        </FormProvider>
      </div>
      <BottomFormController
        primarybuttonLabel={
          id ? UpdateEntity.UPDATE_GROUP : AddEntity.CREATE_GROUP
        }
        formId="group-form"
        onSubmit={() => handleSubmit(onSubmitForm)()}
        onCancel={onBackNavigation}
        secondaryButtonLabel="Cancel"
      />
    </>
  );
};

export default GroupForm;
