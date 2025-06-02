"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle } from "lucide-react"

export default function MatriculasPage() {
  const [idNodo, setIdNodo] = useState("")
  const [idCurso, setIdCurso] = useState("")
  const [fecha, setFecha] = useState("")
  const [monto, setMonto] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/matricular", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idNodo: Number.parseInt(idNodo),
          idCurso: Number.parseInt(idCurso),
          fecha,
          monto: Number.parseFloat(monto),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        // Clear form
        setIdNodo("")
        setIdCurso("")
        setFecha("")
        setMonto("")
      } else {
        setError(data.message || "Error al matricular usuario")
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
        <h2 className="text-2xl font-bold text-blue-900">Matricular Usuario</h2>
        <p className="text-gray-500">Asigna estudiantes a cursos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulario de Matrícula</CardTitle>
          <CardDescription>Ingresa los datos para matricular un usuario a un curso</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idNodo">ID del Usuario (id_nodo)</Label>
                <Input
                  id="idNodo"
                  type="number"
                  value={idNodo}
                  onChange={(e) => setIdNodo(e.target.value)}
                  required
                  placeholder="Ej: 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idCurso">ID del Curso</Label>
                <Input
                  id="idCurso"
                  type="number"
                  value={idCurso}
                  onChange={(e) => setIdCurso(e.target.value)}
                  required
                  placeholder="Ej: 101"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha de Matrícula</Label>
                <Input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monto">Monto</Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  required
                  placeholder="Ej: 100.00"
                />
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

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Matricular Usuario"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
