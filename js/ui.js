//todo lo que TOCA el DOM (renderizar, mostrar/ocultar, actualizar pantalla)
// lee estado y pinta pantalla. Nunca decide lógica de negocio, solo muestra lo que ya está decidido.
import { turnoEstaDisponible } from "./validaciones.js";
import { estado } from "./data.js";
import {
  avanzarEstadoOrden,
  calcularTotal,
  quitarRepuesto,
  quitarServicio,
} from "./acciones.js";
//importamos libreria
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.esm.all.js";

function mostrarNotificacion(exito, mensaje) {
  const icono = exito ? "success" : "error";
  const titleCheck = exito ? "¡Éxito!" : "¡Error!";

  Swal.fire({
    title: titleCheck,
    text: mensaje,
    icon: icono,
  });
}

function mostrarVista(idVista) {
  const vistas = document.querySelectorAll(".vista");
  vistas.forEach((vista) => {
    vista.classList.add("oculta");
  });
  const vistaSeleccionada = document.getElementById(idVista);
  vistaSeleccionada.classList.remove("oculta");
}

function renderizarServicios() {
  const contenedorServicios = document.getElementById("contenedor-servicios"); //atrapamos el contenedor donde vamos a renderizar los servicios

  //por cada elemento del array de servicios, vamos a crear un div con la info del servicio y un boton con su id para agregarlo al carrito
  const htmlServicios = estado.servicios.map((s) => {
    return `
        <div class="servicio">
            <h3>${s.nombre}</h3>
            <p>Precio: $${s.precio}</p>
            <p>Duracion : ${s.duracionMin}</p>
            <button class="agregar-servicio" data-id="${s.id}">Agregar</button>
        </div>
        `;
  });

  contenedorServicios.innerHTML = htmlServicios.join(""); //join para que no haya comas entre los elementos del array
}

function renderizarRepuestos() {
  const contenedorRepuestos = document.getElementById("contenedor-repuestos");
  const htmlRepuestos = estado.repuestos.map((r) => {
    return `
        <div class="repuesto">
            <h3>${r.nombre}</h3>
            <p>Precio: $${r.precio}</p>
            <p>Stock: ${r.stock}</p>
            <button ${r.stock === 0 ? "disabled" : ""}   class="agregar-repuesto" data-id="${r.id}">Agregar</button>
            <input type="number" class="cantidad-repuesto" value="1">
        </div>
        `;
  });

  contenedorRepuestos.innerHTML = htmlRepuestos.join(""); //join para que no haya comas entre los elementos del array
}

function renderizarTurnos() {
  const contenedorTurnos = document.getElementById("contenedor-turnos");
  const htmlTurnos = estado.disponibilidad.map((t) => {
    const horariosDisponibles = t.horarios.map((h) => {
      return `<button ${turnoEstaDisponible(t.dia, h) ? "" : "disabled"} class="seleccionar-turno" data-dia="${t.dia}"  data-hora="${h}">${h}</button>`;
    });

    return `
        <div class="turno">
            <h3>${t.dia}</h3> 
            <div class="horarios">
            ${horariosDisponibles.join("")}
            </div>   
        </div>`;
  });

  contenedorTurnos.innerHTML = htmlTurnos.join("");
}

function renderizarSeguimiento() {
  const contenedorSeguimiento = document.getElementById(
    "contenedor-seguimiento",
  );
  const htmlSeguimiento = estado.ordenes.map((o) => {
    return `
        <div class="orden">
            <h3>Orden: ${o.id}</h3>
            <p>Cliente: ${o.cliente}</p>
            <p>Total: $${o.total}</p>
            <p>Estado: ${o.estado}</p>
            <button ${o.estado === "lista_para_retirar" ? "disabled" : ""}  class="avanzar-estado" data-id="${o.id}">Avanzar Estado</button>
            
        </div>
        `;
  });
  contenedorSeguimiento.innerHTML = htmlSeguimiento.join("");
}

function renderizarCarrito() {
  const contenedorCarrito = document.getElementById("contenedor-carrito");
  //traer el id del objeto que coincida con el del carrito
  const servicioCarrito = estado.carrito.servicios.map((id) => {
    const servicio = estado.servicios.find((o) => o.id === id);
    return `
    <div class ="servicio-carrito">
    <p>${servicio.nombre} - $${servicio.precio}</p>
    <button class = "quitar-servicio" data-id="${servicio.id}">QUITAR</button>
    </div>`;
  });

  const repuestoCarrito = estado.carrito.repuestos.map((item) => {
    const repuesto = estado.repuestos.find((o) => o.id === item.id);
    return `
    <div class="repuestos-carrito">
    <p>${repuesto.nombre} - $${repuesto.precio} - Cantidad: ${item.cantidad}</p>
    <button class="quitar-repuesto" data-id="${repuesto.id}">QUITAR</button>
    </div>`;
  });
  const total = calcularTotal();

  const htmlCarrito = `
    <h3>Carrito</h3>
    <p>Servicio: ${servicioCarrito.join("")}</p>
    <p>Repuestos: ${repuestoCarrito.join("")}</p>
    <p>Total : $${total}</p>`;

  contenedorCarrito.innerHTML = htmlCarrito;
}

function renderizarAdminDisponibilidad() {
  const contenedorAdmin = document.getElementById(
    "contenedor-admin-disponibilidad",
  );
  const htmlAdmin = estado.disponibilidad.map((d) => {
    const htmlHorarios = d.horarios.map((h) => {
      return `
      <span class="franja-admin">
      ${h}
      <button  class="eliminar-franja"  data-dia="${d.dia}"  data-hora="${h}" >X</button>
      </span>`;
    });

    return `
    <div class="dia-admin">
    <h4>${d.dia}</h4>
    ${htmlHorarios.join("")}
    </div>`;
  });
  contenedorAdmin.innerHTML = htmlAdmin.join("");
}

function renderizarResumen(total) {
  //buscamos el nombre del servicio
  const servicioCarrito = estado.carrito.servicios.map((id) => {
    const servicio = estado.servicios.find((o) => o.id === id);
    return `<p>${servicio.nombre} -  $${servicio.precio}</p>
    `;
  });
  //buscamos el nombre del repuesto
  const repuestoCarrito = estado.carrito.repuestos.map((item) => {
    const repuesto = estado.repuestos.find((o) => o.id === item.id);
    return `<p>${repuesto.nombre} -  $${repuesto.precio} X ${item.cantidad}<p>
    `;
  });

  const contenedorResumen = document.getElementById("contenedor-resumen");
  const turno = estado.carrito.turno;

  contenedorResumen.innerHTML = `
  <p>Turno: ${turno.dia ? `${turno.dia} - ${turno.hora}` : "Todavía no seleccionaste un turno"}</p>
  <p>Servicios: ${servicioCarrito.join("")}</p>
  <p>Repuestos: ${repuestoCarrito.join("")}</p>
  <p>Total: $${total}</p>
    `;
}

export {
  mostrarNotificacion,
  mostrarVista,
  renderizarServicios,
  renderizarRepuestos,
  renderizarTurnos,
  renderizarSeguimiento,
  renderizarCarrito,
  renderizarAdminDisponibilidad,
  renderizarResumen,
};
