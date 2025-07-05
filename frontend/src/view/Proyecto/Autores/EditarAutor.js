import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import '../../../styles/stylesNuevoAutor.css';
import '../../../styles/styles.css';
import axios from "axios";

const EditarAutor = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {orgcod, projcod,autid,autcod } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    // Datos controlados por el usuario
    const [paternalSurname, setApellidoPaternoAutor] = useState("");
    const [maternalSurname, setApellidoMaternoAutor] = useState("");
    const [firstName, setNombreAutor] = useState("");
    const [alias, setAliasAutor] = useState("");
    const [rol, setRolAutor] = useState("");
    const [roleId, setRoleId] = useState("");
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [password, setPasswordAutor] = useState("");
    const [phone, setTelefonoAutor] = useState("");
    const [dni, setDniAutor] = useState("");
    const [status, setEstado] = useState("");
    const [comments, setComentario] = useState("");

    //errores
    const [error, setError] = useState(null);
    const [errorApellidoPaterno, setErrorApellidoPaterno] = useState("");
    const [errorApellidoMaterno, setErrorApellidoMaterno] = useState("");
    const [errorNombres, setErrorNombres] = useState("");
    const [errorAlias, setErrorAlias] = useState("");
    const [errorTelefono, setErrorTelefono] = useState("");
    const [errorDni, setErrorDni] = useState("");
    const [errorComentarios, setErrorComentarios] = useState("");
    const [errorPassword, setErrorPassword] = useState("");    
    //const [permisoPantilla, setPermisoPantilla] = useState([]);

    // Datos automáticos
    const [codigo, setCodigoAutor] = useState("");
    const [version, setVersionAutor] = useState("");
    const [fechaCreacion, setFechaCreacionAutor] = useState(""); 
    const [codigoOrganizacion, setCodigoOrganizacion] = useState("");
    const [autorPantilla, setAutorPantilla] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    // Extraer Datos
    const fetchAuthorData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/authors/${autid}`);
            const data = response.data;
            const rawDate = new Date(data.creationDate);
            const formattedDate = `${rawDate.getDate()}/${rawDate.getMonth() + 1}/${rawDate.getFullYear()}`;
            setCodigoAutor(data.code);
            setFechaCreacionAutor(formattedDate);
            setComentario(data.comments);
            setVersionAutor(data.version);
            setNombreAutor(data.firstName);
            setApellidoPaternoAutor(data.paternalSurname);
            setApellidoMaternoAutor(data.maternalSurname);
            setAliasAutor(data.alias);
            setEstado(data.status);
            setDniAutor(data.dni);
            setTelefonoAutor(data.phone);
            //setRolAutor(data.role);
            setSelectedRole(data.roles);
            setRoleId(data.roleId);
            setPasswordAutor(data.password);
            setEstado(data.status);
            setAutorPantilla(data.templateAuthor?.name);
            setComentario(data.comments);
        } catch (err) {
            setError("Error al obtener los datos del autor: " + err.message);
        }
    };
    //Guardar Datos Editados
    const handleEdit = async (e) => {
        e.preventDefault();
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
        setErrorPassword("Al menos 6 caracteres.");
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
        
        try {
            const response = await axios.put(`${API_BASE_URL}/authors/${autid}`, {
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
    
            if (response.status === 200) {
                alert("Experto actualizado correctamente");
                irAAutores();
            }
        } catch (err) {
            setError("Error al actualizar el experto: " + err.message);
        }
    };
    useEffect(() => {
            fetchAuthorData();
    }, [autid]);

    //Función para obtener lista de roles
    useEffect(() => {
        const fetchRoles = async () => {
            const res = await axios.get(`${API_BASE_URL}/roles`);
            setRoles(res.data.data || []); // Asegúrate de ajustar según cómo devuelves los datos
        };

        fetchRoles();
    }, []);

    //Función para obtener datos de organizacion y proyecto
    useEffect(() => {
    const fetchDatos = async () => {
        try {
            const resOrg = await axios.get(`${API_BASE_URL}/organizations/${orgcod}`);
            setOrganizacion(resOrg.data);

            const resProyecto = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}`);
            setProyecto(resProyecto.data);
        } catch (error) {
            console.error("Error al obtener datos de organización o proyecto", error);
        }
        };
        fetchDatos();
    }, [orgcod, projcod, API_BASE_URL]);

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
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                    <span onClick={irAAutores}>Autores /</span>
                    <span>Editar autor</span>
                </div>
            </header>

            <div className="rosub-container">

                <aside className="sidebar">
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
                    <h2>EDITAR AUTOR</h2>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo" >Código </label>
                            <label className="ro-version">Version</label>
                            <label className="ro-Fecha">Fecha</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input 
                                disabled 
                                type="text" 
                                className="inputBloq-field" 
                                value={codigo} 
                                onChange={(e) => setCodigoAutor(e.target.value)} 
                                readOnly 
                                size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input 
                                disabled 
                                type="text" 
                                className="inputBloq-field" 
                                value={version}
                                onChange={(e) => setVersionAutor(e.target.value)}
                                readOnly 
                                size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input 
                                disabled 
                                type="text" 
                                className="inputBloq-field" 
                                value={fechaCreacion} 
                                onChange={(e) => setFechaCreacionAutor(e.target.value)}
                                readOnly 
                                size="30" />
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
                                            setApellidoPaternoAutor(value);

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
                                            setApellidoMaternoAutor(value);

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
                                            setNombreAutor(value);

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
                                            setAliasAutor(value);

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
                                    <select
                                    id="rol"
                                    name="estadrol"
                                    value={roleId}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        setRoleId(selectedId);

                                        // ✅ Limpiar el error al seleccionar un valor
                                        if (selectedId) {
                                        setError(""); // O setErrorRol("") si usas un estado específico
                                        }

                                        const fullRole = roles.find((r) => r.id === selectedId);
                                        setSelectedRole(fullRole);
                                    }}
                                    required
                                    >
                                    <option value="">Seleccione un rol</option>
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                    </select>
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
                                        setPasswordAutor(value);

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
                                            setTelefonoAutor(value);

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
                                            setDniAutor(value);

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
                                <input 
                                disabled 
                                type="text" 
                                className="inputBloq-field" 
                                value={orgcod}   
                                readOnly 
                                size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input 
                                disabled 
                                type="text" 
                                className="inputBloq-field" 
                                value={autorPantilla} 
                                onChange={(e) => setAutorPantilla(e.target.value)}  
                                readOnly 
                                size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <select 
                                    className="estado-input" 
                                    value={status} 
                                    onChange={(e) => setEstado(e.target.value)}
                                >
                                    <option value="">[Seleccionar]</option>
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
                            rows="3" 
                            value={comments} 
                            onChange={(e) => setComentario(e.target.value)} 
                            placeholder="Añadir comentarios sobre el proyecto"></textarea>
                        </div>
                    </section>

                     <section className="ro-organizations-section">
                        {/*<h3>Permiso para ver y editar plantillas</h3>

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
                        </div>*/}

                        <div className="ro-buttons">
                            <button onClick={irAAutores} className="ro-button" size="60">Cancelar</button>
                            <button onClick={handleEdit} className="ro-button" size="60">Guardar cambios</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </section> 
                </main>
            </div>
        </div>
    );
};

export default EditarAutor;