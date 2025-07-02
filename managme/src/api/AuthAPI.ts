export async function login(login: string, password: string): Promise<string | null> {
  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ login, password })
  });

  const data = await res.json();
  console.log('Odpowiedź z backendu po logowaniu:', data);

  if (!res.ok || !data.accessToken) return null;

  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('currentUser', JSON.stringify(data.user));

  return data.accessToken;
}

export async function getCurrentUser(): Promise<any | null> {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;



  const res = await fetch('http://localhost:3000/api/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) return null;
  return await res.json();
} 
