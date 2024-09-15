document.getElementById('registroForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value;
    const user = document.getElementById('user').value;
    const password = document.getElementById('password').value;

    const userData = {
        email: correo,
        username: user,
        password: password
    };

    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => {
        console.log('Response Data:', data); // Para depuración
        if (data.message) {
            if (data.message === 'Registro exitoso') {
                window.location.href = './login.html';
                alert(data.message);
            }
        }
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert('Error en la operacion');
    });
});
