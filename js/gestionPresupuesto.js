// PROGRAMA/LIBRERÍA QUE CONTIENE LA LÓGICA DE NEGOCIO DE LA APLICACIÓN

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
        // console.log("Error: Introduzca un número no negativo");
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

//* PARA ENTENDER LA SIGUIENTE FUNCIÓN, VER PRIMERO agruparGastos
function filtrarGastos(filtro) { /* el parámetro filtro representa el objeto filtr que se crea en agruparGastos (siguiente función). 
                                    Las propiedades del objeto filtro deben tener el mismo nombre que las propiedades
                                    del parámetro de filtrarGastos (fechaDesde, fechaHasta, etiquetasTiene) */
    return gastos.filter(gasto => {

        if (filtro.fechaDesde && gasto.fecha < Date.parse(filtro.fechaDesde)) { // Convertir fechaDesde a timestamp (Date.parse) para poder compararlo
            return false;
        }
        if (filtro.fechaHasta && gasto.fecha > Date.parse(filtro.fechaHasta)) {
            return false;
        }
        if (filtro.valorMinimo && gasto.valor < filtro.valorMinimo) {
            return false;
        }
        if (filtro.valorMaximo && gasto.valor > filtro.valorMaximo) {
            return false;
        }
        if (filtro.descripcionContiene && gasto.descripcion.toLowerCase().indexOf(filtro.descripcionContiene.toLowerCase()) === -1) {
            return false;
        }
        if (filtro.etiquetasTiene) {
            let tiene = filtro.etiquetasTiene.some(etiq => gasto.etiquetas.some(gastoEt => gastoEt.toLowerCase() === etiq.toLowerCase()));
            if (!tiene) {
                return false;
            }
        }
        return true;
    });
}

function agruparGastos(periodo = "mes", etiquetas, fechaDesde, fechaHasta) {
    // Se define objeto filtro con unas propiedades 
    const filtr = {
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta,
        etiquetasTiene: etiquetas
    };
    const gastosFiltrados = filtrarGastos(filtr); 

    // Agregamos los gastos por periodo
    // acc: ACUMULADO
    // gasto: ACTUAL
    return gastosFiltrados.reduce((acc, gasto) => {
        let period = gasto.obtenerPeriodoAgrupacion(periodo);
        
        // Si el mes ya existe, sumamos el valor del gasto
        if (acc[period]) {
            acc[period] += gasto.valor;
        }
        // Si no existe, se crea y se asigna el valor del gasto
        else{
            acc[period] = gasto.valor;
        }
        return acc;
    }, {}) // OJO a las llaves {}, porque es objeto (como VALOR INICIAL vacío) / Usaríamos [] para array.
}

function transformarListadoEtiquetas(etiquetas) {
    return etiquetas.split(/[,.:;\s]+/);    // split transforma cadena en array
    // también funciona return etiquetas.match(/\w+/g);
}

function cargarGastos(gastosAlmacenamiento) {
    // gastosAlmacenamiento es un array de objetos "planos"
    // No tienen acceso a los métodos creados con "CrearGasto":
    // "anyadirEtiquetas", "actualizarValor",...
    // Solo tienen guardadas sus propiedades: descripcion, valor, fecha y etiquetas
  
    // Reseteamos la variable global "gastos"
    gastos = [];
    // Procesamos cada gasto del listado pasado a la función
    for (let gasto of gastosAlmacenamiento) {
        // Creamos un nuevo objeto mediante el constructor
        // Este objeto tiene acceso a los métodos "anyadirEtiquetas", "actualizarValor",...
        // Pero sus propiedades (descripcion, valor, fecha y etiquetas) están sin asignar
        let gastoRehidratado = new CrearGasto();
        // Copiamos los datos del objeto guardado en el almacenamiento
        // al gasto rehidratado
        // https://es.javascript.info/object-copy#cloning-and-merging-object-assign
        Object.assign(gastoRehidratado, gasto);
        // Ahora "gastoRehidratado" tiene las propiedades del gasto
        // almacenado y además tiene acceso a los métodos de "CrearGasto"
          
        // Añadimos el gasto rehidratado a "gastos"
        gastos.push(gastoRehidratado)
    }
}
    


// Función constructora
function CrearGasto(descripcion, valor, fecha, ...etiquetas) {  // Función constructora
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

    this.obtenerPeriodoAgrupacion =  function(periodo) {
        const fech = new Date(this.fecha); // Convirtiendo timestamp (número) a objeto Date

        const dia = String(fech.getDate()).padStart(2, '0'); /* Se utiliza el padStart para meter el 0 delante
                                                                si el día es de un dígito. padStart() está diseñado para strings,
                                                                de ahí la conversión.*/
        const mes = String(fech.getMonth() + 1).padStart(2, '0'); 
        const anyo = fech.getFullYear();

        if (periodo === "dia") {
            return `${anyo}-${mes}-${dia}`;
        }
        else if (periodo === "mes") {
            return `${anyo}-${mes}`;
        }
        else if (periodo === "anyo") {
            return `${anyo}`;
        }
        else {
            console.log("Valor no válido.");
            return null;
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
    calcularBalance,
    filtrarGastos,
    agruparGastos,
    transformarListadoEtiquetas,
    cargarGastos
}