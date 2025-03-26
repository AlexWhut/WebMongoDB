document.addEventListener("DOMContentLoaded", async () => {
    const usernameElement = document.getElementById("username");

    const response = await fetch("/user-info");
    const data = await response.json();

    if (data.username && data.role === "admin") {
        usernameElement.textContent = `Bienvenido, ${data.username}`;

        // Acceso a funcionalidades de administrador (como descargar archivo)
        document.getElementById("downloadBtn").addEventListener("click", () => {
            window.open("https://drive.google.com/file/d/1uDNNO2Py0lfBX1b8UWTbKtHt6MnY-W8M/view?usp=sharing", "_blank");
            // "_blank" asegura que se abra en una nueva pestaña
        });
    } else {
        window.location.href = "index.html"; // Redirigir si no es admin
    }

    document.getElementById("logoutBtn").addEventListener("click", async () => {
        await fetch("/logout", { method: "POST" });
        window.location.href = "index.html";
    });
});
