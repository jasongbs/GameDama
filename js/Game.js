
var game = new Phaser.Game(1700, 950, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('borda', 'assetsDama/Tabuleiro/borda.png');
    game.load.image('casaPreta', 'assetsDama/Tabuleiro/CasaPreta.png');
    game.load.image('casaBranca', 'assetsDama/Tabuleiro/CasaBranca.png');
    game.load.image('casaSelecionada', 'assetsDama/Tabuleiro/casaSelecionada.png', 10, 10);
    game.load.image('laranjaVenceu', 'assetsDama/Encerramento/LaranjaVenceu.png');
    game.load.image('azulVenceu', 'assetsDama/Encerramento/AzulVenceu.png');
    game.load.spritesheet('pecaLaranja', 'assetsDama/Peças/PecaLaranja.png');
    game.load.spritesheet('fundo', 'assetsDama/Tabuleiro/fundo.jpg');
    game.load.spritesheet('pecaAzul', 'assetsDama/Peças/PecaAzul.png');
    game.load.spritesheet('pecaLaranjaDama', 'assetsDama/Peças/PecaLaranjaDama.png');
    game.load.spritesheet('pecaAzulDama', 'assetsDama/Peças/PecaAzulDama.png');
    game.load.audio('movimentoPeca', 'assetsDama/Sons/somPeca.mp3');
    game.load.audio('final', 'assetsDama/Sons/Final.mp3');
    game.load.audio('virouDama', 'assetsDama/Sons/VirouDama.mp3');
    game.load.spritesheet('pecaLaranjaDama', 'assetsDama/Peças/PecaLaranjaDama.png');
}

var emAndamento = true;
var qtdLaranja = 12, qtdAzul = 12;
var jogando;
var casas;
var posicaoTabx = 400, posicaoTaby = 100;
var tabuleiro = [];
var pecas = [];
var auxCasas = 0;
var casaSel = [];
var vitimaEB = [], vitimaEC = [], vitimaDB = [], vitimaDC = [];
var pecaMorta = [];
var LimitesTabuleiroCima = [1, 3, 5, 7];
var LimitesTabuleiroBaixo = [56, 58, 60, 62];
var pecasMortasAzul, pecasMortasLaranja;
var audio;


function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    var image = game.add.image(0, 0, 'fundo');
    image.scale.setTo(2.2, 2.2);
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
                Tipo: 'Comum',
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
                Tipo: 'Comum',
                Cor: 'Azul',
                X: tabuleiro[i].X,
                Y: tabuleiro[i].Y,
                IDCasa: i
            }
            tabuleiro[i].Ocupado = true;
            tabuleiro[i].Peca = pecas;
        }
    }

    var image = game.add.image(posicaoTabx - 70, posicaoTaby - 70, 'borda');
    image.scale.setTo(2.7, 2.7);


}

