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

  // Estilos dinámicos para las tarjetas y badges basados en el estado del proyecto
  const obtenerEstiloEstado = (estado) => {
    switch (estado) {
      case "ACTIVO":
        return {
          badge: { backgroundColor: "#dcfce7", color: "#166534" },
          barra: { background: "linear-gradient(90deg, #22c55e, #4ade80)" },
          bordeCard: "4px solid #22c55e"
        };
      case "PAUSADO":
        return {
          badge: { backgroundColor: "#fef3c7", color: "#92400e" },
          barra: { background: "linear-gradient(90deg, #f59e0b, #fbbf24)" },
          bordeCard: "4px solid #f59e0b"
        };
      case "TERMINADO":
        return {
          badge: { backgroundColor: "#e0f2fe", color: "#0369a1" },
          barra: { background: "linear-gradient(90deg, #3b82f6, #60a5fa)" },
          bordeCard: "4px solid #3b82f6"
        };
      default:
        return {
          badge: { backgroundColor: "#f1f5f9", color: "#475569" },
          barra: { background: "#cbd5e1" },
          bordeCard: "4px solid #cbd5e1"
        };
    }
  };

  return (
    <div style={styles.app}>
      
      {/* Header con un gradiente moderno y colorido */}
      <header style={styles.header}>
        <div style={styles.headerText}>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "800", letterSpacing: "-0.5px" }}>InnovaTech Solutions</h1>
          <p style={{ margin: "6px 0 0 0", fontSize: "14px", opacity: 0.9, fontWeight: "500" }}>Plataforma Integral de Gestión de Proyectos y Recursos</p>
        </div>

        <div style={styles.usuarioContenedor}>
          <div style={styles.avatar} onClick={() => setMenuAbierto(!menuAbierto)}>
            <span style={{ fontSize: "16px" }}>👤</span>
            <span style={{ marginLeft: 6, fontSize: "14px" }}>Mi Cuenta ▼</span>
          </div>

          {menuAbierto && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownItem} onClick={() => { setVista("perfil"); setMenuAbierto(false); }}>
                ⚙️ Configurar Perfil
              </div>
              <div style={{ ...styles.dropdownItem, color: "#df2c2c", borderBottom: "none", fontWeight: "600" }} onClick={() => alert("Cerrando sesión...")}>
                🚪 Cerrar Sesión
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Menú de Navegación Estilo Pastillas */}
      <nav style={styles.nav}>
        <button style={vista === "proyectos" ? styles.btnActivoProyectos : styles.btn}
          onClick={() => setVista("proyectos")}>
          📋 Tablero de Proyectos
        </button>
        <button style={vista === "recursos" ? styles.btnActivoRecursos : styles.btn}
          onClick={() => setVista("recursos")}>
          👥 Gestión de Recursos
        </button>
      </nav>

      <main style={styles.main}>

        {vista === "proyectos" && (
          <div>
            <h2 style={styles.tituloSeccion}>Listado General de Proyectos</h2>
            
            {/* Formulario de creación estilizado */}
            <div style={styles.form}>
              <h3 style={{ marginTop: 0, marginBottom: 20, color: "#0f172a", fontSize: "18px" }}>🚀 Crear Nuevo Proyecto</h3>
              <input style={styles.input} placeholder="Nombre del proyecto"
                value={proyecto.nombre}
                onChange={e => setProyecto({...proyecto, nombre: e.target.value})} />
              <input style={styles.input} placeholder="Descripción detallada"
                value={proyecto.descripcion}
                onChange={e => setProyecto({...proyecto, descripcion: e.target.value})} />
              <select style={styles.input} value={proyecto.estado}
                onChange={e => setProyecto({...proyecto, estado: e.target.value})}>
                <option value="ACTIVO">🟢 Activo</option>
                <option value="PAUSADO">🟡 Pausado</option>
                <option value="TERMINADO">🔵 Terminado</option>
              </select>
              <div style={{ marginBottom: 14, textAlign: "left" }}>
                <label style={styles.labelForm}>Tareas completadas:</label>
                <input style={styles.inputZeroMargin} type="number" placeholder="0"
                  value={proyecto.tareasCompletadas}
                  onChange={e => setProyecto({...proyecto, tareasCompletadas: parseInt(e.target.value) || 0})} />
              </div>
              <div style={{ marginBottom: 22, textAlign: "left" }}>
                <label style={styles.labelForm}>Total de tareas asignadas:</label>
                <input style={styles.inputZeroMargin} type="number" placeholder="0"
                  value={proyecto.tareasTotales}
                  onChange={e => setProyecto({...proyecto, tareasTotales: parseInt(e.target.value) || 0})} />
              </div>
              <button style={styles.btnCrearProyecto} onClick={crearProyecto}>Guardar y Lanzar Proyecto</button>
            </div>

            {/* Grilla de Tarjetas de Proyectos */}
            <div style={styles.lista}>
              {proyectos.length === 0 && <p style={{ gridColumn: "1/-1", color: "#64748b", textAlign: "center" }}>No hay proyectos registrados en el sistema.</p>}
              {proyectos.map(p => {
                const configEstado = obtenerEstiloEstado(p.estado);
                return (
                  <div key={p.id} style={{ ...styles.card, borderTop: configEstado.bordeCard }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                        <h3 style={{ marginTop: 0, marginBottom: 0, color: "#0f172a", fontSize: "18px", fontWeight: "700" }}>{p.nombre}</h3>
                        <span style={{ ...styles.badge, ...configEstado.badge }}>{p.estado}</span>
                      </div>
                      
                      <p style={{ color: "#475569", fontSize: "14px", margin: "0 0 16px 0", lineHeight: "1.5" }}>{p.descripcion}</p>
                      
                      {/* Información de Progreso Destacada */}
                      <div style={styles.progresoContenedor}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "13px" }}>
                          <span style={{ color: "#475569", fontWeight: "600" }}>Progreso Actual</span>
                          <span style={{ color: "#0f172a", fontWeight: "700" }}>{p.avancePorcentaje}%</span>
                        </div>
                        <div style={styles.barraFondo}>
                          <div style={{ ...styles.barra, ...configEstado.barra, width: `${p.avancePorcentaje}%` }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: "12px", color: "#64748b" }}>
                          <span>Métricas de flujo:</span>
                          <span style={{ fontWeight: "600", color: "#334155" }}>{p.tareasCompletadas} / {p.tareasTotales} Tareas</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                      <button style={styles.btnEditarProyecto} onClick={() => abrirEditarProyecto(p)}>
                        ✏️ Modificar
                      </button>
                      <button style={styles.btnEliminar} onClick={() => eliminarProyecto(p.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {vista === "recursos" && (
          <div>
            <h2 style={styles.tituloSeccion}>Panel de Control de Personal</h2>
            
            <div style={styles.form}>
              <h3 style={{ marginTop: 0, marginBottom: 20, color: "#0f172a", fontSize: "18px" }}>✨ Registrar Nuevo Colaborador</h3>
              <input style={styles.input} placeholder="Nombre completo del recurso"
                value={recurso.nombre}
                onChange={e => setRecurso({...recurso, nombre: e.target.value})} />
              <select style={styles.input} value={recurso.rol}
                onChange={e => setRecurso({...recurso, rol: e.target.value})}>
                <option value="DEV">💻 Desarrollador</option>
                <option value="QA">🛡️ QA Tester</option>
                <option value="PM">👔 Project Manager</option>
                <option value="DISEÑADOR">🎨 Diseñador</option>
              </select>
              <input style={styles.input} placeholder="Asignación de Equipo (ej: Célula Alpha)"
                value={recurso.equipo}
                onChange={e => setRecurso({...recurso, equipo: e.target.value})} />
              <button style={styles.btnCrearRecurso} onClick={crearRecurso}>Dar de Alta en Sistema</button>
            </div>

            <div style={styles.lista}>
              {recursos.length === 0 && <p style={{ gridColumn: "1/-1", color: "#64748b", textAlign: "center" }}>No hay recursos asignados todavía.</p>}
              {recursos.map(r => (
                <div key={r.id} style={{ ...styles.card, borderTop: "4px solid #3b82f6" }}>
                  <div>
                    <h3 style={{ marginTop: 0, marginBottom: 12, color: "#0f172a", fontSize: "18px", fontWeight: "700" }}>{r.nombre}</h3>
                    
                    <div style={styles.infoRecursoRow}>
                      <span style={{ color: "#64748b" }}>Especialidad:</span>
                      <strong style={styles.rolBadge}>{r.rol}</strong>
                    </div>
                    
                    <div style={styles.infoRecursoRow}>
                      <span style={{ color: "#64748b" }}>Célula / Equipo:</span>
                      <strong style={{ color: "#1e293b" }}>{r.equipo}</strong>
                    </div>

                    <div style={{ ...styles.infoRecursoRow, marginTop: 14, borderBottom: "none" }}>
                      <span style={{ color: "#64748b" }}>Disponibilidad:</span>
                      <span style={{ ...styles.badge, backgroundColor: r.disponible ? "#dcfce7" : "#fee2e2", color: r.disponible ? "#15803d" : "#b91c1c" }}>
                        {r.disponible ? "🟢 Disponible" : "🔴 En Asignación"}
                      </span>
                    </div>
                  </div>
                  <button style={styles.btnEditarRecurso} onClick={() => abrirEditarRecurso(r)}>
                    ⚙️ Gestionar Ficha
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

      {/* Modales Flotantes con Desenfoque de Fondo de Última Generación */}
      {modalAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContenido}>
            <h3 style={{ marginTop: 0, marginBottom: 20, color: "#0f172a", fontWeight: "700" }}>Editar Ficha de Colaborador</h3>
            <div>
              <label style={styles.labelModal}>Nombre Completo:</label>
              <input style={styles.input} value={recursoEditando.nombre}
                onChange={e => setRecursoEditando({...recursoEditando, nombre: e.target.value})} />
              
              <label style={styles.labelModal}>Rol Profesional:</label>
              <select style={styles.input} value={recursoEditando.rol}
                onChange={e => setRecursoEditando({...recursoEditando, rol: e.target.value})}>
                <option value="DEV">Desarrollador</option>
                <option value="QA">QA Tester</option>
                <option value="PM">Project Manager</option>
                <option value="DISEÑADOR">Diseñador</option>
              </select>

              <label style={styles.labelModal}>Equipo de Trabajo:</label>
              <input style={styles.input} value={recursoEditando.equipo}
                onChange={e => setRecursoEditando({...recursoEditando, equipo: e.target.value})} />

              <label style={styles.labelModal}>Estado Operativo:</label>
              <select style={styles.input} value={recursoEditando.disponible ? "true" : "false"}
                onChange={e => setRecursoEditando({...recursoEditando, disponible: e.target.value === "true"})}>
                <option value="true">✅ Disponible para Proyectos</option>
                <option value="false">🔴 Asignado a Proyecto Completo</option>
              </select>
            </div>
            <div style={styles.modalBotones}>
              <button style={styles.btnCancelarModal} onClick={() => setModalAbierto(false)}>Cerrar</button>
              <button style={styles.btnGuardarModal} onClick={guardarEdicionRecurso}>Actualizar Datos</button>
            </div>
          </div>
        </div>
      )}

      {modalProyectoAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContenido}>
            <h3 style={{ marginTop: 0, marginBottom: 20, color: "#0f172a", fontWeight: "700" }}>Modificar Parámetros de Proyecto</h3>
            <div>
              <label style={styles.labelModal}>Nombre Comercial:</label>
              <input style={styles.input} value={proyectoEditando.nombre}
                onChange={e => setProyectoEditando({...proyectoEditando, nombre: e.target.value})} />
              
              <label style={styles.labelModal}>Descripción del Alcance:</label>
              <input style={styles.input} value={proyectoEditando.descripcion}
                onChange={e => setProyectoEditando({...proyectoEditando, descripcion: e.target.value})} />

              <label style={styles.labelModal}>Fase / Estado:</label>
              <select style={styles.input} value={proyectoEditando.estado}
                onChange={e => setProyectoEditando({...proyectoEditando, estado: e.target.value})}>
                <option value="ACTIVO">Activo</option>
                <option value="PAUSADO">Pausado</option>
                <option value="TERMINADO">Terminado</option>
              </select>

              <label style={styles.labelModal}>Tareas Finalizadas:</label>
              <input style={styles.input} type="number" value={proyectoEditando.tareasCompletadas}
                onChange={e => setProyectoEditando({...proyectoEditando, tareasCompletadas: parseInt(e.target.value) || 0})} />

              <label style={styles.labelModal}>Volumen de Tareas Totales:</label>
              <input style={styles.input} type="number" value={proyectoEditando.tareasTotales}
                onChange={e => setProyectoEditando({...proyectoEditando, tareasTotales: parseInt(e.target.value) || 0})} />
            </div>
            <div style={styles.modalBotones}>
              <button style={styles.btnCancelarModal} onClick={() => setModalProyectoAbierto(false)}>Descartar</button>
              <button style={styles.btnGuardarModal} onClick={guardarEdicionProyecto}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  app: { 
    fontFamily: "'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, sans-serif", 
    maxWidth: 1200, 
    margin: "0 auto", 
    padding: "40px 20px",
    color: "#334155",
    backgroundColor: "#f8fafc",
    minHeight: "100vh"
  },
  header: { 
    background: "linear-gradient(135deg, #1e3a8a 0%, #0d9488 100%)", 
    color: "white", 
    padding: "26px 32px", 
    borderRadius: 16, 
    marginBottom: 30, 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    position: "relative",
    boxShadow: "0 10px 25px -5px rgba(13, 148, 136, 0.2)"
  },
  headerText: { flexGrow: 1, textAlign: "left" },
  usuarioContenedor: { position: "relative" },
  avatar: { 
    background: "rgba(255, 255, 255, 0.15)", 
    backdropFilter: "blur(4px)",
    padding: "10px 18px", 
    borderRadius: 10, 
    cursor: "pointer", 
    fontWeight: "600",
    fontSize: "14px",
    userSelect: "none",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    display: "flex",
    alignItems: "center",
    color: "white"
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "52px",
    background: "white",
    color: "#1e293b",
    borderRadius: 10,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    width: "190px",
    zIndex: 100,
    border: "1px solid #e2e8f0",
    overflow: "hidden"
  },
  dropdownItem: {
    padding: "12px 18px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px",
    borderBottom: "1px solid #f1f5f9"
  },
  nav: { display: "flex", gap: 12, marginBottom: 35 },
  btn: { 
    padding: "12px 24px", 
    cursor: "pointer", 
    borderRadius: 10, 
    border: "1px solid #cbd5e1", 
    background: "white", 
    color: "#64748b",
    fontWeight: "600",
    fontSize: "14px"
  },
  btnActivoProyectos: { 
    padding: "12px 24px", 
    cursor: "pointer", 
    borderRadius: 10, 
    border: "none", 
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
    color: "white", 
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
  },
  btnActivoRecursos: { 
    padding: "12px 24px", 
    cursor: "pointer", 
    borderRadius: 10, 
    border: "none", 
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", 
    color: "white", 
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
  },
  tituloSeccion: { textAlign: "left", fontSize: "22px", color: "#0f172a", marginBottom: 20, fontWeight: "700" },
  form: { 
    background: "#ffffff", 
    padding: "28px", 
    borderRadius: 16, 
    marginBottom: 40, 
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    maxWidth: "650px",
    margin: "0 auto 40px auto"
  },
  input: { 
    display: "block", 
    width: "100%", 
    padding: "12px 14px", 
    marginBottom: 16, 
    borderRadius: 8, 
    border: "1px solid #cbd5e1", 
    boxSizing: "border-box",
    fontSize: "14px",
    color: "#1e293b",
    outline: "none",
    backgroundColor: "#f8fafc"
  },
  labelForm: { fontSize: "13px", fontWeight: "600", color: "#475569", display: "block", marginBottom: 6 },
  inputZeroMargin: { 
    display: "block", 
    width: "100%", 
    padding: "12px 14px", 
    margin: 0, 
    borderRadius: 8, 
    border: "1px solid #cbd5e1", 
    boxSizing: "border-box",
    fontSize: "14px",
    color: "#1e293b",
    outline: "none",
    backgroundColor: "#f8fafc"
  },
  btnCrearProyecto: { 
    background: "linear-gradient(90deg, #10b981, #059669)", 
    color: "white", 
    padding: "12px 24px", 
    border: "none", 
    borderRadius: 10, 
    cursor: "pointer", 
    fontWeight: "600",
    fontSize: "14px",
    width: "100%",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)"
  },
  btnCrearRecurso: { 
    background: "linear-gradient(90deg, #3b82f6, #2563eb)", 
    color: "white", 
    padding: "12px 24px", 
    border: "none", 
    borderRadius: 10, 
    cursor: "pointer", 
    fontWeight: "600",
    fontSize: "14px",
    width: "100%",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)"
  },
  lista: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
    gap: 26,
    marginTop: 20
  },
  card: { 
    background: "white", 
    borderRadius: 14, 
    padding: 26, 
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", 
    display: "flex", 
    flexDirection: "column", 
    justifyContent: "space-between",
    textAlign: "left",
    position: "relative"
  },
  badge: {
    padding: "4px 12px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase"
  },
  progresoContenedor: {
    backgroundColor: "#f8fafc",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "4px",
    border: "1px solid #f1f5f9"
  },
  barraFondo: { background: "#e2e8f0", borderRadius: 9999, height: 8, overflow: "hidden" },
  barra: { height: "100%", borderRadius: 9999, transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)" },
  infoRecursoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px"
  },
  rolBadge: {
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    padding: "2px 8px",
    borderRadius: "6px",
    fontSize: "12px"
  },
  btnEliminar: { 
    background: "#fef2f2", 
    color: "#dc2626", 
    padding: "10px 16px", 
    border: "1px solid #fee2e2", 
    borderRadius: 8, 
    cursor: "pointer", 
    flex: 1,
    fontWeight: "600",
    fontSize: "13px"
  },
  btnEditarRecurso: { 
    background: "#f1f5f9", 
    color: "#334155", 
    padding: "10px 14px", 
    border: "1px solid #e2e8f0", 
    borderRadius: 8, 
    cursor: "pointer", 
    marginTop: 16, 
    width: "100%", 
    fontWeight: "600",
    fontSize: "13px"
  },
  btnEditarProyecto: { 
    background: "#f1f5f9", 
    color: "#334155", 
    padding: "10px 16px", 
    border: "1px solid #e2e8f0", 
    borderRadius: 8, 
    cursor: "pointer", 
    flex: 1, 
    fontWeight: "600",
    fontSize: "13px"
  },
  modalOverlay: { 
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%", 
    background: "rgba(15, 23, 42, 0.3)", 
    backdropFilter: "blur(6px)",
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    zIndex: 1000 
  },
  modalContenido: { 
    background: "white", 
    padding: "32px", 
    borderRadius: 20, 
    width: 400, 
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", 
    border: "1px solid #e2e8f0" 
  },
  labelModal: { display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: 6, textAlign: "left" },
  modalBotones: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 26 },
  btnCancelarModal: { background: "#f1f5f9", border: "none", padding: "10px 18px", borderRadius: 8, cursor: "pointer", color: "#475569", fontWeight: "600", fontSize: "14px" },
  btnGuardarModal: { background: "linear-gradient(90deg, #10b981, #059669)", border: "none", padding: "10px 18px", color: "white", borderRadius: 8, cursor: "pointer", fontWeight: "600", fontSize: "14px" }
};

export default App;