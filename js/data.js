// js/data.js
const bancoDeDados = {
    // ================= MÓDULO 01 =================
    "fase1": [
        {"frente": "O que é uma Variável?", "verso": "Um espaço reservado na memória para armazenar um dado.", "dica": "Disciplina: Lógica com Python."},
        {"frente": "Para que serve a estrutura 'for' em Python?", "verso": "Para criar um laço de repetição iterável (loop).", "dica": "Percorre listas e sequências."},
        {"frente": "O que é um Dicionário?", "verso": "Uma estrutura de dados baseada em pares de 'chave: valor'.", "dica": "Usa chaves {}. Ex: {'curso': 'ADS'}"},
        {"frente": "Qual a diferença entre = e == em programação?", "verso": "= é para Atribuição. == é para Comparação (Verificar se é igual).", "dica": "Erro muito comum em lógica básica."},
        {"frente": "O que faz a palavra 'def' em Python?", "verso": "Serve para definir/criar uma nova função.", "dica": "Ex: def calcular_media():"}
    ],
    "fase2": [
        {"frente": "O que é a Média Aritmética?", "verso": "A soma de todos os valores dividida pela quantidade deles.", "dica": "Disciplina: Matemática e Estatística."},
        {"frente": "O que é a Mediana em um conjunto de dados?", "verso": "É o valor que fica exatamente no meio quando os dados estão em ordem.", "dica": "Não é afetada por valores extremos (outliers)."},
        {"frente": "O que estuda a Lógica Proposicional?", "verso": "Proposições que podem ser classificadas como Verdadeiras ou Falsas.", "dica": "Base para os operadores AND, OR, NOT na programação."},
        {"frente": "O que é um Grafo?", "verso": "Conjunto de Vértices (nós) conectados por Arestas (linhas).", "dica": "Usado em GPS, mapas e redes sociais."},
        {"frente": "O que é o Teorema de Bayes?", "verso": "Fórmula matemática usada para calcular a probabilidade condicional de um evento.", "dica": "Base matemática para IA e Machine Learning."}
    ],
    "fase3": [
        {"frente": "O que é a Placa-Mãe?", "verso": "A placa de circuito principal que conecta todos os componentes do PC.", "dica": "Disciplinas: Infraestrutura e TIC."},
        {"frente": "Qual a diferença entre RAM e HD/SSD?", "verso": "RAM é memória volátil de curto prazo. HD/SSD é armazenamento permanente.", "dica": "Desligou o PC, a RAM apaga tudo."},
        {"frente": "O que é um Sistema Operacional (SO)?", "verso": "O software principal que gerencia o hardware e permite executar outros programas.", "dica": "Ex: Windows, Linux, macOS."},
        {"frente": "Para que serve a CPU?", "verso": "É o cérebro do computador, responsável por processar e executar as instruções.", "dica": "Central Processing Unit."},
        {"frente": "O que é Virtualização?", "verso": "Criar versões virtuais de recursos físicos (ex: Máquinas Virtuais).", "dica": "A base da Computação em Nuvem."}
    ],
    "fase4": [
        {"frente": "O que significa a sigla LGPD?", "verso": "Lei Geral de Proteção de Dados.", "dica": "Disciplinas: Cibersegurança e LGPD."},
        {"frente": "O que é Phishing?", "verso": "Ataque de engenharia social (e-mails falsos) para roubar dados da vítima.", "dica": "Pense em 'pescar' a senha do usuário."},
        {"frente": "O que é um Ransomware?", "verso": "Software malicioso que criptografa os dados e exige pagamento de resgate.", "dica": "Ransom = Resgate."},
        {"frente": "O que são Dados Sensíveis (LGPD)?", "verso": "Dados sobre raça, religião, saúde, biometria e orientação sexual.", "dica": "Exigem proteção extra por causarem discriminação."},
        {"frente": "O que é um ataque DDoS?", "verso": "Enviar milhares de requisições falsas até derrubar o servidor por sobrecarga.", "dica": "Distributed Denial of Service."}
    ],
    "fase5": [
        {"frente": "O que é a Inclusão Digital?", "verso": "Garantir que todas as pessoas tenham acesso às tecnologias da informação.", "dica": "Disciplinas: Ética e Direitos Humanos."},
        {"frente": "Qual o pilar da Sustentabilidade na TI?", "verso": "Reduzir o impacto ambiental (lixo eletrônico) e o consumo de energia dos datacenters.", "dica": "Green IT (TI Verde)."},
        {"frente": "O que é Propriedade Intelectual em Software?", "verso": "O direito legal do criador sobre o código, layout ou algoritmo de um sistema.", "dica": "Protegido por direitos autorais e patentes."},
        {"frente": "O que é o Viés Algorítmico (Bias)?", "verso": "Quando uma Inteligência Artificial toma decisões preconceituosas baseadas em dados históricos falhos.", "dica": "Ex: IA de recrutamento que descarta mulheres."},
        {"frente": "Como a LGPD apoia os Direitos Humanos?", "verso": "Garantindo o direito fundamental à privacidade e à liberdade de escolha do cidadão.", "dica": "O titular é o dono do próprio dado."}
    ],

    // ================= MÓDULO 02 =================
    "fase6": [
        {"frente": "O que é a estrutura de dados Pilha (Stack)?", "verso": "O último elemento a entrar é o primeiro a sair (LIFO).", "dica": "Disciplina: Algoritmos e Dados em Python. Ex: Botão 'Desfazer'."},
        {"frente": "O que é a Fila (Queue)?", "verso": "O primeiro a entrar é o primeiro a sair (FIFO).", "dica": "Ex: Fila de impressão na impressora."},
        {"frente": "O que é um Algoritmo de Ordenação?", "verso": "Um método para organizar dados em sequência (ex: Bubble Sort, Quick Sort).", "dica": "Coloca números em ordem crescente."},
        {"frente": "O que é a Complexidade 'Big O'?", "verso": "Uma notação para medir a eficiência de um algoritmo (tempo e memória) quando os dados crescem.", "dica": "O(1) é excelente, O(n²) é lento."},
        {"frente": "O que é uma Árvore Binária?", "verso": "Estrutura de dados onde cada nó tem no máximo dois filhos (esquerda e direita).", "dica": "Excelente para buscas rápidas."}
    ],
    "fase7": [
        {"frente": "O que são Ponteiros em C?", "verso": "Variáveis que armazenam o endereço de memória de outra variável.", "dica": "Disciplina: Programação C."},
        {"frente": "Como incluir a biblioteca de entrada e saída em C?", "verso": "#include <stdio.h>", "dica": "Obrigatório para printf() e scanf()."},
        {"frente": "Para que serve a função malloc()?", "verso": "Para alocar blocos de memória dinamicamente enquanto o programa roda.", "dica": "Memória sob demanda."},
        {"frente": "O que a função free() faz?", "verso": "Libera a memória que foi alocada dinamicamente, devolvendo ao sistema.", "dica": "Se não usar, causa 'Memory Leak'."},
        {"frente": "O que é um Struct em C?", "verso": "Agrupa variáveis de tipos diferentes sob um único nome.", "dica": "É o 'avô' dos objetos na POO."}
    ],
    "fase8": [
        {"frente": "O que são Requisitos Funcionais?", "verso": "Descrevem o que o sistema DEVE FAZER (funções). Ex: 'O sistema deve emitir NF'.", "dica": "Disciplina: Análise e Eng. de Sistemas."},
        {"frente": "O que são Requisitos Não Funcionais?", "verso": "Descrevem COMO o sistema deve ser. Ex: 'O sistema deve carregar em 1 seg'.", "dica": "Foca em performance, segurança, design."},
        {"frente": "O que é um Diagrama de Casos de Uso (UML)?", "verso": "Um desenho que mostra as interações entre os Usuários (Atores) e o Sistema.", "dica": "Foca nas ações principais, não no código."},
        {"frente": "Qual a diferença entre Metodologia Ágil e Cascata?", "verso": "Ágil é flexível/iterativo. Cascata é linear, rígida e testa só no final.", "dica": "Ágil entrega valor aos poucos."},
        {"frente": "O que é um Diagrama de Classes?", "verso": "Diagrama UML que mapeia a estrutura orientada a objetos (atributos e métodos) do sistema.", "dica": "É a planta baixa dos desenvolvedores C#."}
    ],
    "fase9": [
        {"frente": "O que é um endereço IP?", "verso": "Identificador numérico exclusivo de um dispositivo na rede.", "dica": "Disciplina: Redes e Sist. Distribuídos."},
        {"frente": "Para que serve o DNS?", "verso": "Traduz nomes de sites (google.com) para endereços IP numéricos.", "dica": "A lista telefônica da web."},
        {"frente": "Qual a diferença entre TCP e UDP?", "verso": "TCP garante a entrega dos dados. UDP é rápido mas não verifica se o dado chegou.", "dica": "TCP: Arquivos. UDP: Jogos/Vídeo."},
        {"frente": "O que é um Sistema Distribuído?", "verso": "Vários computadores na rede trabalhando juntos como se fossem um único sistema.", "dica": "A base da computação em nuvem."},
        {"frente": "O que faz um Load Balancer?", "verso": "Distribui o tráfego de rede igualmente entre vários servidores para evitar sobrecarga.", "dica": "Salva o site na Black Friday."}
    ],
    "fase10": [
        {"frente": "O que é o Teste de Turing?", "verso": "Um teste para verificar se uma máquina consegue exibir comportamento inteligente indistinguível do humano.", "dica": "Disciplina: IA e Inovação."},
        {"frente": "O que são Agentes Inteligentes?", "verso": "Sistemas que percebem o ambiente via sensores e agem para maximizar seus objetivos.", "dica": "Ex: Um robô aspirador de pó."},
        {"frente": "O que é uma Heurística em IA?", "verso": "Uma 'regra de ouro' ou atalho mental usado pela IA para encontrar boas soluções rapidamente.", "dica": "Não garante a perfeição, mas é rápida."},
        {"frente": "O que é NLP?", "verso": "Processamento de Linguagem Natural. Área da IA que entende a linguagem humana.", "dica": "Como o ChatGPT ou a Alexa funcionam."},
        {"frente": "Qual a diferença entre Inovação Incremental e Disruptiva?", "verso": "Incremental melhora algo existente (iPhone 14 -> 15). Disruptiva cria um novo mercado (Táxi -> Uber).", "dica": "Disrupção muda as regras do jogo."}
    ],

    // ================= MÓDULO 03 =================
    "fase11": [
        {"frente": "O que é uma Chave Primária (PK)?", "verso": "Um campo que identifica de forma exclusiva uma linha na tabela. Ex: CPF.", "dica": "Disciplina: Banco de Dados e NoSQL."},
        {"frente": "Qual a diferença entre SQL e NoSQL?", "verso": "SQL é relacional (tabelas rígidas). NoSQL usa documentos flexíveis (JSON).", "dica": "MongoDB é NoSQL."},
        {"frente": "O que significa CRUD?", "verso": "Create (Criar), Read (Ler), Update (Atualizar), Delete (Apagar).", "dica": "As 4 ações básicas do banco."},
        {"frente": "Para que serve a cláusula JOIN no SQL?", "verso": "Para unir dados de duas ou mais tabelas baseando-se em uma coluna em comum.", "dica": "Une clientes aos seus pedidos."},
        {"frente": "O que é o processo de Normalização?", "verso": "Organizar as tabelas para eliminar dados redundantes/repetidos.", "dica": "Economiza espaço e evita inconsistências."}
    ],
    "fase12": [
        {"frente": "O que é uma Classe?", "verso": "Um molde que define os atributos e comportamentos de um objeto.", "dica": "Disciplina: POO com C#."},
        {"frente": "O que é Herança em POO?", "verso": "Quando uma classe filha recebe as características de uma classe pai.", "dica": "Promove o reaproveitamento de código."},
        {"frente": "O que é Polimorfismo?", "verso": "Capacidade de um método ter diferentes comportamentos dependendo do objeto que o chama.", "dica": "Ex: 'Falar()' -> Gato mia, Cachorro late."},
        {"frente": "O que é Encapsulamento?", "verso": "Esconder variáveis internas da classe (private) e expô-las apenas via Get/Set.", "dica": "Protege os dados contra alterações indevidas."},
        {"frente": "Qual a diferença entre Interface e Classe Abstrata?", "verso": "A Interface é 100% vazia (um contrato). A Abstrata pode conter código pronto.", "dica": "Uma classe herda 1 abstrata, mas implementa N interfaces."}
    ],
    "fase13": [
        {"frente": "Qual a diferença entre UX e UI?", "verso": "UX = Jornada e sentimento do usuário. UI = Cores, botões e design da tela.", "dica": "Disciplina: Web Responsivo e UX/UI."},
        {"frente": "O que é Design Responsivo?", "verso": "Páginas que se adaptam perfeitamente a PCs, Tablets e Celulares.", "dica": "Feito usando Media Queries no CSS."},
        {"frente": "O que é 'Mobile First'?", "verso": "Estratégia de desenhar o site primeiro para o celular e depois para monitores maiores.", "dica": "Aprovado pelo Google."},
        {"frente": "Para que serve o CSS Flexbox?", "verso": "Organizar, alinhar e distribuir espaço entre itens em uma linha ou coluna.", "dica": "É o que usamos para dividir este app."},
        {"frente": "O que é um Wireframe?", "verso": "O 'esqueleto' ou rascunho visual da tela, sem cores ou imagens finais.", "dica": "A planta-baixa do site."}
    ],
    "fase14": [
        {"frente": "O que é Machine Learning (ML)?", "verso": "Sistemas que aprendem a identificar padrões em dados sem serem explicitamente programados.", "dica": "Disciplina: Machine Learning."},
        {"frente": "O que é Aprendizado Supervisionado?", "verso": "Treinar a IA dando os dados de exemplo e a resposta certa (gabarito).", "dica": "Ex: 1000 fotos com a tag 'Cachorro'."},
        {"frente": "O que é o erro de Overfitting?", "verso": "Quando a IA 'decora' os dados de treino, mas erra muito ao testar dados reais e novos.", "dica": "Falta de generalização."},
        {"frente": "Qual a diferença entre Regressão e Classificação?", "verso": "Classificação prevê categorias (Spam). Regressão prevê números contínuos (Preço da casa).", "dica": "A regressão desenha uma linha de tendência."},
        {"frente": "O que são Redes Neurais?", "verso": "Algoritmos em camadas (Input, Ocultas, Output) inspirados no cérebro.", "dica": "Base do Deep Learning."}
    ],
    "fase15": [
        {"frente": "O que é o Scrum?", "verso": "Framework ágil iterativo focado no trabalho em equipe.", "dica": "Disciplina: Eng. Soft. Ágil Aplicada."},
        {"frente": "O que faz o Product Owner (PO)?", "verso": "Representa o cliente, cria histórias de usuário e prioriza o Backlog.", "dica": "Dono da visão do produto."},
        {"frente": "O que é uma Sprint?", "verso": "Um ciclo fixo de trabalho (1 a 4 semanas) onde a equipe desenvolve uma entrega funcional.", "dica": "Termina com a Revisão e Retrospectiva."},
        {"frente": "O que é o Scrum Master?", "verso": "Líder servidor que remove impedimentos e garante que o time siga as regras do Scrum.", "dica": "O 'facilitador'."},
        {"frente": "Qual o objetivo da Daily Scrum?", "verso": "Reunião de 15 min de alinhamento tático: O que fiz, farei e se há bloqueios.", "dica": "Não é reunião para resolver problemas profundos."}
    ],

    // ================= MÓDULO 04 =================
    "fase16": [
        {"frente": "O que é o .NET Core?", "verso": "Framework open-source e multiplataforma (Windows/Linux/Mac) da Microsoft.", "dica": "Disciplina: Web e App em .NET."},
        {"frente": "O que é o Entity Framework Core?", "verso": "Um ORM que permite manipular bancos de dados usando objetos C# ao invés de SQL.", "dica": "Mapeamento Objeto-Relacional."},
        {"frente": "Para que serve uma API REST?", "verso": "Para comunicar sistemas (Front e Back) trocando dados, geralmente no formato JSON.", "dica": "As requisições usam HTTP (GET, POST, PUT, DELETE)."},
        {"frente": "O que é Injeção de Dependência (DI)?", "verso": "Técnica onde a classe recebe os objetos que precisa de fora, ao invés de instanciá-los.", "dica": "Facilita testes e desacopla código."},
        {"frente": "O que é o padrão MVC?", "verso": "Padrão de arquitetura: Model (Dados), View (Tela) e Controller (Lógica).", "dica": "Separa as responsabilidades do sistema."}
    ],
    "fase17": [
        {"frente": "Qual a diferença entre App Nativo e Híbrido/Cross-platform?", "verso": "Nativo usa o código original (Java/Swift). Híbrido escreve um código e exporta para ambos.", "dica": "Disciplina: Dev Mobile."},
        {"frente": "O que é o .NET MAUI?", "verso": "Framework da Microsoft para criar apps mobile para iOS e Android usando C#.", "dica": "Substituto do Xamarin."},
        {"frente": "O que é o Ciclo de Vida de uma Activity/Tela?", "verso": "Os estados pelo qual um app passa: Criar, Iniciar, Pausar e Destruir.", "dica": "Evita o app travar ou gastar bateria no fundo."},
        {"frente": "O que são APIs de Geolocalização?", "verso": "Bibliotecas que permitem ao app acessar o GPS do celular.", "dica": "Usado pelo Uber, iFood, etc."},
        {"frente": "Para que serve o SQLite no Mobile?", "verso": "É um banco de dados relacional super leve, embutido no próprio celular (offline).", "dica": "Salva dados sem precisar de internet."}
    ],
    "fase18": [
        {"frente": "O que é uma Stored Procedure?", "verso": "Um bloco de código SQL salvo no banco de dados para ser executado várias vezes.", "dica": "Disciplina: Programação de BD."},
        {"frente": "O que é uma Trigger (Gatilho)?", "verso": "Um código SQL que roda automaticamente APÓS um evento (Insert, Update ou Delete).", "dica": "Útil para gerar logs de auditoria."},
        {"frente": "Qual a diferença entre VIEW e Tabela?", "verso": "Tabela guarda dados físicos. View é uma 'tabela virtual' criada a partir de um SELECT.", "dica": "A View facilita consultas complexas."},
        {"frente": "O que é o conceito ACID em Transações?", "verso": "Atomicidade, Consistência, Isolamento e Durabilidade.", "dica": "Garante que o Pix não dê erro no meio do caminho."},
        {"frente": "Para que serve o comando COMMIT?", "verso": "Confirma e salva permanentemente as alterações de uma transação no banco.", "dica": "Se der erro, usamos o ROLLBACK."}
    ],
    "fase19": [
        {"frente": "O que é Cloud Computing?", "verso": "Acessar servidores, bancos e softwares via internet ao invés de comprar máquinas.", "dica": "Disciplina: Cloud e DevOps."},
        {"frente": "O que é o Docker?", "verso": "Ferramenta para empacotar o código em contêineres leves e isolados.", "dica": "Acaba com o 'Na minha máquina funcionou'."},
        {"frente": "Para que serve o Kubernetes?", "verso": "Orquestrar, gerenciar e escalar automaticamente centenas de contêineres.", "dica": "É o comandante do navio."},
        {"frente": "O que significa CI/CD?", "verso": "Integração Contínua (CI) e Entrega Contínua (CD).", "dica": "Automação de testes e publicação de código."},
        {"frente": "Defina IaaS, PaaS e SaaS.", "verso": "IaaS (Máquina alugada), PaaS (Ambiente para devs), SaaS (Software pronto pro usuário).", "dica": "AWS EC2 = IaaS, Netflix = SaaS."}
    ],
    "fase20": [
        {"frente": "O que é um MVP (Minimum Viable Product)?", "verso": "A versão mais simples de um produto, lançada rapidamente para testar o mercado.", "dica": "Disciplina: Empreendedorismo e Gestão."},
        {"frente": "O que é o Kanban?", "verso": "Método visual de gestão de fluxo de trabalho (A Fazer, Fazendo, Feito).", "dica": "Originou-se na Toyota."},
        {"frente": "O que é Escalabilidade Horizontal?", "verso": "Adicionar MAIS servidores para dividir a carga do sistema (Cloud).", "dica": "Diferente de Vertical, que é botar mais RAM em 1 PC."},
        {"frente": "Qual o principal objetivo do Empreendedorismo em TI?", "verso": "Resolver problemas e dores do mundo real criando soluções tecnológicas escaláveis.", "dica": "Não é só código, é gerar valor ao cliente."},
        {"frente": "O que é Infraestrutura como Código (IaC)?", "verso": "Criar e gerenciar servidores escrevendo código/scripts, sem clicar em botões manuais.", "dica": "Ex: Terraform e AWS CloudFormation."}
    ], 
    // ================= FASES BÔNUS (PREMIUM) =================
    "bonus1": [
        {"frente": "Bônus 01: O que é a 'Deep Web'?", "verso": "A parte da internet que não é indexada por motores de busca como o Google.", "dica": "Não é necessariamente ilegal, apenas oculta (ex: intranets de empresas)."},
        {"frente": "Bônus 01: O que foi o vírus 'ILOVEYOU' (2000)?", "verso": "Um dos maiores worms de e-mail da história que causou bilhões em prejuízos.", "dica": "Engenharia social pura."},
        {"frente": "Bônus 01: O que é o Teste de Invasão (PenTest)?", "verso": "Simular um ataque cibernético autorizado para encontrar falhas de segurança.", "dica": "Feito por Hackers Éticos."}
    ],
    "bonus2": [
        {"frente": "Bônus 02: O que é um 'Easter Egg' em software?", "verso": "Uma mensagem, piada ou recurso oculto deixado pelos programadores.", "dica": "Muito comum em jogos e no Google."},
        {"frente": "Bônus 02: O que significa 'RTFM' na cultura Tech?", "verso": "Read The F***ing Manual (Leia o maldito manual).", "dica": "A resposta clássica para perguntas óbvias."},
        {"frente": "Bônus 02: O que foi a 'Bolha da Internet' (Dot-com bubble)?", "verso": "A crise econômica dos anos 2000 causada pela supervalorização de empresas de internet.", "dica": "Muitas empresas faliram da noite pro dia."}
    ],
    "bonus3": [
        {"frente": "Bônus 03: O que é a síndrome do Impostor?", "verso": "O sentimento de que você não é bom o suficiente e que seu sucesso é apenas sorte.", "dica": "Afeta 80% dos desenvolvedores iniciantes."},
        {"frente": "Bônus 03: Qual a linguagem de programação que foi para a Lua (Apollo 11)?", "verso": "Assembly, escrito por Margaret Hamilton e sua equipe.", "dica": "O código era literalmente costurado em fios."},
        {"frente": "Bônus 03: O que é a Lei de Moore?", "verso": "A observação de que o número de transistores em um microchip dobra a cada dois anos.", "dica": "Dita o ritmo da evolução do hardware."}
    ],
    "bonus4": [
        {"frente": "Bônus 04: O que é um 'Unicórnio' no mercado de TI?", "verso": "Uma startup de capital fechado avaliada em mais de 1 bilhão de dólares.", "dica": "Ex: Nubank, iFood e Uber no início."},
        {"frente": "Bônus 04: Qual a diferença entre Júnior, Pleno e Sênior?", "verso": "Júnior precisa de ajuda. Pleno resolve sozinho. Sênior evita o problema antes dele acontecer.", "dica": "Resumo clássico do mercado."},
        {"frente": "Bônus 04: O que é a cultura 'Open Source'?", "verso": "O modelo de desenvolvimento de software onde o código-fonte é aberto e colaborativo.", "dica": "O Linux é o maior exemplo mundial."}
    ]
};