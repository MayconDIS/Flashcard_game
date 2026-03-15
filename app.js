// js/app.js

// ==========================================
// 1. INICIALIZAÇÃO MULTI-USUÁRIO (SAVE SLOTS)
// ==========================================
const nomeSalvo = localStorage.getItem('quest_user_name') || 'Desenvolvedor';

const headerUserName = document.getElementById('header-user-name') || document.getElementById('header-user-name-title');
if (headerUserName) {
    headerUserName.innerText = nomeSalvo;
}

const menuUserName = document.getElementById('menu-user-name');
if (menuUserName) {
    menuUserName.innerText = nomeSalvo;
}

const userKey = `quest_${nomeSalvo}_`;

let rankSalvo = localStorage.getItem(userKey + 'rank') || 'Rank: Pendente';
document.getElementById('menu-user-level').innerText = rankSalvo;

let xpTotal = parseInt(localStorage.getItem(userKey + 'xp')) || 0;
let coinsTotal = parseInt(localStorage.getItem(userKey + 'coins')) || 0;

document.getElementById('xp-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">military_tech</span> ${xpTotal} XP`;
document.getElementById('coin-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">toll</span> ${coinsTotal}`;

let meusDecks = JSON.parse(localStorage.getItem(userKey + 'decks')) || JSON.parse(JSON.stringify(bancoDeDados));

// ==========================================
// 2. SISTEMA DE DESBLOQUEIO E LOJA BÔNUS
// ==========================================
const ordemFases = [];
for (let i = 1; i <= 22; i++) { 
    ordemFases.push('fase' + i); 
}

let fasesDesbloqueadas = JSON.parse(localStorage.getItem(userKey + 'desbloqueadas')) || ['fase1'];
let bonusDesbloqueados = JSON.parse(localStorage.getItem(userKey + 'bonus_unlocked')) || [];

function atualizarFasesVisuais() {
    ordemFases.forEach(fase => {
        const elementoFase = document.getElementById('menu-' + fase);
        if (!elementoFase) return;

        if (fasesDesbloqueadas.includes(fase)) {
            elementoFase.classList.remove('aula-locked-item');
            const icon = elementoFase.querySelector('.icon-status');
            if (icon && icon.innerText === 'lock') {
                icon.innerText = 'check_circle';
            }
        } else {
            elementoFase.classList.add('aula-locked-item');
            const icon = elementoFase.querySelector('.icon-status');
            if (icon) {
                icon.innerText = 'lock';
            }
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
        if (!fasesDesbloqueadas.includes(bonusId)) {
            fasesDesbloqueadas.push(bonusId);
        }
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
            
            if (!fasesDesbloqueadas.includes(bonusId)) {
                fasesDesbloqueadas.push(bonusId);
            }
            carregarAula(bonusId, nomeAula, elementoClicado);
        } else {
            alert(`[ ACESSO NEGADO ]\nSaldo insuficiente.\nVocê possui ${coinsTotal} Coins, mas precisa de ${custo}.`);
        }
    }
}

// ==========================================
// 3. SISTEMA DE NIVELAMENTO ENADE E RANKS
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
    if (!jaNivelou) {
        document.getElementById('modalNivelamento').classList.add('show');
    } else {
        atualizarFasesVisuais(); 
    }
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

function iniciarQuizNivelamento() { 
    renderizarPerguntaNivelamento(); 
}

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
// 4. MOTOR FLASHCARDS E MÚLTIPLA ESCOLHA
// ==========================================
let deckAtual = [];
let deckRevisao = []; 
let indiceCarta = 0;
let faseAtualId = ''; 

// Reseta os botões de controle para o padrão dos Flashcards
function resetarBotoesJogo() {
    document.getElementById('botoes-jogo').innerHTML = `
        <button class="btn-jogo btn-erro tech-font flex-align-center" onclick="processarResposta('errei')">
            <span class="material-symbols-outlined" style="margin-right:5px;">close</span> ERRO
        </button>
        <button class="btn-jogo btn-acerto tech-font flex-align-center" onclick="processarResposta('acertei')">
            <span class="material-symbols-outlined" style="margin-right:5px;">check</span> SUCESSO
        </button>
    `;
}

function carregarAula(faseId, nomeAula, elementoClicado) {
    if (!fasesDesbloqueadas.includes(faseId)) {
        alert("[ SISTEMA ]\n\nDisciplina bloqueada. Conclua as permissões anteriores!");
        return;
    }

    const rightPanel = document.getElementById('right-panel');
    const leftPanel = document.querySelector('.left-panel'); 

    // Quando o usuário CLICA PARA FECHAR uma aula que já está aberta
    if (elementoClicado.classList.contains('active-lesson')) {
        elementoClicado.classList.remove('active-lesson');
        leftPanel.classList.remove('focus-mode'); 
        
        // MÁGICA AQUI: Força a tela a manter o foco no elemento que acabou de fechar!
        elementoClicado.scrollIntoView({ block: 'center' });

        setTimeout(() => { leftPanel.classList.remove('fade-out-others'); }, 50);
        document.querySelectorAll('.dia-header').forEach(el => el.classList.remove('active-header'));
        rightPanel.classList.remove('active'); 
        setTimeout(() => { rightPanel.style.display = 'none'; }, 1000); 
        return; 
    }

    document.getElementById('botoes-jogo').style.display = 'flex';
    document.getElementById('botao-proxima').style.display = 'none';

    faseAtualId = faseId;
    deckAtual = [...(meusDecks[faseId] || [])]; 
    deckRevisao = []; 
    indiceCarta = 0;
    
    mostrarCartaAtual();
}

function mostrarCartaAtual() {
    const cardInner = document.getElementById('meuCard');
    cardInner.classList.remove('flipped'); 
    resetarBotoesJogo(); // Garante que os botões padrão voltem

    const carta = deckAtual[indiceCarta];
    if (!carta) return; 

    const frenteEl = document.getElementById('texto-frente');
    const versoEl = document.getElementById('texto-verso');

    // ==========================================
    // MODO ENADE (Múltipla Escolha)
    // ==========================================
    if (carta.opcoes) {
        frenteEl.style.textAlign = 'left';
        versoEl.style.textAlign = 'left';
        
        let htmlOpcoes = carta.opcoes.map((op, idx) => 
            `<button class="btn-opcao" onclick="verificarEnade(${idx}, ${carta.correta})">${op}</button>`
        ).join('');

        // FRENTE: Mostra a Questão e os Botões
        frenteEl.innerHTML = `
            <div style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">${carta.frente}</div>
            <div class="opcoes-container">${htmlOpcoes}</div>
        `;
        
        // VERSO (A MÁGICA AQUI): Injeta a Questão no topo do Verso com uma linha divisória
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
        document.getElementById('contador-cartas').innerText = `Item ${indiceCarta + 1}/${deckAtual.length}`;
        
        document.getElementById('botoes-jogo').style.display = 'none';
    } 
    // ==========================================
    // MODO FLASHCARD NORMAL (Módulos 1 ao 4)
    // ==========================================
    else {
        frenteEl.style.fontSize = '1.5rem';
        frenteEl.style.textAlign = 'center';
        
        // FRENTE: Apenas a Pergunta
        frenteEl.innerHTML = carta.frente;

        // VERSO (A MÁGICA AQUI): Injeta a Pergunta no topo com linha divisória
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
        document.getElementById('contador-cartas').innerText = `Item ${indiceCarta + 1}/${deckAtual.length}`;
        
        document.getElementById('botoes-jogo').style.display = 'flex';
    }
}

function virarCarta() {
    const isEnade = deckAtual[indiceCarta] && deckAtual[indiceCarta].opcoes;

    if (isEnade) {
        // Verifica se a questão já foi respondida (olhando se os botões estão desativados)
        const primeiraOpcao = document.querySelector('.btn-opcao');
        const jaRespondido = primeiraOpcao ? primeiraOpcao.disabled : false;

        // Se for ENADE e AINDA NÃO respondeu, bloqueia o giro (não pode espiar a resposta!)
        if (!jaRespondido) return;
    }

    if (deckAtual.length > 0 && indiceCarta < deckAtual.length) {
        document.getElementById('meuCard').classList.toggle('flipped');
    }
}

document.addEventListener('keydown', function(e) {
    const isPlaying = document.getElementById('right-panel').classList.contains('active');
    if (!isPlaying) return;

    const isEnade = deckAtual[indiceCarta] && deckAtual[indiceCarta].opcoes;
    let jaRespondido = false;
    
    if (isEnade) {
        const primeiraOpcao = document.querySelector('.btn-opcao');
        jaRespondido = primeiraOpcao ? primeiraOpcao.disabled : false;
    }

    if (e.code === 'Space') {
        e.preventDefault();
        
        // Se for ENADE e ainda não respondeu, a barra de espaço não faz nada
        if (isEnade && !jaRespondido) return;
        
        const card = document.getElementById('meuCard');
        
        // Permite virar se já respondeu o ENADE ou se for um flashcard normal (frente)
        if (jaRespondido || (!card.classList.contains('flipped') && document.getElementById('botoes-jogo').style.display !== 'none')) {
            virarCarta();
        }
    } else if (e.code === 'ArrowRight' || e.key === 'd') {
        if (isEnade) return; // No ENADE, obriga o aluno a clicar no botão "CONTINUAR" na tela
        if (document.getElementById('meuCard').classList.contains('flipped')) processarResposta('acertei');
    } else if (e.code === 'ArrowLeft' || e.key === 'a') {
        if (isEnade) return; // No ENADE, obriga o aluno a clicar no botão "CONTINUAR" na tela
        if (document.getElementById('meuCard').classList.contains('flipped')) processarResposta('errei');
    }
});

// NOVA FUNÇÃO: Animação de estrelas
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

// NOVA FUNÇÃO: Lógica de responder o ENADE
function verificarEnade(escolhida, correta) {
    const botoes = document.querySelectorAll('.btn-opcao');
    // Bloqueia todos os botões para não clicar de novo
    botoes.forEach(b => b.disabled = true);

    if (escolhida === correta) {
        botoes[escolhida].classList.add('opcao-correta');
        soltarEstrelas(botoes[escolhida]);
        
        // Espera as estrelinhas e vira a carta
        setTimeout(() => {
            document.getElementById('meuCard').classList.add('flipped');
            document.getElementById('botoes-jogo').innerHTML = `<button class="btn-jogo btn-acerto tech-font flex-align-center" style="width:100%" onclick="processarResposta('acertei')">CONTINUAR</button>`;
            document.getElementById('botoes-jogo').style.display = 'flex';
        }, 1200);

    } else {
        botoes[escolhida].classList.add('opcao-errada');
        botoes[correta].classList.add('opcao-correta'); // Mostra qual era a certa
        
        setTimeout(() => {
            document.getElementById('meuCard').classList.add('flipped');
            document.getElementById('botoes-jogo').innerHTML = `<button class="btn-jogo btn-erro tech-font flex-align-center" style="width:100%" onclick="processarResposta('errei')">CONTINUAR (ERROU)</button>`;
            document.getElementById('botoes-jogo').style.display = 'flex';
        }, 1200);
    }
}

function processarResposta(resultado) {
    if (deckAtual.length === 0 || indiceCarta >= deckAtual.length) return;
    
    if (resultado === 'errei') { 
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
                document.getElementById('dica-frente').innerText = "🔄 Reprocessando os erros...";
            } else {
                finalizarDeck();
            }
        } else {
            mostrarCartaAtual();
        }
    }, 300); 
}

