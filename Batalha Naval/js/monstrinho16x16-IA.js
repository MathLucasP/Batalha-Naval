/*Declarações Iniciais: O código começa definindo arrays que contêm informações sobre os navios e suas posições. O array ship contém as posições dos navios, enquanto dead armazena as posições dos navios afundados. shiptypes descreve cada tipo de navio com seu nome e quantidade de navios. */
// A variável 'ship' contém informações sobre os navios, onde cada sub-array representa um tipo de navio e suas diferentes posições no tabuleiro.
var ship =  [[[1,5], [1,2,5], [1,2,3,5], [1,2,3,4,5]], [[6,10], [6,7,10], [6,7,8,10], [6,7,8,9,10]]];
/* Informação usada para desenhar os navios afundados */
// A variável 'dead' armazena as posições dos navios que foram afundados, de forma semelhante à variável 'ship'.
var dead = [[[201,203], [201,202,203], [201,202,202,203], [201,202,202,202,203]], [[204,206], [204,205,206], [204,205,205,206], [204,205,205,205,206]]];
/* Descrição dos navios */
// 'shiptypes' é um array que descreve cada tipo de navio: nome, tamanho e quantidade.
var shiptypes = [
    ["Rebocador", 2, 5], // Navio de tamanho 2, 5 unidades
    ["Contratopedeiro", 3, 4], // Navio de tamanho 3, 4 unidades
    ["Cruzador", 4, 3], // Navio de tamanho 4, 3 unidades
    ["Porta-avioes", 5, 2] // Navio de tamanho 5, 2 unidade
 ];

// Cálculo da pontuação total de navios do jogador e do computador
var playerScore = shiptypes.reduce((total, type) => total + type[2], 0); // Total de navios do jogador
var computerScore = shiptypes.reduce((total, type) => total + type[2], 0); // Total de navios do computador

// Definindo as dimensões do tabuleiro
var gridx = 16, gridy = 16; // Dimensões do tabuleiro (16x16)


/*Contadores de Vidas: Variáveis como playerlives e computerlives são usadas para contar quantos navios cada jogador possui. O playflag controla se o jogo está em andamento ou não. */
// Inicializando arrays para armazenar dados dos tabuleiros e dos navios
var player = [], computer = [], playersships = [], computersships = []; // Dados dos tabuleiros e navios
var playerlives = 0, computerlives = 0; // Contadores de vidas dos jogadores
var playflag = true; // Flag para controle do estado do jogo
var statusmsg = ""; // Mensagem de status

var audioAgua = new Audio("./Som/agua.mp3"); //Atribui audio de acerto a água para a variavel, que vai ser usado depois
var audioExplosao = new Audio("./Som/explosao.mp3"); //Atribui audio de explosão para a variavel, que vai ser usado depois
var audioFogo = new Audio("./Som/Fogo.mp3"); //Atribui audio de Fogo para a variavel, que vai ser usado depois

/* Função para precarregar as imagens */
// Inicializa um array para armazenar imagens carregadas
var preloaded = []; 


/*Funções de Precarregamento de Imagens: A função `imagePreload` é responsável por carregar imagens necessárias antes que o jogo comece, evitando atrasos durante a execução.*/ 
// Função que pre-carrega as imagens necessárias para o jogo
function imagePreload() {
    var i, ids = [1,2,3,4,5,6,7,8,9,10,100,101,102,103,201,202,203,204,205,206]; // IDs das imagens
    window.status = "Precarregando as imagens."; // Mensagem de status exibida ao usuário
    for (i = 0; i < ids.length; ++i) {
        var img = new Image, name = "navio" + ids[i] + ".gif"; // Nome do arquivo da imagem
        img.src = "img" + name; // Define a fonte da imagem
        preloaded[i] = img; // Armazena a imagem no array de pré-carregamento
    }
    window.status = ""; // Remove a mensagem de status após o carregamento
}


