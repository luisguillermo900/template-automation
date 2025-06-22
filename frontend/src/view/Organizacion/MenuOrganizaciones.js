// frontend/src/view/Organizacion/MenuOrganizaciones.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFolder, FaPencilAlt, FaTrash } from "react-icons/fa";
import '../../styles/stylesMenuOrganizaciones.css';
import '../../styles/styles.css';
import '../../styles/stylesEliminar.css';

const MenuOrganizaciones = () => {
    // Variables de enrutamiento
    const navigate = useNavigate();
    
    const irALogin = () => navigate("/");
    const irAListaProyectos = (orgcod) => navigate(`/organizations/${orgcod}/projects`);
    const irARegistroOrganizacion = () => navigate("/organizations/new");
    const irAEditarOrganizacion = (orgcod) => navigate(`/organizations/${orgcod}`);
   
    // Estados
    const [mainOrganization, setMainOrganization] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noResult, setNoResult] = useState(false);
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState(null); 
    const [mensajePopup, setMensajePopup] = useState("");
    const [codigoAEliminar, setCodigoAEliminar] = useState("");


    // Estados para búsqueda
    const [searchNombre, setSearchNombre] = useState('');
    const [searchYear, setSearchYear] = useState('');
    const [searchMonth, setSearchMonth] = useState('');

    // URL Base del API
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener la organización principal
                const mainOrgResponse = await axios.get(`${API_BASE_URL}/organizations/main`);
                setMainOrganization(mainOrgResponse.data);

                // Obtener todas las organizaciones excluyendo la principal
                const orgsResponse = await axios.get(`${API_BASE_URL}/organizations`);
                const filteredAndSortedOrgs = orgsResponse.data
                    .filter(org => org.code !== "ORG-MAIN")
                    .sort((a, b) => a.code.localeCompare(b.code)); // ¡Esta es la línea clave!

                setOrganizations(filteredAndSortedOrgs);
                setNoResult(false);
            } catch (err) {
                setError(err.response?.data?.error || "Error al cargar datos");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [API_BASE_URL]);

    // Función para eliminar una organización
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/organizations/${id}`);
            setOrganizations((prev) => prev.filter((org) => org.id !== id));
            setMensajePopup("Organización eliminada correctamente.");
        } catch (err) {
            setMensajePopup("Error al eliminar la organización.");
            console.error(err);
        } finally {
            setTimeout(() => {
                cerrarPopup();
                setMensajePopup(""); 
            }, 1500);
        }
    };

    // Función unificada de búsqueda
    const handleSearch = async () => {
        setLoading(true);
        try {
            let response;
            if (searchNombre) {
                // Búsqueda por nombre
                response = await axios.get(`${API_BASE_URL}/organizations/search`, {
                    params: { name: searchNombre }
                });
            } else if (searchYear || searchMonth) {
                // Búsqueda por fecha
                response = await axios.get(`${API_BASE_URL}/organizations/search/date`, {
                    params: {
                        year: searchYear,
                        month: searchMonth
                    }
                });
            } else {
                // Sin criterios de búsqueda
                response = await axios.get(`${API_BASE_URL}/organizations`);
            }
            
            const filteredData = response.data.filter(org => org.code !== "ORG-MAIN");
            setOrganizations(filteredData);
            setNoResult(filteredData.length === 0);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "Error al buscar organizaciones");
        } finally {
            setLoading(false);
        }
    };

    // Exportar a Excel
    const exportToExcel = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/exports/excel`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'organizaciones.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a Excel");
        }
    };

    // Exportar a PDF
    const exportToPDF = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/exports/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'organizaciones.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a PDF");
        }
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
                <span>Menú Principal /</span>
            </header>

            <div className="menusub-container">
                <aside className="sidebar">
                    <div className="bar-menu">
                        <p1>MENU PRINCIPAL</p1>
                    </div>
                    <div className="profile-section">
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin} className="logout-button">Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="main-content">
                    <h2>MENÚ PRINCIPAL - EMPRESAS</h2>
                    
                    {/* Sección Organización Principal */}
                    <section className="organization-section">
                        <h3>Organización Principal</h3>
                        {error ? (
                            <p>{error}</p>
                        ) : mainOrganization ? (
                            <div className="menu-tabla-center">
                                <table className="menu-centertabla">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th>Fecha creación</th>
                                            <th>Versión</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{mainOrganization.code}</td>
                                            <td>{mainOrganization.name}</td>
                                            <td>
                                                {new Date(mainOrganization.creationDate).toLocaleDateString()}
                                            </td>
                                            <td>{mainOrganization.version}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>Cargando...</p>
                        )}
                    </section>

                    {/* Sección Organizaciones */}
                    <section className="organizations-section">
                        <h3>Organizaciones</h3>

                        {/* Barra de búsqueda por nombre */}
                        <div className="sectionTextBuscar">
                            <span className="message">
                                <input
                                    className="textBuscar"
                                    type="text"
                                    size="125"
                                    placeholder="Buscar por nombre"
                                    value={searchNombre}
                                    onChange={(e) => setSearchNombre(e.target.value)}
                                />
                                <span className="tooltip-text">Realizar búsquedas por nombre de organizaciones y/o fecha de creación</span>
                            </span>
                            <button className="search-button" onClick={handleSearch}>Buscar</button>
                        </div>

                        {/* Barra de búsqueda por fecha */}
                        <div className="search-section-bar">
                            <button onClick={irARegistroOrganizacion} className="register-button">
                                Registrar Organización
                            </button>
                            <div className="searchbar">
                                <select
                                    className="year-input"
                                    value={searchYear}
                                    onChange={(e) => setSearchYear(e.target.value)}
                                >
                                    <option value="">AÑO</option>
                                    <option value="2021">2021</option>
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                </select>
                                <select
                                    className="month-input"
                                    value={searchMonth}
                                    onChange={(e) => setSearchMonth(e.target.value)}
                                >
                                    <option value="">MES</option>
                                    <option value="01">Enero</option>
                                    <option value="02">Febrero</option>
                                    <option value="03">Marzo</option>
                                    <option value="04">Abril</option>
                                    <option value="05">Mayo</option>
                                    <option value="06">Junio</option>
                                    <option value="07">Julio</option>
                                    <option value="08">Agosto</option>
                                    <option value="09">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                                </select>
                            </div>
                        </div>

                        {/* Mensajes de error y resultados */}
                        {error && <p className="error-message">{error}</p>}
                        {!error && noResult && (
                            <div className="no-result-message">
                                <p>
                                    No se encontraron organizaciones
                                    {searchNombre && ` con el nombre "${searchNombre}"`}
                                    {searchYear && ` del año ${searchYear}`}
                                    {searchMonth && ` del mes ${searchMonth}`}
                                </p>
                            </div>
                        )}

                        {/* Tabla de Organizaciones */}
                        {!error && !noResult && (
                            <div className="menu-tabla-center">
                                <table className="menu-centertabla">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th>Fecha creación</th>
                                            <th>Versión</th>
                                            <th>Opciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {organizations.map((org) => (
                                            <tr key={org.code} onClick={() => irAListaProyectos(org.code)}>
                                            <td>{org.code}</td>
                                                <td>{org.name}</td>
                                                <td>
                                                    {new Date(org.creationDate).toLocaleDateString()}
                                                </td>
                                                <td>{org.version}</td>
                                                <td>
                                                    <button
                                                        className="botton-crud"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            irAEditarOrganizacion(org.code);
                                                        }}
                                                    >
                                                        <FaPencilAlt style={{ color: "blue", cursor: "pointer" }} />
                                                    </button>
                                                    <button
                                                        className="botton-crud"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            abrirPopup(org.id, org.code);
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
                                            <p>¿Está seguro de eliminar la organización <strong>{codigoAEliminar}</strong> ? </p>
                                            <button onClick={confirmarEliminacion} className="si-button">Sí</button>
                                            <button onClick={cerrarPopup} className="no-button">No</button>
                                            </>
                                        )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Contador y botones de exportación */}
                        <h4>Total de registros {organizations.length}</h4>
                        <div className="export-buttons">
                            <button className="export-button" onClick={exportToExcel}>Excel</button>
                            <button className="export-button" onClick={exportToPDF}>PDF</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default MenuOrganizaciones;