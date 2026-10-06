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
  // Mock POST dengan request options yang dapat dipakai langsung oleh fetch() saat backend tersedia.
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        orderId: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
      });
    }, 800);
  });
}
