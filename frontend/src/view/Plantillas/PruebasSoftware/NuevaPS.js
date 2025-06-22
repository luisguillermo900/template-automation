import React from "react";
import { useNavigate } from "react-router-dom";
import '../../../styles/stylesNuevaIlacion.css';
import '../../../styles/styles.css';

const NuevaPS = () => {

    const navigate = useNavigate();

    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
    };
    const irALogin = () => {
        navigate("/");
    };
    const irAListaProyecto = () => {
        navigate("/listaProyectos");
    };
    const irAMenuProyecto = () => {
        navigate("/menuProyecto");
    };
    const irAPlantillas = () => {
        navigate("/plantillas");
    };
    const irAPruebasSoftware = () => {
        navigate("/PruebasSoftware");
    };

    
    return (
        <div className="ne-container">
            <header className="ne-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span onClick={irAPruebasSoftware}>Pruebas de Software/</span>
                    <span>Nueva Prueba</span>
                </div>
            </header>

            <div className="nesub-container">

                <aside className="sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="bar-ne">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin}className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="ne-content">
                    <h2>PRUEBAS DE SOFTWARE (PS)</h2>
                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código* </label>
                            <label className="ne-label">Version del software*</label>
                            <label className="ne-label">Fecha de la prueba*</label>
                        </h3>
                        <div className="ne-input-container">
                            <input disabled type="text" className="ne-input" value="PS-0001" readOnly />
                            <input disabled type="text" className="ne-input" value="00.00" readOnly />
                            <input disabled type="text" className="ne-input" value="23/10/23" readOnly />
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre de la PS*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input className="input-text" type="text" placeholder="Nombre de la prueba a realizarse" size="100" />
                                    <span className="tooltip-text">Ingresar el nombre de la prueba a realizarse</span>
                                </span>
                            </div>
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Descripción*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input className="input-text" type="text" size="100" />
                                    <span className="tooltip-text">Ingresar detalles de la prueba y entorno bajo el que se va a realizar</span>
                                </span>
                            </div>
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Objetivos de las pruebas*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input className="input-text" type="text" size="100" />
                                    <span className="tooltip-text">Ingresar detalladamente los objetivos de la prueba a realizase, puede incluir que espera encontrar o algunas situaciones de decisión</span>
                                </span>
                            </div>
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Autor/es de la PS*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input className="input-text" type="text" size="100" />
                                    <span className="tooltip-text">Nombrar a los autores encargados de realizar esta prueba</span>
                                </span>
                            </div>
                        </div>

                    </section>

                    <section className="ne-organization">
                        <h3>Casos de Prueba</h3>
                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre de la PS*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input className="input-text" type="text" placeholder="Nombre de la prueba a realizarse" size="100" />
                                    <span className="tooltip-text">Ingresar el nombre de la prueba a realizarse</span>
                                </span>
                            </div>
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Descripción*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input className="input-text" type="text" size="100" />
                                    <span className="tooltip-text">Ingresar detalles de la prueba y entorno bajo el que se va a realizar</span>
                                </span>
                            </div>
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Objetivos de las pruebas*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input className="input-text" type="text" size="100" />
                                    <span className="tooltip-text">Ingresar detalladamente los objetivos de la prueba a realizase, puede incluir que espera encontrar o algunas situaciones de decisión</span>
                                </span>
                            </div>
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Autor/es de la PS*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input className="input-text" type="text" size="100" />
                                    <span className="tooltip-text">Nombrar a los autores encargados de realizar esta prueba</span>
                                </span>
                            </div>
                        </div>

                        <div className="ne-buttons">
                            <button onClick={irAPruebasSoftware} className="ne-button" size="100">Cancelar</button>
                            <button onClick={irAPruebasSoftware} className="ne-button" size="100">Crear Prueba</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevaPS;
