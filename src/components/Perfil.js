import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './Perfil.css';

const BFF_PERFIL_URL = "http://localhost:8081/api/bff/perfil";

const Perfil = () => {
    const [perfil, setPerfil] = useState({
        nombre: '',
        correo: '',
        rol: ''
    });

    const [errores, setErrores] = useState({});
    const [mensajeExito, setMensajeExito] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    
    useEffect(() => {
        axios.get(BFF_PERFIL_URL)
            .then(respuesta => {
                // Si el BFF nos devuelve datos (aunque vengan vacíos del fallback), los cargamos en el estado
                if (respuesta.data) {
                    setPerfil({
                        nombre: respuesta.data.nombre || '',
                        correo: respuesta.data.correo || '',
                        rol: respuesta.data.rol || ''
                    });
                }
            })
            .catch(error => {
                console.error("Error al cargar el perfil desde el BFF:", error);
                setMensajeError("No se pudieron cargar los datos del perfil.");
            });
    }, []);

    const validarFormulario = () => {
        let erroresDetectados = {};
        let esValido = true;

        if (!perfil.nombre.trim()) {
            erroresDetectados.nombre = "El nombre completo es obligatorio.";
            esValido = false;
        } else if (perfil.nombre.length < 3) {
            erroresDetectados.nombre = "El nombre debe tener al menos 3 caracteres.";
            esValido = false;
        }

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!perfil.correo.trim()) {
            erroresDetectados.correo = "El correo electrónico es obligatorio.";
            esValido = false;
        } else if (!regexEmail.test(perfil.correo)) {
            erroresDetectados.correo = "El formato del correo no es válido.";
            esValido = false;
        }

        if (!perfil.rol) {
            erroresDetectados.rol = "Debe seleccionar un rol o cargo.";
            esValido = false;
        }

        setErrores(erroresDetectados);
        return esValido;
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        setMensajeExito('');
        setMensajeError('');

        if (validarFormulario()) {
            
            axios.put(BFF_PERFIL_URL, perfil)
                .then(respuesta => {
                    setMensajeExito("✨ ¡Perfil guardado y persistido con éxito en el Backend!");
                })
                .catch(error => {
                    console.error("Error al guardar el perfil:", error);
                    setMensajeError("❌ Error de comunicación: El BFF o el microservicio están caídos.");
                });
        }
    };

    return (
        <div className="perfil-container">
            <h2>Mi Perfil de Usuario</h2>
            <div className="perfil-subtitulo">Configuración de cuenta de extremo a extremo</div>
            
            {mensajeExito && <div className="exito-banner">{mensajeExito}</div>}
            {mensajeError && <div className="error-text" style={{ textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' }}>{mensajeError}</div>}

            <form onSubmit={handleSubmit}>
                {/* Campo: Nombre */}
                <div className="form-group">
                    <label>Nombre Completo:</label>
                    <input 
                        type="text" 
                        className="perfil-input"
                        placeholder="Ej: Felipe Alarcón"
                        value={perfil.nombre} 
                        onChange={(e) => setPerfil({...perfil, nombre: e.target.value})}
                    />
                    {errores.nombre && <span className="error-text">⚠️ {errores.nombre}</span>}
                </div>

                {/* Campo: Correo */}
                <div className="form-group">
                    <label>Correo Electrónico:</label>
                    <input 
                        type="text" 
                        className="perfil-input"
                        placeholder="ejemplo@correo.com"
                        value={perfil.correo} 
                        onChange={(e) => setPerfil({...perfil, correo: e.target.value})}
                    />
                    {errores.correo && <span className="error-text">⚠️ {errores.correo}</span>}
                </div>

                {/* Campo: Rol */}
                <div className="form-group">
                    <label>Rol / Cargo:</label>
                    <select 
                        className="perfil-input"
                        value={perfil.rol} 
                        onChange={(e) => setPerfil({...perfil, rol: e.target.value})}
                    >
                        <option value="">-- Selecciona un Rol --</option>
                        <option value="DEV">Desarrollador</option>
                        <option value="QA">QA Tester</option>
                        <option value="PM">Project Manager</option>
                        <option value="DISEÑADOR">Diseñador</option>
                    </select>
                    {errores.rol && <span className="error-text">⚠️ {errores.rol}</span>}
                </div>

                <button type="submit" className="btn-guardar">
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
};

export default Perfil;