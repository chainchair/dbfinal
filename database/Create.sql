CREATE DATABASE IF NOT EXISTS Universidad;
USE Universidad;

-- Tabla Administrador
CREATE TABLE IF NOT EXISTS Administrador (
    Id_administrador INT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Nombre_de_usuario_email VARCHAR(255) UNIQUE NOT NULL,
    Contraseña VARCHAR(255) NOT NULL
);

-- Tabla Usuario
CREATE TABLE IF NOT EXISTS Usuario (
    id_nodo INT PRIMARY KEY,
    Id_administrador INT,
    Documento_identidad VARCHAR(255) NOT NULL,
    Genero VARCHAR(10),
    Nombre_completo VARCHAR(255) NOT NULL,
    Referencia_Bancaria VARCHAR(255),
    Tipo_de_usuario VARCHAR(255) NOT NULL,
    nombre_de_usuario_email VARCHAR(255) UNIQUE NOT NULL,
    Contraseña VARCHAR(255) NOT NULL,
    FOREIGN KEY (Id_administrador) REFERENCES Administrador(Id_administrador)
);

-- Tabla Profesor
CREATE TABLE IF NOT EXISTS Profesor (
    id_profesor INT PRIMARY KEY,
    id_nodo INT,
    Area_principal_de_conocimiento VARCHAR(255),
    Area_alternativa_de_conocimiento VARCHAR(255),
    Telefono VARCHAR(15),
    FOREIGN KEY (id_nodo) REFERENCES Usuario(id_nodo)
);

-- Tabla Curso
CREATE TABLE IF NOT EXISTS Curso (
    Id_Curso INT PRIMARY KEY,
    Id_administrador INT,
    id_profesor INT,
    Nombre VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    Categoria VARCHAR(255),
    Fecha_inicio DATE,
    Fecha_fin DATE,
    Año INT,
    Semestre INT,
    Precio DECIMAL(10, 2),
    FOREIGN KEY (Id_administrador) REFERENCES Administrador(Id_administrador),
    FOREIGN KEY (id_profesor) REFERENCES Profesor(id_profesor)
);

-- Tabla Matricula
CREATE TABLE IF NOT EXISTS Matricula (
    id_matricula INT PRIMARY KEY,
    Id_Curso INT,
    fecha_matricula DATE,
    id_pago INT,
    Monto DECIMAL(10, 2),
    FOREIGN KEY (Id_Curso) REFERENCES Curso(Id_Curso)
);

-- Tabla Estudiante
CREATE TABLE IF NOT EXISTS Estudiante (
    id_estudiante INT PRIMARY KEY,
    id_nodo INT,
    id_matricula INT,
    FOREIGN KEY (id_nodo) REFERENCES Usuario(id_nodo),
    FOREIGN KEY (id_matricula) REFERENCES Matricula(id_matricula)
);

-- Tabla Tarea
CREATE TABLE IF NOT EXISTS Tarea (
    id_tarea INT PRIMARY KEY,
    Id_Curso INT,
    Fecha_de_creacion DATE,
    Puntaje INT,
    Fecha_de_entrega DATE,
    Archivo VARCHAR(255),
    Descripcion_de_tarea TEXT,
    Nombre_de_tarea VARCHAR(255),
    FOREIGN KEY (Id_Curso) REFERENCES Curso(Id_Curso)
);

-- Tabla Material
CREATE TABLE IF NOT EXISTS Material (
    id_material INT PRIMARY KEY,
    Id_Curso INT,
    Descripcion TEXT,
    Titulo VARCHAR(255),
    Archivo VARCHAR(255),
    FOREIGN KEY (Id_Curso) REFERENCES Curso(Id_Curso)
);

-- Tabla Foro
CREATE TABLE IF NOT EXISTS Foro (
    id_foro INT PRIMARY KEY,
    Id_Curso INT,
    Nombre VARCHAR(255),
    Descripcion TEXT,
    Fecha_de_creacion DATE,
    Fecha_de_terminacion DATE,
    FOREIGN KEY (Id_Curso) REFERENCES Curso(Id_Curso)
);

-- Tabla Mensaje
CREATE TABLE IF NOT EXISTS Mensaje (
    id_mensaje INT PRIMARY KEY,
    id_nodo INT,
    Id_foro INT,
    Nombre VARCHAR(255),
    Descripcion TEXT,
    id_mensaje_replica INT,
    FOREIGN KEY (id_nodo) REFERENCES Usuario(id_nodo),
    FOREIGN KEY (Id_foro) REFERENCES Foro(id_foro),
    FOREIGN KEY (id_mensaje_replica) REFERENCES Mensaje(id_mensaje)
);
