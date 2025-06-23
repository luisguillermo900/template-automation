import React, {useState, useEffect} from "react";
import { useLocation, useNavigate,useParams } from "react-router-dom";
import axios from 'axios';
import '../../../styles/stylesRiesgo.css';
import '../../../styles/styles.css';

const SubirInterfaz = () => {
    const { orgcod, projcod } = useParams();
    const navigate = useNavigate();

    const location = useLocation();
    const { proid } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [creationDate, setCreationDate] = useState(
            new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [error, setError]=useState(null);
    const [errorName, setErrorName] = useState("");
    
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
        

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null);
            setFilePreview(null);
        }
    };

    const handleSaveInterfaz = async () => {
        if (!selectedFile || !name) {
            alert("Complete todos los campos requeridos");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("name", name);
        formData.append("code", code);
        formData.append("date", new Date().toISOString());
        formData.append("projectId", projcod);  

        try {
            const response = await axios.post(
                `${API_BASE_URL}/interfaces`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.status === 201) {
                alert("Interfaz guardada con éxito");
                irAArtefactos();
            }
        } catch (error) {
            console.error("Error al guardar interfaz:", error.response?.data || error);
            alert("Error al guardar la interfaz");
        }
    };


    useEffect(() => {
        const fetchNextCode = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/interfaces/project/${projcod}/next-code`);
                setCode(response.data.nextCode || "In-001");
            } catch (err) {
                console.error("Error al obtener el siguiente código de interfaz:", err);
                setError("No se pudo cargar el siguiente código de la interfaz.");
            }
        };

        fetchNextCode();
    }, [API_BASE_URL, projcod]);

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
    const irAArtefactos = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/artifacts`,{
        state: {
            proid:proid
        }
    });
    };

    return (
        <div className="ne-container">
            <header className="ne-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span onClick={irAArtefactos}>Artefactos /</span>
                    <span>Subir Interfaz</span>
                </div>
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
                    <h2>NUEVA INTERFAZ</h2>
                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código*</label>
                            <label className="ne-label">Nombre*</label>
                            <label className="ne-label">Fecha*</label>
                        </h3>
                        <div className="ne-input-container">
                            <input disabled type="text" className="ne-input" value={code} readOnly />
                            <span className="message">
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
                                    size="40"
                                    />
                                    {errorName && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorName}</p>)}
                                    <span className="tooltip-text">Agregar nombre que identifique a la interfaz creada, generalmente el nombre es equivalente al titulo de la interfaz.</span>
                            </span>
                            <input disabled type="text" className="ne-input" value={creationDate} readOnly />
                        </div>

                        
                        
                    </section>
                    <section className="rr-organization-section">
                        <h3>Cargar archivo</h3>
                        <span class="message">
                            <input
                                type="file"
                                accept=".jpg,.png,.jpeg,.pdf,.docx"
                                className="acta-button"
                                onChange={handleFileChange}
                            />
                            <span class="tooltip-text">Seleccionar archivo de la interfaz</span>
                        </span>
                        <span>(.jpg .png .jpeg .pdf .docx)</span>

                        {filePreview && (
                            <div style={{ marginTop: "15px" }}>
                                <h5>Vista previa:</h5>
                                {selectedFile.type.startsWith("image/") ? (
                                    <img src={filePreview} alt="Vista previa" style={{ maxWidth: "400px", maxHeight: "300px" }} />
                                ) : (
                                    <embed src={filePreview} width="400px" height="300px" type={selectedFile.type} />
                                )}
                            </div>
                        )}
                    </section>

                    <div className="ne-buttons">
                        <button onClick={irAArtefactos} className="ne-button" size="50">Cancelar</button>
                        <button onClick={handleSaveInterfaz} className="ne-button" size="50">Guardar Interfaz</button>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default SubirInterfaz;
