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
import { FileText, Upload, Search, CheckCircle } from "lucide-react"

interface Material {
  id_material: number
  Titulo: string
  Descripcion: string
  Archivo: string
}

export default function MaterialesPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [cursoId, setCursoId] = useState("")
  const [showUploadForm, setShowUploadForm] = useState(false)

  // Form states
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [archivo, setArchivo] = useState("")
  const [uploading, setUploading] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    const courseIdFromUrl = searchParams.get("cursoId")
    if (courseIdFromUrl) {
      setCursoId(courseIdFromUrl)
      fetchMaterials(courseIdFromUrl)
    }
  }, [searchParams])

  const fetchMaterials = async (courseId: string) => {
    if (!courseId) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/materiales?cursoId=${courseId}`)
      const data = await response.json()

      if (data.success) {
        setMaterials(data.materiales)
      } else {
        setError(data.message || "Error al cargar materiales")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (cursoId) {
      fetchMaterials(cursoId)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    setError("")
    setSuccess("")

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      const response = await fetch("/api/materiales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cursoId: Number.parseInt(cursoId),
          titulo,
          descripcion,
          archivo,
          userId: user.id_nodo,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        setTitulo("")
        setDescripcion("")
        setArchivo("")
        setShowUploadForm(false)
        // Refresh materials list
        fetchMaterials(cursoId)
      } else {
        setError(data.message || "Error al subir material")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900">Materiales del Curso</h2>
        <p className="text-gray-500">Gestiona los materiales de tus cursos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Materiales</CardTitle>
          <CardDescription>Ingresa el ID del curso para ver los materiales</CardDescription>
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
                <Button onClick={() => setShowUploadForm(!showUploadForm)} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Material
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showUploadForm && cursoId && (
        <Card>
          <CardHeader>
            <CardTitle>Subir Nuevo Material</CardTitle>
            <CardDescription>Agrega un nuevo material al curso</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título del Material</Label>
                <Input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  placeholder="Ej: Introducción a la programación"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                  placeholder="Describe el contenido del material..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="archivo">URL del Archivo</Label>
                <Input
                  id="archivo"
                  value={archivo}
                  onChange={(e) => setArchivo(e.target.value)}
                  required
                  placeholder="https://ejemplo.com/archivo.pdf"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Subiendo..." : "Subir Material"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && <div className="text-center py-10">Cargando materiales...</div>}

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

      {materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Materiales Disponibles ({materials.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.map((material) => (
                <Card key={material.id_material}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{material.Titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{material.Descripcion}</p>
                    {material.Archivo && (
                      <Button size="sm" variant="outline" onClick={() => window.open(material.Archivo, "_blank")}>
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Archivo
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && materials.length === 0 && cursoId && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">No hay materiales disponibles para este curso.</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
