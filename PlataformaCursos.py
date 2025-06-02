
import mysql.connector
import pwinput

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'contraseña-va-aqui',  
    'database': 'Universidad'
}

def conectar():
    return mysql.connector.connect(**DB_CONFIG)

def login():
    print("\n--- LOGIN ---")
    username = input("Usuario (email): ").strip()
    password = pwinput.pwinput(prompt="Contraseña: ", mask="*").strip()

    conn = conectar()
    cursor = conn.cursor(dictionary=True)

    query_user = "SELECT * FROM Usuario WHERE nombre_de_usuario_email = %s AND Contraseña = %s"
    cursor.execute(query_user, (username, password))
    usuario = cursor.fetchone()

    if usuario:
        usuario['Tipo_de_usuario'] = usuario['Tipo_de_usuario'].capitalize()
        print(f"Bienvenido/a {usuario['Nombre_completo']} ({usuario['Tipo_de_usuario']})")
        cursor.close()
        conn.close()
        return usuario

    query_admin = "SELECT * FROM Administrador WHERE Nombre_de_usuario_email = %s AND Contraseña = %s"
    cursor.execute(query_admin, (username, password))
    admin = cursor.fetchone()

    if admin:
        admin_usuario = {
            'id_nodo': None,
            'Tipo_de_usuario': 'Administrador',
            'Nombre_completo': admin['Nombre'],
            'Nombre_de_usuario_email': admin['Nombre_de_usuario_email']
        }
        print(f"Bienvenido/a {admin_usuario['Nombre_completo']} (Administrador)")
        cursor.close()
        conn.close()
        return admin_usuario

    cursor.close()
    conn.close()
    print("Usuario o contraseña incorrectos.")
    return None


def menu_principal(usuario):
    rol = usuario['Tipo_de_usuario'].lower()

    if rol == "administrador":
        while True:
            print("\n--- MENÚ PRINCIPAL ---")
            print("1. Matricular usuario a un curso")
            print("2. Asignar profesor a curso")
            print("3. Reportes")
            print("4. Funciones de profesor")
            print("5. Funciones de estudiante")
            print("9. Cerrar sesión")
            print("0. Salir")
            opcion = input("Seleccione una opción: ")
            if opcion == "1":
                matricular_usuario()
            elif opcion == "2":
                asignar_profesor()
            elif opcion == "3":
                reportes()
            elif opcion == "4":
                menu_profesor(usuario)
            elif opcion == "5":
                menu_estudiante(usuario)
            elif opcion == "9":
                return None
            elif opcion == "0":
                exit()

    elif rol == "profesor":
        menu_profesor(usuario)
        return None

    elif rol == "estudiante":
        menu_estudiante(usuario)
        return None

    else:
        print("Rol no reconocido.")
        return None

def menu_profesor(usuario):
    while True:
        print("\n--- MENÚ PROFESOR ---")
        print("1. Listar cursos")
        print("2. Ver estudiantes")
        print("3. Ver materiales")
        print("4. Subir material")
        print("5. Ver y participar en foros")
        print("6. Crear foro")
        print("0. Volver")
        opcion = input("Seleccione una opción: ")
        if opcion == "1":
            listar_cursos(usuario)
        elif opcion == "2":
            listar_estudiantes(usuario)
        elif opcion == "3":
            listar_materiales(usuario)
        elif opcion == "4":
            subir_material_profesor(usuario)
        elif opcion == "5":
            ver_y_participar_en_foro(usuario)
        elif opcion == "6":
            crear_foro(usuario)
        elif opcion == "0":
            break


def menu_estudiante(usuario):
    while True:
        print("\n--- MENÚ ESTUDIANTE ---")
        print("1. Listar cursos")
        print("2. Ver materiales")
        print("3. Ver y participar en foros")
        print("0. Volver")
        opcion = input("Seleccione una opción: ")
        if opcion == "1":
            listar_cursos(usuario)
        elif opcion == "2":
            listar_materiales(usuario)
        elif opcion == "3":
            ver_y_participar_en_foro(usuario)
        elif opcion == "0":
            break


