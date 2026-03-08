// js/app.js

// ==========================================
// 1. PERSISTÊNCIA E LOGIN
// ==========================================
const nomeSalvo = localStorage.getItem('quest_user_name') || 'Maycon';
document.querySelector('.user-info h1').innerHTML = `Bem-vindo(a) de volta, <span class="tech-text">${nomeSalvo}!</span>`;

let xpTotal = parseInt(localStorage.getItem('quest_xp')) || 25;
document.getElementById('xp-display').innerText = `${xpTotal} XP`;

let meusDecks = JSON.parse(localStorage.getItem('quest_decks'));
if (!meusDecks) {
    meusDecks = JSON.parse(JSON.stringify(bancoDeDados));
}

// ==========================================
// 2. VARIÁVEIS DE JOGO
// ==========================================
let deckAtual = [];
let deckRevisao = []; 
let indiceCarta = 0;
let faseAtualId = ''; // NOVO: Memoriza em qual fase estamos
const ordemFases = ['fase1', 'fase2', 'fase4', 'fase5']; // NOVO: A ordem das aulas

// ==========================================
// 3. MECÂNICA DOS FLASHCARDS
// ==========================================
function carregarAula(faseId, nomeAula, elementoClicado) {
    const mainContent = document.getElementById('main-content');
    const rightPanel = document.getElementById('right-panel');
    const header = document.querySelector('.dashboard-header');

    if (elementoClicado.classList.contains('active-lesson')) {
        elementoClicado.classList.remove('active-lesson');
        mainContent.classList.remove('show-flashcards'); 
        rightPanel.classList.remove('active'); 
        header.classList.remove('expand'); 
        
        // Se fechou no celular, devolve o painel pro lugar original escondido
        if (window.innerWidth <= 900) { mainContent.appendChild(rightPanel); }
        return; 
    }

    document.querySelectorAll('.aula-item').forEach(el => el.classList.remove('active-lesson'));
    elementoClicado.classList.add('active-lesson');
    document.getElementById('titulo-aula').innerHTML = `Estudo Ativo: <span style="color: var(--alura-cyan)">${nomeAula}</span>`;

    // ===== MÁGICA DA RESPONSIVIDADE =====
    if (window.innerWidth <= 900) {
        // Se for Celular: Move o painel de cartas para LOGO ABAIXO da aula clicada
        elementoClicado.after(rightPanel);
    } else {
        // Se for PC: Garante que o painel fique na coluna da direita
        mainContent.appendChild(rightPanel);
    }
    // ====================================

    mainContent.classList.add('show-flashcards');
    rightPanel.classList.add('active');
    header.classList.add('expand');

    document.getElementById('botoes-jogo').style.display = 'flex';
    document.getElementById('botao-proxima').style.display = 'none';

    faseAtualId = faseId;
    deckAtual = [...(meusDecks[faseId] || [])]; 
    deckRevisao = []; 
    indiceCarta = 0;
    
    mostrarCartaAtual();
}

// NOVO: Função que vigia se você virou o celular ou redimensionou a tela do PC
window.addEventListener('resize', () => {
    const rightPanel = document.getElementById('right-panel');
    const mainContent = document.getElementById('main-content');
    const activeLesson = document.querySelector('.active-lesson');

    if (window.innerWidth > 900) {
        // Voltou pro PC? Joga pra coluna da direita
        mainContent.appendChild(rightPanel);
    } else if (activeLesson) {
        // Foi pro Celular? Joga pra baixo da aula ativa
        activeLesson.after(rightPanel);
    }
});

function mostrarCartaAtual() {
    const cardInner = document.getElementById('meuCard');
    cardInner.classList.remove('flipped'); 

    const carta = deckAtual[indiceCarta];
    if (!carta) return; 

    document.getElementById('texto-frente').innerText = carta.frente;
    document.getElementById('dica-frente').innerText = "Clique na carta ou aperte ESPAÇO para revelar a resposta";
    document.getElementById('texto-verso').innerText = carta.verso;
    document.getElementById('dica-verso').innerText = carta.dica || ""; 
    document.getElementById('contador-cartas').innerText = `Carta ${indiceCarta + 1} de ${deckAtual.length}`;
}

function finalizarDeck() {
    document.getElementById('texto-frente').innerText = "Parabéns! Você concluiu este deck 🎉";
    document.getElementById('texto-verso').innerText = "Excelente trabalho!";
    document.getElementById('dica-verso').innerText = "";
    document.getElementById('dica-frente').innerText = "";
    document.getElementById('contador-cartas').innerText = "Concluído";

    // MUDANÇA: Esconde os botões de jogo e mostra o botão de Próxima Atividade
    document.getElementById('botoes-jogo').style.display = 'none';
    const btnProximaContainer = document.getElementById('botao-proxima');
    const btnPratico = btnProximaContainer.querySelector('button');
    btnProximaContainer.style.display = 'flex';

    // Se for a última fase (Fase 05), muda o texto do botão
    const indexAtual = ordemFases.indexOf(faseAtualId);
    if (indexAtual >= 0 && indexAtual < ordemFases.length - 1) {
        btnPratico.innerHTML = "🚀 Ir para a próxima atividade";
    } else {
        btnPratico.innerHTML = "🏆 Finalizar Estudos";
    }
}