/*Configuração dos Tabuleiros: `setupPlayer` é uma função crucial que coloca os navios no tabuleiro, garantindo que eles não se sobreponham e que estejam dentro dos limites.*/ 
/* Função para colocar os navios nos quadrados */
// Função que configura a posição dos navios no tabuleiro
function setupPlayer(isPc) {
    var y, x; // Variáveis para os índices do tabuleiro
    grid = []; // Inicializa a matriz do tabuleiro
    for (y = 0; y < gridx; ++y) { // Laço para inicializar cada linha do tabuleiro
        grid[y] = []; // Inicializa uma nova linha
        for (x = 0; x < gridx; ++x)
            grid[y][x] = [100, -1, 0]; // Inicializa cada célula com valores padrão
    }
    var shipno = 0; // Contador de navios
    var s; // Variável para o tipo de navio
    for (s = shiptypes.length - 1; s >= 0; --s) { // Laço para configurar cada tipo de navio
        var i; // Contador de navios
        for (i = 0; i < shiptypes[s][2]; ++i) { // Configura a quantidade de cada tipo de navio
            var d = Math.floor(Math.random() * 2); // Determina a direção do navio (horizontal ou vertical)
            var len = shiptypes[s][1], lx = gridx, ly = gridy, dx = 0, dy = 0; // Define variáveis para o tamanho do navio
            if (d == 0) { // Se horizontal
                lx = gridx - len; // Limita a largura
                dx = 1; // Incrementa em x
            } else { // Se vertical
                ly = gridy - len; // Limita a altura
                dy = 1; // Incrementa em y
            }
            var x, y, ok; // Variáveis para a posição do navio e a verificação de colocação
            do {
                y = Math.floor(Math.random() * ly); // Escolhe uma posição aleatória na vertical dentro do limite permitido.
                x = Math.floor(Math.random() * lx); // Escolhe uma posição aleatória na horizontal dentro do limite permitido.
                var j, cx = x, cy = y; // Coordenadas atuais do navio
                ok = true; // Flag para verificar se a posição é válida
                for (j = 0; j < len; ++j) { // Verifica se o espaço está livre
                    if (grid[cy][cx][0] < 100) { // Se a posição não está livre
                        ok = false; // Não é uma posição válida
                        break; // Sai do laço
                    }
                    cx += dx; // Move para a próxima posição em x
                    cy += dy; // Move para a próxima posição em y
                }
            } while (!ok); // Continua até encontrar uma posição válida
            var j, cx = x, cy = y; // Reinicializa as coordenadas
            for (j = 0; j < len; ++j) { // Coloca o navio no tabuleiro
                grid[cy][cx][0] = ship[d][s][j]; // Define a posição do navio
                grid[cy][cx][1] = shipno; // Armazena o número do navio
                grid[cy][cx][2] = dead[d][s][j]; // Armazena a posição do navio afundado
                cx += dx; // Move para a próxima posição em x
                cy += dy; // Move para a próxima posição em y
            }
            if (isPc) { // Se for o computador
                computersships[shipno] = [s, shiptypes[s][1]]; // Armazena o navio do computador
                computerlives++; // Incrementa a contagem de vidas do computador
            } else { // Se for o jogador
                playersships[shipno] = [s, shiptypes[s][1]]; // Armazena o navio do jogador
                playerlives++; // Incrementa a contagem de vidas do jogador
            }
            shipno++; // Incrementa o contador de navios
        }
    }
    return grid; // Retorna o tabuleiro configurado
}

/* Função para mudar as imagens nos quadrados */
// Função que atualiza a imagem de um quadrado específico no tabuleiro
function setImage(y, x, id, isPc) {
    if (isPc) { // Se for o computador
        computer[y][x][0] = id; // Atualiza a imagem no tabuleiro do computador
        document.images["pc" + y + "_" + x].src = "img/navio" + id + ".gif"; // Atualiza a imagem no DOM
    } else { // Se for o jogador
        player[y][x][0] = id; // Atualiza a imagem no tabuleiro do jogador
        document.images["ply" + y + "_" + x].src = "img/navio" + id + ".gif"; // Atualiza a imagem no DOM
    }
}

/* Função para desenhar o plano cartesiano */
// Função que exibe o tabuleiro, criando a grade de imagens.
function showGrid(isPc) {
    var y, x; // Variáveis para percorrer a grade.
    for (y = 0; y < gridy; ++y) { // Laço para cada linha.
        for (x = 0; x < gridx; ++x) { // Laço para cada coluna.
            if (isPc) // Se for o tabuleiro do computador.
                document.write('<a href="javascript:gridClick(' + y + ',' + x + ');"><img name="pc' + y + '_' + x + '" src="img/navio100.gif" width=30 height=30></a>'); // Cria o link com imagem
            else // Se for o tabuleiro do jogador.
                document.write('<a href="javascript:void(0);"><img name="ply' + y + '_' + x + '" src="img/navio' + player[y][x][0] + '.gif" width=30 height=30></a>'); // Cria o link com imagem
        }
        document.write('<br>'); // Nova linha após cada linha de imagens.
    }
}


