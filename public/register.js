document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault(); 

    let username = document.getElementById('username').value.toLowerCase().trim(); // Convertir a minúsculas
    const password = document.getElementById('password').value;

    // Validar el nombre de usuario
    const usernameRegex = /^[a-z0-9._]{1,12}$/;
    if (!usernameRegex.test(username)) {
        document.getElementById('registerErrorMessage').textContent = "Usuario inválido. No usar espacios o simbolos";
        document.getElementById('registerErrorMessage').style.display = 'block';
        return;
    }

    // Hacer la solicitud POST al backend
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
        document.getElementById('registerMessage').textContent = data.message;
        document.getElementById('registerMessage').style.display = 'block';
        setTimeout(() => window.location.href = 'index.html', 2000);
    } else {
        document.getElementById('registerErrorMessage').textContent = data.error;
        document.getElementById('registerErrorMessage').style.display = 'block';
    }
});
