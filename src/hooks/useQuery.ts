import { useQuery, ApolloError } from "@apollo/client";
import { useSetRecoilState } from "recoil";
import { apiRequestAtom, toastMessageAtom } from "states/apiRequestState";

export const useCustomQuery = (
  query: any,
  onComplete: any,
  variables?: any,
  skip?: boolean | undefined
) => {
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const { loading, data, error } = useQuery(query, {
    skip: skip,
    variables: variables,
    onCompleted: (data) => {
      onComplete(data);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
    fetchPolicy: "network-only",
  });
  return { loading, data, error };
};
