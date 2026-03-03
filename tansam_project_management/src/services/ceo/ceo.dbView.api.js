const BASE_URL =  "http://localhost:9899/api";


/* 🔐 AUTH HEADERS */
export const getAuthHeaders = () => {
  const storedUser = sessionStorage.getItem("user");

  if (!storedUser) return {};

  const user = JSON.parse(storedUser);

  if (!user) return {};

  return {
    "Content-Type": "application/json",
    "x-user-id": user.id,
    "x-user-role": user.role,
    "x-user-name": user.name,
  };
};


export const fetchAllDbTables = async () => {
  const res = await fetch(`${BASE_URL}/tables`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch DB tables");
  }

  return res.json();
};

export const fetchTableData = async (tableName) => {
  const res = await fetch(`${BASE_URL}/table/${tableName}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch table data");
  }

  return res.json();
};

export const downloadTableData = async (tableName) => {
  const res = await fetch(
    `${BASE_URL}/table/${tableName}/download`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Download failed");
  }

  return res.json();
};
