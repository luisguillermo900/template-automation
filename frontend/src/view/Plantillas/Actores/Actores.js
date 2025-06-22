import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaFolder, FaPencilAlt, FaTrash } from "react-icons/fa";
import '../../../styles/stylesAutores.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';
import axios from "axios";

const Actores = () => {
    const { orgcod, projcod, actcod } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { proid } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});
    // Estado de proyectos y errores
    const [actors, setActors] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Estado para los parámetros de búsqueda
    const [searchNombre, setSearchNombre] = useState("");
    const [searchYear, setSearchYear] = useState("");
    const [searchMonth, setSearchMonth] = useState("");

    const [mostrarPopup, setMostrarPopup] = useState(false);
      const [mensajePopup, setMensajePopup] = useState("");
      const [codigoAEliminar, setCodigoAEliminar] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const fetchActors = useCallback(async () => {
        //Obtener o listar expertos de un proyecto
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/actors`);
            setActors(response.data || []);
        } catch (err) {
            setError(
                err.response
                    ? err.response.data.error
                    : "Error al obtener las fuentes"
            );
        }
    }, [projcod, orgcod, API_BASE_URL]);

    useEffect(() => {

        fetchActors();

    }, [fetchActors]);

    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");

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

    const irANuevoActor = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/actors/new`,{
        state: {
            proid:proid
        }
    });
    };
    const irAVerActor = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/actors`);
    };
    const irAEditarActor = (actcod) => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/actors/${actcod}`,{
        state: {
            proid:proid
        }
    });
    };

    // Obtener los parámetros de consulta
    // Obtener 'orgcod' de los parámetros de consulta

    const handleSearch = async () => {
        try {
            setLoading(true);
            let endpoint;
            let params = {};

            // Determinar qué tipo de búsqueda realizar
            if (searchNombre) {
                // Búsqueda por nombre
                endpoint = `${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/search`;
                params.name = searchNombre;
            } else if (searchYear || searchMonth) {
                // Búsqueda por fecha
                endpoint = `${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/search/date`;
                if (searchYear) params.year = searchYear;
                if (searchMonth) params.month = searchMonth;
            } else {
                // Si no hay criterios de búsqueda, cargar todos los proyectos
                await fetchActors();
                return;
            }

            const response = await axios.get(endpoint, { params });
            setActors(response.data);
            setError(null);
        } catch (err) {
            console.error("Error en la búsqueda:", err);
            setError(err.response?.data?.error || "Error al buscar fuentes");
            setActors([]);
        } finally {
            setLoading(false);
        }
    };

    // Eliminar una fuente 
    const deleteActor = async (codigo) => {
        try {
            // /organizations/:orgcod/projects/:projcod/sources/:srccod'
            await axios.delete(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/actors/${codigo}`);
            fetchActors(); // Refrescar la lista de fuentes después de eliminar uno
            setMensajePopup("Actor eliminado correctamente.");
        } catch (err) {
            setMensajePopup("Error al eliminar el actor");
            setError(err.response?.data?.error || "Error al eliminar el actor");
        } finally {
            setTimeout(() => {
            cerrarPopup();
            setMensajePopup(""); 
            }, 1500);
        }
    };

    // Exportar a Excel
    const exportToExcel = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/actors/exports/excel`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Actores.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a Excel");
        }
    };

    // Exportar a PDF
    const exportToPDF = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/actors/exports/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Actores.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a PDF");
        }
    };

    useEffect(() => {
        const fetchRoles = async () => {
            const res = await axios.get(`${API_BASE_URL}/roles`);
            setRoles(res.data.data || []); // Asegúrate de ajustar según cómo devuelves los datos
        };

        fetchRoles();
    }, []);   
    
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
    
    const abrirPopup = (code) => {
        setCodigoAEliminar(code);
        setMostrarPopup(true);
    };
      
    const cerrarPopup = () => {
        setMostrarPopup(false);
    };
      
    const confirmarEliminacion = () => {
        if (codigoAEliminar) {
            deleteActor(codigoAEliminar);
        }
    };

    return (
        <div className="menu-container">
            <header className="menu-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span>Actor</span>
                </div>
            </header>

            <div className="menusub-container">

                <aside className="sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="bar-menu">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin} className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="autor-content">
                    <h2>ACTORES</h2>
                    <section className="autor-organizations-section">
                        <div className="autor-search-section-bar">
                            <button onClick={irANuevoActor} className="autor-register-button">Nuevo Actor</button>

                            <div className="autor-sectionTextBuscar">
                                <span class="message">
                                    <input
                                        className="textBuscar"
                                        type="text"
                                        placeholder="Buscar"
                                        value={searchNombre}
                                        onChange={(e) => setSearchNombre(e.target.value)}
                                        style={{ width: "500px" }}
                                    />
                                    <span class="tooltip-text">Filtrar información por rol y/o código de actor.</span>
                                </span>

                                <button className="autor-search-button" onClick={handleSearch}>Buscar</button>
                            </div>
                        </div>

                        <table className="autor-centertabla">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Rol</th>
                                    <th>Fecha</th>
                                    <th>Versión</th>
                                    <th>Tipo</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {actors.map((actor) => (
                                    <tr key={actor.code} onClick={() => irAEditarActor(actor.code)}>
                                        <td>{actor.code}</td>
                                        <td>{actor.role?.name}</td>
                                        <td>{new Date(actor.creationDate).toLocaleDateString()}</td>
                                        <td>{actor.version}</td>
                                        <td>{actor.type}</td>
                                        
                                        <td>
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que el clic se propague al <tr>
                                                    irAEditarActor(actor.code); // Llama a la función para editar
                                                }}
                                            >
                                                <FaPencilAlt
                                                    style={{ color: "blue", cursor: "pointer" }}
                                                />
                                            </button>
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que el clic se propague al <tr>
                                                    abrirPopup(actor.code);//deleteProject(source.code); // Llama a la función de eliminación
                                                }}
                                            >
                                                <FaTrash
                                                    style={{ color: "red", cursor: "pointer" }}
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {mostrarPopup && (
                        <div className="popup-overlay">
                        <div className="popup-content">
                        {mensajePopup ? (
                            <p>{mensajePopup}</p>
                            ) : (
                            <>
                            <p>¿Está seguro de eliminar el actor <strong>{codigoAEliminar}</strong> ? </p>
                            <button onClick={confirmarEliminacion} className="si-button">Sí</button>
                            <button onClick={cerrarPopup} className="no-button">No</button>
                            </>
                            )}
                            </div>
                        </div>
                        )}

                        <h4>Total de registros {actors.length}</h4>
                        <div className="autor-export-buttons">
                            <span class="message">
                                <button className="autor-export-button" onClick={exportToExcel}>Excel</button>
                                <span class="tooltip-text">Generar reporte de los actores en Excel</span>
                            </span>
                            <span class="message">
                                <button className="autor-export-button"onClick={exportToPDF}>PDF</button>
                                <span class="tooltip-text">Generar reporte de los actores en Pdf</span>
                            </span>
                        </div>

                        <div className="search-section-bar">
                            <button onClick={irAPlantillas} className="atras-button">Regresar</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Actores;