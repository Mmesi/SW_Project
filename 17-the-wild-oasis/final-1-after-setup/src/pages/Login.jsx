import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";
import { useUser } from "../features/users/useUser";
import { useEffect } from "react";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

function Login() {
  const { isLoading, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show LoginForm if not authenticated and not loading
  if (!isLoading && !isAuthenticated) {
    return (
      <LoginLayout>
        <Logo />
        <Heading as="h4">Log in to your account</Heading>
        <LoginForm />
      </LoginLayout>
    );
  }

  return null;
}

export default Login;
