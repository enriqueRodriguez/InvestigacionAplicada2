document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000';  // Asegúrate de que el puerto coincida con el de tu servidor

    const userInfoDiv = document.getElementById('userInfo');
    const fetchProtectedDataBtn = document.getElementById('data');
    const logoutBtn = document.getElementById('logout');

    // Verifica si el token está almacenado
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No estás autenticado. Redirigiendo a la página de inicio de sesión.');
        window.location.href = 'login.html';  // Redirige a la página de inicio de sesión
        return;
    }

    // Función para obtener la información del usuario
    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${API_URL}/api/user-info`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                userInfoDiv.innerHTML = `
                    <p><strong>Usuario:</strong> ${data.username}</p>
                    <p><strong>Correo:</strong> ${data.email}</p>
                `;
            } else if (response.status === 404) {
                alert('Información del usuario no encontrada.');
            } else {
                const errorText = await response.text();
                alert('Error al obtener la información del usuario: ' + errorText);
            }
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
            alert('Hubo un problema al obtener la información del usuario.');
        }
    };

    // Función para obtener información privilegiada
    fetchProtectedDataBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`${API_URL}/api/protected-resource`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                alert('Información privilegiada: ' + data.DatoProtegido);
            } else if (response.status === 403) {
                alert('Acceso denegado. El token puede estar revocado o ser inválido.');
            } else {
                const errorText = await response.text();
                alert('Error al obtener la información privilegiada: ' + errorText);
            }
        } catch (error) {
            console.error('Error al obtener la información privilegiada:', error);
            alert('Hubo un problema con la solicitud de información privilegiada.');
        }
    });

    // Función para cerrar sesión
    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`${API_URL}/api/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                localStorage.removeItem('token');  // Elimina el token de localStorage
                alert('Sesión cerrada exitosamente.');
                window.location.href = 'login.html';  // Redirige a la página de inicio de sesión
            } else {
                const errorText = await response.text();
                alert('Error al cerrar la sesión: ' + errorText);
            }
        } catch (error) {
            console.error('Error al cerrar la sesión:', error);
            alert('Hubo un problema al cerrar la sesión.');
        }
    });

    // Llama a la función para obtener la información del usuario al cargar la página
    fetchUserInfo();
});
