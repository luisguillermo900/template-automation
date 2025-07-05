import React, { useState, useEffect,useCallback } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { FaFolder, FaPencilAlt, FaTrash} from "react-icons/fa";
import '../../../styles/stylesEntrevistas.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';

const Entrevistas = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {orgcod, projcod } = useParams();

    const [entrevistas, setEntrevistas] = useState([]);
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const [error, setError] = useState(null);
    const [evidencias, setEvidencias] = useState([]);
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const { proid } = location.state || {};

    const [searchNombre, setSearchNombre] = useState("");
    const [searchEvidence, setSearchEvidence] = useState('');
    const [loading, setLoading] = useState(true);

    const [idAEliminarEnt, setIdAEliminarEnt] = useState(null); 
    const [mostrarPopupEnt, setMostrarPopupEnt] = useState(false);
    const [mensajePopupEnt, setMensajePopupEnt] = useState("");
    const [codigoAEliminarEnt, setCodigoAEliminarEnt] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


    const fetchEentrevistas = useCallback(async () => {
    //Obtener o listar expertos de un proyecto
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/interviews`);
            setEntrevistas(response.data||[]);
        } catch (err) {
            setError(
                err.response
                ? err.response.data.error
                : "Error al obtener los proyectos"
            );
        }
    }, [projcod,orgcod,API_BASE_URL]);

    //Función para obtener lista de evidencias
    const fetchEvidencias = useCallback(async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/evidences`);
        setEvidencias(response.data || []);
    } catch (err) {
        setError(
            err.response
                ? err.response.data.error
                : "Error al obtener las evidencias"
            );
        }
    }, [projcod, orgcod, API_BASE_URL]);

    useEffect(() => {
    
        fetchEentrevistas();
        fetchEvidencias();
    
    }, [fetchEentrevistas, fetchEvidencias]);
    
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

    //Función para eliminar entrevista por id
    const deleteEntrevistas = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/interviews/${id}`);
            fetchEentrevistas(); // Refrescar la lista de proyectos después de eliminar uno
            setMensajePopupEnt("Entrevista eliminada correctamente.");
        } catch (err) {
            setMensajePopupEnt("Error al eliminar la entrevista");
            setError(err.response?.data?.error || "Error al eliminar la entrevista");
        } finally {
            setTimeout(() => {
            cerrarPopupEnt();
            setMensajePopupEnt(""); 
            }, 1500);
        }
    };

    //Función para buscar entrevista por nombre
    const handleSearch = async () => {
        setLoading(true);
        try {
            let response;
            if (searchNombre) {
                // Búsqueda por nombre
                response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/interviews/search`, {
                    params: { interviewName: searchNombre }
                });
            } else {
                // Sin criterios de búsqueda
                response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/interviews`);
            }
            
            const filteredData = response.data.filter(org => org.code !== "ORG-MAIN");
            setEntrevistas(filteredData);
            //setNoResult(filteredData.length === 0);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "Error al buscar organizaciones");
        } finally {
            setLoading(false);
        }
    };

    //Función para buscar evidencia por nombre
    const handleSearchEvidence = () => {
        if (!searchEvidence) {
            fetchEvidencias(); // recarga todas 
            return;
        }

        const filtered = evidencias.filter(evi => 
            evi.name.toLowerCase().includes(searchEvidence.toLowerCase())
        );
        setEvidencias(filtered);
    };

    //Función para exportar entrevistas en Excel
    const exportToExcel = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/interviews/exports/excel`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Entrevistas.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a Excel");
        }
    };

    // Función para exportar entrevistas en PDF
    const exportToPDF = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/interviews/exports/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Entrevistas.pdf');
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
    const irAVerEntrevista = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/verEntrevista`,{
        state: {
            proid:proid
        }
    });
    };

    const irANuevaEntrevista = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/entrevistas/new`,{
        state: {
            proid:proid
        }
    });
    };

    const irAEditarEntrevista = (entrecod) => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/entrevistas/edit`,{
        state: {
            proid:proid,
            id:entrecod
        }
    });
    };

    const irAVerEvidencia = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/evidencia`,{
        state: {
            proid:proid
        }
    });
    };
    
    const irASubirEvidencia = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/evidencias/new`,{
        state: {
            proid:proid,
            entrevistas:entrevistas
        }
    });
    };
    const irAMenuProyecto = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`,{
        state: {
            proid:proid
        }
    });
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };
 
    //Abrir popup de eliminar entrevista
    const abrirPopupEnt = (id, code) => {
        setIdAEliminarEnt(id);
        setCodigoAEliminarEnt(code);
        setMostrarPopupEnt(true);
    };
      
    //Cerrar popup de eliminar entrevista
    const cerrarPopupEnt = () => {
        setMostrarPopupEnt(false);
    };
      
    //Confirma eliminar entrevista, envia id de entrevista
    const confirmarEliminacionEnt = () => {
        if (idAEliminarEnt) {
            deleteEntrevistas(idAEliminarEnt);
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
                    <span>Entrevistas</span>
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
                    <h2>ENTREVISTAS</h2>
                    <section className="organization-section">
                        <h3>Entrevistas</h3>

                        <div className="search-section-bar">
                            <button onClick={irANuevaEntrevista} className="nueva-entrevista-button">Nueva Entrevista</button>
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
                                    <span class="tooltip-text">Filtrar información por nombre de entrevista</span>
                                </span>
                                
                                <button  className="search-button" onClick={handleSearch}>Buscar</button>
                            </div>
                        </div>

                        <div className="menu-tabla-center">
                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Versión</th>
                                        <th>Fecha</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entrevistas.map((entrevista) => (
                                        <tr key={entrevista.id}>
                                            <td>{entrevista.interviewName}</td>
                                            <td>{entrevista.version}</td>
                                            <td>{new Date(entrevista.interviewDate).toLocaleDateString()}</td>
                                            <td>
                                                <button className="botton-crud" onClick={() => irAEditarEntrevista(entrevista.id)}><FaPencilAlt style={{ color: "blue", cursor: "pointer" }} /></button>
                                                <button
                                                    className="botton-crud"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Evita que el clic se propague al <tr>
                                                        abrirPopupEnt(entrevista.id, entrevista.code) // Llama a la función de eliminación
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

                            {mostrarPopupEnt && (
                            <div className="popup-overlay">
                            <div className="popup-content">
                            {mensajePopupEnt ? (
                                <p>{mensajePopupEnt}</p>
                                ) : (
                                <>
                                <p>¿Está seguro de eliminar la entrevista <strong>{codigoAEliminarEnt}</strong> ? </p>
                                <button onClick={confirmarEliminacionEnt} className="si-button">Sí</button>
                                <button onClick={cerrarPopupEnt} className="no-button">No</button>
                                </>
                                )}
                                </div>
                            </div>
                            )}
                            
                        </div>

                        <div className="search-section-bar">
                            <h4>Total de registros {entrevistas.length}</h4>
                            <div className="export-buttons">
                                <span class="message">
                                    <button className="export-button" onClick={exportToExcel}>Excel</button>
                                    <span class="tooltip-text">Generar reporte de las entrevistas en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button"onClick={exportToPDF}>PDF</button>
                                    <span class="tooltip-text">Generar reporte de las entrevistas en Pdf</span>
                                </span>
                            </div>
                        </div>

                    </section>
                    <section className="organizations-section">
                        <h3>Evidencias</h3>

                        <div className="search-section-bar">
                            <button onClick={irASubirEvidencia} className="evidencia-button">Subir Evidencia</button>
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    value={searchEvidence}
                                    onChange={(e) => setSearchEvidence(e.target.value)}
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por nombre de evidencia</span>
                                </span>
                                <button className="search-button" onClick={handleSearchEvidence}>Buscar</button>
                            </div>
                        </div>

                        <div className="menu-tabla-center">
                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Entrevista</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evidencias.map((evi) => (
                                    <tr key={evi.id}>
                                        <td>{evi.code}</td>
                                        <td>{evi.name}</td>
                                        <td>{evi.interview?.interviewName || 'Sin nombre'}</td>
                                        <td>{new Date(evi.evidenceDate).toLocaleDateString()}</td>
                                        
                                    </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                        <div className="search-section-bar">
                            <button onClick={irAMenuProyecto} className="atras-button">Regresar</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Entrevistas;