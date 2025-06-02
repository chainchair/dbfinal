"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Users, BookOpen } from "lucide-react"

interface Course {
  Id_Curso: number
  Nombre: string
  Categoria: string
  profesor_nombre: string
  estudiantes_count: number
}

interface User {
  id_nodo: number
  Nombre_completo: string
  Tipo_de_usuario: string
  Nombre_de_usuario_email: string
}

interface CourseDetail {
  Nombre: string
  Categoria: string
  profesor_nombre: string
  estudiantes_count: number
}

export default function ReportesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("")
  const [professorFilter, setProfesorFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [userTypeFilter, setUserTypeFilter] = useState("")
  const [userIdFilter, setUserIdFilter] = useState("")
  const [courseIdDetail, setCourseIdDetail] = useState("")

  const fetchCoursesByCategory = async () => {
    if (!categoryFilter) return
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/reportes/cursos?categoria=${categoryFilter}`)
      const data = await response.json()

      if (data.success) {
        setCourses(data.cursos)
      } else {
        setError(data.message || "Error al obtener cursos")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const fetchCoursesByProfessor = async () => {
    if (!professorFilter) return
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/reportes/cursos?profesorId=${professorFilter}`)
      const data = await response.json()

      if (data.success) {
        setCourses(data.cursos)
      } else {
        setError(data.message || "Error al obtener cursos")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const fetchCoursesByDateRange = async () => {
    if (!dateFrom || !dateTo) return
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/reportes/cursos?fechaInicio=${dateFrom}&fechaFin=${dateTo}`)
      const data = await response.json()

      if (data.success) {
        setCourses(data.cursos)
      } else {
        setError(data.message || "Error al obtener cursos")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const fetchCourseDetail = async () => {
    if (!courseIdDetail) return
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/reportes/curso-detalle?cursoId=${courseIdDetail}`)
      const data = await response.json()

      if (data.success) {
        setCourseDetail(data.curso)
      } else {
        setError(data.message || "Error al obtener detalles del curso")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    setError("")

    try {
      let url = "/api/reportes/usuarios"
      const params = new URLSearchParams()

      if (userTypeFilter) params.append("tipo", userTypeFilter)
      if (userIdFilter) params.append("id", userIdFilter)

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setUsers(data.usuarios)
      } else {
        setError(data.message || "Error al obtener usuarios")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900">Reportes</h2>
        <p className="text-gray-500">Genera reportes detallados del sistema</p>
      </div>

      <Tabs defaultValue="cursos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cursos" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Cursos
          </TabsTrigger>
          <TabsTrigger value="detalle" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Detalle Curso
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Usuarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cursos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros de Cursos</CardTitle>
              <CardDescription>Filtra cursos por diferentes criterios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Por Categoría</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ej: Programación"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    />
                    <Button onClick={fetchCoursesByCategory} disabled={loading}>
                      Buscar
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Por ID Profesor</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="ID del profesor"
                      value={professorFilter}
                      onChange={(e) => setProfesorFilter(e.target.value)}
                    />
                    <Button onClick={fetchCoursesByProfessor} disabled={loading}>
                      Buscar
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Por Rango de Fechas</Label>
                  <div className="space-y-2">
                    <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                    <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                    <Button onClick={fetchCoursesByDateRange} disabled={loading} className="w-full">
                      Buscar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {courses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados ({courses.length} cursos)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesor</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {courses.map((course) => (
                        <tr key={course.Id_Curso}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.Id_Curso}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {course.Nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.Categoria || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.profesor_nombre || "Sin asignar"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="detalle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Curso</CardTitle>
              <CardDescription>Obtén información detallada de un curso específico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="ID del curso"
                  value={courseIdDetail}
                  onChange={(e) => setCourseIdDetail(e.target.value)}
                />
                <Button onClick={fetchCourseDetail} disabled={loading}>
                  Obtener Detalle
                </Button>
              </div>
            </CardContent>
          </Card>

          {courseDetail && (
            <Card>
              <CardHeader>
                <CardTitle>Información del Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Nombre:</Label>
                    <p>{courseDetail.Nombre}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Categoría:</Label>
                    <p>{courseDetail.Categoria || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Profesor:</Label>
                    <p>{courseDetail.profesor_nombre || "Sin asignar"}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Estudiantes:</Label>
                    <p>{courseDetail.estudiantes_count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros de Usuarios</CardTitle>
              <CardDescription>Filtra usuarios por tipo o ID</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Todos los Usuarios</Label>
                  <Button onClick={fetchUsers} disabled={loading} className="w-full">
                    Ver Todos
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Por Tipo</Label>
                  <div className="flex space-x-2">
                    <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estudiante">Estudiante</SelectItem>
                        <SelectItem value="profesor">Profesor</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={fetchUsers} disabled={loading}>
                      Buscar
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Por ID</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="ID del usuario"
                      value={userIdFilter}
                      onChange={(e) => setUserIdFilter(e.target.value)}
                    />
                    <Button onClick={fetchUsers} disabled={loading}>
                      Buscar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {users.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Usuarios ({users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id_nodo}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id_nodo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.Nombre_completo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.Nombre_de_usuario_email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {user.Tipo_de_usuario}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {loading && <div className="text-center py-10">Cargando...</div>}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
