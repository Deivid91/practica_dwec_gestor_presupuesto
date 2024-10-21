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

function CrearGasto(descripcion, valor) {
    this.descripcion = descripcion;
    this.valor = (typeof valor === 'number' && valor >= 0) ? valor : 0;

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
}

// Práctica Fundamentos de JavaScript II
function listarGastos() {

}

function anyadirGasto() {

}

function borrarGasto() {

}

function calcularTotalGastos() {

}

function calcularBalance() {

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
