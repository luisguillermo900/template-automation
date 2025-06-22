import React, { useState, useCallback, useEffect} from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaFolder, FaPencilAlt, FaTrash } from "react-icons/fa";
import '../../../styles/stylesRoles.css'
import '../../../styles/styles.css';
import axios from 'axios';

const Roles = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const { orgcod, projcod } = location.state || {};
    
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchNombre, setSearchNombre] = useState("");
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const [error, setError] = useState(null);

    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState(null); 
    const [mensajePopup, setMensajePopup] = useState("");
    const [rolAEliminar, setRolAEliminar] = useState("");


    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const fetchRoles = useCallback(async () => {
    //Obtener o listar expertos de un proyecto
        try {
            const response = await axios.get(`${API_BASE_URL}/roles`);
            setRoles(response.data.data||[]);
        } catch (err) {
            setError(
                err.response
                ? err.response.data.error
                : "Error al obtener los roles"
            );
        }
    }, [API_BASE_URL]);
    
    useEffect(() => {
        
        fetchRoles();
        
    }, [fetchRoles]);

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

    const deleteRol = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/roles/${id}`);
            fetchRoles(); // Refrescar la lista de proyectos después de eliminar uno
            setMensajePopup("Rol eliminado correctamente.");
        } catch (err) {
            setMensajePopup("Error al eliminar el rol.");
            console.error(err);
        } finally {
            setTimeout(() => {
                cerrarPopup();
                setMensajePopup(""); 
            }, 1500);
        }
    };

    const handleSearch = async () => {
    setLoading(true);
    try {
        let response;
         if (searchNombre) {
                // Búsqueda por nombre
                response = await axios.get(`${API_BASE_URL}/roles/search`, {
                    params: { name: searchNombre }
                });
            } else {
                // Sin criterios de búsqueda
                response = await axios.get(`${API_BASE_URL}/roles`);
            }

        const filteredData = response.data.filter(rol => rol.code !== "ORG-MAIN");
        setRoles(filteredData);
        setError(null);
    } catch (err) {
        setError(err.response?.data?.error || "Error al buscar roles");
    } finally {
        setLoading(false);
    }
};



    const exportToExcel = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/roles/exports/excel`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Roles.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a Excel");
        }
    };

    const exportToPDF = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/roles/exports/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Roles.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a PDF");
        }
    };

    const irAMenuOrganizaciones = () => {
         navigate("/organizations");
    };
    const irAMenuProyecto = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`);
    };
    const irANuevoRol = () => {
        navigate("/nuevoRol",{
        state: {
            orgcod: orgcod,
            projcod: projcod
        }
    });
    };

    const irAEditarRol = (idRol,codeRol) => {
        navigate(`/editarRol/${codeRol}`,{
        state: {
            orgcod: orgcod,
            projcod: projcod,
            idRol,
            codeRol,
        }
    });
    };
    const irALogin = () => {
        navigate("/");
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };
  
    const abrirPopup = (id, name) => {
        setIdAEliminar(id);
        setRolAEliminar(name);
        setMostrarPopup(true);
    };
      
    const cerrarPopup = () => {
        setMostrarPopup(false);
    };
      
    const confirmarEliminacion = () => {
        if (idAEliminar) {
            deleteRol(idAEliminar);
        }
    };

    return (
        <div className="rol-container">
            <header className="ro-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                    <span>Roles</span>
                </div>
            </header>

            <div className="rolsub-container">

                <aside className="rol-sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="rol-lista">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="rol-profile-section" >
                        <div className="rol-profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin} className="rol-logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="rol-content">
                    <h2>ROLES</h2>
                    <section className="rol-organizations-section">

                        <div className="rol-search-section-bar">
                            <button onClick={irANuevoRol} className="rol-register-button">Nuevo Rol</button>
                            <div className="rol-sectionTextBuscar ">
                                <span class="message">
                                    <input className="rol-textBuscar" type="text" placeholder="Buscar" value={searchNombre}
                                    onChange={(e) => setSearchNombre(e.target.value)}
                                    style={{ width: "500px" }} size="50"/>
                                    <span class="tooltip-text">Filtrar información por nombre de rol</span>
                                </span>
                                <button className="rol-search-button" onClick={handleSearch}>Buscar</button>
                            </div>
                        </div>
                       


                        <table className="rol-centertabla">
                            <thead>
                                <tr>
                                    <th>Nombre del Rol</th>
                                    <th>Fecha de Creacion</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((rol) => (
                                    <tr key={rol.code}>
                                    <td>{rol.name}</td>
                                    <td>{new Date(rol.creationDate).toLocaleDateString()}</td>
                                    <td>
                                        <button className="botton-crud" onClick={() => irAEditarRol(rol.id,rol.code)}>
                                            <FaPencilAlt 
                                            style={{ color: "blue", cursor: "pointer" }}
                                            />
                                        </button>
                                        <button
                                            className="botton-crud"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Evita que el clic se propague al <tr>
                                                abrirPopup(rol.id, rol.name);// Llama a la función de eliminación
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
                                            <p>¿Está seguro de eliminar el rol <strong>{rolAEliminar}</strong> ? </p>
                                            <button onClick={confirmarEliminacion} className="si-button">Sí</button>
                                            <button onClick={cerrarPopup} className="no-button">No</button>
                                            </>
                                        )}
                                        </div>
                                    </div>
                        )}
                                               
                        <h4  className="rol-h4">Total de registros {roles.length}</h4>
                        <div className="rol-export-buttons">
                            <span class="message">
                                <button className="rol-export-button"onClick={exportToExcel}>Excel</button>
                                <span class="tooltip-text">Generar reporte de la lista de roles en Excel</span>
                            </span>
                            <span class="message">
                                <button className="rol-export-button"onClick={exportToPDF}>PDF</button>
                                <span class="tooltip-text">Generar reporte de la lista de roles en Pdf</span>
                            </span>
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

export default Roles;