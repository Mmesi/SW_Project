import { useAllUsers } from "../features/users/useAllUsers";
import ExistingUserRow from "./ExistingUserRow";
import Heading from "./Heading";
import Menus from "./Menus";
import Table from "./Table";

function ExistingUsers() {
  const { users, isLoading } = useAllUsers();

  if (isLoading) return <div>Loading...</div>;
  //   if (isError || !users)
  //     return <div>Error fetching users or no users available.</div>;

  if (users.length === 0) return <div>No users found</div>;
  return (
    <>
      <Heading>Existing Users</Heading>
      <Menus>
        <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
          <Table.Header>
            <div></div>
            <div>Email</div>
            <div>Full Name</div>
            <div>Role</div>
            <div>Date Created</div>
          </Table.Header>

          <Table.Body
            data={users}
            render={(user) => <ExistingUserRow user={user} key={user.id} />}
          />
        </Table>
      </Menus>
    </>
  );
}

export default ExistingUsers;
