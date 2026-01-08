const BASE_URL = "http://localhost:9899/api";

const headers = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return {
    "Content-Type": "application/json",
    "x-user-id": user.id,
    "x-user-role": user.role,
  };
};

export const fetchProjectTypes = async () => {
  const res = await fetch(`${BASE_URL}/project-types`, { headers: headers() });
  if (!res.ok) throw new Error();
  return res.json();
};

export const createProjectType = async (data) => {
  const res = await fetch(`${BASE_URL}/project-types`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error();
};

export const updateProjectType = async (id, data) => {
  const res = await fetch(`${BASE_URL}/project-types/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error();
};

export const deleteProjectType = async (id) => {
  const res = await fetch(`${BASE_URL}/project-types/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) throw new Error();
};
