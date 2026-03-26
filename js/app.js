// js/app.js

// ==========================================
// 1. INICIALIZAÇÃO E BANCO DE DADOS
// ==========================================
const nomeSalvo = localStorage.getItem('quest_user_name') || 'Desenvolvedor';

const headerUserName = document.getElementById('header-user-name') || document.getElementById('header-user-name-title');
if (headerUserName) headerUserName.innerText = nomeSalvo;

const menuUserName = document.getElementById('menu-user-name');
if (menuUserName) menuUserName.innerText = nomeSalvo;

const userKey = `quest_${nomeSalvo}_`;

let rankSalvo = localStorage.getItem(userKey + 'rank') || 'Rank: Pendente';
document.getElementById('menu-user-level').innerText = rankSalvo;

let xpTotal = parseInt(localStorage.getItem(userKey + 'xp')) || 0;
let coinsTotal = parseInt(localStorage.getItem(userKey + 'coins')) || 0;

document.getElementById('xp-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">military_tech</span> ${xpTotal} XP`;
document.getElementById('coin-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">toll</span> ${coinsTotal}`;

let meusDecks = JSON.parse(localStorage.getItem(userKey + 'decks'));
if (!meusDecks || !meusDecks.fase22 || meusDecks.fase22.length < 50) {
    meusDecks = JSON.parse(JSON.stringify(bancoDeDados));
    localStorage.setItem(userKey + 'decks', JSON.stringify(meusDecks));
}

// Banco de dados do Algoritmo ANKI
let srsData = JSON.parse(localStorage.getItem(userKey + 'srs')) || {};

// ==========================================
// 2. SISTEMA DE DESBLOQUEIO E BÔNUS
// ==========================================
const ordemFases = [];
for (let i = 1; i <= 22; i++) { ordemFases.push('fase' + i); }

let fasesDesbloqueadas = JSON.parse(localStorage.getItem(userKey + 'desbloqueadas')) || ['fase1'];
let bonusDesbloqueados = JSON.parse(localStorage.getItem(userKey + 'bonus_unlocked')) || [];

function atualizarFasesVisuais() {
    ordemFases.forEach(fase => {
        const elementoFase = document.getElementById('menu-' + fase);
        if (!elementoFase) return;

        if (fasesDesbloqueadas.includes(fase)) {
            elementoFase.classList.remove('aula-locked-item');
            const icon = elementoFase.querySelector('.icon-status');
            if (icon && icon.innerText === 'lock') icon.innerText = 'check_circle';
        } else {
            elementoFase.classList.add('aula-locked-item');
            const icon = elementoFase.querySelector('.icon-status');
            if (icon) icon.innerText = 'lock';
        }
    });
    
    const listaBonus = ['bonus1', 'bonus2', 'bonus3', 'bonus4'];
    listaBonus.forEach(bonusId => {
        const item = document.getElementById('menu-' + bonusId);
        const icon = document.getElementById('icon-' + bonusId);
        const price = document.getElementById('price-' + bonusId);
        
        if (item && bonusDesbloqueados.includes(bonusId)) {
            if (icon) icon.innerText = 'check_circle';
            if (price) {
                price.innerHTML = '<span class="material-symbols-outlined" style="font-size: 1rem;">toll</span> Liberado';
                price.style.borderColor = 'var(--alura-green)';
                price.style.background = 'rgba(0, 255, 136, 0.05)';
                price.style.color = 'var(--alura-green)';
            }
        }
    });
}

function tentarAbrirBonus(bonusId, custo, nomeAula, elementoClicado) {
    if (bonusDesbloqueados.includes(bonusId)) {
        if (!fasesDesbloqueadas.includes(bonusId)) fasesDesbloqueadas.push(bonusId);
        carregarAula(bonusId, nomeAula, elementoClicado);
        return;
    }
    
    const confirmar = confirm(`[ TRANSAÇÃO DE SISTEMA ]\n\nDeseja gastar ${custo} Coins para desbloquear a fase:\n"${nomeAula}"?\n\nSaldo atual: ${coinsTotal} Coins.`);
    
    if (confirmar) {
        if (coinsTotal >= custo) {
            coinsTotal -= custo;
            bonusDesbloqueados.push(bonusId);
            localStorage.setItem(userKey + 'coins', coinsTotal);
            localStorage.setItem(userKey + 'bonus_unlocked', JSON.stringify(bonusDesbloqueados));
            document.getElementById('coin-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">toll</span> ${coinsTotal}`;
            atualizarFasesVisuais();
            alert(`[ SUCESSO ]\nTransação concluída. Acesso concedido.`);
            if (!fasesDesbloqueadas.includes(bonusId)) fasesDesbloqueadas.push(bonusId);
            carregarAula(bonusId, nomeAula, elementoClicado);
        } else {
            alert(`[ ACESSO NEGADO ]\nSaldo insuficiente.\nVocê possui ${coinsTotal} Coins, mas precisa de ${custo}.`);
        }
    }
}

// ==========================================
// 3. SISTEMA DE NIVELAMENTO ENADE
// ==========================================
const quizPerguntas = [
    { p: "1. Python: O que é um Dicionário?", r: ["Uma lista de palavras.", "Estrutura baseada em 'Chave: Valor'.", "Um laço de repetição."], certa: 1 },
    { p: "2. Segurança: O que é Phishing?", r: ["Ataque via e-mail falso.", "Firewall físico.", "Um tipo de vírus de pendrive."], certa: 0 },
    { p: "3. Dados: Qual a principal diferença de uma Fila para uma Pilha?", r: ["Fila é LIFO, Pilha é FIFO.", "Fila é FIFO (Primeiro a entrar, primeiro a sair).", "Pilhas são maiores."], certa: 1 },
    { p: "4. Redes: Para que serve o HTTPS?", r: ["Limpar o cache.", "Conectar o banco de dados.", "Navegação web segura com criptografia."], certa: 2 },
    { p: "5. Banco de Dados: O que é a Chave Estrangeira (FK)?", r: ["Senha do admin.", "Vínculo de referência com a Chave Primária de outra tabela.", "Arquivo JSON."], certa: 1 },
    { p: "6. POO (C#): O que é Polimorfismo?", r: ["Múltiplas formas de um método.", "Esconder código.", "Limpar memória."], certa: 0 },
    { p: "7. UX/UI: O que significa 'Mobile First'?", r: ["Criar o app apenas para Android.", "Desenhar focando primeiro na tela do celular.", "Obrigar login."], certa: 1 },
    { p: "8. Frameworks: O que é um ORM (ex: Entity Framework)?", r: ["Mapeia dados relacionais para objetos da programação.", "Deleta vírus.", "Uma linguagem front-end."], certa: 0 },
    { p: "9. Nuvem: O que faz o Docker?", r: ["Acelerar o WiFi.", "Empacotar sistemas em contêineres isolados.", "Conecta impressoras."], certa: 1 },
    { p: "10. Mobile: O que é o SDK?", r: ["Software Development Kit (Kit de ferramentas para criar apps).", "Um banco de dados.", "Cabo USB."], certa: 0 }
];

let questaoAtualNivelamento = 0;
let acertosNivelamento = 0;

function verificarNivelamento() {
    const jaNivelou = localStorage.getItem(userKey + 'nivelado');
    if (!jaNivelou) document.getElementById('modalNivelamento').classList.add('show');
    else atualizarFasesVisuais(); 
}

function refazerDiagnostico() {
    questaoAtualNivelamento = 0;
    acertosNivelamento = 0;
    document.getElementById('nivelamento-body').innerHTML = `
        <p style="color: #c5c6c7; font-size: 1.1rem; margin-bottom: 20px;">
            Iniciando protocolo de avaliação. Para calibrarmos sua árvore de habilidades, responda às 10 questões técnicas abaixo.
        </p>
        <button class="btn-action btn-right tech-font flex-align-center" style="width: 100%; padding: 15px; justify-content: center;" onclick="iniciarQuizNivelamento()">
            <span class="material-symbols-outlined" style="margin-right:5px;">play_arrow</span> START_SCAN()
        </button>
    `;
    abrirModal('modalNivelamento');
}

function iniciarQuizNivelamento() { renderizarPerguntaNivelamento(); }

function renderizarPerguntaNivelamento() {
    const body = document.getElementById('nivelamento-body');
    const perguntaObj = quizPerguntas[questaoAtualNivelamento];
    let htmlRespostas = perguntaObj.r.map((resposta, index) => 
        `<button class="btn-action tech-font" style="width: 100%; margin-bottom: 10px; text-align: left;" onclick="responderNivelamento(${index})">${resposta}</button>`
    ).join('');
    
    body.innerHTML = `
        <h3 style="color: var(--alura-cyan); margin-bottom: 15px;">Avaliação Acadêmica ${questaoAtualNivelamento + 1}/10</h3>
        <p style="color: #fff; font-size: 1.1rem; margin-bottom: 25px;">${perguntaObj.p}</p>
        ${htmlRespostas}
    `;
}

function responderNivelamento(indiceResposta) {
    if (indiceResposta === quizPerguntas[questaoAtualNivelamento].certa) acertosNivelamento++;
    questaoAtualNivelamento++;
    if (questaoAtualNivelamento < quizPerguntas.length) renderizarPerguntaNivelamento(); 
    else finalizarNivelamento(); 
}

function finalizarNivelamento() {
    let nivelMsg = "";
    let nomeRank = "";
    
    if (acertosNivelamento <= 3) {
        nivelMsg = `Você pontuou ${acertosNivelamento}/10. <br><br><b>Status: Ingressante.</b> Vamos focar na base do Módulo 01!`;
        fasesDesbloqueadas = ['fase1'];
        nomeRank = "Rank: Ingressante";
    } else if (acertosNivelamento >= 4 && acertosNivelamento <= 7) {
        nivelMsg = `Você pontuou ${acertosNivelamento}/10. <br><br><b>Status: Intermediário.</b> Os Módulos 01 e 02 estão abertos!`;
        fasesDesbloqueadas = ['fase1', 'fase2', 'fase3', 'fase4', 'fase5', 'fase6', 'fase7', 'fase8', 'fase9', 'fase10'];
        nomeRank = "Rank: Intermediário";
    } else {
        nivelMsg = `Você pontuou ${acertosNivelamento}/10. <br><br><b>Status: Expert Universitário.</b> Todas as 22 disciplinas regulares estão abertas!`;
        fasesDesbloqueadas = [...ordemFases]; 
        nomeRank = "Rank: Expert";
    }

    localStorage.setItem(userKey + 'nivelado', 'true');
    localStorage.setItem(userKey + 'desbloqueadas', JSON.stringify(fasesDesbloqueadas));
    localStorage.setItem(userKey + 'xp', xpTotal);
    localStorage.setItem(userKey + 'coins', coinsTotal);
    localStorage.setItem(userKey + 'rank', nomeRank);
    
    document.getElementById('menu-user-level').innerText = nomeRank;
    document.getElementById('xp-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">military_tech</span> ${xpTotal} XP`;
    document.getElementById('coin-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">toll</span> ${coinsTotal}`;

    document.getElementById('nivelamento-body').innerHTML = `
        <h3 style="color: var(--alura-green); margin-bottom: 15px;">Avaliação Concluída!</h3>
        <p style="color: #c5c6c7; margin-bottom: 25px;">${nivelMsg}</p>
        <button class="btn-action btn-right tech-font flex-align-center" style="width: 100%; justify-content: center;" onclick="fecharModal('modalNivelamento'); atualizarFasesVisuais();">Entrar no Terminal</button>
    `;
}

// ==========================================
// 4. MOTOR ANKI (SPACED REPETITION) E ENADE
// ==========================================
let deckAtual = [];
let deckRevisao = []; 
let indiceCarta = 0;
let faseAtualId = ''; 

function formatarIntervalo(dias) {
    let d = Math.round(dias);
    if (d < 1) return "<10m";
    if (d === 1) return "1d";
    if (d < 30) return d + "d";
    if (d < 365) return Math.round(d / 30) + "m";
    return Math.round(d / 365) + "a";
}

function gerarBotoesAnki(idCarta) {
    let dataSrs = srsData[idCarta] || { rep: 0, interval: 0, ease: 2.5 };
    let tAgain = "<1m", tHard = "<6m", tGood = "<10m", tEasy = "3d";

    if (dataSrs.rep > 0) {
        tHard = formatarIntervalo(Math.max(1, dataSrs.interval * 1.2));
        tGood = formatarIntervalo(Math.max(1, dataSrs.interval * dataSrs.ease));
        tEasy = formatarIntervalo(Math.max(1, dataSrs.interval * dataSrs.ease * 1.3));
    }

    return `
        <div class="anki-container">
            <button class="anki-btn" onclick="processarResposta('again')">
                <span class="anki-time">${tAgain}</span>
                <span class="anki-label" style="color: #ff5555;">De novo</span>
            </button>
            <button class="anki-btn" onclick="processarResposta('hard')">
                <span class="anki-time">${tHard}</span>
                <span class="anki-label" style="color: #ffaa00;">Difícil</span>
            </button>
            <button class="anki-btn" onclick="processarResposta('good')">
                <span class="anki-time">${tGood}</span>
                <span class="anki-label" style="color: #00ff88;">Bom</span>
            </button>
            <button class="anki-btn" onclick="processarResposta('easy')">
                <span class="anki-time">${tEasy}</span>
                <span class="anki-label" style="color: #00e6e6;">Fácil</span>
            </button>
        </div>
    `;
}

function carregarAula(faseId, nomeAula, elementoClicado) {
    if (!fasesDesbloqueadas.includes(faseId)) {
        alert("[ SISTEMA ]\n\nDisciplina bloqueada. Conclua as permissões anteriores!");
        return;
    }

    const rightPanel = document.getElementById('right-panel');
    const leftPanel = document.querySelector('.left-panel'); 

    // Fechar fase se já estiver aberta
    if (elementoClicado.classList.contains('active-lesson')) {
        elementoClicado.classList.remove('active-lesson');
        leftPanel.classList.remove('focus-mode'); 
        
        // Retorna o scroll com o ajuste fino de 2.2px para cima
        const headerFixHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 80;
        const y = elementoClicado.getBoundingClientRect().top + window.pageYOffset - headerFixHeight - 2.2;
        window.scrollTo({ top: y, behavior: 'smooth' });

        setTimeout(() => { leftPanel.classList.remove('fade-out-others'); }, 50);
        document.querySelectorAll('.dia-header').forEach(el => el.classList.remove('active-header'));
        rightPanel.classList.remove('active'); 
        setTimeout(() => { rightPanel.style.display = 'none'; }, 1000); 
        return; 
    }

    // Abrir Fase
    document.querySelectorAll('.aula-item').forEach(el => el.classList.remove('active-lesson'));
    elementoClicado.classList.add('active-lesson');
    leftPanel.classList.add('fade-out-others');
    document.querySelectorAll('.dia-header').forEach(el => el.classList.remove('active-header'));
    
    let prev = elementoClicado.previousElementSibling;
    while(prev) {
        if(prev.classList.contains('dia-header')) { prev.classList.add('active-header'); break; }
        prev = prev.previousElementSibling;
    }

    document.getElementById('botoes-jogo').style.display = 'flex';
    document.getElementById('botao-proxima').style.display = 'none';

    faseAtualId = faseId;
    let cartasDaFase = [...(meusDecks[faseId] || [])]; 
    let agora = new Date().getTime();

    // Filtro ANKI
    deckAtual = cartasDaFase.filter(carta => {
        let infoAnki = srsData[carta.frente];
        if (!infoAnki) return true; // Nova
        return infoAnki.next <= agora; // Devida
    });

    if (deckAtual.length === 0) {
        elementoClicado.classList.remove('active-lesson');
        leftPanel.classList.remove('focus-mode'); 
        leftPanel.classList.remove('fade-out-others');
        document.querySelectorAll('.dia-header').forEach(el => el.classList.remove('active-header'));
        
        alert("✅ [ SISTEMA ANKI: REVISÃO EM DIA ]\n\nVocê já estudou todo o conteúdo desta disciplina por hoje!\nSeu cérebro precisa de descanso para fixar a memória. Volte amanhã para novas revisões espaçadas.");
        
        rightPanel.classList.remove('active'); 
        setTimeout(() => { rightPanel.style.display = 'none'; }, 1000); 
        return;
    }

    // Shuffle (Embaralhar)
    for (let i = deckAtual.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deckAtual[i], deckAtual[j]] = [deckAtual[j], deckAtual[i]];
    }

    document.getElementById('titulo-aula').innerHTML = `Processando: <span style="color: var(--alura-cyan)">${nomeAula}</span>`;
    elementoClicado.after(rightPanel);
    rightPanel.style.display = 'block';
    
    setTimeout(() => { rightPanel.classList.add('active'); }, 50);

    // ===============================================
    // LÓGICA BLINDADA DE SCROLL (Ajuste fino Sub-pixel 2.2px)
    // ===============================================
    setTimeout(() => {
        if (elementoClicado.classList.contains('active-lesson')) {
            leftPanel.classList.add('focus-mode');

            setTimeout(() => {
                const headerObj = document.querySelector('header');
                const headerFixHeight = headerObj ? headerObj.offsetHeight : 80;
                
                const targetBox = elementoClicado;
                const elementTop = targetBox.getBoundingClientRect().top;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                
                // Aplicado o ajuste exato de 6px que pediu
                const targetPosition = scrollY + elementTop - headerFixHeight - 6;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }, 100); 
        }
    }, 700); 

    deckRevisao = []; 
    indiceCarta = 0;
    
    mostrarCartaAtual();
}

function mostrarCartaAtual() {
    const cardInner = document.getElementById('meuCard');
    cardInner.classList.remove('flipped'); 

    const carta = deckAtual[indiceCarta];
    if (!carta) return; 

    const frenteEl = document.getElementById('texto-frente');
    const versoEl = document.getElementById('texto-verso');
    const isEnade = carta.opcoes;

    if (isEnade) {
        frenteEl.style.textAlign = 'left';
        versoEl.style.textAlign = 'left';
        
        let htmlOpcoes = carta.opcoes.map((op, idx) => 
            `<button class="btn-opcao" onclick="event.stopPropagation(); verificarEnade(${idx}, ${carta.correta})">${op}</button>`
        ).join('');

        frenteEl.innerHTML = `
            <div style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">${carta.frente}</div>
            <div class="opcoes-container">${htmlOpcoes}</div>
        `;
        
        versoEl.innerHTML = `
            <div style="font-size: 0.95rem; color: #8b92a5; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #30363d; width: 100%; text-align: left; line-height: 1.5;">
                <strong style="color: var(--alura-cyan);">Relembrando a Questão:</strong><br><br>${carta.frente}
            </div>
            <div style="font-size: 1.1rem; text-align: left; line-height: 1.6; color: #fff;">
                ${carta.verso.replace(/\n/g, '<br>')}
            </div>
        `;
        
        document.getElementById('dica-frente').innerText = "Selecione a alternativa correta abaixo";
        document.getElementById('dica-verso').innerText = carta.dica || ""; 
        document.getElementById('botoes-jogo').style.display = 'none';
    } else {
        frenteEl.style.fontSize = '1.5rem';
        frenteEl.style.textAlign = 'center';
        
        frenteEl.innerHTML = carta.frente;
        versoEl.innerHTML = `
            <div style="font-size: 0.95rem; color: #8b92a5; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #30363d; width: 100%; text-align: center;">
                <strong style="color: var(--alura-cyan);">Pergunta Original:</strong><br><br>${carta.frente}
            </div>
            <div style="font-size: 1.3rem; text-align: center; color: #fff; font-weight: 500;">
                ${carta.verso.replace(/\n/g, '<br>')}
            </div>
        `;

        document.getElementById('dica-frente').innerText = "Aperte [ESPAÇO] para debugar";
        document.getElementById('dica-verso').innerText = carta.dica || ""; 
        
        document.getElementById('botoes-jogo').innerHTML = `
            <button class="btn-mostrar tech-font" onclick="virarCarta()">MOSTRAR RESPOSTA</button>
        `;
        document.getElementById('botoes-jogo').style.display = 'flex';
    }
    document.getElementById('contador-cartas').innerText = `Item ${indiceCarta + 1}/${deckAtual.length}`;
}

function virarCarta() {
    const isEnade = deckAtual[indiceCarta] && deckAtual[indiceCarta].opcoes;

    if (isEnade) {
        const botoesVisiveis = document.getElementById('botoes-jogo').style.display === 'flex';
        if (!botoesVisiveis) return;
    }

    if (deckAtual.length > 0 && indiceCarta < deckAtual.length) {
        const card = document.getElementById('meuCard');
        card.classList.toggle('flipped');
        
        if (!isEnade && card.classList.contains('flipped')) {
            document.getElementById('botoes-jogo').innerHTML = gerarBotoesAnki(deckAtual[indiceCarta].frente);
        } else if (!isEnade && !card.classList.contains('flipped')) {
            document.getElementById('botoes-jogo').innerHTML = `<button class="btn-mostrar tech-font" onclick="virarCarta()">MOSTRAR RESPOSTA</button>`;
        }
    }
}

document.addEventListener('keydown', function(e) {
    const isPlaying = document.getElementById('right-panel').classList.contains('active');
    if (!isPlaying) return;

    const isEnade = deckAtual[indiceCarta] && deckAtual[indiceCarta].opcoes;
    if (isEnade) return; 

    const card = document.getElementById('meuCard');
    const isFlipped = card.classList.contains('flipped');

    if (e.code === 'Space') {
        e.preventDefault();
        if (!isFlipped) virarCarta();
        else processarResposta('good'); 
    } else if (isFlipped) {
        if (e.key === '1') processarResposta('again');
        if (e.key === '2') processarResposta('hard');
        if (e.key === '3') processarResposta('good');
        if (e.key === '4') processarResposta('easy');
    }
});

function soltarEstrelas(botaoElement) {
    for (let i = 0; i < 8; i++) {
        let star = document.createElement('div');
        star.innerText = '⭐';
        star.className = 'star-anim';
        star.style.left = (Math.random() * 80 + 10) + '%'; 
        star.style.animationDelay = (Math.random() * 0.3) + 's';
        botaoElement.appendChild(star);
        setTimeout(() => star.remove(), 1000);
    }
}

function verificarEnade(escolhida, correta) {
    const botoes = document.querySelectorAll('.btn-opcao');
    botoes.forEach(b => b.disabled = true);

    if (escolhida === correta) {
        botoes[escolhida].classList.add('opcao-correta');
        soltarEstrelas(botoes[escolhida]);
        
        setTimeout(() => {
            document.getElementById('meuCard').classList.add('flipped');
            document.getElementById('botoes-jogo').innerHTML = gerarBotoesAnki(deckAtual[indiceCarta].frente);
            document.getElementById('botoes-jogo').style.display = 'flex';
        }, 3000);

    } else {
        botoes[escolhida].classList.add('opcao-errada');
        botoes[correta].classList.add('opcao-correta'); 
        
        setTimeout(() => {
            document.getElementById('meuCard').classList.add('flipped');
            document.getElementById('botoes-jogo').innerHTML = `
                <div class="anki-container">
                    <button class="anki-btn" style="border-color: #ff5555;" onclick="processarResposta('again')">
                        <span class="anki-time"><1m</span>
                        <span class="anki-label" style="color: #ff5555;">Errou (Repetir Hoje)</span>
                    </button>
                </div>
            `;
            document.getElementById('botoes-jogo').style.display = 'flex';
        }, 3000);
    }
}

function processarResposta(resultado) {
    if (deckAtual.length === 0 || indiceCarta >= deckAtual.length) return;
    
    let cartaAtual = deckAtual[indiceCarta];
    let idCarta = cartaAtual.frente; 
    let dataSrs = srsData[idCarta] || { rep: 0, interval: 0, ease: 2.5, next: 0 };
    let agora = new Date().getTime();

    if (resultado === 'again' || resultado === 'errei') {
        deckRevisao.push(cartaAtual); 
        dataSrs.rep = 0;
        dataSrs.interval = 1;
        dataSrs.ease = Math.max(1.3, dataSrs.ease - 0.2); 
    } else if (resultado === 'hard') {
        dataSrs.interval = Math.max(1, Math.round(dataSrs.interval * 1.2));
        dataSrs.ease = Math.max(1.3, dataSrs.ease - 0.15);
        dataSrs.rep++;
    } else if (resultado === 'good' || resultado === 'acertei') {
        if (dataSrs.rep === 0) dataSrs.interval = 1;
        else dataSrs.interval = Math.max(1, Math.round(dataSrs.interval * dataSrs.ease));
        dataSrs.rep++;
    } else if (resultado === 'easy') {
        if (dataSrs.rep === 0) dataSrs.interval = 3;
        else dataSrs.interval = Math.max(1, Math.round(dataSrs.interval * dataSrs.ease * 1.3));
        dataSrs.ease += 0.15; 
        dataSrs.rep++;
    }

    dataSrs.next = agora + (dataSrs.interval * 86400000); 
    srsData[idCarta] = dataSrs;
    localStorage.setItem(userKey + 'srs', JSON.stringify(srsData));
    
    indiceCarta++;
    document.getElementById('meuCard').classList.remove('flipped');
    
    setTimeout(() => {
        if (indiceCarta >= deckAtual.length) {
            if (deckRevisao.length > 0) {
                deckAtual = [...deckRevisao]; 
                deckRevisao = []; 
                indiceCarta = 0;
                mostrarCartaAtual();
                document.getElementById('dica-frente').innerText = "🔄 Reprocessando os erros de hoje...";
            } else {
                finalizarDeck();
            }
        } else {
            mostrarCartaAtual();
        }
    }, 300); 
}

function finalizarDeck() {
    document.getElementById('texto-frente').innerText = "Rotina Concluída 🎉";
    document.getElementById('texto-verso').innerText = "Código executado com sucesso!";
    document.getElementById('dica-verso').innerText = "Recolha seu XP e Coins abaixo.";
    document.getElementById('contador-cartas').innerText = "Status: Finalizado";
    document.getElementById('botoes-jogo').style.display = 'none';
    document.getElementById('botao-proxima').style.display = 'flex';
}

function irParaProximaAula() {
    let xpGanho = 0;
    let coinsGanho = 0;

    if (faseAtualId.startsWith('fase')) {
        let numFase = parseInt(faseAtualId.replace('fase', ''));
        if (numFase >= 1 && numFase <= 5)        { xpGanho = 5;  coinsGanho = 10; } 
        else if (numFase >= 6 && numFase <= 10)  { xpGanho = 10; coinsGanho = 10; } 
        else if (numFase >= 11 && numFase <= 15) { xpGanho = 15; coinsGanho = 10; } 
        else if (numFase >= 16 && numFase <= 20) { xpGanho = 20; coinsGanho = 10; } 
        else if (numFase >= 21 && numFase <= 22) { xpGanho = 30; coinsGanho = 70; } 
    } else if (faseAtualId.startsWith('bonus')) {
        xpGanho = 25; coinsGanho = 15;
    }

    xpTotal += xpGanho;
    coinsTotal += coinsGanho;
    
    localStorage.setItem(userKey + 'xp', xpTotal);
    localStorage.setItem(userKey + 'coins', coinsTotal);
    
    document.getElementById('xp-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">military_tech</span> ${xpTotal} XP`;
    document.getElementById('coin-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">toll</span> ${coinsTotal}`;

    const indexAtual = ordemFases.indexOf(faseAtualId);
    
    if (indexAtual >= 0 && indexAtual < ordemFases.length - 1) {
        const proximaFase = ordemFases[indexAtual + 1];
        if (!fasesDesbloqueadas.includes(proximaFase)) {
            fasesDesbloqueadas.push(proximaFase);
            localStorage.setItem(userKey + 'desbloqueadas', JSON.stringify(fasesDesbloqueadas));
            atualizarFasesVisuais(); 
            alert(`[ SUCESSO ]\nMissão Concluída!\nRecompensa: +${xpGanho} XP e +${coinsGanho} Coins.\n🔓 Novo acesso concedido!`);
        } else {
            alert(`[ SUCESSO ]\nRevisão de Código Concluída!\nVocê ganhou +${xpGanho} XP e +${coinsGanho} Coins!`);
        }
    } else if (indexAtual === ordemFases.length - 1) {
        alert(`[ MISSÃO FINALIZADA ]\nConcluiu o ENADE! Receba +${xpGanho} XP e +${coinsGanho} Coins!`);
    } else if (faseAtualId.startsWith('bonus')) {
        alert(`[ BÔNUS ]\nConhecimento extra rendeu +${xpGanho} XP e +${coinsGanho} Coins!`);
    }

    document.getElementById('menu-' + faseAtualId).click(); 
}

// ==========================================
// 5. MODAIS E CONFIGURAÇÕES
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
    if (menu) menu.classList.remove('show'); 
}

function fecharModal(idModal) { document.getElementById(idModal).classList.remove('show'); }

function salvarFlashcard() {
    const fase = document.getElementById('nova-fase').value.trim().toLowerCase();
    const frente = document.getElementById('nova-frente').value.trim();
    const verso = document.getElementById('nova-verso').value.trim();
    const dica = document.getElementById('nova-dica').value.trim();

    if (!fase || !frente || !verso) { alert("[ AVISO ]\nPor favor, preencha Frente e Verso!"); return; }

    if (!meusDecks[fase]) meusDecks[fase] = [];
    meusDecks[fase].push({ frente, verso, dica });
    
    localStorage.setItem(userKey + 'decks', JSON.stringify(meusDecks));

    document.getElementById('nova-frente').value = '';
    document.getElementById('nova-verso').value = '';
    document.getElementById('nova-dica').value = '';
    fecharModal('modalCriacao');
    alert("[ SUCESSO ]\nDado salvo no banco da disciplina!");
}

function mostrarProgresso() {
    let totalCartas = 0;
    for (const cartas of Object.values(meusDecks)) { totalCartas += cartas.length; }
    const conteudo = `
        <div class="stat-box highlight">Nível Acadêmico <span class="tech-font">${xpTotal} XP</span></div>
        <div class="stat-box highlight" style="border-color: #ffd700; background-color: rgba(255, 215, 0, 0.05);">Coins <span class="tech-font">🪙 ${coinsTotal}</span></div>
        <div class="stat-box">Cartas no Sistema <span class="tech-font">${totalCartas}</span></div>
    `;
    document.getElementById('progresso-body').innerHTML = conteudo;
    abrirModal('modalProgresso');
}

function resetarProgresso() {
    const certeza = confirm(`[ AVISO CRÍTICO DE SISTEMA ]\n\nUsuário logado: ${nomeSalvo}\nAção solicitada: Formatação de Save Data\n\nIsso apagará permanentemente TODO o seu histórico de XP, Coins e permissões.\n\nTem certeza absoluta?`);
    if (certeza) {
        localStorage.removeItem(userKey + 'xp');
        localStorage.removeItem(userKey + 'coins');
        localStorage.removeItem(userKey + 'nivelado');
        localStorage.removeItem(userKey + 'desbloqueadas');
        localStorage.removeItem(userKey + 'bonus_unlocked');
        localStorage.removeItem(userKey + 'decks');
        localStorage.removeItem(userKey + 'rank');
        localStorage.removeItem(userKey + 'srs'); 
        
        window.location.href = '../login/login.html'; 
    }
}

function deslogar() {
    if (confirm("[ SISTEMA ]\nDeseja encerrar a sessão atual (Logout)?")) {
        localStorage.removeItem('quest_user_name');
        window.location.href = '../login/login.html'; 
    }
}

window.onload = verificarNivelamento;

// ==========================================
// 6. EFEITO SCROLL: BOTÃO VOLTAR AO TOPO
// ==========================================
window.addEventListener('scroll', function() {
    const btnTopo = document.getElementById('btn-voltar-topo');
    const rightPanel = document.getElementById('right-panel');
    const isMobilePlaying = window.innerWidth <= 600 && rightPanel.classList.contains('active');

    if (window.scrollY > 300 && !isMobilePlaying) {
        btnTopo.style.display = 'flex';
    } else {
        btnTopo.style.display = 'none';
    }
});

document.querySelectorAll('.aula-item').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 600) {
            document.getElementById('btn-voltar-topo').style.display = 'none';
        }
    });
});

