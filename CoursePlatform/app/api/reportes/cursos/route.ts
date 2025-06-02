import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get("categoria")
    const profesorId = searchParams.get("profesorId")
    const fechaInicio = searchParams.get("fechaInicio")
    const fechaFin = searchParams.get("fechaFin")

    let query = `
      SELECT c.Id_Curso, c.Nombre, c.Categoria, u.Nombre_completo as profesor_nombre
      FROM Curso c
      LEFT JOIN Profesor p ON c.id_profesor = p.id_profesor
      LEFT JOIN Usuario u ON p.id_nodo = u.id_nodo
    `
    const params: any[] = []

    if (categoria) {
      query += " WHERE c.Categoria = ?"
      params.push(categoria)
    } else if (profesorId) {
      query += " WHERE c.id_profesor = ?"
      params.push(profesorId)
    } else if (fechaInicio && fechaFin) {
      query += " WHERE c.Fecha_inicio BETWEEN ? AND ?"
      params.push(fechaInicio, fechaFin)
    }

    const results = await executeQuery(query, params)
    return NextResponse.json({ success: true, cursos: results })
  } catch (error) {
    console.error("Error fetching course reports:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener reporte de cursos",
      },
      { status: 500 },
    )
  }
}
