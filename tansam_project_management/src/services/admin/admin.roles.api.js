const BASE_URL = "http://localhost:9899/api/admin/roles";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return {
    "Content-Type": "application/json",
    "x-user-id": user.id,
    "x-user-role": user.role,
  };
};

// 🔹 GET roles
export const fetchRoles = async () => {
  const res = await fetch(BASE_URL, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch roles");
  return res.json();
};

// 🔹 CREATE role
export const createRole = async (name) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// 🔹 UPDATE role
export const updateRole = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
