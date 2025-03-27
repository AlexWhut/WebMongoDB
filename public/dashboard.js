document.addEventListener("DOMContentLoaded", async () => {
    const usernameElement = document.getElementById("username");

    try {
        // Verificar si el usuario está autenticado
        const response = await fetch("/user-info", { credentials: "include" });

        if (response.status === 401) {
            console.warn("Sesión no encontrada. Redirigiendo...");
            return (window.location.href = "index.html"); // Redirigir si no hay sesión
        }

        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const data = await response.json();
        if (data.username) {
            usernameElement.textContent = `Bienvenido, ${data.username}`;
        } else {
            console.warn("Usuario no autenticado");
            window.location.href = "index.html"; 
        }
    } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
        window.location.href = "index.html"; // Redirigir solo en caso de error grave
    }

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", async () => {
        try {
            const logoutResponse = await fetch("/logout", { method: "POST", credentials: "include" });
            if (logoutResponse.ok) {
                window.location.href = "index.html";
            } else {
                console.error("Error al cerrar sesión");
            }
        } catch (error) {
            console.error("Error en la solicitud de logout:", error);
        }
    });
});
