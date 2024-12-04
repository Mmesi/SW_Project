import SignupForm from "../features/authentication/SignupForm";
import { useUser } from "../features/users/useUser";
import ExistingUsers from "../ui/ExistingUsers";
import Heading from "../ui/Heading";

function NewUsers() {
  const { user } = useUser();
  const role = user?.role;
  if (role !== "admin")
    return <Heading as="h1">You are not authorized to view users</Heading>;
  return (
    <>
      <ExistingUsers />
      <Heading as="h1">Create a new user</Heading>
      <SignupForm />
    </>
  );
}

export default NewUsers;
