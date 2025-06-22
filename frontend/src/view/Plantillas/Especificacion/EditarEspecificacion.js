import React, { useState, useEffect, useRef} from "react";
import { useLocation, useNavigate,useParams } from "react-router-dom"
import '../../../styles/stylesNuevaIlacion.css';
import '../../../styles/styles.css';
import axios from "axios";
const EditarEspecificacion = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const hasRun = useRef(false);

    const { proid } = location.state || {};
    
    const { orgcod, projcod,educod,ilacod,specod } = useParams();
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
    // Datos controlados por el usuario
    //const [code, setCodigoEspecificacion] = useState("");
    const [creationDate, setFecha] = useState("");
    const [version, setVersion] = useState("");
    const [name, setNombre] = useState("");
    const [status, setEstado] = useState("");
    const [precondition, setPrecondicion] = useState("");
    const [procedure, setProcedure] = useState("");
    const [postcondition, setPostcondicion] = useState("");
    const [comment, setComentario] = useState("");
    const [importance, setImporancia] = useState("");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    const [error, setError] = useState(null);
    // GET: traer los datos de especificacion
    const fetchSpecificationData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/${specod}`);
            const data = response.data;
            setNombre(data.name);
            setEstado(data.status);
            setVersion(data.version);
            setPrecondicion(data.precondition);
            setProcedure(data.procedure);
            setPostcondicion(data.postcondition);
            setComentario(data.comment);
            setFecha(data.creationDate);
        } catch (err) {
            setError("Error al obtener los datos de la fuente: " + err.message);
        }
    };
    useEffect(() => {
            if (hasRun.current) return; // 🚫 Evita ejecutar nuevamente
            hasRun.current = true;
            console.log("Cargando Especificacion con código:", specod);
            fetchSpecificationData();
        }, [specod]);
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
    // Cerrar el dropdown al hacer clic fuera
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".custom-select-dropdown")) {
                setDropdownOpen({
                    actors: false,
                    fuentes: false,
                    expertos: false,
                    ilaciones: false,
                    artefactos:false
                });
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // Datos simulados de la especificación seleccionada
    //const [especificacion, setEspecificacion] = useState({
      //  codigo: "ESP-001",
        //version: "01.00",
        //fecha: "01/12/2024",
        //nombre: "Especificación de prueba",
        //actor: "ACT-0001",
        //autor: "AUT-0001",
        //fuente: "FUE-0001",
        //experto: "EXP-0002",
        //ilacion: "ILA-0002",
        //estado: "Activo",
        //precondicion: "Precondición de ejemplo",
        //procedimiento: "Procedimiento de ejemplo",
        //postcondicion: "Postcondición de ejemplo",
        //artefacto: "ART-0003",
        //importancia: "Alta",
        //comentario: "Comentario de ejemplo"
    //});

    const toggleDropdown = (dropdown) => {
        setDropdownOpen((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown]
        }));
    };
     useEffect(() => {
            if (hasRun.current) return; // 🚫 Evita ejecutar nuevamente
            hasRun.current = true;
            console.log("Cargando fuente con código:", specod);
            fetchSpecificationData();
        }, [specod]);

    return (
        <div className="ne-container">
            <header className="ne-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span onClick={irAEducciones}>Educciones /</span>
                    <span onClick={irAIlaciones}>Ilaciones /</span>
                    <span onClick={irAEspecificacion}>Especificaciones /</span>
                    <span>Editar Especificacion</span>
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
                    <h2>EDITAR ESPECIFICACIÓN</h2>
                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código Especificación* </label>
                            <label className="ne-label">Version*</label>
                            <label className="ne-label">Fecha*</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="text" className="inputBloq-field" value={specod} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input type="text" className="inputBloq-field" value={version} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input type="text" className="inputBloq-field"  value={creationDate} readOnly size="30" />
                            </div>
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre*</h4>
                            </div>
                            <div className="fiel-vers">
                                <input
                                    className="input-text"
                                    type="text"
                                    value={name}
                                    size="100"
                                />
                                <span className="tooltip-text">Editar el nombre de la Especificación</span>
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
                                                    //onChange={(e) => handleCheckboxChange(e.target.value)}
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
                                                    //onChange={(e) => handleCheckboxChange(e.target.value)}
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
                                                    //onChange={(e) => handleCheckboxChange(e.target.value)}
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
                                                    //onChange={(e) => handleCheckboxChange(e.target.value)}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <select
                                className="ne-input estado-input"
                                value ={status} 
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                <option value ={status} >{status}</option>
                                <option value ='Activo'>Activo</option>
                                <option value ='Inactivo'>Inactivo</option>
                            </select>
                            
                        </div>
                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Precondicion*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input
                                    className="input-text"
                                    type="text"
                                    value={precondition}
                                    size="100"
                                />
                                <span className="tooltip-text">Editar la precondición de especificación</span>
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
                                    className="input-text"
                                    type="text"
                                    value={procedure}
                                    
                                    size="100"
                                />
                                <span className="tooltip-text">Editar la procedimeinto de especificación</span>
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
                                    className="input-text"
                                    type="text"
                                    value={postcondition}
                                    size="100"
                                />
                                <span className="tooltip-text">Editar la postcondición de especificación</span>
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
                                <div className="dropdown-toggle" onClick={() => toggleDropdown("artefactos")}>
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
                                                    //onChange={(e) => handleCheckboxChange(e.target.value)}
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
                                <option value="Alta">Alta</option>
                                <option value="Media">Media</option>
                                <option value="Baja">Baja</option>
                            </select>

                            
                        </div>
                    </section>

                    <section className="ne-organizations-section">
                        <h3>Comentario</h3>

                        <div className="input-text">
                            <textarea className="input-fieldtext" rows="3" 
                            value={comment}
                            ></textarea>
                        
                        </div>

                        <div className="ne-buttons">
                            <button onClick={irAEspecificacion} className="ne-button" size="50">Cancelar</button>
                            <button onClick={irAEspecificacion} className="ne-button" size="50">Crear Especificación</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarEspecificacion;
