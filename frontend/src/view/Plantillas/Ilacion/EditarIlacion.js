import React, { useState, useEffect,useRef } from "react";
import { useLocation, useNavigate ,useParams } from "react-router-dom";
import '../../../styles/stylesNuevaIlacion.css';
import '../../../styles/styles.css';
import axios from "axios";

const EditarIlacion = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {orgcod, projcod, educod, ilacod} = useParams();
    const { proid } = location.state || {};

    const [version, setVersion] = useState("");
    const [comment, setComentario] = useState("");
    const [creationDate, setFecha] = useState("");
    const [importance, setImportance] = useState("");
    const [name, setName] = useState("");
    const [postcondition, setPostCondition] = useState("");
    const [precondition, setPreCondition] = useState("");
    const [procedure, setProcedure] = useState("");
    const [status, setStatus] = useState("");
    

    const [error, setError] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    const fetchIlacionData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}`);
            const data = response.data;
            const rawDate = new Date(data.creationDate);
            const formattedDate = `${rawDate.getDate()}/${rawDate.getMonth() + 1}/${rawDate.getFullYear()}`;
            setFecha(formattedDate);
            setVersion(data.version);
            setComentario(data.comment);
            setName(data.name);
            setVersion(data.version);
            setPostCondition(data.postcondition);
            setPreCondition(data.precondition);
            setProcedure(data.procedure);
            setStatus(data.status);
            setImportance(data.importance);
        } catch (err) {
            setError("Error al obtener los datos del experto: " + err.message);
        }
    };

    useEffect(() => {
            console.log("Cargando ilacion con código:", ilacod);
            fetchIlacionData();
    }, [ilacod]);
    
    const handleEdit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.put(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}`, {
                name,
                postcondition,
                precondition,
                procedure,
                importance,
                comment, 
                status,
            });
    
            if (response.status === 200) {
                alert("Experto actualizado correctamente");
                irAIlacion();
            }
        } catch (err) {
            setError("Error al actualizar el experto: " + err.message);
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
                    <span>Editar Ilación</span>
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
                    <h2>EDITAR ILACIÓN</h2>
                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código Ilacion* </label>
                            <label className="ne-label">Version*</label>
                            <label className="ne-label">Fecha*</label>
                        </h3>
                        <div className="ne-input-container">
                            <input disabled type="text" className="ne-input" value={ilacod} readOnly />
                            <input disabled type="text" className="ne-input" value={version} readOnly />
                            <input disabled type="text" className="ne-input" value={creationDate} readOnly />
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input className="input-text" type="text" value={name} onChange={(e) => setName(e.target.value)} size="100" />
                                    <span className="tooltip-text">Editar el nombre de la ilación</span>
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
                            <label className="ne-label">Código de especificación*</label>
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
                                <option value="baja">Baja</option>
                                <option value="media">Media</option>
                                <option value="alta">Alta</option>
                            </select>

                            <select
                            className="ne-input estado-input"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                            >
                            <option value="" disabled hidden>
                                Seleccione una opción
                            </option>
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
                                    <input className="input-text" type="text" value={precondition} onChange={(e) => setPreCondition(e.target.value)} size="100" />
                                    <span className="tooltip-text">Editar la Precondicion</span>
                                </span>
                            </div>
                        </div>
                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Procedimiento*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input className="input-text" type="text" value={procedure} onChange={(e) => setProcedure(e.target.value)} size="100" />
                                    <span className="tooltip-text">Editar su procesamiento</span>
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
                                    <span className="tooltip-text">Editar la Postcondicion</span>
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
                                <option value="" disabled hidden>Seleccione una opción</option>
                                <option value="baja">Baja</option>
                                <option value="media">Media</option>
                                <option value="alta">Alta</option>
                            </select>

                            
                        </div>
                    </section>

                    <section className="ne-organizations-section">
                        <h3>Comentario</h3>

                        <div className="input-text"  >
                            <textarea className="input-fieldtext"value={comment} onChange={(e) => setComentario(e.target.value)} rows="3" ></textarea>
                        </div>

                        <div className="ne-buttons">
                            <button onClick={irAIlacion} className="ne-button" size="50">Cancelar</button>
                            <button onClick={handleEdit} className="ne-button" size="50">Guardar Cambios</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarIlacion;
