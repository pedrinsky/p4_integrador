const token = sessionStorage.getItem('token');

if (!token) {
    const profundidad = window.location.pathname.split('/').filter(Boolean).length;
    const rutaLogin = '../'.repeat(Math.max(profundidad - 1, 1)) + 'index.html';
    window.location.replace(rutaLogin);
}

//Devuelve el token guardado en sessionStorage.
export function getToken() {
    return sessionStorage.getItem('token');
}

//Devuelve el usuario guardado en sessionStorage.
export function getUsuario() {
    const raw = sessionStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
}

//Cierra la sesión, borra sessionStorage y redirige al login
export function logout() {
    sessionStorage.clear();
    window.location.replace('/index.html');
}