// NOVO: Função que pula para a próxima aula automaticamente
function irParaProximaAula() {
    const indexAtual = ordemFases.indexOf(faseAtualId);
    
    // Se ainda houver uma próxima fase na lista...
    if (indexAtual >= 0 && indexAtual < ordemFases.length - 1) {
        const proximaFase = ordemFases[indexAtual + 1];
        // Encontra o botão no menu da esquerda e simula um clique nele!
        const elementoProxima = document.getElementById('menu-' + proximaFase);
        if (elementoProxima) {
            elementoProxima.click(); 
        }
    } else {
        // Se for a última (Fase 05), apenas fecha o painel direito e guarda o material
        document.getElementById('menu-' + faseAtualId).click();
    }
}

function virarCarta() {
    if (deckAtual.length > 0 && indiceCarta < deckAtual.length) {
        document.getElementById('meuCard').classList.toggle('flipped');
    }
}

function processarResposta(resultado) {
    if (deckAtual.length === 0 || indiceCarta >= deckAtual.length) return;

    if (resultado === 'acertei') {
        xpTotal += 20;
        document.getElementById('xp-display').innerText = `${xpTotal} XP`;
        localStorage.setItem('quest_xp', xpTotal);
    } 
    else if (resultado === 'errei') {
        deckRevisao.push(deckAtual[indiceCarta]);
    }
    
    indiceCarta++;
    document.getElementById('meuCard').classList.remove('flipped');
    
    setTimeout(() => {
        if (indiceCarta >= deckAtual.length) {
            if (deckRevisao.length > 0) {
                deckAtual = [...deckRevisao]; 
                deckRevisao = []; 
                indiceCarta = 0;
                mostrarCartaAtual();
                document.getElementById('dica-frente').innerText = "🔄 Repassando as que você errou...";
            } else {
                finalizarDeck();
            }
        } else {
            mostrarCartaAtual();
        }
    }, 300); 
}

// ==========================================
// 4. SISTEMA DE MENUS E MODAIS
// ==========================================
function toggleMenu() { document.getElementById('dropdownMenu').classList.toggle('show'); }

document.addEventListener('click', function(event) {
    const menu = document.getElementById('dropdownMenu');
    const btn = document.querySelector('.hamburger-btn');
    if (!menu.contains(event.target) && !btn.contains(event.target)) { menu.classList.remove('show'); }
});

function abrirModal(idModal) {
    document.getElementById(idModal).classList.add('show');
    document.getElementById('dropdownMenu').classList.remove('show'); 
}

function fecharModal(idModal) { document.getElementById(idModal).classList.remove('show'); }

// ==========================================
// 5. FUNCIONALIDADES DO MENU
// ==========================================
function salvarFlashcard() {
    const fase = document.getElementById('nova-fase').value;
    const frente = document.getElementById('nova-frente').value.trim();
    const verso = document.getElementById('nova-verso').value.trim();
    const dica = document.getElementById('nova-dica').value.trim();

    if(!frente || !verso) { alert("⚠️ Por favor, preencha a Frente e o Verso!"); return; }

    if(!meusDecks[fase]) meusDecks[fase] = [];
    meusDecks[fase].push({ frente, verso, dica });
    localStorage.setItem('quest_decks', JSON.stringify(meusDecks));

    document.getElementById('nova-frente').value = '';
    document.getElementById('nova-verso').value = '';
    document.getElementById('nova-dica').value = '';
    fecharModal('modalCriacao');
    alert("✨ Flashcard salvo no seu navegador!");
}

function mostrarProgresso() {
    let totalCartas = 0;
    let htmlEstatisticas = '';
    
    for (const [fase, cartas] of Object.entries(meusDecks)) {
        totalCartas += cartas.length;
        htmlEstatisticas += `
            <div class="stat-box">
                Flashcards na ${fase.toUpperCase()} 
                <span>${cartas.length}</span>
            </div>
        `;
    }

    const conteudo = `
        <div class="stat-box highlight">XP Total Adquirido <span>${xpTotal}</span></div>
        <div class="stat-box">Total de Cartas no Deck <span>${totalCartas}</span></div>
        <div style="margin: 20px 0; height: 1px; background: #30363d;"></div>
        ${htmlEstatisticas}
    `;

    document.getElementById('progresso-body').innerHTML = conteudo;
    abrirModal('modalProgresso');
}

function resetarProgresso() {
    const certeza = confirm("⚠️ ATENÇÃO!\nIsso vai apagar todo o seu XP e as cartas que você adicionou.\nDeseja mesmo voltar do zero?");
    if (certeza) {
        localStorage.removeItem('quest_xp');
        localStorage.removeItem('quest_decks');
        alert("♻️ Progresso resetado com sucesso!");
        location.reload(); 
    }
}

function deslogar() {
    const certeza = confirm("Deseja mesmo sair do sistema?");
    if (certeza) {
        localStorage.removeItem('quest_user_name');
        window.location.href = 'login/login.html'; 
    }
}

// Atalhos de teclado
document.addEventListener('keydown', function(event) {
    if (document.querySelectorAll('.modal-overlay.show').length > 0) return;

    const painelDireito = document.getElementById('right-panel');
    if (!painelDireito.classList.contains('active')) return;
    if (indiceCarta >= deckAtual.length) return;

    if (event.code === 'Space') { event.preventDefault(); virarCarta(); } 
    else if (event.code === 'ArrowLeft') { processarResposta('errei'); } 
    else if (event.code === 'ArrowRight') { processarResposta('acertei'); }
});