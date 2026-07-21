// todas las reglas de negocio (casos límites)
// funciones puras que devuelven true/false o un mensaje de error. Ej: hayStock(repuestoId, cantidad), turnoDisponible(dia, hora), esCompatibleConCarrito(servicioId). No tocan el DOM ni el estado, solo verifican.

//import

import { estado } from "./data.js";

function cantidadEsValida(cantidad) {
  cantidad = Number(cantidad);

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return false;
  }
  return true;
}

function hayStockSuficiente(repuestoId, cantidad) {
  const repuestoEncontrado = estado.repuestos.find((r) => r.id === repuestoId);

  if (repuestoEncontrado === undefined) {
    return false;
  }
  return repuestoEncontrado.stock >= cantidad;
}

function esServicioExclusivo(servicioId) {
  const servicioEncontrado = estado.servicios.find((s) => s.id === servicioId);

  if (servicioEncontrado === undefined) {
    return false;
  }
  return servicioEncontrado.exclusivo;
}

function carritoPermiteAgregar(servicioId) {
  const existeAlgo = estado.carrito.servicios.length;

  const hayExclusivoEnCarrito = estado.carrito.servicios.some((id) =>
    esServicioExclusivo(id),
  ); //mediante esta funcion verificamos mediante el ID si es un servicio exlusivo o no
  const nuevoEsExclusivo = esServicioExclusivo(servicioId);

  if (hayExclusivoEnCarrito) {
    return false; //si hay algo exlusivo en el carrito se corta todo y devuelve false
  }

  if (nuevoEsExclusivo && existeAlgo) {
    return false; //bloquemos porque el exclusivo necesita ir solo
  }

  return true; //si no cumple ninguna de las anteriores , dejamos agregar el servicio al carrito
}

function turnoEstaDisponible(dia, hora) {
  const diaEncontrado = estado.disponibilidad.find((d) => d.dia === dia); //primero buscamos el dia, trayendo el objeto completo , para trabajar con el

  if (diaEncontrado === undefined) {
    return false; //el admin nunca habilito ese dia
  }

  const ordenExiste = estado.ordenes.find(
    (o) => o.turno.dia === dia && o.turno.hora === hora,
  );

  if (ordenExiste !== undefined) {
    return false; //ya hay una orden con ese ia-hora exacto
  }

  return diaEncontrado.horarios.some((h) => h === hora); //esto responde a, : esta hora esta entre las habilitadas por el admin?
}

function carritoTieneItems() {
  const carritoTieneServicios = Boolean(estado.carrito.servicios.length); //si existe algo devbuelve true 3,5,6 = true
  const carritoTieneRepuestos = Boolean(estado.carrito.repuestos.length); // si no existe nada devuelve false 0 = false

  return carritoTieneServicios || carritoTieneRepuestos;
}

//export
export {
  cantidadEsValida,
  hayStockSuficiente,
  esServicioExclusivo,
  carritoPermiteAgregar,
  turnoEstaDisponible,
  carritoTieneItems,
};
