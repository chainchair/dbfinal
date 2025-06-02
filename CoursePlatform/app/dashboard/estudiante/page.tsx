"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

interface Course {
  Id_Curso: number
  Nombre: string
  Categoria: string
}

export default function EstudianteDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      const fetchCourses = async () => {
        try {
          const response = await fetch(`/api/cursos?userId=${parsedUser.id_nodo}&userType=estudiante`)
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
    } else {
      router.push("/login")
    }
  }, [router])

  if (loading) {
    return <div className="text-center py-10">Cargando cursos...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900">Panel de Estudiante</h2>
        <p className="text-gray-500">Accede a tus cursos y materiales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-700 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Mis Cursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-900">{courses.length}</p>
            <p className="text-sm text-blue-700">Cursos matriculados</p>
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
            <p className="text-sm text-yellow-700">Accede a los materiales de tus cursos</p>
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
            <p className="text-sm text-blue-700">Participa en los foros de discusión</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mis Cursos</CardTitle>
          <CardDescription>Cursos en los que estás matriculado</CardDescription>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No estás matriculado en ningún curso. Contacta al administrador.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <Card key={course.Id_Curso}>
                  <CardHeader className="pb-2">
                    <CardTitle>{course.Nombre}</CardTitle>
                    <CardDescription>{course.Categoria || "Sin categoría"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/dashboard/estudiante/materiales?cursoId=${course.Id_Curso}`)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Materiales
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/dashboard/estudiante/foros?cursoId=${course.Id_Curso}`)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Foros
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
