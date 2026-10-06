async function fetchProjects() {
  try {
    const response = await fetch('./data/projects.json');
    if (!response.ok) {
      throw new Error(`Gagal memuat proyek: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('fetchProjects gagal:', error);
    throw error;
  }
}

async function fetchServices() {
  try {
    const response = await fetch('./data/services.json');
    if (!response.ok) {
      throw new Error(`Gagal memuat layanan: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('fetchServices gagal:', error);
    throw error;
  }
}

async function fetchProfile() {
  try {
    const response = await fetch('./data/profile.json');
    if (!response.ok) {
      throw new Error(`Gagal memuat profil: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('fetchProfile gagal:', error);
    throw error;
  }
}

async function submitServiceOrder(payload) {
  // GitHub Pages tidak memiliki backend sendiri; endpoint ini adalah layanan uji publik.
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch('https://jsonplaceholder.typicode.com/posts', requestOptions);
  if (!response.ok) {
    throw new Error(`Gagal mengirim pesanan: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  return {
    success: true,
    orderId: result.id || Date.now(),
    timestamp: new Date().toISOString(),
  };
}
