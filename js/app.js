// js/app.js

// ==========================================
// 1. INICIALIZAÇÃO, DADOS E NOMES
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
// 2. SISTEMA DE DESBLOQUEIO E LOJA BÔNUS
// ==========================================
const ordemFases = [];
for (let i = 1; i <= 20; i++) { ordemFases.push('fase' + i); }

let fasesDesbloqueadas = JSON.parse(localStorage.getItem('quest_desbloqueadas')) || ['fase1'];
let bonusDesbloqueados = JSON.parse(localStorage.getItem('quest_bonus_unlocked')) || [];

function atualizarFasesVisuais() {
    // Atualiza as fases normais
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
    
    // Atualiza as fases bônus (Loja)
    const listaBonus = ['bonus1', 'bonus2', 'bonus3', 'bonus4'];
    listaBonus.forEach(bonusId => {
        const item = document.getElementById('menu-' + bonusId);
        const icon = document.getElementById('icon-' + bonusId);
        const price = document.getElementById('price-' + bonusId);
        
        if (item && bonusDesbloqueados.includes(bonusId)) {
            if (icon) icon.innerText = '▶';
            if (price) {
                price.innerText = '🪙';
                price.style.borderColor = 'var(--alura-green)';
                price.style.background = 'rgba(0, 255, 136, 0.05)';
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

    const confirmar = confirm(`🔒 CONTEÚDO BÔNUS\n\nDeseja desbloquear "${nomeAula}" por 🪙 ${custo} Coins?\n\nSeu saldo atual: 🪙 ${coinsTotal}`);

    if (confirmar) {
        if (coinsTotal >= custo) {
            coinsTotal -= custo;
            bonusDesbloqueados.push(bonusId);
            
            localStorage.setItem('quest_coins', coinsTotal);
            localStorage.setItem('quest_bonus_unlocked', JSON.stringify(bonusDesbloqueados));
            
            document.getElementById('coin-display').innerText = `🪙 ${coinsTotal}`;
            atualizarFasesVisuais();
            
            alert(`🎉 Compra realizada com sucesso!\nA fase bônus "${nomeAula}" agora é sua para sempre.`);
            
            if (!fasesDesbloqueadas.includes(bonusId)) fasesDesbloqueadas.push(bonusId);
            carregarAula(bonusId, nomeAula, elementoClicado);
        } else {
            alert(`🚫 Saldo Insuficiente!\nVocê precisa de 🪙 ${custo} Coins, mas tem apenas 🪙 ${coinsTotal}.\n\nContinue estudando as disciplinas normais para ganhar moedas!`);
        }
    }
}

// ==========================================
// 3. SISTEMA DE NIVELAMENTO DO CURSO DE ADS
// ==========================================
const quizPerguntas = [
    { p: "1. Mód 01: O que é um 'Dicionário' em Python?", r: ["Uma lista de sites.", "Estrutura baseada em 'Chave: Valor'.", "Um comando de loop."], certa: 1 },
    { p: "2. Mód 01: Qual dado é considerado 'Sensível' pela LGPD?", r: ["E-mail corporativo.", "Endereço de IP.", "Dados sobre raça, biometria e religião."], certa: 2 },
    { p: "3. Mód 02: O que é a estrutura de dados LIFO (Pilha)?", r: ["O primeiro a entrar é o primeiro a sair.", "O último a entrar é o primeiro a sair.", "Organização aleatória."], certa: 1 },
    { p: "4. Mód 02: Qual a principal diferença entre TCP e UDP em Redes?", r: ["TCP é para jogos, UDP para arquivos.", "TCP é com fio, UDP é WiFi.", "TCP garante a entrega, UDP prioriza velocidade."], certa: 2 },
    { p: "5. Mód 03: Em Banco de Dados, o que é a Chave Primária (PK)?", r: ["A senha do administrador.", "Um campo que identifica exclusivamente uma linha da tabela.", "O formato JSON do NoSQL."], certa: 1 },
    { p: "6. Mód 03: O que é Polimorfismo em Orientação a Objetos (C#)?", r: ["Métodos com múltiplas formas dependendo do objeto.", "Esconder o código do sistema.", "Tornar a classe invisível."], certa: 0 },
    { p: "7. Mód 03: Qual a regra de ouro do 'Mobile First' em UX/UI?", r: ["Programar primeiro para PC.", "Obrigar o uso de App Store.", "Desenhar o layout focando no celular primeiro."], certa: 2 },
    { p: "8. Mód 04: O que faz o framework Entity (EF Core) no .NET?", r: ["Renderiza as cores da tela.", "Mapeia os dados (ORM) para não usarmos SQL puro no código.", "Protege o app contra hackers."], certa: 1 },
    { p: "9. Mód 04: Qual a função do Docker em Cloud/DevOps?", r: ["Acelerar a internet local.", "Servir como roteador WiFi.", "Empacotar o app em contêineres isolados e padronizados."], certa: 2 },
    { p: "10. Mód 04: O que é o Ciclo de Vida de uma Activity no Mobile?", r: ["Criar, Pausar, Retomar e Destruir uma tela.", "O tempo que a bateria dura.", "O processo de compilar o Java."], certa: 0 }
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

function iniciarQuizNivelamento() { renderizarPerguntaNivelamento(); }

function renderizarPerguntaNivelamento() {
    const body = document.getElementById('nivelamento-body');
    const perguntaObj = quizPerguntas[questaoAtualNivelamento];
    
    let htmlRespostas = perguntaObj.r.map((resposta, index) => 
        `<button class="btn-action" style="width: 100%; margin-bottom: 10px; text-align: left;" onclick="responderNivelamento(${index})">${resposta}</button>`
    ).join('');

    body.innerHTML = `
        <h3 style="color: var(--alura-cyan); margin-bottom: 15px;">Questão de Nivelamento ${questaoAtualNivelamento + 1}/10</h3>
        <p style="color: #fff; font-size: 1.1rem; margin-bottom: 25px;">${perguntaObj.p}</p>
        ${htmlRespostas}
    `;
}

function responderNivelamento(indiceResposta) {
    if (indiceResposta === quizPerguntas[questaoAtualNivelamento].certa) acertosNivelamento++;
    questaoAtualNivelamento++;
    if (questaoAtualNivelamento < quizPerguntas.length) { renderizarPerguntaNivelamento(); } 
    else { finalizarNivelamento(); }
}

function finalizarNivelamento() {
    let nivelMsg = "";
    
    if (acertosNivelamento <= 3) {
        nivelMsg = `Você pontuou ${acertosNivelamento}/10. <br><br><b>Status: Ingressante.</b> Você começará do Módulo 01 para criar uma base sólida!`;
        fasesDesbloqueadas = ['fase1'];
    } else if (acertosNivelamento >= 4 && acertosNivelamento <= 7) {
        nivelMsg = `Você pontuou ${acertosNivelamento}/10. <br><br><b>Status: Aluno Intermediário.</b> Você dominou a base e os Módulos 01 e 02 estão abertos!`;
        fasesDesbloqueadas = ['fase1', 'fase2', 'fase3', 'fase4', 'fase5', 'fase6', 'fase7', 'fase8', 'fase9', 'fase10'];
    } else {
        nivelMsg = `Você pontuou ${acertosNivelamento}/10. <br><br><b>Status: Expert Universitário.</b> Conhecimento impecável! Todas as 20 disciplinas do curso foram desbloqueadas.`;
        fasesDesbloqueadas = [...ordemFases]; 
    }

    localStorage.setItem('quest_nivelado', 'true');
    localStorage.setItem('quest_desbloqueadas', JSON.stringify(fasesDesbloqueadas));
    localStorage.setItem('quest_xp', xpTotal);
    localStorage.setItem('quest_coins', coinsTotal);
    
    document.getElementById('xp-display').innerText = `${xpTotal} XP`;
    document.getElementById('coin-display').innerText = `🪙 ${coinsTotal}`;

    document.getElementById('nivelamento-body').innerHTML = `
        <h3 style="color: var(--alura-green); margin-bottom: 15px;">Avaliação Concluída!</h3>
        <p style="color: #c5c6c7; margin-bottom: 25px;">${nivelMsg}</p>
        <button class="btn-action btn-right" style="width: 100%;" onclick="fecharModal('modalNivelamento'); atualizarFasesVisuais();">Entrar no Campus</button>
    `;
}

// ==========================================
// 4. MECÂNICA DE FLASHCARDS E RECOMPENSAS
// ==========================================
let deckAtual = [];
let deckRevisao = []; 
let indiceCarta = 0;
let faseAtualId = ''; 

function carregarAula(faseId, nomeAula, elementoClicado) {
    if (!fasesDesbloqueadas.includes(faseId)) {
        alert("🔒 Disciplina bloqueada. Conclua os módulos anteriores!");
        return;
    }

    const rightPanel = document.getElementById('right-panel');
    const leftPanel = document.querySelector('.left-panel'); 

    // ==========================================
    // 1. LÓGICA DE FECHAR A AULA (Puxar e Aparecer)
    // ==========================================
    if (elementoClicado.classList.contains('active-lesson')) {
        
        elementoClicado.classList.remove('active-lesson');
        
        // 1. Tira o display:none para as fases voltarem a ocupar espaço físico
        leftPanel.classList.remove('focus-mode'); 
        
        // 2. Espera 50ms e manda as fases perderem a transparência suavemente enquanto sobem
        setTimeout(() => {
            leftPanel.classList.remove('fade-out-others');
        }, 50);

        document.querySelectorAll('.dia-header').forEach(el => el.classList.remove('active-header'));

        // Painel começa a encolher
        rightPanel.classList.remove('active'); 
        
        setTimeout(() => { 
            rightPanel.style.display = 'none'; 
        }, 1000); 
        
        return; 
    }

    // ==========================================
    // 2. LÓGICA DE ABRIR A AULA (Descer e Dissolver)
    // ==========================================
    document.querySelectorAll('.aula-item').forEach(el => el.classList.remove('active-lesson'));
    elementoClicado.classList.add('active-lesson');
    
    // MUDANÇA: Inicia o Fade Out! As outras fases começam a ficar transparentes
    leftPanel.classList.add('fade-out-others');
    
    document.querySelectorAll('.dia-header').forEach(el => el.classList.remove('active-header'));
    let prev = elementoClicado.previousElementSibling;
    while(prev) {
        if(prev.classList.contains('dia-header')) {
            prev.classList.add('active-header');
            break;
        }
        prev = prev.previousElementSibling;
    }

    document.getElementById('titulo-aula').innerHTML = `Disciplina: <span style="color: var(--alura-cyan)">${nomeAula}</span>`;

    // Posiciona o painel
    elementoClicado.after(rightPanel);
    rightPanel.style.display = 'block';
    
    // Inicia a animação de descer empurrando as fases transparentes
    setTimeout(() => { rightPanel.classList.add('active'); }, 50);

    // Quando dá 1 segundo (e elas já estão 100% invisíveis), nós removemos o espaço delas
    setTimeout(() => {
        if (elementoClicado.classList.contains('active-lesson')) {
            leftPanel.classList.add('focus-mode');
        }
    }, 1000);

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

    const carta = deckAtual[indiceCarta];
    if (!carta) return; 

    document.getElementById('texto-frente').innerText = carta.frente;
    document.getElementById('dica-frente').innerText = "Clique ou aperte ESPAÇO para revelar";
    document.getElementById('texto-verso').innerText = carta.verso;
    document.getElementById('dica-verso').innerText = carta.dica || ""; 
    document.getElementById('contador-cartas').innerText = `Flashcard ${indiceCarta + 1} de ${deckAtual.length}`;
}

function virarCarta() {
    if (deckAtual.length > 0 && indiceCarta < deckAtual.length) {
        document.getElementById('meuCard').classList.toggle('flipped');
    }
}

function processarResposta(resultado) {
    if (deckAtual.length === 0 || indiceCarta >= deckAtual.length) return;

    if (resultado === 'errei') {
        deckRevisao.push(deckAtual[indiceCarta]);
    }
    // MUDANÇA: Removemos o ganho de XP por carta para que a economia 
    // bata perfeitamente com a recompensa final de 5, 10, 15 ou 20 XP!
    
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

function irParaProximaAula() {
    let xpGanho = 0;
    let coinsGanho = 0;

    // Calcula a recompensa Dinâmica com base no Módulo atual
    if (faseAtualId.startsWith('fase')) {
        let numFase = parseInt(faseAtualId.replace('fase', ''));
        if (numFase >= 1 && numFase <= 5)        { xpGanho = 5;  coinsGanho = 10; } // Módulo 01
        else if (numFase >= 6 && numFase <= 10)  { xpGanho = 10; coinsGanho = 10; } // Módulo 02
        else if (numFase >= 11 && numFase <= 15) { xpGanho = 15; coinsGanho = 10; } // Módulo 03
        else if (numFase >= 16 && numFase <= 20) { xpGanho = 20; coinsGanho = 10; } // Módulo 04
    } else if (faseAtualId.startsWith('bonus')) {
        xpGanho = 25; // Recompensa generosa para os bônus
        coinsGanho = 15;
    }

    // Deposita na conta e salva no navegador
    xpTotal += xpGanho;
    coinsTotal += coinsGanho;
    localStorage.setItem('quest_xp', xpTotal);
    localStorage.setItem('quest_coins', coinsTotal);
    document.getElementById('xp-display').innerText = `${xpTotal} XP`;
    document.getElementById('coin-display').innerText = `🪙 ${coinsTotal}`;

    const indexAtual = ordemFases.indexOf(faseAtualId);
    
    // Alertas Inteligentes informando os ganhos
    if (indexAtual >= 0 && indexAtual < ordemFases.length - 1) {
        const proximaFase = ordemFases[indexAtual + 1];
        
        if (!fasesDesbloqueadas.includes(proximaFase)) {
            fasesDesbloqueadas.push(proximaFase);
            localStorage.setItem('quest_desbloqueadas', JSON.stringify(fasesDesbloqueadas));
            atualizarFasesVisuais(); 
            alert(`🎉 Disciplina Concluída!\nVocê ganhou +${xpGanho} XP e +${coinsGanho} Coins.\n🔓 Nova Disciplina Desbloqueada!`);
        } else {
            alert(`✅ Revisão Concluída!\nVocê ganhou +${xpGanho} XP e +${coinsGanho} Coins pelo seu esforço!`);
        }
    } 
    else if (indexAtual === ordemFases.length - 1) {
        alert(`🎓 Parabéns!\nVocê concluiu toda a grade curricular normal!\nReceba +${xpGanho} XP e +${coinsGanho} Coins!`);
    }
    else if (faseAtualId.startsWith('bonus')) {
        alert(`⭐ Bônus Concluído!\nSeu conhecimento extra lhe rendeu +${xpGanho} XP e +${coinsGanho} Coins!`);
    }

    document.getElementById('menu-' + faseAtualId).click(); // Fecha a aula atual
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

function salvarFlashcard() {
    const fase = document.getElementById('nova-fase').value.trim().toLowerCase();
    const frente = document.getElementById('nova-frente').value.trim();
    const verso = document.getElementById('nova-verso').value.trim();
    const dica = document.getElementById('nova-dica').value.trim();

    if(!fase || !frente || !verso) { alert("⚠️ Por favor, preencha Frente e Verso!"); return; }

    if(!meusDecks[fase]) meusDecks[fase] = [];
    meusDecks[fase].push({ frente, verso, dica });
    localStorage.setItem('quest_decks', JSON.stringify(meusDecks));

    document.getElementById('nova-frente').value = '';
    document.getElementById('nova-verso').value = '';
    document.getElementById('nova-dica').value = '';
    fecharModal('modalCriacao');
    alert("✨ Flashcard salvo na disciplina!");
}

function mostrarProgresso() {
    let totalCartas = 0;
    for (const cartas of Object.values(meusDecks)) { totalCartas += cartas.length; }

    const conteudo = `
        <div class="stat-box highlight">XP Acadêmico <span>${xpTotal} XP</span></div>
        <div class="stat-box highlight" style="border-color: #ffd700; background-color: rgba(255, 215, 0, 0.05);">Coins <span>🪙 ${coinsTotal}</span></div>
        <div class="stat-box">Cartas na Faculdade <span>${totalCartas}</span></div>
    `;

    document.getElementById('progresso-body').innerHTML = conteudo;
    abrirModal('modalProgresso');
}

function resetarProgresso() {
    const certeza = confirm("⚠️ ATENÇÃO!\nIsso vai apagar todo o seu histórico do navegador (Nível, Coins e Bônus comprados).\nDeseja voltar do zero?");
    if (certeza) {
        localStorage.clear(); 
        window.location.href = 'login/login.html'; 
    }
}

function deslogar() {
    if (confirm("Deseja sair do sistema?")) {
        localStorage.removeItem('quest_user_name');
        window.location.href = 'login/login.html'; 
    }
}

window.onload = verificarNivelamento;