// Cambia el puerto a 3000 donde tu API Express está corriendo
const API_URL = 'http://localhost:3000';

// Luego, actualiza la solicitud fetch en tu controlador
document.getElementById('registroForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value;
    const username = document.getElementById('user').value;
    const password = document.getElementById('password').value;

    const userData = {
        email: correo,
        username: username,
        password: password
    };

    try {
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            window.location.href = 'login.html';
            const data = await response.json();
            alert('Registro exitoso: ' + data.message);
        } else {
            const error = await response.json();
            alert('Error: ' + error.message);
        }
    } catch (error) {
        console.error('Error en el registro:', error);
        alert('Hubo un problema al intentar registrar al usuario');
    }
});
