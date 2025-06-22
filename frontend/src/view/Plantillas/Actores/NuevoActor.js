import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import '../../../styles/stylesNuevoExperto.css';
import '../../../styles/styles.css';
import axios from "axios";
import Roles from "../../Proyecto/Roles/Roles";

const NuevoActor = () => {
    const navigate = useNavigate();
    const hasFetched = useRef(false);
    const location = useLocation();

    // Obtener datos del proyecto del URL
    const { projcod, orgcod } = useParams();
    const { proid } = location.state || {};
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const [code, setCodigoActor] = useState("");
    const [version, setVersionActor] = useState("00.01");
    const [creationDate, setFechaCreacion] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
    );
    const [modificationDate, setFechaModificacion] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
    );


    // Datos controlados por el usuario
    const [name, setNombre] = useState("");
    const [status, setEstado] = useState("");
    const [comments, setComentario] = useState("");
    const [roleId, setRoleId] = useState("");
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null); 
    const [type, setType] = useState("");
    const [autor, setAutor] = useState("");
    //Estados para manejar errores
    const [error, setError] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    useEffect(() => {
        const fetchRoles = async () => {
            const res = await axios.get(`${API_BASE_URL}/roles`);
            setRoles(res.data.data || []); // Asegúrate de ajustar según cómo devuelves los datos
        };

        fetchRoles();
    }, []);
    //Obtener Role con el RoleId
    //const selectedRole = roles.find((r) => r.id === roleId);
    // Obtener el siguiente código de fuente
    useEffect(() => {
        if (hasFetched.current) return; // Previene segunda ejecución
        hasFetched.current = true;
        const fetchNextCodigoActor = async () => {
            try {

                // Llamar al endpoint usando parámetros de consulta
                const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/actors/next-code`);

                // Asignar el valor recibido al estado
                setCodigoActor(response.data.nextCode || "FUE-001");
            } catch (err) {
                console.error("Error al obtener el siguiente código de actor:", err);
                setError("No se pudo cargar el siguiente código del actor.");
            }
        };

        fetchNextCodigoActor();
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

    //Extarer los roles 
    const DataRoles = () => {

    }
    //Registrar Nuevo Actor
    const registrarActor = async (e) => {
        e.preventDefault();
        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/actors`, {
                name,
                comments, // Asumiendo que 'comentario' es un campo adicional
                status, // Asumiendo que 'estado' es otro campo
                roleId,
                // roleId,
                type,
            });

            // Redirigir a la página de expertos o realizar otra acción
            irAActores();

        } catch (err) {
            console.error("Error al registrar el actor:", err);
            setError("No se pudo registrar al actor. Inténtalo de nuevo.");
        }
    };


    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };
    const irAActores = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/actors`,{
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
    const irAMenuProyecto = (projcod) => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`,{
        state: {
            proid:proid
        }
    });
    };

    // Función para registrar la organización


    return (
        <div className="ro-container">
            <header className="ro-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span onClick={irAActores}>Actores /</span>
                    <span>Nuevo Actor</span>
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
                    <h2>NUEVO ACTOR</h2>
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
                        <section className="ro-organizations-section">
                            {/* Formulario editable */}
                            <h3>Información Personal</h3>
                            <div className="ro-cod-vers">
                                <div className="ro-fiel-cod">
                                    <h4>Rol*</h4>
                                    {/*router.get('/roles', roleController.getRoles.bind(roleController));*/}
                                    <select id="estado" name="estado" value={roleId} onChange={(e) => {
                                        const selectedId = e.target.value;
                                        setRoleId(selectedId);

                                        const fullRole = roles.find((r) => r.id === selectedId);
                                        setSelectedRole(fullRole); // Aquí sí: guardas el objeto seleccionado
                                    }} required>
                                        <option value="">Seleccione un rol</option>
                                        {roles.map((r) => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                    {/* <select id="estado" name="estado" value={roleId} onChange={(e) => setRoleId(e.target.value)} required>
                                        <option value="">Seleccione un rol</option>
                                        {roles.map((r) => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select> */}
                                </div>
                                <div className="ro-fiel-vers">
                                    <h4>Tipo*</h4>
                                    <select id="estado" name="estado"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)} required>
                                        <option value="">Seleccione un tipo</option>
                                        <option value="Principal">Principal</option>
                                        <option value="Secundario">Secundario</option>

                                    </select>
                                </div>
                            </div>

                        </section>

                    </section>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo">Organización </label>
                            <label className="ro-version">Autor de plantilla </label>
                            <label className="ro-Fecha">Estado* </label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <span class="message">
                                    <input type="text" className="inputBloq-field" readOnly size="45" value={orgcod} />
                                    <span class="tooltip-text"> Codigo de la Organizacion </span>
                                </span>

                            </div>
                            <div className="ro-fiel-vers">
                                <span class="message">
                                    <input type="text" className="inputBloq-field" value="AUT-000" readOnly size="45" />
                                    <span class="tooltip-text"> Codigo del autor de la plantilla </span>
                                </span>

                            </div>
                            <div className="ro-fiel-fecha">
                                <select id="estado" name="estado" value={status}
                                    onChange={(e) => setEstado(e.target.value)} required>
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
                            <textarea className="input-fieldtext" rows="3" value={comments} onChange={(e) => setComentario(e.target.value)} placeholder="Añadir comentarios sobre la fuente"></textarea>
                        </div>

                        <div className="ro-buttons">
                            <button onClick={irAActores} className="ro-button">Cancelar</button>
                            <button onClick={registrarActor} className="ro-button">Crear Actor</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevoActor;