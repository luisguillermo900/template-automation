import React, { useState,useCallback, useEffect } from 'react';
import { useLocation, useNavigate,useParams } from "react-router-dom"
import { FaFolder, FaPencilAlt, FaTrash} from "react-icons/fa";
import '../../../styles/stylesPlantillasPrincipales.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';
import axios from 'axios';

const Artefactos = () => {
    const navigate = useNavigate();
    const { orgcod, projcod } = useParams();
    // Estado de proyectos y errores
    const [mnemonic, setMnemonic] = useState([]);
    const [interfaces, setInterfaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noResult, setNoResult] = useState(false);
    const location = useLocation();
    const { proid } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    // Estados para búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInterfaz, setSearchInterfaz] = useState('');

    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState(null); 
    const [mensajePopup, setMensajePopup] = useState("");
    const [codigoAEliminar, setCodigoAEliminar] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const fetchMnemonic = useCallback(async () => {
    //Obtener o listar expertos de un proyecto
        try {
            const response = await axios.get(`${API_BASE_URL}/artifacts`);
            setMnemonic(response.data.data); 
        } catch (err) {
            setError(
                err.response
                ? err.response.data.error
                : "Error al obtener los proyectos"
            );
        }
    }, [API_BASE_URL]);

    const fetchInterfaces = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/interfaces`);
            setInterfaces(response.data.data || []);
        } catch (err) {
            setError(
                err.response
                    ? err.response.data.error
                    : "Error al obtener las interfaces"
            );
        }
    }, [API_BASE_URL]);


    useEffect(() => {
    
        fetchMnemonic();
        fetchInterfaces();
    
    }, [fetchMnemonic, fetchInterfaces]);

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

    const handleSearch = async (searchType) => { 
    setLoading(true);
    try {
        let response;
        if (searchTerm) { 
            if (searchType === 'name') {
                response = await axios.get(`${API_BASE_URL}/artifacts/search/name`, {
                    params: { query: searchTerm } 
                });
            } else if (searchType === 'mnemonic') {
                response = await axios.get(`${API_BASE_URL}/artifacts/search/mnemonic`, {
                    params: { query: searchTerm } 
                });
            }
        } else {
            response = await axios.get(`${API_BASE_URL}/artifacts`);
        }
        const data = response.data.data || []; 
        setMnemonic(data);
        setNoResult(data.length === 0);
        setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "Error al buscar artefactos");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchInterfaz = async (searchType) => {
    setLoading(true);
    try {
        let response;
        if (searchInterfaz) { 
            if (searchType === 'name') {
                response = await axios.get(`${API_BASE_URL}/interfaces/search`, {
                    params: { query: searchInterfaz } 
                });
            } 
        } else {
            response = await axios.get(`${API_BASE_URL}/interfaces`);
        }
        const data = response.data.data || []; 
        setInterfaces(data);
        setNoResult(data.length === 0);
        setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "Error al buscar interfaces");
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/interfaces/exports/excel`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Interfaces.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a Excel");
        }
    };

    const exportToPDF = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/interfaces/exports/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Interfaces.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a PDF");
        }
    };

    // Función para eliminar una interfaz
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/interfaces/${id}`);
            fetchInterfaces();
            setMensajePopup("Interfaz eliminada correctamente.");
        } catch (err) {
            setMensajePopup("Error al eliminar la interfaz.");
            console.error(err);
        } finally {
            setTimeout(() => {
                cerrarPopup();
                setMensajePopup(""); 
            }, 1500);
        }
    };

    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAVerRiesgo = () => {
        navigate("/verRiesgo");
    };
    
    const irARegistrarRiesgo = () => {
        navigate("/registroRiesgo",{
        state: {
            proid:proid
        }
    });
    };
    const irAEditarRiesgo = () => {
        navigate("/editarRiesgo");
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

    const irANuevoNemonico = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/artifacts/new`,{
        state: {
            proid:proid
        }
    });
    };
    const irASubirInterfaz = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/artifacts/subirInterfaz`,{
        state: {
            proid:proid
        }
    });
    };
  
    const abrirPopup = (id, code) => {
        setIdAEliminar(id);
        setCodigoAEliminar(code);
        setMostrarPopup(true);
    };
      
    const cerrarPopup = () => {
        setMostrarPopup(false);
    };
      
    const confirmarEliminacion = () => {
        if (idAEliminar) {
            handleDelete(idAEliminar);
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
                    <span>Artefactos</span>
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
                    <h2>ARTEFACTOS</h2>
                    <section className="pp-section">
                        <h3>Nemónicos de los Artefactos</h3>

                        <div className="search-section-bar">
                            <button onClick={irANuevoNemonico} className="nuevo-pp-button">Nuevo Nemónico</button>
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input
                                    className="textBuscar"
                                    type="text"
                                    placeholder="Buscar por Artefacto o Nemónico" 
                                    style={{ width: "500px" }}
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                                    <span class="tooltip-text">Filtrar información por artefacto o por neumonico</span>
                                </span>
                                
                                <button className="search-button" onClick={() => handleSearch('name')}>Búsqueda por Artefacto</button>
                                <button className="search-button" onClick={() => handleSearch('mnemonic')}>Búsqueda por Nemónico</button>
                            </div>
                        </div>

                       

                        <div className="menu-tabla-center">
                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>ARTEFACTO</th>
                                        <th>NEMÓNICO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mnemonic.map((mn) => (
                                    <tr key={mn.id}>
                                        <td>{mn.name}</td>
                                        <td>{mn.mnemonic}</td>
                                    </tr>  
                                    ))}
                                </tbody>
                            </table>                                          
                        </div>                          
                    </section>
                    
                    <section className="pp-section">
                        <h3>Interfaces Gráficas de Usuarios</h3>
                        <div className="search-section-bar">
                            <button onClick={irASubirInterfaz} className="nuevo-pp-button">Subir Interfaz</button>
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    value={searchInterfaz}
                                    onChange={(e) => setSearchInterfaz(e.target.value)}
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por nombre o código de interfaz</span>
                                </span>
                                <button className="search-button" onClick={() => handleSearchInterfaz('name')}>Busqueda por Nombre</button>
                            </div>
                        </div>

                        <div className="menu-tabla-center">
                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>Código </th>
                                        <th>Nombre </th>
                                        <th>Versión</th>
                                        <th>Fecha</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {interfaces.map((inter) => (
                                    <tr key={inter.id}>
                                        <td>{inter.code}</td>
                                        <td>{inter.name}</td>
                                        <td>{inter.version}</td>
                                        <td>{new Date(inter.date).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    abrirPopup(inter.id, inter.code);
                                                    }}
                                                >
                                                <FaTrash style={{ color: "red", cursor: "pointer" }} />
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
                                        <p>¿Está seguro de eliminar la interfaz <strong>{codigoAEliminar}</strong> ? </p>
                                        <button onClick={confirmarEliminacion} className="si-button">Sí</button>
                                        <button onClick={cerrarPopup} className="no-button">No</button>
                                        </>
                                    )}
                                    </div>
                                </div>
                            )}

                        </div>
                        <h4>Total de registros {interfaces.length}</h4>
                            <div className="export-buttons">
                                <span class="message">
                                    <button className="export-button"onClick={exportToExcel}>Excel</button>
                                    <span class="tooltip-text">Generar reporte de las interfaces en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button" onClick={exportToPDF}>PDF</button>
                                    <span class="tooltip-text">Generar reporte de las interfaces en Pdf</span>
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

export default Artefactos;