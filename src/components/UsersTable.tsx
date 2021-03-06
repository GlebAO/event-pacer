import React, { useCallback } from "react";
import { getResource } from "../utils/fetchUtils";
import { useRequest } from "../utils/hookUtils";

const UsersTable = () => {
  const useUsers = () => {
    const request = useCallback(() => {
      return getResource("/user/orgs?subscribed=false&len=10");
    }, []);

    return useRequest(request);
  };

  const dataState = useUsers();
  const { loading, data, error } = dataState;

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p>error..</p>;
  }

  if (!data || data.length === 0) {
    return <p>Список пуст</p>;
  }

  return (
    <table>
      <tbody>
        {data.map((item: { name: string; orgId: number }) => {
          return (
            <tr key={item.orgId}>
              <td>{item.name}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UsersTable;
