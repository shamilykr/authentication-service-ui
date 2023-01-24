import {
  ApolloCache,
  ApolloError,
  BaseMutationOptions,
  DefaultContext,
  DocumentNode,
  OperationVariables,
  useMutation,
} from "@apollo/client";
import { useSetRecoilState } from "recoil";
import { apiRequestAtom, toastMessageAtom } from "states/apiRequestState";

export const useCustomMutation = (
  mutation: DocumentNode,
  onComplete?:
    | ((
        data: any,
        clientOptions?:
          | BaseMutationOptions<
              any,
              OperationVariables,
              DefaultContext,
              ApolloCache<any>
            >
          | undefined
      ) => void)
    | undefined,
  refetchQueries?: [{ query: DocumentNode }]
) => {
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  return useMutation(mutation, {
    refetchQueries: refetchQueries,
    onCompleted: (data) => {
      if (onComplete) {
        onComplete(data);
      }
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
    fetchPolicy: "network-only",
  });
};
