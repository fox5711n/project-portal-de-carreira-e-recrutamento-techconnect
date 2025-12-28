// PORTAL DE CARREIRA - SCRIPT PRINCIPAL
// =====================================================

document.addEventListener('DOMContentLoaded', initializeApp);

// =====================================================
// INICIALIZAÇÃO DA APLICAÇÃO
// =====================================================
function initializeApp() {
    setupRegistrationForm();
    setupContentPage();
    distributeEventsInColumns();
    setupModals();
    setupTableFilters();
    setupBackToTop();
    setupBackgroundParallax();
}

// =====================================================
// UTILITÁRIOS
// =====================================================
function getCurrentPage() {
    return (window.location.pathname || '').split('/').pop() || '';
}

function getStorageItem(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (err) {
        console.error(`Erro ao obter ${key} do localStorage:`, err);
        return null;
    }
}

function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (err) {
        console.error(`Erro ao salvar ${key} no localStorage:`, err);
        return false;
    }
}

function removeStorageItem(key) {
    try {
        localStorage.removeItem(key);
    } catch (err) {
        console.error(`Erro ao remover ${key} do localStorage:`, err);
    }
}

// =====================================================
// FORMULÁRIO DE CADASTRO
// =====================================================
function setupRegistrationForm() {
    const form = document.getElementById('formCadastro');
    if (!form) return;

    form.addEventListener('submit', handleRegistrationSubmit);
}

function handleRegistrationSubmit(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const position = document.getElementById('position')?.value.trim() || '';

    if (!validateRegistrationFields(fullName, email, position)) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }

    const userData = { nome: fullName, email, posicao: position };
    setStorageItem('usuario', userData);
    
    showMessage('Cadastro realizado com sucesso! Redirecionando...', 'success');
    
    setTimeout(() => {
        window.location.href = 'conteudo.html';
    }, 900);
}

function validateRegistrationFields(fullName, email, position) {
    return fullName && email && position;
}

function showMessage(text, type = 'success') {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;

    const color = type === 'error' ? 'red' : 'green';
    messageEl.innerHTML = `<p style="color: ${color};">${text}</p>`;
}

// =====================================================
// PÁGINA DE CONTEÚDO
// =====================================================
function setupContentPage() {
    const userMessage = document.getElementById('mensagem');
    const logoutBtn = document.getElementById('logout');

    if (!userMessage) return;

    // Verificar autenticação
    const user = getStorageItem('usuario');
    if (!user) {
        alert('Você precisa se cadastrar antes de acessar o conteúdo!');
        window.location.href = 'cadastro.html';
        return;
    }

    // Exibir mensagem de boas-vindas
    userMessage.textContent = `Olá, ${user.nome}! Sua candidatura para a vaga de "${user.posicao}" foi registrada com sucesso.`;

    // Configurar logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Limpar botões órfãos
    document.querySelectorAll('.btnCandidatar').forEach(btn => {
        if (!btn.closest('#vagas')) btn.remove();
    });
}

function handleLogout() {
    removeStorageItem('usuario');
    window.location.href = 'cadastro.html';
}

// =====================================================
// MODAIS
// =====================================================
function setupModals() {
    setupModal('btnSobre', 'sobre', 'btnFechar');
    setupModal('btnContato', 'contato', 'btnFecharContato');
    setupCandidacyModal();
    setupEventModal();
    setupModalCloseOnOutsideClick();
}

function setupModal(btnId, modalId, closeId) {
    const btn = document.getElementById(btnId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);

    if (!btn || !modal) return;

    btn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Fechar com X
    const closeSpans = modal.querySelectorAll('.fechar');
    closeSpans.forEach(span => {
        span.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });
}

function setupModalCloseOnOutsideClick() {
    window.addEventListener('click', (event) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function setupCandidacyModal() {
    const form = document.getElementById('formCandidatar');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleCandidacySubmit(form);
    });
}

