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
      SELECT c.Nombre, c.Categoria, u.Nombre_completo as profesor_nombre,
             (SELECT COUNT(*) FROM Estudiante e 
              JOIN Matricula m ON e.id_matricula = m.id_matricula 
              WHERE m.Id_Curso = c.Id_Curso) as estudiantes_count
      FROM Curso c
      LEFT JOIN Profesor p ON c.id_profesor = p.id_profesor
      LEFT JOIN Usuario u ON p.id_nodo = u.id_nodo
      WHERE c.Id_Curso = ?
    `

    const results = (await executeQuery(query, [cursoId])) as any[]

    if (results.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Curso no encontrado",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, curso: results[0] })
  } catch (error) {
    console.error("Error fetching course detail:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener detalle del curso",
      },
      { status: 500 },
    )
  }
}
