// frontend/src/view/RegistroOrganizacion.js
import React, { useState, useEffect,useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import '../../../styles/stylesNuevoExperto.css';
import '../../../styles/styles.css';
import axios from "axios";

const EditarExperto = () => {

    const navigate = useNavigate();
    const {orgcod, projcod, expcod} = useParams(); // Asegúrate de tener expertId en la ruta

    const location = useLocation();
    const { proid } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const [paternalSurname, setApellidoPaterno] = useState("");
    const [maternalSurname, setApellidoMaterno] = useState("");
    const [firstName, setNombres] = useState("");
    const [experience, setExperiencia] = useState("");
    const [version, setVersion] = useState("");
    const [status, setEstado] = useState("");
    const [creationDate, setFecha] = useState("");
    const [comment, setComentario] = useState("");
    const [externalOrganization, setExternalOrganization] = useState("");
    const [error, setError] = useState(null);

    const [errorName, setErrorName] = useState("");
    const [errorApellidoPaterno, setErrorApellidoPaterno] = useState("");
    const [errorApellidoMaterno, setErrorApellidoMaterno] = useState("");
    const [errorExperiencia, setErrorExperiencia] = useState("");
    const [errorExternalOrg, setErrorExternalOrg] = useState("");
    const [errorComment, setErrorComment] = useState("");    

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    // GET: traer los datos del experto
    const fetchExpertData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/experts/${expcod}`);
            const data = response.data;
            setApellidoPaterno(data.paternalSurname);
            setApellidoMaterno(data.maternalSurname);
            setNombres(data.firstName);
            setFecha(data.creationDate);
            setVersion(data.version);
            setExperiencia(data.experience);
            setEstado(data.status);
            setComentario(data.comment);
            setExternalOrganization(data.externalOrganization);
        } catch (err) {
            setError("Error al obtener los datos del experto: " + err.message);
        }
    };

    useEffect(() => {
        console.log("Cargando experto con código:", expcod);
        fetchExpertData();
    }, [expcod]);

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
    
    const handleEdit = async (e) => {
        e.preventDefault();

        if (!paternalSurname) {
            setErrorApellidoPaterno("Este campo es obligatorio.");
            return;
        }
        if (!maternalSurname) {
            setErrorApellidoMaterno("Este campo es obligatorio.");
            return;
        }
        if (!firstName) {
            setErrorName("Este campo es obligatorio.");
            return;
        }
        if (!experience) {
            setErrorExperiencia("Este campo es obligatorio.");
            return;
        }
        


        console.log("Guardando experto con código:", expcod);
        try {
            const response = await axios.put(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/experts/${expcod}`, {
                externalOrganization,
                paternalSurname,
                maternalSurname,
                firstName,
                experience,
                status,
                comment
            });
    
            if (response.status === 200) {
                alert("Experto actualizado correctamente");
                irAExpertos();
            }
        } catch (err) {
            setError("Error al actualizar el experto: " + err.message);
        }
    };
    
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects` );
    };
    const irAPlantillas = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/plantillas`,{
        state: {
            proid:proid
        }
    });
    };
    const irAExpertos = () => {
    navigate(`/organizations/${orgcod}/projects/${projcod}/experts`,{
        state: {
            proid:proid
        }
    });
    };
    const irAMenuProyecto = (code) => {
    navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`,{
        state: {
            proid:proid
        }
    });
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
                <span onClick={irAExpertos}>Expertos /</span>
                <span>Editar Experto</span>
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
                    <h2>EDITAR EXPERTO</h2>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo">Código </label>
                            <label className="ro-version">Versión</label>
                            <label className="ro-Fecha">Fecha</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="text" className="inputBloq-field" value={expcod}  readOnly size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input type="text" className="inputBloq-field" value={version} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input type="text" className="inputBloq-field" value={creationDate} readOnly size="30" />
                            </div>
                        </div>

                        <section className="ro-organizations-section">
                        {/* Formulario editable */}
                        <h3>Información Personal</h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Apellido Parterno*</h4>
                                <span class="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Apellido Paterno"
                                    value={paternalSurname}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 20) {
                                        setApellidoPaterno(value);
                                        setErrorApellidoPaterno(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorApellidoPaterno("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!paternalSurname.trim()) {
                                        setErrorApellidoPaterno("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={20}
                                    size="40"
                                    />
                                    {errorApellidoPaterno && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorApellidoPaterno}</p>)}
                                    <span class="tooltip-text">Editar el apellido parterno del experto</span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Apellido Materno*</h4>
                                <span class="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Apellido Materno"
                                    value={maternalSurname}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 20) {
                                        setApellidoMaterno(value);
                                        setErrorApellidoMaterno(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorApellidoMaterno("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!maternalSurname.trim()) {
                                        setErrorApellidoMaterno("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={20}
                                    size="40"
                                    />
                                    {errorApellidoMaterno && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorApellidoMaterno}</p>)}
                                    <span class="tooltip-text">Editar el apellido materno del experto </span>
                                </span>
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Nombres*</h4>
                                <span class="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Nombres"
                                    value={firstName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 30) {
                                        setNombres(value);
                                        setErrorName(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorName("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!firstName.trim()) {
                                        setErrorName("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={30}
                                    size="40"
                                    />
                                    {errorName && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorName}</p>)}
                                    <span class="tooltip-text">Editar el nombre del experto </span>
                                </span>
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Experiencia* </h4>
                                <span class="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Experiencia"
                                    value={experience}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 50) {
                                        setExperiencia(value);
                                        setErrorExperiencia(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorExperiencia("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!experience.trim()) {
                                        setErrorExperiencia("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={50}
                                    size="60"
                                    />
                                    {errorExperiencia && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorExperiencia}</p>)}
                                    <span class="tooltip-text"> Editar la experiencia que tiene el experto </span>
                                </span>
                                
                            </div>
                           
                        </div>

                        
                    </section>
                       
                    </section>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo">Organizacion </label>
                            <label className="ro-version">Autor de plantilla </label>
                            <label className="ro-Fecha">Estado* </label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <span class="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    placeholder="Nombre de organizacion"
                                    value={externalOrganization}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 50) {
                                        setExternalOrganization(value);
                                        setErrorExternalOrg(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorExternalOrg("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    maxLength={50}
                                    size="40"
                                    />
                                    {errorExternalOrg && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorExternalOrg}</p>)}
                                    <span class="tooltip-text"> Nombre de la Organizacion a la que pertenece</span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <span class="message">
                                    <input type="text" className="inputBloq-field" value="AUT-000" readOnly size="30" />
                                    <span class="tooltip-text"> Codigo del autor de la plantilla </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-fecha">
                            <select
                                id="estado"
                                name="estado"
                                value={status}
                                onChange={(e) => setEstado(e.target.value)}
                                required
                            >
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
                            <button onClick={irAExpertos} className="ro-button">Cancelar</button>
                            <button onClick={handleEdit} className="ro-button">Guardar Cambios</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarExperto;