function actionOnClick(peca) {
    audio = game.add.audio('movimentoPeca');
    var CasaNaoSelecionaveisEsquerda = [8, 24, 40, 56];
    var CasaNaoSelecionaveisDireita = [7, 23, 39, 55];
    var CasaNaoSelecionaveisParaMatarEsquerda = [17, 24, 33, 40, 56];
    var CasaNaoSelecionaveisParaMatarDireita = [14, 23, 39, 55, 30, 46, 62];
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
    if (cor == 'Azul' && tipo == "Comum" && emAndamento) {
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
    else if (cor == 'Laranja' && tipo == "Comum" && emAndamento) {//Inicio Peça Laranja Comum
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
            if (!tabuleiro[IDCasaTab - 18].Ocupado && tabuleiro[IDCasaTab - 9].Ocupado && CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) == -1 && CasaNaoSelecionaveisParaMatarEsquerda.indexOf(IDCasaTab - 9) == -1) {
                if (tabuleiro[IDCasaTab - 9].Peca.data.Descricao.Cor == 'Azul') {
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - 18].PosicaoX, tabuleiro[IDCasaTab - 18].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                    posicaoID = IDCasaTab - 18;
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
    else if (tipo == "Dama" && emAndamento) {
        var DiagonalCima, Diagonal = 9, DamaAndar = true;

        var temp;
        var STOP = false;
        vitimaDB = [];

        do {//Desenha as casas para diagonal direita baixo

            if (CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) == -1 && LimitesTabuleiroBaixo.indexOf(IDCasaTab) == -1) {//[7, 23, 39, 55]
                if (tabuleiro[IDCasaTab + Diagonal].Ocupado == true) {//matar

                    if (CasaNaoSelecionaveisParaMatarAmbosBaixo.indexOf(IDCasaTab) == -1 &&
                        CasaNaoSelecionaveisParaMatarDireita.indexOf(IDCasaTab) == -1 &&
                        cor != tabuleiro[IDCasaTab + Diagonal].Peca.data.Descricao.Cor &&
                        CasaNaoSelecionaveisDireita.indexOf(IDCasaTab + Diagonal) == -1) {
                        if (LimitesTabuleiroBaixo.indexOf(IDCasaTab + Diagonal) == -1 &&
                            tabuleiro[IDCasaTab + Diagonal + 9].Ocupado == false) {

                            AuxCasaSel = game.add.button(tabuleiro[IDCasaTab + Diagonal + 9].PosicaoX, tabuleiro[IDCasaTab + Diagonal + 9].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);


                            posicaoID = IDCasaTab + Diagonal + 9;
                            vitimaDB.push({
                                PecaId: peca,
                                PecaCor: 'Azul',
                                PosicaoId: posicaoID,
                                Status: 'matar',
                                Vitima: IDCasaTab + Diagonal,
                                Direcao: 'DB'
                            });
                            AuxCasaSel.data.Descricao = {
                                PecaId: peca,
                                PecaCor: 'Azul',
                                PosicaoId: posicaoID,
                                Status: 'matar',
                                Vitima: vitimaDB,
                                Direcao: 'DB'
                            }

                            console.log(vitimaDB);

                            casaSel.push(AuxCasaSel);
                            AuxCasaSel.scale.setTo(0.95, 0.95);
                            AuxCasaSel.alpha = 0.8;
                            Diagonal += 9;
                        } else {
                            STOP = true;
                        }
                    } else {
                        STOP = true;
                    }

                } else if (CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) == -1 && LimitesTabuleiroBaixo.indexOf(IDCasaTab) == -1) {//Anda
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab + Diagonal].PosicaoX, tabuleiro[IDCasaTab + Diagonal].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                    posicaoID = IDCasaTab + Diagonal;

                    if (vitimaDB.length == 0) {
                        AuxCasaSel.data.Descricao = {
                            PecaId: peca,
                            PecaCor: 'Azul',
                            PosicaoId: posicaoID,
                            Status: 'andar',
                            Vitima: 'Sem Vitima'
                        }
                    } else {
                        AuxCasaSel.data.Descricao = {
                            PecaId: peca,
                            PecaCor: 'Azul',
                            PosicaoId: posicaoID,
                            Status: 'matar',
                            Vitima: vitimaDB,
                            Direcao: 'DB'
                        }
                    }

                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;


                } else {
                    STOP = true;
                }

                if (CasaNaoSelecionaveisDireita.indexOf(IDCasaTab + Diagonal) >= 0 || LimitesTabuleiroBaixo.indexOf(IDCasaTab + Diagonal) >= 0) {
                    STOP = true;
                }


                Diagonal += 9;

            } else {
                STOP = true;
            }


        } while (STOP != true)


        //Desenha as casas para diagonal direita cima
        vitimaDC = [];
        Diagonal = 7;
        DamaAndar = true;
        STOP = false;
        do {

            if (CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) == -1 && LimitesTabuleiroCima.indexOf(IDCasaTab) == -1){//[7, 23, 39, 55]
                if (tabuleiro[IDCasaTab - Diagonal].Ocupado == true) {

                    if (LimitesTabuleiroCima.indexOf(IDCasaTab - Diagonal) == -1
                        && CasaNaoSelecionaveisParaMatarAmbosCima.indexOf(IDCasaTab) == -1
                        && cor != tabuleiro[IDCasaTab - Diagonal].Peca.data.Descricao.Cor
                        && CasaNaoSelecionaveisDireita.indexOf(IDCasaTab - Diagonal) == -1) {

                        if (tabuleiro[IDCasaTab - Diagonal - 7].Ocupado == false) {
                            AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - Diagonal - 7].PosicaoX, tabuleiro[IDCasaTab - Diagonal - 7].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);

                            posicaoID = IDCasaTab - Diagonal - 7;

                            vitimaDC.push({
                                PecaId: peca,
                                PecaCor: 'Azul',
                                PosicaoId: posicaoID,
                                Status: 'matar',
                                Vitima: IDCasaTab - Diagonal,
                                Direcao: 'DC'
                            });

                            console.log("Matando Peças Direita Cima");
                            AuxCasaSel.data.Descricao = {
                                PecaId: peca,
                                PecaCor: 'Azul',
                                PosicaoId: posicaoID,
                                Status: 'matar',
                                Vitima: vitimaDC,
                                Direcao: 'DC'
                            }

                            console.log(vitimaDC);
                            casaSel.push(AuxCasaSel);
                            AuxCasaSel.scale.setTo(0.95, 0.95);
                            AuxCasaSel.alpha = 0.8;
                            Diagonal += 7;
                        } else {
                            STOP = true;
                        }
                    } else {
                        STOP = true;
                    }

                } else if (CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) == -1 && LimitesTabuleiroCima.indexOf(IDCasaTab) == -1) {//Anda
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - Diagonal].PosicaoX, tabuleiro[IDCasaTab - Diagonal].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                    posicaoID = IDCasaTab - Diagonal;

                    if (vitimaDC.length == 0) {
                        AuxCasaSel.data.Descricao = {
                            PecaId: peca,
                            PecaCor: 'Azul',
                            PosicaoId: posicaoID,
                            Status: 'andar'
                        }
                    } else {
                        AuxCasaSel.data.Descricao = {
                            PecaId: peca,
                            PecaCor: 'Azul',
                            PosicaoId: posicaoID,
                            Status: 'matar',
                            Vitima: vitimaDC,
                            Direcao: 'DC'
                        }
                    }
                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;


                } else {
                    STOP = true;
                }

                if (CasaNaoSelecionaveisDireita.indexOf(IDCasaTab - Diagonal) >= 0 || LimitesTabuleiroCima.indexOf(IDCasaTab - Diagonal) >= 0) {
                    STOP = true;
                }

                Diagonal += 7;

            } else {
                STOP = true;
            }


        } while (STOP != true)


        //Desenha as casas para diagonal esquerda cima
        vitimaEC = [];
        Diagonal = 9;
        DamaAndar = true;
        STOP = false;
        do {
            if (CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) == -1 && LimitesTabuleiroCima.indexOf(IDCasaTab) == -1
                && CasaNaoSelecionaveisDireita.indexOf(IDCasaTab - Diagonal) == -1) {//[7, 23, 39, 55]
                if (tabuleiro[IDCasaTab - Diagonal].Ocupado == true) {
                    if (LimitesTabuleiroCima.indexOf(IDCasaTab - Diagonal) == -1
                        && CasaNaoSelecionaveisParaMatarAmbosCima.indexOf(IDCasaTab) == -1
                        && cor != tabuleiro[IDCasaTab - Diagonal].Peca.data.Descricao.Cor
                        && CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab - Diagonal) == -1) {

                        if (tabuleiro[IDCasaTab - Diagonal - 9].Ocupado == false) {
                            AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - Diagonal - 9].PosicaoX, tabuleiro[IDCasaTab - Diagonal - 9].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                            posicaoID = IDCasaTab - Diagonal - 9;
                            vitimaEC.push({
                                PecaId: peca,
                                PecaCor: 'Azul',
                                PosicaoId: posicaoID,
                                Status: 'matar',
                                Vitima: IDCasaTab - Diagonal,
                                Direcao: 'EC'
                            });

                            console.log("Matando Peças Direita Baixo");
                            AuxCasaSel.data.Descricao = {
                                PecaId: peca,
                                PecaCor: 'Azul',
                                PosicaoId: posicaoID,
                                Status: 'matar',
                                Vitima: vitimaEC,
                                Direcao: 'EC'
                            }

                            console.log(vitimaEC);
                            casaSel.push(AuxCasaSel);
                            AuxCasaSel.scale.setTo(0.95, 0.95);
                            AuxCasaSel.alpha = 0.8;
                            Diagonal += 9;
                        } else {
                            STOP = true;
                        }
                    } else {
                        STOP = true;
                    }

                } else if (CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) == -1 && LimitesTabuleiroCima.indexOf(IDCasaTab) == -1) {//Anda
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - Diagonal].PosicaoX, tabuleiro[IDCasaTab - Diagonal].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                    posicaoID = IDCasaTab - Diagonal;

                    if (vitimaEC.length == 0) {
                        AuxCasaSel.data.Descricao = {
                            PecaId: peca,
                            PecaCor: 'Azul',
                            PosicaoId: posicaoID,
                            Status: 'andar',
                            Vitima: 'Sem Vitima'
                        }
                    } else {
                        AuxCasaSel.data.Descricao = {
                            PecaId: peca,
                            PecaCor: 'Azul',
                            PosicaoId: posicaoID,
                            Status: 'matar',
                            Vitima: vitimaEC,
                            Direcao: 'EC'
                        }
                    }

                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;

                } else {
                    STOP = true;
                }

                if (CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab - Diagonal) >= 0 || LimitesTabuleiroCima.indexOf(IDCasaTab - Diagonal) > -1) {
                    STOP = true;
                }

                Diagonal += 9;

            } else {
                STOP = true;
            }

        } while (STOP != true)

        //Desenha as casas para diagonal esquerda baixo
        vitimaEB = [];
        Diagonal = 7;
        DamaAndar = true;
        STOP = false;
        do {

            if (CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) == -1 && LimitesTabuleiroBaixo.indexOf(IDCasaTab) == -1) {//[7, 23, 39, 55]
                if (tabuleiro[IDCasaTab + Diagonal].Ocupado == true) {//matar
                    if (CasaNaoSelecionaveisParaMatarAmbosBaixo.indexOf(IDCasaTab) == -1
                        && CasaNaoSelecionaveisParaMatarEsquerda.indexOf(IDCasaTab) == -1
                        && cor != tabuleiro[IDCasaTab + Diagonal].Peca.data.Descricao.Cor
                        && CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab + Diagonal) == -1
                        && LimitesTabuleiroBaixo.indexOf(IDCasaTab + Diagonal) == -1) {

                        if (tabuleiro[IDCasaTab + Diagonal + 7].Ocupado == false) {
                            AuxCasaSel = game.add.button(tabuleiro[IDCasaTab + Diagonal + 7].PosicaoX, tabuleiro[IDCasaTab + Diagonal + 7].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);

                            posicaoID = IDCasaTab + Diagonal + 7;

                            vitimaEB.push({
                                PecaId: peca,
                                PecaCor: 'Azul',
                                PosicaoId: posicaoID,
                                Status: 'matar',
                                Vitima: IDCasaTab + Diagonal,
                                Direcao: 'EB'
                            });

                            console.log("Matando Peças Direita Baixo");
                            AuxCasaSel.data.Descricao = {
                                PecaId: peca,
                                PecaCor: 'Azul',
                                PosicaoId: posicaoID,
                                Status: 'matar',
                                Vitima: vitimaEB,
                                Direcao: 'EB'
                            }

                            console.log(vitimaEB);
                            casaSel.push(AuxCasaSel);
                            AuxCasaSel.scale.setTo(0.95, 0.95);
                            AuxCasaSel.alpha = 0.8;
                            Diagonal += 7;
                        } else {
                            STOP = true;
                        }
                    } else {
                        STOP = true;
                    }

                } else if (CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) == -1 && LimitesTabuleiroBaixo.indexOf(IDCasaTab) == -1) {//Anda
                    AuxCasaSel = game.add.button(tabuleiro[IDCasaTab + Diagonal].PosicaoX, tabuleiro[IDCasaTab + Diagonal].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
                    posicaoID = IDCasaTab + Diagonal;

                    if (vitimaEB.length == 0) {
                        AuxCasaSel.data.Descricao = {
                            PecaId: peca,
                            PecaCor: 'Azul',
                            PosicaoId: posicaoID,
                            Status: 'andar',
                            Vitima: 'Sem Vitima'
                        }
                    } else {
                        AuxCasaSel.data.Descricao = {
                            PecaId: peca,
                            PecaCor: 'Azul',
                            PosicaoId: posicaoID,
                            Status: 'matar',
                            Vitima: vitimaEB,
                            Direcao: 'EB'
                        }
                    }

                    casaSel.push(AuxCasaSel);
                    AuxCasaSel.scale.setTo(0.95, 0.95);
                    AuxCasaSel.alpha = 0.8;

                } else {
                    STOP = true;
                }

                if (CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab + Diagonal) >= 0 || LimitesTabuleiroBaixo.indexOf(IDCasaTab + Diagonal) >= 0) {
                    STOP = true;
                }

                Diagonal += 7;

            } else {
                STOP = true;
            }

        } while (STOP != true)

    }

}

