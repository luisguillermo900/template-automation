import React, { useState,useEffect,useCallback } from 'react';
import { useLocation,useNavigate,useParams } from "react-router-dom"
import axios from "axios";
import { FaFolder, FaPencilAlt, FaTrash} from "react-icons/fa";
import '../../../styles/stylesPlantillasPrincipales.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';


const Especificacion = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orgcod, projcod,educod,ilacod,specod } = useParams();
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const { proid } = location.state || {};

// Estado de proyectos y errores
    const [espec, setSpecification] = useState([]);
    const [riesgos, setRiesgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
      
    // Estado para los parámetros de búsqueda
    const [searchNombre, setSearchNombre] = useState("");
    const [searchYear, setSearchYear] = useState("");
    const [searchMonth, setSearchMonth] = useState("");

    const [mostrarPopupEsp, setMostrarPopupEsp] = useState(false);
    const [mensajePopupEsp, setMensajePopupEsp] = useState("");
    const [codigoAEliminarEsp, setCodigoAEliminarEsp] = useState("");
    const [mostrarPopupRiesgo, setMostrarPopupRiesgo] = useState(false);
    const [mensajePopupRiesgo, setMensajePopupRiesgo] = useState("");
    const [codigoAEliminarRiesgo, setCodigoAEliminarRiesgo] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const riesgosFiltrados = riesgos.filter((riesgo) => riesgo.entityType === "Especificación");

    const fetchSpecification = useCallback(async () => {
    //Obtener o listar expertos de 
    try {
      const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications`);
      setSpecification(response.data||[]);
    } catch (err) {
      setError(
        err.response
          ? err.response.data.error
          : "Error al obtener las especificaciones"
      );
    }
  }, [projcod,orgcod,API_BASE_URL]);

    // Eliminar una especificacion
    const deleteEspecification = async (specod) => {
        try {
        // /organizations/:orgcod/projects/:projcod/sources/:srccod'
        await axios.delete(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/${specod}`);
        fetchSpecification(); // Refrescar la lista de fuentes después de eliminar uno
        setMensajePopupEsp("Especificación eliminada correctamente.");
        } catch (err) {
            setMensajePopupEsp("Error al eliminar la especificación");
            setError(err.response?.data?.error || "Error al eliminar la especificación");
        } finally {
            setTimeout(() => {
            cerrarPopupEsp();
            setMensajePopupEsp(""); 
            }, 1500);
        }
    };
    
    // Exportar a Excel
    const exportToExcel = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/exports/excel`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Especificaciones.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a Excel");
        }
    };

    // Exportar a PDF
    const exportToPDF = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/exports/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Especificaciones.pdf');
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
            link.setAttribute('download', 'Riesgos_Especififcaiones.xlsx');
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
            link.setAttribute('download', 'Riesgos_Especififcaciones.pdf');
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

    useEffect(() => {
        
        fetchSpecification();
        fetchRiesgos();
         
      }, [fetchSpecification, fetchRiesgos]);

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

    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAVerEspecificacion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications`,{
        state: {
            proid:proid
        }
    });
    };
    const irANuevaEspecificacion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/new`,{
        state: {
            proid:proid
        }
    });
    };
    const irAEditarEspecificacion = (specod) => {
       navigate(`/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/${specod}`,{
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

    //Abrir popup eliminar especificación
    const abrirPopupEsp = (code) => {
        setCodigoAEliminarEsp(code);
        setMostrarPopupEsp(true);
    };
      
    //Cerrar popup eliminar especificación
    const cerrarPopupEsp = () => {
        setMostrarPopupEsp(false);
    };
      
    //Confirma eliminar especificación, envia codigo de especificación
    const confirmarEliminacionEsp = () => {
        if (codigoAEliminarEsp) {
            deleteEspecification(codigoAEliminarEsp);
        }
    };

    //Abrir popup de eliminar riesgo de especificación
    const abrirPopupRiesgo = (code) => {
        setCodigoAEliminarRiesgo(code);
        setMostrarPopupRiesgo(true);
    };
      
    //Cerrar popup de eliminar riesgo de especificación
    const cerrarPopupRiesgo = () => {
        setMostrarPopupRiesgo(false);
    };
      
    //Confirma eliminar riesgo de especificación, envia código de riesgo
    const confirmarEliminacionRiesgo = () => {
        if (codigoAEliminarRiesgo) {
            deleteRiesgos(codigoAEliminarRiesgo);
        }
    };

    const handleSearch = async () => {
    try {
      setLoading(true);
      let endpoint;
      let params = {};

      // Determinar qué tipo de búsqueda realizar
      if (searchNombre) {
          // Búsqueda por nombre 
          // '/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications/search'
          endpoint = `${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/search`;
          params.name = searchNombre;
      } else if (searchYear || searchMonth) {
          // Búsqueda por fecha
          endpoint = `${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/search/date`;
          if (searchYear) params.year = searchYear;
          if (searchMonth) params.month = searchMonth;
      } else {
          // Si no hay criterios de búsqueda, cargar todos los proyectos
          await fetchSpecification();
          return;
      }

      const response = await axios.get(endpoint, { params });
      setSpecification(response.data);
      setError(null);
  } catch (err) {
      console.error("Error en la búsqueda:", err);
      setError(err.response?.data?.error || "Error al buscar fuentes");
      setSpecification([]);
  } finally {
      setLoading(false);
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
                    <span onClick={irAEducciones}>Educciones /</span>
                    <span onClick={irAIlaciones}>Ilaciones /</span>
                    <span>Especificación</span>
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
                    <h2>{educod} - {ilacod} - ESPECIFICACIÓN</h2>
                    <section className="pp-section">
                        <h3>Gestión de Especificación</h3>

                        <div className="search-section-bar">
                            <button onClick={irANuevaEspecificacion} className="nuevo-pp-button">Nueva Especificación</button>
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    onChange={(e) => setSearchNombre(e.target.value)}
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por nombre</span>
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
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {espec.map((specification) => (
                                        <tr key={specification.code} onClick={() => irAEditarEspecificacion(specification.code)}>
                                        <td>{specification.code}</td>
                                        <td>{specification.name}</td>
                                        <td>{new Date(specification.creationDate).toLocaleDateString()}</td>
                                        <td>
                                            {new Date(specification.modificationDate).toLocaleDateString()}
                                        </td>
                                        <td>{specification.status}</td>
                                        <td>{specification.version}</td>
                                        <td>
                                            <button
                                            className="botton-crud"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Evita que el clic se propague al <tr>
                                                irAEditarEspecificacion(specification.code); // Llama a la función para editar
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
                                                abrirPopupEsp(specification.code);//deleteProject(source.code); // Llama a la función de eliminación
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

                            {mostrarPopupEsp && (
                            <div className="popup-overlay">
                            <div className="popup-content">
                            {mensajePopupEsp ? (
                                <p>{mensajePopupEsp}</p>
                                ) : (
                                <>
                                <p>¿Está seguro de eliminar la especificación <strong>{codigoAEliminarEsp}</strong> ? </p>
                                <button onClick={confirmarEliminacionEsp} className="si-button">Sí</button>
                                <button onClick={cerrarPopupEsp} className="no-button">No</button>
                                </>
                                )}
                                </div>
                            </div>
                            )}
                                                        
                        </div>

                        
                            <div className="export-buttons">
                                <span class="message">
                                    <button className="export-button" onClick={exportToExcel}>Excel</button>
                                    <span class="tooltip-text">Generar reporte de las especificaciones en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button" onClick={exportToPDF}>PDF</button>
                                    <span class="tooltip-text">Generar reporte de las especificaciones en Pdf</span>
                                </span>
                            </div>

                    </section>
                    <section className="pp-section">
                        <h3>Gestión de Riesgos de Especificación</h3>
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
                                    <span class="tooltip-text">Filtrar información por código del requisito, responsbale o versión del riesgo</span>
                                </span>
                                <button className="search-button" onClick={handleSearch}>Buscar</button>
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
                                        .filter((riesgo) => riesgo.entityType === "Especificación")
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
                                    <span class="tooltip-text">Generar reporte de los riesgos en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button" onClick = {exportToPDFRisk}>PDF</button>
                                    <span class="tooltip-text">Generar reporte de los riesgos en Pdf</span>
                                </span>
                            </div>

                        <div className="search-section-bar">
                            <button onClick={irAIlaciones} className="atras-button">Regresar</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Especificacion;