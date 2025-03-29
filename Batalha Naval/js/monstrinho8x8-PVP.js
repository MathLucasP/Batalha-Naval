/* Informação usada para desenhar os navios */
/* Definição de arrays para representar os navios:
   Cada navio é definido por um array que contém as coordenadas dos quadrados ocupados pelo navio
   em dois tipos de orientação (horizontal e vertical). */
   var ship = [[[1, 5], [1, 2, 5], [1, 2, 3, 5], [1, 2, 3, 4, 5]], 
   [[6, 10], [6, 7, 10], [6, 7, 8, 10], [6, 7, 8, 9, 10]]];
   
/* Informação usada para desenhar os navios afundados */
/* Similar à variável 'ship', mas contém as coordenadas para representar o navio afundado. */
var dead = [[[201, 203], [201, 202, 203], [201, 202, 202, 203], [201, 202, 202, 202, 203]], 
   [[204, 206], [204, 205, 206], [204, 205, 205, 206], [204, 205, 205, 205, 206]]];
   
/* Descrição dos navios */
/* Array com a descrição dos tipos de navios:
Cada navio é representado por um array com o nome, comprimento e quantidade disponível. */
// 'shiptypes' é um array que descreve cada tipo de navio: nome, tamanho e quantidade.
var shiptypes = [
    ["Rebocador", 2, 3], // Navio de tamanho 2, 3 unidades
    ["Contratopedeiro", 3, 2], // Navio de tamanho 3, 2 unidades
    ["Cruzador", 4, 1], // Navio de tamanho 4, 1 unidades
    ["Porta-avioes", 5, 0] // Navio de tamanho 5, 0 unidade
 ];

var gridx = 8, gridy = 8;  /* Dimensões da grade do jogo: 8x8 */
var player1 = [], player2 = []; /* Grades para os tabuleiros dos jogadores */
var player1Ships = [], player2Ships = []; /* Informações sobre os navios dos jogadores */
var player1Lives = 0, player2Lives = 0; /* Contadores de vidas restantes dos jogadores */
var currentPlayer = 1; /* Jogador atual (1 ou 2) */
var statusMsg = ""; /* Mensagem de status do jogo */

var audioAgua = new Audio("./Som/agua.mp3"); //Atribui audio de acerto a água para a variavel, que vai ser usado depois
var audioExplosao = new Audio("./Som/explosao.mp3"); //Atribui audio de explosão para a variavel, que vai ser usado depois
var audioFogo = new Audio("./Som/Fogo.mp3"); //Atribui audio de Fogo para a variavel, que vai ser usado depois

/* Função para precarregar as imagens */
/* Precarrega as imagens necessárias para o jogo e as armazena no array 'preloaded'. */
var preloaded = [];

