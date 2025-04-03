document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Convertir el usuario a minúsculas y eliminar espacios adicionales
    const username = this.username.value.toLowerCase().trim();
    const password = this.password.value;

    // Hacer la solicitud POST al backend
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    // Obtener los datos del backend
    const data = await response.json();

    // Limpiar mensajes anteriores
    document.getElementById('message').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';

    // Mostrar el mensaje de éxito o error
    if (response.ok) {
        document.getElementById('message').textContent = data.message || "¡Inicio de sesión exitoso!";
        document.getElementById('message').style.display = 'block';

        // Redirigir según el rol del usuario
        if (data.role === 'admin') {
            window.location.href = 'dashboardadmin.html'; 
        } else {
            window.location.href = 'dashboard.html'; 
        }
    } else {
        document.getElementById('errorMessage').textContent = data.error || "❌ Error al iniciar sesión";
        document.getElementById('errorMessage').style.display = 'block';
    }
});
