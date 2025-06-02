-- Insertar datos en la tabla Administrador
INSERT INTO Administrador (Id_administrador, Nombre, Nombre_de_usuario_email, Contraseña)
VALUES
(101, 'Juan Pérez', 'juan.perez@admin.com', 'admin123'),
(102, 'Ana Gómez', 'ana.gomez@admin.com', 'admin456'),
(103, 'Pedro López', 'pedro.lopez@admin.com', 'admin789'),
(104, 'Lucía Fernández', 'lucia.fernandez@admin.com', 'admin321'),
(105, 'Manuel Rodríguez', 'manuel.rodriguez@admin.com', 'admin654');

-- Insertar datos en la tabla Usuario
INSERT INTO Usuario (id_nodo, Id_administrador, Documento_identidad, Genero, Nombre_completo, Referencia_Bancaria, Tipo_de_usuario, nombre_de_usuario_email, Contraseña)
VALUES
(201, 101, '12345678', 'Masculino', 'Carlos Díaz', '000123456789', 'Estudiante', 'carlos.diaz@student.com', 'student123'),
(202, 102, '87654321', 'Femenino', 'Laura Martín', '000987654321', 'Profesor', 'laura.martin@professor.com', 'prof123'),
(203, 101, '11223344', 'Masculino', 'José Rodríguez', '000112233445', 'Estudiante', 'jose.rodriguez@student.com', 'student456'),
(204, 102, '22334455', 'Femenino', 'Marta Sánchez', '000223344556', 'Profesor', 'marta.sanchez@professor.com', 'prof456'),
(205, 103, '33445566', 'Masculino', 'Luis Gómez', '000334455667', 'Estudiante', 'luis.gomez@student.com', 'student789'),
(206, 103, '55667788', 'Femenino', 'Ana Martínez', '000556677889', 'Profesor', 'ana.martinez@professor.com', 'prof789'),
(207, 104, '66778899', 'Masculino', 'Raúl Pérez', '000667788990', 'Estudiante', 'raul.perez@student.com', 'student101'),
(208, 105, '77889900', 'Femenino', 'Isabel González', '000778899001', 'Profesor', 'isabel.gonzalez@professor.com', 'prof102'),
(209, 101, '88990011', 'Masculino', 'Ricardo López', '000889900112', 'Estudiante', 'ricardo.lopez@student.com', 'student202'),
(210, 101, '88220011', 'Femenino', 'Imelda López', '002289900112', 'Estudiante', 'Imelda.lopez@student.com', 'student212');

-- Insertar datos en la tabla Profesor
INSERT INTO Profesor (id_profesor, id_nodo, Area_principal_de_conocimiento, Area_alternativa_de_conocimiento, Telefono)
VALUES
(301, 202, 'Matemáticas', 'Estadística', '3001234567'),
(302, 204, 'Física', 'Química', '3007654321'),
(303, 206, 'Ciencias de la Computación', 'Inteligencia Artificial', '3009876543'),
(304, 208, 'Literatura', 'Linguística', '3006549871'),
(305, 210, 'Psicología', 'Neurociencia', '3004561239');

-- Insertar datos en la tabla Curso
INSERT INTO Curso (Id_Curso, Id_administrador, id_profesor, Nombre, url, Categoria, Fecha_inicio, Fecha_fin, Año, Semestre, Precio)
VALUES
(401, 101, 301, 'Introducción a la Programación', 'http://curso.programacion.com', 'Sistemas', '2025-06-01', '2025-07-01', 2025, 1, 200),
(402, 102, 302, 'Cálculo Diferencial', 'http://curso.calculo.com', 'Matemática', '2025-06-15', '2025-08-15', 2025, 1, 150),
(403, 101, 303, 'Estructuras de Datos', 'http://curso.estructuras.com', 'Sistemas', '2025-07-01', '2025-09-01', 2025, 2, 250),
(404, 103, 304, 'Física 101', 'http://curso.fisica.com', 'Física', '2025-06-05', '2025-08-05', 2025, 1, 180),
(405, 103, 305, 'Algoritmos y Complejidad', 'http://curso.algoritmos.com', 'Sistemas', '2025-07-10', '2025-09-10', 2025, 2, 220);

-- Insertar datos en la tabla Matricula
INSERT INTO Matricula (id_matricula, Id_Curso, fecha_matricula, Monto)
VALUES
(501, 401, '2025-05-15', 200),
(502, 402, '2025-05-17', 150),
(503, 403, '2025-06-01', 250),
(504, 404, '2025-06-10', 180),
(505, 405, '2025-06-20', 220);

