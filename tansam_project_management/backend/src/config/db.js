import mysql from "mysql2/promise";

/**
 * Create database if it does not exist
 */
export const ensureDatabaseExists = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 3306, // IMPORTANT for Windows
  });

  // Debug (remove later if you want)
  console.log("MYSQL USER:", process.env.DB_USER);
  console.log("MYSQL PASSWORD:", process.env.DB_PASSWORD ? "YES" : "NO");

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
  );

  await connection.end();
  console.log(`✔ Database '${process.env.DB_NAME}' ensured`);
};

/**
 * Connect to MySQL using the database
 */
export const connectDB = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306, // IMPORTANT for Windows
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
  });

  return pool;
};
