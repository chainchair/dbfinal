import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { idNodo, idCurso, fecha, monto } = await request.json()

    // Check if user is already enrolled
    const checkQuery = `
      SELECT m.id_matricula
      FROM Matricula m
      JOIN Estudiante e ON m.id_matricula = e.id_matricula
      WHERE e.id_nodo = ? AND m.Id_Curso = ?
    `
    const existing = (await executeQuery(checkQuery, [idNodo, idCurso])) as any[]

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Este usuario ya está matriculado en este curso",
        },
        { status: 400 },
      )
    }

    // Get next matricula ID
    const maxMatriculaQuery = "SELECT MAX(id_matricula) as maxId FROM Matricula"
    const maxMatriculaResult = (await executeQuery(maxMatriculaQuery)) as any[]
    const nuevoIdMatricula = (maxMatriculaResult[0]?.maxId || 500) + 1

    // Insert matricula
    const insertMatriculaQuery = `
      INSERT INTO Matricula (id_matricula, Id_Curso, fecha_matricula, Monto)
      VALUES (?, ?, ?, ?)
    `
    await executeQuery(insertMatriculaQuery, [nuevoIdMatricula, idCurso, fecha, monto])

    // Get next estudiante ID
    const maxEstudianteQuery = "SELECT MAX(id_estudiante) as maxId FROM Estudiante"
    const maxEstudianteResult = (await executeQuery(maxEstudianteQuery)) as any[]
    const nuevoIdEstudiante = (maxEstudianteResult[0]?.maxId || 600) + 1

    // Insert estudiante
    const insertEstudianteQuery = `
      INSERT INTO Estudiante (id_estudiante, id_nodo, id_matricula)
      VALUES (?, ?, ?)
    `
    await executeQuery(insertEstudianteQuery, [nuevoIdEstudiante, idNodo, nuevoIdMatricula])

    return NextResponse.json({
      success: true,
      message: "Usuario matriculado con éxito",
    })
  } catch (error) {
    console.error("Error enrolling user:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al matricular usuario",
      },
      { status: 500 },
    )
  }
}
