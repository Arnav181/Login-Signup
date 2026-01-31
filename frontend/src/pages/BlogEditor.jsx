import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  createBlog,
  getBlogById,
  updateBlog,
} from "../services/blogService";

const colors = {
  navy: "#0A192F",
  lightNavy: "#112240",
  cardBg: "#1a2332",
  lightBlue: "#64FFDA",
  gray: "#8892B0",
  white: "#E6F1FF",
  error: "#ff6b6b",
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

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.navy} 0%, #0d1929 100%);
  padding: 60px 20px;
  color: ${colors.white};
`;

const Card = styled.div`
  max-width: 860px;
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

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, ${colors.white} 0%, ${colors.lightBlue} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${colors.gray};
  font-size: 0.95rem;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${colors.lightBlue};
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  background: ${colors.lightNavy};
  border: 2px solid transparent;
  border-radius: 10px;
  color: ${colors.white};
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${colors.lightBlue};
    background: rgba(100, 255, 218, 0.05);
  }

  &::placeholder {
    color: ${colors.gray};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 280px;
  padding: 14px 16px;
  background: ${colors.lightNavy};
  border: 2px solid transparent;
  border-radius: 10px;
  color: ${colors.white};
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${colors.lightBlue};
    background: rgba(100, 255, 218, 0.05);
  }

  &::placeholder {
    color: ${colors.gray};
  }
`;

const CharCount = styled.div`
  text-align: right;
  margin-top: 8px;
  font-size: 0.85rem;
  color: ${colors.gray};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 14px 32px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover:not(:disabled)::before {
    width: 300px;
    height: 300px;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${colors.lightBlue};
  color: ${colors.navy};
  flex: 1;

  &:hover:not(:disabled) {
    background: #52e6c6;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(100, 255, 218, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const CancelButton = styled(Button)`
  background: transparent;
  color: ${colors.gray};
  border: 2px solid ${colors.gray};

  &:hover:not(:disabled) {
    color: ${colors.white};
    border-color: ${colors.white};
  }
`;

const ValidationMessage = styled.div`
  color: ${colors.error};
  font-size: 0.9rem;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: "⚠️";
  }
`;

export default function BlogEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      getBlogById(id).then((blog) => {
        setTitle(blog.title);
        setContent(blog.content);
      });
    }
  }, [id, isEdit]);

  const validate = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    
    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.length < 10) {
      newErrors.content = "Content must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (isEdit) {
        await updateBlog(id, { title, content });
      } else {
        await createBlog({ title, content });
      }
      navigate("/profile/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Card>
        <Header>
          <Title>{isEdit ? "Edit Blog Post" : "Create New Blog"}</Title>
          <Subtitle>
            {isEdit ? "Update your blog post" : "Share your thoughts with the world"}
          </Subtitle>
        </Header>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter an engaging title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: null });
              }}
            />
            {errors.title && <ValidationMessage>{errors.title}</ValidationMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="content">Content</Label>
            <TextArea
              id="content"
              placeholder="Write your blog content here..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors({ ...errors, content: null });
              }}
            />
            <CharCount>
              {content.length} character{content.length !== 1 ? 's' : ''}
            </CharCount>
            {errors.content && <ValidationMessage>{errors.content}</ValidationMessage>}
          </FormGroup>

          <ButtonRow>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (isEdit ? "Updating..." : "Publishing...") 
                : (isEdit ? "Update Post" : "Publish Post")}
            </PrimaryButton>

            <CancelButton
              type="button"
              onClick={() => navigate("/profile/blogs")}
              disabled={isSubmitting}
            >
              Cancel
            </CancelButton>
          </ButtonRow>
        </form>
      </Card>
    </Container>
  );
}