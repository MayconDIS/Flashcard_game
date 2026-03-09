// js/app.js

// ==========================================
// 1. INICIALIZAÇÃO, DADOS E NOMES (FEEDBACK 3)
// ==========================================
const nomeSalvo = localStorage.getItem('quest_user_name') || 'Desenvolvedor';
document.getElementById('header-user-name').innerText = nomeSalvo;
document.getElementById('menu-user-name').innerText = nomeSalvo;

let xpTotal = parseInt(localStorage.getItem('quest_xp')) || 0;
let coinsTotal = parseInt(localStorage.getItem('quest_coins')) || 0;
document.getElementById('xp-display').innerText = `${xpTotal} XP`;
document.getElementById('coin-display').innerText = `🪙 ${coinsTotal}`;

let meusDecks = JSON.parse(localStorage.getItem('quest_decks')) || JSON.parse(JSON.stringify(bancoDeDados));

// ==========================================
// 2. SISTEMA DE DESBLOQUEIO E PROGRESSÃO (FEEDBACK 4)
// ==========================================
const ordemFases = ['fase1', 'fase2', 'fase3', 'fase4', 'fase5', 'fase6', 'fase7'];
let fasesDesbloqueadas = JSON.parse(localStorage.getItem('quest_desbloqueadas')) || ['fase1'];

function atualizarFasesVisuais() {
    ordemFases.forEach(fase => {
        const elementoFase = document.getElementById('menu-' + fase);
        if (!elementoFase) return;

        if (fasesDesbloqueadas.includes(fase)) {
            elementoFase.classList.remove('aula-locked-item');
            const icon = elementoFase.querySelector('.icon-status');
            if (icon && icon.innerText === '🔒') icon.innerText = '▶';
        } else {
            elementoFase.classList.add('aula-locked-item');
            const icon = elementoFase.querySelector('.icon-status');
            if (icon) icon.innerText = '🔒';
        }
    });
}

// ==========================================
// 3. SISTEMA DE NIVELAMENTO (PLACEMENT TEST)
// ==========================================
const quizPerguntas = [
    // Fase 1: Presente
    { p: "1. Preencha a lacuna: 'He ____ to code in Python.'", r: ["like", "likes", "liking"], certa: 1 },
    // Fase 2: Do/Does
    { p: "2. Qual o auxiliar correto para a pergunta: '____ they understand Artificial Intelligence?'", r: ["Do", "Does", "Are"], certa: 0 },
    // Fase 3: Negações
    { p: "3. Traduza: 'O sistema não salva os dados.'", r: ["The system don't save the data.", "The system doesn't save the data.", "The system not save the data."], certa: 1 },
    // Fase 4: Futuro (Will)
    { p: "4. Como dizemos 'Eu vou comprar um SSD novo' no futuro simples?", r: ["I buying a new SSD.", "I will buy a new SSD.", "I buy a new SSD soon."], certa: 1 },
    // Fase 5: Gerúndio (ING)
    { p: "5. O que significa 'The server is running'?", r: ["O servidor rodou.", "O servidor vai rodar.", "O servidor está rodando."], certa: 2 },
    // Pegadinha Presente
    { p: "6. Complete corretamente: 'She ____ work with esthetics.'", r: ["don't", "doesn't", "isn't"], certa: 1 },
    // Fase 6: Preposições
    { p: "7. Qual preposição usar na frase: 'The bug is ___ line 40.' (O bug está na linha 40)", r: ["in", "on", "at"], certa: 1 },
    // Fase 6: Preposições
    { p: "8. Complete: 'I usually study code ___ night.' (Eu geralmente estudo código à noite)", r: ["in", "on", "at"], certa: 2 },
    // Fase 7: Passado Simples
    { p: "9. Qual o passado correto do verbo Ir (Go) na frase: 'Nós fomos para a academia'?", r: ["We goed to the gym.", "We went to the gym.", "We going to the gym."], certa: 1 },
    // Fase 7: Did
    { p: "10. Como perguntar 'Você configurou o dual-boot?' no passado?", r: ["Do you configure the dual-boot?", "Are you configure the dual-boot?", "Did you configure the dual-boot?"], certa: 2 }
];

