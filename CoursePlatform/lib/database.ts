import mysql from "mysql2/promise"

const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "contraseña-va-aqui", // Replace with your actual password
  database: "Universidad",
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
}

export async function connectDB() {
  try {
    console.log("Attempting to connect to database...")
    const connection = await mysql.createConnection(DB_CONFIG)
    console.log("Database connected successfully")
    return connection
  } catch (error) {
    console.error("Database connection failed:", error)
    throw error
  }
}

export async function executeQuery(query: string, params: any[] = []) {
  let connection
  try {
    connection = await connectDB()
    console.log("Executing query:", query)
    console.log("With params:", params)
    const [results] = await connection.execute(query, params)
    console.log("Query results:", results)
    return results
  } catch (error) {
    console.error("Query execution failed:", error)
    console.error("Error details:", error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}
