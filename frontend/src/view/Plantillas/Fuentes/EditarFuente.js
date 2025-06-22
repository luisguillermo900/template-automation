// frontend/src/view/RegistroOrganizacion.js
import React, { useState, useEffect ,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../../styles/stylesNuevaFuente.css';
import '../../../styles/styles.css';
import axios from "axios";

const EditarFuente = () => {
    const hasRun = useRef(false);
    const navigate = useNavigate();
    const {orgcod, projcod,fuecod } = useParams();
    // Datos controlados por el usuario
    const [name, setNombre] = useState("");
    const [status, setEstado] = useState("");
    const [version, setVersion] = useState("");
    const [comment, setComentario] = useState("");
    const [creationDate, setFecha] = useState("");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    const [error, setError] = useState(null);
    // GET: traer los datos de la fuente
    const fetchSourceData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/${fuecod}`);
            const data = response.data;
            setNombre(data.name);
            setEstado(data.status);
            setVersion(data.version);
            setComentario(data.comment);
            setFecha(data.creationDate);
        } catch (err) {
            setError("Error al obtener los datos de la fuente: " + err.message);
        }
    };
    useEffect(() => {
            if (hasRun.current) return; // 🚫 Evita ejecutar nuevamente
            hasRun.current = true;
            console.log("Cargando fuente con código:", fuecod);
            fetchSourceData();
        }, [fuecod]);

    const handleEdit = async (e) => {
        e.preventDefault();
        console.log("Guardando fuente con código:", fuecod);
        try {
            const response = await axios.put(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/${fuecod}`, {
                name,
                status,
                comment,
                creationDate
            });
    
            if (response.status === 200) {
                alert("Fuente actualizada correctamente");
                irAFuentes();
            }
        } catch (err) {
            setError("Error al actualizar la fuente: " + err.message);
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
      const irAPlantillas = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/plantillas`);
      };
      const irAMenuProyecto = (code) => {
        //navigate(`/menuProyecto?procod=${code}`);
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`);
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
                <span>Editar Fuente</span>
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
                    <h2>EDITAR FUENTE</h2>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo">Código </label>
                            <label className="ro-version">Versión</label>
                            <label className="ro-Fecha">Fecha</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="text" className="inputBloq-field" value={fuecod} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input type="text" className="inputBloq-field" value={version} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input type="text" className="inputBloq-field"  value={creationDate} readOnly size="30" />
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
                                    <span class="tooltip-text"> Editar el nombre de la fuente </span>
                                </span><br />
                                {/*<span class="message">
                                    <input className="inputautores-field"  type="text"  size="110" style={{ height: '50px' }} />
                                    <span class="tooltip-text"> Editar los autores de la fuente </span>
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
                                    <input type="text" className="inputfechafuen-field" value={creationDate}  size="30" />
                                    <span class="tooltip-text"> Editar la fecha de la fuente </span>
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
                            <textarea className="input-fieldtext" rows="3" value={comment} onChange={(e) => setComentario(e.target.value)} placeholder="Añadir comentarios sobre la fuente"></textarea>
                        </div>

                        <div className="ro-buttons">
                            <button onClick={irAFuentes} className="ro-button">Cancelar</button>
                            <button onClick={handleEdit} className="ro-button">Guardar Cambios</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarFuente;
