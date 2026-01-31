const API_BASE_URL = "https://login-signup-1hpi.onrender.com";
const API_URL = `${API_BASE_URL}/api/blogs`;

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

//public

export const fetchAllBlogs = async () => {
  const res = await fetch(`${API_URL}`);

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
};

export const getBlogById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch blog");
  }

  return res.json();
};

//private

export const fetchMyBlogs = async () => {
  const res = await fetch(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch my blogs");
  }

  return res.json();
};

export const createBlog = async (data) => {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create blog");
  }

  return res.json();
};

export const updateBlog = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update blog");
  }

  return res.json();
};

export const deleteBlog = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete blog");
  }
};
