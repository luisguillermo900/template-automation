import React, { useState, useCallback, useEffect} from 'react';
import { useLocation, useNavigate ,useParams } from "react-router-dom";
import { FaFolder, FaPencilAlt, FaTrash} from "react-icons/fa";
import '../../../styles/stylesPlantillasPrincipales.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';
import axios from 'axios';


const Ilacion = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orgcod, projcod,educod } = useParams();
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const [ilaciones, setIlaciones] = useState([]);
    const [riesgos, setRiesgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchNombre, setSearchNombre] = useState("");

    const [error, setError] = useState(null);
    const { proid } = location.state || {};

    const [mostrarPopupIla, setMostrarPopupIla] = useState(false);
    const [mensajePopupIla, setMensajePopupIla] = useState("");
    const [codigoAEliminarIla, setCodigoAEliminarIla] = useState("");
    const [mostrarPopupRiesgo, setMostrarPopupRiesgo] = useState(false);
    const [mensajePopupRiesgo, setMensajePopupRiesgo] = useState("");
    const [codigoAEliminarRiesgo, setCodigoAEliminarRiesgo] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const riesgosFiltrados = riesgos.filter((riesgo) => riesgo.entityType === "Ilación");
    
    const fetchIlaciones = useCallback(async () => {
    //Obtener o listar expertos de un proyecto
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones`);
            setIlaciones(response.data.ilaciones||[]);
        } catch (err) {
            setError(
                err.response
                ? err.response.data.error
                : "Error al obtener los proyectos"
            );
        }
    }, [projcod,orgcod,educod,API_BASE_URL]);
    
    useEffect(() => {
        
        fetchIlaciones();
        
    }, [fetchIlaciones]);

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

     const deleteIlation = async (codigo) => {
        try {
            await axios.delete(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${codigo}`);
            fetchIlaciones(); // Refrescar la lista de proyectos después de eliminar uno
            setMensajePopupIla("Ilación eliminada correctamente.");
        } catch (err) {
            setMensajePopupIla("Error al eliminar la ilación");
            setError(err.response?.data?.error || "Error al eliminar la ilación");
        } finally {
            setTimeout(() => {
            cerrarPopupIla();
            setMensajePopupIla(""); 
            }, 1500);
        }
    };

    const deleteRiesgos = async (codigo) => {
        try {
            await axios.delete(`${API_BASE_URL}/projects/${proid}/risks/${codigo}`);
            fetchRiesgos(); // Refrescar la lista de proyectos después de eliminar uno
            setMensajePopupRiesgo("Riesgo eliminado correctamente.");
        } catch (err) {
            setMensajePopupRiesgo("Error al eliminar el riesgo");
            setError(err.response?.data?.error || "Error al eliminar el riesgo");
        } finally {
            setTimeout(() => {
            cerrarPopupRiesgo();
            setMensajePopupRiesgo(""); 
            }, 1500);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            let response;
            if (searchNombre) {
                // Búsqueda por nombre
                response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/search`, {
                    params: { name: searchNombre }
                });
            } else {
                // Sin criterios de búsqueda
                response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones`);
            }
            
            const filteredData = response.data.filter(ilacion => ilacion.code !== "ORG-MAIN");
            setIlaciones(filteredData);
            //setNoResult(filteredData.length === 0);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "Error al buscar organizaciones");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
    }

    const exportToExcel = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/exports/excel`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Ilaciones.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a Excel");
        }
    };

    const exportToPDF = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/exports/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Ilaciones.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a PDF");
        }
    };

    const exportToExcelRisk = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/projects/${proid}/risks/exports/excel`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Educciones.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a Excel");
        }
    };

    // Exportar a PDF
    const exportToPDFRisk = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/projects/${proid}/risks/exports/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Educciones.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a PDF");
        }
    };

    const fetchRiesgos = useCallback(async () => {
    //Obtener o listar educciones de un proyecto
        try {
            const response = await axios.get(`${API_BASE_URL}/projects/${proid}/risks`);
            setRiesgos(response.data||[]);
        } catch (err) {
            setError(
                err.response
                ? err.response.data.error
                : "Error al obtener los proyectos"
            );
        }
    }, [proid,API_BASE_URL]);

    useEffect(() => {
    
        fetchRiesgos();
    
    }, [fetchRiesgos]);



    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAVerEduccion = () => {
        navigate("/verEduccion");
    };
    const irANuevaIlacion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion/${educod}/ilaciones/new`,{
        state: {
            proid:proid
        }
    });
    };
    const irAEditarIlacion = (ilacod) => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion/${educod}/ilaciones/${ilacod}`,{
        state: {
            proid:proid
        }
    });
    };
    const irAVerRiesgo = () => {
        navigate("/verRiesgo");
    };
    
    const irARegistrarRiesgo = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/riesgoNew`,{
        state: {
            proid:proid,
            from: location.pathname
        }
    });
    };
    const irAEditarRiesgo = (id,rskcod) => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/riesgo/${rskcod}`,{
        state: {
            proid:proid,
            idRisk:id,
            from: location.pathname
        }
    });
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };
    const irAMenuProyecto = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuproyecto`,{
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

    const irAEduccion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion`,{
        state: {
            proid:proid
        }
    });
    };
    const irAEspecificaciones = (ilacod) => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications`,{
        state: {
            proid:proid
        }
    });
    };

    //Abrir popup para eliminar ilación
   const abrirPopupIla = (code) => {
        setCodigoAEliminarIla(code);
        setMostrarPopupIla(true);
    };
      
    //Cerrar popup para eliminar ilación
    const cerrarPopupIla = () => {
        setMostrarPopupIla(false);
    };
      
    //Confirma eliminar ilación, envia código de ilación
    const confirmarEliminacionIla = () => {
        if (codigoAEliminarIla) {
            deleteIlation(codigoAEliminarIla);
        }
    };

    //Abrir popup eliminar riesgo de ilación
    const abrirPopupRiesgo = (code) => {
        setCodigoAEliminarRiesgo(code);
        setMostrarPopupRiesgo(true);
    };
      
    //Cerrar popup para eliminar riesgo de ilación
    const cerrarPopupRiesgo = () => {
        setMostrarPopupRiesgo(false);
    };
      
    //Confirma eliminar riesgo de ilación, envía código de riesgo
    const confirmarEliminacionRiesgo = () => {
        if (codigoAEliminarRiesgo) {
            deleteRiesgos(codigoAEliminarRiesgo);
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
                    <span onClick={irAEduccion}>Educción /</span>
                    <span>Ilación</span>
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

                <main className="main-content">
                    <h2>{educod} - ILACIÓN</h2>
                    <section className="pp-section">
                        <h3>Gestion de Ilacion</h3>

                        <div className="search-section-bar">
                            <button onClick={irANuevaIlacion} className="nuevo-pp-button">Nueva Ilación</button>
                            <div className="sectionTextBuscar">
                                <span className="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    value={searchNombre}
                                    onChange={(e) => setSearchNombre(e.target.value)}
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por nombre o código de ilación</span>
                                </span>
                                
                                <button className="search-button" onClick={handleSearch}>Buscar</button>
                            </div>
                        </div>      

                        <div className="menu-tabla-center">
                        <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Fecha creación</th>
                                        <th>Fecha modificación</th>
                                        <th>Estado</th>
                                        <th>Versión</th>
                                        <th>Especificaciones</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ilaciones.map((ilacion) => (
                                        <tr key={ilacion.code}>
                                        <td>{ilacion.code}</td>
                                        <td>{ilacion.name}</td>
                                        <td>{new Date(ilacion.creationDate).toLocaleDateString()}</td>
                                        <td>
                                            {ilacion.modificationDate
                                            ? new Date(ilacion.modificationDate).toLocaleDateString()
                                            : "N/A"}
                                        </td>
                                        <td>{ilacion.status}</td>
                                        <td>{ilacion.version}</td>
                                        <td>{ilacion.ilacion}
                                            <button onClick={() => irAEspecificaciones(ilacion.code)} className="option-button">Ver Especificacion</button>
                                        </td>
                                        <td>
                                            <button className="botton-crud" onClick={() => irAEditarIlacion(ilacion.code)}>
                                                <FaPencilAlt 
                                                style={{ color: "blue", cursor: "pointer" }}
                                                />
                                            </button>
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que el clic se propague al <tr>
                                                    abrirPopupIla(ilacion.code) // Llama a la función de eliminación
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

                            {mostrarPopupIla && (
                            <div className="popup-overlay">
                            <div className="popup-content">
                            {mensajePopupIla ? (
                                <p>{mensajePopupIla}</p>
                                ) : (
                                <>
                                <p>¿Está seguro de eliminar la ilación <strong>{codigoAEliminarIla}</strong> ? </p>
                                <button onClick={confirmarEliminacionIla} className="si-button">Sí</button>
                                <button onClick={cerrarPopupIla} className="no-button">No</button>
                                </>
                                )}
                                </div>
                            </div>
                            )}
                            
                        </div>

                        <h4>Total de registros {ilaciones.length}</h4>
                            <div className="export-buttons">
                                <span class="message">
                                    <button className="export-button"onClick={exportToExcel}>Excel</button>
                                    <span class="tooltip-text">Generar un reporte en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button"onClick={exportToPDF}>PDF</button>
                                    <span class="tooltip-text">Generar un reporte en Pdf</span>
                                </span>
                            </div>

                    </section>
                    <section className="pp-section">
                        <h3>Gestión de Riesgos de Ilacion</h3>
                        <div className="search-section-bar">
                            <button onClick={irARegistrarRiesgo} className="nuevo-pp-button">Registrar Riesgo</button>
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por nombre o código de ilación</span>
                                </span>
                                <button className="search-button"onClick={handleSearch}>Buscar</button>
                            </div>
                        </div>

                        <div className="menu-tabla-center">
                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>Código del Requisito</th>
                                        <th>Versión</th>
                                        <th>Responsable</th>
                                        <th>Riesgo Identificado</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riesgos
                                        .filter((riesgo) => riesgo.entityType === "Ilación")
                                        .map((riesgo, index) => (
                                        <tr key={index}>
                                            <td>{riesgo.registryCode}</td>
                                            <td>{riesgo.code}</td>
                                            <td>AUT-001</td>
                                            <td>{riesgo.description}</td>
                                            <td>
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                e.stopPropagation();
                                                irAEditarRiesgo(riesgo.id,riesgo.code); // puedes pasar el id
                                                }}
                                            >
                                                <FaPencilAlt style={{ color: "blue", cursor: "pointer" }} />
                                            </button>
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                e.stopPropagation();
                                                abrirPopupRiesgo(riesgo.code); // opcionalmente pasar el id
                                                }}
                                            >
                                                <FaTrash style={{ color: "red", cursor: "pointer" }} />
                                            </button>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>

                            </table>

                            {mostrarPopupRiesgo && (
                                <div className="popup-overlay">
                                <div className="popup-content">
                                    {mensajePopupRiesgo ? (
                                        <p>{mensajePopupRiesgo}</p>
                                        ) : (
                                        <>
                                        <p>¿Está seguro de eliminar el riesgo <strong>{codigoAEliminarRiesgo}</strong> ? </p>
                                        <button onClick={confirmarEliminacionRiesgo} className="si-button">Sí</button>
                                        <button onClick={cerrarPopupRiesgo} className="no-button">No</button>
                                        </>
                                    )}
                                </div>
                                </div>
                            )}

                        </div>
                        <h4>Total de registros {riesgosFiltrados.length}</h4>
                            <div className="export-buttons">
                                <span class="message">
                                    <button className="export-button" onClick={exportToExcelRisk}>Excel</button>
                                    <span class="tooltip-text">Generar reporte en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button" onClick={exportToPDFRisk}>PDF</button>
                                    <span class="tooltip-text">Generar reporte en Pdf</span>
                                </span>
                            </div>

                        <div className="search-section-bar">
                            <button  className="atras-button"onClick={irAEduccion}>Regresar</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Ilacion;