// PROGRAMA/LIBRERÍA QUE DEFINIRÁ UNA SERIE DE FUNCIONES PARA INTERACTUAR CON EL DOM Y MOSTRAR LOS DATOS EN HTML

import * as gestionPresupuesto from "./gestionPresupuesto.js";

//* MANEJADORES DE EVENTOS
function EditarHandle(gasto) {
    this.gasto = gasto;
}
/* handleEvent: Cuando creemos un objeto basado en su prototipo, 
asignaremos a dicho objeto una propiedad llamada gasto, que será una referencia al gasto 
que estemos editando. El código de la función handleEvent podrá hacer referencia a dicho 
gasto a través de this.gasto, ya que es una propiedad del objeto */
EditarHandle.prototype.handleEvent = function() {
    let editeDescripcion = prompt("Edita la descripción del gasto", this.gasto.descripcion);
    let editeValor = prompt("Edite el valor del gasto", this.gasto.valor);
    let editeFecha = prompt("Edite la fecha del gasto (formato yyyy-mm-dd)", this.gasto.fecha);
    let editeEtiquetas = prompt("Edite las etiquetas del gasto (separe cada una con una coma)", this.gasto.etiquetas);

    editeValor = parseFloat(editeValor);
    editeEtiquetas = editeEtiquetas.split(", "); // .split convierte string a array (entre paréntesis el delimitante)
    
    this.gasto.actualizarValor(editeValor);
    this.gasto.actualizarDescripcion(editeDescripcion);
    this.gasto.actualizarFecha(editeFecha);
    this.gasto.anyadirEtiquetas(...editeEtiquetas);

    repintar();
}

// handleEvent se define en el prototipo de BorrarHandle.
// De este modo, todas las instancias de BorrarHandle compartirán el mismo método handleEvent
function BorrarHandle(gasto) {
    this.gasto = gasto;
} 
BorrarHandle.prototype.handleEvent = function() {
    gestionPresupuesto.borrarGasto(this.gasto.id);
    repintar();
}

// OTRA FORMA, donde handleEvent se define directamente en dentro de la función constructora.
// Cada instancia de BorrarHandle tendrá su propia copia del método handleEvent.
/* function BorrarHandle(gasto) {
    this.gasto = gasto
    this.handleEvent = function() {
        gestionPresupuesto.borrarGasto(this.gasto.id);
        repintar();
    }
} 
*/

function BorrarEtiquetasHandle(gasto, etiqueta) {
    this.gasto = gasto;
    this.etiqueta = etiqueta;
}
BorrarEtiquetasHandle.prototype.handleEvent = function() {
    this.gasto.borrarEtiquetas(this.etiqueta);
    repintar();
}


//* FUNCIONES DE INTERFAZ DE USUARIO
function mostrarDatoEnId(idElemento, valor) {
    document.getElementById(idElemento).textContent = valor;
}

function mostrarGastoWeb(idElemento, gasto) {
    // CREANDO elementos
    let gast = document.createElement("div"); // NO LLAMAR A LA VARIABLE IGUAL QUE EL PARÁMETRO (GASTO)
    gast.classList.add("gasto");

    let gastoDescripcion = document.createElement("div");
    gastoDescripcion.classList.add("gasto-descripcion");
    gastoDescripcion.textContent = gasto.descripcion;
    
    let gastoFecha = document.createElement("div");
    gastoFecha.classList.add("gasto-fecha");
    gastoFecha.textContent = gasto.fecha;
    
    let gastoValor = document.createElement("div");
    gastoValor.classList.add("gasto-valor");
    gastoValor.textContent = gasto.valor;

    let gastoEtiquetas = document.createElement("div");
    gastoEtiquetas.classList.add("gasto-etiquetas");

    if (Array.isArray(gasto.etiquetas)) { // Verificamos si gasto.etiquetas es array. Si no lo es, 
                                          // JS se saltará el forEach SIN GENERAR ERROR (forEach sólo funciona en arrays)
                                          
        gasto.etiquetas.forEach((et) => {
            let gastoEtiquetasEtiqueta = document.createElement("span");
            gastoEtiquetasEtiqueta.classList.add("gasto-etiquetas-etiqueta");
            gastoEtiquetasEtiqueta.textContent = et;
    
            // Manejador de evento para borrar etiquetas
            let manejadorBorrarEtiquetas = new BorrarEtiquetasHandle(gasto, et);
            gastoEtiquetasEtiqueta.addEventListener("click", manejadorBorrarEtiquetas);

            gastoEtiquetas.append(gastoEtiquetasEtiqueta);
        });
    }

    // Creación botones para editar y borrar y manejadores de eventos 
    const botonEditar = document.createElement("button");
    botonEditar.textContent = "Editar";
    botonEditar.type = "button";
    botonEditar.classList.add("gasto-editar");

    // Creación de instancia de EditarHandle. Se pasa el objeto gasto
    let manejadorEditar = new EditarHandle(gasto); // Ya no es necesario hacer: manejadorEditar.gasto = gasto,
                                                   // puesto que ya se establece en el constructor de EditarHandle
    botonEditar.addEventListener("click", manejadorEditar);

    const botonBorrar = document.createElement("button");
    botonBorrar.textContent = "Borrar";
    botonBorrar.type = "button";
    botonBorrar.classList.add("gasto-borrar");

    let manejadorBorrar = new BorrarHandle(gasto);
    botonBorrar.addEventListener("click", manejadorBorrar);

    // AÑADIENDO elementos
    gast.append(gastoDescripcion, gastoFecha, gastoValor, gastoEtiquetas, botonEditar, botonBorrar);

    document.getElementById(idElemento).append(gast);
}


