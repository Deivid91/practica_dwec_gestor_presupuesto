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

export {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb
}