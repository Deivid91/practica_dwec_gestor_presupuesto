// PROGRAMA/LIBRERÍA QUE DEFINIRÁ UNA SERIE DE FUNCIONES PARA INTERACTUAR CON EL DOM Y MOSTRAR LOS DATOS EN HTML

import * as gestionPresupuesto from "./gestionPresupuesto.js";

//* FUNCIONES CONSTRUCTORAS DE MANEJADORES DE EVENTOS
function EditarHandle(gasto) {
    this.gasto = gasto;
}
/* handleEvent: Cuando creemos un objeto basado en su prototipo, 
asignaremos a dicho objeto una propiedad llamada gasto, que será una referencia al gasto 
que estemos editando. El código de la función handleEvent podrá hacer referencia a dicho 
gasto a través de this.gasto, ya que es una propiedad del objeto */
EditarHandle.prototype.handleEvent = function() {
    let editeDescripcion = prompt("Edita la descripción del gasto", this.gasto.descripcion);
    let editeValor = parseFloat(prompt("Edite el valor del gasto", this.gasto.valor));
    let editeFecha = prompt("Edite la fecha del gasto (formato yyyy-mm-dd)", this.gasto.fecha);
    let editeEtiquetas = prompt("Edite las etiquetas del gasto (separe cada una con una coma)", this.gasto.etiquetas.join(", "));

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
    repintar(); // Refleja los cambios en pantalla
}

// OTRA FORMA, donde handleEvent se define directamente dentro de la función constructora.
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

function CancelarFormularioHandle(formulario, botonAnyadirGasto) {
    this.formulario = formulario;
    this.botonAnyadirGasto = botonAnyadirGasto;
}
CancelarFormularioHandle.prototype.handleEvent = function() {
    this.formulario.remove();
    this.botonAnyadirGasto.disabled = false;
}

function EditarHandleFormulario(gasto) {
    this.gasto = gasto;
}
EditarHandleFormulario.prototype.handleEvent = function() {
    let gasto = document.querySelector(`#gasto-${this.gasto.id}`);
    let formulario = gasto.querySelector("form");

    // Crear una copia del formulario web definido en la plantilla HTML (SI NO EXISTE)
    if (!formulario) {
        let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
        formulario = plantillaFormulario.querySelector("form");

        formulario.descripcion.value = this.gasto.descripcion;
        formulario.valor.value = this.gasto.valor;
        formulario.fecha.value = this.gasto.fecha;
        formulario.etiquetas.value = this.gasto.etiquetas.join(",");

        gasto.append(formulario);
    }

    let botonAnyadirGastoFormulario = document.getElementById("anyadirgasto-formulario");
    botonAnyadirGastoFormulario.disabled = true;
    let botonEditarForm = document.querySelector(`#gasto-${this.gasto.id} .gasto-editar-formulario`);
    botonEditarForm.disabled = true;
    
    let botonCancelar = formulario.querySelector("button.cancelar");
    let manejarCancelar = new CancelarFormularioHandle(formulario, botonEditarForm);
    botonCancelar.addEventListener("click", manejarCancelar);

    botonCancelar.addEventListener("click", function() {
        botonAnyadirGastoFormulario.disabled = false;
    });
    
    // Función flecha para que el this se refiera al manejador EditarHandleFormulario, no al formulario HTML
    formulario.addEventListener("submit", (evento) => manejadorEnvioEditarFormulario(evento, this.gasto));
}


//* FUNCIONES DE INTERFAZ DE USUARIO
function mostrarDatoEnId(idElemento, valor) {
    document.getElementById(idElemento).textContent = valor;
}

