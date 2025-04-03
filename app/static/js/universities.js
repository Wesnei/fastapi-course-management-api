// Variáveis globais
let currentEditId = null;
let currentDeleteId = null;
let currentPage = 1;
const itemsPerPage = 10;
let universities = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
    fetchUniversities();
});

// Funções de Autenticação
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
    }
}

// Funções de Event Listeners
function setupEventListeners() {
    // Botão de salvar nova universidade
    const saveBtn = document.getElementById('saveUniversityBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const form = document.getElementById('universityForm');
            if (form && form.checkValidity()) {
                addUniversity();
            } else if (form) {
                form.reportValidity();
            }
        });
    }

    // Botão de atualizar universidade
    const updateBtn = document.getElementById('updateUniversityBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', () => {
            const form = document.getElementById('editUniversityForm');
            if (form && form.checkValidity()) {
                updateUniversity();
            } else if (form) {
                form.reportValidity();
            }
        });
    }

    // Botão de confirmar exclusão
    const confirmBtn = document.getElementById('confirmActionBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (currentDeleteId) {
                deleteUniversity(currentDeleteId);
            }
        });
    }

    // Botão de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.href = '/login';
        });
    }
}

// Funções de API
async function fetchUniversities() {
    try {
        const response = await fetch('/universities', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar universidades');
        }

        universities = await response.json();
        renderUniversities();
    } catch (error) {
        console.error('Erro ao buscar universidades:', error);
        showError('Erro ao carregar universidades. Por favor, tente novamente.');
    }
}

async function addUniversity() {
    const form = document.getElementById('universityForm');
    if (!form) return;

    const university = {
        name: document.getElementById('universityName')?.value || '',
        acronym: document.getElementById('universityAcronym')?.value || '',
        city: document.getElementById('universityCity')?.value || '',
        state: document.getElementById('universityState')?.value?.toUpperCase().substring(0, 2) || '',
        is_active: document.getElementById('universityStatus')?.value === 'true'
    };

    try {
        const response = await fetch('/universities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(university)
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar universidade');
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('addUniversityModal'));
        if (modal) {
            modal.hide();
        }
        form.reset();
        fetchUniversities();
    } catch (error) {
        console.error('Erro ao adicionar universidade:', error);
        showError('Erro ao adicionar universidade. Por favor, tente novamente.');
    }
}

async function updateUniversity() {
    if (!currentEditId) return;

    const form = document.getElementById('editUniversityForm');
    if (!form) return;

    const university = {
        name: document.getElementById('editUniversityName')?.value || '',
        acronym: document.getElementById('editUniversityAcronym')?.value || '',
        city: document.getElementById('editUniversityCity')?.value || '',
        state: document.getElementById('editUniversityState')?.value?.toUpperCase().substring(0, 2) || '',
        is_active: document.getElementById('editUniversityStatus')?.value === 'true'
    };

    try {
        const response = await fetch(`/universities/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(university)
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar universidade');
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('editUniversityModal'));
        if (modal) {
            modal.hide();
        }
        fetchUniversities();
    } catch (error) {
        console.error('Erro ao atualizar universidade:', error);
        showError('Erro ao atualizar universidade. Por favor, tente novamente.');
    }
}

async function deleteUniversity(id) {
    try {
        const response = await fetch(`/universities/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao excluir universidade');
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
        if (modal) {
            modal.hide();
        }
        currentDeleteId = null;
        fetchUniversities();
    } catch (error) {
        console.error('Erro ao excluir universidade:', error);
        showError(error.message || 'Erro ao excluir universidade. Por favor, tente novamente.');
    }
}

// Funções de Renderização
function renderUniversities() {
    const tbody = document.getElementById('universitiesTable');
    if (!tbody) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUniversities = universities.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';

    if (universities.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">Nenhuma universidade cadastrada</td>
            </tr>
        `;
        return;
    }

    paginatedUniversities.forEach(university => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(university.name || '')}</td>
            <td>${escapeHtml(university.acronym || '')}</td>
            <td>${escapeHtml(university.city || '')}</td>
            <td>${escapeHtml(university.state || '')}</td>
            <td>
                <span class="badge ${university.is_active ? 'bg-success' : 'bg-danger'}">
                    ${university.is_active ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-action btn-edit me-2" onclick="openEditModal(${university.id})">
                    <i class="fas fa-edit"></i> 
                </button>
                <button class="btn btn-sm btn-action btn-delete" onclick="openDeleteModal(${university.id})">
                    <i class="fas fa-trash"></i> 
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updatePagination();
    updateCounts();
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(universities.length / itemsPerPage);
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `
            <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
        `;
        pagination.appendChild(li);
    }
}

function updateCounts() {
    const countElement = document.getElementById('totalUniversities');
    const showingCount = document.getElementById('showingCount');
    const totalCount = document.getElementById('totalCount');

    if (countElement) {
        if (universities.length === 0) {
            countElement.textContent = 'Nenhuma universidade';
        } else if (universities.length === 1) {
            countElement.textContent = '1 universidade';
        } else {
            countElement.textContent = `${universities.length} universidades`;
        }
    }

    if (showingCount) {
        showingCount.textContent = Math.min(currentPage * itemsPerPage, universities.length);
    }

    if (totalCount) {
        totalCount.textContent = universities.length;
    }
}

// Funções de Modal
function openEditModal(id) {
    const university = universities.find(u => u.id === id);
    if (!university) return;

    currentEditId = id;
    
    const editId = document.getElementById('editUniversityId');
    const editName = document.getElementById('editUniversityName');
    const editAcronym = document.getElementById('editUniversityAcronym');
    const editCity = document.getElementById('editUniversityCity');
    const editState = document.getElementById('editUniversityState');
    const editStatus = document.getElementById('editUniversityStatus');

    if (editId) editId.value = id;
    if (editName) editName.value = university.name || '';
    if (editAcronym) editAcronym.value = university.acronym || '';
    if (editCity) editCity.value = university.city || '';
    if (editState) editState.value = university.state || '';
    if (editStatus) editStatus.value = university.is_active.toString();

    const modal = new bootstrap.Modal(document.getElementById('editUniversityModal'));
    modal.show();
}

function openDeleteModal(id) {
    currentDeleteId = id;
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

// Funções Utilitárias
function changePage(page) {
    currentPage = page;
    renderUniversities();
}

function showError(message) {
    let errorDiv = document.getElementById('error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error';
        errorDiv.className = 'alert alert-danger alert-dismissible fade show';
        errorDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
        }
    } else {
        errorDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
    }

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Funções globais
window.changePage = changePage;
window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;