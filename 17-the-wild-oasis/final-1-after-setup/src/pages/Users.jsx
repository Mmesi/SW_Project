import SignupForm from "../features/authentication/SignupForm";
import { useUser } from "../features/authentication/useUser";
import Heading from "../ui/Heading";

function NewUsers() {
  const { user } = useUser();
  const role = user?.role;
  if (role !== "admin")
    return (
      <Heading as="h1">You are not authorized to create new users</Heading>
    );
  return (
    <>
      <Heading as="h1">Create a new user</Heading>
      <SignupForm />
    </>
  );
}

export default NewUsers;
