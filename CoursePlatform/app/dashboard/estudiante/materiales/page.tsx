"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileText, Search, Download } from "lucide-react"

interface Material {
  id_material: number
  Titulo: string
  Descripcion: string
  Archivo: string
}

export default function EstudianteMaterialesPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [cursoId, setCursoId] = useState("")
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900">Materiales del Curso</h2>
        <p className="text-gray-500">Accede a los materiales de tus cursos</p>
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
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && <div className="text-center py-10">Cargando materiales...</div>}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
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
                <Card key={material.id_material} className="border-blue-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-blue-900">{material.Titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{material.Descripcion}</p>
                    {material.Archivo && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open(material.Archivo, "_blank")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
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