def listar_cursos(usuario):
    conn = conectar()
    cursor = conn.cursor()
    if usuario['Tipo_de_usuario'].lower() == 'estudiante':
        query = """SELECT c.Id_Curso, c.Nombre FROM Estudiante e
                   JOIN Matricula m ON e.id_matricula = m.id_matricula
                   JOIN Curso c ON m.Id_Curso = c.Id_Curso
                   WHERE e.id_nodo = %s"""
    else:
        query = """SELECT c.Id_Curso, c.Nombre FROM Curso c
                   JOIN Profesor p ON c.id_profesor = p.id_profesor
                   WHERE p.id_nodo = %s"""
    cursor.execute(query, (usuario['id_nodo'],))
    cursos = cursor.fetchall()
    if cursos:
        for curso in cursos:
            print(f"{curso[0]} - {curso[1]}")
    else:
        print("No hay cursos registrados.")
    cursor.close()
    conn.close()

def listar_estudiantes(usuario):
    curso_id = input("ID del curso: ")
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""SELECT u.Nombre_completo FROM Estudiante e
                      JOIN Usuario u ON e.id_nodo = u.id_nodo
                      JOIN Matricula m ON e.id_matricula = m.id_matricula
                      WHERE m.Id_Curso = %s""", (curso_id,))
    estudiantes = cursor.fetchall()
    print("\n--- ESTUDIANTES ---")
    for e in estudiantes:
        print(f"- {e[0]}")
    cursor.close()
    conn.close()

def listar_materiales(usuario):
    curso_id = input("ID del curso: ")
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT Titulo, Descripcion FROM Material WHERE Id_Curso = %s", (curso_id,))
    materiales = cursor.fetchall()
    for m in materiales:
        print(f"- {m[0]}: {m[1]}")
    cursor.close()
    conn.close()

def subir_material_profesor(usuario):
    print("\n--- SUBIR MATERIAL A UN CURSO ---")

    try:
        conn = conectar()
        cursor = conn.cursor()

        # Mostrar cursos asignados al profesor
        cursor.execute("""
            SELECT c.Id_Curso, c.Nombre FROM Curso c
            JOIN Profesor p ON c.id_profesor = p.id_profesor
            WHERE p.id_nodo = %s
        """, (usuario['id_nodo'],))
        cursos = cursor.fetchall()

        if not cursos:
            print("No tienes cursos asignados.")
            return

        print("Cursos disponibles:")
        for curso in cursos:
            print(f"{curso[0]} - {curso[1]}")

        id_curso = int(input("Seleccione el ID del curso: "))
        if id_curso not in [c[0] for c in cursos]:
            print("Curso no válido.")
            return

        titulo = input("Título del material: ")
        descripcion = input("Descripción del material: ")
        archivo = input("URL ficticia del archivo: ")

        # Generar manualmente id_material
        cursor.execute("SELECT MAX(id_material) FROM Material")
        ultimo_id = cursor.fetchone()[0] or 800
        nuevo_id = ultimo_id + 1

        insert_query = """
        INSERT INTO Material (id_material, Id_Curso, Descripcion, Titulo, Archivo)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (nuevo_id, id_curso, descripcion, titulo, archivo))
        conn.commit()

        print("Material subido correctamente.")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Error al subir material: {e}")


