# dbfinal

Proyecto final del curso de Bases de Datos. Este repositorio contiene:

- Scripts SQL para crear y poblar la base de datos.
- Una aplicación web desarrollada con Node.js.
- Una interfaz de línea de comandos (CLI) en Python para interactuar con la base de datos.

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
