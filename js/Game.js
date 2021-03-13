
var game = new Phaser.Game(1600, 800, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('casaPreta', 'assetsDama/CasaPreta.png');
    game.load.image('casaBranca', 'assetsDama/CasaBranca.png');
    //game.load.image('pecaAzul', 'assetsDama/PecaAzul.png');
    //game.load.image('pecaAzulDama', 'assetsDama/DamaAzul.png');
    //game.load.image('pecaLaranja', 'assetsDama/PecaLaranja.png');
    game.load.image('casaSelecionada', 'assetsDama/casaSelecionada.png', 10, 10);
    game.load.spritesheet('pecaLaranja', 'assetsDama/PecaLaranja.png');
    game.load.spritesheet('pecaAzul', 'assetsDama/PecaAzul.png');
    game.load.spritesheet('pecaLaranjaDama', 'assetsDama/PecaLaranjaDama.png');
    game.load.spritesheet('pecaAzulDama', 'assetsDama/PecaAzulDama.png');
}

var casas;
var posicaoTabx = 0, posicaoTaby = 50;
var tabuleiro = [];
var pecas = [];
var auxCasas = 0;
var casaSel = [];
var pecaMorta = [];
var LimitesTabuleiroCima = [1, 3, 5, 7];
var LimitesTabuleiroBaixo = [56, 58, 60, 62];


function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    casas = game.add.group();
    var count = 0;
    for (y = 0; y < 8; y++) {
        for (x = 0; x < 8; x++) {
            if (y % 2) {
                if (x % 2) {
                    game.add.sprite(posicaoTabx + 90 * x, posicaoTaby + 90 * y, 'casaBranca');
                    tabuleiro.push(
                        {
                            PosicaoX: posicaoTabx + 90 * x,
                            PosicaoY: posicaoTaby + 90 * y,
                            Cor: 0,
                            X: x,
                            Y: y,
                            Ocupado: false,
                            Peca: null

                        });

                } else {
                    game.add.sprite(posicaoTabx + 90 * x, posicaoTaby + 90 * y, 'casaPreta');
                    tabuleiro.push(
                        {
                            PosicaoX: posicaoTabx + 90 * x,
                            PosicaoY: posicaoTaby + 90 * y,
                            Cor: 1,
                            X: x,
                            Y: y,
                            Ocupado: false,
                            Peca: null
                        });
                }
            } else {
                if (x % 2) {
                    game.add.sprite(posicaoTabx + 90 * x, posicaoTaby + 90 * y, 'casaPreta');
                    tabuleiro.push(
                        {
                            PosicaoX: posicaoTabx + 90 * x,
                            PosicaoY: posicaoTaby + 90 * y,
                            Cor: 1,
                            X: x,
                            Y: y,
                            Ocupado: false,
                            Peca: null
                        });
                } else {
                    game.add.sprite(posicaoTabx + 90 * x, posicaoTaby + 90 * y, 'casaBranca');
                    tabuleiro.push(
                        {
                            PosicaoX: posicaoTabx + 90 * x,
                            PosicaoY: posicaoTaby + 90 * y,
                            Cor: 0,
                            X: x,
                            Y: y,
                            Ocupado: false,
                            Peca: null
                        });
                }
            }
            var style = { font: "12px Arial", fill: "#FFD700", boundsAlignH: "center", boundsAlignV: "middle" };
            game.add.text(posicaoTabx + 90 * x, posicaoTaby + 90 * y, " " + count++, style);
        }

    }

    for (i = 0; i < 24; i++) {
        if (tabuleiro[i].Cor == 1) {
            pecas = game.add.button(tabuleiro[i].PosicaoX + 6, tabuleiro[i].PosicaoY + 5, 'pecaLaranja', actionOnClick, this, 2, 1, 0);
            pecas.data.Descricao = {
                Tipo: 'Dama',
                Cor: 'Laranja',
                X: tabuleiro[i].X,
                Y: tabuleiro[i].Y,
                IDCasa: i
            }
            tabuleiro[i].Ocupado = true;
            tabuleiro[i].Peca = pecas;
        }
    }

    for (i = 63; i > 39; i--) {
        if (tabuleiro[i].Cor == 1) {
            pecas = game.add.button(tabuleiro[i].PosicaoX + 6, tabuleiro[i].PosicaoY + 5, 'pecaAzul', actionOnClick, this, 0, 0, 3);
            pecas.data.Descricao = {
                Tipo: 'Dama',
                Cor: 'Azul',
                X: tabuleiro[i].X,
                Y: tabuleiro[i].Y,
                IDCasa: i
            }
            tabuleiro[i].Ocupado = true;
            tabuleiro[i].Peca = pecas;
        }
    }
}

