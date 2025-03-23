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

    if (response.ok) {
        alert(data.message);
        window.location.href = 'dashboard.html'; // Página a donde se redirige tras el login exitoso
    } else {
        alert(data.error);
    }
});
