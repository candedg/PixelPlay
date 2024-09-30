// Dados ////////////////////////////////////////////////////////////////////////////////////////////////////
const dados = [
    { nombre: "dado1", imagen: "img/dados/dado1.png", valor: 1 },
    { nombre: "dado2", imagen: "img/dados/dado2.png", valor: 2 },
    { nombre: "dado3", imagen: "img/dados/dado3.png", valor: 3 },
    { nombre: "dado4", imagen: "img/dados/dado4.png", valor: 4 },
    { nombre: "dado5", imagen: "img/dados/dado5.png", valor: 5 },
    { nombre: "dado6", imagen: "img/dados/dado6.png", valor: 6 },
];

// Selección de elementos del DOM ////////////////////////////////////////////////////////////////////////
const imagenDragon = document.querySelector(".imagen-dragon");
const tumbaDragon = document.querySelector(".tumba-dragon");
const imagenCaballero = document.querySelector(".imagen-jugador");
const tumbaCaballero = document.querySelector(".tumba-jugador");

const btnComenzarDados = document.querySelector("#comenzar");
const btnAtacarDragon = document.querySelector("#atacar-dragon");
const seccionResultadosDados = document.querySelector(".resultados");
const mensajeResultadoFinal = document.querySelector("#resultado-final");
const btnNuevoJuego = document.querySelector("#nuevo-juego");

const ingresarNombreDados = document.querySelector(".nombre-jugador-dados");
const interfazDados = document.querySelector(".juego-dados");
const tituloUsuario = document.querySelector(".nombre-jugador");

const btnSumarHP = document.querySelector("#sumar-hp");
const btnNoSumarHP = document.querySelector("#no-sumar-hp");
const btnInfoTirada = document.querySelector(".btn-info-tirada");
const seccionInfoTirada = document.querySelector(".info-tirada");
const mensajeInfoTirada = document.querySelector(".mensaje-info-tirada");


// declaracion de variables y constantes a utilizar /////////////////////////////////////////////////////
let nombreUsuario;
let contadorTurnos = 0;
let juegoFinalizado = false

let dadoUno;
let dadoDos;

const participantes = [
    { nombre: "dragon", contadorVida: 60, dados: [] },
    { nombre: "caballero", contadorVida: 60, dados: [] },
];

let ganadorDados;
// Obtener la fecha actual
let fechaActual = new Date();

// Obtener partes de la fecha (día, mes, año, hora, etc.)
let dia = fechaActual.getDate(); // Día del mes
let mes = fechaActual.getMonth() + 1; // Mes (0 es enero, por eso sumamos 1)
let año = fechaActual.getFullYear(); // Año completo
let fechaFormateada; //donde se va a guardar la fecha si hay un ganador


// Funciones ////////////////////////////////////////////////////////////////////////////////////////////

// Función para guardar el nombre del usuario y actualizar la interfaz
function guardarUsuario() {
    nombreUsuario = document.querySelector("#nombre-jugador").value.trim().toLowerCase(); //trim se asegura que no haya espacios en blanco
    // console.log(nombreUsuario);
    // Si el valor ingresado está vacío o mediante parseInt puede ser convertido completamente a número, osea que solamente contiene numeros, no sirve
    if (nombreUsuario === "" || parseInt(nombreUsuario) == nombreUsuario) {
        alert("Por favor, ingresa un nombre válido");
        return;
    }

    ingresarNombreDados.style.display = "none";
    interfazDados.style.display = "block";
    tituloUsuario.textContent = nombreUsuario;
    btnAtacarDragon.classList.remove("oculto");
}
// Funcion para atacar al dragón
function atacar(victimario, victima) {
    btnAtacarDragon.classList.add("oculto");
    //Revisar que se ataca a alguien que tenga vida (hp > 0)
    if (participantes[victima].contadorVida > 0) {
        tirarDados(victimario); //mostrar cambio y resultado de dados
        // dependiendo del valor de los dados aplica tipo de ataque
        if (participantes[victimario].dados[0].valor === participantes[victimario].dados[1].valor) {
            switch (participantes[victimario].dados[0].valor) {
                case 6:
                    golpeCritico(victimario, victima);
                    break;
                default:
                    if (participantes[victimario].nombre === "caballero") {
                        btnSumarHP.classList.remove("oculto");
                        btnNoSumarHP.textContent = 
                        `-${participantes[victimario].dados[0].valor + participantes[victimario].dados[1].valor}HP dragón`;
                        btnNoSumarHP.classList.remove("oculto");
                    } else {
                        recuperaHP(victimario, victima);
                    }
                    break;
            }
        } else {
            ataqueComun(victimario, victima);
        }
    } else {
        finDelJuego();
    }
}

