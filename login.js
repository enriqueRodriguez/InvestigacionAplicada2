document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const user = document.getElementById('user').value;
    const password = document.getElementById('pass').value;

    const infoLogin = {
        username: user,
        password: password
    }

    fetch('http://localhost:3000/api/login',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(infoLogin)
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            alert(`Bienvenido, ${infoLogin.username}. Tu token es: ${data.token}`);
            localStorage.setItem('token', data.token);
            window.location.href = "./info.html";
        } else {
            alert('No se recibió un token en la respuesta.');
        }
    })
    .catch(error => {
        console.error('Error: ', error.message);
        alert('Error en la operacion')
    })
})