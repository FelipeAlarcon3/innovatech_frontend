import { useState, useEffect } from "react";
import Perfil from "./components/Perfil";
import axios from "axios";

const BFF = "http://localhost:8081/api/bff";

function App() {
  const [proyectos, setProyectos] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [vista, setVista] = useState("proyectos"); // Controla qué pantalla se muestra

  const [proyecto, setProyecto] = useState({
    nombre: "", descripcion: "", estado: "ACTIVO",
    tareasCompletadas: 0, tareasTotales: 0
  });

  const [recurso, setRecurso] = useState({
    nombre: "", rol: "DEV", equipo: "", disponible: true
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
  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1>InnovaTech Solutions</h1>
        <p>Plataforma de Gestión de Proyectos y Recursos</p>
      </header>

      {/* MENÚ DE NAVEGACIÓN MODIFICADO */}
      <nav style={styles.nav}>
        <button style={vista === "proyectos" ? styles.btnActivo : styles.btn}
          onClick={() => setVista("proyectos")}>
          📋 Proyectos
        </button>
        <button style={vista === "recursos" ? styles.btnActivo : styles.btn}
          onClick={() => setVista("recursos")}>
          👥 Recursos
        </button>
        {/* NUEVO: Botón para acceder a la vista del Perfil */}
        <button style={vista === "perfil" ? styles.btnActivo : styles.btn}
          onClick={() => setVista("perfil")}>
          👤 Mi Perfil
        </button>
      </nav>

      <main style={styles.main}>

        {/* VISTA 1: PROYECTOS */}
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
              <input style={styles.input} type="number" placeholder="Tareas completadas"
                value={proyecto.tareasCompletadas}
                onChange={e => setProyecto({...proyecto, tareasCompletadas: parseInt(e.target.value)})} />
              <input style={styles.input} type="number" placeholder="Tareas totales"
                value={proyecto.tareasTotales}
                onChange={e => setProyecto({...proyecto, tareasTotales: parseInt(e.target.value)})} />
              <button style={styles.btnCrear} onClick={crearProyecto}>Crear Proyecto</button>
            </div>

            <div style={styles.lista}>
              {proyectos.length === 0 && <p>No hay proyectos aún.</p>}
              {proyectos.map(p => (
                <div key={p.id} style={styles.card}>
                  <h3>{p.nombre}</h3>
                  <p>{p.descripcion}</p>
                  <p>Estado: <strong>{p.estado}</strong></p>
                  <p>Avance: <strong>{p.avancePorcentaje}%</strong></p>
                  <div style={styles.barraFondo}>
                    <div style={{...styles.barra, width: `${p.avancePorcentaje}%`}} />
                  </div>
                  <p>Tareas: {p.tareasCompletadas} / {p.tareasTotales}</p>
                  <button style={styles.btnEliminar} onClick={() => eliminarProyecto(p.id)}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 2: RECURSOS */}
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NUEVO - VISTA 3: PERFIL DE USUARIO */}
        {vista === "perfil" && (
          <div>
            <Perfil />
          </div>
        )}

      </main>
    </div>
  );
}

const styles = {
  app: { fontFamily: "Arial, sans-serif", maxWidth: 900, margin: "0 auto", padding: 20 },
  header: { background: "#1a237e", color: "white", padding: 20, borderRadius: 8, marginBottom: 20, textAlign: "center" },
  nav: { display: "flex", gap: 10, marginBottom: 20 },
  btn: { padding: "10px 20px", cursor: "pointer", borderRadius: 6, border: "2px solid #1a237e", background: "white" },
  btnActivo: { padding: "10px 20px", cursor: "pointer", borderRadius: 6, border: "none", background: "#1a237e", color: "white" },
  main: { padding: 10 },
  form: { background: "#f5f5f5", padding: 20, borderRadius: 8, marginBottom: 20 },
  input: { display: "block", width: "100%", padding: 8, marginBottom: 10, borderRadius: 4, border: "1px solid #ccc", boxSizing: "border-box" },
  btnCrear: { background: "#1a237e", color: "white", padding: "10px 20px", border: "none", borderRadius: 6, cursor: "pointer" },
  btnEliminar: { background: "#c62828", color: "white", padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer", marginTop: 8 },
  lista: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
  card: { background: "white", border: "1px solid #ddd", borderRadius: 8, padding: 16, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  barraFondo: { background: "#e0e0e0", borderRadius: 4, height: 12, marginBottom: 8 },
  barra: { background: "#1a237e", height: 12, borderRadius: 4, transition: "width 0.3s" },
};

export default App;