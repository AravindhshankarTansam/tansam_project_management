const BASE_URL = "http://localhost:9899/api";

/* 🔐 AUTH HEADERS (same as coordinator/admin) */
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    throw new Error("User not logged in");
  }

  return {
    "x-user-id": user.id,
    "x-user-role": user.role,
    "x-user-name": user.username,
  };
};

/* ============================
   CREATE PROJECT
============================ */
export const createProject = async (project) => {
  const formData = new FormData();

  Object.entries(project).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  const res = await fetch(`${BASE_URL}/projects`, {
    method: "POST",
    headers: getAuthHeaders(), // ✅ REQUIRED
    body: formData,           // ❌ don't set Content-Type manually
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data;
};

/* ============================
   GET PROJECTS
============================ */
export const fetchProjects = async () => {
  const res = await fetch(`${BASE_URL}/projects`, {
    headers: getAuthHeaders(), // ✅ REQUIRED
  });

  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};

/* ============================
   UPDATE PROJECT
============================ */
export const updateProject = async (id, project) => {
  const formData = new FormData();

  Object.entries(project).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  const res = await fetch(`${BASE_URL}/projects/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(), // ✅ REQUIRED
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data;
};

/* ============================
   DELETE PROJECT
============================ */
export const deleteProject = async (id) => {
  const res = await fetch(`${BASE_URL}/projects/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(), // ✅ REQUIRED
  });

  if (!res.ok) throw new Error("Delete failed");
  return res.json();
};
