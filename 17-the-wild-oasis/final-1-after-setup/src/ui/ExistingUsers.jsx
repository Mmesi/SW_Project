import { useAllUsers } from "../features/authentication/useAllUsers";
import ExistingUserRow from "./ExistingUserRow";
import Heading from "./Heading";
import Menus from "./Menus";
import Table from "./Table";

function ExistingUsers() {
  const { users, isLoading } = useAllUsers();
  console.log(users);

  if (isLoading) return <div>Loading...</div>;
  //   if (isError || !users)
  //     return <div>Error fetching users or no users available.</div>;

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
            // data={cabins}
            // data={filteredCabins}
            data={users}
            render={(user) => <ExistingUserRow user={user} key={user.id} />}
          />
        </Table>
      </Menus>
    </>
  );
}

export default ExistingUsers;
