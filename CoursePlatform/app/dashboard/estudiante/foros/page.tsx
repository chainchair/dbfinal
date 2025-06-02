"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MessageSquare, Search, Send, Reply } from "lucide-react"

interface Forum {
  id_foro: number
  Nombre: string
  Descripcion: string
  Fecha_de_creacion: string
  Fecha_de_terminacion: string
}

interface Message {
  id_mensaje: number
  Nombre: string
  Descripcion: string
  id_mensaje_replica: number | null
  autor_nombre: string
}

export default function EstudianteForosPage() {
  const [forums, setForums] = useState<Forum[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [cursoId, setCursoId] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [replyToId, setReplyToId] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)

  const searchParams = useSearchParams()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const courseIdFromUrl = searchParams.get("cursoId")
    if (courseIdFromUrl) {
      setCursoId(courseIdFromUrl)
      fetchForums(courseIdFromUrl)
    }
  }, [searchParams])

  const fetchForums = async (courseId: string) => {
    if (!courseId) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/foros?cursoId=${courseId}`)
      const data = await response.json()

      if (data.success) {
        setForums(data.foros)
      } else {
        setError(data.message || "Error al cargar foros")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (foroId: number) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/mensajes?foroId=${foroId}`)
      const data = await response.json()

      if (data.success) {
        setMessages(data.mensajes)
      } else {
        setError(data.message || "Error al cargar mensajes")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedForum || !user) return

    try {
      const response = await fetch("/api/mensajes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foroId: selectedForum.id_foro,
          mensaje: newMessage,
          userId: user.id_nodo,
          userName: user.nombre,
          replyToId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setNewMessage("")
        setReplyToId(null)
        fetchMessages(selectedForum.id_foro)
      } else {
        setError(data.message || "Error al enviar mensaje")
      }
    } catch (error) {
      setError("Error de conexión")
    }
  }

  const handleSearch = () => {
    if (cursoId) {
      fetchForums(cursoId)
    }
  }

  const selectForum = (forum: Forum) => {
    setSelectedForum(forum)
    setMessages([])
    fetchMessages(forum.id_foro)
  }

  const handleReply = (messageId: number) => {
    setReplyToId(messageId)
  }

  const renderMessages = () => {
    const messageMap = new Map()
    const rootMessages: Message[] = []

    // Organize messages
    messages.forEach((message) => {
      messageMap.set(message.id_mensaje, { ...message, replies: [] })
    })

    messages.forEach((message) => {
      if (message.id_mensaje_replica) {
        const parent = messageMap.get(message.id_mensaje_replica)
        if (parent) {
          parent.replies.push(messageMap.get(message.id_mensaje))
        }
      } else {
        rootMessages.push(messageMap.get(message.id_mensaje))
      }
    })

    const MessageComponent = ({ message, isReply = false }: { message: any; isReply?: boolean }) => (
      <div className={`border rounded-lg p-4 ${isReply ? "ml-8 mt-2 bg-blue-50" : "bg-white"}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="font-medium text-blue-900">{message.autor_nombre}</span>
            {isReply && <span className="text-sm text-gray-500 ml-2">(Respuesta)</span>}
          </div>
          <Button size="sm" variant="outline" onClick={() => handleReply(message.id_mensaje)}>
            <Reply className="h-3 w-3 mr-1" />
            Responder
          </Button>
        </div>
        <p className="text-gray-700">{message.Descripcion}</p>
        {message.replies?.map((reply: any) => (
          <MessageComponent key={reply.id_mensaje} message={reply} isReply={true} />
        ))}
      </div>
    )

    return rootMessages.map((message) => <MessageComponent key={message.id_mensaje} message={message} />)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900">Foros del Curso</h2>
        <p className="text-gray-500">Participa en las discusiones del curso</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Foros</CardTitle>
          <CardDescription>Ingresa el ID del curso para ver los foros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="cursoId">ID del Curso</Label>
              <Input
                id="cursoId"
                type="number"
                value={cursoId}
                onChange={(e) => setCursoId(e.target.value)}
                placeholder="Ej: 101"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && <div className="text-center py-10">Cargando...</div>}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {forums.length > 0 && !selectedForum && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Foros Disponibles ({forums.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {forums.map((forum) => (
                <Card
                  key={forum.id_foro}
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => selectForum(forum)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{forum.Nombre}</CardTitle>
                    <CardDescription>{forum.Descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">
                      <p>Creado: {new Date(forum.Fecha_de_creacion).toLocaleDateString()}</p>
                      {forum.Fecha_de_terminacion && (
                        <p>Termina: {new Date(forum.Fecha_de_terminacion).toLocaleDateString()}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedForum && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    {selectedForum.Nombre}
                  </CardTitle>
                  <CardDescription>{selectedForum.Descripcion}</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setSelectedForum(null)}>
                  Volver a Foros
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enviar Mensaje</CardTitle>
              {replyToId && (
                <CardDescription>
                  Respondiendo al mensaje #{replyToId}{" "}
                  <Button size="sm" variant="ghost" onClick={() => setReplyToId(null)}>
                    Cancelar
                  </Button>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Escribe tu mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mensajes ({messages.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No hay mensajes en este foro. ¡Sé el primero en participar!
                  </p>
                ) : (
                  renderMessages()
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