// ==========================================
// 7. ACESSIBILIDADE (ZOOM E ALTO CONTRASTE)
// ==========================================
let currentZoom = parseInt(localStorage.getItem('quest_zoom')) || 100;
document.documentElement.style.fontSize = currentZoom + '%';

function mudarZoom(direcao) {
    if (direcao > 0 && currentZoom < 150) {
        currentZoom += 10; 
    } else if (direcao < 0 && currentZoom > 80) {
        currentZoom -= 10; 
    }
    
    document.documentElement.style.fontSize = currentZoom + '%';
    localStorage.setItem('quest_zoom', currentZoom);
}

let isHighContrast = localStorage.getItem('quest_high_contrast') === 'true';
if (isHighContrast) {
    document.body.classList.add('high-contrast-mode');
}

function toggleAltoContraste() {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('high-contrast-mode', isHighContrast);
    localStorage.setItem('quest_high_contrast', isHighContrast);
}

function toggleA11yMenu() {
    const widget = document.getElementById('a11y-widget');
    widget.classList.toggle('open');
}

function emDesenvolvimento(event) {
    event.preventDefault(); 
    alert("[ SISTEMA ]\n\nMódulo em desenvolvimento.\nEsta funcionalidade será liberada nas próximas atualizações!");
}

// ==========================================
// 8. MOTOR GRÁFICO: MAPA NEURAL (PERSISTÊNCIA E FÍSICA)
// ==========================================
let graphScale = 1;
let graphPanX = 0;
let graphPanY = 0;
let animationFrameId; 

