const BASE_URL = "http://localhost:9899/api";

export const fetchMembers = async () => {
  const res = await fetch(`${BASE_URL}/members`);
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
};

export const createMember = async (member) => {
  const res = await fetch(`${BASE_URL}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  });

  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

export const deleteMember = async (id) => {
  const res = await fetch(`${BASE_URL}/members/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
};
