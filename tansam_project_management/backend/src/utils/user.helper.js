export const getUserById = async (db, userId) => {
  if (!userId) return null;

  const [[user]] = await db.execute(
    `
    SELECT id, name, email, role
    FROM users_admin
    WHERE id = ?
    `,
    [userId]
  );

  return user || null;
};
