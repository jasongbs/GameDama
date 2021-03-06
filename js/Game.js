
var game = new Phaser.Game(1600, 800, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('casaPreta', 'assetsDama/CasaPreta.png');
    game.load.image('casaBranca', 'assetsDama/CasaBranca.png');
    game.load.image('pecaAzul', 'assetsDama/PecaAzul.png');
    game.load.image('pecaAzulDama', 'assetsDama/DamaAzul.png');
    game.load.image('pecaLaranja', 'assetsDama/PecaLaranja.png');
    game.load.image('casaSelecionada', 'assetsDama/casaSelecionada.png');
}

var casas;
var posicaoTabx = 0, posicaoTaby = 50;
var tabuleiro = [];
var pecas = [];
var auxCasas = 0;
var casaSel = [];
var pecaMorta=[];

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
            game.add.text(posicaoTabx + 90 * x, posicaoTaby + 90 * y, count++, style);
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
            pecas = game.add.button(tabuleiro[i].PosicaoX + 6, tabuleiro[i].PosicaoY + 5, 'pecaAzul', actionOnClick, this, 2, 1, 0);
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
}

function actionOnClick(peca) {
    console.log(peca)
    
    var cor = peca.data.Descricao.Cor
    var IDCasaTab = peca.data.Descricao.IDCasa
    if(casaSel.length>0)
    casaSel.forEach(function (item) { item.kill(); });

    CasaNaoSelecionaveisEsquerda = [0, 8, 24, 32, 40, 48, 56];
    CasaNaoSelecionaveisDireita = [7, 23, 31, 39, 47, 55, 63];
    var AuxCasaSel,posicaoID;
    if (cor == 'Azul') {
        if (!tabuleiro[IDCasaTab - 7].Ocupado && !(CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) > -1)) {
            AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - 7].PosicaoX, tabuleiro[IDCasaTab - 7].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
            posicaoID = IDCasaTab - 7;

            AuxCasaSel.data.Descricao = {
                PecaId: peca,
                PecaCor: 'Azul',
                PosicaoId: posicaoID,
                Status: 'andar'
            }
            casaSel.push(AuxCasaSel);
        }    
        else {
            if (!tabuleiro[IDCasaTab - 14].Ocupado  && !(CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) > -1) && tabuleiro[IDCasaTab - 7].Peca.data.Descricao.Cor=='Laranja'){
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
                
            }
        }
    
          
        

        if (!tabuleiro[IDCasaTab - 9].Ocupado && !(CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) > -1)){
            AuxCasaSel = game.add.button(tabuleiro[IDCasaTab - 9].PosicaoX, tabuleiro[IDCasaTab - 9].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
            posicaoID = IDCasaTab - 9;

            AuxCasaSel.data.Descricao = {
                PecaId: peca,
                PecaCor: 'Azul',
                PosicaoId: posicaoID,
                Status: 'andar'
            }
    
            casaSel.push(AuxCasaSel);
        }else {
            if (!tabuleiro[IDCasaTab - 18].Ocupado  && !(CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) > -1)&& tabuleiro[IDCasaTab - 9].Peca.data.Descricao.Cor=='Laranja'){
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
                
            }
        }

    }//Final Peça azul
    else{//Inicio Peça
        if (!tabuleiro[IDCasaTab + 9].Ocupado && !(CasaNaoSelecionaveisDireita.indexOf(IDCasaTab) > -1) ) {
            AuxCasaSel = game.add.button(tabuleiro[IDCasaTab + 9].PosicaoX, tabuleiro[IDCasaTab + 9].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
            posicaoID = IDCasaTab + 9;

            AuxCasaSel.data.Descricao = {
                PecaId: peca,
                PecaCor: 'Laranja',
                PosicaoId: posicaoID,
                    Vitima: IDCasaTab - 9
            }
    
            casaSel.push(AuxCasaSel);
        }

        if (!tabuleiro[IDCasaTab + 7].Ocupado && !(CasaNaoSelecionaveisEsquerda.indexOf(IDCasaTab) > -1)){
            AuxCasaSel = game.add.button(tabuleiro[IDCasaTab + 7].PosicaoX, tabuleiro[IDCasaTab + 7].PosicaoY, 'casaSelecionada', actionSelecionarCasa, this, 2, 1, 0);
            posicaoID = IDCasaTab + 7;

            AuxCasaSel.data.Descricao = {
                PecaId: peca,
                PecaCor: 'Laranja',
                PosicaoId: posicaoID
            }
    
            casaSel.push(AuxCasaSel);
        }
    }
}

function actionSelecionarCasa(casa) {
    
    if(casa.data.Descricao.Status == "matar"){
        pecaMorta.push( tabuleiro[casa.data.Descricao.Vitima].Peca )
        tabuleiro[casa.data.Descricao.Vitima].Ocupado=false;
        tabuleiro[casa.data.Descricao.Vitima].Ocupado=false;
        pecaMorta.forEach(function (item) { item.kill(); });
    }
    casa.data.Descricao.PecaId.x = tabuleiro[casa.data.Descricao.PosicaoId].PosicaoX +8;
    casa.data.Descricao.PecaId.y = tabuleiro[casa.data.Descricao.PosicaoId].PosicaoY + 5;
    casa.data.Descricao.PecaId.data.Descricao.X = tabuleiro[casa.data.Descricao.PosicaoId].PosicaoX;
    casa.data.Descricao.PecaId.data.Descricao.Y = tabuleiro[casa.data.Descricao.PosicaoId].PosicaoY;
    tabuleiro[casa.data.Descricao.PecaId.data.Descricao.IDCasa].Ocupado = false;
    tabuleiro[casa.data.Descricao.PecaId.data.Descricao.IDCasa].Peca = null;
    casa.data.Descricao.PecaId.data.Descricao.IDCasa = casa.data.Descricao.PosicaoId;
    tabuleiro[casa.data.Descricao.PecaId.data.Descricao.IDCasa].Ocupado = true;
    tabuleiro[casa.data.Descricao.PecaId.data.Descricao.IDCasa].Peca = casa.data.Descricao.PecaId;


    casaSel.forEach(function (item) { item.kill(); });



}

function update() {

}


