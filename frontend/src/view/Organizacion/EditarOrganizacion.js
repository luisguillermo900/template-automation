// frontend/src/view/Organizacion/EditarOrganizacion.js
import React, { useState, useEffect } from "react";
import { useNavigate,  useLocation, useParams } from "react-router-dom";
import '../../styles/stylesRegistroOrganizacion.css';
import '../../styles/styles.css';
import axios from "axios";

const EditarOrganizacion = () => {
    const navigate = useNavigate();
    const { orgcod } = useParams(); // Extraer orgcod desde la URL dinamica

    // Estados para los datos de la organización
    const [id,setId] = useState(""); // Estado para almacenar el ID único
    const [name, setNombre] = useState("");
    const [address, setDireccion] = useState("");
    const [phone, setTelefonoOrganizacion] = useState("");
    const [legalRepresentative, setRepresentanteLegal] = useState("");
    const [representativePhone, setTelefonoRepresentante] = useState("");
    const [taxId, setRuc] = useState("");
    const [contact, setContacto] = useState("");
    const [contactPhone, setTelefonoContacto] = useState("");
    const [status, setEstado] = useState("");
    const [comments, setComentario] = useState("");

    // Datos automáticos (no editables)
    const [code, setCodigo] = useState("");
    const [version, setVersion] = useState("");
    const [creationDate, setFecha] = useState("");
    const [tipo, setTipo] = useState("Contratante");
    const [autor, setAutor] = useState("AUT-00.00");

    const [error, setError] = useState(null);
    const [errorNombre, setErrorNombre] = useState("");
    const [errorDireccion, setErrorDireccion] = useState("");
    const [errorRepresentanteLegal, setErrorRepresentanteLegal] = useState("");
    const [errorTelefono, setErrorTelefono] = useState("");
    const [errorRuc, setErrorRuc] = useState("");
    const [errorContacto, setErrorContacto] = useState("");
    const [errorTelefonoContacto, setErrorTelefonoContacto] = useState("");
    const [errorRepresentante, setErrorRepresentante] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    
    useEffect(() => {
        // Obtener los datos de la organización para editar
        const fetchOrganizationData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}`);
                const orgData = response.data;

                // Actualizar estados con los datos obtenidos
                setId(orgData.id); // Almacenar el ID único
                setCodigo(orgData.code);
                setVersion(orgData.version);
                setFecha(new Date(orgData.creationDate).toLocaleDateString());
                setNombre(orgData.name);
                setDireccion(orgData.address);
                setTelefonoOrganizacion(orgData.phone);
                setRepresentanteLegal(orgData.legalRepresentative);
                setTelefonoRepresentante(orgData.representativePhone);
                setRuc(orgData.taxId);
                setContacto(orgData.contact);
                setTelefonoContacto(orgData.contactPhone);
                setEstado(orgData.status);
                setComentario(orgData.comments);
            } catch (err) {
                console.error("Error al obtener los datos de la organización:", err);
                setError("No se pudieron cargar los datos de la organización.");
            }
        };
        fetchOrganizationData();
    }, [API_BASE_URL, orgcod]);

    // Redirigir al menú de organizaciones
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };

    // Función para actualizar la organización
    const handleEdit = async (e) => {
        e.preventDefault();
        // Nombre organización
        if (!name.trim()) {
            setError("El nombre de la organización es obligatorio.");
            return;
        }
        if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,&'-]{1,60}$/.test(name.trim())) {
            setError("El nombre de la organización contiene caracteres no permitidos.");
            return;
        }

        // Dirección (opcional, pero si se llena debe ser válida)
        if (address && !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,\-#°º()\/]{1,50}$/.test(address)) {
            setError("La dirección contiene caracteres no permitidos o excede el límite.");
            return;
        }

        // Teléfono organización
        if (phone &&!/^9\d{8}$/.test(phone)) {
            setError("El teléfono de la organización debe tener 9 dígitos y empezar con 9.");
            return;
        }

        // Representante legal
        
        if (legalRepresentative &&!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s']{1,60}$/.test(legalRepresentative.trim())) {
            setError("El nombre del representante legal solo puede contener letras y espacios.");
            return;
        }

        // Teléfono representante
        if (representativePhone &&!/^9\d{8}$/.test(representativePhone)) {
            setError("El teléfono del representante debe tener 9 dígitos y empezar con 9.");
            return;
        }

        // RUC
        if (taxId &&!/^(10|20)\d{9}$/.test(taxId)) {
            setError("El RUC debe tener 11 dígitos y comenzar con 10 o 20.");
            return;
        }

        // Contacto
        if (contact &&!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s']{1,60}$/.test(contact.trim())) {
            setError("El nombre del contacto solo puede contener letras y espacios.");
            return;
        }

        // Teléfono contacto
        if (contactPhone &&!/^9\d{8}$/.test(contactPhone)) {
            setError("El teléfono del contacto debe tener 9 dígitos y empezar con 9.");
            return;
        }
        try {
            await axios.put(`${API_BASE_URL}/organizations/${orgcod}`, {
                name,
                address,
                phone,
                legalRepresentative,
                representativePhone,
                taxId,
                contact,
                contactPhone,
                status,
                comments,
            });
            alert("Organización editada correctamente");
            navigate("/organizations");
        } catch (err) {
            console.error("Error al editar la organización:", err);
            setError("Error al editar la organización.");
        }
    };   

    return (
        <div className="ro-container">
            <header className="ro-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span>{orgcod ? "Modificar Organización" : "Registrar Organización"}</span>
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
                    <h2>{orgcod ? "MODIFICAR ORGANIZACIÓN" : "EDITAR ORGANIZACIÓN"}</h2>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo">Código </label>
                            <label className="ro-version">Versión</label>
                            <label className="ro-Fecha">Fecha</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="text" className="inputBloq-field" value={code} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input type="text" className="inputBloq-field" value={version} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input type="text" className="inputBloq-field" value={creationDate} readOnly size="30" />
                            </div>
                        </div>
                    </section>

                    <section className="ro-organization-section">
                        {/* Formulario editable */}
                        <h3>Información de la Organización</h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Nombre</h4>
                                <span class="message">
                                    <input
                                        className="inputnombre-field"
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,&'-]*$/.test(value) && value.length <= 60) {
                                            setNombre(value);
                                            setErrorNombre("");
                                            } else if (value.length > 60) {
                                            setErrorNombre("Máximo 100 caracteres.");
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!name.trim()) {
                                            setErrorNombre("El nombre de la empresa es obligatorio.");
                                            }
                                        }}
                                        maxLength={60}
                                        size="30"
                                        />
                                        {errorNombre && <p style={{ color: 'red', margin: 0 }}>{errorNombre}</p>}
                                    <span class="tooltip-text">Ingresar el nombre de la organización</span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Dirección</h4>
                                <span class="message">
                                    <input
                                        className="inputnombre-field"
                                        type="text"
                                        value={address}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,\-#°º()\/]*$/.test(value) && value.length <= 50) {
                                            setDireccion(value);

                                            } else if (value.length > 50) {
                                            setErrorDireccion("Máximo 100 caracteres.");
                                            }
                                            }
                                        }
                                        maxLength={50}
                                        size="30"
                                        />
                                        {errorDireccion && <p style={{ color: 'red', margin: 0 }}>{errorDireccion}</p>}
                                    <span class="tooltip-text">Ingresar la direccion de la organización </span>
                                </span>
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Teléfono Organización</h4>
                                <span class="message">
                                <input
                                    className="inputnombre-field"
                                    type="text"
                                    value={phone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 9) {
                                            setTelefonoOrganizacion(value);

                                            // Validación en vivo: si tiene 9 dígitos y empieza con 9, quitar error
                                            if (/^9\d{8}$/.test(value)) {
                                                setErrorTelefono("");
                                            } else if (value.length === 9) {
                                                setErrorTelefono("El número debe comenzar con 9.");
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                    if (phone && phone.length !== 9) {
                                        setErrorTelefono("Ingrese un teléfono válido");
                                    }
                                    }}
                                    size="30"
                                    />
                                    {errorTelefono && <p style={{ color: 'red', margin: 0 }}>{errorTelefono}</p>}
                                    <span class="tooltip-text">Ingresar el numero telefonico o celular de la organización </span>
                                </span>
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Representante Legal</h4>
                                <span class="message">
                                    <input
                                        className="inputnombre-field"
                                        type="text"
                                        value={legalRepresentative}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            // Solo permitir letras, espacios y apóstrofe mientras se escribe
                                            if (value.length <= 60) {
                                            setRepresentanteLegal(value);

                                            // Validar mientras escribe
                                            if (/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s']*$/.test(value)) {
                                                setErrorRepresentanteLegal(""); // válido
                                            } else {
                                                setErrorRepresentanteLegal("Solo se permiten letras.");
                                            }
                                            }
                                        }}
                                        maxLength={60}
                                        size="30"
                                        />

                                        {errorRepresentanteLegal && (
                                        <p style={{ color: "red", margin: 0 }}>{errorRepresentanteLegal}</p>
                                        )}
                                    <span class="tooltip-text"> Ingresar apellidos y nombres del representante legal de la organización </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Teléfono Representante</h4>
                                <span class="message">
                                    <input
                                    className="inputnombre-field"
                                    type="text"
                                    value={representativePhone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 9) {
                                            setTelefonoRepresentante(value);

                                            // Validación en vivo: si tiene 9 dígitos y empieza con 9, quitar error
                                            if (/^9\d{8}$/.test(value)) {
                                                setErrorRepresentante("");
                                            } else if (value.length === 9) {
                                                setErrorRepresentante("El número debe comenzar con 9.");
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                    if (representativePhone && representativePhone.length !== 9) {
                                        setErrorRepresentante("Ingrese un teléfono válido");
                                    }
                                    }}
                                    size="30"
                                    />
                                    {errorRepresentante && <p style={{ color: 'red', margin: 0 }}>{errorRepresentante}</p>}
                                    <span class="tooltip-text"> Ingresar el numero telefonico o celular del representante legal </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>RUC Organización</h4>
                                <span class="message">
                                    <input
                                        className="inputnombre-field"
                                        type="text"
                                        value={taxId}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 11) {
                                            setRuc(value);

                                            // Validación en vivo: si empieza con 10 o 20 y tiene 11 dígitos
                                            if (/^(10|20)\d{9}$/.test(value)) {
                                                setErrorRuc("");
                                            } else if (value.length === 11) {
                                                setErrorRuc("El RUC debe comenzar con 10 o 20.");
                                            } else {
                                                setErrorRuc(""); // no mostrar errores mientras escribe menos de 11 dígitos
                                            }
                                            }
                                        }}
                                        onBlur={() => {
                                            if (taxId && !/^(10|20)\d{9}$/.test(taxId)) {
                                            setErrorRuc("Ingrese un RUC válido.");
                                            }
                                        }}
                                        maxLength={11}
                                        size="30"
                                        />
                                        {errorRuc && <p style={{ color: 'red', margin: 0 }}>{errorRuc}</p>}
                                    <span class="tooltip-text"> Ingresar el numero de Ruc de la organizacion </span>
                                </span>
                                
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Contacto (Nombre y Apellido)</h4>
                                <span class="message">
                                    <input
                                        className="inputnombre-field"
                                        type="text"
                                        value={contact}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            // Solo permitir letras, espacios y apóstrofe mientras se escribe
                                            if (value.length <= 60) {
                                            setContacto(value);

                                            // Validar mientras escribe
                                            if (/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s']*$/.test(value)) {
                                                setErrorContacto(""); // válido
                                            } else {
                                                setErrorContacto("Solo se permiten letras.");
                                            }
                                            }
                                        }}
                                    
                                        maxLength={60}
                                        size="30"
                                        />

                                        {errorContacto && (
                                        <p style={{ color: "red", margin: 0 }}>{errorContacto}</p>
                                        )}
                                    <span class="tooltip-text"> Ingresar los apellidos y nombres del contacto en la organización </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Teléfono del Contacto</h4>
                                <span class="message">
                                    <input
                                    className="inputnombre-field"
                                    type="text"
                                    value={contactPhone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 9) {
                                            setTelefonoContacto(value);

                                            // Validación en vivo: si tiene 9 dígitos y empieza con 9, quitar error
                                            if (/^9\d{8}$/.test(value)) {
                                                setErrorTelefonoContacto("");
                                            } else if (value.length === 9) {
                                                setErrorTelefonoContacto("El número debe comenzar con 9.");
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                    if (contactPhone && contactPhone.length !== 9) {
                                        setErrorTelefonoContacto("Ingrese un teléfono válido");
                                    }
                                    }}
                                    size="30"
                                    />
                                    {errorTelefonoContacto && <p style={{ color: 'red', margin: 0 }}>{errorTelefonoContacto}</p>}
                                    <span class="tooltip-text"> Ingresar el nuemero teléfonico o celular del contacto </span>
                                </span>
                                
                            </div>
                            
                            <div className="ro-fiel-fecha">
                                <h4>Estado</h4>
                                <select
                                    value={status}
                                    onChange={(e) => setEstado(e.target.value)}
                                    
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                
                            </div>   
                        </div>
                    
                    </section>
                    <section className="ro-organizations-section">
                        <h3>Comentario</h3>
                        <div className="input-text">
                            <textarea
                                className="input-fieldtext"
                                rows="3"
                                value={comments}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 300) {
                                    setComentario(value);
                                    }
                                }}
                                maxLength={300}
                                placeholder="Añadir comentarios y/o dato importante de la organización"
                                />
                                <p style={{ fontSize: '0.8rem', textAlign: 'right', marginTop: 2 }}>
                                {comments.length}/300
                                </p>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="ro-cod-vers">
                            <button className="ro-button" onClick={handleEdit}>Guardar Cambios</button>
                            <button onClick={irAMenuOrganizaciones} className="ro-button">Cancelar</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarOrganizacion;
