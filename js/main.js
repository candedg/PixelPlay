// Funcionalidades menú desplegable
let flechaAbajo = document.querySelector("#flecha-abajo"); // Selecciono los botones
let flechaArriba = document.querySelector("#flecha-arriba");  
let menu = document.querySelector("#menu"); //Selecciono el menú

// Añadir un evento de clic al botón
flechaAbajo.addEventListener('click', function() {
    // Alternar la clase 'oculto' en el menú
    menu.classList.toggle('oculto');
    menu.classList.toggle('menu-vertical');
    this.style.display = "none";
    flechaArriba.style.display = "block";
});
flechaArriba.addEventListener('click', function() {
    // Alternar la clase 'oculto' en el menú
    menu.classList.toggle('oculto');
    menu.classList.toggle('menu-vertical');
    this.style.display = "none";
    flechaAbajo.style.display = "block"
    
});
//-----------------------------------------------------------------------------------------