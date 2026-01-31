import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { fetchMyBlogs, deleteBlog } from "../services/blogService";
import { Link } from "react-router-dom";

const colors = {
  navy: "#0A192F",
  lightNavy: "#112240",
  cardBg: "#1a2332",
  lightBlue: "#64FFDA",
  gray: "#8892B0",
  white: "#E6F1FF",
  red: "#ff6b6b",
  green: "#51cf66",
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
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 40px;
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
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, ${colors.white} 0%, ${colors.lightBlue} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    
    button {
      flex: 1;
      min-width: 120px;
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
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  animation: ${fadeIn} 0.8s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BlogCard = styled.div`
  background: ${colors.cardBg};
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(100, 255, 218, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  animation: ${fadeIn} 0.6s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-4px);
    border-color: ${colors.lightBlue};
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  }
`;

const BlogTitle = styled.h3`
  margin-bottom: 12px;
  font-size: 1.4rem;
  color: ${colors.white};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.lightBlue};
  }
`;

const BlogMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: ${colors.gray};

  &::before {
    content: "${props => props.icon || ''}";
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(100, 255, 218, 0.1);
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
  flex: 1;
  min-width: fit-content;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ReadButton = styled(ActionButton)`
  background: transparent;
  color: ${colors.lightBlue};
  border: 1px solid ${colors.lightBlue};

  &:hover {
    background: rgba(100, 255, 218, 0.1);
  }
`;

const EditButton = styled(ActionButton)`
  background: ${colors.lightBlue};
  color: ${colors.navy};

  &:hover {
    background: #52e6c6;
  }
`;

const DeleteButton = styled(ActionButton)`
  background: ${colors.red};
  color: white;

  &:hover {
    background: #ff5252;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: ${colors.gray};
  animation: ${fadeIn} 0.6s ease-out;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 24px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 12px;
`;

const EmptySubtext = styled.p`
  font-size: 0.95rem;
  margin-bottom: 32px;
`;

const LoadingSkeleton = styled.div`
  background: ${colors.cardBg};
  padding: 24px;
  border-radius: 12px;
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

export default function BlogDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBlogs()
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      await deleteBlog(id);
      setBlogs(blogs.filter((b) => b._id !== id));
    }
  };

  if (loading) {
    return (
      <Container>
        <InnerContainer>
          <Header>
            <SkeletonLine height="40px" width="200px" margin="24px" />
          </Header>
          <BlogGrid>
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i}>
                <SkeletonLine height="30px" width="80%" />
                <SkeletonLine height="20px" width="40%" />
                <SkeletonLine height="60px" margin="20px" />
              </LoadingSkeleton>
            ))}
          </BlogGrid>
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
              <Title>My Blogs</Title>
              <Stats>
                <Stat>
                  <span>{blogs.length}</span>
                  <span>Post{blogs.length !== 1 ? 's' : ''}</span>
                </Stat>
              </Stats>
            </div>
            <ButtonGroup>
              <PrimaryButton onClick={() => navigate("/profile/blogs/new")}>
                 New Blog
              </PrimaryButton>
              <SecondaryButton onClick={() => navigate("/blogs")}>
                 Read Blogs
              </SecondaryButton>
              <SecondaryButton onClick={() => navigate("/profile")}>
                 Profile
              </SecondaryButton>
            </ButtonGroup>
          </TopBar>
        </Header>

        {blogs.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📝</EmptyIcon>
            <EmptyText>No blogs yet</EmptyText>
            <EmptySubtext>Start sharing your thoughts with the world!</EmptySubtext>
            <PrimaryButton onClick={() => navigate("/profile/blogs/new")}>
              Create Your First Blog
            </PrimaryButton>
          </EmptyState>
        ) : (
          <BlogGrid>
            {blogs.map((blog, index) => (
              <BlogCard key={blog._id} delay={`${index * 0.1}s`}>
                <Link
                  to={`/blogs/${blog._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <BlogTitle>{blog.title}</BlogTitle>
                </Link>

                <BlogMeta>
                  <MetaItem icon="">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </MetaItem>
                  <MetaItem icon="">
                    {blog.author?.name || "You"}
                  </MetaItem>
                </BlogMeta>

                <ActionRow>
                  <ReadButton onClick={() => navigate(`/blogs/${blog._id}`)}>
                     Read
                  </ReadButton>
                  <EditButton onClick={() => navigate(`/profile/blogs/edit/${blog._id}`)}>
                     Edit
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(blog._id)}>
                     Delete
                  </DeleteButton>
                </ActionRow>
              </BlogCard>
            ))}
          </BlogGrid>
        )}
      </InnerContainer>
    </Container>
  );
}