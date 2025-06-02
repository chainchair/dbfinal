import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { cursoId, profesorId } = await request.json()

    // Check if course exists
    const courseQuery = "SELECT Nombre FROM Curso WHERE Id_Curso = ?"
    const courseResults = (await executeQuery(courseQuery, [cursoId])) as any[]

    if (courseResults.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Curso no encontrado",
        },
        { status: 404 },
      )
    }

    // Update course with professor
    const updateQuery = "UPDATE Curso SET id_profesor = ? WHERE Id_Curso = ?"
    await executeQuery(updateQuery, [profesorId, cursoId])

    return NextResponse.json({
      success: true,
      message: `Profesor asignado al curso ${courseResults[0].Nombre}`,
    })
  } catch (error) {
    console.error("Error assigning professor:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al asignar profesor",
      },
      { status: 500 },
    )
  }
}
