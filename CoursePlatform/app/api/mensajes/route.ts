import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const foroId = searchParams.get("foroId")

    if (!foroId) {
      return NextResponse.json(
        {
          success: false,
          message: "ID del foro requerido",
        },
        { status: 400 },
      )
    }

    const query = `
      SELECT m.id_mensaje, m.Nombre, m.Descripcion, m.id_mensaje_replica,
             u.Nombre_completo as autor_nombre
      FROM Mensaje m
      JOIN Usuario u ON m.id_nodo = u.id_nodo
      WHERE m.Id_foro = ?
      ORDER BY m.id_mensaje ASC
    `

    const results = await executeQuery(query, [foroId])
    return NextResponse.json({ success: true, mensajes: results })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener mensajes",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { foroId, mensaje, userId, userName, replyToId } = await request.json()

    // Get next message ID
    const maxIdQuery = "SELECT MAX(id_mensaje) as maxId FROM Mensaje"
    const maxIdResult = (await executeQuery(maxIdQuery)) as any[]
    const nuevoId = (maxIdResult[0]?.maxId || 1000) + 1

    const insertQuery = `
      INSERT INTO Mensaje (id_mensaje, id_nodo, Id_foro, Nombre, Descripcion, id_mensaje_replica)
      VALUES (?, ?, ?, ?, ?, ?)
    `

    await executeQuery(insertQuery, [nuevoId, userId, foroId, userName, mensaje, replyToId || null])

    return NextResponse.json({
      success: true,
      message: "Mensaje enviado correctamente",
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al enviar mensaje",
      },
      { status: 500 },
    )
  }
}
