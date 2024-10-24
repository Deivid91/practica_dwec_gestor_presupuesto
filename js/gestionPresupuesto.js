// TODO: Crear las funciones, objetos y variables indicadas en el enunciado

// Variable global
let presupuesto = 0;
let gastos = []; // Almacena listado de gastos
let idGasto = 0; // Almacena id actual del gasto añadido


function actualizarPresupuesto(nuevoPresupuesto) {
    if (nuevoPresupuesto >= 0) {
        presupuesto = nuevoPresupuesto;
        return presupuesto; 
    }
    else {
        console.log("Error: Introduzca un número no negativo");
        return -1;
    }
}

function mostrarPresupuesto() {
    return `Tu presupuesto actual es de ${presupuesto} €`;
}

function listarGastos() {
   return gastos;
}

function anyadirGasto(gasto) {
    gasto.id = idGasto; // Se crea la propiedad 'id' del objeto gasto y se le otorga el valor de idGasto
    idGasto++;
    gastos.push(gasto);

}

function borrarGasto(idGasto) {
    // Uso findIndex en vez de find, ya que necesitaré la posición del elemento para poder borrarlo con splice
    // Comprobamos con !== -1 que se ha encontrado el id en el array, y lo eliminamos
    if (gastos.findIndex(itemGasto => itemGasto.id === idGasto) !== -1) { 
        gastos.splice(gastos.findIndex(itemGasto => itemGasto.id === idGasto), 1);
    }
    /* Función Anónima en vez de flecha:
    gastos.findIndex(function(itemGasto) {
    return itemGasto.id === idGasto;
    }); */
}

function calcularTotalGastos() {
    return gastos.reduce((acumulador, itemActual) => acumulador + itemActual.valor, 0); // 0 es el valor inicial del acumulador
                                                                                        // OJO que accedemos a la propiedad valor
}

function calcularBalance() {
    let gastosTotales = calcularTotalGastos();
    return presupuesto - gastosTotales;
}

function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
    this.descripcion = (typeof descripcion === 'string') ? descripcion : String(descripcion);
    this.valor = (typeof valor === 'number' && valor >= 0) ? valor : 0;
    this.fecha = isNaN(Date.parse(fecha)) ? Date.now() : Date.parse(fecha); // Date.parse(fecha) podría devolver isNaN, en cuyo caso la fecha no sería válida 
                                                                            // (los timestamp se representan en forma de número) 
    this.etiquetas = etiquetas;

    this.mostrarGasto = function() {
        return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
    };

    this.actualizarDescripcion = function(nuevaDescripcion) {
        this.descripcion = nuevaDescripcion;
    };

    this.actualizarValor = function(nuevoValor) {
        if (typeof nuevoValor === 'number' && nuevoValor >= 0) {
            this.valor = nuevoValor;
        }
        else {
            console.log("Error: Introduzca un número no negativo.");
        };
    }

    this.mostrarGastoCompleto = function() {
        let etiquetasListadas = "";

        for (let i = 0; i < this.etiquetas.length; i++) {
            etiquetasListadas += `- ${this.etiquetas[i]}\n`;
        }
        return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.`+
        `\nFecha: ${new Date(this.fecha).toLocaleString()}\nEtiquetas:\n${etiquetasListadas}`; // new Date para convertir el timestamp en objeto Date,
    }

    this.actualizarFecha = function(nuevaFecha) {
        if (!isNaN(Date.parse(nuevaFecha))) {
            this.fecha = Date.parse(nuevaFecha);
        }
        else
            console.log("Fecha introducida no válida.");
    }

    this.anyadirEtiquetas = function(...nuevasEtiquetas) {
        for (let i = 0; i < nuevasEtiquetas.length; i++) {
            if (!this.etiquetas.includes(nuevasEtiquetas[i])) {
                this.etiquetas.push(nuevasEtiquetas[i]);
            }
        }
    }
    
    this.borrarEtiquetas = function(...etiquetasAEliminar) {
        for (let i = 0; i < etiquetasAEliminar.length; i++) {
            if (this.etiquetas.includes(etiquetasAEliminar[i])) {
                this.etiquetas.splice(this.etiquetas.indexOf(etiquetasAEliminar[i]), 1); // Usamos indexOf puesto que para usar splice necesitamos saber la posición del ítem.
            }
        }
    }
}


// NO MODIFICAR A PARTIR DE AQUÍ: exportación de funciones y objetos creados para poder ejecutar los tests.
// Las funciones y objetos deben tener los nombres que se indican en el enunciado
// Si al obtener el código de una práctica se genera un conflicto, por favor incluye todo el código que aparece aquí debajo
export   {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance
}