const BASE_URL = "http://localhost:9899/api";

/**
 * Login API
 * @param {string} email
 * @param {string} password
 */
export const loginUser = async (email, password) => {
  // ✅ Finance frontend login (no backend account)
  if (email === "fm@tansam.com" && password === "Tansam@123") {
    return {
      id: 5,
      email: "fm@tansam.com",
      role: "finance",
      name: "Finance Manager",
    };
  }

  // Admin and all other users → fetch from backend
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data; // backend should return { id, email, role, name, route (optional) }
};
