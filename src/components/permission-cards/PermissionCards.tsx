import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRecoilState } from "recoil";

import { GET_ENTITIES } from "services/queries/entityQueries";
import { Entity } from "types/generic";
import { useCustomQuery } from "hooks/useQuery";
import DisplayMessage from "components/display-message";
import { IsViewEntitiesVerifiedAtom } from "states/permissionsStates";
import {
  ACCESS_DENIED_DESCRIPTION,
  ACCESS_DENIED_MESSAGE,
} from "constants/messages";
import PermissionsCard from "../permission-card";
import { PermissionCardsProps } from "./types";
import "./styles.css";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  margin-top: 20px;
  height: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
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