function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {
    let agrupacion = document.createElement("div");
    agrupacion.classList.add("agrupacion");

    let encabezado = document.createElement("h1");
    encabezado.textContent = `Gastos agrupados por ${periodo}`;
    agrupacion.append(encabezado);
    
    for (let [clave, valor] of Object.entries(agrup)) {

        let agrupacionDato = document.createElement("div");
        agrupacionDato.classList.add("agrupacion-dato");
    
        let agrupacionDatoClave = document.createElement("span");
        agrupacionDatoClave.classList.add("agrupacion-dato-clave");
        agrupacionDatoClave.textContent = clave;

        let agrupacionDatoValor = document.createElement("span");
        agrupacionDatoValor.classList.add("agrupacion-dato-valor");
        agrupacionDatoValor.textContent = valor;

        agrupacion.append(agrupacionDato);
        agrupacionDato.append(agrupacionDatoClave, agrupacionDatoValor);
    }

    document.getElementById(idElemento).append(agrupacion);
}

function repintar() {
    mostrarDatoEnId("presupuesto", gestionPresupuesto.mostrarPresupuesto());
    mostrarDatoEnId("gastos-totales", gestionPresupuesto.calcularTotalGastos());
    mostrarDatoEnId("balance-total", gestionPresupuesto.calcularBalance());
    document.getElementById("listado-gastos-completo").innerHTML = "";
    const mostrarListadoGastos = gestionPresupuesto.listarGastos();
    mostrarListadoGastos.forEach(gast => {
        mostrarGastoWeb("listado-gastos-completo", gast);
    });
}

function actualizarPresupuestoWeb() {
    const introduzcaPresupuesto = prompt("Introduzca un presupuesto", "");
    const presupuestoANumero = parseFloat(introduzcaPresupuesto);
    if (!isNaN(presupuestoANumero)) {
        gestionPresupuesto.actualizarPresupuesto(presupuestoANumero);
        repintar(); // Actualizar el presupuesto provoca cambios en el balance, por lo que al ejecutar repintar se actualizarán ambos campos
    }
    else {
        alert("Introduzca un número válido.");
    }
}

function nuevoGastoWeb() {
    let introduzcaDescripcion = prompt("Introduzca la descripción del gasto", "");
    let introduzcaValor = prompt("Introduzca el valor del gasto", "");
    let introduzcaFecha = prompt("Introduzca la fecha en formato yyyy-mm-dd", "");
    let introduzcaEtiquetas = prompt("Introduzca la/s etiqueta/s del gasto", "");

    introduzcaValor = parseFloat(introduzcaValor);
    introduzcaEtiquetas = introduzcaEtiquetas.split(", ");

    let nuevoGasto = new gestionPresupuesto.CrearGasto(introduzcaDescripcion, introduzcaValor, introduzcaFecha, ...introduzcaEtiquetas);
    gestionPresupuesto.anyadirGasto(nuevoGasto);
    repintar();
}

//* INICIALIZADORES DE EVENTO
document.getElementById("actualizarpresupuesto").addEventListener("click", actualizarPresupuestoWeb);

document.getElementById("anyadirgasto").addEventListener("click", nuevoGastoWeb);


//* EXPORTACIÓN DE FUNCIONES
export {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb
}