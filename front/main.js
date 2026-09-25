document.addEventListener('DOMContentLoaded', () => {
    // 1. Buscamos el botón de la hamburguesa y la barra lateral
    const botonMenu = document.getElementById('btn-menu');
    const barraLateral = document.querySelector('.lat-bar');

    // 2. Verificamos que existan en la pantalla antes de darles la instrucción
    if (botonMenu && barraLateral) {
        botonMenu.addEventListener('click', function() {
            // 3. Agregamos o quitamos la clase que esconde la barra
            barraLateral.classList.toggle('oculta');
        });
    }
});