function imagePreload() {
    // Define um array com os IDs das imagens que precisam ser carregadas.
    // Esses números de IDs correspondem às imagens que serão usadas no jogo.
    // Exemplo de IDs: 1, 2, 3, 4... até 206, incluindo também IDs específicos como 100, 101, etc.
    var i, ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 101, 102, 103, 201, 202, 203, 204, 205, 206];
 
    // Define a mensagem de status na barra de status da janela do navegador.
    // Indica que as imagens estão sendo carregadas para o jogador.
    window.status = "Precarregando as imagens.";
 
    // Loop para iterar sobre cada ID na lista de IDs.
    // O loop percorre cada ID para carregar as respectivas imagens.
    for (i = 0; i < ids.length; ++i) {
        // Cria um novo objeto Image.
        // O objeto Image é usado para armazenar e carregar a imagem correspondente a cada ID.
        var img = new Image();
 
        // Constrói o nome do arquivo da imagem com base no ID atual.
        // O nome segue o formato "navioX.gif", onde X é o ID atual do array 'ids'.
        // Exemplo: se o ID for 1, o nome será "navio1.gif".
        var name = "img/navio" + ids[i] + ".gif";
 
        // Define o atributo 'src' da imagem com o nome do arquivo.
        // Isso faz com que a imagem seja carregada do diretório com base no nome gerado.
        img.src = name;
 
        // Armazena o objeto Image carregado no array 'preloaded' na posição correspondente ao índice 'i'.
        // O array 'preloaded' mantém uma referência de todas as imagens carregadas, para uso posterior no jogo.
        preloaded[i] = img;
    }
 
    // Após o carregamento das imagens, limpa a mensagem de status.
    // Isso significa que o processo de pré-carregamento de imagens foi concluído.
    window.status = "";
 }
 
 
 /* Função responsável por configurar a grade de navios para um jogador (Player 1 ou Player 2).
    Esta função distribui aleatoriamente os navios na grade de forma que não haja sobreposição.
    O parâmetro `isPlayer1` determina se a função está configurando os navios para o Jogador 1 ou Jogador 2. */
    function setupPlayer(isPlayer1) {
     // Declara as variáveis para as coordenadas (x, y) e a grade (array bidimensional) do jogo.
     var y, x;
     var grid = [];  // Inicializa um array vazio que será a grade de jogo.
  
     /* Inicializa a grade com valores padrão. */
     // A grade é representada por um array bidimensional de tamanho gridx (largura) x gridy (altura).
     // Cada célula da grade é um array [100, -1, 0], onde:
     //   - 100 representa que a célula está vazia (ou seja, água).
     //   - -1 indica que a célula ainda não possui um navio (placeholder para o número do navio).
     //   - 0 é um marcador que será usado mais tarde para representar o estado do navio (se está afundado ou não).
     for (y = 0; y < gridx; ++y) {  // Loop através de cada linha (y) da grade.
         grid[y] = [];  // Inicializa a linha y como um array vazio.
         for (x = 0; x < gridx; ++x) {  // Loop através de cada coluna (x) da linha atual.
             grid[y][x] = [100, -1, 0];  // Preenche cada célula com os valores padrão.
         }
     }
  
     // Variável que mantém o número do navio atual a ser posicionado na grade.
     var shipNo = 0;
  
     // Variável para iterar sobre os diferentes tipos de navios, conforme definidos em `shiptypes`.
     var s;
  
     /* Itera sobre os tipos de navios a serem posicionados. */
     // O array `shiptypes` contém a especificação dos navios (ex: tamanho, quantidade).
     // Começamos a colocar os navios maiores primeiro, para reduzir as chances de sobreposição.
     for (s = shiptypes.length - 1; s >= 0; --s) {  // Começa com o último navio (maior) e vai até o primeiro (menor).
         var i;
  
         /* Para cada tipo de navio, colocamos a quantidade definida na grade. */
         // O valor shiptypes[s][2] indica quantos navios do tipo `s` precisam ser colocados.
         for (i = 0; i < shiptypes[s][2]; ++i) {
             // Gera aleatoriamente a orientação do navio:
             //   - 0 significa horizontal.
             //   - 1 significa vertical.
             var d = Math.floor(Math.random() * 2);  // Gera 0 ou 1 aleatoriamente.
  
             // Define o comprimento do navio e ajusta os limites da grade dependendo da orientação.
             var len = shiptypes[s][1],  // Obtém o comprimento do navio atual.
                 lx = gridx, ly = gridy,  // Define os limites da grade inicialmente como a largura e altura totais.
                 dx = 0, dy = 0;  // Variáveis que indicam a direção em que o navio será posicionado (x ou y).
  
             if (d == 0) {  // Se a orientação for horizontal:
                 lx = gridx - len;  // Limita a largura para que o navio caiba na linha sem exceder a grade.
                 dx = 1;  // Incrementa x para preencher as células na horizontal.
             } else {  // Se a orientação for vertical:
                 ly = gridy - len;  // Limita a altura para que o navio caiba na coluna sem exceder a grade.
                 dy = 1;  // Incrementa y para preencher as células na vertical.
             }
  
             // Declara as variáveis que armazenam a posição (x, y) e validação da posição.
             var x, y, ok;
  
             /* Tenta encontrar uma posição válida para o navio. */
             // Continua até encontrar uma posição válida (onde o navio não colida com outros).
             do {
                 // Gera aleatoriamente as coordenadas iniciais (x, y) dentro dos limites ajustados da grade.
                 y = Math.floor(Math.random() * ly);  // Escolhe uma posição aleatória na vertical dentro do limite permitido.
                 x = Math.floor(Math.random() * lx);  // Escolhe uma posição aleatória na vertical dentro do limite permitido.
  
                 // Variáveis auxiliares para verificar a ocupação das células.
                 var j, cx = x, cy = y;
                 ok = true;  // Inicialmente, assume que a posição é válida.
  
                 // Verifica se todas as células necessárias para o comprimento do navio estão livres.
                 for (j = 0; j < len; ++j) {
                     // Se a célula estiver ocupada por um navio (grid[cy][cx][0] < 100), a posição não é válida.
                     if (grid[cy][cx][0] < 100) {
                         ok = false;  // Marca como inválida e sai do loop.
                         break;
                     }
                     // Avança para a próxima célula na direção da orientação escolhida.
                     cx += dx;  // Se horizontal, move-se para a próxima coluna.
                     cy += dy;  // Se vertical, move-se para a próxima linha.
                 }
             } while (!ok);  // Continua gerando novas coordenadas até encontrar uma posição válida.
  
             /* Posiciona o navio na grade nas coordenadas válidas encontradas. */
             // Variáveis cx e cy são redefinidas para as coordenadas iniciais de x e y.
             var j, cx = x, cy = y;
             for (j = 0; j < len; ++j) {
                 grid[cy][cx][0] = ship[d][s][j];  // Preenche a célula com o ID do navio.
                 grid[cy][cx][1] = shipNo;  // Armazena o número do navio na célula.
                 grid[cy][cx][2] = dead[d][s][j];  // Armazena o estado inicial (não afundado) do navio.
                 cx += dx;  // Avança para a próxima célula na direção x (se horizontal).
                 cy += dy;  // Avança para a próxima célula na direção y (se vertical).
             }
  
             /* Atualiza as informações de navios e vidas do jogador. */
             if (isPlayer1) {
                 // Se for o jogador 1:
                 player1Ships[shipNo] = [s, shiptypes[s][1]];  // Armazena o tipo e comprimento do navio.
                 player1Lives++;  // Incrementa o número de vidas (ou navios ativos) do jogador 1.
             } else {
                 // Se for o jogador 2:
                 player2Ships[shipNo] = [s, shiptypes[s][1]];  // Armazena o tipo e comprimento do navio.
                 player2Lives++;  // Incrementa o número de vidas (ou navios ativos) do jogador 2.
             }
             shipNo++;  // Incrementa o número do navio para o próximo navio a ser posicionado.
         }
     }
  
     // Retorna a grade configurada com todos os navios posicionados para o jogador atual.
     return grid;
  }
  
  
 
 /* Função para atualizar as imagens nos quadrados do tabuleiro.
    Esta função altera a imagem exibida com base no estado do quadrado 
    e se o jogador é o 1 ou o 2. */
    function setImage(y, x, id, isPlayer1) {
     // Verifica se o tabuleiro a ser atualizado é o do jogador 1.
     if (isPlayer1) {
         // Atualiza a grade do jogador 1 com o novo ID da imagem.
         // 'id' representa o identificador da imagem que deve ser exibida.
         // player1[y][x][0] armazena o ID da imagem correspondente à célula (y, x).
         player1[y][x][0] = id;
  
         // Atualiza a fonte da imagem HTML para refletir o novo ID.
         // document.images é uma coleção de todas as imagens no documento.
         // A imagem específica a ser atualizada é identificada pelo nome no formato "p1Y_X",
         // onde Y e X representam as coordenadas da célula no tabuleiro.
         // A string "img/navio" + id + ".gif" é usada para construir o caminho completo do arquivo da imagem.
         document.images["p1" + y + "_" + x].src = "img/navio" + id + ".gif";
     } else {
         // Se não é o tabuleiro do jogador 1, então é o do jogador 2.
         // Atualiza a grade do jogador 2 com o novo ID da imagem.
         // 'id' representa o identificador da imagem que deve ser exibida.
         // player2[y][x][0] armazena o ID da imagem correspondente à célula (y, x).
         player2[y][x][0] = id;
  
         // Atualiza a fonte da imagem HTML para refletir o novo ID.
         // A imagem específica a ser atualizada é identificada pelo nome no formato "p2Y_X",
         // onde Y e X representam as coordenadas da célula no tabuleiro.
         // A string "img/navio" + id + ".gif" é usada para construir o caminho completo do arquivo da imagem.
         document.images["p2" + y + "_" + x].src = "img/navio" + id + ".gif";
     }
  }
 
  
 /* Função para gerar o HTML que exibe a grade do tabuleiro de um jogador.
    O parâmetro isPlayer1 indica se a grade a ser mostrada é do jogador 1 ou do jogador 2. */
    function showGrid(isPlayer1) {
     var y, x; // Declara variáveis para as coordenadas (y e x) do tabuleiro.
     
     // Obtém o elemento HTML onde o tabuleiro será exibido.
     // Utiliza um operador ternário para decidir entre o tabuleiro do jogador 1 ou do jogador 2.
     var container = isPlayer1 ? document.getElementById("player1Grid") : document.getElementById("player2Grid");
     
     // Inicializa uma string HTML que será usada para construir a grade do tabuleiro.
     var gridHTML = '';
     
     // Loop através de cada linha do tabuleiro (eixo Y).
     for (y = 0; y < gridy; ++y) {
         // Loop através de cada coluna do tabuleiro (eixo X).
         for (x = 0; x < gridx; ++x) {
             // Define se o jogador atual pode clicar no tabuleiro, baseado na lógica do jogo.
             // Um jogador só pode clicar nas células do tabuleiro do oponente.
             var clickable = (isPlayer1 && currentPlayer === 2) || (!isPlayer1 && currentPlayer === 1);
             
             // Ação de clique padrão, que não realiza nenhuma ação (previne clicar no próprio tabuleiro).
             var clickAction = 'javascript:void(0);';
 
             // Se o tabuleiro for do oponente, permite que o jogador clique na célula.
             if (clickable) {
                 // O clique chama a função gridClick passando as coordenadas Y e X da célula.
                 // Isso permitirá que o jogador ative a célula clicada.
                 clickAction = 'javascript:gridClick(' + y + ',' + x + ')';
             }
 
             // Lógica para exibir a grade do tabuleiro de acordo com o jogador.
             if (isPlayer1) {
                 // Exibe o tabuleiro do jogador 1 e esconde os navios do jogador 2.
                 var imgSrc = player1[y][x][0]; // Obtém o ID da imagem correspondente à célula do jogador 1.
                 
                 // Se o jogador 2 está jogando e a célula do jogador 1 ainda não foi atingida (ID < 100),
                 // isso indica que a célula é água e deve ser exibida como tal.
                 if (currentPlayer === 2 && player1[y][x][0] < 100) {
                     imgSrc = 100; // Define a imagem para mostrar água (navio100.gif).
                 }
                 
                 // Adiciona o link clicável ao HTML (ou não, se o clique não for permitido).
                 gridHTML += '<a href="' + clickAction + '">';
                 // Adiciona a imagem correspondente à célula do tabuleiro para o jogador 1.
                 gridHTML += '<img name="p1' + y + '_' + x + '" src="img/navio' + imgSrc + '.gif" width=16 height=16></a>';
             } else {
                 // Exibe o tabuleiro do jogador 2 e esconde os navios do jogador 1.
                 var imgSrc = player2[y][x][0]; // Obtém o ID da imagem correspondente à célula do jogador 2.
                 
                 // Se o jogador 1 está jogando e a célula do jogador 2 ainda não foi atingida (ID < 100),
                 // isso indica que a célula é água e deve ser exibida como tal.
                 if (currentPlayer === 1 && player2[y][x][0] < 100) {
                     imgSrc = 100; // Define a imagem para mostrar água (navio100.gif).
                 }
                 
                 // Adiciona o link clicável ao HTML (ou não, se o clique não for permitido).
                 gridHTML += '<a href="' + clickAction + '">';
                 // Adiciona a imagem correspondente à célula do tabuleiro para o jogador 2.
                 gridHTML += '<img name="p2' + y + '_' + x + '" src="img/navio' + imgSrc + '.gif" width=16 height=16></a>';
             }
         }
         // Adiciona uma quebra de linha após cada linha do tabuleiro para separar visualmente as linhas.
         gridHTML += '<br>';
     }
     // Define o HTML gerado no container do tabuleiro (div do jogador 1 ou do jogador 2).
     container.innerHTML = gridHTML;
 }
 
 /* Função que atualiza o tabuleiro para mostrar a representação de um navio afundado
    A função é chamada quando um navio foi completamente destruído.
    Parâmetros:
    - grid: o tabuleiro (do Jogador 1 ou 2) onde o navio está localizado.
    - shipNo: o número do navio que foi afundado.
    - isPlayer1: um booleano que indica se o tabuleiro é do Jogador 1 (true) ou Jogador 2 (false). */
    function sinkShip(grid, shipNo, isPlayer1) {
     var y, x;  // Declara variáveis para iteração sobre as células do tabuleiro
     
     // Itera sobre cada célula do tabuleiro (grade)
     for (y = 0; y < gridx; ++y) { // Loop para percorrer as linhas do tabuleiro
         for (x = 0; x < gridx; ++x) { // Loop para percorrer as colunas do tabuleiro
             
             // Verifica se a célula atual contém parte do navio afundado, identificando pelo número shipNo
             if (grid[y][x][1] === shipNo) {
                 
                 // Se o navio afundado pertence ao Jogador 1
                 if (isPlayer1) {
                     // Atualiza a imagem da célula correspondente no tabuleiro do Jogador 1
                     // A imagem é alterada para mostrar a representação do navio afundado
                     // `player1[y][x][2]` armazena o código da imagem para a parte afundada do navio
                     setImage(y, x, player1[y][x][2], true);
                 } else {
                     // Se o navio afundado pertence ao Jogador 2
                     // Atualiza a imagem da célula correspondente no tabuleiro do Jogador 2
                     // `player2[y][x][2]` armazena o código da imagem para a parte afundada do navio
                     setImage(y, x, player2[y][x][2], false);
                 }
             }
         }
     }
  }
  
 
 
 /* Função que atualiza a mensagem de status do jogo para indicar qual jogador está na vez.
    Além disso, também pode ser usada para exibir mensagens ao final do jogo. */
    function updateStatus() {
     var i, s;  // Declara variáveis: i (não utilizada aqui) e s (para armazenar a mensagem de status)
     
     // Verifica qual jogador está com a vez (currentPlayer)
     if (currentPlayer === 1) {
         const player1Name = localStorage.getItem('player1Name') || 'Jogador 1';
         // Se o Jogador 1 é o atual
         s = "Vez de " + `${player1Name}`; // Atribui a mensagem de status indicando a vez do Jogador 1
     } else if (currentPlayer === 2) {
         const player2Name = localStorage.getItem('player2Name') || 'Jogador 2';
         // Se o Jogador 2 é o atual
         s = "Vez de " + `${player2Name}` ; // Atribui a mensagem de status indicando a vez do Jogador 2
     } else {
         // Caso o jogo tenha terminado ou esteja em estado inválido (currentPlayer == 0 ou outro valor)
         s = ""; // Não exibe nenhuma mensagem de status
     }
     
     // Atualiza o elemento HTML identificado pelo ID "statusMessage" com a mensagem de status
     // A função textContent define o texto da tag, substituindo o conteúdo anterior
     document.getElementById("statusMessage").textContent = s;
  }
  
 
 /* Função que inicia o jogo.
    - Precarrega as imagens dos navios.
    - Configura os tabuleiros para ambos os jogadores.
    - Exibe o status inicial do jogo e atualiza periodicamente. */
 
 // Precarrega as imagens dos navios e da água, melhorando o desempenho gráfico do jogo.
 imagePreload(); 
 
 // Configura o tabuleiro do Jogador 1 (player1).
 // A função setupPlayer(true) inicializa o tabuleiro do Jogador 1 com navios posicionados e outras configurações.
 player1 = setupPlayer(true); 
 
 // Configura o tabuleiro do Jogador 2 (player2).
 // A função setupPlayer(false) inicializa o tabuleiro do Jogador 2.
 player2 = setupPlayer(false); 
 
 // Exibe o tabuleiro do Jogador 1 no elemento HTML correspondente.
 // A função showGrid(true) renderiza o tabuleiro do Jogador 1 com as posições iniciais.
 showGrid(true);
 
 // Exibe o tabuleiro do Jogador 2 no elemento HTML correspondente.
 // A função showGrid(false) renderiza o tabuleiro do Jogador 2 da mesma forma que o do Jogador 1.
 showGrid(false);
 
 // Atualiza a mensagem de status para indicar o jogador que começa o jogo.
 // A função updateStatus() mostra "Vez do Jogador 1" ou "Vez do Jogador 2", dependendo de quem é o primeiro jogador.
 updateStatus();
 
 // Define um intervalo de 500 milissegundos
 
 
 /* Função para reiniciar o jogo.
    - Restaura os estados iniciais dos jogadores.
    - Atualiza os tabuleiros, status e placar.
    - Fecha o modal de alerta, se estiver aberto. */
    function restartGame() {
   
     // Reiniciar o tabuleiro do Jogador 1:
     // A função setupPlayer(true) recria o tabuleiro do Jogador 1, reposicionando os navios.
     player1 = setupPlayer(true);
   
     // Reiniciar o tabuleiro do Jogador 2:
     // A função setupPlayer(false) recria o tabuleiro do Jogador 2.
     player2 = setupPlayer(false);
   
     // Atualizar o número de vidas do Jogador 1:
     // A variável player1Lives é definida como o número total de navios do Jogador 1.
     player1Lives = player1Ships.length;
   
     // Atualizar o número de vidas do Jogador 2:
     // A variável player2Lives é definida como o número total de navios do Jogador 2.
     player2Lives = player2Ships.length;
   
     // Definir o jogador inicial:
     // O Jogador 1 começa o jogo, então currentPlayer é definido como 1.
     currentPlayer = 1;
   
     // Atualizar o tabuleiro do Jogador 1 na interface:
     // A função showGrid(true) exibe o tabuleiro do Jogador 1.
     showGrid(true);
   
     // Atualizar o tabuleiro do Jogador 2 na interface:
     // A função showGrid(false) exibe o tabuleiro do Jogador 2.
     showGrid(false);
   
     // Atualizar a mensagem de status:
     // A função updateStatus() altera a mensagem para indicar que o Jogador 1 começa.
     updateStatus();
   
     // Atualizar o placar:
     // A função updateScore() pode ser usada para exibir o número de vidas restantes dos jogadores.
     updateScore();
   
     // Fechar o modal de alerta:
     // Se o modal de alerta de fim de jogo estiver aberto, ele será fechado.
     $('#modalAlert').modal('hide');
   }
   
 
   document.addEventListener('DOMContentLoaded', function () {
     // Busca os nomes dos jogadores armazenados no localStorage
     const player1Name = localStorage.getItem('player1Name') || 'Jogador 1';
     const player2Name = localStorage.getItem('player2Name') || 'Jogador 2';
 
     // Atualiza os elementos da página com os nomes dos jogadores
     document.querySelector('#player1Grid').previousElementSibling.textContent = player1Name; // Atualiza o título do tabuleiro do Jogador 1
     document.querySelector('#player2Grid').previousElementSibling.textContent = player2Name; // Atualiza o título do tabuleiro do Jogador 2
 
     document.getElementById('statusMessage').textContent = `Vez de ${player1Name}`; // Atualiza a mensagem de status para o primeiro jogador
 });
 
 
 
 /* Função para atualizar o placar na interface do jogo.
    Atualiza o número de navios restantes (vidas) de cada jogador. */
    function updateScore() {
     // Atualiza o placar do Jogador 1:
     // O elemento HTML com o ID "player1Score" exibirá o número de vidas restantes do Jogador 1.
     const player1Name = localStorage.getItem('player1Name') || 'Jogador 1';
     document.getElementById("player1Score").textContent = `${player1Name}: ${player1Lives}`;
   
     // Atualiza o placar do Jogador 2:
     // O elemento HTML com o ID "player2Score" exibirá o número de vidas restantes do Jogador 2.
     const player2Name = localStorage.getItem('player2Name') || 'Jogador 2';
     document.getElementById("player2Score").textContent = `${player2Name}: ${player2Lives}`;
     
   }
   
 
 /* Função gridClick para processar o ataque de um jogador ao tabuleiro do oponente.
    Essa função também chama updateScore para atualizar o placar após cada turno. */
    function gridClick(y, x) {
        
    audioAgua.pause(); // Pausa o áudio de Água
    audioFogo.pause(); // Pausa o áudio de Fogo
    audioExplosao.pause(); // Pausa o áudio de Explosão
    
    audioAgua.currentTime = 0; // Coloca o áudio de água para o inicio
    audioFogo.currentTime = 0; // Coloca o áudio de fogo para o inicio
    audioExplosao.currentTime = 0;// Coloca o áudio de explosão para o inicio

     // Verifica se é a vez do Jogador 1
     if (currentPlayer === 1) {
       // Jogador 1 está atacando o tabuleiro do Jogador 2
       if (player2[y][x][0] < 100) { // Verifica se a célula atacada não é água (número < 100 indica navio)
         setImage(y, x, 103, false); // Atualiza a célula do tabuleiro do Jogador 2 com a imagem de ataque bem-sucedido
         var shipNo = player2[y][x][1]; // Obtém o número do navio que foi atingido
         audioFogo.play(); // Da play no aúdio de Fogo
         // Reduz a vida restante do navio atingido
         if (--player2Ships[shipNo][1] === 0) { // Se a vida do navio chegou a zero, ele afundou
           sinkShip(player2, shipNo, false); // Chama a função sinkShip para mostrar o navio afundado no tabuleiro do Jogador 2
 
           audioExplosao.play(); // Da play no aúdio de Explosão
           
           // Exibe um modal informando que o navio foi destruído
           document.getElementById('modal_titulo').innerText = 'Navio Destruído'; // Atualiza o título do modal
           document.getElementById('modal_titulo_div').className = 'modal-header text-success'; // Atualiza o estilo do título
           const player1Name = localStorage.getItem('player1Name') || 'Jogador 1';
           document.getElementById('modal_conteudo').innerText = `${player1Name}` + " afundou o " + shiptypes[player2Ships[shipNo][0]][0] + "!";
           document.getElementById('modal_btn').innerText = 'Voltar'; // Mensagem informando qual navio foi afundado
           document.getElementById('modal_btn').innerText = 'Voltar'; // Texto do botão de retorno no modal
           document.getElementById('modal_btn').className = 'btn btn-success'; // Estilo do botão no modal
           $('#modalAlert').modal('show'); // Mostra o modal
   
           // Verifica se todos os navios do Jogador 2 foram afundados
           if (--player2Lives === 0) {
            document.getElementById('modal_titulo').innerText = 'Jogador 2 Perdeu!'; // Atualiza o título do modal
            document.getElementById('modal_titulo_div').className = 'modal-header text-success'; // Atualiza o estilo do título
            const player1Name = localStorage.getItem('player1Name') || 'Jogador 1';
            document.getElementById('modal_conteudo').innerText = `${player1Name}` + "Venceu, Aperte em 'jogar novamente'\n" + "no final da página para jogar novamente";
            document.getElementById('modal_btn').innerText = 'Voltar'; // Mensagem informando qual navio foi afundado
            document.getElementById('modal_btn').innerText = 'Voltar'; // Texto do botão de retorno no modal
            document.getElementById('modal_btn').className = 'btn btn-success'; // Estilo do botão no modal
            $('#modalAlert').modal('show'); // Mostra o modal
             currentPlayer = 0; // Define currentPlayer como 0 para indicar o fim do jogo
           }
         }
         currentPlayer = 2; // Alterna o turno para o Jogador 2
       } else if (player2[y][x][0] === 100) { // Se a célula clicada contém água
         setImage(y, x, 102, false); // Atualiza a célula com a imagem de água (errou o ataque)
         currentPlayer = 2; // Alterna o turno para o Jogador 2
         audioAgua.play(); // Da play no aúdio de água
       }
     } 
     // Verifica se é a vez do Jogador 2
     else if (currentPlayer === 2) {
       // Jogador 2 está atacando o tabuleiro do Jogador 1
       if (player1[y][x][0] < 100) { // Verifica se a célula atacada não é água (número < 100 indica navio)
         setImage(y, x, 103, true); // Atualiza a célula do tabuleiro do Jogador 1 com a imagem de ataque bem-sucedido
         var shipNo = player1[y][x][1]; // Obtém o número do navio que foi atingido
         audioFogo.play(); // Da play no aúdio de Fogo
         // Reduz a vida restante do navio atingido
         if (--player1Ships[shipNo][1] === 0) { // Se a vida do navio chegou a zero, ele afundou
           sinkShip(player1, shipNo, true); // Chama a função sinkShip para mostrar o navio afundado no tabuleiro do Jogador 1
 
           audioExplosao.play(); // Da play no aúdio de Explosão
 
           // Exibe um modal informando que o navio foi destruído
           document.getElementById('modal_titulo').innerText = 'Navio Destruído'; // Atualiza o título do modal
           document.getElementById('modal_titulo_div').className = 'modal-header text-success'; // Atualiza o estilo do título
           const player2Name = localStorage.getItem('player2Name') || 'Jogador 2';
           document.getElementById('modal_conteudo').innerText = `${player2Name}` + " afundou o " + shiptypes[player1Ships[shipNo][0]][0] + "!"; // Mensagem informando qual navio foi afundado
           document.getElementById('modal_btn').innerText = 'Voltar'; // Texto do botão de retorno no modal
           document.getElementById('modal_btn').className = 'btn btn-success'; // Estilo do botão no modal
           $('#modalAlert').modal('show'); // Mostra o modal
           // Verifica se todos os navios do Jogador 1 foram afundados
           if (--player1Lives === 0) {
            document.getElementById('modal_titulo').innerText = 'Jogador 1 Perdeu!'; // Atualiza o título do modal
            document.getElementById('modal_titulo_div').className = 'modal-header text-success'; // Atualiza o estilo do título
            const player2Name = localStorage.getItem('player2Name') || 'Jogador 2';
            document.getElementById('modal_conteudo').innerText = `${player2Name}` + "Venceu, Aperte em 'jogar novamente'\n" + "no final da página para jogar novamente";
            document.getElementById('modal_btn').innerText = 'Voltar'; // Mensagem informando qual navio foi afundado
            document.getElementById('modal_btn').innerText = 'Voltar'; // Texto do botão de retorno no modal
            document.getElementById('modal_btn').className = 'btn btn-success'; // Estilo do botão no modal
            $('#modalAlert').modal('show'); // Mostra o modal
             currentPlayer = 0; // Define currentPlayer como 0 para indicar o fim do jogo
           }
         }
         currentPlayer = 1; // Alterna o turno para o Jogador 1
       } else if (player1[y][x][0] === 100) { // Se a célula clicada contém água
         setImage(y, x, 102, true); // Atualiza a célula com a imagem de água (errou o ataque)
         currentPlayer = 1; // Alterna o turno para o Jogador 1
         audioAgua.play(); // Da play no aúdio de água
       }
     }
   
     // Após o ataque, atualiza o status do jogo e o placar
     updateStatus();  // Atualiza a mensagem de status (indica de quem é a vez)
     updateScore();   // Atualiza o placar dos jogadores, mostrando o número de navios restantes
     showGrid(currentPlayer === 1);  // Mostra o tabuleiro do Jogador 1 se for a vez dele
     showGrid(currentPlayer === 2);  // Mostra o tabuleiro do Jogador 2 se for a vez dele
   }
   
   /* Atualiza o placar ao iniciar o jogo */
   updateScore();