let questaoAtualNivelamento = 0;
let acertosNivelamento = 0;

function verificarNivelamento() {
    const jaNivelou = localStorage.getItem('quest_nivelado');
    if (!jaNivelou) {
        document.getElementById('modalNivelamento').classList.add('show');
    } else {
        atualizarFasesVisuais(); 
    }
}

function iniciarQuizNivelamento() {
    renderizarPerguntaNivelamento();
}

function renderizarPerguntaNivelamento() {
    const body = document.getElementById('nivelamento-body');
    const perguntaObj = quizPerguntas[questaoAtualNivelamento];
    
    let htmlRespostas = perguntaObj.r.map((resposta, index) => 
        `<button class="btn-action" style="width: 100%; margin-bottom: 10px; text-align: left;" onclick="responderNivelamento(${index})">${resposta}</button>`
    ).join('');

    body.innerHTML = `
        <h3 style="color: var(--alura-cyan); margin-bottom: 15px;">Questão ${questaoAtualNivelamento + 1} de ${quizPerguntas.length}</h3>
        <p style="color: #fff; font-size: 1.1rem; margin-bottom: 25px;">${perguntaObj.p}</p>
        ${htmlRespostas}
    `;
}

function responderNivelamento(indiceResposta) {
    if (indiceResposta === quizPerguntas[questaoAtualNivelamento].certa) {
        acertosNivelamento++;
    }
    
    questaoAtualNivelamento++;
    
    if (questaoAtualNivelamento < quizPerguntas.length) {
        renderizarPerguntaNivelamento();
    } else {
        finalizarNivelamento();
    }
}

function finalizarNivelamento() {
    let nivelMsg = "";
    
    // Lógica de Pontuação de 0 a 10
    if (acertosNivelamento <= 3) {
        nivelMsg = `Você acertou ${acertosNivelamento} de 10. <br><br><b>Nível Iniciante:</b> Começaremos da Fase 01 para construir uma base gramatical sólida!`;
        fasesDesbloqueadas = ['fase1'];
    } else if (acertosNivelamento >= 4 && acertosNivelamento <= 7) {
        nivelMsg = `Você acertou ${acertosNivelamento} de 10. <br><br><b>Nível Intermediário:</b> Mandou bem! Você já dominou o básico e começará com as Fases de 01 a 04 desbloqueadas.`;
        fasesDesbloqueadas = ['fase1', 'fase2', 'fase3', 'fase4'];
    } else {
        nivelMsg = `Você acertou ${acertosNivelamento} de 10. <br><br><b>Nível Expert:</b> Excelente conhecimento técnico! Todas as 7 fases de aprendizado contínuo foram desbloqueadas para você.`;
        fasesDesbloqueadas = ['fase1', 'fase2', 'fase3', 'fase4', 'fase5', 'fase6', 'fase7'];
    }

    localStorage.setItem('quest_nivelado', 'true');
    localStorage.setItem('quest_desbloqueadas', JSON.stringify(fasesDesbloqueadas));
    
    // Garante que a economia comece do zero
    localStorage.setItem('quest_xp', xpTotal);
    localStorage.setItem('quest_coins', coinsTotal);
    
    document.getElementById('xp-display').innerText = `${xpTotal} XP`;
    document.getElementById('coin-display').innerText = `🪙 ${coinsTotal}`;

    document.getElementById('nivelamento-body').innerHTML = `
        <h3 style="color: var(--alura-green); margin-bottom: 15px;">Avaliação Concluída!</h3>
        <p style="color: #c5c6c7; margin-bottom: 25px;">${nivelMsg}</p>
        <button class="btn-action btn-right" style="width: 100%;" onclick="fecharModal('modalNivelamento'); atualizarFasesVisuais();">Começar Minha Jornada</button>
    `;
}

// ==========================================
// 4. MECÂNICA DE FLASHCARDS E ACCORDION (FEEDBACK 5)
// ==========================================
let deckAtual = [];
let deckRevisao = []; 
let indiceCarta = 0;
let faseAtualId = ''; 

