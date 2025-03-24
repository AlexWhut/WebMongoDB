document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = this.username.value;
    const password = this.password.value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    // Limpiar mensajes anteriores
    document.getElementById('message').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';

    // Mostrar el mensaje de éxito o error
    if (response.ok) {
        document.getElementById('message').textContent = data.message; // Mensaje de éxito
        document.getElementById('message').style.display = 'block'; // Mostrar mensaje
        window.location.href = 'dashboard.html'; // Redirigir después del login exitoso
    } else {
        document.getElementById('errorMessage').textContent = data.error; // Mensaje de error
        document.getElementById('errorMessage').style.display = 'block'; // Mostrar mensaje de error
    }
});
