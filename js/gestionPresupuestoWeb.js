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

function BorrarApiHandle(gasto) {
    this.id = gasto.gastoId;
}
BorrarApiHandle.prototype.handleEvent = async function() {
    let recogerNombreUsuario = document.getElementById("nombre_usuario").value;
    
    let url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${recogerNombreUsuario}/${this.id}`;

    try {
        let response = await fetch(url, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error("Se ha producido un error");
        }
        cargarGastosApi();
    } catch (error) {
        console.error("Error:", error);
    }
}

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
        if (Array.isArray(this.gasto.etiquetas)) {
            formulario.etiquetas.value = this.gasto.etiquetas.join(",");
        }
        else {
            formulario.etiquetas.value = this.gasto.etiquetas.split(",");
        }

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

    // Manejador de eventos para botón gasto-enviar-api
    formulario.querySelector(".gasto-enviar-api").addEventListener("click", async (event) => {
        event.preventDefault();

        let recogerNombreUsuario = document.getElementById("nombre_usuario").value;
        let url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${recogerNombreUsuario}/${this.gasto.gastoId}`;

        let formData = new FormData(formulario);
        let gastoActualizado = {};

        formData.forEach((value, key) => {
            if (key === "etiquetas") {
                gastoActualizado[key] = value.split (",").map(et => et.trim());
            } else {
                gastoActualizado[key] = value;
            }
        });

        try {
            let response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gastoActualizado)
            });
            if (!response.ok) {
                throw new Error("Se ha producido un error");
            }

            cargarGastosApi();
        } catch (error) {
            console.error("Error:", error);
        }
    });
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
    let fechaLegible = new Date(gasto.fecha).toLocaleDateString({
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    gastoFecha.textContent = fechaLegible;
    
    let gastoValor = document.createElement("div");
    gastoValor.classList.add("gasto-valor");
    gastoValor.textContent = gasto.valor;

    let gastoEtiquetas = document.createElement("div");
    gastoEtiquetas.classList.add("gasto-etiquetas");

    if (!Array.isArray(gasto.etiquetas) && typeof gasto.etiquetas === "string") {
        gasto.etiquetas = gasto.etiquetas.split(",").map(et => et.trim());
    }
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
    
    // BOTÓN BORRAR (API)
    const botonBorrarApi = document.createElement("button");
    botonBorrarApi.textContent = "Borrar (API)";
    botonBorrarApi.type = "button";
    botonBorrarApi.classList.add("gasto-borrar-api");

    let manejadorBorrarApi = new BorrarApiHandle(gasto);
    botonBorrarApi.addEventListener("click", manejadorBorrarApi);

    // BOTÓN EDITAR FORMULARIO
    const botonEditarFormulario = document.createElement("button");
    botonEditarFormulario.textContent = "Editar (formulario)";
    botonEditarFormulario.type = "button";
    botonEditarFormulario.classList.add("gasto-editar-formulario");

    let manejadorEditarFormulario = new EditarHandleFormulario(gasto);
    botonEditarFormulario.addEventListener("click", manejadorEditarFormulario);

    // AÑADIENDO elementos
    gast.append(gastoDescripcion, gastoFecha, gastoValor, gastoEtiquetas, botonEditar, botonBorrar, botonBorrarApi, botonEditarFormulario);

    document.getElementById(idElemento).append(gast);
}


function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {
    // Obtener la capa donde se muestran los datos agrupados por el período indicado.
    // Seguramente este código lo tengas ya hecho pero el nombre de la variable sea otro.
    // Puedes reutilizarlo, por supuesto. Si lo haces, recuerda cambiar también el nombre de la variable en el siguiente bloque de código
    var divP = document.getElementById(idElemento);
    // Borrar el contenido de la capa para que no se duplique el contenido al repintar
    divP.innerHTML = "";
    
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
        agrupacionDatoClave.textContent = `Fecha: ${clave} | `;

        let agrupacionDatoValor = document.createElement("span");
        agrupacionDatoValor.classList.add("agrupacion-dato-valor");
        agrupacionDatoValor.textContent = ` Valor: ${parseFloat(valor).toFixed(2)}€`;

        agrupacion.append(agrupacionDato);
        agrupacionDato.append(agrupacionDatoClave, agrupacionDatoValor);
    }

    document.getElementById(idElemento).append(agrupacion);
    // Estilos
    divP.style.width = "33%";
    divP.style.display = "inline-block";
    // Crear elemento <canvas> necesario para crear la gráfica
    // https://www.chartjs.org/docs/latest/getting-started/
    let chart = document.createElement("canvas");
    // Variable para indicar a la gráfica el período temporal del eje X
    // En función de la variable "periodo" se creará la variable "unit" (anyo -> year; mes -> month; dia -> day)
    let unit = "";
    switch (periodo) {
    case "anyo":
        unit = "year";
        break;
    case "mes":
        unit = "month";
        break;
    case "dia":
    default:
        unit = "day";
        break;
    }

    // Creación de la gráfica
    // La función "Chart" está disponible porque hemos incluido las etiquetas <script> correspondientes en el fichero HTML
    const myChart = new Chart(chart.getContext("2d"), {
        // Tipo de gráfica: barras. Puedes cambiar el tipo si quieres hacer pruebas: https://www.chartjs.org/docs/latest/charts/line.html
        type: 'bar',
        data: {
            datasets: [
                {
                    // Título de la gráfica
                    label: `Gastos por ${periodo}`,
                    // Color de fondo
                    backgroundColor: "#555555",
                    // Datos de la gráfica
                    // "agrup" contiene los datos a representar. Es uno de los parámetros de la función "mostrarGastosAgrupadosWeb".
                    data: agrup
                }
            ],
        },
        options: {
            scales: {
                x: {
                    // El eje X es de tipo temporal
                    type: 'time',
                    time: {
                        // Indicamos la unidad correspondiente en función de si utilizamos días, meses o años
                        unit: unit
                    }
                },
                y: {
                    // Para que el eje Y empieza en 0
                    beginAtZero: true
                }
            }
        }
    });
    // Añadimos la gráfica a la capa
    divP.append(chart);
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
    // Mostrar el total de gastos agrupados por día en div#agrupacion-dia
    const agruparPorDia = gestionPresupuesto.agruparGastos("dia");
    mostrarGastosAgrupadosWeb("agrupacion-dia", agruparPorDia, "día"); // OJO a la tilde
    
    // Mostrar el total de gastos agrupados por mes en div#agrupacion-mes
    const agruparPorMes = gestionPresupuesto.agruparGastos("mes");
    mostrarGastosAgrupadosWeb("agrupacion-mes", agruparPorMes, "mes");
    
    // Mostrar el total de gastos agrupados por año en div#agrupacion-anyo
    const agruparPorAnyo = gestionPresupuesto.agruparGastos("anyo");
    mostrarGastosAgrupadosWeb("agrupacion-anyo", agruparPorAnyo, "año"); // OJO a aÑo
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

    // Manejador eventos para botón gasto-enviar-api
    formulario.querySelector(".gasto-enviar-api").addEventListener("click", async function (evento) {
        evento.preventDefault();

        let recogerNombreUsuario = document.getElementById("nombre_usuario").value;
        let url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${recogerNombreUsuario}`;
        
        let formData = new FormData(formulario);
        let gasto = {};

        formData.forEach((value, key) => {
            if (key === "etiquetas") {
                gasto[key] = value.split (",").map(et => et.trim());
            } else {
                gasto[key] = value;
            }
        });

        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gasto)
            });

            if (!response.ok) {
                throw new Error("Se ha producido un error");
            }

            cargarGastosApi();
        } catch (error) {
            console.error("Error:", error);
        }
    });
}

function manejadorEnvioFormulario(eventoEnvio) {
    // No recargar página para no enviar formulario
    eventoEnvio.preventDefault();

    // Obtener formulario
    let formulario = eventoEnvio.currentTarget;

    let descripcion = formulario.descripcion.value;
    let valor = parseFloat(formulario.valor.value);
    let fecha = new Date(formulario.fecha.value);
    let etiquetas = formulario.etiquetas.value.split(", ");

    let gasto = new gestionPresupuesto.CrearGasto(descripcion, valor, fecha, ...etiquetas);
    gestionPresupuesto.anyadirGasto(gasto);
    // Reactivar botón anyadirgasto-formulario
    document.getElementById("anyadirgasto-formulario").disabled = false;

    let botonEditarForm = document.querySelector(".gasto-editar-formulario");
    botonEditarForm.disabled = false;
    repintar();
    formulario.remove();
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

async function cargarGastosApi() {
    let recogerNombreUsuario = document.getElementById("nombre_usuario").value;
    try {
        let response = await fetch(`https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${recogerNombreUsuario}`);
        
        if (response.ok) {
            let gastosJson = await response.json();

            gestionPresupuesto.cargarGastos(gastosJson);
    
            repintar();
        } else {
            alert("Error-HTTP: " + response.status);
        }
    } catch (error) {
        console.log("Error", error);
    }
}

//* INICIALIZADORES DE EVENTO
document.getElementById("actualizarpresupuesto").addEventListener("click", actualizarPresupuestoWeb);
document.getElementById("anyadirgasto").addEventListener("click", nuevoGastoWeb);
document.getElementById("anyadirgasto-formulario").addEventListener("click", nuevoGastoWebFormulario);
document.getElementById("formulario-filtrado").addEventListener("submit", filtrarGastosWeb);
document.getElementById("guardar-gastos").addEventListener("click", guardarGastosWeb);
document.getElementById("cargar-gastos").addEventListener("click", cargarGastosWeb);
document.getElementById("cargar-gastos-api").addEventListener("click", cargarGastosApi);



//* EXPORTACIÓN DE FUNCIONES
export {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb,
}