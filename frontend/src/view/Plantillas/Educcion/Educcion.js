import React, { useState,useCallback, useEffect } from 'react';
import { useLocation, useNavigate,useParams } from "react-router-dom";
import { FaFolder, FaPencilAlt, FaTrash} from "react-icons/fa";
import '../../../styles/stylesPlantillasPrincipales.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';
import axios from 'axios';


const Educcion = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orgcod, projcod } = useParams();
    const { proid } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    // Estado de proyectos y errores
    const [educciones, setEducciones] = useState([]);
    const [riesgos, setRiesgos] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
        
    // Estado para los parámetros de búsqueda
    const [searchNombre, setSearchNombre] = useState("");
    const [searchYear, setSearchYear] = useState("");
    const [searchMonth, setSearchMonth] = useState("");

    const [mostrarPopupEdu, setMostrarPopupEdu] = useState(false);
    const [mensajePopupEdu, setMensajePopupEdu] = useState("");
    const [codigoAEliminarEdu, setCodigoAEliminarEdu] = useState("");
    const [mostrarPopupRiesgo, setMostrarPopupRiesgo] = useState(false);
    const [mensajePopupRiesgo, setMensajePopupRiesgo] = useState("");
    const [codigoAEliminarRiesgo, setCodigoAEliminarRiesgo] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const riesgosFiltrados = riesgos.filter((riesgo) => riesgo.entityType === "Educción");


    const fetchEducciones = useCallback(async () => {
    //Obtener o listar educciones de un proyecto
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones`);
            setEducciones(response.data||[]);
        } catch (err) {
            setError(
                err.response
                ? err.response.data.error
                : "Error al obtener los proyectos"
            );
        }
    }, [projcod,orgcod,API_BASE_URL]);

    useEffect(() => {
    
        fetchEducciones();
    
    }, [fetchEducciones]);

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



    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
    const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

    const deleteEduction = async (codigo) => {
        try {
            await axios.delete(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${codigo}`);
            fetchEducciones(); // Refrescar la lista de proyectos después de eliminar uno
            setMensajePopupEdu("Educción eliminada correctamente.");
        } catch (err) {
            setMensajePopupEdu("Error al eliminar la educción");
            setError(err.response?.data?.error || "Error al eliminar la educción");
        } finally {
            setTimeout(() => {
            cerrarPopupEdu();
            setMensajePopupEdu(""); 
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
                response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/search`, {
                    params: { name: searchNombre }
                });
            } else {
                // Sin criterios de búsqueda
                response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones`);
            }
            
            const filteredData = response.data.filter(org => org.code !== "ORG-MAIN");
            setEducciones(filteredData);
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
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/exports/excel`, {
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
    const exportToPDF = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/exports/pdf`, {
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

    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAVerEduccion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion/new`,{
        state: {
            proid:proid
        }
    });
    };
    const irANuevaEduccion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion/new`,{
        state: {
            proid:proid
        }
    });
    };
    const irAEditarEduccion = (code) => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion/${code}`,{
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

    const irAIlaciones = (code) => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion/${code}/ilaciones`,{
        state: {
            proid:proid
        }
    });
    };
  
    //Abrir popup para eliminar educcion
    const abrirPopupEdu = (code) => {
        setCodigoAEliminarEdu(code);
        setMostrarPopupEdu(true);
    };
      
    //Cerrar popup de eliminar educcion
    const cerrarPopupEdu = () => {
        setMostrarPopupEdu(false);
    };
      
    //Confirma eliminar educcion, envia codigo de educcion
    const confirmarEliminacionEdu = () => {
        if (codigoAEliminarEdu) {
            deleteEduction(codigoAEliminarEdu);
        }
    };

    //Abrir popup eliminar riesgo
    const abrirPopupRiesgo = (code) => {
        setCodigoAEliminarRiesgo(code);
        setMostrarPopupRiesgo(true);
    };
      
    //Cerrar popup elikinar riesgo
    const cerrarPopupRiesgo = () => {
        setMostrarPopupRiesgo(false);
    };
      
    //Confirma eliminar riesgo, envia codigo de riesgo
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
                    <span>Educción</span>
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
                    <h2>EDUCCIÓN</h2>
                    <section className="pp-section">
                        <h3>Educción</h3>

                        <div className="search-section-bar">
                            <button onClick={irANuevaEduccion} className="nuevo-pp-button">Nueva Educción</button>
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    value={searchNombre}
                                    onChange={(e) => setSearchNombre(e.target.value)}
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por nombre o código de educción</span>
                                </span>
                                
                                <button className="search-button" onClick={handleSearch}>Buscar </button>
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
                                        <th>Ilaciones</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {educciones.map((educcion) => (
                                        <tr key={educcion.code}>
                                        <td>{educcion.code}</td>
                                        <td>{educcion.name}</td>
                                        <td>{new Date(educcion.creationDate).toLocaleDateString()}</td>
                                        <td>
                                            {educcion.modificationDate
                                            ? new Date(educcion.modificationDate).toLocaleDateString()
                                            : "N/A"}
                                        </td>
                                        <td>{educcion.status}</td>
                                        <td>{educcion.version}</td>
                                        <td>{educcion.ilacion}
                                            <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    irAIlaciones(educcion.code) 
                                                    }} className="option-button">Ver Ilación</button>
                                        </td>
                                        <td>
                                            <button className="botton-crud" onClick={() => irAEditarEduccion(educcion.code)}>
                                                <FaPencilAlt 
                                                style={{ color: "blue", cursor: "pointer" }}
                                                />
                                            </button>
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que el clic se propague al <tr>
                                                    abrirPopupEdu(educcion.code) // Llama a la función de eliminación
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

                            {mostrarPopupEdu && (
                            <div className="popup-overlay">
                            <div className="popup-content">
                            {mensajePopupEdu ? (
                                <p>{mensajePopupEdu}</p>
                                ) : (
                                <>
                                <p>¿Está seguro de eliminar la educción <strong>{codigoAEliminarEdu}</strong> ? </p>
                                <button onClick={confirmarEliminacionEdu} className="si-button">Sí</button>
                                <button onClick={cerrarPopupEdu} className="no-button">No</button>
                                </>
                                )}
                                </div>  
                            </div>
                            )}
                            
                        </div>

                        <h4>Total de registros {educciones.length}</h4>
                            <div className="export-buttons">
                                <span class="message">
                                    <button className="export-button" onClick={exportToExcel}>Excel</button>
                                    <span class="tooltip-text">Generar reporte de las entrevistas en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button" onClick={exportToPDF}>PDF</button>
                                    <span class="tooltip-text">Generar reporte de las entrevistas en Pdf</span>
                                </span>
                            </div>

                    </section>
                    <section className="pp-section">
                        <h3>Gestión de Riesgos de Educción</h3>
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
                                    <span class="tooltip-text">Filtrar información por nombre o código de educción</span>
                                </span>
                                <button className="search-button">Buscar</button>
                            </div>
                        </div>

                        <div className="menu-tabla-center">
                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>Código del Requisito</th>
                                        <th>Código de Riesgo</th>
                                        <th>Responsable</th>
                                        <th>Riesgo Identificado</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riesgos
                                        .filter((riesgo) => riesgo.entityType === "Educción")
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
                                    <span class="tooltip-text">Generar reporte de las entrevistas en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button"onClick={exportToPDFRisk}>PDF</button>
                                    <span class="tooltip-text">Generar reporte de las entrevistas en Pdf</span>
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

export default Educcion;