/*Interatividade do Jogo: A função `gridClick` trata os cliques nas células do tabuleiro, verificando se um navio foi atingido e atualizando a interface com mensagens de status e imagens correspondentes.
Função para os cliques no plano cartesiano.
Função que trata os cliques no tabuleiro. */
function gridClick(y, x) {
    audioAgua.pause(); // Pausa o áudio de Água
    audioFogo.pause(); // Pausa o áudio de Fogo
    audioExplosao.pause(); // Pausa o áudio de Explosão
    
    audioAgua.currentTime = 0; // Coloca o áudio de água para o inicio
    audioFogo.currentTime = 0; // Coloca o áudio de fogo para o inicio
    audioExplosao.currentTime = 0; // Coloca o áudio de explosão para o inicio

    if (playflag) { // Se o jogo está em andamento.
        if (computer[y][x][0] < 100) { // Se não foi atingido antes.
            setImage(y, x, 103, true); // Marca um acerto.
            var shipno = computer[y][x][1]; // Obtém o número do navio.
            audioFogo.play(); // Da play no aúdio de Fogo
            if (--computersships[shipno][1] == 0) { // Decrementa a quantidade de vidas do navio.
                sinkShip(computer, shipno, true); // Afunda o navio.
                audioExplosao.play(); // Da play no aúdio de Explosão
                /* Exibe mensagem modal informando que um navio foi afundado. */
                document.getElementById('modal_titulo').innerText = 'Navio Destruido';
                document.getElementById('modal_titulo_div').className = 'modal-header text-success';
                document.getElementById('modal_conteudo').innerText = "Voce afundou meu " + shiptypes[computersships[shipno][0]][0] + "!";
                document.getElementById('modal_btn').innerText = 'Voltar';
                document.getElementById('modal_btn').className = 'btn btn-success';
                $('#modalAlert').modal('show'); // Exibe o modal.
                updateStatus(); // Atualiza o placar após afundar um barco.
                if (--computerlives == 0) { // Se não restam vidas do computador.
                    /* Exibe mensagem modal informando que um navio foi afundado. */
                document.getElementById('modal_titulo').innerText = 'IA Perdeu!';
                document.getElementById('modal_titulo_div').className = 'modal-header text-success';
                document.getElementById('modal_conteudo').innerText = "Voce venceu! Aperte em 'jogar novamente'\n" + "no final da página para jogar novamente";
                document.getElementById('modal_btn').innerText = 'Voltar';
                document.getElementById('modal_btn').className = 'btn btn-success';
                $('#modalAlert').modal('show'); // Exibe o modal.
                    playflag = false; // Finaliza o jogo.
                }
            } else {
                updateStatus(); // Atualiza o placar após um acerto.
            }
            if (playflag) computerMove(); // Se o jogo ainda está em andamento, faz a jogada do computador.
        } else if (computer[y][x][0] == 100) { // Se a célula já foi atingida.
            setImage(y, x, 102, true); // Marca um erro.
            audioAgua.play(); // Da play no aúdio de água
            if (playflag) computerMove(); // Se o jogo ainda está em andamento, faz a jogada do computador.
        }
    }
}


