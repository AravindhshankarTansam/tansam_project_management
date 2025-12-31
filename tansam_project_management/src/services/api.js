const BASE_URL = "http://localhost:9899/api";

/**
 * Login API
 * @param {string} email
 * @param {string} password
 */
export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // throw error so component can catch it
    throw new Error(data.message || "Login failed");
  }

  return data; // { id, email, role, route }
};