// funcion que  agrega dos dados aleatorios al array de dados del atacante
function tirarDados(victimario) {
    participantes[victimario].dados = []; //reinicia el array para que no se acumulen los dados
    for (let i = 0; i < 2; i++) {
        participantes[victimario].dados.push(tirarDadoAleatorio(dados));
    }
    mostrarDados(victimario);
}

// funcion que le pasa un dado aleatorio a tirarDados()
function tirarDadoAleatorio() {
    const indiceAleatorio = Math.floor(Math.random() * dados.length);
    return dados[indiceAleatorio];
}

// muestra los dados del array en la interfaz
function mostrarDados(victimario) {
    dadoUno = document.querySelector(`#dado-uno-${participantes[victimario].nombre}`);
    dadoDos = document.querySelector(`#dado-dos-${participantes[victimario].nombre}`);
    dadoUno.src = participantes[victimario].dados[0].imagen;
    dadoDos.src = participantes[victimario].dados[1].imagen;
}

// uso esta variable para comparaciones mas adelante
let nombreAtacante;
// lo que pasa si el victimario hace un golpe critico
function golpeCritico(victimario, victima) {
    participantes[victima].contadorVida -= 15;
    infoTiradaCritico(victimario, victima);
    let vida = document.querySelector(`#vida-${participantes[victima].nombre}`);
    vida.textContent = Math.max(0, participantes[victima].contadorVida);
    nombreAtacante = participantes[victimario].nombre;
    actualizacionHP();
}
// o que pasa si recuperan hp
function recuperaHP(victimario, victima) {
    participantes[victimario].contadorVida += 12;
    if (participantes[victimario].contadorVida > 60) {
        participantes[victimario].contadorVida = 60
    }
    infoTiradaRecupera(victimario, victima);
    let vida = document.querySelector(`#vida-${participantes[victimario].nombre}`);
    vida.textContent = participantes[victimario].contadorVida;
    nombreAtacante = participantes[victimario].nombre;
    actualizacionHP();
}

// declaro esta variable por fuera de la funcion porque despues vuelvo a usar el dato
let valorAtaque;
// lo que pasa en un ataque comun
function ataqueComun(victimario, victima) {
    valorAtaque = participantes[victimario].dados[0].valor + participantes[victimario].dados[1].valor;
    participantes[victima].contadorVida -= valorAtaque;
    infoTiradaComun(victimario, victima);
    let vida = document.querySelector(`#vida-${participantes[victima].nombre}`);
    vida.textContent = Math.max(0, participantes[victima].contadorVida);
    nombreAtacante = participantes[victimario].nombre;
    actualizacionHP();
}

// pasa al siguiente ataque según corresponda el turno
function continuar(victimario, victima) {
    actualizacionHP(); // Actualizar el HP de los participantes visualmente
        // Determinar si es el turno del caballero o el turno del dragón
        if (participantes[victima].nombre === "caballero") {
            btnAtacarDragon.classList.remove("oculto"); // Mostrar botón de ataque del caballero
        } else {
            turnoDragon(); // Iniciar el turno del dragón
        }
}

// muestra en la interfaz distintos colores para mostrar cambios de vida de participantes
function actualizacionHP() {
    // Cambiar color del HP según los valores de vida
    for (let i = 0; i < participantes.length; i++) {
        let hpEstado = document.querySelector(`.estado-hp-${participantes[i].nombre}`);

        if (participantes[i].contadorVida > 40) {
            hpEstado.style.background = "rgb(99, 174, 99)";
        } else if (participantes[i].contadorVida <= 40 && participantes[i].contadorVida >= 20) {
            hpEstado.style.background = "rgb(255, 211, 50)";
        } else {
            hpEstado.style.background = "rgb(207, 51, 30)";
        }
    }
}

