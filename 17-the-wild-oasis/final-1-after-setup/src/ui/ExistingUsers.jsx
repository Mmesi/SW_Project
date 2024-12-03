import { useAllUsers } from "../features/authentication/useAllUsers";

function ExistingUsers() {
  const { users, isLoading } = useAllUsers();

  if (isLoading) return <div>Loading...</div>;
  //   if (isError || !users)
  //     return <div>Error fetching users or no users available.</div>;

  return (
    <div>
      <h2>Existing Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Date Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.user_metadata?.full_name || "N/A"}</td>
              <td>{user.role}</td>
              <td>{user.dateCreated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExistingUsers;
