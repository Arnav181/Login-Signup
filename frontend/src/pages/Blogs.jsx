useEffect(() => {
  fetch(`${API_URL}/blogs`)
    .then(res => res.json())
    .then(setBlogs);
}, []);
