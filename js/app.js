document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('#portfolio-grid');
  const filters = document.querySelector('#portfolio-filters');
  const serviceForm = document.querySelector('.needs-validation');
  const orderCountBadge = document.querySelector('#orderCountBadge');
  const orderToast = document.querySelector('#serviceOrderToast');
  const orderToastMessage = document.querySelector('#serviceOrderToastMessage');
  const expectedProjectCount = 4;
  let projects = [];
  let selectedCategory = null;
  let isLoading = false;
  let hasLoadedData = false;
  let isSubmittingOrder = false;

  if (!grid || !filters) {
    console.error('Elemen grid atau filter portofolio tidak ditemukan.');
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (character) => {
      const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };

      return entities[character];
    });
  }

  function readStoredOrders() {
    const storedOrders = localStorage.getItem('serviceOrders');
    if (storedOrders === null) {
      return [];
    }

    const orders = JSON.parse(storedOrders);
    if (!Array.isArray(orders)) {
      throw new Error('Data serviceOrders di localStorage harus berupa array.');
    }

    return orders;
  }

  function updateOrderCount() {
    if (!orderCountBadge) {
      console.error('Elemen #orderCountBadge tidak ditemukan.');
      return;
    }

    try {
      orderCountBadge.textContent = String(readStoredOrders().length);
    } catch (error) {
      console.error('Gagal membaca jumlah pesanan tersimpan:', error);
      orderCountBadge.textContent = '!';
      orderCountBadge.title = 'Data pesanan tidak dapat dibaca dari penyimpanan lokal.';
    }
  }

  function showOrderToast(message, isError = false) {
    if (!orderToast || !orderToastMessage || !window.bootstrap?.Toast) {
      throw new Error('Komponen Bootstrap Toast untuk pesanan tidak tersedia.');
    }

    orderToast.classList.toggle('text-bg-danger', isError);
    orderToast.classList.toggle('text-bg-success', !isError);
    orderToastMessage.textContent = message;
    bootstrap.Toast.getOrCreateInstance(orderToast).show();
  }

  updateOrderCount();

  if (serviceForm) {
    serviceForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      serviceForm.classList.add('was-validated');

      if (!serviceForm.checkValidity() || isSubmittingOrder) {
        return;
      }

      const submitButton = serviceForm.querySelector('button[type="submit"]');
      if (!submitButton) {
        console.error('Tombol submit pada formulir layanan tidak ditemukan.');
        return;
      }

      const originalButtonText = submitButton.textContent.trim();
      const payload = Object.fromEntries(new FormData(serviceForm).entries());
      isSubmittingOrder = true;
      submitButton.disabled = true;
      submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
        Mengirim...
      `;

      try {
        const result = await submitServiceOrder(payload);
        if (!result.success) {
          throw new Error('Pengiriman pesanan layanan gagal.');
        }

        const orders = readStoredOrders();
        orders.push({
          ...payload,
          orderId: result.orderId,
          timestamp: result.timestamp,
        });
        localStorage.setItem('serviceOrders', JSON.stringify(orders));
        orderCountBadge.textContent = String(orders.length);
        serviceForm.reset();
        serviceForm.classList.remove('was-validated');
        showOrderToast('Permintaan layanan berhasil dikirim!');
      } catch (error) {
        console.error('Gagal mengirim permintaan layanan:', error);
        showOrderToast('Permintaan layanan gagal dikirim. Silakan coba lagi.', true);
      } finally {
        isSubmittingOrder = false;
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  } else {
    console.error('Formulir layanan .needs-validation tidak ditemukan.');
  }

  function renderLoadingState() {
    grid.innerHTML = Array.from({ length: expectedProjectCount }, () => `
      <div class="col" aria-hidden="true">
        <article class="card portfolio-card h-100 placeholder-glow">
          <div class="placeholder col-12" style="height: 13rem;"></div>
          <div class="card-body">
            <span class="placeholder col-6 mb-3"></span>
            <span class="placeholder col-8 mb-3"></span>
            <span class="placeholder col-12 mb-2"></span>
            <span class="placeholder col-10 mb-4"></span>
            <span class="placeholder col-5"></span>
          </div>
        </article>
      </div>
    `).join('');
  }

  function renderFilters() {
    if (!hasLoadedData) {
      filters.innerHTML = '';
      return;
    }

    const categories = [...new Set(projects.map((project) => project.category))];
    const filterOptions = [
      { label: 'Semua', category: null },
      ...categories.map((category) => ({ label: category, category })),
    ];

    filters.innerHTML = filterOptions.map(({ label, category }) => {
      const isActive = selectedCategory === category;
      const categoryAttribute = category === null
        ? ''
        : ` data-category="${escapeHTML(category)}"`;

      return `
        <button
          class="btn button ${isActive ? 'button-primary' : 'button-secondary'}"
          type="button"
          data-filter-category${categoryAttribute}
          aria-pressed="${isActive}"
          ${isLoading ? 'disabled' : ''}
        >${escapeHTML(label)}</button>
      `;
    }).join('');
  }

  function renderEmptyState() {
    grid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-light d-flex align-items-center gap-2 mb-0" role="status">
          <i class="bi bi-folder2-open" aria-hidden="true"></i>
          <span>Belum ada proyek di kategori ini</span>
        </div>
      </div>
    `;
  }

  function renderProjectCards(projectList) {
    grid.innerHTML = projectList.map((project) => `
      <div class="col">
        <article class="card portfolio-card h-100">
          <img
            class="card-img-top"
            src="${escapeHTML(project.thumbnail)}"
            alt="${escapeHTML(project.thumbnailAlt || project.title)}"
            width="720"
            height="520"
          />
          <div class="card-body">
            <span class="portfolio-badge">${escapeHTML(project.badgeLabel)}</span>
            <h3 class="card-title">${escapeHTML(project.title)}</h3>
            <p class="card-text">${escapeHTML(project.shortDescription)}</p>
            <button
              class="btn button button-primary"
              type="button"
              data-project-id="${escapeHTML(project.id)}"
            >${escapeHTML(project.cardActionLabel || 'Lihat detail')}</button>
          </div>
        </article>
      </div>
    `).join('');
  }

  function renderProjects() {
    const visibleProjects = selectedCategory === null
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

    if (visibleProjects.length === 0) {
      renderEmptyState();
      return;
    }

    renderProjectCards(visibleProjects);
  }

  function renderErrorState(error) {
    const message = error instanceof Error
      ? error.message
      : 'Terjadi kesalahan yang tidak diketahui.';

    grid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger mb-0" role="alert">
          <p class="mb-3">Proyek gagal dimuat. ${escapeHTML(message)}</p>
          <button class="btn button button-primary" type="button" data-retry>
            Coba lagi
          </button>
        </div>
      </div>
    `;
  }

  function openProjectModal(projectId) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) {
      console.error(`Proyek dengan id "${projectId}" tidak ditemukan.`);
      return;
    }

    const modalElement = document.getElementById('universalProjectModal');
    const titleElement = document.getElementById('projectModalTitle');
    const bodyElement = document.getElementById('projectModalBody');
    if (!modalElement || !titleElement || !bodyElement) {
      console.error('Elemen modal proyek universal tidak ditemukan.');
      return;
    }

    function getSafeLinkUrl(value) {
      try {
        const url = new URL(value, document.baseURI);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          return escapeHTML(value);
        }
      } catch (error) {
        console.error('URL tautan proyek tidak valid:', error);
      }

      console.error('Tautan proyek harus menggunakan protokol HTTP atau HTTPS.');
      return null;
    }

    titleElement.textContent = project.title;

    const links = Array.isArray(project.links) ? project.links : [];
    const linkMarkup = links.map((link) => {
      const safeUrl = getSafeLinkUrl(link.url);
      if (!safeUrl) {
        return '';
      }

      return `
        <a class="btn button button-secondary" href="${safeUrl}" target="_blank" rel="noreferrer">
          ${escapeHTML(link.label)}
        </a>
      `;
    }).join('');
    const descriptions = Array.isArray(project.fullDescription)
      ? project.fullDescription
      : [];

    bodyElement.innerHTML = `
      <img
        class="img-fluid"
        src="${escapeHTML(project.thumbnail)}"
        alt="${escapeHTML(project.thumbnailAlt || project.title)}"
      />
      <span class="portfolio-badge">${escapeHTML(project.badgeLabel)}</span>
      ${project.modalMeta ? `<p class="case-meta">${escapeHTML(project.modalMeta)}</p>` : ''}
      ${descriptions.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join('')}
      ${linkMarkup ? `<div class="case-links">${linkMarkup}</div>` : ''}
    `;

    bootstrap.Modal.getOrCreateInstance(modalElement).show();
  }

  async function loadProjects() {
    isLoading = true;
    renderLoadingState();
    renderFilters();

    try {
      const loadedProjects = await fetchProjects();
      if (!Array.isArray(loadedProjects)) {
        throw new Error('Data proyek harus berupa array JSON.');
      }

      projects = loadedProjects;
      hasLoadedData = true;
      if (selectedCategory !== null
        && !projects.some((project) => project.category === selectedCategory)) {
        selectedCategory = null;
      }

      isLoading = false;
      renderFilters();
      renderProjects();
    } catch (error) {
      isLoading = false;
      renderFilters();
      renderErrorState(error);
    }
  }

  if (grid && filters) {
    filters.addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter-category]');
      if (!button || isLoading || !hasLoadedData) {
        return;
      }

      selectedCategory = button.hasAttribute('data-category')
        ? button.dataset.category
        : null;
      renderFilters();
      renderProjects();
    });

    grid.addEventListener('click', (event) => {
      if (event.target.closest('[data-retry]')) {
        loadProjects();
        return;
      }

      const projectButton = event.target.closest('[data-project-id]');
      if (projectButton) {
        openProjectModal(projectButton.dataset.projectId);
      }
    });

    loadProjects();
  }
});
