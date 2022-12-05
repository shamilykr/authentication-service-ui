import { FC, useState } from "react";
import { Button, Divider } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { ApolloError, useQuery } from "@apollo/client";
import { useSetRecoilState } from "recoil";
import BottomFormController from "../../../../components/bottom-form-controller";

import { RoleFormSchema } from "../../roleSchema";
import "./styles.css";
import FormInputText from "../../../../components/inputText";
import { Role } from "../../../../types/role";
import { GET_ROLE } from "../../services/queries";
import {
  apiRequestAtom,
  toastMessageAtom,
} from "../../../../states/apiRequestState";

interface RoleFormProps {
  name: string;
  createRole: (inputs: FieldValues) => void;
  editRole: (inputs: FieldValues) => void;
}

const RoleForm: FC<RoleFormProps> = ({ name, createRole, editRole }) => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [role, setRole] = useState<Role>();
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const setToastMessage = useSetRecoilState(toastMessageAtom);

  const { loading } = useQuery(GET_ROLE, {
    skip: !id,
    variables: { id: id },
    onCompleted: (data) => {
      setRole(data?.getRole);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
  });

  const initialValues = {
    name: name,
  };

  const methods = useForm({
    resolver: yupResolver(RoleFormSchema),
    defaultValues: initialValues,
  });
  const { handleSubmit } = methods;

  const onSubmitForm = (input: FieldValues) => {
    id ? editRole(input) : createRole(input);
  };

  const onBackNavigation = () => {
    navigate("/home/roles");
  };

  return (
    <>
      <div>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className="form"
            id="role-form"
          >
            {!loading && (
              <>
                <FormInputText
                  name="name"
                  label="Role Name"
                  type="text"
                  className="role-name"
                  defaultText={role?.name}
                />
                <Divider sx={{ marginTop: "46px" }} />
              </>
            )}
          </form>
        </FormProvider>
      </div>
      <BottomFormController
        primarybuttonLabel={id ? "Update role" : "Create role"}
        primaryButtonType="submit"
        formId="role-form"
        onSubmit={() => handleSubmit(onSubmitForm)()}
        onCancel={onBackNavigation}
        secondaryButtonLabel="Cancel"
      />
    </>
  );
};

export default RoleForm;
