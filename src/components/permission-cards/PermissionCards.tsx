import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRecoilState } from "recoil";

import "./styles.css";
import { Permission } from "types/user";
import PermissionsCard from "../permission-card";
import { Role } from "types/role";
import { GET_ENTITIES } from "services/queries/entityQueries";
import { Entity } from "types/generic";
import { Group } from "types/group";
import { useCustomQuery } from "hooks/useQuery";
import DisplayMessage from "components/display-message";
import { IsViewEntitiesVerifiedAtom } from "states/permissionsStates";
import {
  ACCESS_DENIED_DESCRIPTION,
  ACCESS_DENIED_MESSAGE,
} from "constants/messages";

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
              key={entity?.id}
            />
          ))}
        </>
      ) : (
        <div style={{ width: "100%" }}>
          <DisplayMessage
            customStyle={{ fontSize: 16 }}
            altMessage={ACCESS_DENIED_MESSAGE}
            image="./assets/access-denied.png"
            heading={ACCESS_DENIED_MESSAGE}
            description={ACCESS_DENIED_DESCRIPTION}
          />
        </div>
      )}
    </Container>
  );
};

export default PermissionCards;
