import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../../styles/stylesNuevoAutor.css';
import '../../../styles/styles.css';
import axios from "axios";

const NuevoAutor = () => {

    const navigate = useNavigate();
    const hasFetched = useRef(false);
    const { orgcod, projcod } = useParams();
    // Datos controlados por el usuario

    const [paternalSurname, setApellidoPaterno] = useState("");
    const [maternalSurname, setApellidoMaterno] = useState("");
    const [firstName, setNombre] = useState("");
    const [alias, setAlias] = useState("");
    //const [role, setRol] = useState("");
    const [password, setPassword] = useState('');
    const [phone, setTelefono] = useState("");
    const [dni, setDni] = useState("");
    const [status, setEstado] = useState("");
    const [comments, setComentario] = useState("");
    //const [permisoPantilla, setPermisoPantilla] = useState([]);

    // Datos automáticos
    const [codigo, setCodigo] = useState("");//Generacion Automatizada
    const [version, setVersion] = useState("0.01");
    const [creationDate, setFechaCreacion] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
    );
    const [codigoOrganizacion, setcodigoOrganizacion] = useState("ORG-001"); //Cambiar a Generacion Automatizada
    const [autorPantilla, setAutorPantilla] = useState("AUT-000");//Cambiar a Generacion Automatizada
    
    //Errores
    const [error, setError] = useState(null);
    const [errorApellidoPaterno, setErrorApellidoPaterno] = useState("");
    const [errorApellidoMaterno, setErrorApellidoMaterno] = useState("");
    const [errorNombres, setErrorNombres] = useState("");
    const [errorAlias, setErrorAlias] = useState("");
    const [errorTelefono, setErrorTelefono] = useState("");
    const [errorDni, setErrorDni] = useState("");
    const [errorComentarios, setErrorComentarios] = useState("");
    const [errorPassword, setErrorPassword] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    //Siguente codigo de autor
    useEffect(() => {
        if (hasFetched.current) return; // Previene segunda ejecución
        hasFetched.current = true;
        console.log("Ejecutando useEffect...");
        const fetchNextCodigoAutor = async () => {
            try {

                // Llamar al endpoint usando parámetros de consulta
                const response = await axios.get(`${API_BASE_URL}/authors/next-code`);
                console.log("Respuesta del backend:", response.data);
                // Asignar el valor recibido al estado
                setCodigo(response.data.nextCode || "AUT-001");
            } catch (err) {
                console.error("Error al obtener el siguiente código de actor:", err);
                setError("No se pudo cargar el siguiente código del actor.");
            }
        };

        fetchNextCodigoAutor();
    }, []);
    //Roles
    const [roleId, setRoleId] = useState("");
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    useEffect(() => {
        const fetchRoles = async () => {
            const res = await axios.get(`${API_BASE_URL}/roles`);
            setRoles(res.data.data || []); // Asegúrate de ajustar según cómo devuelves los datos
        };

        fetchRoles();
    }, []);

    // Función para registrar el autor
    const registrarAutor = async (e) => {
        e.preventDefault(); // Validar apellido paterno
        if (!paternalSurname.trim()) {
            setErrorApellidoPaterno("El apellido paterno del autor es obligatorio.");
            return;
        }
        if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s']{1,15}$/.test(paternalSurname)) {
            setErrorApellidoPaterno("Solo se permiten letras, hasta 15 caracteres.");
            return;
        }

        // Validar apellido materno
        if (!maternalSurname.trim()) {
            setErrorApellidoMaterno("El apellido materno del autor es obligatorio.");
            return;
        }
        if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s']{1,15}$/.test(maternalSurname)) {
            setErrorApellidoMaterno("Solo se permiten letras, hasta 15 caracteres.");
            return;
        }

        // Validar nombres
        if (!firstName.trim()) {
            setErrorNombres("El nombre del autor es obligatorio.");
            return;
        }
        if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s']{1,25}$/.test(firstName)) {
            setErrorNombres("Solo se permiten letras, hasta 25 caracteres.");
            return;
        }

        // Validar alias
        if (alias &&!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s']{1,15}$/.test(alias)) {
            setErrorAlias("Solo se permiten letras, hasta 15 caracteres.");
            return;
        }

        // Validar contraseña
        if (password && password.length > 0 && password.length < 6) {
        setErrorPassword("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

        // Validar teléfono
        if (phone&&!/^9\d{8}$/.test(phone)) {
            setErrorTelefono("El teléfono debe tener 9 dígitos.");
            return;
        }

        // Validar DNI
        if (dni &&!/^\d{8}$/.test(dni)) {
            setErrorDni("El DNI debe tener exactamente 8 dígitos.");
            return;
        }

        // Validar rol
        if (!roleId) {
            setError("Debe seleccionar un rol.");
            return;
        }

        // Validar comentarios (opcional)
        if (comments && !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,\-()¿?!¡"']*$/.test(comments)) {
            setErrorComentarios("Los comentarios contienen caracteres no permitidos.");
            return;
        }
        if (comments.length > 300) {
            setErrorComentarios("Máximo 300 caracteres en comentarios.");
            return;
        }
        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/authors`, {
                firstName,
                paternalSurname,
                maternalSurname,
                version,
                status,
                alias,
                password,
                phone,
                dni,
                comments,
                role: {
                    connect: {
                        id: roleId
                    }
                }
            });

            // Redirigir a la página de expertos o realizar otra acción
            irAAutores();

        } catch (err) {
            console.error("Error al registrar el experto:", err);
            setError("No se pudo registrar al experto. Inténtalo de nuevo.");
        }
    };

    // Manejar los cambios en los checkboxes de permisos
    /*const handlePermissionChange = (e, templateName, permissionType) => {
        const { checked } = e.target;
        setFormData((prevData) => {
            const updatedPermissions = prevData.permissions.filter(
                (perm) => perm.templateName !== templateName
            );

            if (checked) {
                updatedPermissions.push({
                    templateName,
                    [permissionType]: true,
                });
            }

            return { ...prevData, permissions: updatedPermissions };
        });
    };*/

    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };

    const irAAutores = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/authors`);
    };

    const irALogin = () => {
        navigate("/");
    };

    const irAMenuProyecto = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`);
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };


    return (
        <div className="ro-container">
            <header className="ro-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span onClick={irAAutores}>Autores /</span>
                    <span>Nuevo autor</span>
                </div>
            </header>

            <div className="rosub-container">

                <aside className="sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="bar-ro">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin} className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="ro-content">
                    <h2>NUEVO AUTOR</h2>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo" >Código </label>
                            <label className="ro-version">Version</label>
                            <label className="ro-Fecha">Fecha</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input disabled type="text" className="inputBloq-field" value={codigo} readOnly size="45" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input disabled type="text" className="inputBloq-field" value={version} readOnly size="45" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input disabled type="text" className="inputBloq-field" value={creationDate} readOnly size="45" />
                            </div>
                        </div>
                    </section>

                    <section className="ro-organization-section">
                        <h3>Información Personal</h3>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Apellido Paterno</h4>
                                <span class="message">
                                    <input
                                        className="inputnombre-field"
                                        type="text"
                                        value={paternalSurname}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            // Solo permitir letras, espacios y apóstrofe mientras se escribe
                                            if (value.length <= 15) {
                                            setApellidoPaterno(value);

                                            // Validar mientras escribe
                                            if (/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s']*$/.test(value)) {
                                                setErrorApellidoPaterno(""); // válido
                                            } else {
                                                setErrorApellidoPaterno("Solo se permiten letras.");
                                            }
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!paternalSurname.trim()) {
                                            setErrorApellidoPaterno("El apellido paterno del autor es obligatorio.");
                                            }
                                        }}
                                        maxLength={15}
                                        size="30"
                                        />

                                        {errorApellidoPaterno && (
                                        <p style={{ color: "red", margin: 0 }}>{errorApellidoPaterno}</p>
                                        )}
                                    <span class="tooltip-text">Apellido paterno del autor</span>
                                </span>
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Apellido Materno</h4>
                                <span class="message">
                                    <input
                                        className="inputnombre-field"
                                        type="text"
                                        value={maternalSurname}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            // Solo permitir letras, espacios y apóstrofe mientras se escribe
                                            if (value.length <= 15) {
                                            setApellidoMaterno(value);

                                            // Validar mientras escribe
                                            if (/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s']*$/.test(value)) {
                                                setErrorApellidoMaterno(""); // válido
                                            } else {
                                                setErrorApellidoMaterno("Solo se permiten letras.");
                                            }
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!maternalSurname.trim()) {
                                            setErrorApellidoMaterno("El apellido materno del autor es obligatorio.");
                                            }
                                        }}
                                        maxLength={15}
                                        size="30"
                                        />

                                        {errorApellidoMaterno && (
                                        <p style={{ color: "red", margin: 0 }}>{errorApellidoMaterno}</p>
                                        )}
                                    <span class="tooltip-text">Apellido materno del autor</span>
                                </span>
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Nombres</h4>
                                <span class="message">
                                    <input
                                        className="inputnombre-field"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            // Solo permitir letras, espacios y apóstrofe mientras se escribe
                                            if (value.length <= 25) {
                                            setNombre(value);

                                            // Validar mientras escribe
                                            if (/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s']*$/.test(value)) {
                                                setErrorNombres(""); // válido
                                            } else {
                                                setErrorNombres("Solo se permiten letras.");
                                            }
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!firstName.trim()) {
                                            setErrorNombres("El nombre del autor es obligatorio.");
                                            }
                                        }}
                                        maxLength={25}
                                        size="30"
                                        />

                                        {errorNombres && (
                                        <p style={{ color: "red", margin: 0 }}>{errorNombres}</p>
                                        )}
                                    <span class="tooltip-text">Nombres del autor</span>
                                </span>
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Alias</h4>
                                <span class="message">
                                    <input
                                        className="inputnombre-field"
                                        type="text"
                                        value={alias}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            // Solo permitir letras, espacios y apóstrofe mientras se escribe
                                            if (value.length <= 15) {
                                            setAlias(value);

                                            // Validar mientras escribe
                                            if (/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s']*$/.test(value)) {
                                                setErrorAlias(""); // válido
                                            } else {
                                                setErrorAlias("Solo se permiten letras.");
                                            }
                                            }
                                        }}
                                        maxLength={15}
                                        size="30"
                                        />

                                        {errorAlias && (
                                        <p style={{ color: "red", margin: 0 }}>{errorAlias}</p>
                                        )}
                                    <span class="tooltip-text">Alias del autor</span>
                                </span>
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Rol</h4>
                                <span class="message">
                                    <select id="rol" name="rol" value={roleId} onChange={(e) => {
                                        const selectedId = e.target.value;
                                        setRoleId(selectedId);

                                        const fullRole = roles.find((r) => r.id === selectedId);
                                        setSelectedRole(fullRole); // Aquí sí: guardas el objeto seleccionado
                                    }} required>
                                        <option value="">Seleccione un rol</option>
                                        {roles.map((r) => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}</select>
                                    <span class="tooltip-text">Rol del autor en el proyecto</span>
                                </span>
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Contraseña</h4>
                                <span class="message">
                                    <input
                                    className="inputnombre-field"
                                    type="text"
                                    value={password}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setPassword(value);

                                        // Validación en vivo
                                        if (value.length >= 6) {
                                        setErrorPassword("");
                                        } else {
                                        setErrorPassword("Al menos 6 caracteres.");
                                        }
                                    }}
                                    onBlur={() => {
                                        // Solo mostrar error si el campo NO está vacío y tiene menos de 6
                                        if (password && password.length < 6) {
                                        setErrorPassword("Al menos 6 caracteres.");
                                        } else {
                                        setErrorPassword(""); // limpia si está vacío
                                        }
                                    }}
                                    maxLength={100}
                                    size="30"
                                    />
                                    {errorPassword && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorPassword}</p>
                                    )}
                                    <span class="tooltip-text">Contraseña del autor, este debe tener al menos 6 caracteres</span>
                                </span>
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Teléfono</h4>
                                <span class="message">
                                    <input
                                    className="inputnombre-field"
                                    type="text"
                                    value={phone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 9) {
                                            setTelefono(value);

                                            // Validación en vivo: si tiene 9 dígitos y empieza con 9, quitar error
                                            if (/^9\d{8}$/.test(value)) {
                                                setErrorTelefono("");
                                            } else if (value.length === 9) {
                                                setErrorTelefono("El número debe comenzar con 9.");
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                    if (phone && phone.length !== 9) {
                                        setErrorTelefono("Ingrese un teléfono válido");
                                    }
                                    }}
                                    size="30"
                                    />
                                    {errorTelefono && <p style={{ color: 'red', margin: 0 }}>{errorTelefono}</p>}
                                    <span class="tooltip-text">Teléfono del autor, este debe contener 9 dígitos</span>
                                </span>
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>DNI</h4>
                                <span class="message">
                                    <input
                                        className="inputnombre-field"
                                        type="text"
                                        value={dni}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, ''); // eliminar todo lo que no sea número
                                            if (value.length <= 8) {
                                            setDni(value);

                                            if (value.length === 8) {
                                                setErrorDni(""); // válido
                                            } else {
                                                setErrorDni("El DNI debe tener exactamente 8 dígitos.");
                                            }
                                            }
                                        }}
                                        onBlur={() => {
                                            if (dni && dni.length !== 8) {
                                            setErrorDni("El DNI debe tener exactamente 8 dígitos.");
                                            } else {
                                            setErrorDni(""); // válido
                                            }
                                        }}
                                        maxLength={8}
                                        size="30"
                                        />
                                        {errorDni && <p style={{ color: 'red', margin: 0 }}>{errorDni}</p>}
                                    <span class="tooltip-text">DNI del autor, este debe contener 8 dígitos</span>
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo" >Organización </label>
                            <label className="ro-version">Autor de plantilla</label>
                            <label className="ro-Fecha">Estado</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input disabled type="text" className="inputBloq-field" value={codigoOrganizacion} readOnly size="45" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input disabled type="text" className="inputBloq-field" value={autorPantilla} readOnly size="45" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <select id="estado" name="estado-input"
                                    value={status}
                                    onChange={(e) => setEstado(e.target.value)} required>
                                    <option value="">Seleccione un tipo</option>
                                    <option value="por empezar">Por empezar</option>
                                    <option value="en progreso">En progreso</option>
                                    <option value="finalizado">Finalizado</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="ro-organizations-section">
                        <h3>Comentario</h3>

                        <div className="input-text">
                            <textarea
                            className="input-fieldtext"
                            name="comments"
                            value={comments}
                            onChange={(e) => {
                                const value = e.target.value;
                                const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,\-()¿?!¡"']*$/;

                                if (value.length <= 300) {
                                // Validar que no use caracteres especiales
                                if (permitido.test(value)) {
                                    setComentario(value);
                                    setErrorComentarios(""); // limpia error si es válido
                                } else {
                                    setErrorComentarios("Solo se permiten letras, números y puntuación básica.");
                                }
                                }
                            }}
                            onBlur={() => {
                                if (comments && !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,\-()¿?!¡"']*$/.test(comments)) {
                                setErrorComentarios("Los comentarios contienen caracteres no permitidos.");
                                } else if (comments.length > 300) {
                                setErrorComentarios("Máximo 300 caracteres.");
                                } else {
                                setErrorComentarios("");
                                }
                            }}
                            placeholder="Comentarios del proyecto"
                            rows="3"
                            maxLength={300}
                            />
                            {errorComentarios && (
                            <p style={{ color: 'red', margin: 0 }}>{errorComentarios}</p>
                            )}
                            <p style={{ fontSize: '0.8rem', textAlign: 'right' }}>
                            {comments.length}/300
                            </p>
                        </div>
                    </section>

                    <section className="ro-organizations-section">
                        {/*
                        <h3>Permiso para ver y editar plantillas</h3>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Actores" readOnly size="60" />
                            </div>
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Trazabilidad" readOnly size="60" />
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Entrevista" readOnly size="60" />
                            </div>
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Req. no Funcionales" readOnly size="60" />
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Educción" readOnly size="60" />
                            </div>
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Expertos" readOnly size="60" />
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Ilación" readOnly size="60" />
                            </div>
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Fuentes" readOnly size="60" />
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Especificación" readOnly size="60" />
                            </div>
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Métricas" readOnly size="60" />
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Artefactos" readOnly size="60" />
                            </div>
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Pruebas de Software" readOnly size="60" />
                            </div>
                        </div>
                        */}
                        <div className="ro-buttons">
                            <button onClick={irAAutores} className="ro-button" size="60">Cancelar</button>
                            <button onClick={registrarAutor} className="ro-button" size="60">Crear Autor</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevoAutor;