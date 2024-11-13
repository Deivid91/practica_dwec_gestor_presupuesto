// PROGRAMA/LIBRERÍA QUE DEFINIRÁ UNA SERIE DE FUNCIONES PARA INTERACTUAR CON EL DOM Y MOSTRAR LOS DATOS EN HTML

import * as gestionPresupuesto from './gestionPresupuesto.js';

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
    
            gastoEtiquetas.append(gastoEtiquetasEtiqueta);
        });
    }

    // AÑADIENDO elementos
    gast.append(gastoDescripcion, gastoFecha, gastoValor, gastoEtiquetas);

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
    document.getElementById("listado-gastos-completos").innerHTML = "";
    const mostrarListadoGastos = gestionPresupuesto.listarGastos();
    mostrarListadoGastos.forEach(gast => {
        mostrarGastoWeb("listado-gastos-completo", gast);
    });
}

function actualizarPresupuestoWeb() {
    const introduzcaPresupuesto = prompt("Introduzca un presupuesto", "");
    parseFloat(introduzcaPresupuesto);
    if (!isNaN(introduzcaPresupuesto)) {
        gestionPresupuesto.actualizarPresupuesto(introduzcaPresupuesto);
        repintar(); // Actualizar el presupuesto provoca cambios en el balance, por lo que al ejecutar repintar se actualizarán ambos campos
    }
    else {
        alert("Introduzca un número válido.");
    }

    // Añadir función como manejadora del evento del botón actualizarpresupuesto
    document.getElementById("actualizarpresupuesto").addEventListener("click", actualizarPresupuestoWeb);
}

function EditarHandle(gasto) {
    this.gasto = gasto;
    
    /* handleEvent: Cuando creemos un objeto basado en su prototipo, 
    asignaremos a dicho objeto una propiedad llamada gasto, que será una referencia al gasto 
    que estemos editando. El código de la función handleEvent podrá hacer referencia a dicho 
    gasto a través de this.gasto, ya que es una propiedad del objeto */
    this.handleEvent = function() {
        const editeDescripcion = prompt("Edita la descripción del gasto", this.gasto.descripcion);
        const editeValor = prompt("Edite el valor del gasto", this.gasto.valor);
        const editeFecha = prompt("Edite la fecha del gasto (formato yyyy-mm-dd)", this.gasto.fecha);
        const editeEtiquetas = prompt("Edite las etiquetas del gasto (separe cada una con una coma)", this.gasto.etiquetas);

        parseFloat(editeValor);
        editeEtiquetas = editeEtiquetas.split(", "); // .split convierte string a array (entre paréntesis el delimitante)
        
        this.gasto.actualizarValor;
        this.gasto.actualizarDescripcion;
        this.gasto.actualizarFecha;
        this.gasto.anyadirEtiquetas;

        repintar();
    }
}

function BorrarHandle(gasto) {
    this.gasto = gasto
    this.handleEvent = function() {
        const editeDescripcion = prompt("Edita la descripción del gasto", this.gasto.descripcion);
        const editeValor = prompt("Edite el valor del gasto", this.gasto.valor);
        const editeFecha = prompt("Edite la fecha del gasto (formato yyyy-mm-dd)", this.gasto.fecha);
        const editeEtiquetas = prompt("Edite las etiquetas del gasto (separe cada una con una coma)", this.gasto.etiquetas);

        parseFloat(editeValor);
        editeEtiquetas = editeEtiquetas.split(", "); // .split convierte string a array (entre paréntesis el delimitante)
        
        this.gasto.actualizarValor;
        this.gasto.actualizarDescripcion;
        this.gasto.actualizarFecha;
        this.gasto.anyadirEtiquetas;

        repintar();
    }
}


export {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb
}