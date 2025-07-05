import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate,useParams } from "react-router-dom";
import axios from "axios";
import { FaFolder, FaPencilAlt, FaTrash } from "react-icons/fa";
import "../../../styles/stylesExpertos.css";
import "../../../styles/styles.css";

const Fuentes = () => {
  // Variables de enrutamiento
  const location = useLocation();
  const navigate = useNavigate();
  const {orgcod, projcod } = useParams();
  const [organizacion, setOrganizacion] = useState({});
  const [proyecto, setProyecto] = useState({});

  // Estado de proyectos y errores
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
      
    // Estado para los parámetros de búsqueda
    const [searchNombre, setSearchNombre] = useState("");
    const [searchYear, setSearchYear] = useState("");
    const [searchMonth, setSearchMonth] = useState("");

      const [mostrarPopup, setMostrarPopup] = useState(false);
      const [mensajePopup, setMensajePopup] = useState("");
      const [codigoAEliminar, setCodigoAEliminar] = useState("");
  
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const fetchSources = useCallback(async () => {
    //Obtener o listar fuentes de un proyecto
    try {
      const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources`);
      setSources(response.data||[]);
    } catch (err) {
      setError(
        err.response
          ? err.response.data.error
          : "Error al obtener las fuentes"
      );
    }
  }, [projcod,orgcod,API_BASE_URL]);

  useEffect(() => {
      
      fetchSources();
      
    }, [fetchSources]);

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


  const irAMenuOrganizaciones = () => {
    navigate("/organizations");
  };
  const irAListaProyecto = () => {
    navigate(`/organizations/${orgcod}/projects`);
  };
  const irAMenuProyecto = (code) => {
    //navigate(`/menuProyecto?procod=${code}`);
    navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`);
  };
    
  const irANuevaFuente = () => {
    navigate(`/organizations/${orgcod}/projects/${projcod}/sources/new`);
  };
  const irAEditarFuente = (fuecod) => {
    navigate(`/organizations/${orgcod}/projects/${projcod}/sources/${fuecod}`);
  };
  const irALogin = () => {
    navigate("/");
  };

  const irAPlantillas = () => {
     navigate(`/organizations/${orgcod}/projects/${projcod}/plantillas`);
  };
  // Obtener los parámetros de consulta
   // Obtener 'orgcod' de los parámetros de consulta

  const handleSearch = async () => {
  try {
      setLoading(true);
      let endpoint;
      let params = {};

      // Determinar qué tipo de búsqueda realizar
      if (searchNombre) {
          // Búsqueda por nombre
          endpoint = `${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/search`;
          params.name = searchNombre;
      } else if (searchYear || searchMonth) {
          // Búsqueda por fecha
          endpoint = `${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/search/date`;
          if (searchYear) params.year = searchYear;
          if (searchMonth) params.month = searchMonth;
      } else {
          // Si no hay criterios de búsqueda, cargar todos los proyectos
          await fetchSources();
          return;
      }

      const response = await axios.get(endpoint, { params });
      setSources(response.data);
      setError(null);
  } catch (err) {
      console.error("Error en la búsqueda:", err);
      setError(err.response?.data?.error || "Error al buscar fuentes");
      setSources([]);
  } finally {
      setLoading(false);
  }
};
// Eliminar una fuente 
  const deleteSource = async (codigo) => {
    try {
      // /organizations/:orgcod/projects/:projcod/sources/:srccod'
      await axios.delete(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/${codigo}`);
      fetchSources(); // Refrescar la lista de fuentes después de eliminar uno
      setMensajePopup("Fuente eliminada correctamente.");
    } catch (err) {
      setMensajePopup("Error al eliminar la fuente");
      setError(err.response?.data?.error || "Error al eliminar la fuente");
    } finally {
        setTimeout(() => {
          cerrarPopup();
          setMensajePopup(""); 
        }, 1500);
    }
  };
// Exportar a Excel
    const exportToExcel = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/exports/excel`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Fuentes.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a Excel");
        }
    };

    // Exportar a PDF
    const exportToPDF = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/exports/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Fuentes.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a PDF");
        }
    };
  
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

  //Abrir popup de eliminar fuente
      const abrirPopup = (code) => {
        setCodigoAEliminar(code);
        setMostrarPopup(true);
    };
      
    //Cerrar popup de eliminar fuente
    const cerrarPopup = () => {
        setMostrarPopup(false);
    };
      
    //Confirma eliminar fuente, envia código de fuente
    const confirmarEliminacion = () => {
        if (codigoAEliminar) {
            deleteSource(codigoAEliminar);
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
          <span>Fuentes</span>

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
          <h2>FUENTES</h2>
          <section className="expe-organizations-section">
            <div className="expe-search-section-bar">
              <button
                onClick={irANuevaFuente}
                className="expe-register-button"
              >
                Nueva Fuente
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
                    Filtro de búsqueda por nombre de la Fuente
                  </span>
                </span>

                <button className="expe-search-button" onClick={handleSearch}>
                  Buscar
                </button>
              </div>
            </div>


            {error ? (
              <p>{error}</p>
            ) : (
              <table className="expe-centertabla">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Fecha creacion</th>
                    <th>Fecha Modificacion</th>
                    <th>Estado</th>
                    <th>Version</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sources.map((source) => (
                    <tr key={source.code} onClick={() => irAEditarFuente(source.code)}>
                      <td>{source.code}</td>
                      <td>{source.name}</td>
                      <td>{new Date(source.creationDate).toLocaleDateString()}</td>
                      <td>
                        {new Date(source.modificationDate).toLocaleDateString()}
                      </td>
                      <td>{source.status}</td>
                      <td>{source.version}</td>
                      <td>
                        <button
                          className="botton-crud"
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que el clic se propague al <tr>
                            irAEditarFuente(source.code); // Llama a la función para editar
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
                            abrirPopup(source.code);//deleteProject(source.code); // Llama a la función de eliminación
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
              
            )}

            {mostrarPopup && (
              <div className="popup-overlay">
              <div className="popup-content">
              {mensajePopup ? (
                <p>{mensajePopup}</p>
                  ) : (
                  <>
                <p>¿Está seguro de eliminar la fuente <strong>{codigoAEliminar}</strong> ? </p>
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
              {sources.length === 0 ? (
                <p>No hay fuentes registradas.</p>
              ) : (
                <table className="expe-centertabla">
                  <thead>{/* Encabezados */}</thead>
                  <tbody>
                    {sources.map((pro) => (
                      <tr key={pro.procod}>{/* Celdas */}</tr>
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

export default Fuentes;
