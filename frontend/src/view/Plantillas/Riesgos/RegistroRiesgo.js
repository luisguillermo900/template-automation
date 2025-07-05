import React,{ useState, useEffect } from "react";
import { useNavigate ,useParams, useLocation } from "react-router-dom";
import '../../../styles/stylesRiesgo.css';
import '../../../styles/styles.css';
import axios from "axios";

const RegistroRiesgo = () => {

    const navigate = useNavigate();
    const { orgcod, projcod } = useParams();
    const location = useLocation();
    const { proid, from } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const [entityType, setEntityType] = useState("");
    const [version, setVersion] = useState("01.00");
    const [registryCode, setRegistryCode] = useState("");
    const [description, setDescription] = useState("");
    const [impact, setImpact] = useState("");
    const [probability, setProbability] = useState("");
    const [status, setStatus] = useState("");
    const [creationDate, setCreationDate] = useState(
            new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    const [comments, setComments] = useState("");
    const [sourceRiskCode, setSourceRiskCode] = useState("");
    const [code, setCode] = useState("");

    const [error, setError]=useState(null);
    const [errorDescripcion, setErrorDescripcion] = useState("");
    const [errorRegistryCode, setErrorRegistryCode] = useState("");
    const [errorComment, setErrorComment] = useState("");   
    const [errorEntityType, setErrorEntityType] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";   
    
    //Función para obtener el siguiente código de riesgo
    useEffect(() => {
    
        const fetchNextCodigoRiesgo = async () => {
            try {
                
                // Llamar al endpoint usando parámetros de consulta
                const response = await axios.get(`${API_BASE_URL}/projects/${proid}/risks/next-code`);

                // Asignar el valor recibido al estado
                setCode(response.data.nextCode || "Ed-001");
            } catch (err) {
                console.error("Error al obtener el siguiente código de experto:", err);
                setError("No se pudo cargar el siguiente código del experto.");
            }
        };

        fetchNextCodigoRiesgo();
    }, [API_BASE_URL,orgcod, projcod]);

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

    //Función para registrar un riesgo
    const registrarRiesgo = async (e) => {
        e.preventDefault();
       

        if (!entityType) {
            setErrorEntityType("Debe seleccionar un tipo de entidad.");
            return;
        }
        if (!registryCode) {
            setErrorRegistryCode("Este campo es obligatorio.");
            return;
        }
        if (!description) {
            setErrorDescripcion("Este campo es obligatorio.");
            return;
        }
        if (!comments) {
            setErrorComment("Este campo es obligatorio.");
            return;
        }
        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/projects/${proid}/risks`, {
                entityType,
                registryCode,
                description,
                impact,
                probability,
                comments, // Asumiendo que 'comentario' es un campo adicional
                status, // Asumiendo que 'estado' es otro campo
            });
            
            // Redirigir a la página de expertos o realizar otra acción
            irARutaAnterior();
    
        } catch (err) {
            console.error("Error al registrar el experto:", err);
            setError("No se pudo registrar al experto. Inténtalo de nuevo.");
        }
    };    

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

    //Función para ir a la ruta anterior, envio de ruta
    const irARutaAnterior = () => {
        if (from) {
            navigate(from, { state: { proid: proid } });
        } else {
            // Ruta por defecto (fallback)
            navigate(`/organizations/${orgcod}/projects/${projcod}/educcion`, {
                state: { proid: proid }
            });
        }
    };


    return (
        <div className="ne-container">
            <header className="ne-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span>Registro Riesgo</span>
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
                    <h2>REGISTRO RIESGO</h2>
                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Selecciona Entidad*</label>
                            <label className="ne-label">Codigo de Registro*</label>
                            <label className="ne-label">Responsble*</label>
                        </h3>
                        <div className="ne-input-container">
                            <div style={{ display: "flex", flexDirection: "column",width: "400px" }}>
                                <select
                                    className="ne-input estado-input"
                                    value={entityType}
                                    onChange={(e) => {
                                    setEntityType(e.target.value);
                                    if (e.target.value) setErrorEntityType(""); // Limpia error si selecciona algo
                                    }}
                                    onBlur={() => {
                                    if (!entityType) setErrorEntityType("Debe seleccionar un tipo de entidad.");
                                    }}
                                    required
                                >
                                    <option value="">Seleccione una</option>
                                    <option value="Educción">Educción</option>
                                    <option value="Ilación">Ilación</option>
                                    <option value="Especificación">Especificación</option>
                                    <option value="Req. No Funcional">Req. No Funcional</option>
                                </select>
                                {errorEntityType && <p style={{ color: "red", margin: 0 }}>{errorEntityType}</p>}
                                </div>
                            <span className="message">
                            <input
                                        type="text"
                                        className="inputnombre-field"
                                        
                                        value={registryCode}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                            if (permitido.test(value) && value.length <= 50) {
                                                setRegistryCode(value);
                                                setErrorRegistryCode(""); // limpiar el error si todo está bien
                                            } else {
                                                setErrorRegistryCode("No se permiten caracteres especiales.");
                                                // No actualiza el input → no se muestra el carácter inválido
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!registryCode.trim()) {
                                                setErrorRegistryCode("Este campo es obligatorio.");
                                            }
                                        }}
                                        maxLength={50}
                                        size="40"
                                    />
                                    {errorRegistryCode && (
                                        <p style={{ color: 'red', margin: 0 }}>{errorRegistryCode}</p>)}
                                <span className="tooltip-text">Ingresar el código de registro de entidad a la que se hace referencia. Ej. EDU-001, ILA-001, ESP-001, RNF-0001</span>
                            </span>
                            <input disabled type="text" className="ne-input" value="AUT-0000" readOnly />
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>RIESGO IDENTIFICADO*</h4>
                            </div>
                            <span className="message">
                                <input
                                        type="text"
                                        className="inputnombre-field"
                                        placeholder="Descripción del riesgo identificado"
                                        value={description}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                            if (permitido.test(value) && value.length <= 50) {
                                                setDescription(value);
                                                setErrorDescripcion(""); // limpiar el error si todo está bien
                                            } else {
                                                setErrorDescripcion("No se permiten caracteres especiales.");
                                                // No actualiza el input → no se muestra el carácter inválido
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!description.trim()) {
                                                setErrorDescripcion("Este campo es obligatorio.");
                                            }
                                        }}
                                        maxLength={50}
                                        size="100"
                                    />
                                    {errorDescripcion && (
                                        <p style={{ color: 'red', margin: 0 }}>{errorDescripcion}</p>)}
                                <span className="tooltip-text">Ingresar la descripción de riesgo encontrado.</span>
                             </span>
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
                                value={probability}
                                onChange={(e) => setProbability(e.target.value)}
                            >
                                <option value="" disabled>Seleccione una opción</option>
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
                                <option value="" disabled>Seleccione una opción</option>
                                <option value="10">10%</option>
                                <option value="15">15%</option>
                                <option value="20">20%</option>
                                <option value="25">25%</option>
                            </select>
                            <select
                                className="ne-input estado-input"
                                value={impact}
                                onChange={(e) => setImpact(e.target.value)}
                                required
                            >
                                <option value="" disabled>Seleccione una opción</option>
                                <option value="10">1 dia</option>
                                <option value="15">7 dias</option>
                                <option value="20">15 dias</option>
                                <option value="25">1 mes</option>
                            </select>
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
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
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
                        </section>
                        <section className="ne-organizations-section">
                            <h3>Plan Mitigación</h3>
                            <div className="input-text">
                            <textarea
                                className="input-fieldtext"
                                rows="3"
                                value={comments}
                                placeholder="Añadir plan de mitigación"
                                maxLength={300}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,;:()¿?!¡"'\-]*$/;

                                    // Validar: solo permitir si cumple el patrón
                                    if (permitido.test(value)) {
                                        setComments(value);
                                        setErrorComment("");
                                    } else {
                                        setErrorComment("No se permiten caracteres especialeS.");
                                    }
                                }}
                                onBlur={() => {
                                    if (!comments.trim()) {
                                    setErrorComment("Este campo es obligatorio.");
                                    }
                                }}
                            ></textarea>

                            {errorComment && <p style={{ color: 'red', margin: 0 }}>{errorComment}</p>}
                        </div>

                        <div className="ne-buttons">
                            <button onClick={irARutaAnterior} className="ne-button" size="50">Cancelar</button>
                            <button onClick={registrarRiesgo} className="ne-button" size="50">Guardar Riesgo</button>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
};

export default RegistroRiesgo;
