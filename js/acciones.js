//funciones que MODIFICAN el estado (agregar al carrito, confirmar orden, avanzar estado)
//usa validaciones.js antes de modificar estado. Ej: agregarServicio(id) primero valida, después empuja al carrito.
import {
  mostrarNotificacion,
  renderizarCarrito,
  renderizarSeguimiento,
} from "./ui.js";
import { estado } from "./data.js";

import {
  cantidadEsValida,
  hayStockSuficiente,
  carritoPermiteAgregar,
  turnoEstaDisponible,
} from "./validaciones.js";

function agregarServicio(servicioId) {
  //usamos validaciones antes de modificar el estado
  if (!carritoPermiteAgregar(servicioId)) {
    mostrarNotificacion(false, "No se puede agregar este servicio al carrito");
    return;
  }

  estado.carrito.servicios.push(servicioId);
  mostrarNotificacion(true, "Servicio agregado al carrito");
  renderizarCarrito();
}

function quitarServicio(servicioId) {
  const nuevoArray = estado.carrito.servicios.filter((id) => id !== servicioId);

  estado.carrito.servicios = nuevoArray;
  mostrarNotificacion(true, "Servicio quitado del carrito correctamente");
  renderizarCarrito();
}

function agregarRepuesto(repuestoId, cantidad) {
  if (!cantidadEsValida(cantidad)) {
    mostrarNotificacion(false, "Cantidad inválida");
    return;
  }

  if (!hayStockSuficiente(repuestoId, cantidad)) {
    mostrarNotificacion(false, "No hay stock suficiente");
    return;
  }

  cantidad = Number(cantidad);

  const repuestoEnCarrito = estado.carrito.repuestos.find(
    (r) => r.id === repuestoId,
  );

  if (repuestoEnCarrito !== undefined) {
    repuestoEnCarrito.cantidad += cantidad;
    mostrarNotificacion(true, "Cantidad de repuesto actualizada correctamente");
    renderizarCarrito();
    return;
  }

  estado.carrito.repuestos.push({ id: repuestoId, cantidad: cantidad });
  mostrarNotificacion(true, "Repuesto agregado al carrito correctamente");
  renderizarCarrito();
}

function quitarRepuesto(repuestoId) {
  const nuevoArray = estado.carrito.repuestos.filter(
    (r) => r.id !== repuestoId,
  );

  estado.carrito.repuestos = nuevoArray;
  mostrarNotificacion(true, "Repuesto quitado del carrito correctamente");
  renderizarCarrito();
}

function calcularTotal() {
  //servicios
  const precioServicios = estado.carrito.servicios.map((id) => {
    const servicio = estado.servicios.find((s) => s.id === id);
    return servicio.precio;
  });

  const totalServicios = precioServicios.reduce(
    (acum, precio) => acum + precio,
    0,
  );

  //repuestos
  const precioRepuestos = estado.carrito.repuestos.map((item) => {
    const repuesto = estado.repuestos.find((r) => r.id === item.id);
    return repuesto.precio * item.cantidad;
  });
  const totalRepuestos = precioRepuestos.reduce(
    (acum, precio) => acum + precio,
    0,
  );

  return totalServicios + totalRepuestos;
}

function confirmarTurno(dia, hora) {
  if (!turnoEstaDisponible(dia, hora)) {
    mostrarNotificacion(false, "El turno seleccionado no está disponible");
    return;
  }

  estado.carrito.turno = { dia: dia, hora: hora };
  mostrarNotificacion(true, "Turno seleccionado correctamente");
  renderizarCarrito();
}

function generarOrden() {
  const orden = {
    id: `ord-${estado.ordenes.length + 1}`,
    cliente: "nombre-cliente", //esto lo vamos a reemplazar por un input en el futuro
    items: {
      servicios: [...estado.carrito.servicios],
      repuestos: [...estado.carrito.repuestos],
    },
    turno: { ...estado.carrito.turno },
    total: calcularTotal(),
    estado: "pendiente",
  };
  //descontar stock de repuestos
  estado.carrito.repuestos.forEach((item) => {
    const repuesto = estado.repuestos.find((r) => r.id === item.id);
    repuesto.stock -= item.cantidad;
  });
  //crear orden
  estado.ordenes.push(orden);

  //limpiar carrito
  estado.carrito = {
    servicios: [],
    repuestos: [],
    turno: { dia: null, hora: null },
  };
  mostrarNotificacion(true, "Orden generada correctamente");
  renderizarCarrito();
  renderizarSeguimiento();
}

function avanzarEstadoOrden(ordenId) {
  //valida que la orden exista
  const orden = estado.ordenes.find((o) => o.id === ordenId);
  if (!orden) {
    mostrarNotificacion(false, "La orden no existe");
    return;
  }

  switch (orden.estado) {
    case "pendiente":
      orden.estado = "en_reparacion";
      mostrarNotificacion(true, "La orden ha pasado a estado 'en reparación'");
      renderizarSeguimiento();
      break;
    case "en_reparacion":
      orden.estado = "lista_para_retirar";
      mostrarNotificacion(
        true,
        "La orden ha pasado a estado 'lista para retirar'",
      );
      renderizarSeguimiento();
      break;
    case "lista_para_retirar":
      mostrarNotificacion(
        false,
        "La orden ya está lista para retirar, no se puede avanzar más",
      );
      break;
    default:
      mostrarNotificacion(false, "Estado de orden desconocido");
      break;
  }
}

export {
  agregarServicio,
  quitarServicio,
  agregarRepuesto,
  quitarRepuesto,
  calcularTotal,
  confirmarTurno,
  generarOrden,
  avanzarEstadoOrden,
};
