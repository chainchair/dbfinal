"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, User, BarChart3, MessageSquare, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

interface Course {
  Id_Curso: number
  Nombre: string
  Categoria: string
  profesor_nombre: string
}

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/cursos")
        const data = await response.json()

        if (data.success) {
          setCourses(data.cursos)
        } else {
          setError(data.message || "Error al cargar cursos")
        }
      } catch (error) {
        setError("Error de conexión")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return <div className="text-center py-10">Cargando cursos...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900">Panel de Administrador</h2>
        <p className="text-gray-500">Gestiona cursos, profesores y estudiantes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-700 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Cursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-900">{courses.length}</p>
            <p className="text-sm text-blue-700">Cursos activos</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-yellow-700 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profesores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-900">
              {new Set(courses.filter((c) => c.profesor_nombre).map((c) => c.profesor_nombre)).size}
            </p>
            <p className="text-sm text-yellow-700">Profesores asignados</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-700 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Acciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">Matricular estudiantes y asignar profesores</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-yellow-700 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Materiales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/administrador/materiales")}
            >
              Gestionar Materiales
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-700 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Foros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/administrador/foros")}
            >
              Gestionar Foros
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-yellow-700 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Reportes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/administrador/reportes")}
            >
              Ver Reportes
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cursos Disponibles</CardTitle>
          <CardDescription>Lista de todos los cursos en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.Id_Curso}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.Id_Curso}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.Nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.Categoria || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.profesor_nombre || "No asignado"}
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No hay cursos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
