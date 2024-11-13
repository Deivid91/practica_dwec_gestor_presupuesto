// Importación de todas las funciones de los dos ficheros indicados
import * as gestionPresupuesto from './gestionPresupuesto.js';
import * as gestionPresupuestoWeb from './gestionPresupuestoWeb.js';

// Actualizando el presupuesto a 1500
gestionPresupuesto.actualizarPresupuesto(1500);

// Mostrar el presupuesto en el div#presupuesto
gestionPresupuestoWeb.mostrarDatoEnId("presupuesto", gestionPresupuesto.mostrarPresupuesto());

// Creación de gastos ¡NO OLVIDAR NEW (es función constructora)
const gastoCarne = new gestionPresupuesto.CrearGasto("Compra carne", 23.44, "2021-10-06", "casa", "comida");
const gastoFrutaVerdura = new gestionPresupuesto.CrearGasto("Compra fruta y verdura", 14.25, "2021-09-06", "supermercado", "comida");
const gastoBonobus = new gestionPresupuesto.CrearGasto("Bonobús", 18.60, "2020-05-26", "transporte");
const gastoGasolina = new gestionPresupuesto.CrearGasto("Gasolina", 60.42, "2021-10-08", "transporte", "gasolina");
const gastoSeguroHogar = new gestionPresupuesto.CrearGasto("Seguro hogar", 206.45, "2021-09-26", "casa", "seguros");
const gastoSeguroCoche = new gestionPresupuesto.CrearGasto("Seguro coche", 195.78, "2021-10-06", "transporte", "seguros");

// Añadir los gastos creados
gestionPresupuesto.anyadirGasto(gastoCarne);
gestionPresupuesto.anyadirGasto(gastoFrutaVerdura);
gestionPresupuesto.anyadirGasto(gastoBonobus);
gestionPresupuesto.anyadirGasto(gastoGasolina);
gestionPresupuesto.anyadirGasto(gastoSeguroHogar);
gestionPresupuesto.anyadirGasto(gastoSeguroCoche);

// Mostrar los gastos totales en div#gastos-totales
gestionPresupuestoWeb.mostrarDatoEnId("gastos-totales", gestionPresupuesto.calcularTotalGastos());

// Mostrar el balance total en div#balance-total
gestionPresupuestoWeb.mostrarDatoEnId("balance-total", gestionPresupuesto.calcularBalance());

// Mostrar el listado completo de gastos en div#listado-gastos-completo
const listadoCompleto = gestionPresupuesto.listarGastos();
listadoCompleto.forEach(gasto => {
    gestionPresupuestoWeb.mostrarGastoWeb("listado-gastos-completo", gasto);
});

// Mostrar el listado de gastos realizados en septiembre de 2021 en div#listado-gastos-filtrado-1
const gastosSeptiembre2021 = gestionPresupuesto.filtrarGastos({fechaDesde: "2021-09-01", fechaHasta: "2021-09-30"});

gastosSeptiembre2021.forEach(gasto => {
    gestionPresupuestoWeb.mostrarGastoWeb("listado-gastos-filtrado-1", gasto);
});

// Mostrar el listado de gastos de más de 50€ en div#listado-gastos-filtrado-2
const gastosMayor50 = gestionPresupuesto.filtrarGastos({valorMinimo: 50});
gastosMayor50.forEach(gasto => {
    gestionPresupuestoWeb.mostrarGastoWeb("listado-gastos-filtrado-2", gasto);
});

// Mostrar el listado de gastos de más de 200€ con etiqueta seguros en div#listado-gastos-filtrado-3
const gastosEtiqYMayor200 = gestionPresupuesto.filtrarGastos({etiqueta: "seguros", valorMinimo: 200});
gastosEtiqYMayor200.forEach(gasto => {
    gestionPresupuestoWeb.mostrarGastoWeb("listado-gastos-filtrado-3", gasto);
});

// Mostrar el listado de gastos que tengan las etiquetas comida o transporte de menos de 50€ en div#listado-gastos-filtrado-4
const gastosEtiqYMenor50 = gestionPresupuesto.filtrarGastos({etiquetasTiene: ["comida", "transporte"], valorMaximo: 50});
gastosEtiqYMenor50.forEach(gasto => {
    gestionPresupuestoWeb.mostrarGastoWeb("listado-gastos-filtrado-4", gasto);
});

// Mostrar el total de gastos agrupados por día en div#agrupacion-dia
const agruparPorDia = gestionPresupuesto.agruparGastos("dia");
gestionPresupuestoWeb.mostrarGastosAgrupadosWeb("agrupacion-dia", agruparPorDia, "día");

// Mostrar el total de gastos agrupados por mes en div#agrupacion-mes
const agruparPorMes = gestionPresupuesto.agruparGastos("mes");
gestionPresupuestoWeb.mostrarGastosAgrupadosWeb("agrupacion-mes", agruparPorMes, "mes");

// Mostrar el total de gastos agrupados por año en div#agrupacion-anyo
const agruparPorAnyo = gestionPresupuesto.agruparGastos("anyo");
gestionPresupuestoWeb.mostrarGastosAgrupadosWeb("agrupacion-anyo", agruparPorAnyo, "año");