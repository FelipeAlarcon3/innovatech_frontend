import { useState, useEffect } from "react";
import Perfil from "./components/Perfil";
import axios from "axios";

const BFF = "http://localhost:8081/api/bff";

function App() {
  const [proyectos, setProyectos] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [vista, setVista] = useState("proyectos");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalProyectoAbierto, setModalProyectoAbierto] = useState(false);

  const [proyecto, setProyecto] = useState({
    nombre: "", descripcion: "", estado: "ACTIVO",
    tareasCompletadas: 0, tareasTotales: 0
  });

  const [recurso, setRecurso] = useState({
    nombre: "", rol: "DEV", equipo: "", disponible: true
  });

  const [recursoEditando, setRecursoEditando] = useState({
    id: "", nombre: "", rol: "DEV", equipo: "", disponible: true
  });

  const [proyectoEditando, setProyectoEditando] = useState({
    id: "", nombre: "", descripcion: "", estado: "ACTIVO",
    tareasCompletadas: 0, tareasTotales: 0
  });

  useEffect(() => {
    cargarProyectos();
    cargarRecursos();
  }, []);

  const cargarProyectos = () =>
    axios.get(`${BFF}/proyectos`).then(r => setProyectos(r.data)).catch(() => {});

  const cargarRecursos = () =>
       axios.get(`${BFF}/recursos`).then(r => setRecursos(r.data)).catch(() => {});

  const crearProyecto = () => 
    axios.post(`${BFF}/proyectos`, proyecto).then(() => {
      cargarProyectos();
      setProyecto({ nombre: "", descripcion: "", estado: "ACTIVO", tareasCompletadas: 0, tareasTotales: 0 });
    });

  const eliminarProyecto = (id) => {
       axios.delete(`${BFF}/proyectos/${id}`).then(cargarProyectos);
  };

  const crearRecurso = () => {
    axios.post(`${BFF}/recursos`, recurso).then(() => {
      cargarRecursos();
      setRecurso({ nombre: "", rol: "DEV", equipo: "", disponible: true });
    });
  };

  const abrirEditarRecurso = (r) => {
    setRecursoEditando({ ...r });
    setModalAbierto(true);
  };

  const guardarEdicionRecurso = () => {
    axios.put(`${BFF}/recursos/${recursoEditando.id}`, recursoEditando).then(() => {
      cargarRecursos();
      setModalAbierto(false);
    }).catch(() => {});
  };

  const abrirEditarProyecto = (p) => {
    setProyectoEditando({ ...p });
    setModalProyectoAbierto(true);
  };

  const guardarEdicionProyecto = () => {
    axios.put(`${BFF}/proyectos/${proyectoEditando.id}`, proyectoEditando).then(() => {
      cargarProyectos();
      setModalProyectoAbierto(false);
    }).catch(() => {});
  };

  return (
    <div style={styles.app}>
      
      <header style={styles.header}>
        <div style={styles.headerText}>
          <h1 style={{ margin: 0, fontSize: "24px" }}>InnovaTech Solutions</h1>
          <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.9 }}>Plataforma de Gestión de Proyectos y Recursos</p>
        </div>

        <div style={styles.usuarioContenedor}>
          <div style={styles.avatar} onClick={() => setMenuAbierto(!menuAbierto)}>
            👤 <span style={{ marginLeft: 5, fontSize: "14px" }}>Mi Cuenta ▼</span>
          </div>

          {menuAbierto && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownItem} onClick={() => { setVista("perfil"); setMenuAbierto(false); }}>
                ⚙️ Configurar Perfil
              </div>
              <div style={{ ...styles.dropdownItem, color: "#c62828" }} onClick={() => alert("Cerrando sesión...")}>
                🚪 Cerrar Sesión
              </div>
            </div>
          )}
        </div>
      </header>

      <nav style={styles.nav}>
        <button style={vista === "proyectos" ? styles.btnActivo : styles.btn}
          onClick={() => setVista("proyectos")}>
          📋 Proyectos
        </button>
        <button style={vista === "recursos" ? styles.btnActivo : styles.btn}
          onClick={() => setVista("recursos")}>
          👥 Recursos
        </button>
      </nav>

      <main style={styles.main}>

        {vista === "proyectos" && (
          <div>
            <h2>Gestión de Proyectos</h2>
            <div style={styles.form}>
              <h3>Nuevo Proyecto</h3>
              <input style={styles.input} placeholder="Nombre"
                value={proyecto.nombre}
                onChange={e => setProyecto({...proyecto, nombre: e.target.value})} />
              <input style={styles.input} placeholder="Descripción"
                value={proyecto.descripcion}
                onChange={e => setProyecto({...proyecto, descripcion: e.target.value})} />
              <select style={styles.input} value={proyecto.estado}
                onChange={e => setProyecto({...proyecto, estado: e.target.value})}>
                <option value="ACTIVO">Activo</option>
                <option value="PAUSADO">Pausado</option>
                <option value="TERMINADO">Terminado</option>
              </select>
              <div style={{ marginBottom: 10, textAlign: "left" }}>
                <label style={{ fontSize: "14px", fontWeight: "bold", color: "#4a5568", display: "block", marginBottom: 4 }}>Tareas realizadas:</label>
                <input style={styles.inputZeroMargin} type="number" placeholder="Tareas realizadas"
                  value={proyecto.tareasCompletadas}
                  onChange={e => setProyecto({...proyecto, tareasCompletadas: parseInt(e.target.value) || 0})} />
              </div>
              <div style={{ marginBottom: 15, textAlign: "left" }}>
                <label style={{ fontSize: "14px", fontWeight: "bold", color: "#4a5568", display: "block", marginBottom: 4 }}>Tareas totales:</label>
                <input style={styles.inputZeroMargin} type="number" placeholder="Tareas totales"
                  value={proyecto.tareasTotales}
                  onChange={e => setProyecto({...proyecto, tareasTotales: parseInt(e.target.value) || 0})} />
              </div>
              <button style={styles.btnCrear} onClick={crearProyecto}>Crear Proyecto</button>
            </div>

            <div style={styles.lista}>
              {proyectos.length === 0 && <p>No hay proyectos aún.</p>}
              {proyectos.map(p => (
                <div key={p.id} style={styles.card}>
                  <div>
                    <h3>{p.nombre}</h3>
                    <p>{p.descripcion}</p>
                    <p>Estado: <strong>{p.estado}</strong></p>
                    <p>Avance: <strong>{p.avancePorcentaje}%</strong></p>
                    <div style={styles.barraFondo}>
                      <div style={{...styles.barra, width: `${p.avancePorcentaje}%`}} />
                    </div>
                    <p>Tareas: {p.tareasCompletadas} / {p.tareasTotales}</p>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button style={styles.btnEditarProyecto} onClick={() => abrirEditarProyecto(p)}>
                      ✏️ Editar
                    </button>
                    <button style={styles.btnEliminar} onClick={() => eliminarProyecto(p.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vista === "recursos" && (
          <div>
            <h2>Gestión de Recursos y Colaboración</h2>
            <div style={styles.form}>
              <h3>Nuevo Recurso</h3>
              <input style={styles.input} placeholder="Nombre"
                value={recurso.nombre}
                onChange={e => setRecurso({...recurso, nombre: e.target.value})} />
              <select style={styles.input} value={recurso.rol}
                onChange={e => setRecurso({...recurso, rol: e.target.value})}>
                <option value="DEV">Desarrollador</option>
                <option value="QA">QA Tester</option>
                <option value="PM">Project Manager</option>
                <option value="DISEÑADOR">Diseñador</option>
              </select>
              <input style={styles.input} placeholder="Equipo (ej: Alpha)"
                value={recurso.equipo}
                onChange={e => setRecurso({...recurso, equipo: e.target.value})} />
              <button style={styles.btnCrear} onClick={crearRecurso}>Agregar Recurso</button>
            </div>

            <div style={styles.lista}>
              {recursos.length === 0 && <p>No hay recursos aún.</p>}
              {recursos.map(r => (
                <div key={r.id} style={styles.card}>
                  <h3>{r.nombre}</h3>
                  <p>Rol: <strong>{r.rol}</strong></p>
                  <p>Equipo: <strong>{r.equipo}</strong></p>
                  <p>Estado: <span style={{color: r.disponible ? "green" : "red"}}>
                    {r.disponible ? "✅ Disponible" : "🔴 Asignado"}
                  </span></p>
                  <button style={styles.btnEditarRecurso} onClick={() => abrirEditarRecurso(r)}>
                    ✏️ Editar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {vista === "perfil" && (
          <div>
            <Perfil />
          </div>
        )}

      </main>

      {modalAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContenido}>
            <h3 style={{ marginTop: 0, color: "#1e293b" }}>Editar Colaborador</h3>
            <div>
              <label style={styles.labelModal}>Nombre:</label>
              <input style={styles.input} value={recursoEditando.nombre}
                onChange={e => setRecursoEditando({...recursoEditando, nombre: e.target.value})} />
              
              <label style={styles.labelModal}>Rol:</label>
              <select style={styles.input} value={recursoEditando.rol}
                onChange={e => setRecursoEditando({...recursoEditando, rol: e.target.value})}>
                <option value="DEV">Desarrollador</option>
                <option value="QA">QA Tester</option>
                <option value="PM">Project Manager</option>
                <option value="DISEÑADOR">Diseñador</option>
              </select>

              <label style={styles.labelModal}>Equipo:</label>
              <input style={styles.input} value={recursoEditando.equipo}
                onChange={e => setRecursoEditando({...recursoEditando, equipo: e.target.value})} />

              <label style={styles.labelModal}>Estado:</label>
              <select style={styles.input} value={recursoEditando.disponible ? "true" : "false"}
                onChange={e => setRecursoEditando({...recursoEditando, disponible: e.target.value === "true"})}>
                <option value="true">✅ Disponible</option>
                <option value="false">🔴 Asignado</option>
              </select>
            </div>
            <div style={styles.modalBotones}>
              <button style={styles.btnCancelarModal} onClick={() => setModalAbierto(false)}>Cancelar</button>
              <button style={styles.btnGuardarModal} onClick={guardarEdicionRecurso}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}

      {modalProyectoAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContenido}>
            <h3 style={{ marginTop: 0, color: "#1e293b" }}>Editar Proyecto</h3>
            <div>
              <label style={styles.labelModal}>Nombre del Proyecto:</label>
              <input style={styles.input} value={proyectoEditando.nombre}
                onChange={e => setProyectoEditando({...proyectoEditando, nombre: e.target.value})} />
              
              <label style={styles.labelModal}>Descripción:</label>
              <input style={styles.input} value={proyectoEditando.descripcion}
                onChange={e => setProyectoEditando({...proyectoEditando, descripcion: e.target.value})} />

              <label style={styles.labelModal}>Estado:</label>
              <select style={styles.input} value={proyectoEditando.estado}
                onChange={e => setProyectoEditando({...proyectoEditando, estado: e.target.value})}>
                <option value="ACTIVO">Activo</option>
                <option value="PAUSADO">Pausado</option>
                <option value="TERMINADO">Terminado</option>
              </select>

              <label style={styles.labelModal}>Tareas Realizadas:</label>
              <input style={styles.input} type="number" value={proyectoEditando.tareasCompletadas}
                onChange={e => setProyectoEditando({...proyectoEditando, tareasCompletadas: parseInt(e.target.value) || 0})} />

              <label style={styles.labelModal}>Tareas Totales:</label>
              <input style={styles.input} type="number" value={proyectoEditando.tareasTotales}
                onChange={e => setProyectoEditando({...proyectoEditando, tareasTotales: parseInt(e.target.value) || 0})} />
            </div>
            <div style={styles.modalBotones}>
              <button style={styles.btnCancelarModal} onClick={() => setModalProyectoAbierto(false)}>Cancelar</button>
              <button style={styles.btnGuardarModal} onClick={guardarEdicionProyecto}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  app: { fontFamily: "Arial, sans-serif", maxWidth: 900, margin: "0 auto", padding: 20 },
  header: { 
    background: "#1a237e", 
    color: "white", 
    padding: "15px 20px", 
    borderRadius: 8, 
    marginBottom: 20, 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    position: "relative" 
  },
  headerText: { flexGrow: 1, textAlign: "left" },
  usuarioContenedor: { position: "relative" },
  avatar: { 
    background: "#0288d1", 
    padding: "8px 15px", 
    borderRadius: 20, 
    cursor: "pointer", 
    fontWeight: "bold",
    userSelect: "none"
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "40px",
    background: "white",
    color: "black",
    borderRadius: 6,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: "160px",
    zIndex: 100,
    border: "1px solid #ddd",
    overflow: "hidden"
  },
  dropdownItem: {
    padding: "10px 15px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px",
    transition: "background 0.2s",
    borderBottom: "1px solid #eee"
  },
  nav: { display: "flex", gap: 10, marginBottom: 20 },
  btn: { padding: "10px 20px", cursor: "pointer", borderRadius: 6, border: "2px solid #1a237e", background: "white" },
  btnActivo: { padding: "10px 20px", cursor: "pointer", borderRadius: 6, border: "none", background: "#1a237e", color: "white" },
  main: { padding: 10 },
  form: { background: "#f5f5f5", padding: 20, borderRadius: 8, marginBottom: 20 },
  input: { display: "block", width: "100%", padding: 8, marginBottom: 10, borderRadius: 4, border: "1px solid #ccc", boxSizing: "border-box" },
  inputZeroMargin: { display: "block", width: "100%", padding: 8, margin: 0, borderRadius: 4, border: "1px solid #ccc", boxSizing: "border-box" },
  btnCrear: { background: "#1a237e", color: "white", padding: "10px 20px", border: "none", borderRadius: 6, cursor: "pointer" },
  btnEliminar: { background: "#c62828", color: "white", padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer", flex: 1 },
  btnEditarRecurso: { background: "#edf2f7", color: "#4a5568", padding: "6px 14px", border: "1px solid #cbd5e0", borderRadius: 6, cursor: "pointer", marginTop: 8, width: "100%", fontWeight: "bold" },
  btnEditarProyecto: { background: "#edf2f7", color: "#4a5568", padding: "6px 14px", border: "1px solid #cbd5e0", borderRadius: 6, cursor: "pointer", flex: 1, fontWeight: "bold" },
  lista: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
  card: { background: "white", border: "1px solid #ddd", borderRadius: 8, padding: 16, boxShadow: "0 2px 4px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  barraFondo: { background: "#e0e0e0", borderRadius: 4, height: 12, marginBottom: 8 },
  barra: { background: "#1a237e", height: 12, borderRadius: 4, transition: "width 0.3s" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalContenido: { background: "white", padding: 25, borderRadius: 12, width: 360, boxShadow: "0 10px 25px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" },
  labelModal: { display: "block", fontSize: "14px", fontWeight: "bold", color: "#4a5568", marginBottom: 4, textAlign: "left" },
  modalBotones: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 },
  btnCancelarModal: { background: "#f1f5f9", border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", color: "#64748b", fontWeight: "bold" },
  btnGuardarModal: { background: "#2e7d32", border: "none", padding: "8px 16px", color: "white", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }
};

export default App;