// si alguno de los participantes llego a 0 se termina el juego, sino continua
function revisarFinDelJuego(victimario, victima) {
    if (participantes[victimario].contadorVida <= 0 ||participantes[victima].contadorVida <= 0) {
         finDelJuego();
    } else { continuar(victimario,victima)}
}

// se encarga de pasar los valores correctos a atacar() cuando es turno del dragon
function turnoDragon() {
    atacar(0, 1);
    actualizacionHP();
}

//muestra quin murió
function finDelJuego() {
    btnAtacarDragon.classList.add("oculto");
    if (participantes[0].contadorVida <= 0) {
        imagenDragon.classList.add("oculto");
        tumbaDragon.classList.remove("oculto");
    } else if (participantes[1].contadorVida <= 0) {
        imagenCaballero.classList.add("oculto");
        tumbaCaballero.classList.remove("oculto");
    }
    nuevoTurno();
}

//nos avisa que termino la partida y si ganamos o no
function nuevoTurno() {
    seccionResultadosDados.style.display = "block";
    btnNuevoJuego.classList.remove("oculto");
    if (participantes[0].contadorVida <= 0) {
        // Guardar la puntuación
        // Formatear la fecha
        fechaFormateada = `${dia}/${mes}/${año}`;
        agregarGanadorDados();
        mensajeResultadoFinal.innerHTML =
            '<p id="verde">¡Felicitaciones derrotaste al dragón! <br> Revisa la <a href="posiciones.html" class = "btn-posiciones">tabla de posiciones</a> para averiguar si superaste el récord <br> ¿Vamos de nuevo?</p>';
    } else {
        mensajeResultadoFinal.innerHTML =
            '<p id="rojo">Lo lamento, no lograste derrotar al dragón :( <br> ¿Quieres intentar otra vez?</p>';
    }
}

// resetea todos los valores correspondientes para que el juego pueda volver a comenzar correctamente
function resetJuego() {
    seccionResultadosDados.style.display = "none";
    btnNuevoJuego.classList.add("oculto");
    btnAtacarDragon.classList.remove("oculto");
    imagenCaballero.classList.remove("oculto");
    tumbaCaballero.classList.add("oculto");
    imagenDragon.classList.remove("oculto");
    tumbaDragon.classList.add("oculto");
    for (let i = 0; i < participantes.length; i++) {
        dadoUno = document.querySelector(`#dado-uno-${participantes[i].nombre}`);
        dadoDos = document.querySelector(`#dado-dos-${participantes[i].nombre}`);
        dadoUno.src = dados[0].imagen;
        dadoDos.src = dados[0].imagen;
        participantes[i].contadorVida = 60;
        let hpEstado = document.querySelector(
            `.estado-hp-${participantes[i].nombre}`
        );
        hpEstado.style.background = "rgb(99, 174, 99)";
        let vida = document.querySelector(`#vida-${participantes[i].nombre}`);
        vida.textContent = participantes[i].contadorVida;
    }
    contadorTurnos = 0; //resetear contador para proxima partida
    juegoFinalizado = false //resetear valor del juego finalizado
    nombreUsuario = ""; //resetear el nombre del jugador
    ganadorDados = {};
    ingresarNombreDados.style.display = "block"; //mostrar de nuevo el pedido de nombre
    interfazDados.style.display = "none"; //ocultar la interfaz de los dados
}

//misma funcion para ocultar ambos botones de opciones de dobles no 6
function ocultarBotonesHP() {
    btnSumarHP.classList.add("oculto");
    btnNoSumarHP.classList.add("oculto");
}

// informacion que se muestra en la interfaz si el golpe es critico
function infoTiradaCritico(victimario, victima) {
    btnAtacarDragon.classList.add("oculto");
    mensajeInfoTirada.innerHTML = 
    `¡El ${participantes[victimario].nombre} realizó un GOLPE CRÍTICO! -15HP ${participantes[victima].nombre}.`;
    seccionInfoTirada.classList.remove("oculto");
}

//informacion que se muestra en la interfaz si recupera hp
function infoTiradaRecupera(victimario, victima) {
    btnAtacarDragon.classList.add("oculto");
    mensajeInfoTirada.innerHTML = `¡El ${participantes[victimario].nombre} recupera 12HP!`;
    seccionInfoTirada.classList.remove("oculto");
}

