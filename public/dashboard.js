document.addEventListener("DOMContentLoaded", async () => {
    const usernameElement = document.getElementById("username");

    // Verificar si el usuario está autenticado
    const response = await fetch("/user-info");
    const data = await response.json();

    if (data.username) {
        usernameElement.textContent = `Bienvenido, ${data.username}`;
    } else {
        window.location.href = "index.html"; // Redirigir si no hay sesión
    }

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", async () => {
        await fetch("/logout", { method: "POST" });
        window.location.href = "index.html";
    });
});
