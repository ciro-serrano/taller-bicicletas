//panel del admin (configurar disponibilidad)

import { mostrarNotificacion } from "./ui";
import { estado } from "./data";

function agregarHorario(dia, hora) {
  const diaYaExiste = estado.disponibilidad.find((d) => d.dia === dia);
  if (diaYaExiste === undefined) {
    const nuevaDisponibilidad = {
      dia: dia,
      horarios: [hora],
    };
    estado.disponibilidad.push(nuevaDisponibilidad);
    mostrarNotificacion(
      true,
      "Nueva fecha de disponibilidad agregada con exito",
    );
    //renderpaneladmin
    return;
  }
  //como ya sabemos que si pasa a este bloque es porque el dia si existe, entonces solo verificamos que el horaio no exista en ese dia
  const horarioYaExiste = diaYaExiste.horarios.includes(hora); //si el horario existe dentro de horarios entonces devuelve un true y si no, un false
  if (!horarioYaExiste) {
    diaYaExiste.horarios.push(hora);
    mostrarNotificacion(true, "Horario agregado con exito");
    //render el panel de admin
    return;
  } else {
    mostrarNotificacion(false, "ese horario ya existe");
  }
}

function eliminarFranja(dia, hora) {
  const existeFranja = estado.ordenes.some(
    (o) => o.turno.dia === dia && o.turno.hora === hora,
  );
  if (existeFranja) {
    mostrarNotificacion(
      false,
      "No se puede eliminar el dia y la hora porque hay una Orden pendiente con esa disponibilidad",
    );
    return;
  }

  const diaEncontrado = estado.disponibilidad.find((d) => {
    d.dia === dia;
  });
  if (!diaEncontrado) {
    mostrarNotificacion(
      false,
      "no se encontro ninguna coincideencia con el dia seleccionado",
    );
    return;
  }
  diaEncontrado.horarios = diaEncontrado.horarios.filter((h) => h !== hora);
  mostrarNotificacion(true, "disponibilidad eliminada con exito");
  //renderpaneladmin
}

export { agregarHorario, eliminarFranja };
