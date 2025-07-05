import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaFolder, FaPencilAlt, FaTrash } from "react-icons/fa";
import "../../../styles/stylesExpertos.css";
import "../../../styles/styles.css";

const Expertos = () => {

  const location = useLocation();
  const {projcod,orgcod} = useParams();
  const { proid} = location.state || {};
  const [organizacion, setOrganizacion] = useState({});
  const [proyecto, setProyecto] = useState({});

  // Estado de proyectos y errores
  const [expertos, setExpertos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
  // Estado para los parámetros de búsqueda
  const [searchNombre, setSearchNombre] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchMonth, setSearchMonth] = useState("");

  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [mensajePopup, setMensajePopup] = useState("");
  const [codigoAEliminar, setCodigoAEliminar] = useState("");

  // Variables de Enrutamiento
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  const irAMenuOrganizaciones = () => {
    navigate("/organizations");
  };
  const irAListaProyecto = () => {
    navigate(`/organizations/${orgcod}/projects`);
  };
  const irAMenuProyecto = (code) => {
    //navigate(`/menuProyecto?procod=${code}`);
    navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`,{
        state: {
            proid:proid
        }
    });
  };

  const irANuevoExperto = () => {
    navigate(`/organizations/${orgcod}/projects/${projcod}/experts/new`,{
        state: {
            proid:proid
        }
    });
  };

 
  const irAEditarExperto = (expcod) => {
    navigate(`/organizations/${orgcod}/projects/${projcod}/experts/${expcod}`,{
        state: {
            proid:proid
        }
    });
  };

  const irALogin = () => {
    navigate("/");
  };
  const irAPlantillas = () => {
    navigate(`/organizations/${orgcod}/projects/${projcod}/plantillas`,{
        state: {
            proid:proid
        }
    });
  };

  

  const fetchExpertos = useCallback(async () => {
    //Obtener o listar expertos de un proyecto
    try {
      const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/experts`);
      setExpertos(response.data||[]);
    } catch (err) {
      setError(
        err.response
          ? err.response.data.error
          : "Error al obtener los proyectos"
      );
    }
  }, [projcod,orgcod,API_BASE_URL]);

  useEffect(() => {
    
    fetchExpertos();
    
  }, [fetchExpertos]);

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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Función para eliminar un Experto
  const deleteExpert = async (codigo) => {
    try {
      await axios.delete(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/experts/${codigo}`);
      fetchExpertos(); // Refrescar la lista de proyectos después de eliminar uno
      setMensajePopup("Experto eliminado correctamente.");
    } catch (err) {
      setMensajePopup("Error al eliminar el experto");
      setError(err.response?.data?.error || "Error al eliminar el experto");
    } finally {
        setTimeout(() => {
          cerrarPopup();
          setMensajePopup(""); 
        }, 1500);
    }
  };

  //funcion para buscaar proyectos por fecha y nombre
  const handleSearch = async () => {
        setLoading(true);
        try {
            let response;
            if (searchNombre) {
                // Búsqueda por nombre
                response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/experts/search`, {
                    params: { firstName: searchNombre }
                });
            } else {
                // Sin criterios de búsqueda
                response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/experts`);
            }
            
            const filteredData = response.data.filter(exp => exp.code !== "ORG-MAIN");
            setExpertos(filteredData);
            //setNoResult(filteredData.length === 0);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "Error al buscar organizaciones");
        } finally {
            setLoading(false);
        }
    };
  
  const exportToExcel = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/experts/exports/excel`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Expertos.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a Excel");
        }
    };

    // Exportar a PDF
    const exportToPDF = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/experts/exports/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Expertos.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a PDF");
        }
    };

    //Abrir popup de eliminar experto
    const abrirPopup = (code) => {
        setCodigoAEliminar(code);
        setMostrarPopup(true);
    };
      
    //Cerrar popup de eliminar experto
    const cerrarPopup = () => {
        setMostrarPopup(false);
    };
      
    //Confirma eliminar experto, envia código de experto
    const confirmarEliminacion = () => {
        if (codigoAEliminar) {
            deleteExpert(codigoAEliminar);
        }
    };


  return (
    <div className="expe-container">
      <header className="expe-header">
        <h1>ReqWizards App</h1>
        <div className="flex-container">
          <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
          <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
          <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
          <span onClick={irAPlantillas}>Plantillas /</span>
          <span>Expertos</span>

        </div>
      </header>

      <div className="expesub-container">
        <aside className="expe-sidebar">
          <div className="bar-expe">
            <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
          </div>

          <div className="expe-profile-section">
            <div className="expe-profile-icon">👤</div>
            <p2>Nombre Autor - Cod</p2>
            <button onClick={irALogin} className="expe-logout-button">
              Cerrar Sesión
            </button>
          </div>
        </aside>

        <main className="expe-content">
          <h2>EXPERTOS</h2>
          <section className="expe-organizations-section">
            <div className="expe-search-section-bar">
              <button
                onClick={irANuevoExperto}
                className="expe-register-button"
              >
                Nuevo Experto
              </button>
              <div className="expe-sectionTextBuscar">
                <span class="message">
                  <input
                    class="expe-textBuscar"
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchNombre}
                    onChange={(e) => setSearchNombre(e.target.value)}
                  />
                  <span class="tooltip-text">
                    Filtro de búsqueda por nombre del experto
                  </span>
                </span>

                <button className="expe-search-button" onClick={handleSearch}>
                  Buscar
                </button>
              </div>
            </div>

            {/*<div className="expe-search-section-text">
              <div className="expe-searchbar">
                <select
                  className="expe-year-input"
                  value={searchYear}
                  onChange={(e) => setSearchYear(e.target.value)}
                >
                  <option value="">AÑO</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  className="expe-month-input"
                  value={searchMonth}
                  onChange={(e) => setSearchMonth(e.target.value)}
                >
                  <option value="">MES</option>
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error ? (
            <p>{error}</p>
          ) : (
           */}
            <table className="expe-centertabla">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Fecha</th>
                  <th>Versión</th>
                  <th>Experiencia</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {expertos.map((experto) => (
                  <tr key={experto.code}>
                    <td>{experto.code}</td>
                    <td>{experto.firstName}</td>
                    <td>{new Date(experto.creationDate).toLocaleDateString()}</td>
                    <td>{experto.version}</td>
                    <td>{experto.experience}</td>
                    <td>
                      <button
                        className="botton-crud"
                        onClick={(e) => {
                          e.stopPropagation();
                          irAEditarExperto(experto.code); // Llama a la función para editar
                        }}
                      >
                        <FaPencilAlt
                          style={{ color: "blue", cursor: "pointer" }}
                        />
                      </button>
                      <button
                        className="botton-crud"
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que el clic se propague al <tr>
                          abrirPopup(experto.code); // Llama a la función de eliminación
                        }}
                      >
                        <FaTrash
                          style={{ color: "red", cursor: "pointer" }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          

          {mostrarPopup && (
              <div className="popup-overlay">
              <div className="popup-content">
              {mensajePopup ? (
                <p>{mensajePopup}</p>
                  ) : (
                  <>
                <p>¿Está seguro de eliminar el experto <strong>{codigoAEliminar}</strong> ? </p>
                <button onClick={confirmarEliminacion} className="si-button">Sí</button>
                <button onClick={cerrarPopup} className="no-button">No</button>
                   </>
                )}
                </div>
              </div>
            )}

            <div className="ro-buttons">
              <button
                onClick={irAPlantillas}
                className="ro-button"
                size="50"
              >
                Atras
              </button>
            </div>

            <h4 className="expe-h4">
              {expertos.length === 0 ? (
                <p>No hay expertos registrados.</p>
              ) : (
                <table className="expe-centertabla">
                  <thead>{/* Encabezados */}</thead>
                  <tbody>
                    {expertos.map((pro) => (
                      <tr key={pro.code}>{/* Celdas */}</tr>
                    ))}
                  </tbody>
                </table>
              )}
            </h4>
            <div className="expe-export-buttons">
              <button className="expe-export-button"onClick={exportToExcel}>Excel</button>
              <button className="expe-export-button"onClick={exportToPDF}>PDF</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Expertos;