function carregarAula(faseId, nomeAula, elementoClicado) {
    // Trava de segurança: impede abrir se estiver bloqueado
    if (!fasesDesbloqueadas.includes(faseId)) {
        alert("🔒 Esta fase está bloqueada. Complete as fases anteriores para liberar!");
        return;
    }

    const rightPanel = document.getElementById('right-panel');
    const leftPanel = document.querySelector('.left-panel'); 

    // Mágica do Accordion: Se clicar na aula que já está aberta (para fechar)
    if (elementoClicado.classList.contains('active-lesson')) {
        elementoClicado.classList.remove('active-lesson');
        leftPanel.classList.remove('focus-mode'); 
        rightPanel.classList.remove('active'); 
        setTimeout(() => { rightPanel.style.display = 'none'; }, 300);
        return; 
    }

    // Ativa a nova aula e esconde o resto
    document.querySelectorAll('.aula-item').forEach(el => el.classList.remove('active-lesson'));
    elementoClicado.classList.add('active-lesson');
    leftPanel.classList.add('focus-mode'); 

    // --- NOVO: Encontra o cabeçalho do módulo atual e mantém ele visível ---
    document.querySelectorAll('.dia-header').forEach(el => el.classList.remove('active-header'));
    let prev = elementoClicado.previousElementSibling;
    while(prev) {
        if(prev.classList.contains('dia-header')) {
            prev.classList.add('active-header');
            break;
        }
        prev = prev.previousElementSibling;
    }
    // ----------------------------------------------------------------------

    document.getElementById('titulo-aula').innerHTML = `Estudo Ativo: <span style="color: var(--alura-cyan)">${nomeAula}</span>`;

    // O painel é injetado LOGO ABAIXO da aula clicada sempre
    elementoClicado.after(rightPanel);
    rightPanel.style.display = 'block';
    
    // Força um pequeno delay para a animação CSS pegar
    setTimeout(() => { rightPanel.classList.add('active'); }, 10);

    document.getElementById('botoes-jogo').style.display = 'flex';
    document.getElementById('botao-proxima').style.display = 'none';

    faseAtualId = faseId;
    deckAtual = [...(meusDecks[faseId] || [])]; 
    deckRevisao = []; 
    indiceCarta = 0;
    
    mostrarCartaAtual();
}

// ==========================================
// 2.1 SISTEMA DE LOJA E BÔNUS (NOVO)
// ==========================================
let bonusDesbloqueados = JSON.parse(localStorage.getItem('quest_bonus_unlocked')) || [];

// Atualiza o visual dos bônus ao carregar a página
function atualizarVisualBonus() {
    bonusDesbloqueados.forEach(bonusId => {
        const item = document.getElementById('menu-' + bonusId);
        const icon = document.getElementById('icon-' + bonusId);
        const price = document.getElementById('price-' + bonusId);
        
        if (item) {
            // Remove o cadeado e coloca o Play
            if (icon) icon.innerText = '▶';
            
            // Troca o preço por apenas a moedinha indicando que já é seu
            if (price) {
                price.innerText = '🪙'; // MUDANÇA: Agora fica só a moeda!
                price.style.borderColor = 'var(--alura-green)'; // Fica com a borda verde de sucesso
                price.style.background = 'rgba(0, 255, 136, 0.05)'; // Fundo verde bem suave
            }
        }
    });
}

