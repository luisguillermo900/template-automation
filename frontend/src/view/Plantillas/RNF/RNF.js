import React, { useState, useCallback, useEffect} from 'react';
import { useNavigate,useParams,useLocation } from "react-router-dom";
import { FaFolder, FaPencilAlt, FaTrash} from "react-icons/fa";
import '../../../styles/stylesPlantillasPrincipales.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';
import axios from 'axios';


const RNF = () => {
    const navigate = useNavigate();
    const {projcod,orgcod} = useParams();
    const location = useLocation();
    const { proid } = location.state || {};

    const [rnfs, setRnfs] = useState([]);
    const [riesgos, setRiesgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchNombre, setSearchNombre] = useState("");

    const [error, setError] = useState(null);
    const [mostrarPopupRnf, setMostrarPopupRnf] = useState(false);
    const [mensajePopupRnf, setMensajePopupRnf] = useState("");
    const [codigoAEliminarRnf, setCodigoAEliminarRnf] = useState("");
    const [mostrarPopupRiesgo, setMostrarPopupRiesgo] = useState(false);
    const [mensajePopupRiesgo, setMensajePopupRiesgo] = useState("");
    const [codigoAEliminarRiesgo, setCodigoAEliminarRiesgo] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const riesgosFiltrados = riesgos.filter((riesgo) => riesgo.entityType === "Req. No Funcional");

    const fetchRnfs = useCallback(async () => {
    //Obtener o listar expertos de un proyecto
        try {
            const response = await axios.get(`${API_BASE_URL}/projects/${proid}/nfrs`);
            setRnfs(response.data||[]);
        } catch (err) {
            setError(
                err.response
                ? err.response.data.error
                : "Error al obtener los proyectos"
            );
        }
    }, [proid,API_BASE_URL]);


    const deleteRnf = async (codigo) => {
        try {
            await axios.delete(`${API_BASE_URL}/projects/${proid}/nfrs/${codigo}`);
            fetchRnfs(); // Refrescar la lista de proyectos después de eliminar uno
            setMensajePopupRnf("Requerimiento no funcional eliminado correctamente.");
        } catch (err) {
            setMensajePopupRnf("Error al eliminar el RNF");
            setError(err.response?.data?.error || "Error al eliminar el RNF");
        } finally {
            setTimeout(() => {
            cerrarPopupRnf();
            setMensajePopupRnf(""); 
            }, 1500);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            let response;
            if (searchNombre) {
                // Búsqueda por nombre
                response = await axios.get(`${API_BASE_URL}/projects/${proid}/nfrs/search/name`, {
                    params: { name: searchNombre }
                });
            } else {
                // Sin criterios de búsqueda
                response = await axios.get(`${API_BASE_URL}/projects/${proid}/nfrs`);
            }
            
            const filteredData = response.data.filter(ilacion => ilacion.code !== "ORG-MAIN");
            setRnfs(filteredData);
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
            const response = await axios.get(`${API_BASE_URL}/projects/${proid}/nfrs/exports/excel`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Requisitos no Funcionales.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a Excel");
        }
    };

    const exportToPDF = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/projects/${proid}/nfrs/exports/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'RequisitosRNF.pdf');
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
                : "Error al obtener los riesgos"
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
    
        fetchRiesgos();
        fetchRnfs();
    
    }, [fetchRiesgos, fetchRnfs]);

    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
    };
    const irAVerRNF = () => {
        navigate("/verRNF");
    };
    const irANuevoRNF = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/rnf/new`,{
        state: {
            proid:proid
        }
    });
    };
    const irAEditarRNF = (code) => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/rnf/${code}`,{
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
    const irAEditarRiesgo = () => {
        navigate("/editarRiesgo");
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`,{
        state: {
            proid:proid
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
    const irAPlantillas = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/plantillas`,{
        state: {
            proid:proid
        }
    });
    };
  
    const abrirPopupRnf = (code) => {
        setCodigoAEliminarRnf(code);
        setMostrarPopupRnf(true);
    };
      
    const cerrarPopupRnf = () => {
        setMostrarPopupRnf(false);
    };
      
    const confirmarEliminacionRnf = () => {
        if (codigoAEliminarRnf) {
            deleteRnf(codigoAEliminarRnf);
        }
    };

    const abrirPopupRiesgo = (code) => {
        setCodigoAEliminarRiesgo(code);
        setMostrarPopupRiesgo(true);
    };
      
    const cerrarPopupRiesgo = () => {
        setMostrarPopupRiesgo(false);
    };
      
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
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span>Requerimeintos No Funcionales</span>
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
                    <h2>REQUERIMIENTOS NO FUNCIONALES</h2>
                    <section className="pp-section">
                        <h3>Registro de Requerimeintos No Funcionales</h3>

                        <div className="search-section-bar">
                            <button onClick={irANuevoRNF} className="nuevo-pp-button">Nuevo RNF</button>
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
                                    <span class="tooltip-text">Filtrar información por código, nombre y estado del RNF</span>
                                </span>
                                
                                <button className="search-button" onClick={handleSearch}>Buscar</button>
                            </div>
                        </div>

                        <div className="pp-search-section-text">
                            <div className="pp-searchbar">
                                <select className="pp-year-input">
                                    <option value="">AÑO</option>
                                    {[2025, 2024, 2023, 2022, 2021, 2020].map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                <select className="pp-month-input">
                                    <option value="">MES</option>
                                    {[
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
                                        "Diciembre"
                                    ].map((month, index) => (
                                        <option key={index} value={index + 1}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
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
                                    {rnfs.map((rnf) => (
                                        <tr key={rnf.code}>
                                        <td>{rnf.code}</td>
                                        <td>{rnf.name}</td>
                                        <td>{new Date(rnf.creationDate).toLocaleDateString()}</td>
                                        <td>
                                            {rnf.modificationDate
                                            ? new Date(rnf.modificationDate).toLocaleDateString()
                                            : "N/A"}
                                        </td>
                                        <td>{rnf.status}</td>
                                        <td>{rnf.version}</td>
                                        <td>
                                            <button className="botton-crud" onClick={() => irAEditarRNF(rnf.code)}>
                                                <FaPencilAlt 
                                                style={{ color: "blue", cursor: "pointer" }}
                                                />
                                            </button>
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que el clic se propague al <tr>
                                                    abrirPopupRnf(rnf.code) // Llama a la función de eliminación
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

                            {mostrarPopupRnf && (
                            <div className="popup-overlay">
                            <div className="popup-content">
                            {mensajePopupRnf ? (
                                <p>{mensajePopupRnf}</p>
                                ) : (
                                <>
                                <p>¿Está seguro de eliminar el <strong>{codigoAEliminarRnf}</strong> ? </p>
                                <button onClick={confirmarEliminacionRnf} className="si-button">Sí</button>
                                <button onClick={cerrarPopupRnf} className="no-button">No</button>
                                </>
                                )}
                                </div>
                            </div>
                            )}
                            
                        </div>

                        <h4>Total de registros {rnfs.length}</h4>
                            <div className="export-buttons">
                                <span class="message">
                                    <button className="export-button"onClick={exportToExcel}>Excel</button>
                                    <span class="tooltip-text">Generar reporte de los RNF en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button" onClick={exportToPDF}>PDF</button>
                                    <span class="tooltip-text">Generar reporte de los RNF en Pdf</span>
                                </span>
                            </div>

                    </section>
                    <section className="pp-section">
                        <h3>Gestión de Riesgos de Requerimientos No Funcionales</h3>
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
                                    <span class="tooltip-text">Filtrar información por nombre o código de RNF</span>
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
                                        .filter((riesgo) => riesgo.entityType === "Req. No Funcional")
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
                                                irAEditarRiesgo(riesgo.id); // puedes pasar el id
                                                }}
                                            >
                                                <FaPencilAlt style={{ color: "blue", cursor: "pointer" }} />
                                            </button>
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                e.stopPropagation();
                                                abrirPopupRiesgo(riesgo.code) 
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
                            <button  className="atras-button"onClick={irAPlantillas}>Regresar</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default RNF;