"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageSquare, Search, Send, Reply, Plus, CheckCircle } from "lucide-react"

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

export default function ProfesorForosPage() {
  const [forums, setForums] = useState<Forum[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [cursoId, setCursoId] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [replyToId, setReplyToId] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Create forum form states
  const [forumName, setForumName] = useState("")
  const [forumDescription, setForumDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

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

  const createForum = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cursoId) return

    try {
      const response = await fetch("/api/foros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cursoId: Number.parseInt(cursoId),
          nombre: forumName,
          descripcion: forumDescription,
          fechaInicio: startDate,
          fechaFin: endDate,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        setForumName("")
        setForumDescription("")
        setStartDate("")
        setEndDate("")
        setShowCreateForm(false)
        fetchForums(cursoId)
      } else {
        setError(data.message || "Error al crear foro")
      }
    } catch (error) {
      setError("Error de conexión")
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
      <div className={`border rounded-lg p-4 ${isReply ? "ml-8 mt-2 bg-yellow-50" : "bg-white"}`}>
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
        <p className="text-gray-500">Gestiona y participa en los foros de discusión</p>
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
            <div className="flex items-end space-x-2">
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              {cursoId && (
                <Button onClick={() => setShowCreateForm(!showCreateForm)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Foro
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Foro</CardTitle>
            <CardDescription>Crea un foro de discusión para el curso</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createForum} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="forumName">Nombre del Foro</Label>
                  <Input
                    id="forumName"
                    value={forumName}
                    onChange={(e) => setForumName(e.target.value)}
                    required
                    placeholder="Ej: Discusión General"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="forumDescription">Descripción</Label>
                <Textarea
                  id="forumDescription"
                  value={forumDescription}
                  onChange={(e) => setForumDescription(e.target.value)}
                  required
                  placeholder="Describe el propósito del foro..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de Terminación (Opcional)</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>

              <div className="flex space-x-2">
                <Button type="submit">Crear Foro</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && <div className="text-center py-10">Cargando...</div>}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
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
                    No hay mensajes en este foro. ¡Inicia la conversación!
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
