
//Recupero el string de mejores resultados de cada juego del localStorage
let stringCartas = localStorage.getItem('posicionesCartas');
let stringDados = localStorage.getItem('posicionesDados');

//Vuelvo a convertir cada string en un array de objetos
let arrayCartas = JSON.parse(stringCartas) || [];
let arrayDados = JSON.parse(stringDados) || [];
// console.log(arrayCartas);
// console.log(arrayDados);

//Capturo cada tabla contenedora de los elementos HTML que se agregarán
const tablaCartas = document.querySelector('#cuerpo-tabla-cartas');
const tablaDados = document.querySelector('#cuerpo-tabla-dados');

//Función para cargar cada objeto como una nueva línea de la tabla
function cargarTabla (arrayDatos, tabla) {
    if (arrayDatos.length == 0) {
        //Si no hay ningún resultado guardado, muestra una sola fila sin datos a mostrar
        let jugador = document.createElement('tr'); 
        jugador.innerHTML = '<td colspan="5" style="text-align:center;">No hay resultados para mostrar</td>';
        tabla.append(jugador);
    } else { //Si tengo aunque sea un dato guardado
        for (i=0 ; i < arrayDatos.length ; i ++) {
            //Creo un nuevo elemento HTML a agregar
            let jugador = document.createElement('tr'); 

            if (arrayDatos == arrayCartas) {
                //Le modifico el innerHTML con los datos del objeto
                jugador.innerHTML = `<td>${i+1}</td>
                                    <td>${arrayCartas[i].nombre}</td>
                                    <td>${arrayCartas[i].rondas}</td>
                                    <td>${arrayCartas[i].puntos}</td>
                                    <td>${arrayCartas[i].fecha}</td>`;
            } else {
                jugador.innerHTML = `<td>${i+1}</td>
                                    <td>${arrayDatos[i].nombre}</td>
                                    <td>${arrayDatos[i].turnos}</td>
                                    <td>${arrayDatos[i].fecha}</td>`;
            }

            //Y finalmente lo agrego a la tabla
            tabla.append(jugador);
        }
    }
}

//Ejecuto la función con los tres arrays de cada juego
cargarTabla (arrayCartas, tablaCartas);
cargarTabla (arrayDados, tablaDados);
