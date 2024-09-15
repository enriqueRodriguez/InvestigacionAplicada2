document.addEventListener('DOMContentLoaded', () => {
    const getToken = () => localStorage.getItem('token');

    // Función para manejar la respuesta de errores
    const handleError = (response) => {
        if (!response.ok) {
            throw new Error(response.statusText || 'Error en la solicitud');
        }
        return response.json();
    };

    const fetchUserInfo = () => {
        const token = getToken();
        fetch('http://localhost:3000/api/info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(handleError)
        .then(data => {
            const userInfo = document.getElementById('userInfo');
            userInfo.innerHTML = `
                <p><strong>Usuario:</strong> ${data.username}</p>
                <p><strong>Correo:</strong> ${data.email}</p>
            `;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudo obtener la información del usuario.');
        });
    };

    // Función para obtener información privilegiada
    const fetchProtectedData = () => {
        const token = getToken();
        fetch('http://localhost:3000/api/protected-resource', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(handleError)
        .then(data => {
            alert('Información privilegiada: ' + data.DatoProtegido);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudo obtener la información privilegiada.');
        });
    };

    // Función para cerrar sesión
    const logout = () => {
        const token = getToken();
        fetch('http://localhost:3000/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(handleError)
        .then(() => {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudo cerrar la sesión.');
        });
    };

    // Event Listeners
    document.getElementById('data').addEventListener('click', fetchProtectedData);
    document.getElementById('logout').addEventListener('click', logout);

    // Fetch user info when the page loads
    fetchUserInfo();
});
