import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import '../../styles/stylesMenuProyecto.css';
import '../../styles/styles.css';
import axios from "axios";

const MenuProyecto = () => {
    const navigate = useNavigate();
    const { orgcod, projcod } = useParams();
    const location = useLocation();
    const { proid } = location.state || {};

    const [proyecto, setProyecto] = useState({});
    const [codigoAutor, setCodigoAutor] = useState("");
    const [resultados, setResultados] = useState([]);
    const [mensaje, setMensaje] = useState("");

    // URL Base del API
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    useEffect(() => {
        const obtenerProyecto = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${orgcod}`);
                setProyecto(response.data);
            } catch (error) {
                console.log("Error al obtener el proyecto:", error);
            }
        };
        obtenerProyecto();
    }, [ projcod]);

    const descargarCatalogo = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/requirements-catalog`, {
            method: 'GET',
            });

            if (!response.ok) {
            throw new Error('No se pudo descargar el catálogo');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'catalogo_requisitos.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error al descargar el catálogo:', error);
        }
    };


    const irALogin = () => {
        navigate("/");
    };

    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };

    const irAActaAceptacion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/actaAceptacion`,{
        state: {
            proid:proid
        }
    });
    };

    const irAAutores = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/authors`);
    };

    const irAEntrevistas = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/entrevistas`,{
        state: {
            proid:proid
        }
    });
    };

    const irARoles = () => {
    navigate("/roles", {
        state: {
            orgcod: orgcod,
            projcod: projcod
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

    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };

    return (
        <div className="menu-container">
            <header className="menu-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span>Sistema Inventario</span>
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
                    <h2>MOCAR COMPANY - SISTEMA DE INVENTARIO</h2>
                    <section className="destacados-section">
                        <h3>Destacados</h3>
                        <div class="boton-container">
                            <button onClick={irAActaAceptacion} className="acta-aceptacion-button">ACTA DE ACEPTACIÓN</button>
                            <button onClick={irAAutores} className="autores-button">AUTORES</button>
                            <button onClick={irAEntrevistas} className="entrevistas-button">ENTREVISTAS</button>
                            <button onClick={irARoles} className="roles-button">ROLES</button>
                            <button onClick={irAPlantillas} className="plantillas-button">PLANTILLAS</button>
                        </div>

                    </section>
                    <section className="avance-section">
                        <h3>Avance del Proyecto</h3>
                        <div class="boton-container">
                            <button className="catalogo-button"  onClick={descargarCatalogo}>DESCARGAR CATÁLOGO DE REQUISITOS</button>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
};

export default MenuProyecto