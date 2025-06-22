import axios from "axios";
import React, {useState, useEffect, useRef } from "react";
import { useLocation, useNavigate,useParams } from "react-router-dom"
import '../../../styles/stylesNuevaIlacion.css';
import '../../../styles/styles.css';

const NuevaEspecificacion = () => {

    const navigate = useNavigate();
    const location = useLocation();    
    const hasFetched = useRef(false);
    const { proid } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});
     // Obtener datos del proyecto del URL
        const { orgcod, projcod,educod,ilacod } = useParams();
    
        const [code, setCodigoEspecificacion] = useState("");
        const [version, setVersionEspecificacion] = useState("00.01");
        const [creationDate, setFechaCreacion] = useState(
            new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
        );
        const [modificationDate, setFechaModificacion] = useState(
            new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
        );
    
     // Datos controlados por el usuario
        const [name, setNombre] = useState("");
        const [status, setEstado] = useState("");
        const [precondition, setPrecondicion] = useState("");
        const [procedure, setProcedure] = useState("");
        const [postcondition, setPostcondicion] = useState("");
        const [comment, setComentario] = useState("");
        const [importance, setImporancia] = useState("");


    //Estados para manejar errores
    const [error, setError] = useState(null);
    const [errorName, setErrorName] = useState("");
    const [errorImportance, setErrorImportance] = useState("");
    const [errorStatus, setErrorStatus] = useState("");
    const [errorPrecondicion, setErrorPrecondicion] = useState("");
    const [errorProcedimiento, setErrorProcedimiento] = useState("");
    const [errorPostcondicion, setErrorPostcondicion] = useState("");
    const [errorComment, setErrorComment] = useState("");
    
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    
    // Obtener el siguiente código de especificacion
    useEffect(() => {
        if (hasFetched.current) return; // Previene segunda ejecución
        hasFetched.current = true;
        const fetchNextCodigoEspecificacion = async () => {
            try {
                
                // Llamar al endpoint usando parámetros de consulta
                ///organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications/next-code
                const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/next-code`);

                // Asignar el valor recibido al estado
                setCodigoEspecificacion(response.data.nextCode || "ESP-001");
            } catch (err) {
                console.error("Error al obtener el siguiente código de experto:", err);
                setError("No se pudo cargar el siguiente código del experto.");
            }
        };

        fetchNextCodigoEspecificacion();
    }, [API_BASE_URL,orgcod, projcod]);

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

    //Registrar nueva especificcion
    const registrarEspecificacion = async (e) => {
        e.preventDefault();
        if (!name) {
            setErrorName("El nombre es obligatorio.");
            return;
        }
        if (!importance) {
            setErrorImportance("Debe seleccionar una importancia.");
            return;
        }
        if (!status) {
            setErrorStatus("Debe seleccionar un estado");
            return;
        }

        if (!precondition) {
            setErrorPrecondicion("La precondición es obligatoria");
            return;
        }
        if (!procedure) {
            setErrorProcedimiento("El procedimiento es obligatorio");
            return;
        }
        if (!postcondition) {
            setErrorPostcondicion("La postcondición es obligatoria");
            return;
        }
        try {
            // Realiza la solicitud POST con los datos correctos
                await axios.post(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications`, {
                name,
                comment, // Asumiendo que 'comentario' es un campo adicional
                status, // Asumiendo que 'estado' es otro campo
                precondition,
                procedure,
                postcondition,
                importance,
            });
            
            // Redirigir a la página de expertos o realizar otra acción
            irAEspecificacion();
    
        } catch (err) {
            console.error("Error al registrar el experto:", err);
            setError("No se pudo registrar al experto. Inténtalo de nuevo.");
        }
    };
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irALogin = () => {
        navigate("/");
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };
    const irAMenuProyecto = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`,{
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
    const irAEducciones = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion`,{
        state: {
            proid:proid
        }
    });
    };
    const irAIlaciones = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion/${educod}/ilaciones`,{
        state: {
            proid:proid
        }
    });
    };
    const irAEspecificacion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications`,{
        state: {
            proid:proid
        }
    });
    };
    const irAEditarEspecificacion = (espcod) => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/${espcod}`,{
        state: {
            proid:proid
        }
    });
    };

    const [dropdownOpen, setDropdownOpen] = React.useState({
        actors: false,
        fuentes: false,
        expertos: false,
        ilaciones: false,
        artefactos: false
    });
    const [selectedItems, setSelectedItems] = React.useState([]);
    const actors = ["ACT-0001", "ACT-0002", "ACT-0003"];
    const fuentes = ["FUE-0001", "FUE-0002", "FUE-0003"];
    const expertos = ["EXP-0001", "EXP-0002", "EXP-0003"];
    const ilaciones = ["ILA-0001", "ILA-0002", "ILA-0003"];
    const artefactos = ["ART-0001", "ART-0002", "ART-0003"];

    const handleCheckboxChange = (value) => {
        setSelectedItems((prev) =>
            prev.includes(value) 
                ? prev.filter((item) => item !== value) // Elimina si ya está seleccionado
                : [...prev, value] // Agrega si no está seleccionado
        );
    };
    
    return (
        <div className="ne-container">
            <header className="ne-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span onClick={irAEducciones}>Educciones /</span>
                    <span onClick={irAIlaciones}>Ilaciones /</span>
                    <span onClick={irAEspecificacion}>Especificaciones/</span>
                    <span>Nueva Especificacion</span>
                </div>
            </header>

            <div className="nesub-container">

                <aside className="sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="bar-ne">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin}className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="ne-content">
                    <h2>NUEVA ESPECIFICACIÓN</h2>
                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código Especificación* </label>
                            <label className="ne-label">Version*</label>
                            <label className="ne-label">Fecha*</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="text" className="inputBloq-field" value={code} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input type="text" className="inputBloq-field" value={version} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input type="text" className="inputBloq-field" value={creationDate} readOnly size="30" />
                            </div>
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Nombre de la ilación"
                                    value={name}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 50) {
                                        setNombre(value);
                                        setErrorName(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorName("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!name.trim()) {
                                        setErrorName("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={50}
                                    size="100"
                                    />
                                    {errorName && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorName}</p>)}
                                    <span className="tooltip-text">Ingresar el nombre de la Especificación</span>
                                </span>
                            </div>
                        </div>

                    </section>

                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Actor*</label>
                            <label className="ne-label">Autor de plantilla*</label>
                            <label className="ne-label">Fuente</label>
                            <label className="ne-label">Experto</label>
                        </h3>
                        <div className="ne-input-container">
                            <div className="custom-select-dropdown">
                                <div className="dropdown-toggle" >
                                    <span>
                                        {selectedItems.length > 0
                                            ? selectedItems.join(", ")
                                            : "Seleccione una o más opciones"}
                                    </span>
                                    <span className="dropdown-arrow">▼</span>
                                </div>
                                {dropdownOpen.actors && (
                                    <div className="dropdown-menu">
                                        {actors.map((option, index) => (
                                            <label key={index} className="dropdown-item">
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    checked={selectedItems.includes(option)}
                                                    onChange={(e) => handleCheckboxChange(e.target.value)}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <input disabled type="text" className="ne-input" value="AUT-0000" readOnly />
                            <div className="custom-select-dropdown">
                                <div className="dropdown-toggle">
                                    <span>
                                        {selectedItems.length > 0
                                            ? selectedItems.join(", ")
                                            : "Seleccione una o más opciones"}
                                    </span>
                                    <span className="dropdown-arrow">▼</span>
                                </div>
                                {dropdownOpen.fuentes && (
                                    <div className="dropdown-menu">
                                        {fuentes.map((option, index) => (
                                            <label key={index} className="dropdown-item">
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    checked={selectedItems.includes(option)}
                                                    onChange={(e) => handleCheckboxChange(e.target.value)}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="custom-select-dropdown">
                                <div className="dropdown-toggle" >
                                    <span>
                                        {selectedItems.length > 0
                                            ? selectedItems.join(", ")
                                            : "Seleccione una o más opciones"}
                                    </span>
                                    <span className="dropdown-arrow">▼</span>
                                </div>
                                {dropdownOpen.expertos && (
                                    <div className="dropdown-menu">
                                        {expertos.map((option, index) => (
                                            <label key={index} className="dropdown-item">
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    checked={selectedItems.includes(option)}
                                                    onChange={(e) => handleCheckboxChange(e.target.value)}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código de ilación*</label>
                            <label className="ne-label">Estado*</label>
                        </h3>
                        <div className="ne-input-container">
                            <div className="ro-fiel-cod">
                                <input type="text" className="inputBloq-field" value={ilacod} readOnly size="30" />
                            </div>
                            {/*<div className="custom-select-dropdown">
                                <div className="dropdown-toggle" >
                                    <span>
                                        {selectedItems.length > 0
                                            ? selectedItems.join(", ")
                                            : "Seleccione una o más opciones"}
                                    </span>
                                    <span className="dropdown-arrow">▼</span>
                                </div>
                                {dropdownOpen.ilaciones && (
                                    <div className="dropdown-menu">
                                        {ilaciones.map((option, index) => (
                                            <label key={index} className="dropdown-item">
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    checked={selectedItems.includes(option)}
                                                    onChange={(e) => handleCheckboxChange(e.target.value)}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>*/}


                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <select
                                    className="ne-input estado-input"
                                    value={status}
                                    onChange={(e) => {
                                        setEstado(e.target.value);
                                        setErrorStatus(""); // limpiar error al seleccionar
                                    }}
                                    onBlur={() => {
                                        if (!status) {
                                        setErrorStatus("Debe seleccionar un estado.");
                                        }
                                    }}
                                    required
                                    >
                                    <option value="">Seleccione una opción</option>
                                    <option value="Por empezar">Por empezar</option>
                                    <option value="En progreso">En progreso</option>
                                    <option value="Finalizado">Finalizado</option>
                                    </select>
                                    {errorStatus && (
                                    <p style={{ color: "red", margin: 0 }}>{errorStatus}</p>
                                    )}
                            </div>
                            
                        </div>
                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Precondicion*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Precondicion"
                                    value={precondition}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 80) {
                                        setPrecondicion(value);
                                        setErrorPrecondicion(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorPrecondicion("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!precondition.trim()) {
                                        setErrorPrecondicion("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={80}
                                    size="100"
                                    />
                                    {errorPrecondicion && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorPrecondicion}</p>)}
                                    <span className="tooltip-text">Ingresar la Precondicion</span>
                                </span>
                            </div>
                        </div>
                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Procedimiento*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Procedimiento"
                                    value={procedure}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 80) {
                                        setProcedure(value);
                                        setErrorProcedimiento(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorProcedimiento("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!procedure.trim()) {
                                        setErrorProcedimiento("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={80}
                                    size="100"
                                    />
                                    {errorProcedimiento && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorProcedimiento}</p>)}
                                    <span className="tooltip-text">Describir su procesamiento</span>
                                </span>
                            </div>
                        </div>
                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Postcondicion*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Postcondicion"
                                    value={postcondition}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 80) {
                                        setPostcondicion(value);
                                        setErrorPostcondicion(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorPostcondicion("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!postcondition.trim()) {
                                        setErrorPostcondicion("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={80}
                                    size="100"
                                    />
                                    {errorPostcondicion && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorPostcondicion}</p>)}
                                    <span className="tooltip-text">Ingresar la Postcondicion</span>
                                </span>
                            </div>
                        </div>
                    </section>
                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código de artefactos asociados*</label>
                            <label className="ne-label">Importancia*</label>
                            
                        </h3>
                        <div className="ne-input-container">
                             {/*¨Select Codigo Artefactos Asociados */}
                            <div className="custom-select-dropdown">
                                <div className="dropdown-toggle" >
                                    <span>
                                        {selectedItems.length > 0
                                            ? selectedItems.join(", ")
                                            : "Seleccione una o más opciones"}
                                    </span>
                                    <span className="dropdown-arrow">▼</span>
                                </div>
                                {dropdownOpen.artefactos && (
                                    <div className="dropdown-menu">
                                        {artefactos.map((option, index) => (
                                            <label key={index} className="dropdown-item">
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    checked={selectedItems.includes(option)}
                                                    onChange={(e) => handleCheckboxChange(e.target.value)}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/*¨Select importancia*/}
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <select
                                    className="ne-input estado-input"
                                    value={importance}
                                    onChange={(e) => {
                                        setImporancia(e.target.value);
                                        setErrorImportance(""); // limpiar error al seleccionar
                                    }}
                                    onBlur={() => {
                                        if (!importance) {
                                        setErrorImportance("Debe seleccionar una importancia.");
                                        }
                                    }}
                                    required
                                    >
                                    <option value="">Seleccione una opción</option>
                                    <option value="Baja">Baja</option>
                                    <option value="Media">Media</option>
                                    <option value="Alta">Alta</option>
                                    </select>
                                    {errorImportance && (
                                    <p style={{ color: "red", margin: 0 }}>{errorImportance}</p>
                                    )}
                                </div>

                            
                        </div>
                    </section>

                    <section className="ne-organizations-section">
                        <h3>Comentario</h3>

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

                        <div className="ne-buttons">
                            <button onClick={irAEspecificacion} className="ne-button" size="50">Cancelar</button>
                            <button onClick={registrarEspecificacion} className="ne-button" size="50">Crear Especificación</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevaEspecificacion;