// Tenta comprar ou abrir a aula bônus
function tentarAbrirBonus(bonusId, custo, nomeAula, elementoClicado) {
    
    // 1. Verifica se já foi comprado antes
    if (bonusDesbloqueados.includes(bonusId)) {
        // Se já comprou, abre a aula normalmente!
        // Mas antes precisamos "enganar" a função carregarAula adicionando o bonus na lista de permitidos temporariamente
        if (!fasesDesbloqueadas.includes(bonusId)) fasesDesbloqueadas.push(bonusId);
        carregarAula(bonusId, nomeAula, elementoClicado);
        return;
    }

    // 2. Se não comprou, oferece a compra
    const confirmar = confirm(`🔒 CONTEÚDO PREMIUM\n\nDeseja desbloquear "${nomeAula}" por 🪙 ${custo} Coins?\n\nSeu saldo atual: 🪙 ${coinsTotal}`);

    if (confirmar) {
        if (coinsTotal >= custo) {
            // Toca o som de caixa registradora (imaginário por enquanto)
            
            // 3. Deduz o valor e salva
            coinsTotal -= custo;
            bonusDesbloqueados.push(bonusId);
            
            localStorage.setItem('quest_coins', coinsTotal);
            localStorage.setItem('quest_bonus_unlocked', JSON.stringify(bonusDesbloqueados));
            
            // Atualiza a tela
            document.getElementById('coin-display').innerText = `🪙 ${coinsTotal}`;
            atualizarVisualBonus();
            
            alert(`🎉 Compra realizada com sucesso!\nO módulo "${nomeAula}" agora é seu para sempre.`);
            
            // Abre a aula automaticamente após a compra
            fasesDesbloqueadas.push(bonusId); // Necessário para passar na validação do carregarAula
            carregarAula(bonusId, nomeAula, elementoClicado);

        } else {
            alert(`🚫 Saldo Insuficiente!\nVocê precisa de 🪙 ${custo} Coins, mas só tem 🪙 ${coinsTotal}.\n\nContinue estudando as fases normais para ganhar mais moedas!`);
        }
    }
}

// IMPORTANTE: Adicione esta chamada no final do arquivo, junto com o window.onload
// para garantir que os itens comprados continuem comprados quando você voltar.
const onloadOriginal = window.onload;
window.onload = function() {
    if (onloadOriginal) onloadOriginal();
    atualizarVisualBonus();
};

