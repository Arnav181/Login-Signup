import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0f172a;
  padding: 1rem;
`;

const Card = styled.form`
  width: 100%;
  max-width: 420px;
  background: #1e293b;
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid #334155;

  @media (max-width: 480px) {
    padding: 2.5rem 2rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 0.95rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  animation: ${slideIn} 0.5s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #cbd5e1;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 10px;
  border: 2px solid ${props => props.error ? '#ef4444' : '#334155'};
  outline: none;
  font-size: 15px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  background: ${props => props.error ? '#1e1b1b' : '#0f172a'};
  color: #f1f5f9;

  &:focus {
    border-color: ${props => props.error ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }

  &::placeholder {
    color: #64748b;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: ${props => props.disabled ? '#475569' : '#3b82f6'};
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Message = styled.div`
  margin-top: 1.25rem;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
  animation: ${slideIn} 0.3s ease-out;
  background: ${props => props.isError ? '#1e1b1b' : '#0f2e1e'};
  color: ${props => props.isError ? '#ef4444' : '#22c55e'};
  border: 1px solid ${props => props.isError ? '#991b1b' : '#166534'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &::before {
    content: "${props => props.isError ? '⚠️' : '✓'}";
    font-size: 16px;
  }
`;

const FooterText = styled.div`
  margin-top: 2rem;
  text-align: center;
  font-size: 14px;
  color: #94a3b8;
`;

const StyledLink = styled(Link)`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;

  &:hover {
    color: #60a5fa;
    text-decoration: underline;
  }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: "⚠";
  }
`;

const PasswordStrength = styled.div`
  margin-top: 8px;
  height: 4px;
  background: #334155;
  border-radius: 2px;
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.strength}%;
    background: ${props => {
      if (props.strength < 30) return '#ef4444';
      if (props.strength < 70) return '#f59e0b';
      return '#22c55e';
    }};
    transition: all 0.3s ease;
  }
`;

const PasswordStrengthLabel = styled.div`
  font-size: 0.8rem;
  margin-top: 4px;
  color: ${props => {
    if (props.strength < 30) return '#ef4444';
    if (props.strength < 70) return '#f59e0b';
    return '#22c55e';
  }};
`;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 6) strength += 25;
    if (pwd.length >= 10) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const getStrengthLabel = (strength) => {
    if (strength === 0) return "";
    if (strength < 30) return "Weak";
    if (strength < 70) return "Fair";
    return "Strong";
  };

  const passwordStrength = calculatePasswordStrength(password);

  const validateFields = () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      setIsError(true);
      setMessage("Please fix the errors above");
      return;
    }

    try {
      setLoading(true);
      setIsError(false);
      setMessage("");

      const res = await axios.post(
        "https://login-signup-1hpi.onrender.com/api/auth/register",
        //"http://localhost:5000/api/auth/register",
        { name, email, password }
      );

      setMessage("Registration successful! You can now login.");
      setName("");
      setEmail("");
      setPassword("");
      setFieldErrors({});
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card onSubmit={handleSubmit}>
        <Header>
          <Title>Create Account</Title>
          <Subtitle>Sign up to get started</Subtitle>
        </Header>

        <InputGroup delay="0.1s">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors({ ...fieldErrors, name: null });
            }}
            error={fieldErrors.name}
          />
          {fieldErrors.name && <ErrorText>{fieldErrors.name}</ErrorText>}
        </InputGroup>

        <InputGroup delay="0.2s">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors({ ...fieldErrors, email: null });
            }}
            error={fieldErrors.email}
          />
          {fieldErrors.email && <ErrorText>{fieldErrors.email}</ErrorText>}
        </InputGroup>

        <InputGroup delay="0.3s">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors({ ...fieldErrors, password: null });
            }}
            error={fieldErrors.password}
          />
          {password && (
            <>
              <PasswordStrength strength={passwordStrength} />
              <PasswordStrengthLabel strength={passwordStrength}>
                {getStrengthLabel(passwordStrength)}
              </PasswordStrengthLabel>
            </>
          )}
          {fieldErrors.password && <ErrorText>{fieldErrors.password}</ErrorText>}
        </InputGroup>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </Button>

        {message && (
          <Message isError={isError}>
            {message}
          </Message>
        )}

        <FooterText>
          Already have an account?{" "}
          <StyledLink to="/">
            Login
          </StyledLink>
        </FooterText>
      </Card>
    </Container>
  );
}

export default Register;