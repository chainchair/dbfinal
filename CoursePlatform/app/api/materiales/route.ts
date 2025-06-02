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
      SELECT id_material, Titulo, Descripcion, Archivo
      FROM Material
      WHERE Id_Curso = ?
    `

    const results = await executeQuery(query, [cursoId])
    return NextResponse.json({ success: true, materiales: results })
  } catch (error) {
    console.error("Error fetching materials:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener materiales",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { cursoId, titulo, descripcion, archivo, userId } = await request.json()

    // Get next material ID
    const maxIdQuery = "SELECT MAX(id_material) as maxId FROM Material"
    const maxIdResult = (await executeQuery(maxIdQuery)) as any[]
    const nuevoId = (maxIdResult[0]?.maxId || 800) + 1

    const insertQuery = `
      INSERT INTO Material (id_material, Id_Curso, Descripcion, Titulo, Archivo)
      VALUES (?, ?, ?, ?, ?)
    `

    await executeQuery(insertQuery, [nuevoId, cursoId, descripcion, titulo, archivo])

    return NextResponse.json({
      success: true,
      message: "Material subido correctamente",
    })
  } catch (error) {
    console.error("Error uploading material:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al subir material",
      },
      { status: 500 },
    )
  }
}
