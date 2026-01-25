import { useEffect, useState } from "react";
import styled from "styled-components";
import TaskForm from "../components/TaskForm";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";
import { useNavigate } from "react-router-dom";


const colors = {
  navy: "#0A192F",
  lightNavy: "#112240",
  lightBlue: "#64FFDA",
  gray: "#8892B0",
  white: "#E6F1FF",
  red: "#ff0000",
  brown : "#630a0a",
  black :"#000000"
};


const Container = styled.div`
  min-height: 100vh;
  background: ${colors.navy};
  padding: 50px 20px;
  color: ${colors.white};
`;

const Dashboard = styled.div`
  max-width: 760px;
  margin: auto;
`;

const Heading = styled.h2`
  margin-bottom: 25px;
  font-size: 2rem;
  color: ${colors.white};
`;

const TaskCard = styled.div`
  background: ${colors.lightNavy};
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 18px rgba(100, 255, 218, 0.35);
  }
`;

const TaskTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ completed }) =>
    completed ? colors.gray : colors.white};
  text-decoration: ${({ completed }) =>
    completed ? "line-through" : "none"};
`;

const TaskDescription = styled.p`
  margin: 8px 0;
  color: ${colors.gray};
  font-size: 0.95rem;
`;

const TaskFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const StatusButton = styled.button`
  padding: 7px 14px;
  border-radius: 6px;
  border: 1px solid ${colors.lightBlue};
  background: ${({ completed }) =>
    completed ? colors.lightBlue : "transparent"};
  color: ${({ completed }) =>
    completed ? colors.navy : colors.lightBlue};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.25s ease;

  &:hover {
    box-shadow: 0 0 12px rgba(100, 255, 218, 0.6);
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid ${colors.red};
  color: ${colors.red};
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.25s ease;

  &:hover {
    background: ${colors.red};
    color: ${colors.black};
    box-shadow: 0 0 14px rgba(100, 255, 218, 0.6);
  }
`;

const DeleteButton = styled.button`
  background: transparent;
  border: 1px solid #ff6b6b;
  color: #ff6b6b;
  padding: 7px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #ff6b6b;
    color: #000;
    box-shadow: 0 0 12px rgba(255, 107, 107, 0.6);
  }
`;

const EmptyText = styled.p`
  color: ${colors.gray};
  text-align: center;
  margin-top: 40px;
`;


const Profile = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const loadTasks = async () => {
      const data = await fetchTasks();
      setTasks(data);
      setLoading(false);
    };
    loadTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    const newTask = await createTask(taskData);
    setTasks([newTask, ...tasks]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const handleToggleStatus = async (task) => {
    const updated = await updateTask(task._id, {
      status: task.status === "completed" ? "pending" : "completed",
    });

    setTasks(
      tasks.map((t) => (t._id === task._id ? updated : t))
    );
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter((task) => task._id !== id));
  };

  return (
    <Container>
      <Dashboard>
        <Heading>Task Dashboard</Heading>

        <LogoutButton onClick={() => handleLogout
              ()}>Logout</LogoutButton>

        <TaskForm onCreate={handleCreateTask} />

        {loading ? (
          <p>Loading...</p>
        ) : tasks.length === 0 ? (
          <EmptyText>No tasks yet</EmptyText>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id}>
              <TaskTitle completed={task.status === "completed"}>
                {task.title}
              </TaskTitle>

              {task.description && (
                <TaskDescription>{task.description}</TaskDescription>
              )}

              

              <TaskFooter>
                <StatusButton
                  completed={task.status === "completed"}
                  onClick={() => handleToggleStatus(task)}
                >
                  {task.status === "completed"
                    ? "Completed"
                    : "Mark Complete"}
                </StatusButton>

                <DeleteButton
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </DeleteButton>
              </TaskFooter>
            </TaskCard>
          ))
        )}
      </Dashboard>
    </Container>
  );
};

export default Profile;
