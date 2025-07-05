import React, { useState, useEffect,useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import '../../../styles/stylesNuevaEntrevista.css';
import '../../../styles/styles.css';
import axios from "axios";

const EditarEntrevista = () => {

    const navigate = useNavigate();
    const {orgcod, projcod } = useParams();
    const location = useLocation();
    const { proid,id } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});
    const [authors, setAuthors] = useState([]);

    const [version, setVersion] = useState("01.00");
    const [interviewName, setInterviewName] = useState("");
    const [interviewDate, setInterviewDate] = useState("")
    const [intervieweeName, setIntervieweeName] = useState("");
    const [intervieweeRole, setIntervieweeRole] = useState("");
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [observations, setObservations] = useState("");

    const [authorId, setAuthorId] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [selectedCode, setSelectedCode] = useState("");
    
    const [agendaItems, setAgendaItems] = useState([""]);
    const [conclusions, setConclusions] = useState([""]);
    
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

    //Traer autores para seleccionar 
    const fetchAuthors = useCallback(async () => {
        //Obtener o listar expertos de un proyecto
        try {
            //const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/authors`);
            const response = await axios.get(`${API_BASE_URL}/authors`);
            setAuthors(response.data.data || []);
        } catch (err) {
            setError(
                err.response
                    ? err.response.data.error
                    : "Error al obtener los autores"
            );
        }
    }, [API_BASE_URL]);

    useEffect(() => {
    const fetchData = async () => {
        await fetchAuthors(); // primero carga la lista
        await fetchEntrevistaData(); // luego carga la entrevista y asocia el autor
    };
    fetchData();
    }, [fetchAuthors]);

    const fetchEntrevistaData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/interviews/${id}`);
                const data = response.data;

                // Formatear fecha para campo de tipo "date" (yyyy-mm-dd)
                const interviewDate = data.interviewDate?.substring(0, 10);
                const startTime = data.startTime?.substring(11, 16); // hh:mm
                const endTime = data.endTime?.substring(11, 16);     // hh:mm

                setInterviewName(data.interviewName || "");
                setVersion(data.version || "01.00");
                setInterviewDate(interviewDate || "");
                setStartTime(startTime || "");
                setEndTime(endTime || "");
                setIntervieweeName(data.intervieweeName || "");
                setIntervieweeRole(data.intervieweeRole || "");
                setObservations(data.observations || "");
                setAuthorId(data.authorId || "");

                // Mapear descripciones de los ítems de agenda
                const mappedAgendaItems = data.agendaItems?.map(item => item.description) || [""];
                setAgendaItems(mappedAgendaItems);

                // Mapear descripciones de las conclusiones
                const mappedConclusions = data.conclusions?.map(item => item.description) || [""];
                setConclusions(mappedConclusions);

            } catch (err) {
                setError("Error al obtener los datos de la entrevista: " + err.message);
                console.error(err);
            }
    };


    useEffect(() => {
        if (authorId && authors.length > 0) {
            const selectedAuthor = authors.find((a) => a.id === authorId);
            if (selectedAuthor) {
                setSelectedCode(selectedAuthor.code);
                setAuthorName(selectedAuthor.firstName);
            }
        }
    }, [authorId, authors]);

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


    // Añadir nuevos ítems vacíos
    const addAgendaItem = () => {
    setAgendaItems([...agendaItems, ""]);
    };

    const addConclusion = () => {
    setConclusions([...conclusions, ""]);
    }; 
    
    const handleEdit = async (e) => {
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
            const response = await axios.put(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/interviews/${id}`, {
                authorId,
                interviewName,
                version,
                interviewDate,
                intervieweeName,
                intervieweeRole,
                startTime,
                endTime,
                observations,
                agendaItems: agendaItems.map(item => ({
                    description: item
                })),
                conclusions: conclusions.map(item => ({
                    description: item
                }))
            });

            if (response.status === 200) {
                alert("Entrevista actualizada correctamente");
                // Redirige o realiza otra acción
                irAEntrevistas();
            }
        } catch (err) {
            setError("Error al actualizar la entrevista: " + err.message);
        }
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
        navigate(`/projects/${projcod}/menuProyecto`);
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
                    <span>Editar entrevista</span>
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
                    <h2>EDITAR ENTREVISTA</h2>
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
                                <h4>Nombre de entrevista *</h4>
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
                                <h4>Código del autor*</h4>
                            </div>
                            <div className="fiel-vers">
                                <select
                                    className="inputBloq-field"
                                    value={selectedCode}
                                    style={{ width: "700px" }}
                                    onChange={(e) => {
                                        const selectedCodeValue = e.target.value;
                                        setSelectedCode(selectedCodeValue);

                                        const selectedAuthor = authors.find((a) => a.code === selectedCodeValue);
                                        if (selectedAuthor) {
                                            setAuthorId(selectedAuthor.id); // Guarda el ID real
                                            setAuthorName(selectedAuthor.firstName); // Muestra el nombre
                                        } else {
                                            setAuthorId("");
                                            setAuthorName("");
                                        }
                                    }}
                                    required
                                >
                                    <option value="">Seleccione un código de autor</option>
                                    {authors.map((author) => (
                                        <option key={author.id} value={author.code}>
                                            {author.code}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>

                            <div className="rp-cod-vers">
                                <div className="fiel-cod">
                                    <h4>Nombre del autor</h4>
                                </div>
                                <div className="fiel-vers">
                                    <input
                                    type="text"
                                    className="inputBloq-field"
                                    value={authorName}
                                    readOnly
                                    size="100"
                                    />
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
                                            setIntervieweeRole(value);
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
                            {/* Fecha */}
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

                            {/* Hora de inicio */}
                            <div className="fiel-cod-e">
                                <h4>Hora de inicio *</h4>
                                <span className="message">
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
                                    <span className="tooltip-text">Hora de inicio de la entrevista</span>
                                </span>
                            </div>

                            {/* Hora de fin */}
                            <div className="fiel-cod-e">
                                <h4>Hora de fin *</h4>
                                <span className="message">
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
                                    <span className="tooltip-text">Hora de fin de la entrevista</span>
                                </span>
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
                            <input
                                className="input-text"
                                type="text"
                                placeholder=""
                                size="50"
                                value={observations} onChange={(e) => setObservations(e.target.value)} 
                            />
                        </div>

                        <div className="rp-buttons">
                            <button onClick={irAEntrevistas} className="rp-button" size="50">Cancelar</button>
                            <button onClick={handleEdit} className="rp-button" size="50">Guardar cambios</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarEntrevista;
