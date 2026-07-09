//fetch + estado en memoria (fuente única de verdad)
//solo fetch + guardar en estado. Nada de lógica de negocio acá, nada de DOM.

export const estado = {
  servicios: [],       // viene del fetch a servicios.json
  repuestos: [],       // viene del fetch a repuestos.json
  disponibilidad: [],  // configurada por el admin
  carrito: { servicios: [], repuestos: [] },
  ordenes: []          // se van generando en runtime
};

async function cargarDatos(url){
    
    try{
        const response = await fetch(url)

        if(!response.ok){
            throw new Error("no se pudo cargar el archivo JSON")
        }

        const data = await response.json()

        return data

    }catch(error){
        mostrarNotificacion(false, error)//luego importamos mostrarNotificacion
        return [];
    }
}

async function inicializarApp(){
    
    const [dataServicios, dataRepuestos] = await Promise.all([
        cargarDatos("./data/servicios.json"),
        cargarDatos("./data/repuestos.json")
    ])

    estado.servicios = dataServicios
    estado.repuestos =  dataRepuestos
}

export {inicializarApp}