document.addEventListener('keydown', function(e) {
    const isPlaying = document.getElementById('right-panel').classList.contains('active');
    if (!isPlaying) return;

    const isEnade = deckAtual[indiceCarta] && deckAtual[indiceCarta].opcoes;
    if (isEnade) return; // Desativa os atalhos de teclado no modo ENADE

    if (e.code === 'Space') {
        e.preventDefault();
        const card = document.getElementById('meuCard');
        if (!card.classList.contains('flipped') && document.getElementById('botoes-jogo').style.display !== 'none') {
            virarCarta();
        }
    } else if (e.code === 'ArrowRight' || e.key === 'd') {
        if (document.getElementById('meuCard').classList.contains('flipped')) {
            processarResposta('acertei');
        }
    } else if (e.code === 'ArrowLeft' || e.key === 'a') {
        if (document.getElementById('meuCard').classList.contains('flipped')) {
            processarResposta('errei');
        }
    }
});

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
        // ATUALIZAÇÃO DOS 70 COINS AQUI:
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
function toggleMenu() { 
    document.getElementById('dropdownMenu').classList.toggle('show'); 
}

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
    if (menu) {
        menu.classList.remove('show'); 
    }
}

function fecharModal(idModal) { 
    document.getElementById(idModal).classList.remove('show'); 
}

