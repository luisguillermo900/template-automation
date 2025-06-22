// frontend/src/view/RegistroOrganizacion.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../../styles/stylesNuevaFuente.css';
import '../../../styles/styles.css';
import axios from "axios";

const NuevaFuente = () => {
    const navigate = useNavigate();
    const hasFetched = useRef(false);
    // Obtener datos del proyecto del URL
    const { projcod, orgcod } = useParams();

    const [code, setCodigoFuente] = useState("");
    const [version, setVersionFuente] = useState("00.01");
    const [creationDate, setFechaCreacion] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
    );
    const [modificationDate, setFechaModificacion] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
    );


    // Datos controlados por el usuario
    const [name, setNombre] = useState("");
    const [status, setEstado] = useState("");
    const [comment, setComentario] = useState("");
    //Estados para manejar errores
    const [error, setError] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    // Obtener el siguiente código de fuente
    useEffect(() => {
        if (hasFetched.current) return; // Previene segunda ejecución
        hasFetched.current = true;
        const fetchNextCodigoFuente = async () => {
            try {

                // Llamar al endpoint usando parámetros de consulta
                const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/next-code`);

                // Asignar el valor recibido al estado
                setCodigoFuente(response.data.nextCode || "FUE-001");
            } catch (err) {
                console.error("Error al obtener el siguiente código de experto:", err);
                setError("No se pudo cargar el siguiente código del experto.");
            }
        };

        fetchNextCodigoFuente();
    }, [API_BASE_URL, orgcod, projcod]);

    //Registrar Nueva fuente
    const registrarFuente = async (e) => {
        e.preventDefault();
        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources`, {
                name,
                comment, // Asumiendo que 'comentario' es un campo adicional
                status, // Asumiendo que 'estado' es otro campo
            });

            // Redirigir a la página de expertos o realizar otra acción
            irAFuentes();

        } catch (err) {
            console.error("Error al registrar el experto:", err);
            setError("No se pudo registrar al experto. Inténtalo de nuevo.");
        }
    };

    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };
    const irAFuentes = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/sources`);
    };
    const irAMenuProyecto = (code) => {
        //navigate(`/menuProyecto?procod=${code}`);
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`);
    };
    const irAPlantillas = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/plantillas`);
    };




    return (
        <div className="ro-container">
            <header className="ro-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span onClick={irAFuentes}>Fuentes /</span>
                    <span>Nueva Fuente</span>
                </div>
            </header>

            <div className="rosub-container">
                <aside className="sidebar">
                    <div className="bar-ro">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>
                    <div className="profile-section">
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={() => navigate("/")} className="logout-button">Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="ro-content">
                    <h2>NUEVA FUENTE</h2>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo">Código </label>
                            <label className="ro-version">Versión</label>
                            <label className="ro-Fecha">Fecha</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="text" className="inputBloq-field" value={code} readOnly size="45" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input type="text" className="inputBloq-field" value={version} readOnly size="45" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input type="text" className="inputBloq-field" value={creationDate} readOnly size="45" />
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4 >Nombre* </h4> <br />
                                {/*<h4>Autores de la Fuente* </h4>*/}
                            </div>
                            <div className="ro-fiel-vers">
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={name} onChange={(e) => setNombre(e.target.value)} size="110" />
                                    <span class="tooltip-text"> Ingresar el nombre de la fuente </span>
                                </span><br />
                                {/*<span class="message">
                                    <input className="inputautores-field"  type="text" size="110" style={{ height: '50px' }} />
                                    <span class="tooltip-text"> Ingresar los autores de la fuente </span>
                                </span>*/}
                            </div>

                        </div>

                    </section>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo">Fecha Fuente* </label>
                            {/*<label className="ro-version">Autor de plantilla </label>*/}
                            <label className="ro-Fecha">Estado* </label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <span class="message">
                                    <input type="text" className="inputfechafuen-field" size="45" />
                                    <span class="tooltip-text"> Ingresar la fecha de la fuente </span>
                                </span>

                            </div>
                            {/*<div className="ro-fiel-vers">
                                <span class="message">
                                    <input type="text" className="inputBloq-field"  readOnly size="30" />
                                    <span class="tooltip-text"> Codigo del autor de la fuente </span>
                                </span>
                                
                            </div>*/}
                            <div className="ro-fiel-fecha">
                                <select id="estado" name="estado" required>
                                    <option value="">Seleccione un estado</option>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                    <option value="pendiente">Pendiente</option>
                                </select>
                            </div>
                        </div>
                    </section>
                    <section className="ro-organizations-section">
                        <h3>Comentario*</h3>
                        <div className="input-text">
                            <textarea className="input-fieldtext" rows="3" placeholder="Añadir comentarios sobre la fuente"></textarea>
                        </div>

                        <div className="ro-buttons">
                            <button onClick={irAFuentes} className="ro-button">Cancelar</button>
                            <button onClick={registrarFuente} className="ro-button">Registrar</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevaFuente;
