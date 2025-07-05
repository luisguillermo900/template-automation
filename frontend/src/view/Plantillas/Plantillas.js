import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../../styles/stylesPlantillas.css';
import '../../styles/styles.css';
import axios from 'axios';

const Plantillas = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { projcod,orgcod } = useParams();
    const { proid } = location.state || {}; 
    const [educciones, setEducciones] = useState([]);
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    //Función para obtener lista de educciones, ilaciones y especificaciones
    useEffect(() => {
        async function fetchData() {
            try {
                const resEducciones = await fetch(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones`);
                const educcionesData = await resEducciones.json();

                const educcionesConIlacionesYEspecificaciones = await Promise.all(
                    educcionesData.map(async (educcion) => {
                        const resIlaciones = await fetch(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educcion.code}/ilaciones`);
                        const { ilaciones } = await resIlaciones.json();

                        const ilacionesConEspecificaciones = await Promise.all(
                            ilaciones.map(async (ilacion) => {
                                const resSpecs = await fetch(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educcion.code}/ilaciones/${ilacion.code}/specifications`);
                                const result = await resSpecs.json();
                                const specifications = result;
                                return { ...ilacion, specifications };
                            })
                        );

                        return { ...educcion, ilaciones: ilacionesConEspecificaciones };
                    })
                );

                setEducciones(educcionesConIlacionesYEspecificaciones);
            } catch (error) {
                console.error('Error al cargar trazabilidad:', error);
            }
        }

        fetchData();
    }, [orgcod, projcod]);

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

    //Función para exportar trazabilidad en Pdf
    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.text("Trazabilidad de Requisitos", 14, 10);

        const rows = [];

        educciones.forEach((educcion) => {
            if (educcion.ilaciones.length > 0) {
            educcion.ilaciones.forEach((ilacion) => {
                if (ilacion.specifications?.length > 0) {
                ilacion.specifications.forEach((spec) => {
                    rows.push([educcion.code, ilacion.code, spec.code]);
                });
                } else {
                rows.push([educcion.code, ilacion.code, "Sin especificaciones"]);
                }
            });
            } else {
            rows.push([educcion.code, "Sin ilaciones", "-"]);
            }
        });

        autoTable(doc, {
            head: [['EDUCCIÓN', 'ILACIÓN', 'ESPECIFICACIÓN']],
            body: rows,
        });

        doc.save('trazabilidad.pdf');
    };


    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
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
    const irAEduccion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion`, {
            state: {
            proid:proid
        }
    });
    };
    const irAArtefactos = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/artifacts`, {
            state: {
            proid:proid
        }
    });
    };
    const irAActores = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/actors`);
    };

    const irARequerimientosNoFuncionales = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/rnf`,{
        state: {
            proid:proid
        }
    });
    };

    const irAExpertos = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/experts`, {
            state: {
            proid:proid
        }
    });
    };

    const irAFuentes = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/sources`, {
            state: {
            proid:proid
        }
    });
    };

    const irAMetricas = () => {
        navigate("/metricas");
    };

    const irAPruebasDeSoftware = () => {
        navigate("/pruebasSoftware");
    };


    return (
        <div className="menu-container">
            <header className="menu-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                    <span>Plantillas</span>
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
                        <button classNme="button-sesion" onClick={irALogin} className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="main-content">
                    <h2>PLANTILLAS</h2>
                    <section className="plantillas-section">
                        <h3>Plantillas Principales</h3>
                        <div className="button-container-plantillas">
                            <div>
                                <button onClick={irAEduccion} className="educcion-button">EDUCCIÓN, ILACIÓN Y ESPECIFICACIÓN</button>
                                <p className="boton-text">    Gestión de riesgos    </p>
                            </div>
                            <div>
                                <button onClick={irAArtefactos} className="artefactos-button">ARTEFACTOS</button>
                            </div>
                        </div>

                    </section>
                    <section className="trazabilidad-section">
                        <h3>Trazabilidad</h3>
                        <div className="menu-tabla-center">
                            <button className="logout-button" onClick={exportarPDF}>Exportar PDF</button>


                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>EDUCCIÓN</th>
                                        <th>ILACIÓN</th>
                                        <th>ESPECIFICACIÓN</th>
                                        {/* <th>OTROS ARTEFACTOS</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {educciones.map((educcion) => {
                                        const totalIlaciones = educcion.ilaciones.length;

                                        return totalIlaciones > 0 ? (
                                        educcion.ilaciones.map((ilacion, i) => {
                                            const totalSpecs = ilacion.specifications?.length || 0;

                                            return totalSpecs > 0 ? (
                                            ilacion.specifications.map((spec, j) => (
                                                <tr key={`${educcion.code}-${ilacion.code}-${spec.code}`}>
                                                {i === 0 && j === 0 && (
                                                    <td rowSpan={educcion.ilaciones.reduce((acc, il) => acc + (il.specifications?.length || 1), 0)}>
                                                    {educcion.code}
                                                    </td>
                                                )}
                                                {j === 0 && (
                                                    <td rowSpan={totalSpecs}>{ilacion.code}</td>
                                                )}
                                                <td>{spec.code}</td>
                                                {/*<td>-</td>*/}
                                                </tr>
                                            ))
                                            ) : (
                                            <tr key={`${educcion.code}-${ilacion.code}`}>
                                                {i === 0 && (
                                                <td rowSpan={totalIlaciones}>{educcion.code}</td>
                                                )}
                                                <td>{ilacion.code}</td>
                                                <td colSpan={2}>Sin especificaciones</td>
                                            </tr>
                                            );
                                        })
                                        ) : (
                                        <tr key={educcion.code}>
                                            <td>{educcion.code}</td>
                                            <td colSpan={3}>Sin ilaciones</td>
                                        </tr>
                                        );
                                    })}
                                    </tbody>

                            </table>

                        </div>
                    </section>

                    <section className="plantillas-section">
                        <h3>Plantillas Secundarias</h3>

                        <div class="button-container-plantillas">
                            <div>
                                <button onClick={irAActores} className="actores-button">ACTORES</button>
                            </div>
                            <div>
                                <button onClick={irARequerimientosNoFuncionales} className="req-button">REQUERIMIENTOS NO FUNCIONALES</button>
                                <p className="boton-text">Gestión de riesgos</p>
                            </div>
                            <div>
                                <button onClick={irAExpertos} className="expertos-button">EXPERTOS</button>
                            </div>
                            <div>
                                <button onClick={irAFuentes} className="fuentes-button">FUENTES</button>
                            </div>
                            {/*
                            <div>
                                <button onClick={irAMetricas} className="metricas-button">MÉTRICAS</button>
                                <p className="boton-text">Educción, Ilación, Especificación</p>
                            </div>
                            <div>
                                <button onClick={irAPruebasDeSoftware} className="pruebas-button">PRUEBAS DE SOFTWARE</button>
                                <p className="boton-text">Especificación</p>
                            </div>
                            */}
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
};

export default Plantillas;