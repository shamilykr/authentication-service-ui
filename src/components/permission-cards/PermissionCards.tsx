import { ApolloError, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";

import "./styles.css";
import styled from "@emotion/styled";

import { Permission } from "../../types/user";
import { apiRequestAtom, toastMessageAtom } from "../../states/apiRequestState";
import PermissionsCard from "../permission-card/PermissionCard";
import { Role } from "../../types/role";
import { GET_ENTITIES } from "../../containers/entities/services/queries";
import { Entity } from "../../types/generic";
import { Group } from "../../types/group";

interface PermissionCardsProps {
  userSelectedPermissions?: Permission[];
  roles?: Role[];
  groups?: Group[];
  setUserSelectedPermissions?: React.Dispatch<
    React.SetStateAction<Permission[]>
  >;
  userPermissions?: Permission[];
  isViewPage?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  margin-top: 20px;
`;

const PermissionCards: React.FC<PermissionCardsProps> = ({
  userSelectedPermissions = [],
  roles = [],
  groups = [],
  setUserSelectedPermissions = () => null,
  userPermissions = [],
  isViewPage = false,
}) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  useQuery(GET_ENTITIES, {
    onCompleted: (data) => {
      setEntities(data?.getEntities);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
  });

  return (
    <Container>
      {entities.map((entity) => (
        <PermissionsCard
          entity={entity}
          roles={roles}
          groups={groups}
          userSelectedPermissions={userSelectedPermissions}
          setUserSelectedPermissions={setUserSelectedPermissions}
          userPermissions={userPermissions}
          isViewPage={isViewPage}
        />
      ))}
    </Container>
  );
};

export default PermissionCards;