/*Inteligência Artificial do Computador: A função `computerMove` implementa uma estratégia simples para que o computador atire nos navios do jogador, tentando atacar de forma lógica baseada nos acertos anteriores.*/ 
/* Função do AI do computador */
// Função que realiza a jogada do computador
function computerMove() {
    playflag = false; // Desativa a permissão de jogada do jogador por ser a vez da IA.
    var x, y, pass; // Variáveis para os índices e passagens.
    var sx, sy; // Variáveis para coordenadas selecionadas.
    var selected = false; // Flag para indicar se uma posição foi selecionada.

    
    audioAgua.pause(); // Pausa o áudio de Água
    audioFogo.pause(); // Pausa o áudio de Fogo
    audioExplosao.pause(); // Pausa o áudio de Explosão
    
    audioAgua.currentTime = 0; // Coloca o áudio de água para o inicio
    audioFogo.currentTime = 0; // Coloca o áudio de fogo para o inicio
    audioExplosao.currentTime = 0; // Coloca o áudio de explosão para o inicio

    /* Faz duas jogadas perto uma da outra */
    for (pass = 0; pass < 2; ++pass) { // Duas tentativas.
        for (y = 0; y < gridy && !selected; ++y) { // Percorre as linhas.
            for (x = 0; x < gridx && !selected; ++x) { // Percorre as colunas.
                /* Explosão nessa posição */
                if (player[y][x][0] == 103) { // Se a célula foi atingida.
                    sx = x; sy = y; // Salva as coordenadas.
                    // Verifica se as posições adjacentes estão livres.
                    var nup = (y > 0 && player[y - 1][x][0] <= 100);
                    var ndn = (y < gridy - 1 && player[y + 1][x][0] <= 100);
                    var nlt = (x > 0 && player[y][x - 1][0] <= 100);
                    var nrt = (x < gridx - 1 && player[y][x + 1][0] <= 100);
                    if (pass == 0) { // Se for a primeira passagem.
                        // Olha por duas explosões para atirar na linha.
                        var yup = (y > 0 && player[y - 1][x][0] == 103);
                        var ydn = (y < gridy - 1 && player[y + 1][x][0] == 103);
                        var ylt = (x > 0 && player[y][x - 1][0] == 103);
                        var yrt = (x < gridx - 1 && player[y][x + 1][0] == 103);
                        if (nlt && yrt) { sx = x - 1; selected = true; }
                        else if (nrt && ylt) { sx = x + 1; selected = true; }
                        else if (nup && ydn) { sy = y - 1; selected = true; }
                        else if (ndn && yup) { sy = y + 1; selected = true; }
                    } else { // Se for a segunda passagem.
                        // Atira em volta de parte atingida.
                        if (nlt) { sx = x - 1; selected = true; }
                        else if (nrt) { sx = x + 1; selected = true; }
                        else if (nup) { sy = y - 1; selected = true; }
                        else if (ndn) { sy = y + 1; selected = true; }
                    }
                }
            }
        }
    }
    //  Atrasa a jogada da IA em 1 segundo. Seria como o pensamento da IA
    if (!selected) { // Se nenhuma posição foi selecionada
        // Escolhe posições aleatórias até encontrar um navio
        do {
            sy = Math.floor(Math.random() * gridy); // Seleciona aleatoriamente a linha
            sx = Math.floor(Math.random() * gridx / 2) * 2 + sy % 2; // Seleciona aleatoriamente a coluna (mantendo alternância)
        } while (player[sy][sx][0] > 100); // Continua até encontrar uma posição válida
    }
    if (player[sy][sx][0] < 100) { // Se atingiu um navio
        setImage(sy, sx, 103, false); // Marca como acerto
        var shipno = player[sy][sx][1]; // Obtém o número do navio
        audioFogo.play(); // Da play no aúdio de Fogo
        if (--playersships[shipno][1] == 0) { // Decrementa a quantidade de vidas do navio
            sinkShip(player, shipno, false); // Afunda o navio
            audioExplosao.play(); // Da play no aúdio de Explosão
            
            // Exibe mensagem modal informando que um navio foi afundado
            document.getElementById('modal_titulo').innerText = 'Navio Destruido';
            document.getElementById('modal_titulo_div').className = 'modal-header text-danger';
            document.getElementById('modal_conteudo').innerText = "Eu afundei seu " + shiptypes[playersships[shipno][0]][0] + "!";
            document.getElementById('modal_btn').innerText = 'Voltar';
            document.getElementById('modal_btn').className = 'btn btn-danger';
            $('#modalAlert').modal('show'); // Exibe o modal
            if (--playerlives == 0) { // Se não restam vidas do jogador
                knowYourEnemy(); // Mostra onde estavam os navios inimigos/* Exibe mensagem modal informando que um navio foi afundado. */
                document.getElementById('modal_titulo').innerText = 'Jogador Perdeu!';
                document.getElementById('modal_titulo_div').className = 'modal-header text-danger';
                document.getElementById('modal_conteudo').innerText = "Eu venci! Aperte em 'jogar novamente'\n" + "no final da página para jogar novamente";
                document.getElementById('modal_btn').innerText = 'Voltar';
                document.getElementById('modal_btn').className = 'btn btn-danger';
                $('#modalAlert').modal('show'); // Exibe o modal.
                playflag = false; // Finaliza o jogo
            }
            updateStatus(); // Atualiza o placar após afundar um barco
        }
    } else { // Se errou
            setImage(sy, sx, 102, false); // Marca como erro
            audioAgua.play(); // Da play no aúdio de água
            updateStatus(); // Atualiza o placar após erro
        }
        playflag = true; // Ativa a permissão para que o jogador possa jogar na sua vez.
    } // Tempo que a IA ficara pensando para jogar. 1 segundos e meio  (1500 milissegundos) de atraso.



