"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle, User } from "lucide-react"

interface Course {
  Id_Curso: number
  Nombre: string
  Categoria: string
  profesor_nombre: string | null
}

interface Professor {
  id_profesor: number
  id_nodo: number
  Nombre_completo: string
}

export default function AsignarProfesorPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedProfessor, setSelectedProfessor] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch courses
      const coursesResponse = await fetch("/api/cursos")
      const coursesData = await coursesResponse.json()

      // Fetch professors
      const professorsResponse = await fetch("/api/profesores")
      const professorsData = await professorsResponse.json()

      if (coursesData.success) {
        setCourses(coursesData.cursos)
      }

      if (professorsData.success) {
        setProfessors(professorsData.profesores)
      }
    } catch (error) {
      setError("Error al cargar datos")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/asignar-profesor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cursoId: Number.parseInt(selectedCourse),
          profesorId: Number.parseInt(selectedProfessor),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        setSelectedCourse("")
        setSelectedProfessor("")
        // Refresh courses list
        fetchData()
      } else {
        setError(data.message || "Error al asignar profesor")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Cargando datos...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900">Asignar Profesor</h2>
        <p className="text-gray-500">Asigna profesores a los cursos disponibles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Asignación de Profesor
          </CardTitle>
          <CardDescription>Selecciona un curso y un profesor para realizar la asignación</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="curso">Curso</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.Id_Curso} value={course.Id_Curso.toString()}>
                        {course.Id_Curso} - {course.Nombre}
                        {course.profesor_nombre && ` (Actual: ${course.profesor_nombre})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profesor">Profesor</Label>
                <Select value={selectedProfessor} onValueChange={setSelectedProfessor} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un profesor" />
                  </SelectTrigger>
                  <SelectContent>
                    {professors.map((professor) => (
                      <SelectItem key={professor.id_profesor} value={professor.id_profesor.toString()}>
                        {professor.Nombre_completo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Asignando...
                </>
              ) : (
                "Asignar Profesor"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cursos y Profesores Actuales</CardTitle>
          <CardDescription>Estado actual de las asignaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre del Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesor Asignado
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
                      {course.profesor_nombre || <span className="text-red-500 font-medium">Sin asignar</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