function verificaMatarOuAndar(casa) {
    if (casa.data.Descricao.Status == "matar" && casa.data.Descricao.Direcao == "DB" || casa.data.Descricao.Direcao == "EB") {
        casa.data.Descricao.Vitima.forEach(
            function (vitimaSelecionada) {
                if (casa.data.Descricao.PosicaoId > vitimaSelecionada.Vitima) {
                    pecaMorta.push(tabuleiro[vitimaSelecionada.Vitima].Peca)

                    if (tabuleiro[vitimaSelecionada.Vitima].Peca.data.Descricao.Cor == "Laranja") {
                        qtdLaranja--;
                        desenhaMortos("Laranja");
                    } else if (tabuleiro[vitimaSelecionada.Vitima].Peca.data.Descricao.Cor == "Azul") {
                        qtdAzul--;
                        desenhaMortos("Azul");
                    }
                    tabuleiro[vitimaSelecionada.PosicaoId].Ocupado = false;

                    tabuleiro[vitimaSelecionada.Vitima].Ocupado = false;
                    tabuleiro[vitimaSelecionada.Vitima].Peca = null;
                    pecaMorta.forEach(function (item) {

                        item.kill();

                    });
                }
            });
    } else if (casa.data.Descricao.Status == "matar" && casa.data.Descricao.Direcao == "DC" || casa.data.Descricao.Direcao == "EC") {
        casa.data.Descricao.Vitima.forEach(
            function (vitimaSelecionada) {
                if (casa.data.Descricao.PosicaoId < vitimaSelecionada.Vitima) {
                    pecaMorta.push(tabuleiro[vitimaSelecionada.Vitima].Peca)

                    if (tabuleiro[vitimaSelecionada.Vitima].Peca.data.Descricao.Cor == "Laranja") {
                        qtdLaranja--;
                        desenhaMortos("Laranja");
                    } else if (tabuleiro[vitimaSelecionada.Vitima].Peca.data.Descricao.Cor == "Azul") {
                        qtdAzul--;
                        desenhaMortos("Azul");
                    }
                    tabuleiro[vitimaSelecionada.PosicaoId].Ocupado = false;

                    tabuleiro[vitimaSelecionada.Vitima].Ocupado = false;
                    tabuleiro[vitimaSelecionada.Vitima].Peca = null;

                    pecaMorta.forEach(function (item) {

                        item.kill();
                    });
                }
            });
    } else if (casa.data.Descricao.Status == "matar") {
        pecaMorta.push(tabuleiro[casa.data.Descricao.Vitima].Peca)
        if (tabuleiro[casa.data.Descricao.Vitima].Peca.data.Descricao.Cor == "Laranja") {
            qtdLaranja--;
            desenhaMortos("Laranja");
        } else if (tabuleiro[casa.data.Descricao.Vitima].Peca.data.Descricao.Cor == "Azul") {
            qtdAzul--;
            desenhaMortos("Azul");
        }
        tabuleiro[casa.data.Descricao.Vitima].Ocupado = false;
        tabuleiro[casa.data.Descricao.Vitima].Ocupado = false;

        pecaMorta.forEach(function (item) {
            item.kill();
        });
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
        audio = game.add.audio('virouDama');
        audio.play();
        casa.data.Descricao.PecaId.data.Descricao.Tipo = "Dama";
        casa.data.Descricao.PecaId.loadTexture('pecaAzulDama');
    } else if (LimitesTabuleiroBaixo.indexOf(casa.data.Descricao.PecaId.data.Descricao.IDCasa) > -1 && casa.data.Descricao.PecaId.data.Descricao.Cor == "Laranja") {
        audio = game.add.audio('virouDama');
        audio.play();
        casa.data.Descricao.PecaId.data.Descricao.Tipo = "Dama";
        casa.data.Descricao.PecaId.loadTexture('pecaLaranjaDama');
    }

}

function desenhaMortos(cor) {
    if (cor == 'Laranja')
        var image = game.add.image(1250, (150 + (12 - qtdLaranja) * 50), 'pecaLaranja');
    else if (cor == 'Azul')
        var image = game.add.image(200, (150 + (12 - qtdAzul) * 50), 'pecaAzul');
}

function actionSelecionarCasa(casa) {
    audio.play();
    verificaMatarOuAndar(casa);
}

function update() {

    if (qtdLaranja == 0 && emAndamento == true) {
        audio = game.add.audio('final');
        audio.play();
        emAndamento = false;
        var image = game.add.image(posicaoTabx, posicaoTaby, 'azulVenceu');
        image.scale.setTo(1.55, 1.55);
    } else if (qtdAzul == 0 && emAndamento == true) {
        audio = game.add.audio('final');
        audio.play();
        emAndamento = false;
        var image = game.add.image(posicaoTabx, posicaoTaby, 'laranjaVenceu');
        image.scale.setTo(1.55, 1.55);
    }
}