function mostrarCartaAtual() {
    const cardInner = document.getElementById('meuCard');
    cardInner.classList.remove('flipped'); 

    const carta = deckAtual[indiceCarta];
    if (!carta) return; 

    document.getElementById('texto-frente').innerText = carta.frente;
    document.getElementById('dica-frente').innerText = "Clique ou aperte ESPAÇO para revelar";
    document.getElementById('texto-verso').innerText = carta.verso;
    document.getElementById('dica-verso').innerText = carta.dica || ""; 
    document.getElementById('contador-cartas').innerText = `Carta ${indiceCarta + 1} de ${deckAtual.length}`;
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

// FEEDBACK 2 e 4: Recompensa e Desbloqueio ao Finalizar
function finalizarDeck() {
    document.getElementById('texto-frente').innerText = "Parabéns! Lição Concluída 🎉";
    document.getElementById('texto-verso').innerText = "Você dominou estas cartas.";
    document.getElementById('dica-verso').innerText = "";
    document.getElementById('contador-cartas').innerText = "Concluído";

    document.getElementById('botoes-jogo').style.display = 'none';
    document.getElementById('botao-proxima').style.display = 'flex';
}

function irParaProximaAula() {
    // 1. Concede bônus de conclusão (Coins)
    coinsTotal += 15;
    localStorage.setItem('quest_coins', coinsTotal);
    document.getElementById('coin-display').innerText = `🪙 ${coinsTotal}`;

    // 2. Lógica de Desbloqueio Sequencial
    const indexAtual = ordemFases.indexOf(faseAtualId);
    if (indexAtual >= 0 && indexAtual < ordemFases.length - 1) {
        const proximaFase = ordemFases[indexAtual + 1];
        
        // Se a próxima fase ainda não está no array, adiciona
        if (!fasesDesbloqueadas.includes(proximaFase)) {
            fasesDesbloqueadas.push(proximaFase);
            localStorage.setItem('quest_desbloqueadas', JSON.stringify(fasesDesbloqueadas));
            atualizarFasesVisuais(); // Atualiza os cadeados na tela
            alert(`🔓 Nova Conquista! Você liberou a ${proximaFase.toUpperCase()} e ganhou 15 Coins!`);
        }
    }

    // 3. Fecha o painel atual (efeito sanfona)
    document.getElementById('menu-' + faseAtualId).click();
}

// ==========================================
// 5. SISTEMA DE MENUS E MODAIS 
// ==========================================
function toggleMenu() { document.getElementById('dropdownMenu').classList.toggle('show'); }

document.addEventListener('click', function(event) {
    const menu = document.getElementById('dropdownMenu');
    const btn = document.querySelector('.hamburger-btn');
    if (menu && btn && !menu.contains(event.target) && !btn.contains(event.target)) { 
        menu.classList.remove('show'); 
    }
});

function abrirModal(idModal) {
    document.getElementById(idModal).classList.add('show');
    const menu = document.getElementById('dropdownMenu');
    if(menu) menu.classList.remove('show'); 
}

function fecharModal(idModal) { document.getElementById(idModal).classList.remove('show'); }

function deslogar() {
    if (confirm("Deseja mesmo sair do sistema?")) {
        localStorage.removeItem('quest_user_name');
        window.location.href = 'login/login.html'; 
    }
}

// Inicializa a página rodando o verificador de Nivelamento
window.onload = verificarNivelamento;

// ==========================================
// 6. FUNCIONALIDADES DOS MODAIS E PROGRESSO
// ==========================================
function salvarFlashcard() {
    // Pega a fase (em minúsculas para não dar erro)
    const fase = document.getElementById('nova-fase').value.trim().toLowerCase();
    const frente = document.getElementById('nova-frente').value.trim();
    const verso = document.getElementById('nova-verso').value.trim();
    const dica = document.getElementById('nova-dica').value.trim();

    if(!fase || !frente || !verso) { 
        alert("⚠️ Por favor, preencha a Fase, a Frente e o Verso!"); 
        return; 
    }

    if(!meusDecks[fase]) meusDecks[fase] = [];
    meusDecks[fase].push({ frente, verso, dica });
    localStorage.setItem('quest_decks', JSON.stringify(meusDecks));

    // Limpa os campos após salvar
    document.getElementById('nova-fase').value = '';
    document.getElementById('nova-frente').value = '';
    document.getElementById('nova-verso').value = '';
    document.getElementById('nova-dica').value = '';
    fecharModal('modalCriacao');
    alert("✨ Flashcard criado e salvo na " + fase.toUpperCase() + "!");
}

function mostrarProgresso() {
    let totalCartas = 0;
    let htmlEstatisticas = '';
    
    // Varre todas as fases contando os flashcards
    for (const [fase, cartas] of Object.entries(meusDecks)) {
        totalCartas += cartas.length;
        htmlEstatisticas += `
            <div class="stat-box">
                Flashcards na ${fase.toUpperCase()} 
                <span>${cartas.length}</span>
            </div>
        `;
    }

    // Monta a tela de Progresso incluindo os XP e Coins
    const conteudo = `
        <div class="stat-box highlight">XP Total Adquirido <span>${xpTotal} XP</span></div>
        <div class="stat-box highlight" style="border-color: #ffd700; background-color: rgba(255, 215, 0, 0.05);">Coins Acumulados <span style="color: #ffd700;">🪙 ${coinsTotal}</span></div>
        <div class="stat-box">Total de Cartas no Deck <span>${totalCartas}</span></div>
        <div style="margin: 20px 0; height: 1px; background: #30363d;"></div>
        ${htmlEstatisticas}
    `;

    document.getElementById('progresso-body').innerHTML = conteudo;
    abrirModal('modalProgresso');
}

function resetarProgresso() {
    const certeza = confirm("⚠️ ATENÇÃO EXTREMA!\nIsso vai apagar todo o seu XP, Coins, Decks e Fases Desbloqueadas.\nDeseja mesmo voltar do zero?");
    if (certeza) {
        localStorage.removeItem('quest_xp');
        localStorage.removeItem('quest_coins');
        localStorage.removeItem('quest_decks');
        localStorage.removeItem('quest_nivelado');
        localStorage.removeItem('quest_desbloqueadas');
        alert("♻️ Progresso resetado! Retornando ao terminal de acesso...");
        window.location.href = 'login/login.html'; 
    }
}