function handleCandidacySubmit(form) {
    const vagaTitulo = document.getElementById('vagaTitulo')?.value || '';
    const candNome = document.getElementById('candNome')?.value.trim() || '';
    const candEmail = document.getElementById('candEmail')?.value.trim() || '';
    const candMsg = document.getElementById('candMsg')?.value.trim() || '';

    if (!candNome || !candEmail) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const candidacy = {
        vaga: vagaTitulo,
        nome: candNome,
        email: candEmail,
        mensagem: candMsg,
        data: new Date().toISOString()
    };

    const candidacies = getStorageItem('candidaturas') || [];
    candidacies.push(candidacy);
    setStorageItem('candidaturas', candidacies);

    alert(`Candidatura enviada! Obrigado, ${candNome}.`);
    form.reset();

    const modal = document.getElementById('modalCandidatar');
    if (modal) modal.style.display = 'none';
}

function setupEventModal() {
    const buttons = document.querySelectorAll('.btnInscrever');
    const form = document.getElementById('formEvento');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const eventId = btn.getAttribute('data-evento-id');
            const eventIdInput = document.getElementById('eventoId');
            if (eventIdInput) eventIdInput.value = eventId;

            const modal = document.getElementById('modalEvento');
            if (modal) modal.style.display = 'block';
        });
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleEventSubscription(form);
        });
    }
}

function handleEventSubscription(form) {
    const eventId = document.getElementById('eventoId')?.value || '';
    const evtNome = document.getElementById('evtNome')?.value.trim() || '';
    const evtEmail = document.getElementById('evtEmail')?.value.trim() || '';

    if (!evtNome || !evtEmail) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const subscription = {
        eventId,
        nome: evtNome,
        email: evtEmail,
        data: new Date().toISOString()
    };

    const subscriptions = getStorageItem('inscricoesEventos') || [];
    subscriptions.push(subscription);
    setStorageItem('inscricoesEventos', subscriptions);

    alert(`Inscrição confirmada! Obrigado, ${evtNome}.`);
    form.reset();

    const modal = document.getElementById('modalEvento');
    if (modal) modal.style.display = 'none';
}

// =====================================================
// TABELAS E FILTROS
// =====================================================
function setupTableFilters() {
    const table = document.querySelector('#vagas table');
    if (!table) return;

    ensureTableStructure(table);
    populateCompanyFilter();
    addCandidateButtons();
    setupFilterListeners();
    updateJobSummary();
}

function ensureTableStructure(table) {
    if (table.querySelector('tbody')) return;

    const rows = Array.from(table.querySelectorAll('tr'));
    if (rows.length <= 1) return;

    rows.shift(); // Remove cabeçalho
    const tbody = document.createElement('tbody');
    rows.forEach(row => tbody.appendChild(row));
    table.appendChild(tbody);
}

function populateCompanyFilter() {
    const filter = document.getElementById('filtroEmpresa');
    const table = document.querySelector('#vagas table');

    if (!filter || !table) return;

    const companies = new Set();
    table.querySelectorAll('tbody tr').forEach(row => {
        const company = row.cells[2]?.textContent.trim() || '';
        if (company) companies.add(company);
    });

    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        filter.appendChild(option);
    });
}

function addCandidateButtons() {
    const table = document.querySelector('#vagas table');
    if (!table) return;

    const rows = Array.from(table.querySelectorAll('tbody tr'))
        .filter(r => !r.querySelectorAll('th').length);

    rows.forEach(row => {
        let actionCell = row.cells[6];
        if (!actionCell) {
            actionCell = row.insertCell(-1);
        }

        if (actionCell.querySelector('.btnCandidatar')) return;

        const btn = document.createElement('button');
        btn.className = 'btnCandidatar';
        btn.textContent = 'Candidatar-se';
        btn.addEventListener('click', () => handleCandidateClick(row));
        actionCell.appendChild(btn);
    });
}

function handleCandidateClick(row) {
    const position = row.cells[0]?.textContent.trim() || '';
    const positionInput = document.getElementById('vagaTitulo');
    if (positionInput) positionInput.value = position;

    const modal = document.getElementById('modalCandidatar');
    if (modal) modal.style.display = 'block';
}

