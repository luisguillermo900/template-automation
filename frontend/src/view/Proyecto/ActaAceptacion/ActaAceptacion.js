import React, { useState, useEffect } from "react";

import { useNavigate, useLocation, useParams} from "react-router-dom";

import axios from "axios";

import '../../../styles/stylesActaAceptacion.css';

import '../../../styles/styles.css';


const ActaAceptacion = () => {

    // Hooks de React Router

    const navigate = useNavigate();

    const location = useLocation();

    const { orgcod, projcod } = useParams();

    const { proid } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const MAX_FILE_SIZE_MB = 5;

    // Estado para el archivo y su previsualización

    const [selectedFile, setSelectedFile] = useState(null);

    const [filePreview, setFilePreview] = useState(null);


    // Estado para el acta cargada previamente

    const [existingActa, setExistingActa] = useState(null);

   

    // Estados para la llamada a la API

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);


    // URL base de la API desde variables de entorno

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


    // --- Funciones de Navegación ---

    const irAMenuOrganizaciones = () => {

        navigate("/organizations");

    };


    const irAMenuProyecto = () => {

        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`,{
        state: {
            proid: proid
        }
    });
    };


    const irALogin = () => {

        navigate("/");

    };


    const irAListaProyecto = () => {

        navigate(`/organizations/${orgcod}/projects`);
    };

    const queryParams = new URLSearchParams(location.search);

    const codigo = queryParams.get('code');


    useEffect(() => {

        const fetchExistingActa = async () => {

            if (!proid) {

                console.warn("No se encontró el ID del proyecto para cargar el acta.");

                return;

            }

            setLoading(true);

            try {

                const response = await axios.get(`${API_BASE_URL}/projects/${proid}/acceptance-records`);

                if (response.data && response.data.length > 0) {
                    const acta = response.data[0];

                    setExistingActa(acta);

                    if (acta.fileUrl) { 

                        setFilePreview(acta.fileUrl);

                    }

                } else {

                    setExistingActa(null); // No hay acta cargada

                }

            } catch (err) {

                console.error("Error al cargar el acta existente:", err);

                setError("No se pudo cargar el acta existente.");

                setExistingActa(null);

            } finally {

                setLoading(false);

            }

        };


        fetchExistingActa();

    }, [proid, API_BASE_URL]); 


    // --- Manejadores de eventos ---

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > MAX_FILE_SIZE_MB) {
                alert(`El archivo supera el límite de ${MAX_FILE_SIZE_MB} MB. Por favor, selecciona un archivo más pequeño.`);
                setSelectedFile(null);
                setFilePreview(null);
                e.target.value = null; // Limpiar el input
                return;
            }

            setSelectedFile(file);

            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setFilePreview(fileReader.result);
            };
            fileReader.readAsDataURL(file);

            setExistingActa(null);
        } else {
            setSelectedFile(null);
            setFilePreview(null);
        }
    };


    const handleSaveActa = async () => {

        if (!selectedFile) {

            alert("Por favor, selecciona un archivo.");

            return;

        }


        if (!proid) {

            alert("No se encontró el ID del proyecto.");

            return;

        }


        const formData = new FormData();

        formData.append("file", selectedFile);

        formData.append("projectId", proid); 


        try {

            const response = await axios.post(`${API_BASE_URL}/acceptance-records`, formData, {

                headers: {

                    "Content-Type": "multipart/form-data",

                },

            });


            if (response.status === 201) {

                alert("Acta guardada con éxito");

                irAMenuProyecto();

            }

        } catch (error) {

            console.error("Error al guardar el acta:", error);

            alert("Hubo un error al guardar el acta.");

        }

    };

    useEffect(() => {
    const fetchDatos = async () => {
        try {
            // Obtener organización
            const resOrg = await axios.get(`${API_BASE_URL}/organizations/${orgcod}`);
            setOrganizacion(resOrg.data);

            // Obtener proyecto
            const resProyecto = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}`);
            setProyecto(resProyecto.data);
        } catch (error) {
            console.error("Error al obtener los datos de la organización o proyecto", error);
        }
    };
    fetchDatos();
}, [orgcod, projcod, API_BASE_URL]);

   

    return (

        <div className="acta-container">

            <header className="acta-header">

                <h1>ReqWizards App</h1>

                <div className="flex-container">

                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                    <span>Acta</span>

                </div>

            </header>


            <div className="actasub-container">


                <aside className="sidebar">

                    <div className="bar-rp">

                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>

                    </div>


                    <div className="profile-section" >

                        <div className="profile-icon">👤</div>

                        <p2>Nombre Autor - Cod</p2>

                        <button onClick={irALogin}className="logout-button" >Cerrar Sesión</button>

                    </div>

                </aside>


                <main className="acta-content">

                    <h2>ACTA DE ACEPTACION</h2>

                    <section className="acta-organization-section">

                        <h3>Informacion del Acta</h3>

                        {loading ? (

                            <p>Cargando información del acta...</p>

                        ) : error ? (

                            <p style={{ color: 'red' }}>{error}</p>

                        ) : existingActa ? (

                            <div className="file-preview-existing">

                                {/*{existingActa.fileType && existingActa.fileType.startsWith("image/") ? (

                                    <img src={existingActa.fileUrl} alt="Acta Previsualización" className="file-preview-img" />

                                ) : existingActa.fileType === "application/pdf" ? (

                                    <embed src={existingActa.fileUrl} type="application/pdf" className="file-preview-pdf" />

                                ) : (

                                    <p>Vista previa no disponible para este tipo de archivo.</p>

                                )}
                                    */}
                                {existingActa ? (
                                    <div className="file-preview-existing">
                                        <p>Existe un archivo cargado anteriormente {existingActa.fileName}</p>
                                    </div>
                                    ) : (
                                    <p>No se subió un acta aún.</p>
                                )}


                            </div>

                        ) : (

                            <p>No se subió un acta aún.</p>

                        )}


                        <span class="message">

                        <input

                            type="file"

                            accept=".jpg,.png,.jpeg,.pdf,.docx"

                            onChange={handleFileChange}

                            className="acta-button"

                        />

                        <span class="tooltip-text">Seleccionar archivo de acta de aceptación del proyecto</span>

                        </span>

                    <span><strong>   (.jpg .png .jpeg .pdf .docx)</strong></span>
                    <span>Tamaño max. del archivo 5MB</span>

                        {filePreview && (

                        <div className="file-preview">

                            {selectedFile.type.startsWith("image/") ? (

                                <img src={filePreview} alt="Preview" className="file-preview-img" />

                            ) : selectedFile.type === "application/pdf" ? (

                                <embed src={filePreview} type="application/pdf" className="file-preview-pdf" />

                            ) : (

                                <p>Vista previa no disponible</p>

                            )}

                        </div>

                    )}

   

                        <div className="acta-buttons">

                            <button onClick={handleSaveActa} className="acta-button" size="50">Guardar Acta</button>

                        </div>


                        <div className="search-section-bar">

                            <button onClick={irAMenuProyecto} className="atras-button">Regresar</button>

                        </div>

                    </section>

                </main>

            </div>

        </div>

    );

};


export default ActaAceptacion; 