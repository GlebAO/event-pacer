import { useEffect, useMemo, useState } from "react";

export function useFormFields(initialState:any) {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function(e: {target: HTMLInputElement}) {
      setValues({
        ...fields,
        [e.target.id]: e.target.value
      });
    },
    setValues
  ];
}

interface initialStateInterface {
  loading: boolean,
  error: Error | null,
  data: null | []
}
export const useRequest = (request: () => Promise<any>):initialStateInterface => {

  const initialState = useMemo(
      () => ({
          loading: false,
          error: null,
          data: null,
      }),
      []
  );

  const [dataState, setDataState] = useState(initialState);

  useEffect(() => {
      setDataState({ loading: true, error: null, data: null });
      let cancelled = false;
      request()
          .then((data) => {
              if (!cancelled) {
                  setDataState({ data, error: null, loading: false });
                  return;
              }
              return;
          })
          .catch(
              (err) =>
                  !cancelled &&
                  setDataState({ data: null, error: err, loading: false })
          );

      return () => {
          cancelled = true
      }

  }, [initialState, request])

  return dataState;
};