import React from "react";
import { useNavigate ,useParams } from "react-router-dom";
import '../../../styles/stylesRiesgo.css';
import '../../../styles/styles.css';

const EditarRiesgo = () => {

    const navigate = useNavigate();
    const { orgcod, projcod } = useParams();
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irALogin = () => {
        navigate("/");
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };
    const irAMenuProyecto = () => {
        navigate(`/projects/${projcod}/menuProyecto`);
    };
    const irAPlantillas = () => {
        navigate(`/projects/${projcod}/plantillas`);
    };
    const irAEduccion = () => {
        navigate("/educcion");
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
                    <span onClick={irAEduccion}>Educcion /</span>
                    <span>Editar Riesgo</span>
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
                    <h2>EDITAR RIESGO</h2>
                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código de Registro*</label>
                            <label className="ne-label">Version*</label>
                            <label className="ne-label">Responsble*</label>
                        </h3>
                        <div className="ne-input-container">
                            <input disabled type="text" className="ne-input" value="EDU-0001" readOnly />
                            <input disabled type="text" className="ne-input" value="00.01" readOnly />
                            <input disabled type="text" className="ne-input" value="AUT-0000" readOnly />
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>RIESGO IDENTIFICADO*</h4>
                            </div>
                            <div className="fiel-vers">
                            <textarea className="input-fieldtext" rows="3" placeholder="Descripción del riesgo identificado."></textarea>
                            </div>
                        </div>
                    </section>

                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Probabilidad (Cualitativa)</label>
                            <label className="ne-label">Probabilidad*</label>
                            <label className="ne-label">Impacto*</label>
                        </h3>
                        <div className="ne-input-container">
                            <select
                                className="ne-input estado-input"
                                onChange={(e) => {
                                    const selectedProbabilidadCualitativa = e.target.value;
                                    console.log("Probabilidad cualitativa:", selectedProbabilidadCualitativa);
                                }}
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="leve">Leve</option>
                                <option value="moderada">Moderada</option>
                                <option value="alta">Alta</option>
                            </select>
                            <select
                                className="ne-input estado-input"
                                onChange={(e) => {
                                    const selectedProbabilidad = e.target.value;
                                    console.log("Probabilidad:", selectedProbabilidad);
                                }}
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="10">10%</option>
                                <option value="15">15%</option>
                                <option value="20">20%</option>
                                <option value="25">25%</option>
                            </select>
                            <select
                                className="ne-input estado-input"
                                onChange={(e) => {
                                    const selectedImpacto = e.target.value;
                                    console.log("Impacto:", selectedImpacto);
                                }}
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="10">1 dia</option>
                                <option value="15">7 dias</option>
                                <option value="20">15 dias</option>
                                <option value="25">1 mes</option>
                            </select>
                        </div>
                    </section>

                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Indice P-I</label>
                            <label className="ne-label">Costo de error*</label>
                            <label className="ne-label">Exposicion al riesgo</label>
                        </h3>
                        <div className="ne-input-container">
                            <input disabled type="text" className="ne-input" value="###%" readOnly />
                            <span className="message">
                                    <input className="input-text" type="text" placeholder="" size="80" />
                                    <span className="tooltip-text">Costo del error en Dólares</span>
                            </span>
                            <input disabled type="text" className="ne-input" value="###%" readOnly />
                        </div>
                    </section>

                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Estado</label>
                            <label className="ne-label">Código artefacto*</label>
                        </h3>
                        <div className="ne-input-container">
                            <select
                                className="ne-input estado-input"
                                onChange={(e) => {
                                    const selectedEstado = e.target.value;
                                    console.log("Estado:", selectedEstado);
                                }}
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="identificado">Identificado</option>
                                <option value="evaluado">Evaluado</option>
                                <option value="monitoreado">Monitoreado</option>
                                <option value="activo">Activo</option>
                                <option value="mitigado">Mitigado</option>
                            </select>
                            <select
                                className="ne-input estado-input"
                                onChange={(e) => {
                                    const selectedCodigoArtefacto = e.target.value;
                                    console.log("Codigo artefacto:", selectedCodigoArtefacto);
                                }}
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="art-0001">ART-0001</option>
                                <option value="art-0002">ART-0002</option>
                                <option value="art-0003">ART-0003</option>
                                <option value="art-0004">ART-0004</option>
                            </select>

                        </div>
                            <div className="ne-cod-vers">
                                <div className="fiel-cod">
                                    <h4>PLAN MITIGACIÓN*</h4>
                                </div>
                                <div className="fiel-vers">
                                <textarea className="input-fieldtext" rows="3" placeholder="Plan de actividades para resolver el asunto o problema pendiente."></textarea>
                                </div>
                            </div>

                            <div className="ne-buttons">
                            <button onClick={irAEduccion} className="ne-button" size="50">Cancelar</button>
                            <button onClick={irAEduccion} className="ne-button" size="50">Guardar cambios</button>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
};

export default EditarRiesgo;
