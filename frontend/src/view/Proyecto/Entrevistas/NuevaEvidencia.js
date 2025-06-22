import React, { useState} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import '../../../styles/stylesNuevaEvidencia.css';
import '../../../styles/styles.css';

const NuevaEvidencia = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {orgcod, projcod } = useParams();
    const { proid, entrevistas} = location.state || {};

    const [selectedInterviewId, setSelectedInterviewId] = useState("");
    const [codigoEvidencia, setCodigoEvidencia] = useState("");
    const [codigo, setCodigo] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState('');
    const [errorName, setErrorName] = useState('');
    const [creationDate, setCreationDate] = useState(
            new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";


    const obtenerSiguienteCodigo = async (interviewId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/interviews/${interviewId}/evidences/next-code`
            );
            setCodigo(response.data.nextCode || "Ev-001");
        } catch (err) {
            console.error("Error al obtener el siguiente código de evidencia:", err);
            setError("No se pudo cargar el siguiente código de evidencia.");
        }
    };

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

    const handleSaveEvidencia = async (e) => {
        e.preventDefault();

        if (!selectedInterviewId) {
            setError("Debe seleccionar una entrevista.");
            return;
        }

        if (!selectedFile) {
            setError("Debe subir un archivo.");
            return;
        }

        if (!name || !name.trim()) {
            setError("Debe ingresar un nombre.");
            return;
        }

        if (name.length > 50) {
        setError("El nombre del laevidencia no debe exceder los 50 caracteres.");
        return;
        }

        if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/.test(name)) {
        setError("El nombre del proyecto contiene caracteres no permitidos.");
        return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("name", name);
        formData.append("code", codigoEvidencia);
        formData.append("evidenceDate", new Date().toISOString());

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/interviews/${selectedInterviewId}/evidences`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.status === 201) {
                alert("Evidencia guardada con éxito");
                irAEntrevistas();
            }
        } catch (error) {
            console.error("Error al guardar evidencia:", error);
            alert("Error al guardar la evidencia");
        }
    };



    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAEntrevistas = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/entrevistas`,{
        state: {
            proid:proid
        }
    });
    };
    const irALogin = () => {
        navigate("/");
    };
    const irAMenuProyecto = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`,{
        state: {
            proid:proid
        }
    });
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
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span onClick={irAEntrevistas}>Entrevistas /</span>
                    <span>Nueva Evidencia</span>
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
                    <h2>NUEVA EVIDENCIA</h2>
                    <section className="rr-organization-section">
                        <h3>Informacion de la entrevista</h3>
                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Entrevista</h4>
                            </div>
                            <div className="fiel-vers">
                                <select
                                    className="estado2-input"
                                    style={{ width: "600px" }}
                                    value={selectedInterviewId}
                                    onChange={(e) => {
                                        const id = e.target.value;
                                        setSelectedInterviewId(id);
                                        if (id) obtenerSiguienteCodigo(id);
                                    }}
                                >
                                    <option value="">Seleccione una entrevista</option>
                                    {entrevistas?.map((e) => (
                                        <option key={e.id} value={e.id}>
                                            {e.interviewName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                    </section>
                    <section className="rr-organization-section">
                        <h3>Informacion de la evidencia</h3>
                        <div className="rr-cod-vers">
                            <div className="fiel-cod">
                                <h4>Codigo*</h4>
                                <div class="codigo-box">
                                    <div class="categoria">
                                        <span class="message">
                                            <input type="text" className="codigo-input" value={codigo} readOnly />
                                            <span class="tooltip-text"> Codigo de evidencia </span>
                                        </span>
                                        <h5>Código </h5>
                                    </div>
                                </div>                          
                            </div>
                            <div className="fiel-cod">
                                <h4>Nombre </h4>
                                <span class="message"> 
                                    <input
                                        type="text"
                                        className="inputnombre-field"
                                        value={name}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            // Expresión permitida: letras, números, espacios y (, . - _ & /)
                                            const regexPermitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                            // Validar solo si cumple con el regex
                                            if (regexPermitido.test(value)) {
                                            if (value.length <= 50) {
                                                setName(value);
                                                setErrorName(""); // Limpia error
                                            } else {
                                                setErrorName("Máximo 60 caracteres.");
                                            }
                                            } else {
                                            setErrorName("Solo se permiten letras, números y caracteres (, . - _ & /).");
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!name.trim()) {
                                            setErrorName("El nombre del proyecto es obligatorio.");
                                            }
                                        }}
                                        maxLength={50}
                                        size="30"
                                        />
                                        {errorName && <p style={{ color: 'red', margin: 0 }}>{errorName}</p>}
                                    <span class="tooltip-text"> Ingresar el nombre de la evidencia </span>
                                </span>                          
                            </div>
                            
                            <div className="fiel-cod">
                                <h4>Fecha de Creacion</h4>
                                <span class="message">
                                    <input disabled type="text" className="inputBloq-field"  value={creationDate} readOnly size="50" />
                                    <span class="tooltip-text"> Fecha en la que se creo esta evidencia</span>
                                </span> 
                                
                            </div>
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
                            <span class="tooltip-text">Seleccionar archivo de la evidencia</span>
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

                    <section className="rr-organizations-section">
                        <div className="rp-buttons">
                            <button onClick={irAEntrevistas} className="rp-button" size="50">Cancelar</button>
                            <button onClick={handleSaveEvidencia} className="rp-button" size="50">Guardar Evidencia</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </section>




                </main>
            </div>
        </div>
    );
};

export default NuevaEvidencia;