/*Funções de Finalização: `sinkShip` e `knowYourEnemy` mostram a imagem do navio afundado e revelam onde estavam os navios do computador, respectivamente.*/ 
/* Quando um navio todo for acertado, mostrar outra imagem */
// Função que mostra a imagem do navio afundado
function sinkShip(grid, shipno, isPc) {
    var y, x; // Variáveis para os índices do tabuleiro
    for (y = 0; y < gridx; ++y) { // Laço para percorrer cada linha
        for (x = 0; x < gridx; ++x) { // Laço para percorrer cada coluna
            if (grid[y][x][1] == shipno) // Se a célula corresponde ao navio afundado
                if (isPc) setImage(y, x, computer[y][x][2], true); // Mostra navio afundado para o computador
                else setImage(y, x, player[y][x][2], false); // Mostra navio afundado para o jogador
        }
    }
}

/* Mostra onde os navios inimigos estavam quando o jogador perde */
// Função que revela onde os navios do computador estavam
function knowYourEnemy() {
    var y, x; // Variáveis para os índices do tabuleiro
    for (y = 0; y < gridx; ++y) { // Laço para percorrer cada linha
        for (x = 0; x < gridx; ++x) { // Laço para percorrer cada coluna
            if (computer[y][x][0] == 103) // Se o navio do computador foi afundado
                setImage(y, x, computer[y][x][2], true); // Mostra o navio afundado
            else if (computer[y][x][0] < 100) // Se o navio ainda está vivo
                setImage(y, x, computer[y][x][0], true); // Mostra o navio restante
        }
    }
}

/*Atualização de Status: A função `updateStatus` atualiza as informações visíveis sobre a contagem de navios restantes de cada jogador.*/ 
/* Mostra quantos navios o computador ainda tem */
// Função que atualiza o status do jogo
function updateStatus() {
    var f = false, i; // Variável de controle para formatação da string
    var s = "O computador "; // Mensagem inicial
    for (i = 0; i < computersships.length; ++i) { // Laço para percorrer os navios do computador
        if (computersships[i][1] > 0) { // Se o navio ainda tem vidas
            if (f) s = s + ", "; else f = true; // Adiciona vírgula para separação
            s = s + shiptypes[computersships[i][0]][0]; // Adiciona o nome do navio
        }
    }
    if (!f) s = s + "nao tem nada, gracas a voce!"; // Se não restam navios
    statusmsg = s; // Atualiza a mensagem de status
    window.status = statusmsg; // Mostra a mensagem de status na janela

    // Atualiza o placar
    document.getElementById('playerScore').innerText = `Jogador: ${playerlives}`; // Atualiza o placar do jogador
    document.getElementById('computerScore').innerText = `Computador: ${computerlives}`; // Atualiza o placar do computador
}

function setStatus() {
    window.status = statusmsg; // Define a mensagem de status
}

/* Inicia o jogo */
// Função que inicializa o jogo
imagePreload(); // Precarrega as imagens
player = setupPlayer(false); // Configura o tabuleiro do jogador
computer = setupPlayer(true); // Configura o tabuleiro do computador
document.write("<center><table><tr><td align=center><p class='heading'>IA</p></td>"+
"<td align=center><p class='heading'>SEU TABULEIRO</p></td></tr><tr><td>");
showGrid(true); // Exibe o tabuleiro do computador
document.write("</td><td>");
showGrid(false); // Exibe o tabuleiro do jogador
document.write("</td></tr></table></center>");
updateStatus(); // Atualiza o status do jogo
setInterval("setStatus();", 500); // Atualiza o status a cada 500 ms


/*Reinício do Jogo: A função `restartGame` permite reiniciar o jogo, redefinindo as variáveis e recarregando a página.*/ 
/* Função para reiniciar o jogo */
// Função que reinicia o jogo
function restartGame() {
    playerScore = shiptypes.reduce((total, type) => total + type[2], 0); // Reinicia o placar do jogador
    computerScore = shiptypes.reduce((total, type) => total + type[2], 0); // Reinicia o placar do computador
    playerlives = computerScore; // Reinicia a contagem de vidas
    computerlives = playerScore; // Reinicia a contagem de vidas do computador
    location.reload(); // Recarrega a página, reiniciando o jogo
}