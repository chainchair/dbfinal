import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cursoId = searchParams.get("cursoId")

    if (!cursoId) {
      return NextResponse.json(
        {
          success: false,
          message: "ID del curso requerido",
        },
        { status: 400 },
      )
    }

    const query = `
      SELECT u.Nombre_completo, u.Nombre_de_usuario_email, m.fecha_matricula
      FROM Estudiante e
      JOIN Usuario u ON e.id_nodo = u.id_nodo
      JOIN Matricula m ON e.id_matricula = m.id_matricula
      WHERE m.Id_Curso = ?
    `

    const results = await executeQuery(query, [cursoId])
    return NextResponse.json({ success: true, estudiantes: results })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener estudiantes",
      },
      { status: 500 },
    )
  }
}
