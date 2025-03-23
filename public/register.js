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
    
    if (response.ok) {
        alert(data.message);
        window.location.href = 'index.html'; // Redirige al login después de registrarse
    } else {
        alert(data.error);
    }
});
