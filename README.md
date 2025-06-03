# Materia: S2561-0701 Base de datos
#
# Estudiante(s): 
# Leidy Gallo Vargas igallov@eafit.edu.co
# Samuel David Serpa sdserpaz@eafit.edu.co
# Julian Lara Aristizábal jlaraa@eafit.edu.co
#
# Profesor: EDWIN NELSON MONTOYA MUNERA, emontoya@eafit.edu.co
#
# Course Platform entrega 3

# Descripción del Proyecto:
Este proyecto consiste en el diseño e implementación de una base de datos para un Sistema de Gestión de Cursos en Línea, como parte del proyecto final del curso SI2003 - Sistemas de Gestión de Datos de la Universidad EAFIT. El sistema está orientado a apoyar la plataforma NODO, una iniciativa institucional para ofrecer cursos virtuales en diversas áreas del conocimiento.

## El proyecto incluye:

- **Modelado de datos** mediante un diagrama Entidad-Relación y su respectiva normalización.
- **Implementación física en MySQL** utilizando sentencias DDL y DML.
- **Desarrollo de consultas SQL** para la extracción de información clave desde la base de datos.
- **Creación de una aplicación**:
- La solución se puede **ejecutar desde consola en Python**

## Funcionalidades de la Aplicación
1. **Login/Logout**  
   Autenticar al usuario con su nombre de usuario y contraseña, los cuales estarán registrados en la tabla `Usuarios`.

2. **Opciones para un Administrador**  
   - Matricular usuarios a un curso.  
   - Asignar un profesor a un curso.  
   - Acceso a todas las opciones disponibles para profesores y alumnos.

3. **Opciones para Profesor y Alumno**  
   - Listar sus cursos.  
   - Ingresar a un curso y poder realizar:
     - Listar alumnos.  
     - Listar materiales.  
     - Foros (enviar mensajes, responder mensajes).  
     - Tareas.  
     - Subir materiales (solo profesor, se simulan con URLs ficticias).  
     - Crear foro (solo profesor).  
     - Salir del curso y regresar a la lista de cursos.

4. **Reportes (solo Administradores)**  
   - Listar todos los cursos por algún mecanismo de filtrado:
     - Código del curso.
     - Código del profesor.
     - Rango de fechas.
     - Otro criterio relevante.
   - Ver la información de un curso: detalles del curso, su profesor y alumnos (excluyendo materiales, tareas y foros).
   - Listar usuarios por algún mecanismo de filtrado:
     - Todos.
     - Por rol.
     - Por ID, etc.

## Descripción del Ambiente de Desarrollo y Técnico

El proyecto fue desarrollado utilizando el siguiente entorno técnico:
- **Lenguaje principal:** Python 3.x
- **Base de datos:** MySQL
- **Cliente MySQL:** MySQL Workbench
- **Lógica de aplicación:** Python, orientado a consola
- **Gestión de versiones y colaboración:** Git y GitHub  
  [Repositorio del proyecto](https://github.com/chainchair/dbfinal)
## 📁 Contenido del Repositorio

- **database/**: Contiene los scripts SQL para la creación y población de la base de datos.
- **CoursePlatform/**: Aplicación web construida con Node.js.
- **PlataformaCursos.py**: Script en Python que proporciona una interfaz CLI para interactuar con la base de datos.
- **README.md**: Este archivo.

## ⚙️ Requisitos Previos

- [Node.js](https://nodejs.org/) (versión recomendada: 14.x o superior)
- [Python](https://www.python.org/) (versión recomendada: 3.8 o superior)
- [PostgreSQL](https://www.postgresql.org/) (versión recomendada: 12.x o superior)
- [`psycopg2`](https://pypi.org/project/psycopg2/) (para la conexión de Python con PostgreSQL)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/chainchair/dbfinal.git
cd dbfinal
```

### 2. Configurar la base de datos

1. Crear la base de datos en MySQL Workbench o desde consola:

```sql
CREATE DATABASE Universidad;
```

2. Ejecutar los scripts SQL:

2. Ejecutar los scripts SQL:

```bash
mysql -u tu_usuario -p Universidad < database/crear_tablas.sql
mysql -u tu_usuario -p Universidad < database/poblar_tablas.sql
```

### 3. Configurar la aplicación web (Node.js)

1. Navegar al directorio:

```bash
cd CoursePlatform
```

2. Instalar dependencias:

```bash
npm install --legacy-peer-deps
```

3. Abrir la subcarpeta lib y en el archivo database.ts verificar que la info de la base de datos en workbench este correcta (Usuario, host, contraseña etc..)

4. Iniciar servidor:

```bash
npm run dev
```

Accede a la aplicación en `http://localhost:3000`.

### 4. Usar la CLI en Python

1. Instalar dependencias:

```bash
pip install psycopg2
```

2. Ejecutar el programa:

```bash
python PlataformaCursos.py
```

## 🗂️ Estructura del Proyecto

```
dbfinal/
├── CoursePlatform/        # Aplicación web en Node.js
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── styles/
│   ├── components.json
│   ├── next.config.mjs
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── postcss.config.mjs
│   ├── tailwind.config.ts
│   └── tsconfig.json
|
├── database/              # Scripts SQL
│   ├── crear_tablas.sql
│   └── poblar_tablas.sql
├── PlataformaCursos.py    # Interfaz CLI en Python
├── .gitignore
└── README.md              # Este archivo
```


### Referencias:
- https://www.w3schools.com/python/
- https://nodejs.org/api/all.html
