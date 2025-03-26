let isEditing = false;
let currentEditId = null;

document.addEventListener("DOMContentLoaded", function () {
  fetchCursos();
  setupSubmitButton();
});

function setupSubmitButton() {
  const submitButton = document.getElementById("submitButton");
  submitButton.removeEventListener("click", handleSubmit);
  submitButton.addEventListener("click", handleSubmit);
}

async function handleSubmit() {
  if (isEditing) {
    await updateCurso(currentEditId);
  } else {
    await addCurso();
  }
}

async function fetchCursos() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch("/cursos/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const cursos = await response.json();
      renderCursos(cursos);
    } else if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      showError("Erro ao carregar cursos.");
    }
  } catch (error) {
    showError("Erro ao conectar ao servidor.");
  }
}

function showError(message) {
  const errorAlert = document.getElementById("error");
  errorAlert.innerText = message;
  errorAlert.style.display = "block";
}

async function addCurso() {
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const time = document.getElementById("time").value;
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/cursos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, time: parseInt(time) }),
    });
    if (response.ok) {
      fetchCursos();
      clearForm();
    } else {
      showError("Erro ao salvar curso.");
    }
  } catch (error) {
    showError("Erro ao salvar curso.");
  }
}

async function updateCurso(id) {
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const time = document.getElementById("time").value;
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`/cursos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, time: parseInt(time) }),
    });
    if (response.ok) {
      fetchCursos();
      clearForm();
    } else {
      showError("Erro ao atualizar curso.");
    }
  } catch (error) {
    showError("Erro ao atualizar curso.");
  }
}

function editCurso(id, name, description, time) {
  document.getElementById("name").value = name;
  document.getElementById("description").value = description;
  document.getElementById("time").value = time;

  const submitButton = document.getElementById("submitButton");
  submitButton.innerText = "Salvar Alterações";
  isEditing = true;
  currentEditId = id;
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("time").value = "";

  const submitButton = document.getElementById("submitButton");
  submitButton.innerText = "Adicionar";
  isEditing = false;
  currentEditId = null;
}

function renderCursos(cursos) {
  const tableBody = document.getElementById("cursosTableBody");
  tableBody.innerHTML = "";
  cursos.forEach((curso) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${curso.name}</td>
      <td>${curso.description}</td>
      <td>${curso.time}</td>
      <td>
        <button class="btn btn-warning me-2" onclick="editCurso(${curso.id}, '${curso.name}', '${curso.description}', ${curso.time})">Editar</button>
        <button class="btn btn-danger" onclick="deleteCurso(${curso.id})">Excluir</button>
      </td>`;
    tableBody.appendChild(row);
  });
}

async function deleteCurso(cursoId) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`/cursos/${cursoId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) fetchCursos();
    else showError("Erro ao deletar curso.");
  } catch (error) {
    showError("Erro ao deletar curso.");
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}