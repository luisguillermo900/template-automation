import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import '../../../styles/stylesNuevoRol.css';
import '../../../styles/styles.css';
import axios from "axios";

const NuevoRol = () => {

    const navigate = useNavigate();
    
    const location = useLocation();
    const { orgcod, projcod } = location.state || {};

    const [name, setName] = useState("");
    const [creationDate, setCreationDate] = useState(
            new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    const [comments, setComments] = useState("");
    const [error, setError]=useState(null);
    const [errorComentarios, setErrorComentarios] = useState("");
    const [errorRol, setErrorRol] = useState("");
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    const registrarRol = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
        setError("El nombre del rol es obligatorio.");
        return;
        }

        if (name.length > 60) {
        setError("El nombre del rol no debe exceder los 60 caracteres.");
        return;
        }

        if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/.test(name)) {
        setError("El nombre del rol contiene caracteres no permitidos.");
        return;
        }
        if (comments && !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,\-()¿?!¡"']*$/.test(comments)) {
        setError("Los comentarios contienen caracteres no permitidos.");
        return;
        }

        if (comments.length > 300) {
        setError("Los comentarios no deben exceder los 300 caracteres.");
        return;
        }
        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/roles`, {
                name,
                comments,
            });
            
            // Redirigir a la página de expertos o realizar otra acción
            irARoles();
    
        } catch (err) {
            console.error("Error al registrar el experto:", err);
            setError("No se pudo registrar al experto. Inténtalo de nuevo.");
        }
    };

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


    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };

    const irARoles = () => {
        navigate("/roles", {
            state: {
                orgcod: orgcod,
                projcod: projcod
            }
        }
    )};
    
    const irALogin = () => {
        navigate("/");
    };
    const irAMenuProyecto = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`);
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };


    return (
        <div className="rr-container">
            <header className="rr-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                    <span onClick={irARoles}>Roles /</span>
                    <span>Nuevo rol</span>
                </div>
            </header>

            <div className="rrsub-container">

                <aside className="sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="bar-rr">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin}className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="rr-content">
                    <h2>NUEVO ROL</h2>
                  
                    <section className="rr-organization-section">
                        <h3>Informacion del Rol</h3>
                        <div className="rr-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre del Rol</h4>
                                <span class="message">
                                    <input
                                        type="text"
                                        className="inputnombre-field"
                                        value={name}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 60) {
                                            setName(value);
                                            if (/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/.test(value)) {
                                                setErrorRol("");
                                            } else {
                                                setErrorRol("Carácter(es) no permitidos, excepto (, . - _ & /).");
                                            }
                                            } else {
                                            setErrorRol("Máximo 60 caracteres.");
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!name.trim()) {
                                            setErrorRol("El nombre del rol es obligatorio.");
                                            }
                                        }}
                                        maxLength={60}
                                        size="100"
                                        />
                                        {errorRol && <p style={{ color: 'red', margin: 0 }}>{errorRol}</p>}
                                    <span class="tooltip-text">Nombre del rol que se creará para el proyecto</span>
                                </span>
                            </div>
                            <div className="fiel-vers">
                                <h4>Fecha de Creacion</h4>
                                <input disabled type="text" className="inputBloq-field"  value={creationDate} readOnly size="50" />
                            </div>
                        </div>

                    </section>

                    <section className="rr-organizations-section">
                        <h3>Comentario</h3>

                        <div className="input-text">
                            <textarea
                            className="input-fieldtext"
                            name="comments"
                            value={comments}
                            onChange={(e) => {
                                const value = e.target.value;
                                const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,\-()¿?!¡"']*$/;

                                if (value.length <= 300) {
                                // Validar que no use caracteres especiales
                                if (permitido.test(value)) {
                                    setComments(value);
                                    setErrorComentarios(""); // limpia error si es válido
                                } else {
                                    setErrorComentarios("Solo se permiten letras, números y puntuación básica.");
                                }
                                }
                            }}
                            onBlur={() => {
                                if (comments && !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,\-()¿?!¡"']*$/.test(comments)) {
                                setErrorComentarios("Los comentarios contienen caracteres no permitidos.");
                                } else if (comments.length > 300) {
                                setErrorComentarios("Máximo 300 caracteres.");
                                } else {
                                setErrorComentarios("");
                                }
                            }}
                            placeholder="Comentarios del rol"
                            rows="3"
                            maxLength={300}
                            />
                            {errorComentarios && (
                            <p style={{ color: 'red', margin: 0 }}>{errorComentarios}</p>
                            )}
                            <p style={{ fontSize: '0.8rem', textAlign: 'right' }}>
                            {comments.length}/300
                            </p>
                        </div>

                        <div className="rr-buttons">
                            <button onClick={irARoles} className="rp-button" size="50">Cancelar</button>
                            <button onClick={registrarRol} className="rp-button" size="50">Crear</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </section>




                </main>
            </div>
        </div>
    );
};

export default NuevoRol;
