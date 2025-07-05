// frontend/src/view/RegistroOrganizacion.js
import React, { useState, useEffect,useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import '../../../styles/stylesNuevoExperto.css';
import '../../../styles/styles.css';
import axios from "axios";

const NuevoExperto = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const hasFetched = useRef(false);

    // Obtener datos del proyecto del URL
    const { projcod,orgcod } = useParams();
    const { proid } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const [code, setCodigoExperto] = useState("");
    const [version, setVersionExperto] = useState("00.01");
    const [creationDate, setFechaCreacion] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
    );
    const [modificationDate, setFechaModificacion] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
    );
    
    // Datos controlados por el usuario
    const [paternalSurname, setApellidoPaterno] = useState("");
    const [maternalSurname, setApellidoMaterno] = useState("");
    const [firstName, setNombres] = useState("");
    const [experience, setExperiencia] = useState("");
    const [status, setEstado] = useState("");
    const [comment, setComentario] = useState("");
    const [externalOrganization, setExternalOrganization] = useState("");
    //Estados para manejar errores
    const [error, setError]=useState(null);
    const [errorName, setErrorName] = useState("");
    const [errorApellidoPaterno, setErrorApellidoPaterno] = useState("");
    const [errorApellidoMaterno, setErrorApellidoMaterno] = useState("");
    const [errorExperiencia, setErrorExperiencia] = useState("");
    const [errorExternalOrg, setErrorExternalOrg] = useState("");
    const [errorComment, setErrorComment] = useState("");


    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    // Obtener el siguiente código de experto
    useEffect(() => {
        if (hasFetched.current) return; // Previene segunda ejecución
        hasFetched.current = true;
        const fetchNextCodigoExperto = async () => {
            try {
                
                // Llamar al endpoint usando parámetros de consulta
                const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/experts/next-code`);

                // Asignar el valor recibido al estado
                setCodigoExperto(response.data.nextCode || "EXP-001");
            } catch (err) {
                console.error("Error al obtener el siguiente código de experto:", err);
                setError("No se pudo cargar el siguiente código del experto.");
            }
        };

        fetchNextCodigoExperto();
    }, [API_BASE_URL,orgcod, projcod]);

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

    const registrarExperto = async (e) => {
        e.preventDefault();

        if (!paternalSurname) {
            setErrorApellidoPaterno("Este campo es obligatorio.");
            return;
        }
        if (!maternalSurname) {
            setErrorApellidoMaterno("Este campo es obligatorio.");
            return;
        }
        if (!firstName) {
            setErrorName("Este campo es obligatorio.");
            return;
        }
        if (!experience) {
            setErrorExperiencia("Este campo es obligatorio.");
            return;
        }
        



        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/experts`, {
                externalOrganization,
                maternalSurname,
                paternalSurname,
                firstName,
                experience,
                comment, // Asumiendo que 'comentario' es un campo adicional
                status, // Asumiendo que 'estado' es otro campo
            });
            
            // Redirigir a la página de expertos o realizar otra acción
            irAExpertos();
    
        } catch (err) {
            console.error("Error al registrar el experto:", err);
            setError("No se pudo registrar al experto. Inténtalo de nuevo.");
        }
    };
    

    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };
    const irAExpertos = () => {
    navigate(`/organizations/${orgcod}/projects/${projcod}/experts`,{
        state: {
            proid:proid
        }
    });
    };
    
    const irAPlantillas = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/plantillas`,{
        state: {
            proid:proid
        }
    });
    };

    const irAMenuProyecto = (code) => {
    navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`,{
        state: {
            proid:proid
        }
    });
    };

    // Función para registrar la organización
    

    return (
        <div className="ro-container">
            <header className="ro-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                <span onClick={irAPlantillas}>Plantillas /</span>
                <span onClick={irAExpertos}>Expertos /</span>
                <span>Nuevo Experto</span>
                </div>
            </header>

            <div className="rosub-container">
                <aside className="sidebar">
                    <div className="bar-ro">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>
                    <div className="profile-section">
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={() => navigate("/")} className="logout-button">Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="ro-content">
                    <h2>NUEVO EXPERTO</h2>
                    <section className="ro-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código </label>
                            <label className="ne-label">Version</label>
                            <label className="ne-label">Fecha</label>
                        </h3>
                        <div className="ne-input-container">
                            <input disabled type="text" className="ne-input" value={code} readOnly />
                            <input disabled type="text" className="ne-input" value={version} readOnly />
                            <input disabled type="text" className="ne-input" value={creationDate} readOnly />
                        </div>

                        <section className="ro-organizations-section">
                        {/* Formulario editable */}
                        <h3>Información Personal</h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Apellido Parterno*</h4>
                                <span class="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Apellido Paterno"
                                    value={paternalSurname}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 20) {
                                        setApellidoPaterno(value);
                                        setErrorApellidoPaterno(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorApellidoPaterno("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!paternalSurname.trim()) {
                                        setErrorApellidoPaterno("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={20}
                                    size="40"
                                    />
                                    {errorApellidoPaterno && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorApellidoPaterno}</p>)}
                                    <span class="tooltip-text">Ingresar el apellido parterno del experto</span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Apellido Materno*</h4>
                                <span class="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Apellido Materno"
                                    value={maternalSurname}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 20) {
                                        setApellidoMaterno(value);
                                        setErrorApellidoMaterno(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorApellidoMaterno("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!maternalSurname.trim()) {
                                        setErrorApellidoMaterno("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={20}
                                    size="40"
                                    />
                                    {errorApellidoMaterno && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorApellidoMaterno}</p>)}
                                    <span class="tooltip-text">Ingresar el apellido materno del experto </span>
                                </span>
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Nombres*</h4>
                                <span class="message">
                                <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Nombres"
                                    value={firstName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 30) {
                                        setNombres(value);
                                        setErrorName(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorName("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!firstName.trim()) {
                                        setErrorName("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={30}
                                    size="40"
                                    />
                                    {errorName && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorName}</p>)}
                                    <span class="tooltip-text">Ingresar el nombre del experto </span>
                                </span>
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Experiencia* </h4>
                                <span class="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Experiencia"
                                    value={experience}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 50) {
                                        setExperiencia(value);
                                        setErrorExperiencia(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorExperiencia("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!experience.trim()) {
                                        setErrorExperiencia("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={50}
                                    size="60"
                                    />
                                    {errorExperiencia && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorExperiencia}</p>)}
                                    <span class="tooltip-text"> Ingresar la experiencia que tiene el experto </span>
                                </span>
                                
                            </div>
                           
                        </div>

                        
                    </section>
                       
                    </section>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo">Organizacion </label>
                            <label className="ro-version">Autor de plantilla </label>
                            <label className="ro-Fecha">Estado* </label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <span class="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Nombre de organizacion"
                                    value={externalOrganization}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 50) {
                                        setExternalOrganization(value);
                                        setErrorExternalOrg(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorExternalOrg("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    maxLength={50}
                                    size="40"
                                    />
                                    {errorExternalOrg && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorExternalOrg}</p>)}
                                    <span class="tooltip-text"> Organizacion a la que pertenece </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <span class="message">
                                    <input type="text" className="inputBloq-field" value="AUT-000"  readOnly size="45" />
                                    <span class="tooltip-text"> Codigo del autor de la plantilla </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-fecha">
                                    <select 
                                            id="estado" 
                                            name="estado" 
                                            value={status}
                                            onChange={(e) => setEstado(e.target.value)}
                                            required
                                            
                                        >
                                    <option value="">Seleccione un estado</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                    <option value="Pendiente">Pendiente</option>
                                </select>
                            </div>
                        </div>
                    </section>
                    <section className="ro-organizations-section">
                        <h3>Comentario*</h3>
                        <div className="input-text">
                            <textarea
                                className="input-fieldtext"
                                rows="3"
                                value={comment}
                                placeholder="Añadir comentarios"
                                maxLength={300}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,;:()¿?!¡"'\-]*$/;

                                    // Validar: solo permitir si cumple el patrón
                                    if (permitido.test(value)) {
                                    setComentario(value);
                                    setErrorComment("");
                                    } else {
                                    setErrorComment("No se permiten caracteres especialeS.");
                                    }
                                }}
                                ></textarea>

                                {errorComment && <p style={{ color: 'red', margin: 0 }}>{errorComment}</p>}
                        </div>

                        <div className="ro-buttons">
                            <button onClick={irAExpertos} className="ro-button">Cancelar</button>
                            <button onClick={registrarExperto} className="ro-button">Crear Experto</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevoExperto;