//informacion que se muestra en la interfaz si es un ataque comun
function infoTiradaComun(victimario, victima) {
    btnAtacarDragon.classList.add("oculto");
    mensajeInfoTirada.innerHTML = 
    `El ${participantes[victimario].nombre} le quitó ${valorAtaque}HP al ${participantes[victima].nombre}.`;
    seccionInfoTirada.classList.remove("oculto");
}

//////////////////////////////////////////////////////////////////////////////////////////////

// BOTONES----------------------------------------------------
if (location.href.includes("dados.html")) {
    // revisa que estemos en la pagina html donde están esos botones, para que no haya erores

    btnComenzarDados.addEventListener("click", (e) => {
        e.preventDefault();
        guardarUsuario();
    }); //boton comienzo del juego

    btnAtacarDragon.addEventListener("click", (e) => {
        e.preventDefault();
        atacar(1, 0); //primer parametro es victimario (caballero), 2ndo es victima (dragon), 1 y 0 son sus posiciones en el array de participantes
        contadorTurnos++;
    }); //boton que ataca al dragón

    btnSumarHP.addEventListener("click", (e) => {
        e.preventDefault();
        ocultarBotonesHP();
        recuperaHP(1, 0);
    }); //boton si el jugador elige recuperar hp

    btnNoSumarHP.addEventListener("click", (e) => {
        e.preventDefault();
        ocultarBotonesHP();
        ataqueComun(1, 0);
    }); //boton si el jugador elige hacer un ataque comun

    btnNuevoJuego.addEventListener("click", (e) => {
        e.preventDefault();
        resetJuego();
    }); //boton para volver a jugar

    btnInfoTirada.addEventListener("click", (e) => {
        e.preventDefault();
        seccionInfoTirada.classList.add("oculto");
        if (nombreAtacante === "dragon") {
            revisarFinDelJuego(0,1);
        } else {revisarFinDelJuego(1, 0)}
    }); //boton continuar luego de recibir la informacion del ataque
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//---------------------------------------------------------------------
//PARA TABLA DE POSICIONES
//---------------------------------------------------------------------

//Funciones para guardar los mejores resultados en el localStorage

//Recupero el string de mejores resultados del localStorage
let resultadosLocalesDados = localStorage.getItem("posicionesDados");
//Lo vuelvo a convertir en un array
let resultadosDados = JSON.parse(resultadosLocalesDados) || [];

// let resultadosPruebaDados = [{ nombre: "cande", turnos: 5, fecha: "25/09/24" }];
// localStorage.setItem("posicionesDados", JSON.stringify(resultadosPruebaDados));

function agregarGanadorDados() {
    // Creo un objeto con los resultados del último juego
    ganadorDados = {
        nombre: nombreUsuario,
        turnos: contadorTurnos,
        fecha: fechaFormateada
    };
    // console.log(ganadorDados);

    // Verificar si el jugador ya existe
    let jugadorExistenteDados = null;
    for (let i = 0; i < resultadosDados.length; i++) {
        if (resultadosDados[i].nombre === nombreUsuario) {
            jugadorExistenteDados = resultadosDados[i];
            break;
        }
    }

    if (jugadorExistenteDados) {
        // Si el jugador existe, solo actualizar si la nueva puntuación es mejor (menos turnos)
        if (ganadorDados.turnos < jugadorExistenteDados.turnos) {
            jugadorExistenteDados.turnos = ganadorDados.turnos;
            jugadorExistenteDados.fecha = ganadorDados.fecha; // Actualizar fecha si se mejora
        }
    } else {
        // Agregar nuevo ganador
        resultadosDados.push(ganadorDados);
    }

    // Evaluar dónde añadir el nuevo ganador
   // Ordenar por turnos (menor es mejor)
   let insertado = false;
   for (let i = 0; i < resultadosDados.length; i++) {
       if (ganadorDados.turnos < resultadosDados[i].turnos) {
           // Insertar el nuevo resultado en la posición correcta
           resultadosDados.splice(i, 0, ganadorDados);
           insertado = true;
           break;
       } 
    }

    // Si se añadió un nuevo resultado y quedaron más de 10, se elimina el último
    if (resultadosDados.length > 10) {
        resultadosDados.pop();
    }

    // Guardar el resultado actualizado en localStorage
    localStorage.setItem("posicionesDados", JSON.stringify(resultadosDados));
    // console.log(resultadosDados);
}