-- Insertar datos en la tabla Estudiante
INSERT INTO Estudiante (id_estudiante, id_nodo, id_matricula)
VALUES
(601, 201, 501),
(602, 203, 502),
(603, 205, 503),
(604, 207, 504),
(605, 209, 505);

-- Insertar datos en la tabla Tarea
INSERT INTO Tarea (id_tarea, Id_Curso, Fecha_de_creacion, Puntaje, Fecha_de_entrega, Archivo, Descripcion_de_tarea, Nombre_de_tarea)
VALUES
(701, 401, '2025-06-01', 100, '2025-06-10', 'tarea_programacion.pdf', 'Desarrollar un programa en Python.', 'Tarea 1: Introducción a Python'),
(702, 402, '2025-06-15', 80, '2025-07-01', 'tarea_calculo.pdf', 'Resolver problemas de derivadas.', 'Tarea 1: Derivadas'),
(703, 403, '2025-07-01', 90, '2025-07-15', 'tarea_estructuras.pdf', 'Implementar una lista enlazada en C.', 'Tarea 1: Listas Enlazadas'),
(704, 404, '2025-06-05', 85, '2025-06-25', 'tarea_fisica.pdf', 'Resolver ejercicios de movimiento rectilíneo.', 'Tarea 1: Movimiento Rectilíneo'),
(705, 405, '2025-07-10', 95, '2025-07-25', 'tarea_algoritmos.pdf', 'Implementar un algoritmo de búsqueda binaria.', 'Tarea 1: Búsqueda Binaria');

-- Insertar datos en la tabla Material
INSERT INTO Material (id_material, Id_Curso, Descripcion, Titulo, Archivo)
VALUES
(801, 401, 'Material de lectura para el curso de programación.', 'Introducción a Python', 'material_programacion.pdf'),
(802, 402, 'Material de lectura para el curso de cálculo.', 'Cálculo Diferencial', 'material_calculo.pdf'),
(803, 403, 'Material de lectura para estructuras de datos.', 'Estructuras de Datos', 'material_estructuras.pdf'),
(804, 404, 'Material de lectura para física básica.', 'Física 101', 'material_fisica.pdf'),
(805, 405, 'Material de lectura para algoritmos.', 'Algoritmos y Complejidad', 'material_algoritmos.pdf');

-- Insertar datos en la tabla Foro
INSERT INTO Foro (id_foro, Id_Curso, Nombre, Descripcion, Fecha_de_creacion, Fecha_de_terminacion)
VALUES
(901, 401, 'Foro de Programación', 'Foro para discutir sobre las tareas y dudas de programación.', '2025-06-01', '2025-06-30'),
(902, 402, 'Foro de Cálculo', 'Foro para resolver dudas sobre cálculo diferencial.', '2025-06-15', '2025-07-15'),
(903, 403, 'Foro de Estructuras de Datos', 'Foro para discutir sobre estructuras de datos y tareas relacionadas.', '2025-07-01', '2025-07-30'),
(904, 404, 'Foro de Física', 'Foro para resolver dudas sobre física básica.', '2025-06-05', '2025-06-30'),
(905, 405, 'Foro de Algoritmos', 'Foro para discutir sobre algoritmos y tareas del curso.', '2025-07-10', '2025-07-30');

-- Insertar datos en la tabla Mensaje
INSERT INTO Mensaje (id_mensaje, id_nodo, Id_foro, Nombre, Descripcion, id_mensaje_replica)
VALUES
(1001, 201, 901, 'Carlos Díaz', '¿Cómo hago la tarea 1?', NULL),
(1002, 202, 901, 'Laura Martín', 'Necesitas implementar una función en Python.', 1001),
(1003, 203, 901, 'José Rodríguez', 'Estoy atascado con la segunda parte, ¿alguien me ayuda?', 1001),
(1004, 204, 902, 'Marta Sánchez', '¿Cuál es la fórmula de la derivada de una función trigonométrica?', NULL),
(1005, 205, 902, 'Ana Martínez', 'La derivada de seno es coseno, y la de coseno es -seno.', 1004),
(1006, 206, 903, 'Raúl Pérez', '¿Qué tipo de lista enlazada debo usar?', NULL),
(1007, 207, 903, 'Ricardo López', 'Usa una lista doblemente enlazada para un acceso rápido.', 1006),
(1008, 208, 904, 'Isabel González', '¿Cuál es la diferencia entre velocidad y rapidez?', NULL),
(1009, 209, 905, 'Ana Martínez', 'La velocidad es un vector, mientras que la rapidez es un escalar.', 1008);
