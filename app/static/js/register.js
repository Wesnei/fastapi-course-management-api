async function handleSubmit(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    });

    if (response.ok) {
      alert('Usuário cadastrado com sucesso!');
      window.location.href = '/login';
    } else {
      const data = await response.json();
      alert(data.detail || 'Erro ao registrar usuário');
    }
  } catch (error) {
    alert('Erro ao registrar usuário');
  }
}
