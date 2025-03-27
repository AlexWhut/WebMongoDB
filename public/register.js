document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita la recarga de la página

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const birthdate = document.getElementById('birthdate').value; // Obtener la fecha de nacimiento

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, birthdate }) // Enviar la fecha de nacimiento
    });

    const data = await response.json();

    // Limpiar mensajes anteriores
    document.getElementById('registerMessage').style.display = 'none';
    document.getElementById('registerErrorMessage').style.display = 'none';

    // Mostrar el mensaje de éxito o error
    if (response.ok) {
        document.getElementById('registerMessage').textContent = data.message;
        document.getElementById('registerMessage').style.display = 'block';
        setTimeout(() => window.location.href = 'index.html', 2000);
    } else {
        document.getElementById('registerErrorMessage').textContent = data.error;
        document.getElementById('registerErrorMessage').style.display = 'block';
    }
});
