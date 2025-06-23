import React,{ useState, useEffect,useRef } from "react";
import { useNavigate,useParams,useLocation } from "react-router-dom";
import '../../../styles/stylesNuevaIlacion.css';
import '../../../styles/styles.css';
import axios from "axios";

const NuevoRNF = () => {

    const navigate = useNavigate();

    const {projcod,orgcod} = useParams();
    const location = useLocation();
    const { proid } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const [code, setCode] = useState("");
    const [version, setVersion] = useState("1.00");
    const [creationDate, setCreationDate] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    const [name, setName] = useState("");
    const [qualityAttribute, setQualityAttribute] = useState("");
    const [description, setDescripcion] = useState("");
    const [status, setStatus] = useState("");
    const [importance, setImportance] = useState("");
    const [comment, setComment] = useState("");


    const [error, setError]=useState(null);
    const [errorName, setErrorName]=useState("");
    const [errorDescription, setErrorDescription]=useState("");
    const [errorImportance, setErrorImportance] = useState("");
    const [errorQualityAttribute, setErrorQualityAttribute] = useState("");
    const [errorComment, setErrorComment] = useState("");
    const [errorStatus, setErrorStatus] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    useEffect(() => {
    
        const fetchNextCodigoRnf = async () => {
            try {
                
                // Llamar al endpoint usando parámetros de consulta
                const response = await axios.get(`${API_BASE_URL}/projects/${proid}/nfrs/next-code`);

                // Asignar el valor recibido al estado
                setCode(response.data.nextCode || "Ed-001");
            } catch (err) {
                console.error("Error al obtener el siguiente código de experto:", err);
                setError("No se pudo cargar el siguiente código del experto.");
            }
        };

        fetchNextCodigoRnf();
    }, [API_BASE_URL,proid]);

    const registrarRnf = async (e) => {
        e.preventDefault();

        if (!name) {
            setErrorName("El nombre del RNF es obligatoria.");
            return;
        }
        if (!qualityAttribute) {
            setErrorQualityAttribute("Debe seleccionar un atributo de calidad.");
            return;
        }
        if (!description) {
            setErrorDescription("La descripción de RNF es obligatorio.");
            return;
        }
        if (!importance) {
            setErrorImportance("Debe seleccionar una opción.");
            return;
        }
        if (!status) {
            setErrorStatus("Debe seleccionar una opción.");
            return;
        }
        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/projects/${proid}/nfrs`, {
                name,
                qualityAttribute,
                description,
                status,
                importance,
                comment, 
            });
            
            // Redirigir a la página de expertos o realizar otra acción
            irARNF();
    
        } catch (err) {
            console.error("Error al registrar el Efn:", err);
            setError("No se pudo registrar al experto. Inténtalo de nuevo.");
        }
    };    

    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
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
    const irARNF = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/rnf`,{
        state: {
            proid:proid
        }
    });
    };

    const [dropdownOpen, setDropdownOpen] = React.useState({
        fuentes: false,
        expertos: false,
    });
    const [selectedItems, setSelectedItems] = React.useState([]);
    const fuentes = ["FUE-0001", "FUE-0002", "FUE-0003"];
    const expertos = ["EXP-0001", "EXP-0002", "EXP-0003"];

    const handleCheckboxChange = (value) => {
        setSelectedItems((prev) =>
            prev.includes(value) 
                ? prev.filter((item) => item !== value) // Elimina si ya está seleccionado
                : [...prev, value] // Agrega si no está seleccionado
        );
    };
    // Cerrar el dropdown al hacer clic fuera
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".custom-select-dropdown")) {
                setDropdownOpen({
                    fuentes: false,
                    expertos: false
                });
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const toggleDropdown = (dropdown) => {
        setDropdownOpen((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown]
        }));
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

    return (
        <div className="ne-container">
            <header className="ne-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span onClick={irARNF}>Requerimientos No Funcionales/</span>
                    <span>Nuevo RNF</span>
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
                    <h2>NUEVO REQUERIMIENTO NO FUNCIONAL</h2>
                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código RNF* </label>
                            <label className="ne-label">Version*</label>
                            <label className="ne-label">Fecha*</label>
                        </h3>
                        <div className="ne-input-container">
                            <input disabled type="text" className="ne-input" value={code} readOnly />
                            <input disabled type="text" className="ne-input" value={version} readOnly />
                            <input disabled type="text" className="ne-input" value={creationDate} readOnly />
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
                                    value={name}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 100) {
                                        setName(value);
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
                                    maxLength={100}
                                    size="114"
                                    />
                                    {errorName && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorName}</p>)}
                                    <span className="tooltip-text">Ingresar el nombre del RNF</span>
                                </span>
                            </div>
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Atributo de Calidad*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                <select
                                    className="estado2-input"
                                    style={{ width: "600px" }}
                                    value={qualityAttribute}
                                    onChange={(e) => {
                                        setQualityAttribute(e.target.value);
                                        if (e.target.value) {
                                        setErrorQualityAttribute(""); // limpia error si selecciona algo
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!qualityAttribute) {
                                        setErrorQualityAttribute("Debe seleccionar un atributo de calidad.");
                                        }
                                    }}
                                    required
                                    >
                                    <option value="">Seleccione una opción</option>
                                    <option value="seguridad">Seguridad</option>
                                    <option value="accesibilidad">Accesibilidad</option>
                                    <option value="eficiencia">Eficiencia</option>
                                    <option value="usabilidad">Usabilidad</option>
                                    <option value="mantenimiento">Mantenimiento</option>
                                    </select>

                                    {errorQualityAttribute && (
                                    <p style={{ color: "red", margin: 0 }}>{errorQualityAttribute}</p>
                                    )}
                                    </span>
                            </div>
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Descripción*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    value={description}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 100) {
                                        setDescripcion(value);
                                        setErrorDescription(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorDescription("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!description.trim()) {
                                        setErrorDescription("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={100}
                                    size="114"
                                    />
                                    {errorDescription && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorDescription}</p>)}
                                    <span className="tooltip-text">Ingresar detalles sobre el requerimiento no funcional</span>
                                </span>
                            </div>
                        </div>

                    </section>

                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Autor de plantilla*</label>
                            <label className="ne-label">Fuente</label>
                            <label className="ne-label">Experto</label>
                        </h3>
                        <div className="ne-input-container">
                            
                            <input disabled type="text" className="ne-input" value="AUT-0000" readOnly />
                            <div className="custom-select-dropdown">
                                <div className="dropdown-toggle" onClick={() => toggleDropdown("fuentes")}>
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
                                <div className="dropdown-toggle" onClick={() => toggleDropdown("expertos")}>
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
                            <label className="ne-label">Importancia*</label>
                            <label className="ne-label">Estado*</label>
                        </h3>
                        <div className="ne-input-container" style={{ display: 'flex', gap: '20px' }}>
  
                                {/* Select de Importance */}
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <select
                                    className="ne-input estado-input"
                                    style={{ width: '100%' }}
                                    value={importance}
                                    onChange={(e) => {
                                        setImportance(e.target.value);
                                        if (e.target.value) setErrorImportance("");
                                    }}
                                    onBlur={() => {
                                        if (!importance) setErrorImportance("Debe seleccionar una opción.");
                                    }}
                                    required
                                    >
                                    <option value="">Seleccione una opción</option>
                                    <option value="Alta">Alta</option>
                                    <option value="Media">Media</option>
                                    <option value="Baja">Baja</option>
                                    </select>
                                    {errorImportance && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorImportance}</p>
                                    )}
                                </div>

                                {/* Select de Estado */}
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <select
                                    className="ne-input estado-input"
                                    style={{ width: '100%' }}
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        if (e.target.value) setErrorStatus("");
                                    }}
                                    onBlur={() => {
                                        if (!status) setErrorStatus("Debe seleccionar una opción.");
                                    }}
                                    required
                                    >
                                    <option value="">Seleccione una opción</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                    </select>
                                    {errorStatus && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorStatus}</p>
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
                                    setComment(value);
                                    setErrorComment("");
                                    } else {
                                    setErrorComment("No se permiten caracteres especialeS.");
                                    }
                                }}
                                ></textarea>

                                {errorComment && <p style={{ color: 'red', margin: 0 }}>{errorComment}</p>}
                        </div>

                        <div className="ne-buttons">
                            <button onClick={irARNF} className="ne-button" size="100">Cancelar</button>
                            <button onClick={registrarRnf} className="ne-button" size="100">Crear RNF</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevoRNF;
