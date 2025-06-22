import React,{ useState, useEffect,useRef } from "react";
import { useLocation, useNavigate ,useParams } from "react-router-dom";
import '../../../styles/stylesNuevaIlacion.css';
import '../../../styles/styles.css';
import axios from "axios";

const NuevaIlacion = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {orgcod, projcod,educod } = useParams();

    const { proid } = location.state || {};
    
    const [code, setCode] = useState("");
    const [comment, setComment] = useState("");
    const [version, setVersion] = useState("1.00");
    const [creationDate, setCreationDate] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    const [description, setDescription] = useState("");
    const [importance, setImportance] = useState("");
    const [modificationDate, setModificationDate] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    const [name, setName] = useState("");
    const [postcondition, setPostCondition] = useState("");
    const [precondition, setPretCondition] = useState("");
    const [procedure, setProdecesure] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError]=useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    
    useEffect(() => {
    
        const fetchNextCodigoIlacion = async () => {
            try {
                
                // Llamar al endpoint usando parámetros de consulta
                const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/next-code`);

                // Asignar el valor recibido al estado
                setCode(response.data.nextCode || "Ed-001");
            } catch (err) {
                console.error("Error al obtener el siguiente código de experto:", err);
                setError("No se pudo cargar el siguiente código del experto.");
            }
        };

        fetchNextCodigoIlacion();
    }, [API_BASE_URL,orgcod, projcod,educod]);

    const registrarIlacion = async (e) => {
        e.preventDefault();
        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones`, {
                name,
                postcondition,
                precondition,
                procedure,
                importance,
                comment, 
                status, 
            });
            
            // Redirigir a la página de expertos o realizar otra acción
            irAIlacion();
    
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
    const irAIlacion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion/${educod}/ilaciones`,{
        state: {
            proid:proid
        }
    });
    };

    const irAEduccion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educciones`,{
        state: {
            proid:proid
        }
    });
    };

    const [dropdownOpen, setDropdownOpen] = React.useState({
        actors: false,
        fuentes: false,
        expertos: false,
        ilaciones: false
    });
    const [selectedItems, setSelectedItems] = React.useState([]);
    const actors = ["ACT-0001", "ACT-0002", "ACT-0003"];
    const fuentes = ["FUE-0001", "FUE-0002", "FUE-0003"];
    const expertos = ["EXP-0001", "EXP-0002", "EXP-0003"];
    const ilaciones = ["ILA-0001", "ILA-0002", "ILA-0003"];

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
                    actors: false,
                    fuentes: false,
                    expertos: false,
                    ilaciones: false
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
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span onClick={irAEduccion}>Educción /</span>
                    <span onClick={irAIlacion}>Ilacion /</span>
                    <span>Nueva Ilación</span>
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
                    <h2>NUEVA ILACIÓN</h2>
                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código Ilacion* </label>
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
                                    <input className="input-text" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la ilación" size="100" />
                                    <span className="tooltip-text">Ingresar el nombre de la ilación</span>
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
                                <div className="dropdown-toggle" onClick={() => toggleDropdown("actors")}>
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
                            <label className="ne-label">Código de ilación*</label>
                            <label className="ne-label">Importancia*</label>
                            <label className="ne-label">Estado*</label>
                        </h3>
                        <div className="ne-input-container">
                            <div className="custom-select-dropdown">
                                <div className="dropdown-toggle" onClick={() => toggleDropdown("ilaciones")}>
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
                            </div>
                            <select
                                className="ne-input estado-input"
                
                                value={importance}
                                onChange={(e) => setImportance(e.target.value)}
                                required
                            >
                                <option value="" disabled hidden>Seleccione una opción</option>
                                <option value="Baja">Baja</option>
                                <option value="Media">Media</option>
                                <option value="Alta">Alta</option>
                            </select>

                            <select
                                className="ne-input estado-input"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            >
                                <option value="" disabled hidden>Seleccione una opción</option>
                                <option value="Por empezar">Por empezar</option>
                                <option value="En progreso">En progreso</option>
                                <option value="Finalizado">Finalizado</option>
                            </select>
                            
                        </div>
                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Precondicion*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input className="input-text" type="text" value={precondition} onChange={(e) => setPretCondition(e.target.value)}  size="100" />
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
                                    <input className="input-text" type="text" value={procedure} onChange={(e) => setProdecesure(e.target.value)}  size="100" />
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
                                    <input className="input-text" type="text" value={postcondition} onChange={(e) => setPostCondition(e.target.value)} size="100" />
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
                            <div className="custom-select-dropdown">
                                <div className="dropdown-toggle" onClick={() => toggleDropdown("ilaciones")}>
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
                            </div>
                            <select
                                className="ne-input estado-input"
                                onChange={(e) => {
                                    const selectedImportancia = e.target.value;
                                    console.log("Importancia seleccionada:", selectedImportancia);
                                }}
                            >
                                <option value="">Seleccione una opcion</option>
                                <option value="baja">Baja</option>
                                <option value="media">Media</option>
                                <option value="alta">Alta</option>
                            </select>

                            
                        </div>
                    </section>

                    <section className="ne-organizations-section">
                        <h3>Comentario</h3>

                        <div className="input-text">
                            <textarea className="input-fieldtext" rows="3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Añadir comentarios "></textarea>
                        </div>

                        <div className="ne-buttons">
                            <button onClick={irAIlacion} className="ne-button" size="50">Cancelar</button>
                            <button onClick={registrarIlacion} className="ne-button" size="50">Crear Ilación</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevaIlacion;
