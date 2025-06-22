import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaFolder, FaPencilAlt, FaTrash} from "react-icons/fa";
import '../../../styles/stylesPlantillasPrincipales.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';


const PruebasSoftware = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {orgcod, projcod, expcod} = useParams(); // Asegúrate de tener expertId en la ruta
    const { proid } = location.state || {};

    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
    };
    const irAVerPS = () => {
        navigate("/verPrueba");
    };
    const irANuevaPS = () => {
        navigate("/nuevaPS");
    };
    const irAEditarPS = () => {
        navigate("/editarPS");
    };
    
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects` );
    };
    const irAMenuProyecto = (code) => {
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

    const [mostrarPopup, setMostrarPopup] = useState(false);
  
    const abrirPopup = () => {
      setMostrarPopup(true);
    };
  
    const cerrarPopup = () => {
      setMostrarPopup(false);
    };
  
    const eliminarPS = () => {
      console.log("Prueba de Software eliminada");
      cerrarPopup();
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
                    <span>Pruebas de Software</span>
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
                    <h2>PRUEBAS DE SOFTWARE</h2>
                    <button onClick={irANuevaPS} className="nuevo-pp-button">Nueva Prueba</button>
                    <section className="pp-section">
                        <h3>Pruebas exitosas</h3>

                        <div className="search-section-bar">
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por código, nombre y fecha de la prueba exitosa</span>
                                </span>
                                
                                <button className="search-button">Buscar</button>
                            </div>
                        </div>

                        <div className="menu-tabla-center">
                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Versión</th>
                                        <th>Fecha creación</th>
                                        <th>Fecha modificación</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>PS-0001</td>
                                        <td>Ricardo Fabrizio C.R.</td>
                                        <td>00.01</td>
                                        <td>23/10/2023</td>
                                        <td>26/10/2023</td>
                                        <td>
                                            <button className="botton-crud" onClick={irAVerPS}><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={irAEditarPS}><FaPencilAlt style={{ color: "blue", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={abrirPopup}><FaTrash style={{ color: "red", cursor: "pointer" }} /></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>PS-0003</td>
                                        <td>Edward Vicente Z.C.</td>
                                        <td>00.01</td>
                                        <td>23/10/2023</td>
                                        <td>26/10/2023</td>
                                        <td>
                                            <button className="botton-crud" onClick={irAVerPS}><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={irAEditarPS}><FaPencilAlt style={{ color: "blue", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={abrirPopup}><FaTrash style={{ color: "red", cursor: "pointer" }} /></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {mostrarPopup && (
                                <div className="popup-overlay">
                                <div className="popup-content">
                                    <p>¿Está seguro de eliminar esta Prueba?</p>
                                    <button onClick={eliminarPS} className="si-button">
                                    Sí
                                    </button>
                                    <button onClick={cerrarPopup} className="no-button">
                                    No
                                    </button>
                                </div>
                                </div>
                            )}
                            
                        </div>

                        <h4>Total de registros 2</h4>
                            <div className="export-buttons">
                                <span class="message">
                                    <button className="export-button">Excel</button>
                                    <span class="tooltip-text">Generar reporte de las pruebas exitosas en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button">PDF</button>
                                    <span class="tooltip-text">Generar reporte de las pruebas exitosas en Pdf</span>
                                </span>
                            </div>

                    </section>
                    <section className="pp-section">
                        <h3>Pruebas no exitosas</h3>
                        <div className="search-section-bar">
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por código, nombre o fecha de la prueba fallida</span>
                                </span>
                                <button className="search-button">Buscar</button>
                            </div>
                        </div>

                        <div className="menu-tabla-center">
                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Versión</th>
                                        <th>Fecha creación</th>
                                        <th>Fecha modificación</th>
                                    </tr>
                                </thead>
                                <tbody onClick={irAVerPS}>
                                    <tr>
                                        <td>PS-0004</td>
                                        <td>Ricardo Fabrizio C.R.</td>
                                        <td>00.02</td>
                                        <td>23/10/2023</td>
                                        <td>26/10/2023</td>
                                    </tr>
                                    <tr>
                                        <td>PS-0002</td>
                                        <td>Edward Vicente Z.C.</td>
                                        <td>00.05</td>
                                        <td>23/10/2023</td>
                                        <td>26/10/2023</td>
                                    </tr>
                                </tbody>

                            </table>

                        </div>
                        <h4>Total de registros 2</h4>
                            <div className="export-buttons">
                                <span class="message">
                                    <button className="export-button">Excel</button>
                                    <span class="tooltip-text">Generar reporte de las pruebas no exitosas en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button">PDF</button>
                                    <span class="tooltip-text">Generar reporte de las pruebas no exitosas en Pdf</span>
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

export default PruebasSoftware;