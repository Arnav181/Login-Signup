import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllBlogs } from "../services/blogService";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const colors = {
  navy: "#0A192F",
  lightNavy: "#112240",
  cardBg: "#1a2332",
  lightBlue: "#64FFDA",
  gray: "#8892B0",
  white: "#E6F1FF",
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

const InnerContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 48px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h2`
  font-size: 2.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, ${colors.white} 0%, ${colors.lightBlue} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  color: ${colors.gray};
  font-size: 1.1rem;
  margin-top: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    
    button {
      flex: 1;
    }
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PrimaryButton = styled(Button)`
  background: ${colors.lightBlue};
  color: ${colors.navy};

  &:hover {
    background: #52e6c6;
    box-shadow: 0 8px 20px rgba(100, 255, 218, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(100, 255, 218, 0.1);
  color: ${colors.lightBlue};
  border: 1px solid ${colors.lightBlue};

  &:hover {
    background: rgba(100, 255, 218, 0.2);
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 24px;
  color: ${colors.gray};
  font-size: 0.95rem;
  margin-top: 16px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span:first-child {
    font-weight: 600;
    color: ${colors.lightBlue};
    font-size: 1.2rem;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 28px;
  animation: ${fadeIn} 0.8s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BlogCard = styled.div`
  background: ${colors.cardBg};
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(100, 255, 218, 0.1);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    border-color: ${colors.lightBlue};
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  }
`;

const CardHeader = styled.div`
  padding: 24px 24px 20px;
  background: linear-gradient(135deg, rgba(100, 255, 218, 0.05) 0%, transparent 100%);
`;

const BlogTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 1.5rem;
  color: ${colors.white};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${colors.lightBlue};
  }
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: ${colors.gray};

  &::before {
    content: "${props => props.icon || '📅'}";
  }
`;

const CardBody = styled.div`
  padding: 0 24px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BlogExcerpt = styled.p`
  color: ${colors.gray};
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReadMoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${colors.lightBlue};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    gap: 12px;
    color: ${colors.white};
  }

  &::after {
    content: "→";
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: translateX(4px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 120px 20px;
  color: ${colors.gray};
  animation: ${fadeIn} 0.6s ease-out;
`;

const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 24px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 1.3rem;
  margin-bottom: 12px;
`;

const EmptySubtext = styled.p`
  font-size: 1rem;
`;

const LoadingContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 28px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingSkeleton = styled.div`
  background: ${colors.cardBg};
  padding: 24px;
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
  margin-bottom: ${props => props.margin || '12px'};
  width: ${props => props.width || '100%'};
`;

export default function PublicBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllBlogs()
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getExcerpt = (content) => {
    if (!content) return "No preview available...";
    return content.length > 150 ? content.substring(0, 150) + "..." : content;
  };

  if (loading) {
    return (
      <Container>
        <InnerContainer>
          <Header>
            <SkeletonLine height="50px" width="250px" margin="24px" />
          </Header>
          <LoadingContainer>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i}>
                <SkeletonLine height="36px" width="80%" />
                <SkeletonLine height="20px" width="40%" margin="20px" />
                <SkeletonLine height="80px" />
              </LoadingSkeleton>
            ))}
          </LoadingContainer>
        </InnerContainer>
      </Container>
    );
  }

  return (
    <Container>
      <InnerContainer>
        <Header>
          <TopBar>
            <div>
              <Title>Explore Blogs</Title>
              <Subtitle>Discover stories from our community</Subtitle>
              <Stats>
                <Stat>
                  <span>{blogs.length}</span>
                  <span>Blog{blogs.length !== 1 ? 's' : ''}</span>
                </Stat>
              </Stats>
            </div>
            <ButtonGroup>
              <PrimaryButton onClick={() => navigate("/profile/blogs")}>
                ✏️ My Blogs
              </PrimaryButton>
              <SecondaryButton onClick={() => navigate("/profile")}>
                👤 Profile
              </SecondaryButton>
            </ButtonGroup>
          </TopBar>
        </Header>

        {blogs.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📚</EmptyIcon>
            <EmptyText>No blogs published yet</EmptyText>
            <EmptySubtext>Be the first to share your story!</EmptySubtext>
          </EmptyState>
        ) : (
          <BlogGrid>
            {blogs.map((blog, index) => (
              <BlogCard key={blog._id} delay={`${index * 0.05}s`}>
                <CardHeader>
                  <Link
                    to={`/blogs/${blog._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <BlogTitle>{blog.title}</BlogTitle>
                  </Link>
                  <BlogMeta>
                    <MetaItem icon="📅">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </MetaItem>
                    <MetaItem icon="✍️">
                      {blog.author?.name || "Anonymous"}
                    </MetaItem>
                  </BlogMeta>
                </CardHeader>
                <CardBody>
                  <BlogExcerpt>{getExcerpt(blog.content)}</BlogExcerpt>
                  <ReadMoreLink to={`/blogs/${blog._id}`}>
                    Read Full Story
                  </ReadMoreLink>
                </CardBody>
              </BlogCard>
            ))}
          </BlogGrid>
        )}
      </InnerContainer>
    </Container>
  );
}