//conecta eventos con acciones, arranca la app.
//escucha clicks/eventos → llama a acciones.js → después llama a ui.js para refrescar lo que cambió.
import { inicializarApp } from "./data.js";

import {
  mostrarVista,
  renderizarServicios,
  renderizarRepuestos,
  renderizarTurnos,
  renderizarSeguimiento,
  renderizarCarrito,
  mostrarNotificacion,
  renderizarAdminDisponibilidad,
  renderizarResumen,
} from "./ui.js";

import {
  agregarServicio,
  quitarServicio,
  agregarRepuesto,
  quitarRepuesto,
  confirmarTurno,
  generarOrden,
  avanzarEstadoOrden,
  calcularTotal,
} from "./acciones.js";

import { agregarHorario, eliminarFranja } from "./admin.js";
import { carritoTieneItems } from "./validaciones.js";

async function iniciar() {
  await inicializarApp();
  renderizarServicios();
  renderizarRepuestos();
  mostrarVista("vista-servicios");
}

document.addEventListener("click", (e) => {
  //agregar servicio
  if (e.target.classList.contains("agregar-servicio")) {
    agregarServicio(e.target.dataset.id);
  }

  //quitar servicio
  if (e.target.classList.contains("quitar-servicio")) {
    quitarServicio(e.target.dataset.id);
    renderizarResumen(calcularTotal());
  }

  //quitar repuesto
  if (e.target.classList.contains("quitar-repuesto")) {
    quitarRepuesto(e.target.dataset.id);
    renderizarResumen(calcularTotal());
  }

  //seleccionar turno
  if (e.target.classList.contains("seleccionar-turno")) {
    const dia = e.target.dataset.dia;
    const hora = e.target.dataset.hora;
    confirmarTurno(dia, hora);
  }

  //avanzar estado de orden
  if (e.target.classList.contains("avanzar-estado")) {
    avanzarEstadoOrden(e.target.dataset.id);
  }

  //agregar-repuesto
  if (e.target.classList.contains("agregar-repuesto")) {
    const id = e.target.dataset.id;
    const inputCantidad =
      e.target.parentElement.querySelector(".cantidad-repuesto");
    agregarRepuesto(id, inputCantidad.value);
  }

  //navegar entre vistas
  if (e.target.classList.contains("nav-vista")) {
    const destino = e.target.dataset.vista;
    if (destino === "vista-turnos" && !carritoTieneItems()) {
      mostrarNotificacion(
        false,
        "Agrega al menoss un servicio o repuesto antes de continuar",
      );
      return;
    }
    if (destino === "vista-turnos") {
      renderizarTurnos();
    }
    if (destino === "vista-seguimiento") {
      renderizarSeguimiento();
    }
    if (destino === "vista-resumen") {
      renderizarResumen(calcularTotal());
    }
    if (destino === "vista-admin") {
      renderizarAdminDisponibilidad();
    }
    mostrarVista(destino);
  }
  if (e.target.classList.contains("eliminar-franja")) {
    eliminarFranja(e.target.dataset.dia, e.target.dataset.hora);
    renderizarAdminDisponibilidad();
  }
});

//generar ORDEN
document
  .getElementById("form-confirmar-orden")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    const nombreCliente = document.getElementById("input-nombre-cliente").value;
    generarOrden(nombreCliente);
    renderizarRepuestos();
    mostrarVista("vista-servicios");
    e.target.reset();
  });

//acceder al formulario del admin para agregar franja
document
  .getElementById("form-agregar-horario")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    const dia = document.getElementById("input-dia-admin").value;
    const hora = document.getElementById("input-hora-admin").value;

    agregarHorario(dia, hora);
    renderizarAdminDisponibilidad();

    e.target.reset(); //limpiamos el formulario
  });

iniciar();
renderizarCarrito();
