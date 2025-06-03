-- 1. Listar todos los estudiantes (nombre completo, matrícula) de la base de datos ordenados alfabéticamente por nombre para un año y semestre concreto.
SELECT u.Nombre_completo, m.id_matricula
FROM Estudiante e
JOIN Usuario u ON e.id_nodo = u.id_nodo
JOIN Matricula m ON e.id_matricula = m.id_matricula
JOIN Curso c ON m.Id_Curso = c.Id_Curso
WHERE c.Año = 2025 AND c.Semestre = 1
ORDER BY u.Nombre_completo;

-- 2. Listar todos los estudiantes (nombre completo) de la base de datos de un curso determinado para un año y semestre concreto.
SELECT u.Nombre_completo
FROM Estudiante e
JOIN Usuario u ON e.id_nodo = u.id_nodo
JOIN Matricula m ON e.id_matricula = m.id_matricula
JOIN Curso c ON m.Id_Curso = c.Id_Curso
WHERE c.Id_Curso = 402
AND c.Año = 2025 AND c.Semestre = 1;

-- 3. Listar todos los cursos que un estudiante ha tenido entre un rango de fechas en la base de datos.
SELECT c.Nombre, c.Fecha_inicio, c.Fecha_fin
FROM Curso c
JOIN Matricula m ON c.Id_Curso = m.Id_Curso
JOIN Estudiante e ON m.id_matricula = e.id_matricula
WHERE e.id_nodo = 201
AND c.Fecha_inicio BETWEEN '2025-01-01' AND '2025-12-31';

-- 4. Listar los profesores (número de identificación, nombre completo) y los cursos que tiene asignados actualmente.
SELECT p.id_profesor, u.Nombre_completo, c.Nombre AS Curso
FROM Profesor p
JOIN Usuario u ON p.id_nodo = u.id_nodo
JOIN Curso c ON p.id_profesor = c.id_profesor;

-- 5. Listar todos los cursos ordenados por categoría. (nombre del curso, categoría).
SELECT c.Nombre, c.Categoria
FROM Curso c
ORDER BY c.Categoria;

-- 6. Listar los cursos con un rango de precio entre val_minimo y val_maximo.
SELECT c.Nombre, c.Precio
FROM Curso c
WHERE c.Precio BETWEEN 150 AND 200;

-- 7. Listar los usuarios que están registrados, pero no están matriculados en ningún curso para un año y semestre específico.
SELECT u.Nombre_completo
FROM Usuario u
LEFT JOIN Estudiante e ON u.id_nodo = e.id_nodo
LEFT JOIN Matricula m ON e.id_matricula = m.id_matricula
LEFT JOIN Curso c ON m.Id_Curso = c.Id_Curso
WHERE c.Id_Curso IS NULL
AND (c.Año = 2025 AND c.Semestre = 2);

-- 8. Listar los cursos que se encuentran en una categoría.
SELECT c.Nombre
FROM Curso c
WHERE c.Categoria = 'sistemas';

-- 9. Listar las tareas que los estudiantes deben realizar en el curso dado con identificador x.
SELECT t.Nombre_de_tarea, t.Fecha_de_entrega, t.Puntaje
FROM Tarea t
WHERE t.Id_Curso = 403;

-- 10. Listar los materiales que el profesor ha publicado en un curso dado.
SELECT m.Titulo, m.Descripcion
FROM Material m
JOIN Curso c ON m.Id_Curso = c.Id_Curso
WHERE c.Id_Curso = 403;

-- 11. Listar todos los mensajes de un foro en un curso, listando el ID y nombre del que envió el mensaje (a modo de ejemplo, especifique ID de curso/foro o solo ID de foro).
SELECT m.id_mensaje, u.Nombre_completo, m.Descripcion
FROM Mensaje m
JOIN Foro f ON m.Id_foro = f.id_foro
JOIN Usuario u ON m.id_nodo = u.id_nodo
WHERE f.Id_Curso = 403;

-- 12. Especifique una consulta que consideraría muy importante en este sistema, y la realiza.
-- Una consulta importante en este sistema podría ser listar todos los estudiantes matriculados en un curso específico y obtener la lista de las tareas y materiales asociados a ese curso.
SELECT u.Nombre_completo, t.Nombre_de_tarea, t.Fecha_de_entrega, m_material.Titulo AS Material_Titulo
FROM Estudiante e
JOIN Usuario u ON e.id_nodo = u.id_nodo
JOIN Matricula m ON e.id_matricula = m.id_matricula
JOIN Curso c ON m.Id_Curso = c.Id_Curso
LEFT JOIN Tarea t ON c.Id_Curso = t.Id_Curso
LEFT JOIN Material m_material ON c.Id_Curso = m_material.Id_Curso
WHERE c.Id_Curso = 403