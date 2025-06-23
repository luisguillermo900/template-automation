// frontend/src/app.js
import Login from './view/Login.js';
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import MenuOrganizaciones from './view/Organizacion/MenuOrganizaciones.js';
import RegistroOrganizacion from './view/Organizacion/RegistroOrganizacion.js';
import EditarOrganizacion from './view/Organizacion/EditarOrganizacion.js';
import ListaProyectos from './view/Proyecto/ListaProyectos.js';
import RegistroProyecto from './view/Proyecto/RegistroProyecto.js';
import EditarProyecto from './view/Proyecto/EditarProyecto.js';
import MenuProyecto from './view/Proyecto/MenuProyecto.js';
import ActaAceptacion from './view/Proyecto/ActaAceptacion/ActaAceptacion.js';
import Autores from './view/Proyecto/Autores/Autores.js';
import NuevoAutor from './view/Proyecto/Autores/NuevoAutor.js';
import EditarAutor from './view/Proyecto/Autores/EditarAutor.js';
import Roles from './view/Proyecto/Roles/Roles.js';
import NuevoRol from './view//Proyecto/Roles/NuevoRol.js';
import EditarRol from './view/Proyecto/Roles/EditarRol.js';
import Entrevistas from './view/Proyecto/Entrevistas/Entrevistas.js';
import NuevaEntrevista from './view/Proyecto/Entrevistas/NuevaEntrevista.js';
import EditarEntrevista from './view/Proyecto/Entrevistas/EditarEntrevista.js';
import NuevaEvidencia from './view/Proyecto/Entrevistas/NuevaEvidencia.js';
import Plantillas from './view/Plantillas/Plantillas.js';
import Educcion from './view/Plantillas/Educcion/Educcion.js';
import Ilacion from './view/Plantillas/Ilacion/Ilacion.js';
import NuevaEduccion from './view/Plantillas/Educcion/NuevaEduccion.js';
import EditarEduccion from './view/Plantillas/Educcion/EditarEduccion.js';
import NuevaIlacion from './view/Plantillas/Ilacion/NuevaIlacion.js';
import EditarIlacion from './view/Plantillas/Ilacion/EditarIlacion.js';
import Artefactos from './view/Plantillas/Artefactos/Artefactos.js';
import RegistroRiesgo from './view/Plantillas/Riesgos/RegistroRiesgo.js';
import EditarRiesgo from './view/Plantillas/Riesgos/EditarRiesgo.js';
import Actores from './view/Plantillas/Actores/Actores.js';
import NuevoActor from './view/Plantillas/Actores/NuevoActor.js';
import EditarActor from './view/Plantillas/Actores/EditarActor.js';
import Expertos from './view/Plantillas/Expertos/Expertos.js';
import NuevoExperto from './view/Plantillas/Expertos/NuevoExperto.js';
import EditarExperto from './view/Plantillas/Expertos/EditarExperto.js';
import Fuentes from './view/Plantillas/Fuentes/Fuentes.js';
import NuevaFuente from './view/Plantillas/Fuentes/NuevaFuente.js';
import EditarFuente from './view/Plantillas/Fuentes/EditarFuente.js';
import Especificacion from './view/Plantillas/Especificacion/Especificacion.js';
import NuevaEspecificacion from './view/Plantillas/Especificacion/NuevaEspecificacion.js';
import EditarEspecificacion from './view/Plantillas/Especificacion/EditarEspecificacion.js';
import NuevoNemonico from './view/Plantillas/Artefactos/NuevoNemonico.js';
import SubirInterfaz from './view/Plantillas/Artefactos/SubirInterfaz.js';
import RNF from './view/Plantillas/RNF/RNF.js';
import NuevoRNF from './view/Plantillas/RNF/NuevoRNF.js';
import EditarRNF from './view/Plantillas/RNF/EditarRNF.js';
import PruebasSoftware from './view/Plantillas/PruebasSoftware/PruebasSoftware.js';
import NuevaPS from './view/Plantillas/PruebasSoftware/NuevaPS.js';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* Organizaciones */}
          <Route path="/organizations" element={<MenuOrganizaciones />} />
          <Route path="/organizations/new" element={<RegistroOrganizacion />} />
          <Route path="/organizations/:orgcod" element={<EditarOrganizacion />} />
          
          {/* Proyectos */}
          <Route path="/organizations/:orgcod/projects" element={<ListaProyectos />} />
          <Route path="/organizations/:orgcod/projects/new" element={<RegistroProyecto />} />
          <Route path="/organizations/:orgcod/projects/:projcod" element={<EditarProyecto />} />
          <Route path="/organizations/:orgcod/projects/:projcod/menuProyecto" element={<MenuProyecto />} />

          {/* Entrevistas */}
          <Route path="/organizations/:orgcod/projects/:projcod/entrevistas" element={<Entrevistas />} />
          <Route path="/organizations/:orgcod/projects/:projcod/entrevistas/new" element={<NuevaEntrevista />} />
          <Route path="/organizations/:orgcod/projects/:projcod/entrevistas/:entrecod" element={<EditarEntrevista />} />
          <Route path="/organizations/:orgcod/projects/:projcod/evidencias/new" element={<NuevaEvidencia />} />

          {/* Educciones }
          //<Route path="/projects/:projcod/educciones" element={<Educcion />} />
          //<Route path="/projects/:projcod/educciones/new" element={<NuevaEduccion />} />
          { <Route path="/projects/:projcod/educciones/:educod" element={<EditarEduccion />} /> */}
          {/* <Route path="/educcion" element={<Educcion />} />
          <Route path="/nuevaEduccion" element={<NuevaEduccion />} /> */}

          {/* Ilaciones */}
          {/*<Route path="/educciones/:educod/ilaciones" element={<Ilacion />} />
          <Route path="/educciones/:educod/ilaciones/new" element={<NuevaIlacion />} />
          <Route path="/educciones/:educod/ilaciones/:ilacod" element={<EditarIlacion />} />*/}
          <Route path="/organizations/:orgcod/projects/:projcod/actaAceptacion" element={<ActaAceptacion />} />
          
          <Route path="/roles" element={< Roles/>} />
          <Route path="/nuevoRol" element={<NuevoRol />} />
          <Route path="/editarRol/:rolCod" element={<EditarRol />} />
          <Route path="/organizations/:orgcod/projects/:projcod/plantillas" element={<Plantillas />} />
          <Route path="/organizations/:orgcod/projects/:projcod/educcion" element={<Educcion />} />
          <Route path="/organizations/:orgcod/projects/:projcod/educcion/new" element={<NuevaEduccion />} />
          <Route path="/organizations/:orgcod/projects/:projcod/educcion/:educod" element={<EditarEduccion />} />
          <Route path="/organizations/:orgcod/projects/:projcod/educcion/:educod/ilaciones" element={<Ilacion />} />
          <Route path="/organizations/:orgcod/projects/:projcod/educcion/:educod/ilaciones/new" element={<NuevaIlacion />} />
          <Route path="/organizations/:orgcod/projects/:projcod/educcion/:educod/ilaciones/:ilacod" element={<EditarIlacion />} />
          <Route path="/organizations/:orgcod/projects/:projcod/artifacts" element={<Artefactos />} />
          <Route path="/organizations/:orgcod/projects/:projcod/riesgoNew" element={<RegistroRiesgo />} />
          <Route path="/organizations/:orgcod/projects/:projcod/riesgo/:rskcode" element={<EditarRiesgo />} />
        
          <Route path="/organizations/:orgcod/projects/:projcod/experts" element={<Expertos />} />   
          {/*Fuentes*/} 
          <Route path="/organizations/:orgcod/projects/:projcod/sources" element={<Fuentes />} />   
          <Route path="/organizations/:orgcod/projects/:projcod/sources/new" element={<NuevaFuente />} /> 
          <Route path="/organizations/:orgcod/projects/:projcod/sources/:fuecod" element={<EditarFuente />} />
          {/*Especificaciones*/} 
          <Route path="/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications" element={<Especificacion />} />
          <Route path="/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications/new" element={<NuevaEspecificacion />} />
          <Route path="/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications/:specod" element={<EditarEspecificacion />} />
          {/*Autores
          organizations/ORG-001/projects/PROJ-001/autores/AUT-001        
          */} 
          <Route path="/organizations/:orgcod/projects/:projcod/authors" element={<Autores />} />
          <Route path="/organizations/:orgcod/projects/:projcod/authors/new" element={<NuevoAutor />} />
          <Route path="/authors/:autcod" element={<EditarAutor />} />
           
          <Route path="/organizations/:orgcod/projects/:projcod/actors" element={<Actores />} />
          <Route path="/organizations/:orgcod/projects/:projcod/actors/new" element={<NuevoActor />} />  
          <Route path="/organizations/:orgcod/projects/:projcod/actors/:actcod" element={<EditarActor />} /> 

          <Route path="/organizations/:orgcod/projects/:projcod/experts/new" element={<NuevoExperto />} /> 
          <Route path="/organizations/:orgcod/projects/:projcod/experts/:expcod" element={<EditarExperto />} /> 
      
          <Route path="/organizations/:orgcod/projects/:projcod/artifacts/new" element={<NuevoNemonico />} />
          <Route path="/organizations/:orgcod/projects/:projcod/artifacts/subirInterfaz" element={<SubirInterfaz />} />
          <Route path="/organizations/:orgcod/projects/:projcod/rnf" element={<RNF />} />
          <Route path="/organizations/:orgcod/projects/:projcod/rnf/new" element={<NuevoRNF />} />
          <Route path="/organizations/:orgcod/projects/:projcod/rnf/:rnfcod" element={<EditarRNF />} />
          <Route path="/PruebasSoftware" element={<PruebasSoftware />} />
          <Route path="/NuevaPS" element={<NuevaPS />} />

        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
