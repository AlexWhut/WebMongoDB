document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Obtener los valores de los campos
    const username = this.username.value;
    const password = this.password.value;

    // Hacer la solicitud POST al backend
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    // Obtener los datos del backend (suponiendo que el backend devuelve JSON)
    const data = await response.json();

    // Limpiar mensajes anteriores
    document.getElementById('message').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';

    // Mostrar el mensaje de éxito o error
    if (response.ok) {
        document.getElementById('message').textContent = data.message || "¡Inicio de sesión exitoso!";
        document.getElementById('message').style.display = 'block'; // Mostrar mensaje
    
        // Redirigir según el rol del usuario
        if (data.role === 'admin') {
            window.location.href = 'dashboardadmin.html'; // Redirigir a dashboard de administrador
        } else {
            window.location.href = 'dashboard.html'; // Redirigir a dashboard normal
        }
    } else {
        document.getElementById('errorMessage').textContent = data.error || "❌ Error al iniciar sesión";
        document.getElementById('errorMessage').style.display = 'block'; // Mostrar mensaje de error
    }
    
});