function salvarFlashcard() {
    const fase = document.getElementById('nova-fase').value.trim().toLowerCase();
    const frente = document.getElementById('nova-frente').value.trim();
    const verso = document.getElementById('nova-verso').value.trim();
    const dica = document.getElementById('nova-dica').value.trim();

    if (!fase || !frente || !verso) { 
        alert("[ AVISO ]\nPor favor, preencha Frente e Verso!"); 
        return; 
    }

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
    for (const cartas of Object.values(meusDecks)) { 
        totalCartas += cartas.length; 
    }
    const conteudo = `
        <div class="stat-box highlight">Nível Acadêmico <span class="tech-font">${xpTotal} XP</span></div>
        <div class="stat-box highlight" style="border-color: #ffd700; background-color: rgba(255, 215, 0, 0.05);">Coins <span class="tech-font">🪙 ${coinsTotal}</span></div>
        <div class="stat-box">Cartas no Sistema <span class="tech-font">${totalCartas}</span></div>
    `;
    document.getElementById('progresso-body').innerHTML = conteudo;
    abrirModal('modalProgresso');
}

function resetarProgresso() {
    const certeza = confirm(`[ AVISO CRÍTICO DE SISTEMA ]\n\nUsuário logado: ${nomeSalvo}\nAção solicitada: Formatação de Save Data\n\nIsso apagará permanentemente TODO o seu histórico de XP, Coins e permissões de acesso às fases.\n\nTem certeza absoluta que deseja prosseguir com a exclusão?`);
    if (certeza) {
        localStorage.removeItem(userKey + 'xp');
        localStorage.removeItem(userKey + 'coins');
        localStorage.removeItem(userKey + 'nivelado');
        localStorage.removeItem(userKey + 'desbloqueadas');
        localStorage.removeItem(userKey + 'bonus_unlocked');
        localStorage.removeItem(userKey + 'decks');
        localStorage.removeItem(userKey + 'rank');
        
        window.location.href = 'login.html'; 
    }
}

function deslogar() {
    if (confirm("[ SISTEMA ]\nDeseja encerrar a sessão atual (Logout)?")) {
        localStorage.removeItem('quest_user_name');
        window.location.href = 'login.html'; 
    }
}

window.onload = verificarNivelamento;

// ==========================================
// 6. EFEITO SCROLL: BOTÃO VOLTAR AO TOPO
// ==========================================
window.addEventListener('scroll', function() {
    const btnTopo = document.getElementById('btn-voltar-topo');
    if (window.scrollY > 300) {
        btnTopo.style.display = 'flex';
    } else {
        btnTopo.style.display = 'none';
    }
});