function mostrarGastoWeb(idElemento, gasto) {
    // CREANDO elementos
    let gast = document.createElement("div"); // NO LLAMAR A LA VARIABLE IGUAL QUE EL PARÁMETRO (GASTO)
    gast.classList.add("gasto");
    gast.id = `gasto-${gasto.id}`; // Cada gasto tendrá su ID

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

    // BOTÓN EDITAR
    const botonEditar = document.createElement("button");
    botonEditar.textContent = "Editar";
    botonEditar.type = "button";
    botonEditar.classList.add("gasto-editar");

    // Creación de instancia de EditarHandle. Se pasa el objeto gasto
    let manejadorEditar = new EditarHandle(gasto); // Ya no es necesario hacer: manejadorEditar.gasto = gasto,
                                                   // puesto que ya se establece en el constructor de EditarHandle
    botonEditar.addEventListener("click", manejadorEditar);

    // BOTÓN BORRAR
    const botonBorrar = document.createElement("button");
    botonBorrar.textContent = "Borrar";
    botonBorrar.type = "button";
    botonBorrar.classList.add("gasto-borrar");

    let manejadorBorrar = new BorrarHandle(gasto);
    botonBorrar.addEventListener("click", manejadorBorrar);

    // BOTÓN EDITAR FORMULARIO
    const botonEditarFormulario = document.createElement("button");
    botonEditarFormulario.textContent = "Editar (formulario)";
    botonEditarFormulario.type = "button";
    botonEditarFormulario.classList.add("gasto-editar-formulario");

    let manejadorEditarFormulario = new EditarHandleFormulario(gasto);
    botonEditarFormulario.addEventListener("click", manejadorEditarFormulario);

    // AÑADIENDO elementos
    gast.append(gastoDescripcion, gastoFecha, gastoValor, gastoEtiquetas, botonEditar, botonBorrar, botonEditarFormulario);

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
    const introduzcaPresupuesto = prompt("Introduzca un presupuesto", "0");
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

function nuevoGastoWebFormulario() {
    // Crear una copia del formulario web definido en la plantilla HTML
    let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
    
    // Acceder al elemento <form> dentro de ese fragmento de documento
    let formulario = plantillaFormulario.querySelector("form");

    // Desactivar botón de añadir gastos
    const botonAnyadirGasto = document.getElementById("anyadirgasto-formulario");
    botonAnyadirGasto.disabled = true;

    document.getElementById("controlesprincipales").append(formulario);

    let manejarCancelar = new CancelarFormularioHandle(formulario, botonAnyadirGasto);
    formulario.querySelector("button.cancelar").addEventListener("click", manejarCancelar);

    // Pasar función como manejadora de evento
    formulario.addEventListener("submit", manejadorEnvioFormulario);
}

function manejadorEnvioFormulario(eventoEnvio) {
    // No recargar página para no enviar formulario
    eventoEnvio.preventDefault();

    // Obtener formulario
    let formulario = eventoEnvio.currentTarget;

    let descripcion = formulario.descripcion.value;
    let valor = parseFloat(formulario.valor.value);
    let fecha = Date.parse(formulario.fecha.value);
    let etiquetas = formulario.etiquetas.value.split(", ");

    let gasto = new gestionPresupuesto.CrearGasto(descripcion, valor, fecha, ...etiquetas);
    gestionPresupuesto.anyadirGasto(gasto);
    // Reactivar botón anyadirgasto-formulario
    document.getElementById("anyadirgasto-formulario").disabled = false;

    let botonEditarForm = document.querySelector(".gasto-editar-formulario");
    botonEditarForm.disabled = false;
    repintar();
    formulario.remove()
}

function manejadorEnvioEditarFormulario(eventoEnvio, gasto) {
    // No recargar página para no enviar formulario
    eventoEnvio.preventDefault();

    // Obtener formulario
    let formulario = eventoEnvio.currentTarget;

    let descripcion = formulario.descripcion.value;
    let valor = parseFloat(formulario.valor.value);
    let fecha = formulario.fecha.value;
    let etiquetas = formulario.etiquetas.value.split(", ");

    gasto.descripcion = descripcion;
    gasto.valor = valor;
    gasto.fecha = fecha;
    gasto.etiquetas = etiquetas;

    // Reactivar botón anyadirgasto-formulario
    document.getElementById("anyadirgasto-formulario").disabled = false;

    let botonEditarForm = document.querySelector(".gasto-editar-formulario");
    botonEditarForm.disabled = false;
    formulario.remove();
    repintar();
}

function filtrarGastosWeb(evento) {
    evento.preventDefault();

    const descripcion = document.getElementById("formulario-filtrado-descripcion").value;
    const valorMinimo = document.getElementById("formulario-filtrado-valor-minimo").value;
    const valorMaximo = document.getElementById("formulario-filtrado-valor-maximo").value;
    const fechaInicial = document.getElementById("formulario-filtrado-fecha-desde").value;
    const fechaFinal = document.getElementById("formulario-filtrado-fecha-hasta").value;
    const etiquetas = document.getElementById("formulario-filtrado-etiquetas-tiene").value;

    let arrayEtiquetas = [];
    if (etiquetas.trim() !== "") {
        arrayEtiquetas = gestionPresupuesto.transformarListadoEtiquetas(etiquetas);
    }

    // Si no hay valor en el campo, se asigna el VALOR DEFINIDO null, en lugar de estar indefined
    const objetoGastoFiltrado = {fechaDesde: fechaInicial || null, fechaHasta: fechaFinal || null, valorMinimo: valorMinimo || null,
                                valorMaximo: valorMaximo || null, descripcionContiene: descripcion || null, etiquetasTiene: arrayEtiquetas.length > 0 ? arrayEtiquetas : null};

    const resultadoFiltrado = gestionPresupuesto.filtrarGastos(objetoGastoFiltrado);

    const listadoGastosCompleto = document.getElementById("listado-gastos-completo");
    listadoGastosCompleto.innerHTML = "";

    resultadoFiltrado.forEach(gasto => {
        mostrarGastoWeb("listado-gastos-completo", gasto);
    });
}

function guardarGastosWeb() {
    let gastosAJSON = JSON.stringify(gestionPresupuesto.listarGastos());

    localStorage.setItem("GestorGastosDWEC", gastosAJSON);
}

function cargarGastosWeb() {
    const obtenerGastosJSON = localStorage.getItem("GestorGastosDWEC");

    // Convertimos la cadena JSON a array de objetos PLANOS (sin acceso a sus métodos) o asignamos array vacío en caso de no existir la clave en el almacenamiento
    const gastosListadosPlanos = obtenerGastosJSON ? JSON.parse(obtenerGastosJSON) : [];

    gestionPresupuesto.cargarGastos(gastosListadosPlanos);    // En este momento, cargarGastos crea nuevos objetos CrearGasto, y copia en ellos las propiedades
                                                              // de los objetos planos que le estamos pasando (gastosListadosPlanos)

    repintar();
}

//* INICIALIZADORES DE EVENTO
document.getElementById("actualizarpresupuesto").addEventListener("click", actualizarPresupuestoWeb);
document.getElementById("anyadirgasto").addEventListener("click", nuevoGastoWeb);
document.getElementById("anyadirgasto-formulario").addEventListener("click", nuevoGastoWebFormulario);
document.getElementById("formulario-filtrado").addEventListener("submit", filtrarGastosWeb);
document.getElementById("guardar-gastos").addEventListener("click", guardarGastosWeb);
document.getElementById("cargar-gastos").addEventListener("click", cargarGastosWeb);



//* EXPORTACIÓN DE FUNCIONES
export {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb,
}