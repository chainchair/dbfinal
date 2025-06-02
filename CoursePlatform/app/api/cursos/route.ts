import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const userType = searchParams.get("userType")

    console.log("Fetching courses for user:", userId, "type:", userType)

    let query = ""
    let params: any[] = []

    if (userType === "estudiante") {
      // Simple query for students - without Descripcion column
      query = `
        SELECT DISTINCT c.Id_Curso, c.Nombre, c.Categoria
        FROM Curso c
        INNER JOIN Matricula m ON c.Id_Curso = m.Id_Curso
        INNER JOIN Estudiante e ON m.id_matricula = e.id_matricula
        WHERE e.id_nodo = ?
      `
      params = [userId]
    } else if (userType === "profesor") {
      // Simple query for professors - without Descripcion column
      query = `
        SELECT DISTINCT c.Id_Curso, c.Nombre, c.Categoria
        FROM Curso c
        INNER JOIN Profesor p ON c.id_profesor = p.id_profesor
        WHERE p.id_nodo = ?
      `
      params = [userId]
    } else {
      // Administrador - ver todos los cursos - without Descripcion column
      query = `
        SELECT c.Id_Curso, c.Nombre, c.Categoria,
               u.Nombre_completo as profesor_nombre
        FROM Curso c
        LEFT JOIN Profesor p ON c.id_profesor = p.id_profesor
        LEFT JOIN Usuario u ON p.id_nodo = u.id_nodo
        ORDER BY c.Id_Curso
      `
    }

    console.log("Final query:", query)
    console.log("Final params:", params)

    const results = await executeQuery(query, params)
    console.log("Query results:", results)

    return NextResponse.json({ success: true, cursos: results })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Error al obtener cursos: ${error.message}`,
        error: error.toString(),
      },
      { status: 500 },
    )
  }
}