function setupFilterListeners() {
    const searchInput = document.getElementById('buscaVagas');
    const locationFilter = document.getElementById('filtroLocal');
    const companyFilter = document.getElementById('filtroEmpresa');

    [searchInput, locationFilter, companyFilter].forEach(el => {
        if (el) {
            el.addEventListener(el.type === 'search' ? 'input' : 'change', filterTable);
        }
    });
}

function filterTable() {
    const table = document.querySelector('#vagas table');
    if (!table) return;

    const searchTerm = (document.getElementById('buscaVagas')?.value || '').toLowerCase();
    const location = document.getElementById('filtroLocal')?.value || '';
    const company = document.getElementById('filtroEmpresa')?.value || '';

    table.querySelectorAll('tbody tr').forEach(row => {
        const rowText = row.textContent.toLowerCase();
        const rowLocation = row.cells[4]?.textContent.trim() || '';
        const rowCompany = row.cells[2]?.textContent.trim() || '';

        const matchesSearch = !searchTerm || rowText.includes(searchTerm);
        const matchesLocation = !location || rowLocation === location;
        const matchesCompany = !company || rowCompany === company;

        row.style.display = matchesSearch && matchesLocation && matchesCompany ? '' : 'none';
    });

    updateJobSummary();
}

function updateJobSummary() {
    const summaryEl = document.getElementById('resumoVagas');
    const table = document.querySelector('#vagas table');

    if (!summaryEl || !table) return;

    const visibleRows = Array.from(table.querySelectorAll('tbody tr'))
        .filter(r => r.style.display !== 'none');

    const total = visibleRows.length;
    const remote = visibleRows.filter(r => r.cells[4]?.textContent.includes('Remoto')).length;
    const onSite = visibleRows.filter(r => r.cells[4]?.textContent.includes('Presencial')).length;
    const hybrid = visibleRows.filter(r => r.cells[4]?.textContent.includes('Híbrido')).length;

    summaryEl.textContent = `Vagas visíveis: ${total} — Remoto: ${remote} • Presencial: ${onSite} • Híbrido: ${hybrid}`;
}

// =====================================================
// VOLTAR PARA O TOPO
// =====================================================
function setupBackToTop() {
    const button = document.getElementById('backToTop');
    if (!button) return;

    window.addEventListener('scroll', () => {
        button.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// =====================================================
// PARALAXE DO FUNDO (scroll + mouse)
// =====================================================
function setupBackgroundParallax() {
    const body = document.body;
    if (!body || !body.classList.contains('header-bg')) return;

    let lastScroll = window.scrollY;
    let ticking = false;

    function updateBackground() {
        // deslocamento vertical mais lento que o scroll (falso paralaxe)
        const yOffset = Math.round(lastScroll * 0.2);
        // horizontal fixo mais à direita (70%) conforme solicitado
        const xPos = '70%';

        body.style.backgroundPosition = `${xPos} ${-yOffset}px`;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        lastScroll = window.scrollY;
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateBackground);
        }
    }, { passive: true });

    // Atualiza ao iniciar para garantir posição correta
    updateBackground();
}

// =====================================================
// DISTRIBUIR EVENTOS EM DUAS COLUNAS (alternando)
// =====================================================
function distributeEventsInColumns() {
    const lista = document.getElementById('listaEventos');
    if (!lista) return;

    // Se já foi distribuído, pule
    if (lista.classList.contains('distributed')) return;

    const artigos = Array.from(lista.querySelectorAll('.evento'));
    if (artigos.length === 0) return;

    // Cria duas colunas
    const colLeft = document.createElement('div');
    colLeft.className = 'events-col left-col';
    const colRight = document.createElement('div');
    colRight.className = 'events-col right-col';

    // Alterna os eventos entre as colunas: 0 -> left, 1 -> right, 2 -> left ...
    artigos.forEach((artigo, idx) => {
        // remove do container original (manter referência)
        artigo.remove();
        if (idx % 2 === 0) colLeft.appendChild(artigo);
        else colRight.appendChild(artigo);
    });

    // Limpa e anexa as colunas
    lista.innerHTML = '';
    lista.appendChild(colLeft);
    lista.appendChild(colRight);
    lista.classList.add('distributed');
}

