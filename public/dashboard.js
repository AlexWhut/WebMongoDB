document.addEventListener("DOMContentLoaded", async () => {
    const usernameElement = document.getElementById("username");
    
    try {
        // Verificar si el usuario está autenticado
        const response = await fetch("/user-info");

        if (!response.ok) {
            throw new Error("No autenticado");
        }

        const data = await response.json();

        if (data.username) {
            usernameElement.textContent = `Bienvenido, ${data.username}`;
        } else {
            throw new Error("No se encontró el usuario en la sesión");
        }
    } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
        window.location.href = "index.html"; // Redirigir si no hay sesión
    }

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", async () => {
        try {
            const logoutResponse = await fetch("/logout", { method: "POST" });
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
