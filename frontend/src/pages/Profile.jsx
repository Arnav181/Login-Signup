import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
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

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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

const Dashboard = styled.div`
  max-width: 900px;
  margin: auto;
`;

const Header = styled.div`
  margin-bottom: 40px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Heading = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, ${colors.white} 0%, ${colors.lightBlue} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: ${colors.gray};
  font-size: 1rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
  flex-wrap: wrap;
  animation: ${fadeIn} 0.8s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SwitchGroup = styled.div`
  display: flex;
  gap: 12px;
  background: ${colors.cardBg};
  padding: 6px;
  border-radius: 12px;
  border: 1px solid rgba(100, 255, 218, 0.1);

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SwitchButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${({ active }) =>
    active ? colors.lightBlue : "transparent"};
  color: ${({ active }) => (active ? colors.navy : colors.lightBlue)};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  flex: 1;
  white-space: nowrap;

  &:hover {
    background: ${({ active }) =>
      active ? colors.lightBlue : "rgba(100, 255, 218, 0.1)"};
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 2px solid ${colors.red};
  color: ${colors.red};
  padding: 10px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.red};
    color: ${colors.white};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TaskCard = styled.div`
  background: ${colors.cardBg};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(100, 255, 218, 0.1);
  transition: all 0.3s ease;
  animation: ${slideIn} 0.5s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  &:hover {
    transform: translateX(8px);
    border-color: ${colors.lightBlue};
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  align-items: start;
  gap: 12px;
  margin-bottom: 8px;
`;

const CheckIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid ${props => props.completed ? colors.green : colors.lightBlue};
  background: ${props => props.completed ? colors.green : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.3s ease;

  &::after {
    content: "${props => props.completed ? '✓' : ''}";
    color: ${colors.white};
    font-weight: bold;
    font-size: 14px;
  }
`;

const TaskTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ completed }) => (completed ? colors.gray : colors.white)};
  text-decoration: ${({ completed }) => (completed ? "line-through" : "none")};
  flex: 1;
  line-height: 1.4;
`;

const TaskDescription = styled.p`
  margin: 12px 0 12px 36px;
  color: ${colors.gray};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const TaskFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(100, 255, 218, 0.1);
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Button = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border: none;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StatusButton = styled(Button)`
  border: 2px solid ${({ completed }) => (completed ? colors.green : colors.lightBlue)};
  background: ${({ completed }) =>
    completed ? colors.green : "transparent"};
  color: ${({ completed }) => (completed ? colors.white : colors.lightBlue)};

  &:hover {
    background: ${({ completed }) =>
      completed ? "#45b658" : "rgba(100, 255, 218, 0.1)"};
  }
`;

const DeleteButton = styled(Button)`
  background: transparent;
  border: 2px solid ${colors.red};
  color: ${colors.red};

  &:hover {
    background: ${colors.red};
    color: ${colors.white};
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
  margin-bottom: 8px;
`;

const EmptySubtext = styled.p`
  font-size: 0.95rem;
`;

const LoadingContainer = styled.div`
  padding: 40px 20px;
  text-align: center;
`;

const LoadingSkeleton = styled.div`
  background: ${colors.cardBg};
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
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

const TaskStats = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: ${colors.cardBg};
  padding: 16px 20px;
  border-radius: 10px;
  border: 1px solid rgba(100, 255, 218, 0.1);
  flex: 1;
  min-width: 150px;
`;

const StatLabel = styled.div`
  color: ${colors.gray};
  font-size: 0.85rem;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  color: ${colors.lightBlue};
  font-size: 1.8rem;
  font-weight: 700;
`;

const Profile = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("tasks");
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

  const handleToggleStatus = async (task) => {
    const updated = await updateTask(task._id, {
      status: task.status === "completed" ? "pending" : "completed",
    });
    setTasks(tasks.map((t) => (t._id === task._id ? updated : t)));
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = tasks.filter(t => t.status === "pending").length;

  return (
    <Container>
      <Dashboard>
        <Header>
          <Heading>Profile Dashboard</Heading>
          <Subtitle>Manage your tasks and blog posts</Subtitle>
        </Header>

        <TopBar>
          <SwitchGroup>
            <SwitchButton
              active={activeSection === "tasks"}
              onClick={() => setActiveSection("tasks")}
            >
               Tasks
            </SwitchButton>

            <SwitchButton
              active={activeSection === "blogs"}
              onClick={() => navigate("/blogs")}
            >
              Blogs
            </SwitchButton>
          </SwitchGroup>

          <LogoutButton onClick={handleLogout}>🚪 Logout</LogoutButton>
        </TopBar>

        {activeSection === "tasks" && (
          <>
            {!loading && tasks.length > 0 && (
              <TaskStats>
                <StatCard>
                  <StatLabel>Total Tasks</StatLabel>
                  <StatValue>{tasks.length}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Completed</StatLabel>
                  <StatValue>{completedTasks}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Pending</StatLabel>
                  <StatValue>{pendingTasks}</StatValue>
                </StatCard>
              </TaskStats>
            )}

            <TaskForm onCreate={handleCreateTask} />

            {loading ? (
              <LoadingContainer>
                {[1, 2, 3].map((i) => (
                  <LoadingSkeleton key={i}>
                    <SkeletonLine height="24px" width="70%" />
                    <SkeletonLine height="16px" width="90%" />
                    <SkeletonLine height="40px" width="200px" margin="20px" />
                  </LoadingSkeleton>
                ))}
              </LoadingContainer>
            ) : tasks.length === 0 ? (
              <EmptyState>
                <EmptyIcon>📝</EmptyIcon>
                <EmptyText>No tasks yet</EmptyText>
                <EmptySubtext>Create your first task to get started!</EmptySubtext>
              </EmptyState>
            ) : (
              tasks.map((task, index) => (
                <TaskCard key={task._id} delay={`${index * 0.1}s`}>
                  <TaskHeader>
                    <CheckIcon completed={task.status === "completed"} />
                    <TaskTitle completed={task.status === "completed"}>
                      {task.title}
                    </TaskTitle>
                  </TaskHeader>

                  {task.description && (
                    <TaskDescription>{task.description}</TaskDescription>
                  )}

                  <TaskFooter>
                    <StatusButton
                      completed={task.status === "completed"}
                      onClick={() => handleToggleStatus(task)}
                    >
                      {task.status === "completed"
                        ? "✓ Completed"
                        : "Mark Complete"}
                    </StatusButton>

                    <DeleteButton onClick={() => handleDeleteTask(task._id)}>
                      Delete
                    </DeleteButton>
                  </TaskFooter>
                </TaskCard>
              ))
            )}
          </>
        )}
      </Dashboard>
    </Container>
  );
};

export default Profile;