function abrirMapaMental() {
    abrirModal('modalMapaMental');
    
    const modalContainer = document.getElementById('mapa-mental-body');
    const graphCanvas = document.getElementById('obsidian-canvas');
    graphCanvas.innerHTML = ''; 

    // ---------------------------------------------------------
    // 0. CARREGAR SAVE DATA DO MAPA (Local Storage)
    // ---------------------------------------------------------
    const mapSaveKey = userKey + 'map_state';
    const savedState = JSON.parse(localStorage.getItem(mapSaveKey)) || { nodes: {}, camera: null };
    
    // Restaurar a câmara ou centralizar se for a primeira vez
    if (savedState.camera) {
        graphScale = savedState.camera.scale;
        graphPanX = savedState.camera.panX;
        graphPanY = savedState.camera.panY;
    } else {
        graphScale = 1;
        graphPanX = (modalContainer.clientWidth / 2) - 2000;
        graphPanY = (modalContainer.clientHeight / 2) - 2000;
    }
    atualizarCamera();

    const dictNodes = {}; 
    const listEdges = [];  

    // ---------------------------------------------------------
    // A. GERAR DADOS (Lendo do Save ou Gerando Novos)
    // ---------------------------------------------------------

    // 1. Nó Central (Cérebro)
    let cx = 2000, cy = 2000;
    if (savedState.nodes['central']) {
        cx = savedState.nodes['central'].x;
        cy = savedState.nodes['central'].y;
    }

    const centralNodeData = { 
        id: 'central', x: cx, y: cy, 
        label: `Cérebro: ${nomeSalvo}`, color: 'var(--alura-purple)', 
        size: 45, isCard: false 
    };
    const centralElement = criarNoVisual(centralNodeData);
    graphCanvas.appendChild(centralElement);
    centralNodeData.domElement = centralElement;
    dictNodes['central'] = centralNodeData; 

    // 2. Mapear Fases e Módulos
    const totalFases = ordemFases.length;
    ordemFases.forEach((faseId, index) => {
        const cartasDaFase = meusDecks[faseId] || [];
        const isFaseDesbloqueada = fasesDesbloqueadas.includes(faseId);
        
        let nodeX, nodeY, offX, offY;
        
        // Se a fase já tiver uma posição guardada, carrega. Senão, gera uma nova.
        if (savedState.nodes[faseId]) {
            nodeX = savedState.nodes[faseId].x;
            nodeY = savedState.nodes[faseId].y;
            offX = savedState.nodes[faseId].offsetX;
            offY = savedState.nodes[faseId].offsetY;
        } else {
            const angle = (index / totalFases) * Math.PI * 2;
            const distance = Math.random() * 250 + 350; 
            nodeX = cx + Math.cos(angle) * distance;
            nodeY = cy + Math.sin(angle) * distance;
            offX = nodeX - cx;
            offY = nodeY - cy;
        }

        let cartasFinalizadas = [];
        if (isFaseDesbloqueada) {
            cartasFinalizadas = cartasDaFase.filter(carta => {
                const infoAnki = srsData[carta.frente];
                return infoAnki && infoAnki.rep > 0; 
            });
        }

        const faseColor = isFaseDesbloqueada ? 'var(--alura-cyan)' : '#30363d';
        const faseSize = isFaseDesbloqueada ? 25 + (cartasFinalizadas.length * 0.5) : 15; 

        const faseNodeData = { 
            id: faseId, x: nodeX, y: nodeY, 
            label: faseId.toUpperCase(), color: faseColor, size: faseSize, 
            isCard: false, parentId: 'central', offsetX: offX, offsetY: offY 
        };
        const faseElement = criarNoVisual(faseNodeData);
        graphCanvas.appendChild(faseElement);
        faseNodeData.domElement = faseElement;
        dictNodes[faseId] = faseNodeData;

        listEdges.push({ fromId: 'central', toId: faseId, opacity: isFaseDesbloqueada ? 0.3 : 0.05 });

        // Gerar os Flashcards (Sinapses Flutuantes)
        if (isFaseDesbloqueada && cartasFinalizadas.length > 0) {
            const limiteCartasVisuais = Math.min(cartasFinalizadas.length, 30); 
            for(let i = 0; i < limiteCartasVisuais; i++) {
                const cardId = `${faseId}_card_${i}`;
                let cardX, cardY, cardOffX, cardOffY;

                // Carrega do save ou gera nova constelação em volta da fase
                if (savedState.nodes[cardId]) {
                    cardX = savedState.nodes[cardId].x;
                    cardY = savedState.nodes[cardId].y;
                    cardOffX = savedState.nodes[cardId].offsetX;
                    cardOffY = savedState.nodes[cardId].offsetY;
                } else {
                    const baseAngle = (i / limiteCartasVisuais) * Math.PI * 2;
                    const cardAngle = baseAngle + (Math.random() * 0.3 - 0.15); 
                    const cardDistance = Math.random() * 80 + 120; 
                    cardX = nodeX + Math.cos(cardAngle) * cardDistance;
                    cardY = nodeY + Math.sin(cardAngle) * cardDistance;
                    cardOffX = cardX - nodeX;
                    cardOffY = cardY - nodeY;
                }

                const cardColor = Math.random() > 0.5 ? 'var(--alura-green)' : 'var(--alura-blue)';
                
                const cardNodeData = { 
                    id: cardId, x: cardX, y: cardY, 
                    label: '', color: cardColor, size: 10, 
                    isCard: true, cardData: cartasFinalizadas[i],
                    parentId: faseId, offsetX: cardOffX, offsetY: cardOffY
                };
                const cardElement = criarNoVisual(cardNodeData);
                graphCanvas.appendChild(cardElement);
                cardNodeData.domElement = cardElement;
                dictNodes[cardId] = cardNodeData;

                listEdges.push({ fromId: faseId, toId: cardId, opacity: 0.15 });
            }
        }
    });

    // 3. RENDERIZAR AS LINHAS (EDGES) DOM
    listEdges.forEach(edge => {
        const lineElement = document.createElement('div');
        lineElement.className = 'obsidian-edge';
        lineElement.style.backgroundColor = `rgba(139, 146, 165, ${edge.opacity})`;
        graphCanvas.appendChild(lineElement);
        edge.domElement = lineElement; 
    });

    function recalcularTeiaNeural() {
        listEdges.forEach(edge => {
            const sourceNode = dictNodes[edge.fromId];
            const targetNode = dictNodes[edge.toId];
            if(sourceNode && targetNode) {
                const deltaX = targetNode.x - sourceNode.x;
                const deltaY = targetNode.y - sourceNode.y;
                const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const angleInDegrees = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

                edge.domElement.style.width = `${lineLength}px`;
                edge.domElement.style.left = `${sourceNode.x}px`;
                edge.domElement.style.top = `${sourceNode.y}px`;
                edge.domElement.style.transform = `rotate(${angleInDegrees}deg)`;
            }
        });
    }
    recalcularTeiaNeural(); 

    // Salvar o estado inicial para garantir que novos nós sejam guardados
    salvarEstadoMapa();

    // ---------------------------------------------------------
    // B. FUNÇÃO DE SALVAMENTO (SAVE STATE)
    // ---------------------------------------------------------
    function salvarEstadoMapa() {
        const estadoAtual = { 
            camera: { scale: graphScale, panX: graphPanX, panY: graphPanY },
            nodes: {} 
        };
        
        Object.values(dictNodes).forEach(n => {
            estadoAtual.nodes[n.id] = { 
                x: n.x, y: n.y, 
                offsetX: n.offsetX || 0, offsetY: n.offsetY || 0 
            };
        });
        
        localStorage.setItem(mapSaveKey, JSON.stringify(estadoAtual));
    }

    // ---------------------------------------------------------
    // C. COMPONENTES VISUAIS E INTERAÇÕES
    // ---------------------------------------------------------
    let draggedNode = null; 

    function criarNoVisual(nodeData) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'obsidian-node';
        nodeElement.style.width = `${nodeData.size}px`;
        nodeElement.style.height = `${nodeData.size}px`;
        nodeElement.style.backgroundColor = nodeData.color;
        nodeElement.style.boxShadow = `0 0 ${nodeData.size * 1.5}px ${nodeData.color}`;
        nodeElement.style.left = `${nodeData.x}px`;
        nodeElement.style.top = `${nodeData.y}px`;

        if(nodeData.label) {
            const labelElement = document.createElement('span');
            labelElement.className = 'label tech-font';
            labelElement.innerText = nodeData.label;
            nodeElement.appendChild(labelElement);
        }

        // Pulsar
        nodeElement.addEventListener('mousedown', () => {
            const rippleElement = document.createElement('div');
            rippleElement.className = 'neural-pulse';
            rippleElement.style.width = `${nodeData.size * 2}px`;
            rippleElement.style.height = `${nodeData.size * 2}px`;
            rippleElement.style.left = `${nodeData.x}px`;
            rippleElement.style.top = `${nodeData.y}px`;
            rippleElement.style.borderColor = nodeData.color;
            graphCanvas.appendChild(rippleElement);
            setTimeout(() => rippleElement.remove(), 800);
        });

        // Ler Flashcard (Corrigido para evitar conflitos de CSS global)
        if (nodeData.isCard) {
            nodeElement.addEventListener('click', (event) => {
                event.stopPropagation(); 
                document.querySelectorAll('.mini-flashcard').forEach(el => el.remove()); 
                
                const flashcardArticle = document.createElement('article');
                flashcardArticle.className = 'mini-flashcard';
                flashcardArticle.style.left = `${nodeData.x + (nodeData.size / 2) + 10}px`;
                flashcardArticle.style.top = `${nodeData.y - 40}px`;
                
                flashcardArticle.innerHTML = `
                    <div><h4>${nodeData.id.split('_')[0].toUpperCase()}</h4></div>
                    <div>
                        <p><strong>P:</strong> ${nodeData.cardData.frente}</p>
                        <hr style="border: 1px dashed #30363d; margin: 8px 0;">
                        <p style="color: var(--alura-green);"><strong>R:</strong> ${nodeData.cardData.verso}</p>
                    </div>
                `;
                graphCanvas.appendChild(flashcardArticle);
            });
        }

        // Arrastar Nó
        nodeElement.addEventListener('mousedown', (event) => {
            event.stopPropagation(); 
            draggedNode = nodeData;
            nodeElement.style.cursor = 'grabbing';
            modalContainer.style.cursor = 'default'; 
        });

        return nodeElement;
    }

    // ---------------------------------------------------------
    // D. O NOVO MOTOR FÍSICO (SPRING PHYSICS / ELÁSTICO)
    // ---------------------------------------------------------
    function renderPhysicsLoop() {
        let needsUpdate = false;

        Object.values(dictNodes).forEach(node => {
            if (node.parentId && draggedNode !== node) {
                const parent = dictNodes[node.parentId];
                if (parent) {
                    const targetX = parent.x + node.offsetX;
                    const targetY = parent.y + node.offsetY;

                    const dx = targetX - node.x;
                    const dy = targetY - node.y;

                    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
                        node.x += dx * 0.15; 
                        node.y += dy * 0.15;

                        node.domElement.style.left = `${node.x}px`;
                        node.domElement.style.top = `${node.y}px`;
                        needsUpdate = true;
                    }
                }
            }
        });

        if (needsUpdate) recalcularTeiaNeural();
        animationFrameId = requestAnimationFrame(renderPhysicsLoop);
    }
    renderPhysicsLoop(); 

    // Desligar física ao fechar o modal
    const closeBtn = document.querySelector('#modalMapaMental .btn-close');
    if(closeBtn) {
        closeBtn.onclick = () => {
            cancelAnimationFrame(animationFrameId); 
            fecharModal('modalMapaMental');
        };
    }

    // ---------------------------------------------------------
    // E. PAN & ZOOM E SALVAMENTO DE EVENTOS GLOBAIS
    // ---------------------------------------------------------
    let isPanningCamera = false;

    modalContainer.oncontextmenu = null; 
    modalContainer.onmousedown = null; 
    window.onmousemove = null; 
    window.onmouseup = null; 
    modalContainer.onwheel = null;

    modalContainer.addEventListener('contextmenu', (event) => { event.preventDefault(); });

    modalContainer.addEventListener('mousedown', (event) => {
        if (event.target.classList.contains('obsidian-node')) return; 
        isPanningCamera = true;
        modalContainer.style.cursor = 'grabbing';
        document.querySelectorAll('.mini-flashcard').forEach(card => card.remove()); 
    });

    window.addEventListener('mousemove', (event) => {
        if (draggedNode) {
            event.preventDefault();
            draggedNode.x += event.movementX / graphScale;
            draggedNode.y += event.movementY / graphScale;
            draggedNode.domElement.style.left = `${draggedNode.x}px`;
            draggedNode.domElement.style.top = `${draggedNode.y}px`;
            recalcularTeiaNeural();
            return;
        }

        if (isPanningCamera) {
            graphPanX += event.movementX;
            graphPanY += event.movementY;
            atualizarCamera();
        }
    });

    window.addEventListener('mouseup', () => {
        if (draggedNode) {
            // Recalcula a nova órbita para a mola elástica funcionar a partir de agora
            if (draggedNode.parentId) {
                const parent = dictNodes[draggedNode.parentId];
                if (parent) {
                    draggedNode.offsetX = draggedNode.x - parent.x;
                    draggedNode.offsetY = draggedNode.y - parent.y;
                }
            }
            draggedNode.domElement.style.cursor = 'grab';
            draggedNode = null;
            salvarEstadoMapa(); // Salva a nova posição da bolinha
        }

        if (isPanningCamera) {
            isPanningCamera = false;
            salvarEstadoMapa(); // Salva a nova posição da câmara
        }
        
        modalContainer.style.cursor = 'grab';
    });

    function aplicarZoom(deltaZoom, originX, originY) {
        const targetX = (originX - graphPanX) / graphScale;
        const targetY = (originY - graphPanY) / graphScale;

        let newScale = graphScale + deltaZoom;
        if (newScale < 0.2) newScale = 0.2; 
        if (newScale > 3.0) newScale = 3.0; 

        graphPanX = originX - (targetX * newScale);
        graphPanY = originY - (targetY * newScale);

        graphScale = newScale;
        atualizarCamera();
        salvarEstadoMapa(); // Salva o novo zoom da câmara
    }

    modalContainer.addEventListener('wheel', (event) => {
        event.preventDefault();
        const rect = modalContainer.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const zoomDelta = event.deltaY * -0.0015; 
        aplicarZoom(zoomDelta, mouseX, mouseY);
    });

    const btnZoomIn = document.getElementById('btn-zoom-in-map');
    const btnZoomOut = document.getElementById('btn-zoom-out-map');

    if(btnZoomIn) {
        btnZoomIn.onclick = () => {
            const rect = modalContainer.getBoundingClientRect();
            aplicarZoom(0.3, rect.width / 2, rect.height / 2);
        };
    }

    if(btnZoomOut) {
        btnZoomOut.onclick = () => {
            const rect = modalContainer.getBoundingClientRect();
            aplicarZoom(-0.3, rect.width / 2, rect.height / 2);
        };
    }

    function atualizarCamera() {
        graphCanvas.style.transform = `translate(${graphPanX}px, ${graphPanY}px) scale(${graphScale})`;
    }
}