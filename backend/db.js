const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (error) => {
  console.error("PostgreSQL pool error:", error.message);
});

async function testDatabaseConnection() {
  const result = await pool.query("SELECT NOW()");
  return result.rows[0];
}

module.exports = {
  pool,
  testDatabaseConnection,
};