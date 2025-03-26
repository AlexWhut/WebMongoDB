document.addEventListener("DOMContentLoaded", async () => {
    const usernameElement = document.getElementById("username");

    const response = await fetch("/user-info");
    const data = await response.json();

    if (data.username && data.role === "admin") {
        usernameElement.textContent = `Bienvenido, ${data.username}`;

        // Acceso a funcionalidades de administrador (como descargar archivo)
        document.getElementById("downloadBtn").addEventListener("click", () => {
            window.location.href = "URL_DEL_ARCHIVO"; // Link al archivo en Drive
        });
    } else {
        window.location.href = "index.html"; // Redirigir si no es admin
    }

    document.getElementById("logoutBtn").addEventListener("click", async () => {
        await fetch("/logout", { method: "POST" });
        window.location.href = "index.html";
    });
});
