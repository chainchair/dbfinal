import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get("tipo")
    const id = searchParams.get("id")

    let query = "SELECT id_nodo, Nombre_completo, Tipo_de_usuario, Nombre_de_usuario_email FROM Usuario"
    const params: any[] = []

    if (tipo) {
      query += " WHERE Tipo_de_usuario = ?"
      params.push(tipo)
    } else if (id) {
      query += " WHERE id_nodo = ?"
      params.push(id)
    }

    query += " ORDER BY Nombre_completo"

    const results = await executeQuery(query, params)
    return NextResponse.json({ success: true, usuarios: results })
  } catch (error) {
    console.error("Error fetching user reports:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener reporte de usuarios",
      },
      { status: 500 },
    )
  }
}
