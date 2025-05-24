export async function login(login: string, password: string): Promise<string | null> {
  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ login, password })
  });

  if (!res.ok) return null;

  const data = await res.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
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
