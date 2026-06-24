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

  const [actividades, setActividades] = useState([
    { id: 1, texto: "Sistema iniciado correctamente.", hora: "Ahora mismo", tipo: "INFO", color: "#3b82f6" },
    { id: 2, texto: "Conexión establecida con el servicio BFF.", hora: "Hace 2 min", tipo: "EXITO", color: "#10b981" }
  ]);

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

  const registrarActividad = (texto, tipo, color) => {
    const nueva = {
      id: Date.now(),
      texto,
      hora: "Justo ahora",
      tipo,
      color
    };
    setActividades(prev => [nueva, ...prev.slice(0, 4)]);
  };

  const cargarProyectos = () =>
    axios.get(`${BFF}/proyectos`).then(r => setProyectos(r.data)).catch(() => {});

  const cargarRecursos = () =>
    axios.get(`${BFF}/recursos`).then(r => setRecursos(r.data)).catch(() => {});

  const crearProyecto = () => {
    if (!proyecto.nombre) return;
    axios.post(`${BFF}/proyectos`, proyecto).then(() => {
      cargarProyectos();
      registrarActividad(`Proyecto "${proyecto.nombre}" creado exitosamente.`, "PROYECTO", "#10b981");
      setProyecto({ nombre: "", descripcion: "", estado: "ACTIVO", tareasCompletadas: 0, tareasTotales: 0 });
    });
  };

  const eliminarProyecto = (id, nombre) => {
    axios.delete(`${BFF}/proyectos/${id}`).then(() => {
      cargarProyectos();
      registrarActividad(`Proyecto "${nombre || 'Eliminado'}" removido del sistema.`, "ALERTA", "#ef4444");
    });
  };

  const crearRecurso = () => {
    if (!recurso.nombre) return;
    axios.post(`${BFF}/recursos`, recurso).then(() => {
      cargarRecursos();
      registrarActividad(`Colaborador "${recurso.nombre}" dado de alta.`, "RECURSO", "#3b82f6");
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
      registrarActividad(`Ficha de "${recursoEditando.nombre}" actualizada.`, "INFO", "#f59e0b");
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
      registrarActividad(`Parámetros de "${proyectoEditando.nombre}" modificados.`, "INFO", "#f59e0b");
      setModalProyectoAbierto(false);
    }).catch(() => {});
  };

  const proyectosActivos = proyectos.filter(p => p.estado === "ACTIVO").length;
  const recursosDisponibles = recursos.filter(r => r.disponible).length;
  const promedioAvance = proyectos.length > 0 
    ? Math.round(proyectos.reduce((acc, curr) => acc + (curr.avancePorcentaje || 0), 0) / proyectos.length) 
    : 0;

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
      
      <header style={styles.header}>
        <div style={styles.headerText}>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "800", letterSpacing: "-0.5px" }}>InnovaTech Solutions</h1>
          <p style={{ margin: "4px 0 0 0", fontSize: "14px", opacity: 0.9, fontWeight: "500" }}>Panel de Control Profesional Multi-Columnas</p>
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

      <nav style={styles.nav}>
        <button style={vista === "proyectos" ? styles.btnActivoProyectos : styles.btn} onClick={() => setVista("proyectos")}>
          📋 Tablero de Proyectos
        </button>
        <button style={vista === "recursos" ? styles.btnActivoRecursos : styles.btn} onClick={() => setVista("recursos")}>
          👥 Gestión de Recursos
        </button>
      </nav>

      {vista === "perfil" && (
        <main style={{ padding: "0 10px" }}><Perfil /></main>
      )}

      {vista !== "perfil" && (
        <div style={styles.gridEstructural}>
          
          <aside style={styles.columnaLateral}>
            <div style={styles.contenedorSubseccion}>
              <h3 style={styles.tituloPanelLateral}>📊 Estado Global</h3>
              <div style={styles.miniCardMetricaVerde}>
                <span style={styles.metricaTitulo}>Proyectos Activos</span>
                <span style={styles.metricaNumero}>{proyectosActivos}</span>
              </div>
              <div style={styles.miniCardMetricaAzul}>
                <span style={styles.metricaTitulo}>Avance Promedio</span>
                <span style={styles.metricaNumero}>{promedioAvance}%</span>
              </div>
              <div style={styles.miniCardMetricaMorada}>
                <span style={styles.metricaTitulo}>Staff Disponible</span>
                <span style={styles.metricaNumero}>{recursosDisponibles}</span>
              </div>
            </div>

            <div style={styles.formLateral}>
              {vista === "proyectos" ? (
                <>
                  <h3 style={{ marginTop: 0, marginBottom: 16, color: "#0f172a", fontSize: "16px" }}>🚀 Nuevo Proyecto</h3>
                  <input style={styles.input} placeholder="Nombre" value={proyecto.nombre} onChange={e => setProyecto({...proyecto, nombre: e.target.value})} />
                  <input style={styles.input} placeholder="Descripción alcance" value={proyecto.descripcion} onChange={e => setProyecto({...proyecto, descripcion: e.target.value})} />
                  <select style={styles.input} value={proyecto.estado} onChange={e => setProyecto({...proyecto, estado: e.target.value})}>
                    <option value="ACTIVO">🟢 Activo</option>
                    <option value="PAUSADO">🟡 Pausado</option>
                    <option value="TERMINADO">🔵 Terminado</option>
                  </select>
                  <label style={styles.labelForm}>Tareas completadas:</label>
                  <input style={styles.inputSmall} type="number" value={proyecto.tareasCompletadas} onChange={e => setProyecto({...proyecto, tareasCompletadas: parseInt(e.target.value) || 0})} />
                  <label style={styles.labelForm}>Tareas totales:</label>
                  <input style={styles.inputSmall} type="number" value={proyecto.tareasTotales} onChange={e => setProyecto({...proyecto, tareasTotales: parseInt(e.target.value) || 0})} />
                  <button style={styles.btnCrearProyecto} onClick={crearProyecto}>Lanzar Proyecto</button>
                </>
              ) : (
                <>
                  <h3 style={{ marginTop: 0, marginBottom: 16, color: "#0f172a", fontSize: "16px" }}>✨ Registrar Personal</h3>
                  <input style={styles.input} placeholder="Nombre completo" value={recurso.nombre} onChange={e => setRecurso({...recurso, nombre: e.target.value})} />
                  <select style={styles.input} value={recurso.rol} onChange={e => setRecurso({...recurso, rol: e.target.value})}>
                    <option value="DEV">💻 Desarrollador</option>
                    <option value="QA">🛡️ QA Tester</option>
                    <option value="PM">👔 Project Manager</option>
                    <option value="DISEÑADOR">🎨 Diseñador</option>
                  </select>
                  <input style={styles.input} placeholder="Equipo asignado" value={recurso.equipo} onChange={e => setRecurso({...recurso, equipo: e.target.value})} />
                  <button style={styles.btnCrearRecurso} onClick={crearRecurso}>Dar de Alta</button>
                </>
              )}
            </div>
          </aside>

          <main style={styles.columnaCentral}>
            <h2 style={{ ...styles.tituloSeccion, marginTop: 0 }}>
              {vista === "proyectos" ? "Tablero Operativo de Proyectos" : "Nómina de Colaboradores"}
            </h2>

            <div style={styles.listaGiga}>
              {vista === "proyectos" && (
                <>
                  {proyectos.length === 0 && <p style={styles.txtVacio}>No hay proyectos registrados en este bloque.</p>}
                  {proyectos.map(p => {
                    const configEstado = obtenerEstiloEstado(p.estado);
                    return (
                      <div key={p.id} style={{ ...styles.card, borderTop: configEstado.bordeCard }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                            <h3 style={{ marginTop: 0, marginBottom: 0, color: "#0f172a", fontSize: "17px", fontWeight: "700" }}>{p.nombre}</h3>
                            <span style={{ ...styles.badge, ...configEstado.badge }}>{p.estado}</span>
                          </div>
                          <p style={{ color: "#475569", fontSize: "13.5px", margin: "0 0 16px 0", lineHeight: "1.5" }}>{p.descripcion}</p>
                          
                          <div style={styles.progresoContenedor}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "12px" }}>
                              <span style={{ color: "#475569", fontWeight: "600" }}>Progreso</span>
                              <span style={{ color: "#0f172a", fontWeight: "700" }}>{p.avancePorcentaje}%</span>
                            </div>
                            <div style={styles.barraFondo}>
                              <div style={{ ...styles.barra, ...configEstado.barra, width: `${p.avancePorcentaje}%` }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: "11px", color: "#64748b" }}>
                              <span>Flujo operativo:</span>
                              <span style={{ fontWeight: "600", color: "#334155" }}>{p.tareasCompletadas} / {p.tareasTotales} Tareas</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                          <button style={styles.btnEditarProyecto} onClick={() => abrirEditarProyecto(p)}>✏️ Modificar</button>
                          <button style={styles.btnEliminar} onClick={() => eliminarProyecto(p.id, p.nombre)}>Eliminar</button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {vista === "recursos" && (
                <>
                  {recursos.length === 0 && <p style={styles.txtVacio}>No hay personal activo en el sistema.</p>}
                  {recursos.map(r => (
                    <div key={r.id} style={{ ...styles.card, borderTop: "4px solid #3b82f6" }}>
                      <div>
                        <h3 style={{ marginTop: 0, marginBottom: 12, color: "#0f172a", fontSize: "17px", fontWeight: "700" }}>{r.nombre}</h3>
                        <div style={styles.infoRecursoRow}>
                          <span style={{ color: "#64748b" }}>Especialidad:</span>
                          <strong style={styles.rolBadge}>{r.rol}</strong>
                        </div>
                        <div style={styles.infoRecursoRow}>
                          <span style={{ color: "#64748b" }}>Célula / Equipo:</span>
                          <strong style={{ color: "#1e293b" }}>{r.equipo}</strong>
                        </div>
                        <div style={{ ...styles.infoRecursoRow, marginTop: 12, borderBottom: "none" }}>
                          <span style={{ color: "#64748b" }}>Disponibilidad:</span>
                          <span style={{ ...styles.badge, backgroundColor: r.disponible ? "#dcfce7" : "#fee2e2", color: r.disponible ? "#15803d" : "#b91c1c" }}>
                            {r.disponible ? "🟢 Disponible" : "🔴 En Proyecto"}
                          </span>
                        </div>
                      </div>
                      <button style={styles.btnEditarRecurso} onClick={() => abrirEditarRecurso(r)}>⚙️ Gestionar Ficha</button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </main>

          <aside style={styles.columnaLateral}>
            <div style={styles.contenedorTimeline}>
              <h3 style={{ ...styles.tituloPanelLateral, marginBottom: 18 }}>🔔 Actividad del Sistema</h3>
              
              <div style={styles.timelineContenedorLineas}>
                {actividades.map((act, index) => (
                  <div key={act.id} style={styles.timelineItem}>
                    <div style={styles.timelineIndicatorContenedor}>
                      <div style={{ ...styles.timelineCirculo, backgroundColor: act.color }} />
                      {index !== actividades.length - 1 && <div style={styles.timelineLineaConectora} />}
                    </div>
                    <div style={styles.timelineContenidoTexto}>
                      <span style={styles.timelineHora}>{act.hora}</span>
                      <p style={styles.timelineTexto}>{act.texto}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      )}

      {modalAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContenido}>
            <h3 style={{ marginTop: 0, marginBottom: 20, color: "#0f172a", fontWeight: "700" }}>Editar Ficha</h3>
            <div>
              <label style={styles.labelModal}>Nombre:</label>
              <input style={styles.input} value={recursoEditando.nombre} onChange={e => setRecursoEditando({...recursoEditando, nombre: e.target.value})} />
              <label style={styles.labelModal}>Rol:</label>
              <select style={styles.input} value={recursoEditando.rol} onChange={e => setRecursoEditando({...recursoEditando, rol: e.target.value})}>
                <option value="DEV">Desarrollador</option>
                <option value="QA">QA Tester</option>
                <option value="PM">Project Manager</option>
                <option value="DISEÑADOR">Diseñador</option>
              </select>
              <label style={styles.labelModal}>Equipo:</label>
              <input style={styles.input} value={recursoEditando.equipo} onChange={e => setRecursoEditando({...recursoEditando, equipo: e.target.value})} />
              <label style={styles.labelModal}>Estado Operativo:</label>
              <select style={styles.input} value={recursoEditando.disponible ? "true" : "false"} onChange={e => setRecursoEditando({...recursoEditando, disponible: e.target.value === "true"})}>
                <option value="true">✅ Disponible</option>
                <option value="false">🔴 Asignado</option>
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
            <h3 style={{ marginTop: 0, marginBottom: 20, color: "#0f172a", fontWeight: "700" }}>Modificar Proyecto</h3>
            <div>
              <label style={styles.labelModal}>Nombre:</label>
              <input style={styles.input} value={proyectoEditando.nombre} onChange={e => setProyectoEditando({...proyectoEditando, nombre: e.target.value})} />
              <label style={styles.labelModal}>Descripción:</label>
              <input style={styles.input} value={proyectoEditando.descripcion} onChange={e => setProyectoEditando({...proyectoEditando, descripcion: e.target.value})} />
              <label style={styles.labelModal}>Estado:</label>
              <select style={styles.input} value={proyectoEditando.estado} onChange={e => setProyectoEditando({...proyectoEditando, estado: e.target.value})}>
                <option value="ACTIVO">Activo</option>
                <option value="PAUSADO">Pausado</option>
                <option value="TERMINADO">Terminado</option>
              </select>
              <label style={styles.labelModal}>Tareas Realizadas:</label>
              <input style={styles.input} type="number" value={proyectoEditando.tareasCompletadas} onChange={e => setProyectoEditando({...proyectoEditando, tareasCompletadas: parseInt(e.target.value) || 0})} />
              <label style={styles.labelModal}>Tareas Totales:</label>
              <input style={styles.input} type="number" value={proyectoEditando.tareasTotales} onChange={e => setProyectoEditando({...proyectoEditando, tareasTotales: parseInt(e.target.value) || 0})} />
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
    fontFamily: "'Segoe UI', Roboto, -apple-system, sans-serif", 
    width: "100%",
    boxSizing: "border-box",
    padding: "30px",
    color: "#334155",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh"
  },
  header: { 
    background: "linear-gradient(135deg, #1e3a8a 0%, #0d9488 100%)", 
    color: "white", 
    padding: "20px 30px", 
    borderRadius: 14, 
    marginBottom: 24, 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    boxShadow: "0 8px 20px -4px rgba(13, 148, 136, 0.2)"
  },
  headerText: { flexGrow: 1, textAlign: "left" },
  usuarioContenedor: { position: "relative" },
  avatar: { 
    background: "rgba(255, 255, 255, 0.15)", 
    backdropFilter: "blur(4px)",
    padding: "8px 16px", 
    borderRadius: 8, 
    cursor: "pointer", 
    fontWeight: "600",
    fontSize: "14px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    color: "white"
  },
  dropdown: {
    position: "absolute", right: 0, top: "48px", background: "white", color: "#1e293b",
    borderRadius: 8, boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "185px", zIndex: 100,
    border: "1px solid #e2e8f0", overflow: "hidden"
  },
  dropdownItem: { padding: "12px 16px", cursor: "pointer", textAlign: "left", fontSize: "14px", borderBottom: "1px solid #f1f5f9" },
  nav: { display: "flex", gap: 10, marginBottom: 24 },
  btn: { padding: "10px 20px", cursor: "pointer", borderRadius: 8, border: "1px solid #cbd5e1", background: "white", color: "#64748b", fontWeight: "600", fontSize: "14px" },
  btnActivoProyectos: { padding: "10px 20px", cursor: "pointer", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white", fontWeight: "600", fontSize: "14px", boxShadow: "0 4px 10px rgba(16, 185, 129, 0.2)" },
  btnActivoRecursos: { padding: "10px 20px", cursor: "pointer", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "white", fontWeight: "600", fontSize: "14px", boxShadow: "0 4px 10px rgba(59, 130, 246, 0.2)" },
  
  gridEstructural: {
    display: "grid",
    gridTemplateColumns: "280px 1fr 300px",
    gap: "24px",
    alignItems: "start",
    width: "100%"
  },
  columnaLateral: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  columnaCentral: {
    backgroundColor: "transparent",
    minWidth: 0
  },
  tituloSeccion: { textAlign: "left", fontSize: "20px", color: "#0f172a", marginBottom: 18, fontWeight: "700" },
  tituloPanelLateral: { marginTop: 0, marginBottom: 14, color: "#334155", fontSize: "15px", fontWeight: "700", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.5px" },
  
  contenedorSubseccion: { background: "white", padding: "18px", borderRadius: 12, border: "1px solid #e2e8f0" },
  miniCardMetricaVerde: { background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)", padding: "12px 16px", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 10, borderLeft: "4px solid #10b981" },
  miniCardMetricaAzul: { background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", padding: "12px 16px", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 10, borderLeft: "4px solid #3b82f6" },
  miniCardMetricaMorada: { background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)", padding: "12px 16px", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "flex-start", borderLeft: "4px solid #a855f7" },
  metricaTitulo: { fontSize: "12px", fontWeight: "600", color: "#475569" },
  metricaNumero: { fontSize: "22px", fontWeight: "800", color: "#1e293b", marginTop: 2 },

  formLateral: { background: "#ffffff", padding: "20px", borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column" },
  input: { width: "100%", padding: "10px 12px", marginBottom: 12, borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "13px", outline: "none", backgroundColor: "#f8fafc" },
  labelForm: { fontSize: "11.5px", fontWeight: "600", color: "#64748b", textAlign: "left", marginBottom: 4 },
  inputSmall: { width: "100%", padding: "8px 10px", marginBottom: 12, borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "13px", outline: "none", backgroundColor: "#f8fafc" },
  
  btnCrearProyecto: { background: "linear-gradient(90deg, #10b981, #059669)", color: "white", padding: "10px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "600", fontSize: "13px", marginTop: 4 },
  btnCrearRecurso: { background: "linear-gradient(90deg, #3b82f6, #2563eb)", color: "white", padding: "10px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "600", fontSize: "13px", marginTop: 4 },
  
  listaGiga: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "20px" },
  txtVacio: { gridColumn: "1/-1", color: "#64748b", fontSize: "14px", backgroundColor: "white", padding: "30px", borderRadius: 12, border: "1px solid #e2e8f0" },
  
  card: { background: "white", borderRadius: 12, padding: "20px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "left" },
  badge: { padding: "3px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" },
  progresoContenedor: { backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #f1f5f9", marginBottom: "4px" },
  barraFondo: { background: "#e2e8f0", borderRadius: 9999, height: 6, overflow: "hidden" },
  barra: { height: "100%", borderRadius: 9999, transition: "width 0.4s ease" },
  
  infoRecursoRow: { display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: "13px", justifyContent: "space-between" },
  rolBadge: { backgroundColor: "#eff6ff", color: "#1d4ed8", padding: "2px 6px", borderRadius: "4px", fontSize: "11px" },
  
  btnEliminar: { background: "#fef2f2", color: "#dc2626", padding: "8px 12px", border: "1px solid #fee2e2", borderRadius: 6, cursor: "pointer", flex: 1, fontWeight: "600", fontSize: "12px" },
  btnEditarProyecto: { background: "#f1f5f9", color: "#334155", padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", flex: 1, fontWeight: "600", fontSize: "12px" },
  btnEditarRecurso: { background: "#f1f5f9", color: "#334155", padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", marginTop: 12, width: "100%", fontWeight: "600", fontSize: "12px" },

  contenedorTimeline: { background: "white", padding: "20px", borderRadius: 12, border: "1px solid #e2e8f0", textAlign: "left" },
  timelineContenedorLineas: { display: "flex", flexDirection: "column", gap: "4px" },
  timelineItem: { display: "flex", gap: "12px", position: "relative", paddingBottom: "14px" },
  timelineIndicatorContenedor: { display: "flex", flexDirection: "column", alignItems: "center" },
  timelineCirculo: { width: "10px", height: "10px", borderRadius: "50%", zIndex: 2, marginTop: "4px" },
  timelineLineaConectora: { width: "2px", backgroundColor: "#e2e8f0", flexGrow: 1, position: "absolute", top: "14px", bottom: "-4px", left: "4px" },
  timelineContenidoTexto: { display: "flex", flexDirection: "column", gap: "2px" },
  timelineHora: { fontSize: "11px", color: "#94a3b8", fontWeight: "500" },
  timelineTexto: { margin: 0, fontSize: "12.5px", color: "#334155", lineHeight: "1.4", fontWeight: "500" },

  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.25)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", zIndex: 1000, justifyContent: "center" },
  modalContenido: { background: "white", padding: "26px", borderRadius: 16, width: 360, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)", border: "1px solid #e2e8f0" },
  labelModal: { display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: 4, textAlign: "left" },
  modalBotones: { display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" },
  btnCancelarModal: { background: "#f1f5f9", border: "none", padding: "8px 14px", borderRadius: 6, cursor: "pointer", color: "#475569", fontWeight: "600", fontSize: "13px" },
  btnGuardarModal: { background: "linear-gradient(90deg, #10b981, #059669)", border: "none", padding: "8px 14px", color: "white", borderRadius: 6, cursor: "pointer", fontWeight: "600", fontSize: "13px" }
};

export default App;