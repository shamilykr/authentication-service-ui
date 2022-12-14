import React, { useState } from "react";

import "./styles.css";
import styled from "@emotion/styled";
import { useRecoilState } from "recoil";
import { Permission } from "types/user";
import PermissionsCard from "../permission-card/PermissionCard";
import { Role } from "types/role";
import { GET_ENTITIES } from "containers/entities/services/queries";
import { Entity } from "types/generic";
import { Group } from "types/group";
import { useCustomQuery } from "hooks/useQuery";
import DisplayMessage from "components/display-message";
import { IsViewEntitiesVerifiedAtom } from "states/permissionsStates";

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
  const [isViewEntitiesVerified] = useRecoilState(IsViewEntitiesVerifiedAtom);

  const onCompleted = (data: any) => {
    setEntities(data?.getEntities);
  };

  useCustomQuery(GET_ENTITIES, onCompleted, null, !isViewEntitiesVerified);

  return (
    <Container>
      {isViewEntitiesVerified ? (
        <>
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
        </>
      ) : (
        <div style={{ width: "100%" }}>
          <DisplayMessage
            customStyle={{ fontSize: 16 }}
            altMessage="Access Denied"
            image="./assets/access-denied.png"
            heading="Access Denied"
            description="Sorry, you are not allowed to view this page."
          />
        </div>
      )}
    </Container>
  );
};

export default PermissionCards;
