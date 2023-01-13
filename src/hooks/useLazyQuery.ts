import { useLazyQuery, ApolloError } from "@apollo/client";
import { useSetRecoilState } from "recoil";

import { apiRequestAtom, toastMessageAtom } from "states/apiRequestState";

export const useCustomLazyQuery = (
  query: any,
  onComplete?: any,
  variables?: any
) => {
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const [lazyQuery, { loading, data, error }] = useLazyQuery(query, {
    variables: variables,
    onCompleted: (data) => {
      onComplete(data);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
    fetchPolicy: "no-cache",
  });
  return { lazyQuery, loading, data, error };
};
