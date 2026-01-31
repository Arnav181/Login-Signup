import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MyBlogs from "./pages/MyBlogs.jsx";
import BlogEditor from "./pages/BlogEditor.jsx";
import BlogDetails from "./pages/BlogDetails.jsx";
import PublicBlogs from "./pages/PublicBlogs";
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  #root {
    margin: 0;
    padding: 0;
  }
`;

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/blogs" element={<MyBlogs />} />
        <Route path="/profile/blogs/new" element={<BlogEditor />} />
        <Route
          path="/profile/blogs/edit/:id"
          element={<BlogEditor />}
        />
      </Route>
      <Route path="/blogs/:id" element={<BlogDetails />} />
      <Route path="/blogs" element={<PublicBlogs />} />

      

    </Routes>
  );
}

export default App;
