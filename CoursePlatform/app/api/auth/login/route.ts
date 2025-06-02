import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // First check Usuario table
    const userQuery = `
      SELECT id_nodo, Nombre_completo, Nombre_de_usuario_email, Tipo_de_usuario 
      FROM Usuario 
      WHERE Nombre_de_usuario_email = ? AND Contraseña = ?
    `
    const userResults = (await executeQuery(userQuery, [username, password])) as any[]

    if (userResults.length > 0) {
      const user = userResults[0]
      return NextResponse.json({
        success: true,
        user: {
          id_nodo: user.id_nodo,
          nombre: user.Nombre_completo,
          email: user.Nombre_de_usuario_email,
          tipo: user.Tipo_de_usuario.toLowerCase(),
        },
      })
    }

    // Check Administrador table
    const adminQuery = `
      SELECT Nombre, Nombre_de_usuario_email 
      FROM Administrador 
      WHERE Nombre_de_usuario_email = ? AND Contraseña = ?
    `
    const adminResults = (await executeQuery(adminQuery, [username, password])) as any[]

    if (adminResults.length > 0) {
      const admin = adminResults[0]
      return NextResponse.json({
        success: true,
        user: {
          id_nodo: null,
          nombre: admin.Nombre,
          email: admin.Nombre_de_usuario_email,
          tipo: "administrador",
        },
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Usuario o contraseña incorrectos",
      },
      { status: 401 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error del servidor",
      },
      { status: 500 },
    )
  }
}