function actionOnClick(peca, a, b, c) {

    var CasaNaoSelecionaveisEsquerda = [8,24,40, 56];
    var CasaNaoSelecionaveisDireita = [7, 23, 39, 55];

    var CasaNaoSelecionaveisParaMatarEsquerda = [17, 24, 33, 40, 56];
    var CasaNaoSelecionaveisParaMatarDireita = [14, 23, 39, 55, 30, 46, 62];

    var CasaNaoSelecionaveisParaMatarEsquerdaLaranja = [1, 17, 33, 49];
    var CasaNaoSelecionaveisParaMatarDireitaLaranja = [14, 30, 46];

    var CasaNaoSelecionaveisParaMatarAmbosCima = [1, 3, 5, 7, 8, 10, 12, 14];
    var CasaNaoSelecionaveisParaMatarAmbosBaixo = [49, 51, 53, 55, 56, 58, 60, 62];

    var cor = peca.data.Descricao.Cor
    var IDCasaTab = peca.data.Descricao.IDCasa
    var tipo = peca.data.Descricao.Tipo

    if (casaSel.length > 0)
        casaSel.forEach(function (item) { item.kill(); });

    var AuxCasaSel, posicaoID;

    // Peça Azul
    if (cor == 'Azul' && tipo == "Comum") {
        if (LimitesTabuleiroCima.indexOf(IDCasaTab) == -1) {
            if (!tabuleiro[IDCasaTab - 7].Ocupado && CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) == -1) {
                AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - 7].PosicaoX, tabuleiro[IDCasaTab - 7].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                posicaoID = IDCasaTab - 7;

                AuxCasaSel.data.Descricao = {
                    PecaId: peca,
                    PecaCor: 'Azul',
                    PosicaoId: posicaoID,
                    Status: 'andar'
                }

                casaSel.push(AuxCasaSel);
                AuxCasaSel.scale.setTo(0.95, 0.95);
                AuxCasaSel.alpha = 0.8;

            }
            else if (CasaNaoSelecionaveisParaMatarAmbosCima.indexOf(IDCasaTab) == -1 && CasaNaoSelecionaveisParaMatarDireita.indexOf(IDCasaTab) == -1) {
                if (!tabuleiro[IDCasaTab - 14].Ocupado && !(CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) > -1) && tabuleiro[IDCasaTab - 7].Peca.data.Descricao.Cor == 'Laranja') {
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - 14].PosicaoX, tabuleiro[IDCasaTab - 14].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);

                    posicaoID = IDCasaTab - 14;
                    console.log("Matando Peças Direita");
                    AuxCasaSel.data.Descricao = {
                        PecaId: peca,
                        PecaCor: 'Azul',
                        PosicaoId: posicaoID,
                        Status: 'matar',
                        Vitima: IDCasaTab - 7
                    }
                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;

                }
            }
            if (CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) == -1) {
                if (!tabuleiro[IDCasaTab - 9].Ocupado) {
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - 9].PosicaoX, tabuleiro[IDCasaTab - 9].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                    posicaoID = IDCasaTab - 9;

                    AuxCasaSel.data.Descricao = {
                        PecaId: peca,
                        PecaCor: 'Azul',
                        PosicaoId: posicaoID,
                        Status: 'andar'
                    }

                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;
                } else if (CasaNaoSelecionaveisParaMatarAmbosCima.indexOf(IDCasaTab) == -1 && CasaNaoSelecionaveisParaMatarEsquerda.indexOf(IDCasaTab) == -1) {

                    if (tabuleiro[IDCasaTab - 18].Ocupado == false && CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) == -1 && tabuleiro[IDCasaTab - 9].Peca.data.Descricao.Cor == 'Laranja') {
                        AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - 18].PosicaoX, tabuleiro[IDCasaTab - 18].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                        posicaoID = IDCasaTab - 18;
                        console.log("Matando Peças Esquerda");
                        AuxCasaSel.data.Descricao = {
                            PecaId: peca,
                            PecaCor: 'Azul',
                            PosicaoId: posicaoID,
                            Status: 'matar',
                            Vitima: IDCasaTab - 9
                        }
                        casaSel.push(AuxCasaSel);
                        AuxCasaSel.scale.setTo(0.95, 0.95);
                        AuxCasaSel.alpha = 0.8;

                    }

                }
            }

        }

        //Come Peças para trás Direita
        if (CasaNaoSelecionaveisParaMatarAmbosBaixo.indexOf(IDCasaTab) == -1 && CasaNaoSelecionaveisParaMatarDireita.indexOf(IDCasaTab) == -1) {
            if (!tabuleiro[IDCasaTab + 18].Ocupado && tabuleiro[IDCasaTab + 9].Ocupado && CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) == -1 && CasaNaoSelecionaveisParaMatarDireitaLaranja.indexOf(IDCasaTab) == -1) {
                if (tabuleiro[IDCasaTab + 9].Peca.data.Descricao.Cor == 'Laranja') {
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab + 18].PosicaoX, tabuleiro[IDCasaTab + 18].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                    posicaoID = IDCasaTab + 18;

                    AuxCasaSel.data.Descricao = {
                        PecaId: peca,
                        PecaCor: 'Azul',
                        PosicaoId: posicaoID,
                        Status: 'matar',
                        Vitima: IDCasaTab + 9
                    }
                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;
                }
            }
        }
        //Come Peças para trás Esquerda
        if (CasaNaoSelecionaveisParaMatarAmbosBaixo.indexOf(IDCasaTab) == -1 && CasaNaoSelecionaveisParaMatarEsquerda.indexOf(IDCasaTab) == -1) {
            if (!tabuleiro[IDCasaTab + 14].Ocupado && tabuleiro[IDCasaTab + 7].Ocupado && CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) == -1) {
                if (tabuleiro[IDCasaTab + 7].Peca.data.Descricao.Cor == 'Laranja') {
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab + 14].PosicaoX, tabuleiro[IDCasaTab + 14].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                    posicaoID = IDCasaTab + 14;
                    AuxCasaSel.data.Descricao = {
                        PecaId: peca,
                        PecaCor: 'Azul',
                        PosicaoId: posicaoID,
                        Status: 'matar',
                        Vitima: IDCasaTab + 7
                    }
                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;
                }
            }
        }


    }//Final Peça azul
    else if (cor == 'Laranja' && tipo == "Comum") {//Inicio Peça Laranja Comum
        if (LimitesTabuleiroBaixo.indexOf(IDCasaTab) == -1) {
            if (CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) == -1) {
                if (!tabuleiro[IDCasaTab + 9].Ocupado) {
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab + 9].PosicaoX, tabuleiro[IDCasaTab + 9].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                    posicaoID = IDCasaTab + 9;

                    AuxCasaSel.data.Descricao = {
                        PecaId: peca,
                        PecaCor: 'Azul',
                        PosicaoId: posicaoID,
                        Status: 'andar'
                    }

                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;

                }
                else if (CasaNaoSelecionaveisParaMatarAmbosBaixo.indexOf(IDCasaTab) == -1 && CasaNaoSelecionaveisParaMatarDireita.indexOf(IDCasaTab) == -1) {
                    if (!tabuleiro[IDCasaTab + 18].Ocupado && !(CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) > -1) && tabuleiro[IDCasaTab + 9].Peca.data.Descricao.Cor == 'Azul') {
                        AuxCasaSel = game.add.button(tabuleiro[IDCasaTab + 18].PosicaoX, tabuleiro[IDCasaTab + 18].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);

                        posicaoID = IDCasaTab + 18;
                        console.log("Selecionando para Matar a Direita");
                        AuxCasaSel.data.Descricao = {
                            PecaId: peca,
                            PecaCor: 'Laranja',
                            PosicaoId: posicaoID,
                            Status: 'matar',
                            Vitima: IDCasaTab + 9
                        }
                        casaSel.push(AuxCasaSel);
                        AuxCasaSel.scale.setTo(0.95, 0.95);
                        AuxCasaSel.alpha = 0.8;

                    }
                }
            }

            if (!tabuleiro[IDCasaTab + 7].Ocupado && !(CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) > -1)) {
                AuxCasaSel = game.add.button(tabuleiro[IDCasaTab + 7].PosicaoX, tabuleiro[IDCasaTab + 7].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                posicaoID = IDCasaTab + 7;

                AuxCasaSel.data.Descricao = {
                    PecaId: peca,
                    PecaCor: 'Laranja',
                    PosicaoId: posicaoID,
                    Status: 'andar'
                }

                casaSel.push(AuxCasaSel);
                AuxCasaSel.scale.setTo(0.95, 0.95);
                AuxCasaSel.alpha = 0.8;
            } else if (CasaNaoSelecionaveisParaMatarAmbosBaixo.indexOf(IDCasaTab) == -1 && CasaNaoSelecionaveisParaMatarEsquerda.indexOf(IDCasaTab) == -1) {

                if (tabuleiro[IDCasaTab + 14].Ocupado == false && CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) == -1 && tabuleiro[IDCasaTab + 7].Peca.data.Descricao.Cor == 'Azul') {
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab + 14].PosicaoX, tabuleiro[IDCasaTab + 14].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                    posicaoID = IDCasaTab + 14;
                    console.log("Selecionando para Matar a Esquerda");
                    AuxCasaSel.data.Descricao = {
                        PecaId: peca,
                        PecaCor: 'Laranja',
                        PosicaoId: posicaoID,
                        Status: 'matar',
                        Vitima: IDCasaTab + 7
                    }
                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;

                }

            }


        }

        //Come Peças para trás Direita
        if (CasaNaoSelecionaveisParaMatarAmbosCima.indexOf(IDCasaTab) == -1 && CasaNaoSelecionaveisParaMatarEsquerda.indexOf(IDCasaTab) == -1) {
            if (!tabuleiro[IDCasaTab - 18].Ocupado && tabuleiro[IDCasaTab - 9].Ocupado && CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) == -1 && CasaNaoSelecionaveisParaMatarDireitaLaranja.indexOf(IDCasaTab) == -1) {
                if (tabuleiro[IDCasaTab - 9].Peca.data.Descricao.Cor == 'Azul') {
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - 18].PosicaoX, tabuleiro[IDCasaTab - 18].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                    posicaoID = IDCasaTab - 18;
                    console.log("Selecionando para Matar a Esquerda para trás");
                    AuxCasaSel.data.Descricao = {
                        PecaId: peca,
                        PecaCor: 'Laranja',
                        PosicaoId: posicaoID,
                        Status: 'matar',
                        Vitima: IDCasaTab - 9
                    }
                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;
                }
            }
        }
        //Come Peças para trás Esquerda
        if (CasaNaoSelecionaveisParaMatarAmbosCima.indexOf(IDCasaTab) == -1 && CasaNaoSelecionaveisParaMatarDireita.indexOf(IDCasaTab) == -1) {
            if (!tabuleiro[IDCasaTab - 14].Ocupado && tabuleiro[IDCasaTab - 7].Ocupado && CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) == -1) {
                if (tabuleiro[IDCasaTab - 7].Peca.data.Descricao.Cor == 'Azul') {
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - 14].PosicaoX, tabuleiro[IDCasaTab - 14].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                    posicaoID = IDCasaTab - 14;
                    console.log("Selecionando para Matar a Esquerda para trás");
                    AuxCasaSel.data.Descricao = {
                        PecaId: peca,
                        PecaCor: 'Laranja',
                        PosicaoId: posicaoID,
                        Status: 'matar',
                        Vitima: IDCasaTab - 7
                    }
                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;
                }
            }
        }


    }//Final Peça Laranja
    else if (tipo == "Dama") {
        var DiagonalCima, Diagonal = 9, DamaAndar = true;
        do {//Desenha as casas para diagonal direita baixo

            if (CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) == -1 && LimitesTabuleiroBaixo.indexOf(IDCasaTab) == -1 ) {//[7, 23, 39, 55]
       
                console.log("Selecionando Cada Direita Baixo ..." + (IDCasaTab + Diagonal))
                    if (!tabuleiro[IDCasaTab + Diagonal].Ocupado ) {
                        AuxCasaSel = game.add.button(tabuleiro[IDCasaTab + Diagonal].PosicaoX, tabuleiro[IDCasaTab + Diagonal].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                        posicaoID = IDCasaTab + Diagonal;

                        AuxCasaSel.data.Descricao = {
                            PecaId: peca,
                            PecaCor: 'Azul',
                            PosicaoId: posicaoID,
                            Status: 'andar'
                        }

                        casaSel.push(AuxCasaSel);
                        AuxCasaSel.scale.setTo(0.95, 0.95);
                        AuxCasaSel.alpha = 0.8;

                    }
                
            }
         
            if ( CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) > -1 || CasaNaoSelecionaveisDireita.indexOf(IDCasaTab + Diagonal) > -1 ||
             !(CasaNaoSelecionaveisParaMatarDireita.indexOf(IDCasaTab + Diagonal)) == -1 || LimitesTabuleiroBaixo.indexOf(IDCasaTab ) > -1 ||
              LimitesTabuleiroBaixo.indexOf(IDCasaTab + Diagonal) > -1 || (IDCasaTab - Diagonal) > 62) {
                DamaAndar = false
            } else
                if (tabuleiro[IDCasaTab + Diagonal].Ocupado) {
                    DamaAndar = false
                }
            Diagonal += 9;

        } while (DamaAndar)
        Diagonal = 7;
        DamaAndar = true;
        do {//Desenha as casas para diagonal Esquerda baixo


            console.log("Selecionando Cada Esquerda Baixo ..." + (IDCasaTab + Diagonal))
            if(CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) == -1  && LimitesTabuleiroBaixo.indexOf(IDCasaTab) == -1 ){
            if (!tabuleiro[IDCasaTab + Diagonal].Ocupado  ) {
                AuxCasaSel = game.add.button(tabuleiro[IDCasaTab + Diagonal].PosicaoX, tabuleiro[IDCasaTab + Diagonal].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                posicaoID = IDCasaTab + Diagonal;
               
                AuxCasaSel.data.Descricao = {
                    PecaId: peca,
                    PecaCor: 'Laranja',
                    PosicaoId: posicaoID,
                    Status: 'andar'
                }

                casaSel.push(AuxCasaSel);
                AuxCasaSel.scale.setTo(0.95, 0.95);
                AuxCasaSel.alpha = 0.8;
            }
        }
        /* var CasaNaoSelecionaveisEsquerda = [8,24,40, 56]*/
            if (CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) > -1 || CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab + Diagonal) > -1 ||
             !CasaNaoSelecionaveisParaMatarEsquerda.indexOf(IDCasaTab + Diagonal) == -1 || LimitesTabuleiroBaixo.indexOf(IDCasaTab ) > -1 ||
             LimitesTabuleiroBaixo.indexOf(IDCasaTab + Diagonal) > -1 || (IDCasaTab + Diagonal + 7) > 62) {
                DamaAndar = false
            } else
                if (tabuleiro[IDCasaTab + Diagonal].Ocupado) {
                    DamaAndar = false
                }
                Diagonal += 7;
        } while (DamaAndar)

        //Selecionando casas a cima
        Diagonal = 7
        DamaAndar = true;
        do {////Desenha as casas para diagonal Direita Cima

            console.log("Selecionando Cada Direita Cima ..." + (IDCasaTab + Diagonal))
            if (CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) == -1 && LimitesTabuleiroCima.indexOf(IDCasaTab) == -1 ) {
                if (!tabuleiro[IDCasaTab - Diagonal].Ocupado) {
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - Diagonal].PosicaoX, tabuleiro[IDCasaTab - Diagonal].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                    posicaoID = IDCasaTab - Diagonal;

                    AuxCasaSel.data.Descricao = {
                        PecaId: peca,
                        PecaCor: 'Azul',
                        PosicaoId: posicaoID,
                        Status: 'andar'
                    }

                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;

                

            }else if (CasaNaoSelecionaveisParaMatarAmbosCima.indexOf(IDCasaTab) == -1 && CasaNaoSelecionaveisParaMatarDireita.indexOf(IDCasaTab) == -1) {
                if (!tabuleiro[IDCasaTab - 14].Ocupado && CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) == -1 ) {
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - 14].PosicaoX, tabuleiro[IDCasaTab - 14].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);

                    posicaoID = IDCasaTab - 14;
                    console.log("Matando Peças Direita");
                    AuxCasaSel.data.Descricao = {
                        PecaId: peca,
                        PecaCor: 'Azul',
                        PosicaoId: posicaoID,
                        Status: 'matar',
                        Vitima: IDCasaTab - 7
                    }
                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;

                }else if(tabuleiro[IDCasaTab - 7].Ocupado && tabuleiro[IDCasaTab - 7].Ocupado){
                    DamaAndar = false;
                }
            }
            
        }
            if (CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) > -1 || CasaNaoSelecionaveisDireita.indexOf(IDCasaTab - Diagonal) > -1 || 
            CasaNaoSelecionaveisParaMatarDireita.indexOf(IDCasaTab) > -1 || LimitesTabuleiroCima.indexOf(IDCasaTab) > -1 ||
             (IDCasaTab - Diagonal) < 1) {
                DamaAndar = false
            }/* else
                if (tabuleiro[IDCasaTab - Diagonal].Ocupado) {
                    DamaAndar = false
                }*/
                Diagonal += 7;
        } while (DamaAndar)

        Diagonal = 9;
        DamaAndar = true;
        do {  ////Desenha as casas para diagonal Esquerda Cima
            console.log("Selecionando Cada Esquerda Cima ..." + (IDCasaTab + Diagonal))
            if((CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) == -1)  && LimitesTabuleiroCima.indexOf(IDCasaTab) == -1 ){
            if (!tabuleiro[IDCasaTab - Diagonal].Ocupado ) {
                AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - Diagonal].PosicaoX, tabuleiro[IDCasaTab - Diagonal].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                posicaoID = IDCasaTab - Diagonal;
               
                AuxCasaSel.data.Descricao = {
                    PecaId: peca,
                    PecaCor: 'Laranja',
                    PosicaoId: posicaoID,
                    Status: 'andar'
                }

                casaSel.push(AuxCasaSel);
                AuxCasaSel.scale.setTo(0.95, 0.95);
                AuxCasaSel.alpha = 0.8;
            }else if (CasaNaoSelecionaveisParaMatarAmbosCima.indexOf(IDCasaTab) == -1) {

                if (!tabuleiro[IDCasaTab - 18].Ocupado && CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) == -1 ) {
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - 18].PosicaoX, tabuleiro[IDCasaTab - 18].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                    posicaoID = IDCasaTab - 18;
                    console.log("Matando Peças Esquerda");
                    AuxCasaSel.data.Descricao = {
                        PecaId: peca,
                        PecaCor: 'Azul',
                        PosicaoId: posicaoID,
                        Status: 'matar',
                        Vitima: IDCasaTab - 9
                    }
                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;

                }else if(tabuleiro[IDCasaTab - 9].Ocupado && tabuleiro[IDCasaTab - 9].Ocupado){
                    DamaAndar = false;
                }

            }
        }


            if (CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) > -1 || CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab - Diagonal) > -1 ||
             LimitesTabuleiroCima.indexOf(IDCasaTab) > -1 || LimitesTabuleiroCima.indexOf(IDCasaTab - Diagonal) > -1 ||
              (IDCasaTab - Diagonal) < 1 ) {
                DamaAndar = false
            } /*else
                if (tabuleiro[IDCasaTab - Diagonal].Ocupado) {
                    DamaAndar = false
                }*/
                Diagonal += 9;
        } while (DamaAndar)

    }
}



