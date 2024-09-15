document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000';  // Cambia esto si el servidor está en otro puerto

    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = document.getElementById('user').value;
        const pass = document.getElementById('pass').value;

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user, password: pass }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);  // Almacena el token en localStorage
                console.log(data.token)
                window.location.href = 'info.html';  // Redirige a la página de información
            } else {
                const error = await response.json();
                alert('Error en el inicio de sesión: ' + error.message);
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            alert('Hubo un problema con el inicio de sesión. Por favor, intenta de nuevo.');
        }
    });
});
