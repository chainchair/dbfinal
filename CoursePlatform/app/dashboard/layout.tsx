"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, LogOut, Menu, Users, BookIcon, BarChart3, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { User } from "lucide-react" // Import User icon

interface DashboardUser {
  id_nodo: number | null
  nombre: string
  email: string
  tipo: string
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DashboardUser | null>(null)
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/login")
    }
  }, [router])

  if (!isMounted) {
    return null
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const getMenuItems = () => {
    const commonItems = [
      {
        icon: <BookIcon className="h-5 w-5" />,
        label: "Mis Cursos",
        href: `/dashboard/${user.tipo}`,
      },
    ]

    if (user.tipo === "administrador") {
      return [
        ...commonItems,
        {
          icon: <Users className="h-5 w-5" />,
          label: "Matricular Usuario",
          href: `/dashboard/administrador/matriculas`,
        },
        {
          icon: <User className="h-5 w-5" />,
          label: "Asignar Profesor",
          href: `/dashboard/administrador/profesores`,
        },
        {
          icon: <BookOpen className="h-5 w-5" />,
          label: "Materiales",
          href: `/dashboard/administrador/materiales`,
        },
        {
          icon: <MessageSquare className="h-5 w-5" />,
          label: "Foros",
          href: `/dashboard/administrador/foros`,
        },
        {
          icon: <BarChart3 className="h-5 w-5" />,
          label: "Reportes",
          href: `/dashboard/administrador/reportes`,
        },
      ]
    } else if (user.tipo === "profesor") {
      return [
        ...commonItems,
        {
          icon: <Users className="h-5 w-5" />,
          label: "Estudiantes",
          href: `/dashboard/profesor/estudiantes`,
        },
        {
          icon: <BookOpen className="h-5 w-5" />,
          label: "Materiales",
          href: `/dashboard/profesor/materiales`,
        },
        {
          icon: <MessageSquare className="h-5 w-5" />,
          label: "Foros",
          href: `/dashboard/profesor/foros`,
        },
      ]
    } else {
      return [
        ...commonItems,
        {
          icon: <BookOpen className="h-5 w-5" />,
          label: "Materiales",
          href: `/dashboard/estudiante/materiales`,
        },
        {
          icon: <MessageSquare className="h-5 w-5" />,
          label: "Foros",
          href: `/dashboard/estudiante/foros`,
        },
      ]
    }
  }

  const menuItems = getMenuItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-xl font-bold">Plataforma de Cursos</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <span className="font-medium">{user.nombre}</span>
              <span className="text-sm text-blue-200 ml-2 capitalize">({user.tipo})</span>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="py-4">
                  <div className="text-center mb-6">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                      <Users className="h-8 w-8" />
                    </div>
                    <h3 className="font-medium">{user.nombre}</h3>
                    <p className="text-sm text-gray-500 capitalize">{user.tipo}</p>
                  </div>

                  <nav className="space-y-2">
                    {menuItems.map((item, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => router.push(item.href)}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="ml-2">Cerrar Sesión</span>
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex">
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar and Content */}
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row">
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden md:block w-64 mr-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push(item.href)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-lg shadow-sm p-6">{children}</main>
      </div>
    </div>
  )
}
