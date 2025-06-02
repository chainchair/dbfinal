import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const query = `
      SELECT p.id_profesor, p.id_nodo, u.Nombre_completo
      FROM Profesor p
      JOIN Usuario u ON p.id_nodo = u.id_nodo
      WHERE u.Tipo_de_usuario = 'profesor'
    `

    const results = await executeQuery(query)
    return NextResponse.json({ success: true, profesores: results })
  } catch (error) {
    console.error("Error fetching professors:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener profesores",
      },
      { status: 500 },
    )
  }
}
