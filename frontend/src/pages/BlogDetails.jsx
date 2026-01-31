import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const colors = {
  navy: "#0A192F",
  lightNavy: "#112240",
  cardBg: "#1a2332",
  lightBlue: "#64FFDA",
  gray: "#8892B0",
  white: "#E6F1FF",
  accent: "#64FFDA",
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.navy} 0%, #0d1929 100%);
  padding: 60px 20px;
  color: ${colors.white};
`;

const Card = styled.div`
  max-width: 900px;
  margin: auto;
  background: ${colors.cardBg};
  padding: 48px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(100, 255, 218, 0.1);
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  color: ${colors.lightBlue};
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 8px 0;

  &:hover {
    gap: 12px;
    color: ${colors.white};
  }

  &::before {
    content: "←";
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: translateX(-4px);
  }
`;

const Title = styled.h1`
  margin-bottom: 16px;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  background: linear-gradient(135deg, ${colors.white} 0%, ${colors.lightBlue} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MetaContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(100, 255, 218, 0.1);
  flex-wrap: wrap;
`;

const AuthorBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(100, 255, 218, 0.1);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: ${colors.lightBlue};
  font-weight: 500;

  &::before {
    content: "✍️";
  }
`;

const DateBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${colors.gray};
  font-size: 0.9rem;

  &::before {
    content: "📅";
  }
`;

const Content = styled.div`
  line-height: 1.8;
  white-space: pre-wrap;
  font-size: 1.05rem;
  color: ${colors.white};
  
  p {
    margin-bottom: 1rem;
  }
`;

const LoadingContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingSkeleton = styled.div`
  max-width: 900px;
  width: 100%;
  background: ${colors.cardBg};
  padding: 48px;
  border-radius: 16px;
  border: 1px solid rgba(100, 255, 218, 0.1);
`;

const SkeletonLine = styled.div`
  height: ${props => props.height || '20px'};
  background: linear-gradient(
    90deg,
    rgba(100, 255, 218, 0.05) 0%,
    rgba(100, 255, 218, 0.15) 50%,
    rgba(100, 255, 218, 0.05) 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  margin-bottom: ${props => props.margin || '16px'};
  width: ${props => props.width || '100%'};
`;

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`http://login-signup-1hpi.onrender.com/api/blogs/${id}`)
      .then((res) => res.json())
      .then(setBlog);
  }, [id]);

  if (!blog) {
    return (
      <LoadingContainer>
        <LoadingSkeleton>
          <SkeletonLine width="60%" height="40px" margin="32px" />
          <SkeletonLine width="40%" height="20px" margin="24px" />
          <SkeletonLine width="100%" height="200px" />
        </LoadingSkeleton>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Card>
        <BackLink to="/blogs">Back to Dashboard</BackLink>

        <Title>{blog.title}</Title>
        
        <MetaContainer>
          <AuthorBadge>
            {blog.author?.name || "Unknown"}
          </AuthorBadge>
          <DateBadge>
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </DateBadge>
        </MetaContainer>

        <Content>{blog.content}</Content>
      </Card>
    </Container>
  );
}