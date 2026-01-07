const BASE_URL = "http://localhost:9899/api";

/* GET */
export const fetchDepartments = async () => {
  const res = await fetch(`${BASE_URL}/departments`);
  if (!res.ok) throw new Error("Failed to fetch departments");
  return res.json();
};

/* CREATE */
export const createDepartment = async (name) => {
  const res = await fetch(`${BASE_URL}/departments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

/* DELETE */
export const deleteDepartment = async (id) => {
  const res = await fetch(`${BASE_URL}/departments/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Delete failed");
  return res.json();
};
