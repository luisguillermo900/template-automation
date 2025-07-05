import React,{ useState, useEffect,useRef } from "react";
import { useNavigate,useParams } from "react-router-dom";
import '../../../styles/stylesNuevoNemonico.css';
import '../../../styles/styles.css';
import axios from "axios";

const NuevoNemonico = () => {

    const navigate = useNavigate();
         const { orgcod, projcod } = useParams();
         const [name, setName] = useState("");
         const [mnemonic, setMnemonic] = useState("");
         const [error, setError]=useState(null);
         const [errorName, setErrorName] = useState("");
        const [errorMnemonic, setErrorMnemonic] = useState("");
        const [organizacion, setOrganizacion] = useState({});
        const [proyecto, setProyecto] = useState({});

         const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    //Función para registrar un nemónico
    const registrarMnemonic = async (e) => {
        e.preventDefault();
        if (!name) {
            setErrorName("Este campo es obligatorio");
            return;
        }
        if (!mnemonic) {
            setErrorMnemonic("Este campo es obligatorio");
            return;
        }

        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/artifacts`, {
                name,
                mnemonic
            });
            
            // Redirigir a la página de artefactos o realizar otra acción
            irAArtefactos();
    
        } catch (err) {
            console.error("Error al registrar el artefacto:", err);
            setError("No se pudo registrar el artefacto. Inténtalo de nuevo.");
        }
    };

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
    
        const irALogin = () => {
            navigate("/");
        };
        const irAMenuOrganizaciones = () => {
            navigate("/organizations");
        };
        const irAVerRiesgo = () => {
            navigate("/verRiesgo");
        };
        
        const irARegistrarRiesgo = () => {
            navigate("/registroRiesgo");
        };
        const irAEditarRiesgo = () => {
            navigate("/editarRiesgo");
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
        const irAArtefactos = () => {
            navigate(`/organizations/${orgcod}/projects/${projcod}/artifacts`);
        };


    return (
        <div className="rr-container">
            <header className="rr-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span onClick={irAArtefactos}>Artefactos /</span>
                    <span>Nuevo nemónico</span>
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
                    <h2>NUEVO NEMÓNICO</h2>
                  
                    <section className="rr-organization-section">
                        <h3>Informacion del Nemónico</h3>
                        <div className="fiel-cod2">
                                <h4>Artefacto*</h4>
                                <span class="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    
                                    value={name}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 30) {
                                        setName(value);
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
                                    maxLength={30}
                                    size="400"
                                    />
                                    {errorName && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorName}</p>)}
                                    <span class="tooltip-text">Nombre del artefacto en donde se creará el nemónico.</span>
                                </span>
                        </div>

                        <div className="fiel-cod2">
                                <h4>Nemónico*</h4>
                                <span class="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    
                                    value={mnemonic}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 10) {
                                        setMnemonic(value);
                                        setErrorMnemonic(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorMnemonic("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!mnemonic.trim()) {
                                        setErrorMnemonic("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={10}
                                    size="400"
                                    />
                                    {errorMnemonic && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorMnemonic}</p>)}
                                    <span class="tooltip-text">Nemónico a crear, sea lo mas breve y corto posible.</span>
                                </span>

                                
                        </div>

                        <div className="rr-buttons">
                            <button onClick={irAArtefactos} className="rp-button" size="50">Cancelar</button>
                            <button onClick={registrarMnemonic} className="rp-button" size="50">Guardar</button>
                        </div>

                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevoNemonico;