def crear_foro(usuario):
    print("\n--- CREAR FORO ---")
    try:
        curso_id = int(input("Curso ID: "))
        nombre = input("Nombre del foro: ")
        descripcion = input("Descripción: ")
        fecha_ini = input("Fecha de creación (YYYY-MM-DD): ")
        fecha_fin = input("Fecha de terminación (YYYY-MM-DD): ")

        # Validar formato de fecha
        if "/" in fecha_ini or "/" in fecha_fin:
            print("Por favor usa el formato correcto: YYYY-MM-DD")
            return

        conn = conectar()
        cursor = conn.cursor()

        # Generar id_foro manualmente
        cursor.execute("SELECT MAX(id_foro) FROM Foro")
        ultimo_id = cursor.fetchone()[0] or 900
        nuevo_id = ultimo_id + 1

        insert_query = """
        INSERT INTO Foro (id_foro, Id_Curso, Nombre, Descripcion, Fecha_de_creacion, Fecha_de_terminacion)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (nuevo_id, curso_id, nombre, descripcion, fecha_ini, fecha_fin))
        conn.commit()

        print("Foro creado correctamente.")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Error al crear foro: {e}")


def matricular_usuario():
    print("\n--- MATRICULAR USUARIO A UN CURSO ---")
    try:
        id_nodo = int(input("ID del usuario (id_nodo): "))
        id_curso = int(input("ID del curso: "))
        fecha = input("Fecha de matrícula (YYYY-MM-DD): ")
        monto = float(input("Monto: "))

        if "/" in fecha:
            print("Por favor usa el formato correcto: YYYY-MM-DD")
            return

        conn = conectar()
        cursor = conn.cursor()


        cursor.execute("""
            SELECT m.id_matricula
            FROM Matricula m
            JOIN Estudiante e ON m.id_matricula = e.id_matricula
            WHERE e.id_nodo = %s AND m.Id_Curso = %s
        """, (id_nodo, id_curso))

        if cursor.fetchone():
            print("Este usuario ya está matriculado en este curso.")
            return


        cursor.execute("SELECT MAX(id_matricula) FROM Matricula")
        ultimo_id = cursor.fetchone()[0] or 500
        nuevo_id_matricula = ultimo_id + 1

        cursor.execute("INSERT INTO Matricula (id_matricula, Id_Curso, fecha_matricula, Monto) VALUES (%s, %s, %s, %s)",
                       (nuevo_id_matricula, id_curso, fecha, monto))
        conn.commit()

        cursor.execute("SELECT MAX(id_estudiante) FROM Estudiante")
        ultimo_est = cursor.fetchone()[0] or 600
        nuevo_id_estudiante = ultimo_est + 1

        cursor.execute("INSERT INTO Estudiante (id_estudiante, id_nodo, id_matricula) VALUES (%s, %s, %s)",
                       (nuevo_id_estudiante, id_nodo, nuevo_id_matricula))
        conn.commit()

        print("Usuario matriculado con éxito.")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Error al matricular: {e}")


def asignar_profesor():
    id_curso = int(input("ID del curso: "))
    id_profesor = int(input("ID del profesor: "))
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT Nombre FROM Curso WHERE Id_Curso = %s", (id_curso,))
    curso = cursor.fetchone()
    if not curso:
        print("Curso no encontrado.")
        return
    cursor.execute("UPDATE Curso SET id_profesor = %s WHERE Id_Curso = %s", (id_profesor, id_curso))
    conn.commit()
    print(f"Profesor asignado a {curso[0]}")
    cursor.close()
    conn.close()

def reportes():
    while True:
        print("\n--- REPORTES ---")
        print("1. Cursos por filtro")
        print("2. Detalles de un curso")
        print("3. Usuarios por filtro")
        print("0. Volver")
        opcion = input("Opción: ")
        if opcion == "1":
            listar_cursos_filtrados()
        elif opcion == "2":
            info_detallada_curso()
        elif opcion == "3":
            listar_usuarios_filtrados()
        elif opcion == "0":
            break

def listar_cursos_filtrados():
    print("1. Por categoría")
    print("2. Por ID profesor")
    print("3. Por rango de fechas")
    conn = conectar()
    cursor = conn.cursor()
    filtro = input("Seleccione filtro: ")
    if filtro == "1":
        categoria = input("Categoría: ")
        cursor.execute("SELECT Id_Curso, Nombre FROM Curso WHERE Categoria = %s", (categoria,))
    elif filtro == "2":
        idp = input("ID profesor: ")
        cursor.execute("SELECT Id_Curso, Nombre FROM Curso WHERE id_profesor = %s", (idp,))
    elif filtro == "3":
        ini = input("Desde (YYYY-MM-DD): ")
        fin = input("Hasta (YYYY-MM-DD): ")
        cursor.execute("SELECT Id_Curso, Nombre FROM Curso WHERE Fecha_inicio BETWEEN %s AND %s", (ini, fin))
    for row in cursor.fetchall():
        print(f"{row[0]} - {row[1]}")
    cursor.close()
    conn.close()

def info_detallada_curso():
    idc = input("ID curso: ")
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT c.Nombre, c.Categoria, u.Nombre_completo,
        (SELECT COUNT(*) FROM Estudiante e JOIN Matricula m ON e.id_matricula = m.id_matricula WHERE m.Id_Curso = c.Id_Curso)
    FROM Curso c
    LEFT JOIN Profesor p ON c.id_profesor = p.id_profesor
    LEFT JOIN Usuario u ON p.id_nodo = u.id_nodo
    WHERE c.Id_Curso = %s""", (idc,))
    row = cursor.fetchone()
    if row:
        print(f"Nombre: {row[0]}, Categoría: {row[1]}, Profesor: {row[2]}, Estudiantes: {row[3]}")
    cursor.close()
    conn.close()

