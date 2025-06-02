"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Users, Search } from "lucide-react"

interface Student {
  Nombre_completo: string
  Nombre_de_usuario_email: string
  fecha_matricula: string
}

export default function EstudiantesPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [cursoId, setCursoId] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const courseIdFromUrl = searchParams.get("cursoId")
    if (courseIdFromUrl) {
      setCursoId(courseIdFromUrl)
      fetchStudents(courseIdFromUrl)
    }
  }, [searchParams])

  const fetchStudents = async (courseId: string) => {
    if (!courseId) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/estudiantes?cursoId=${courseId}`)
      const data = await response.json()

      if (data.success) {
        setStudents(data.estudiantes)
      } else {
        setError(data.message || "Error al cargar estudiantes")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (cursoId) {
      fetchStudents(cursoId)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900">Estudiantes del Curso</h2>
        <p className="text-gray-500">Lista de estudiantes matriculados</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Estudiantes</CardTitle>
          <CardDescription>Ingresa el ID del curso para ver los estudiantes</CardDescription>
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

      {loading && <div className="text-center py-10">Cargando estudiantes...</div>}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Estudiantes Matriculados ({students.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Matrícula
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.Nombre_completo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.Nombre_de_usuario_email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(student.fecha_matricula).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && students.length === 0 && cursoId && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">No hay estudiantes matriculados en este curso.</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