function actionSelecionarCasa(casa) {

    if (casa.data.Descricao.Status == "matar") {
        pecaMorta.push(tabuleiro[casa.data.Descricao.Vitima].Peca)
        tabuleiro[casa.data.Descricao.Vitima].Ocupado = false;
        tabuleiro[casa.data.Descricao.Vitima].Ocupado = false;
        pecaMorta.forEach(function (item) { item.kill(); });
    }
    casa.data.Descricao.PecaId.x = tabuleiro[casa.data.Descricao.PosicaoId].PosicaoX + 8;
    casa.data.Descricao.PecaId.y = tabuleiro[casa.data.Descricao.PosicaoId].PosicaoY + 5;
    casa.data.Descricao.PecaId.data.Descricao.X = tabuleiro[casa.data.Descricao.PosicaoId].PosicaoX;
    casa.data.Descricao.PecaId.data.Descricao.Y = tabuleiro[casa.data.Descricao.PosicaoId].PosicaoY;
    tabuleiro[casa.data.Descricao.PecaId.data.Descricao.IDCasa].Ocupado = false;
    tabuleiro[casa.data.Descricao.PecaId.data.Descricao.IDCasa].Peca = null;
    casa.data.Descricao.PecaId.data.Descricao.IDCasa = casa.data.Descricao.PosicaoId;
    tabuleiro[casa.data.Descricao.PecaId.data.Descricao.IDCasa].Ocupado = true;
    tabuleiro[casa.data.Descricao.PecaId.data.Descricao.IDCasa].Peca = casa.data.Descricao.PecaId;


    casaSel.forEach(function (item) { item.kill(); });

    if (LimitesTabuleiroCima.indexOf(casa.data.Descricao.PecaId.data.Descricao.IDCasa) > -1 && casa.data.Descricao.PecaId.data.Descricao.Cor == "Azul") {
        casa.data.Descricao.PecaId.data.Descricao.Tipo = "Dama";
        casa.data.Descricao.PecaId.loadTexture('pecaAzulDama');
    } else if (LimitesTabuleiroBaixo.indexOf(casa.data.Descricao.PecaId.data.Descricao.IDCasa) > -1 && casa.data.Descricao.PecaId.data.Descricao.Cor == "Laranja") {
        casa.data.Descricao.PecaId.data.Descricao.Tipo = "Dama";
        casa.data.Descricao.PecaId.loadTexture('pecaLaranjaDama');
    }




}

function update() {



}


