// frontend/src/view/RegistroOrganizacion.js
import React, { useState,useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../../styles/stylesRegistroOrganizacion.css';
import '../../styles/styles.css';
import axios from "axios";

const RegistroOrganizacion = () => {
    const navigate = useNavigate();
    const hasFetched = useRef(false);
    // Datos automáticos
    const [code, setCodigo] = useState("");
    const [version] = useState("01.00");
    const [creationDate] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
    );

    // Datos controlados por el usuario
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

    // Estados para manejar errores y carga
    const [errorNombre, setErrorNombre] = useState("");
    const [errorDireccion, setErrorDireccion] = useState("");
    const [errorRepresentanteLegal, setErrorRepresentanteLegal] = useState("");
    const [errorTelefono, setErrorTelefono] = useState("");
    const [errorRuc, setErrorRuc] = useState("");
    const [errorContacto, setErrorContacto] = useState("");
    const [errorTelefonoContacto, setErrorTelefonoContacto] = useState("");
    const [errorRepresentante, setErrorRepresentante] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // Datos fijos
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    // Obtener el siguiente código al cargar la interfaz
    useEffect(() => {
        if (hasFetched.current) return; // Previene segunda ejecución
        hasFetched.current = true;

        const fetchNextCode = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/organizations/next-code`);
                setCodigo(response.data.nextCode || "ORG-001");
            } catch (err) {
                console.error("Error al obtener el siguiente código:", err);
                setError("No se pudo cargar el código. Intenta más tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNextCode();
    }, [API_BASE_URL]);

    // Redirigir a la lista de organizaciones
    const irAMenuOrganizaciones = () => { navigate("/organizations"); };

    // Registrar una nueva organización
    const handleRegister = async (e) => {
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
            await axios.post(`${API_BASE_URL}/organizations`, {
                code,
                version,
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
            alert("Organización registrada correctamente");
            irAMenuOrganizaciones();
        } catch (err) {
            console.error("Error al registrar la organización:", err);
            setError(err.response?.data?.error || "Error al registrar la organización.");
        }
    };

    return (
        <div className="ro-container">
            <header className="ro-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span>Registro de organización</span>
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
                    <h2>NUEVA ORGANIZACIÓN</h2>
                    <section className="ro-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código </label>
                            <label className="ne-label">Version</label>
                            <label className="ne-label">Fecha*</label>
                        </h3>

                        <div className="ne-input-container">
                            <input disabled type="text" className="ne-input" value={isLoading ? "Cargando..." : code}  readOnly />
                            <input disabled type="text" className="ne-input" value={version} readOnly />
                            <input disabled type="text" className="ne-input" value={creationDate} readOnly />
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
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Tipo</h4>
                                <input type="text" className="inputBloq-field" value="Contratante" readOnly size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Autor</h4>
                                <input type="text" className="inputBloq-field" value="AUT-000" readOnly size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Estado</h4>
                                <select
                                    className="inputnombre-field"
                                    value={status}
                                    onChange={(e) => setEstado(e.target.value)}
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
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

                        <div className="ro-buttons">
                            <button onClick={irAMenuOrganizaciones} className="ro-button">Cancelar</button>
                            <button onClick={handleRegister} className="ro-button">Registrar</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default RegistroOrganizacion;
