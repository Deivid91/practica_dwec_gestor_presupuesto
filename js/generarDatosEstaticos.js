// Importación de todas las funciones de los dos ficheros indicados
import * as gestionPresupuesto from './gestionPresupuesto.js';
import * as gestionPresupuestoWeb from './gestionPresupuestoWeb.js';

// Actualizando el presupuesto a 1500
gestionPresupuesto.actualizarPresupuesto(1500);

// Mostrar el presupuesto en el div#presupuesto
gestionPresupuestoWeb.mostrarDatoEnId("presupuesto", gestionPresupuesto.mostrarPresupuesto());

// Creación de gastos
const gastoCarne = gestionPresupuesto.CrearGasto("Compra carne", 23.44, "2021-10-06", "casa", "comida");
const gastoFrutaVerdura = gestionPresupuesto.CrearGasto("Compra fruta y verdura", 14.25, "2021-09-06", "supermercado", "comida");
const gastoBonobus = gestionPresupuesto.CrearGasto("Bonobús", 18.60, "2020-05-26", "transporte");
const gastoGasolina = gestionPresupuesto.CrearGasto("Gasolina", 60.42, "2021-10-08", "transporte", "gasolina");
const gastoSeguroHogar = gestionPresupuesto.CrearGasto("Seguro hogar", 206.45, "2021-09-26", "casa", "seguros");
const gastoSeguroCoche = gestionPresupuesto.CrearGasto("Seguro coche", 195.78, "2021-10-06", "transporte", "seguros");

// Añadir los gastos creados
gestionPresupuesto.anyadirGasto(gastoCarne);
gestionPresupuesto.anyadirGasto(gastoFrutaVerdura);
gestionPresupuesto.anyadirGasto(gastoBonobus);
gestionPresupuesto.anyadirGasto(gastoGasolina);
gestionPresupuesto.anyadirGasto(gastoSeguroHogar);
gestionPresupuesto.anyadirGasto(gastoSeguroCoche);

// Mostrar los gastos totales en div#gastos-totales
gestionPresupuestoWeb.mostrarDatoEnId("gastos-totales", gestionPresupuesto.calcularTotalGastos());
