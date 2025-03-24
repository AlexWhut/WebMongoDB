document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita la recarga de la página

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    // Limpiar mensajes anteriores
    document.getElementById('registerMessage').style.display = 'none';
    document.getElementById('registerErrorMessage').style.display = 'none';

    // Mostrar el mensaje de éxito o error
    if (response.ok) {
        document.getElementById('registerMessage').textContent = data.message; // Mensaje de éxito
        document.getElementById('registerMessage').style.display = 'block'; // Mostrar mensaje
        setTimeout(() => window.location.href = 'index.html', 2000); // Redirigir después de 2 segundos
    } else {
        document.getElementById('registerErrorMessage').textContent = data.error; // Mensaje de error
        document.getElementById('registerErrorMessage').style.display = 'block'; // Mostrar mensaje de error
    }
});
