import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../services/apiAuth";

export function useAllUsers() {
  const { isLoading, data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  return { isLoading, users };
}