def listar_usuarios_filtrados():
    print("1. Todos 2. Por Rol 3. Por ID")
    conn = conectar()
    cursor = conn.cursor()
    tipo = input("Seleccione: ")
    if tipo == "1":
        cursor.execute("SELECT id_nodo, Nombre_completo, Tipo_de_usuario FROM Usuario")
    elif tipo == "2":
        rol = input("Rol: ")
        cursor.execute("SELECT id_nodo, Nombre_completo, Tipo_de_usuario FROM Usuario WHERE Tipo_de_usuario = %s", (rol,))
    elif tipo == "3":
        idn = input("ID usuario: ")
        cursor.execute("SELECT id_nodo, Nombre_completo, Tipo_de_usuario FROM Usuario WHERE id_nodo = %s", (idn,))
    for u in cursor.fetchall():
        print(f"{u[0]} - {u[1]} ({u[2]})")
    cursor.close()
    conn.close()


def ver_y_participar_en_foro(usuario):
    print("\n--- FOROS DEL CURSO ---")
    try:
        curso_id = int(input("Ingrese ID del curso: "))
        conn = conectar()
        cursor = conn.cursor()

        # Mostrar foros del curso
        cursor.execute("SELECT id_foro, Nombre FROM Foro WHERE Id_Curso = %s", (curso_id,))
        foros = cursor.fetchall()
        if not foros:
            print("No hay foros para este curso.")
            return

        print("Foros disponibles:")
        for foro in foros:
            print(f"{foro[0]} - {foro[1]}")

        foro_id = int(input("Seleccione el ID del foro: "))
        if foro_id not in [f[0] for f in foros]:
            print("Foro no válido.")
            return

        while True:
            print("\n--- MENSAJES EN EL FORO ---")
            cursor.execute("""
                SELECT m.id_mensaje, u.Nombre_completo, m.Descripcion, m.id_mensaje_replica
                FROM Mensaje m
                JOIN Usuario u ON m.id_nodo = u.id_nodo
                WHERE m.Id_foro = %s
                ORDER BY m.id_mensaje
            """, (foro_id,))
            mensajes = cursor.fetchall()
            for m in mensajes:
                prefix = f"↳ Respuesta a {m[3]}" if m[3] else ""
                print(f"[{m[0]}] {m[1]}: {m[2]} {prefix}")

            print("\nOpciones:")
            print("1. Escribir mensaje nuevo")
            print("2. Responder mensaje existente")
            print("0. Salir del foro")
            opcion = input("Seleccione una opción: ")

            if opcion == "0":
                break
            elif opcion == "1":
                texto = input("Escriba su mensaje: ")
                cursor.execute("SELECT MAX(id_mensaje) FROM Mensaje")
                nuevo_id = (cursor.fetchone()[0] or 1000) + 1
                insert = """INSERT INTO Mensaje
                            (id_mensaje, id_nodo, Id_foro, Nombre, Descripcion, id_mensaje_replica)
                            VALUES (%s, %s, %s, %s, %s, NULL)
                        """
                cursor.execute(insert, (nuevo_id, usuario['id_nodo'], foro_id, usuario['Nombre_completo'], texto))
                conn.commit()
            elif opcion == "2":
                id_mensaje = int(input("ID del mensaje a responder: "))
                texto = input("Escriba su respuesta: ")
                cursor.execute("SELECT MAX(id_mensaje) FROM Mensaje")
                nuevo_id = (cursor.fetchone()[0] or 1000) + 1
                insert = """INSERT INTO Mensaje
                            (id_mensaje, id_nodo, Id_foro, Nombre, Descripcion, id_mensaje_replica)
                            VALUES (%s, %s, %s, %s, %s, %s)
                        """
                cursor.execute(insert, (nuevo_id, usuario['id_nodo'], foro_id, usuario['Nombre_completo'], texto, id_mensaje))
                conn.commit()

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Error al acceder al foro: {e}")


if __name__ == "__main__":
    while True:
        usuario = None
        while not usuario:
            usuario = login()
        resultado = menu_principal(usuario)
        if resultado is None:
            continue
        else:
            break
