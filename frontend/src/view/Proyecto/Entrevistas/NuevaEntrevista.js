import React, { useEffect, useState } from "react"; 
import axios from "axios"; 
import { useNavigate, useParams, useLocation } from "react-router-dom";
import '../../../styles/stylesNuevaEntrevista.css';
import '../../../styles/styles.css';

const NuevaEntrevista = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {orgcod, projcod } = useParams();
    const { proid } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const [version, setVersion] = useState("01.00");
    const [interviewName, setInterviewName] = useState("");
    const [interviewDate, setInterviewDate] = useState("")
    const [intervieweeName, setIntervieweeName] = useState("");
    const [intervieweeRole, setIntervieweeRol] = useState("");
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [observations, setObservations] = useState("");
    const [authorId, setAuthorId] = useState("1b433257-cbad-4676-9c49-c097e85401fe");
    
    const [agendaItems, setAgendaItems] = useState([""]);
    const [conclusions, setConclusions] = useState([""]);
    
    const [status, setStatus] = useState("");
    const [error, setError]=useState(null);
    const [errorInterviewName, setErrorInterviewName]=useState("");
    const [errorIntervieweeName, setErrorIntervieweeName]=useState("");
    const [errorInterviewRole, setErrorIntervieweeRole]=useState("");
    const [errorInterviewDate, setErrorInterviewDate]=useState("");
    const [errorStartTime, setErrorStartTime]=useState("");
    const [errorEndTime, setErrorEndTime]=useState("");
    const [agendaErrors, setAgendaErrors] = useState([]);
    const [conclusionErrors, setConclusionErrors] = useState([]);
    const [errorObservations, setErrorObservations]=useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    const registrarEntrevista = async (e) => {
        e.preventDefault();
        if (!interviewName) {
            setErrorInterviewName("El nombre de la entrevista es obligatoria.");
            return;
        }
        if (!intervieweeName) {
            setErrorIntervieweeName("El nombre del entrevistado es obligatorio.");
            return;
        }
        if (!intervieweeRole) {
            setErrorIntervieweeRole("El rol del entrevistado es obligatorio.");
            return;
        }
        if (!interviewDate) {
            setErrorInterviewDate("La fecha de la entrevista es obligatoria.");
            return;
        }

        if (!startTime) {
            setErrorStartTime("La hora de inicio es obligatoria.");
            return;
        }

        if (!endTime) {
            setErrorEndTime("La hora final es obligatoria.");
            return;
        }

        if (startTime && endTime && endTime <= startTime) {
            setErrorEndTime("La hora final debe ser posterior a la hora de inicio.");
            return;
        }
        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/interviews`, {
                version,
                interviewName,
                interviewDate,
                intervieweeName,
                intervieweeRole,
                startTime,
                endTime,
                observations,
                authorId,
                agendaItems: agendaItems.map(item => ({ description: item })),
                conclusions: conclusions.map(item => ({ description: item }))
            });
            
            // Redirigir a la página de expertos o realizar otra acción
            irAEntrevistas();
    
        } catch (err) {
            console.error("Error al registrar el experto:", err);
            setError("No se pudo registrar al experto. Inténtalo de nuevo.");
        }
    };

    const handleAgendaChange = (index, value) => {
    const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,\-()¿?!¡"']*$/;

    // Solo aceptar si es válido Y tiene 200 caracteres o menos
    if (permitido.test(value) && value.length <= 200) {
        const nuevosItems = [...agendaItems];
        nuevosItems[index] = value;
        setAgendaItems(nuevosItems);

        const nuevosErrores = [...agendaErrors];
        nuevosErrores[index] = "";
        setAgendaErrors(nuevosErrores);
    } else {
        // Mostrar error si se intentó ingresar algo no permitido o excede tamaño
        const nuevosErrores = [...agendaErrors];
        nuevosErrores[index] = value.length > 200
        ? "Máximo 200 caracteres."
        : "Caracteres no permitidos.";
        setAgendaErrors(nuevosErrores);
    }
    };

  const handleConclusionChange = (index, value) => {
    const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,\-()¿?!¡"']*$/;

    if (permitido.test(value) && value.length <= 200) {
        const nuevasConclusiones = [...conclusions];
        nuevasConclusiones[index] = value;
        setConclusions(nuevasConclusiones);

        const nuevosErrores = [...conclusionErrors];
        nuevosErrores[index] = "";
        setConclusionErrors(nuevosErrores);
    } else {
        const nuevosErrores = [...conclusionErrors];
        nuevosErrores[index] = value.length > 200
        ? "Máximo 200 caracteres."
        : "Caracteres no permitidos.";
        setConclusionErrors(nuevosErrores);
    }
};

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

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, ""]);
  };

  const addConclusion = () => {
    setConclusions([...conclusions, ""]);
  };
    

    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAEntrevistas = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/entrevistas`,{
        state: {
            proid:proid
        }
    });
    };
    const irALogin = () => {
        navigate("/");
    };
    const irAMenuProyecto = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`,{
        state: {
            proid:proid
        }
    });
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };


    return (
        <div className="rp-container">
            <header className="rp-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                    <span onClick={irAEntrevistas}>Entrevistas /</span>
                    <span>Nueva entrevista</span>
                </div>
            </header>

            <div className="rpsub-container">

                <aside className="sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="bar-rp">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin}className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="rp-content">
                    <h2>NUEVA ENTREVISTA</h2>
                    <section className="rp-organization-section">
                        <h3>Formato de Entrevista</h3>
                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Versión</h4>
                            </div>
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field" value={version} readOnly size="100" />
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre de la entrevista *</h4>
                            </div>
                            <div className="fiel-vers">
                                <span class="message">
                                   <input
                                    type="text"
                                    className="inputnombre-field"
                                    value={interviewName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 100) {
                                        setInterviewName(value);
                                        setErrorInterviewName(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorInterviewName("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!interviewName.trim()) {
                                        setErrorInterviewName("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={100}
                                    size="100"
                                    />
                                    {errorInterviewName && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorInterviewName}</p>)}
                                    <span class="tooltip-text">Nombre de la entrevista</span>
                                </span>
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Código del autor</h4>
                            </div>
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field" value="AUT-0000" readOnly size="100" />
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre del autor</h4>
                            </div>
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field" value="Administrador" readOnly size="100" />
                            </div>
                        </div>
                    </section>

                    <section className="rp-organization-section">
                        <h3>Información básica</h3>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre del entrevistado *</h4>
                            </div>
                            <div className="fiel-vers">
                                <span class="message">
                                <input
                                        type="text"
                                        className="inputnombre-field"
                                        value={intervieweeName}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s']*$/;

                                            if (permitido.test(value) && value.length <= 60) {
                                            setIntervieweeName(value);
                                            setErrorIntervieweeName(""); // válido, limpia errores
                                            } else {
                                            setErrorIntervieweeName("Solo se permiten letras y apóstrofes.");
                                            // No actualiza el input → no se muestra el carácter inválido
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!intervieweeName.trim()) {
                                            setErrorIntervieweeName("El nombre es obligatorio.");
                                            }
                                        }}
                                        maxLength={60}
                                        size="100"
                                        />
                                        {errorIntervieweeName && (
                                        <p style={{ color: 'red', margin: 0 }}>{errorIntervieweeName}</p>
                                        )}
                                    <span class="tooltip-text">Nombre del cliente o persona a la que se entrevistará</span>
                                </span>
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Cargo que ostenta *</h4>
                            </div>
                            <div className="fiel-vers">
                                <span class="message">
                                    <input
                                        type="text"
                                        className="inputnombre-field"
                                        value={intervieweeRole}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s']*$/;

                                            if (permitido.test(value) && value.length <= 30) {
                                            setIntervieweeRol(value);
                                            setErrorIntervieweeRole(""); // válido, limpia errores
                                            } else {
                                            setErrorIntervieweeRole("Solo se permiten letras.");
                                            // No actualiza el input → no se muestra el carácter inválido
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!intervieweeRole.trim()) {
                                            setErrorIntervieweeRole("El nombre es obligatorio.");
                                            }
                                        }}
                                        maxLength={30}
                                        size="100"
                                        />
                                        {errorInterviewRole && (
                                        <p style={{ color: 'red', margin: 0 }}>{errorInterviewRole}</p>
                                        )}
                                    <span class="tooltip-text">Cargo que tiene en el proyecto la persona entrevistada. Ej. Cliente, Líder del proyecto, etc.</span>
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="rp-organization-section">
                        <h3>Información del tiempo</h3>
                        <div className="rp-cod-vers">
                            <div className="fiel-cod-e">
                                <h4>Fecha *</h4>
                                    <span className="message">
                                    <input
                                        className="input-text"
                                        type="date"
                                        value={interviewDate}
                                        onChange={(e) => {
                                        setInterviewDate(e.target.value);
                                        setErrorInterviewDate(""); // limpiar error al escribir
                                        }}
                                        onBlur={() => {
                                        if (!interviewDate) {
                                            setErrorInterviewDate("La fecha de la entrevista es obligatoria.");
                                        }
                                        }}
                                        size="50"
                                    />
                                    <span className="tooltip-text">Fecha en la que se llevará a cabo la entrevista</span>
                                    </span>

                                    {errorInterviewDate && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorInterviewDate}</p>
                                    )}
                            </div>
                            <div className="rp-cod-vers">
                                <div className="fiel-cod-e">
                                    <h4>Hora de inicio *</h4>
                                    <span class="message">
                                        <span className="message">
                                        <input
                                            className="input-text"
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => {
                                            setStartTime(e.target.value);
                                            setErrorStartTime(""); // limpia el error si se selecciona una hora
                                            }}
                                            onBlur={() => {
                                            if (!startTime) {
                                                setErrorStartTime("La hora de inicio es obligatoria.");
                                            }
                                            }}
                                            size="50"
                                        />
                                        <span className="tooltip-text">Hora de inicio de la entrevista</span>
                                        </span>

                                        {errorStartTime && (
                                        <p style={{ color: 'red', margin: 0 }}>{errorStartTime}</p>
                                        )}
                                        <span class="tooltip-text">Hora de inicio de la entrevista</span>
                                    </span>
                                </div>
                            </div>
                            <div className="rp-cod-vers">
                                <div className="fiel-cod-e">
                                    <h4>Hora de fin *</h4>
                                    <span class="message">
                                        
                                        <span className="message">
                                        <input
                                            className="input-text"
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => {
                                            setEndTime(e.target.value);
                                            setErrorEndTime(""); // Limpia errores al modificar

                                            // Validar que endTime sea mayor a startTime
                                            if (startTime && e.target.value && e.target.value <= startTime) {
                                                setErrorEndTime("La hora final debe ser posterior a la hora de inicio.");
                                            }
                                            }}
                                            onBlur={() => {
                                            if (!endTime) {
                                                setErrorEndTime("La hora final es obligatoria.");
                                            } else if (startTime && endTime <= startTime) {
                                                setErrorEndTime("La hora final debe ser posterior a la hora de inicio.");
                                            }
                                            }}
                                            size="50"
                                        />
                                        <span className="tooltip-text">Hora de finalización de la entrevista</span>
                                        </span>

                                        {errorEndTime && (
                                        <p style={{ color: 'red', margin: 0 }}>{errorEndTime}</p>
)}
                                        <span class="tooltip-text">Hora de fin de la entrevista</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                    </section>

                    <section className="rp-organization-section">
                        <h3>Agenda</h3>
                        {agendaItems.map((item, index) => (
                            <div className="rp-cod-vers2" key={`agenda-${index}`}>
                            <div className="fiel-vers2">
                                <input
                                disabled
                                type="text"
                                className="input-numero-agenda"
                                value={index + 1}
                                readOnly
                                />
                            </div>
                            <div className="fiel-vers2">
                                <span className="message">
                                <input
                                    className="input-text"
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleAgendaChange(index, e.target.value)}
                                    placeholder="Ingrese punto de agenda"
                                    maxLength={200}
                                    size="200"
                                    />
                                    {agendaErrors[index] && (
                                    <p style={{ color: 'red', margin: 0 }}>{agendaErrors[index]}</p>
                                    )}
                                <span className="tooltip-text">
                                    Agregar agenda o puntos a tratar durante la reunión
                                </span>
                                </span>
                            </div>
                            </div>
                        ))}

                        <button type="button" className="rp-button" onClick={addAgendaItem}>
                            + Agregar ítem de agenda
                        </button>
                        </section>

                    <section className="rp-organization-section">
                        <h3>Conclusiones</h3>
                        {conclusions.map((item, index) => (
                            <div className="rp-cod-vers2" key={`conclusion-${index}`}>
                                <div className="fiel-vers2">
                                <input
                                    disabled
                                    type="text"
                                    className="input-numero-agenda"
                                    value={index + 1}
                                    readOnly
                                    size="50"
                                />
                                </div>
                                <div className="fiel-vers2">
                                <span className="message">
                                    <input
                                    className="input-text"
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleConclusionChange(index, e.target.value)}
                                    placeholder="Ingrese conclusión"
                                    maxLength={200}
                                    size="200"
                                    />
                                    {conclusionErrors[index] && (
                                    <p style={{ color: 'red', margin: 0 }}>{conclusionErrors[index]}</p>
                                    )}
                                    <span className="tooltip-text">
                                    Agregar conclusiones llegadas en la reunión
                                    </span>
                                </span>
                                </div>
                            </div>
                            ))}
                        <button type="button" className="rp-button" onClick={addConclusion}>
                        + Agregar conclusión
                        </button>
                    </section>

                    <section className="rp-organizations-section">
                        <h3>Observaciones</h3>

                        <div className="input-text">
                            <textarea
                                className="input-fieldtext"
                                rows="3"
                                value={observations}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,\-()¿?!¡"']*$/;

                                    // Solo acepta si es permitido y máximo 300
                                    if (permitido.test(value) && value.length <= 300) {
                                    setObservations(value);
                                    setErrorObservations(""); // limpia error
                                    } else if (!permitido.test(value)) {
                                    setErrorObservations("Caracteres no permitidos.");
                                    } else if (value.length > 300) {
                                    setErrorObservations("Máximo 300 caracteres.");
                                    }
                                }}
                                maxLength={300}
                                placeholder="Añadir observaciones encontradas"
                                />

                                {errorObservations && (
                                <p style={{ color: 'red', margin: 0 }}>{errorObservations}</p>
                                )}

                                <p style={{ fontSize: '0.8rem', textAlign: 'right' }}>
                                {observations.length}/300
                                </p>
                        </div>

                        <div className="rp-buttons">
                            <button onClick={irAEntrevistas} className="rp-button" size="50">Cancelar</button>
                            <button onClick={registrarEntrevista} className="rp-button" size="50">Crear</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevaEntrevista;
