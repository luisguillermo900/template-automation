import React, { useState, useEffect,useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import '../../../styles/stylesNuevaIlacion.css';
import '../../../styles/styles.css';
import axios from "axios";

const EditarRNF = () => {

    const navigate = useNavigate();
    const {orgcod, projcod,rnfcod} = useParams();
    const location = useLocation();
    const { proid } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const [version, setVersion] = useState("");
    const [comment, setComentario] = useState("");
    const [creationDate, setFecha] = useState("");
    const [importance, setImportance] = useState("");
    const [qualityAttribute, setQualityAttribute] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");

    const [error, setError] = useState(null);
    const [errorName, setErrorName]=useState("");
    const [errorDescription, setErrorDescription]=useState("");
    const [errorImportance, setErrorImportance] = useState("");
    const [errorQualityAttribute, setErrorQualityAttribute] = useState("");     
    const [errorComment, setErrorComment] = useState("");   
    const [errorStatus, setErrorStatus] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    //Función para obtener la información de un rnf según código
    const fetchRnfData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/projects/${proid}/nfrs/${rnfcod}`);
            const data = response.data;
            const rawDate = new Date(data.creationDate);
            const formattedDate = `${rawDate.getDate()}/${rawDate.getMonth() + 1}/${rawDate.getFullYear()}`;
            setFecha(formattedDate);
            setVersion(data.version);
            setComentario(data.comment);
            setName(data.name);
            setVersion(data.version);
            setQualityAttribute(data.qualityAttribute)
            setStatus(data.status);
            setDescription(data.description)
            setImportance(data.importance);
        } catch (err) {
            setError("Error al obtener los datos del RNF: " + err.message);
        }
    };

    useEffect(() => {
            fetchRnfData();
    }, [rnfcod]);

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
    
    //Función para editar y guardar cambios
    const handleEdit = async (e) => {
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
            const response = await axios.put(`${API_BASE_URL}/projects/${proid}/nfrs/${rnfcod}`, {
                name,
                qualityAttribute,
                description,
                status,
                importance,
                comment,
            });
    
            if (response.status === 200) {
                alert("Experto actualizado correctamente");
                irARNF();
            }
        } catch (err) {
            setError("Error al actualizar el RNF: " + err.message);
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
                    <span>Editar RNF</span>
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
                    <h2>EDITAR REQUERIMIENTO NO FUNCIONAL</h2>
                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código RNF* </label>
                            <label className="ne-label">Version*</label>
                            <label className="ne-label">Fecha*</label>
                        </h3>
                        <div className="ne-input-container">
                            <input disabled type="text" className="ne-input" value={rnfcod} readOnly />
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
                                    size="100"
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
                                <span className="tooltip-text">Selecciona atributo de calidad</span>
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
                                        setDescription(value);
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
                                    size="100"
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
                            <button onClick={irARNF} className="ne-button" size="100">Cancelar</button>
                            <button onClick={handleEdit} className="ne-button" size="100">Guardar RNF</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarRNF;
