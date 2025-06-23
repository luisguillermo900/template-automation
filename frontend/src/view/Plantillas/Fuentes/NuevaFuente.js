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
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

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
    const [sourceDate, setSourceDate] = useState("");
    //Estados para manejar errores
    const [error, setError] = useState(null);
    const [errorName, setErrorName] = useState("");
    const [errorComment, setErrorComment] = useState("");
    const [errorSourceDate, setErrorSourceDate] = useState("");
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

    //Registrar Nueva fuente
    const registrarFuente = async (e) => {
        
        e.preventDefault();

        if (!name) {
            setErrorName("El nombre es obligatorio.");
            return;
        }

        if (!sourceDate) {
        setErrorSourceDate("Debe seleccionar una fecha.");
        return;
    }
        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources`, {
                name,
                comment,
                sourceDate, 
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
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
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
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código  </label>
                            <label className="ne-label">Version</label>
                            <label className="ne-label">Fecha</label>
                        </h3>
                        <div className="ne-input-container">
                            <input disabled type="text" className="ne-input" value={code} readOnly />
                            <input disabled type="text" className="ne-input" value={version} readOnly />
                            <input disabled type="text" className="ne-input" value={creationDate} readOnly />
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4 >Nombre* </h4> <br />
                                {/*<h4>Autores de la Fuente* </h4>*/}
                            </div>
                            <div className="ro-fiel-vers">
                                <span class="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Nombre de la fuente"
                                    value={name}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 50) {
                                        setNombre(value);
                                        setErrorName(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorName("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!name.trim()) {
                                        setErrorName("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={50}
                                    size="100"
                                    />
                                    {errorName && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorName}</p>)}
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
                                <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <label className="ro-codigo" style={{ width: '48%' }}>Fecha Fuente*</label>
                                    <label className="ro-Fecha" style={{ width: '48%' }}>Estado*</label>
                                </h3>

                                <div className="ro-cod-vers" style={{ display: 'flex', justifyContent: 'space-between', gap: '4%' }}>
                                    {/* Fecha Fuente */}
                                    <div className="ro-fiel-cod" style={{ width: '48%' }}>
                                        <span className="message">
                                            <input 
                                            type="date" 
                                            className="inputfechafuen-field" 
                                            value={sourceDate}
                                            onChange={(e) => {
                                                setSourceDate(e.target.value);
                                                setErrorSourceDate(""); // Limpiar error si selecciona fecha
                                            }}
                                            onBlur={() => {
                                                if (!sourceDate) {
                                                    setErrorSourceDate("Debe seleccionar una fecha.");
                                                }
                                            }}
                                            required
                                            style={{ width: '100%' }}
                                        />
                                        <span className="tooltip-text">Seleccionar la fecha de la fuente</span>
                                    </span>
                                    {errorSourceDate && <p style={{ color: 'red', margin: 0 }}>{errorSourceDate}</p>}
                                            <span className="tooltip-text">Seleccionar la fecha de la fuente</span>
                                       
                                    </div>

                                    {/* Estado */}
                                    <div className="ro-fiel-fecha" style={{ width: '48%' }}>
                                        <select 
                                            id="estado" 
                                            name="estado" 
                                            className="inputfechafuen-field"
                                            value={status}
                                            onChange={(e) => setEstado(e.target.value)}
                                            required
                                            style={{ width: '100%' }}
                                        >
                                            <option value="">Seleccione un estado</option>
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                            <option value="Pendiente">Pendiente</option>
                                        </select>
                                    </div>
                                </div>
                            </section>
                    <section className="ro-organizations-section">
                        <h3>Comentario*</h3>
                        <div className="input-text">
                            <textarea
                                className="input-fieldtext"
                                rows="3"
                                value={comment}
                                placeholder="Añadir comentarios"
                                maxLength={300}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,;:()¿?!¡"'\-]*$/;

                                    // Validar: solo permitir si cumple el patrón
                                    if (permitido.test(value)) {
                                    setComentario(value);
                                    setErrorComment("");
                                    } else {
                                    setErrorComment("No se permiten caracteres especialeS.");
                                    }
                                }}
                                ></textarea>

                                {errorComment && <p style={{ color: 'red', margin: 0 }}>{errorComment}</p>}
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
