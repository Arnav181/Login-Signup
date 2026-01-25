import { useState } from "react";
import styled from "styled-components";

const Form = styled.form`
  margin-bottom: 24px;
`;

const Title = styled.h3`
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 8px 14px;
  cursor: pointer;
`;

const Error = styled.p`
  color: red;
  margin-bottom: 8px;
`;


const TaskForm = ({ onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    await onCreate({ title, description });

    setTitle("");
    setDescription("");
    setError("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Create Task</Title>

      {error && <Error>{error}</Error>}

      <Input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextArea
        placeholder="Task description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button type="submit">Add Task</Button>
    </Form>
  );
};

export default TaskForm;
