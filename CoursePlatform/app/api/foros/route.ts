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
      SELECT id_foro, Nombre, Descripcion, Fecha_de_creacion, Fecha_de_terminacion
      FROM Foro
      WHERE Id_Curso = ?
      ORDER BY Fecha_de_creacion DESC
    `

    const results = await executeQuery(query, [cursoId])
    return NextResponse.json({ success: true, foros: results })
  } catch (error) {
    console.error("Error fetching forums:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener foros",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { cursoId, nombre, descripcion, fechaInicio, fechaFin } = await request.json()

    // Get next forum ID
    const maxIdQuery = "SELECT MAX(id_foro) as maxId FROM Foro"
    const maxIdResult = (await executeQuery(maxIdQuery)) as any[]
    const nuevoId = (maxIdResult[0]?.maxId || 900) + 1

    const insertQuery = `
      INSERT INTO Foro (id_foro, Id_Curso, Nombre, Descripcion, Fecha_de_creacion, Fecha_de_terminacion)
      VALUES (?, ?, ?, ?, ?, ?)
    `

    await executeQuery(insertQuery, [nuevoId, cursoId, nombre, descripcion, fechaInicio, fechaFin])

    return NextResponse.json({
      success: true,
      message: "Foro creado correctamente",
    })
  } catch (error) {
    console.error("Error creating forum:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al crear foro",
      },
      { status: 500 },
    )
  }
}
