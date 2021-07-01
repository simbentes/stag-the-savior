//CANVAS
var t = document.getElementById("t");
var jogo = document.getElementById("jogo");
var c = jogo.getContext('2d');

jogo.width = 1280;
jogo.height = 800;


//aplicar tamanho correto dependendo do tamanho da janela ao abrir a página
if (innerWidth / 1.6 < innerHeight) {
    t.style.height = window.innerWidth / 1.6 + "px"
    t.style.width = window.innerWidth + "px"
} else {
    t.style.height = window.innerHeight + "px"
    t.style.width = window.innerHeight * 1.6 + "px"
}


//função que redimensiona o canvas dependendo do tamanho da janela (e mantém o aspect ratio do jogo) 1280/800 = 1.6
// é ativada pelo evento onresize
window.addEventListener("resize", redimensiona);

function redimensiona() {
    if (parseInt(t.style.height) > window.innerHeight || parseInt(t.style.width) < window.innerWidth) {
        t.style.height = window.innerHeight + "px"
        t.style.width = window.innerHeight * 1.6 + "px"
    }

    if (parseInt(t.style.width) > window.innerWidth || parseInt(t.style.height) < window.innerHeight) {
        t.style.width = window.innerWidth + "px"
        t.style.height = window.innerWidth / 1.6 + "px"
    }
    tLargura = parseInt(t.style.width)
    tAltura = parseInt(t.style.height)
}


//VARIÁVEIS

var fps = 60;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;
var audioCol = new Audio("sons/colLenhador.mp3");
var tparado = false;
var tLargura = parseInt(t.style.width);
var tAltura = parseInt(t.style.height);
var movimento_vertical = [], mov_vertical_sentido = [];
var tecla_a = false, tecla_w = false, tecla_d = false, tecla_s = false, tecla_enter = false;
var direcao = "drt";
var seg, min, tempoTotal;
var pontos
var audioMenus = new Audio("sons/tecla1.mp3")
var audioClicou = new Audio("sons/tecla2.mp3")
var audioErro = new Audio("sons/errocompra.mp3")
var hover = 0

var musica = new Audio("sons/vacalourademo1.m4a")
musica.loop = true;

var musicaFim = new Audio("sons/doors.mp3")
musica.loop = true;

var logo = new Image()
logo.src = "imgs/logo.png"

var bomba = new Image()
bomba.src = "imgs/bomba.png"

var creditos1 = new Image()
creditos1.src = "imgs/logoua.png"

var fundoMenu = new Image()
fundoMenu.src = "imgs/background-menu.png"

var melhorP = new Image()
melhorP.src = "imgs/melhor.png"

var fimDoJogo = new Image()
fimDoJogo.src = "imgs/fimdoJogo.png"

var fundo = new Image()
fundo.src = "imgs/jogoback.png"

var fundoPausa = new Image()
fundoPausa.src = "imgs/fundopausa.png"

var fundoLoja = new Image()
fundoLoja.src = "imgs/fundoloja.png"

var botoesPausa = new Image()
botoesPausa.src = "imgs/botoes_pausa.png"

var floresta = new Image()
floresta.src = "imgs/floresta.png"

var arvoreMae = new Image()
arvoreMae.src = "imgs/arvore_mae.png"

var zonaEntrada = new Image()
zonaEntrada.src = "imgs/zona_entrada.png"

var avisoDisparo = new Image()
avisoDisparo.src = "imgs/aviso-disparo.png"

var barraPontos = new Image()
barraPontos.src = "imgs/barratempopontos.png"

var moedaIcon = new Image()
moedaIcon.src = "imgs/moeda_icon.png"


var instruimg = new Image()
instruimg.src = "imgs/instrucoes.png"

var sobreimg = new Image()
sobreimg.src = "imgs/sobre.png"


//LOCAL STORAGE
/*Informações como a melhor pontuação, as moedas e a compra de upgrades vão ser guardadas de forma a que se mantenham
no browser mesmo depois de fechado*/

//se não estiver definida a melhor pontuação, a melhor pontuação é 0
if (localStorage.getItem("melhorPontos") === null)
    localStorage.setItem("melhorPontos", 0);

var melhorPontos = localStorage.getItem("melhorPontos");

if (localStorage.getItem("carteira") === null)
    localStorage.setItem("carteira", 0);

var carteira = localStorage.getItem("carteira");

if (localStorage.getItem("velocidade") === null)
    localStorage.setItem("velocidade", 1)

var upgradeVel = localStorage.getItem("velocidade")

if (localStorage.getItem("tempo") === null)
    localStorage.setItem("tempo", 1)

var upgradeTempo = localStorage.getItem("tempo")

console.log(upgradeTempo)

//OBJETOS

var jogador = {
    img: new Image(),
    x: 200,
    y: 200,
    largura: 124,
    altura: 124,
    spriteX: 0,
    spriteY: 0,
    recorteSprite: function () {
        //Queremos que a colisão do stag mude dependendo do sprite ativo
        if (jogador.spriteY === 0 || jogador.spriteY === 3) {
            sprite_x_removido = 25
            sprite_y_removido = 0
        } else {
            sprite_x_removido = 0
            sprite_y_removido = 25
        }

        //se o stag estiver gigante, as medidas mudam
        if (powerup.ativo && powerup.tipo === 3) {
            sprite_x_removido *= 1.5
            sprite_y_removido *= 1.5
        }
    },
    vel: 5 * upgradeVel,
    andar: false,
    posicionar: function () {
        this.x = nAleatorio(200, 300)
        this.y = nAleatorio(200, 500)
    },

};
jogador.img.src = "imgs/stag.png"

var lenhador = {
    img: [new Image(), new Image(), new Image()],
    num: 16,
    areax: 6000,
    x: [],
    y: [],
    largura: 85,
    altura: 128,
    spriteX: 0,
    spriteY: [],
    vel: 4,
    cor: [],
    posicionar: function () {
        //remover todos os valores do array para um possivel novo jogo
        while (this.x.length > 0) {
            this.x.pop();
            this.y.pop();
            this.cor.pop();
        }

        while (this.spriteY.length < this.num) {
            this.spriteY.push(1)
        }
        //Gerar cor aleatória
        for (let i = 0; i < this.num; i++) {
            corAleatoria = Math.random()
            console.log(corAleatoria)
            if (corAleatoria < 0.94) {
                this.cor.push(0)
            } else if (corAleatoria < 0.99) {
                this.cor.push(2)
            } else {
                this.cor.push(1)
            }
        }

        //posicionar fora da área de jogo, numa posição aleatória
        this.x.push(nAleatorio(1280, this.areax));
        this.y.push(nAleatorio(124, 676));

        // nao permitir que os lenhadores se sobreponham
        let n = 0
        while (n < this.num) {

            let pos_x_temp = nAleatorio(1280, this.areax)
            let pos_y_temp = nAleatorio(124, 676)
            let sobreposicao = false
            for (let item = 0; item < this.num;
                 item++
            ) {
                if (pos_x_temp >= this.x[item] - this.largura &&
                    pos_x_temp <= this.x[item] + this.largura &&
                    pos_y_temp >= this.y[item] - this.altura &&
                    pos_y_temp <= this.y[item] + this.altura) {
                    sobreposicao = true
                    break;
                }
            }
            if (sobreposicao === false) {
                this.x.push(pos_x_temp);
                this.y.push(pos_y_temp);
                n++;
            }
        }
    },
    mover: function () {

        for (let i = 0; i < this.num; i++) {
            animacaoSprite(this.img[this.cor[i]], this.largura * this.spriteX, this.altura * this.spriteY[i], this.largura, this.altura, this.x[i], this.y[i], this.largura, this.altura);
            if (this.x[i] > -40) {
                this.x[i] -= this.vel
            } else {

                pontos.barra -= 3

                pontos.floresta++
                movimento_vertical[i] = 0;


                corAleatoria = Math.random()
                if (corAleatoria < 0.94) {
                    this.cor[i] = 0
                } else if (corAleatoria < 0.99) {
                    this.cor[i] = 2
                } else {
                    this.cor[i] = 1
                }

                n = 0
                while (n !== 1) {
                    let pos_x_temp = nAleatorio(1280, this.areax)
                    let pos_y_temp = nAleatorio(124, 676)
                    let sobreposicao = false;
                    for (item = 0; item < this.num; item++) {
                        if (pos_x_temp >= this.x[item] - this.largura &&
                            pos_x_temp <= this.x[item] + this.largura &&
                            pos_y_temp >= this.y[item] - this.altura &&
                            pos_y_temp <= this.y[item] + this.altura) {
                            console.log("sobreposicao");
                            sobreposicao = true;
                            break;
                        }
                    }
                    if (sobreposicao === false) {
                        this.x[i] = pos_x_temp
                        this.y[i] = pos_y_temp
                        n = 1;
                    }
                }
            }
        }

    },
}
lenhador.img[0].src = "imgs/lenhador.png"
lenhador.img[1].src = "imgs/lenhador1.png"
lenhador.img[2].src = "imgs/lenhador2.png"


var familiar = {
    img: [new Image(), new Image()],
    num: 8,
    x: [],
    y: [],
    largura: 64,
    altura: 96,
    spriteX: 0,
    vel: 1,
    tipo: [],
    posicionar: function () {
        //remover todos os valores do array para um possivel novo jogo
        while (this.x.length > 0) {
            this.x.pop();
            this.y.pop()
        }

        this.x.push(nAleatorio(15, 140));
        this.y.push(nAleatorio(jogo.height, 1600));

        // nao permitir que os familiares se sobreponham
        let n = 0
        while (n < this.num) {
            let pos_x_temp = nAleatorio(15, 140)
            let pos_y_temp = nAleatorio(jogo.height, 1600)
            let sobreposicao = false
            for (let item = 0; item < this.num; item++) {
                if (pos_x_temp >= this.x[item] - this.largura &&
                    pos_x_temp <= this.x[item] + this.largura &&
                    pos_y_temp >= this.y[item] - this.altura &&
                    pos_y_temp <= this.y[item] + this.altura) {
                    console.log("sobreposicao");
                    sobreposicao = true
                    break;
                }
            }
            if (sobreposicao === false) {
                this.x.push(pos_x_temp);
                this.y.push(pos_y_temp);
                n++;
            }
        }
    },
    mover: function () {

        for (let i = 0; i < this.num; i++) {
            if (Math.random() < 0.5) {
                if (this.tipo.length < this.num) {
                    this.tipo.push(0)
                }
            } else {
                if (this.tipo.length < this.num) {
                    this.tipo.push(1)
                }
            }
            animacaoSprite(this.img[this.tipo[i]], 64 * this.spriteX, 0, this.largura, this.altura, this.x[i], this.y[i], this.largura, this.altura);

            if (this.y[i] > 155) {
                this.y[i] -= this.vel
            } else {
                //aumenta a barra. limitar o maximo da barra para não ultrapassar. se for maior que 283 a barra vai para os 303 em vez de somar 20 ao width anterior
                if (pontos.barra < 283) {
                    pontos.barra += 20
                } else {
                    pontos.barra = 303

                }
                pontos.arvore++

                if (Math.random() < 0.5) {
                    this.tipo[i] = 0
                } else {
                    this.tipo[i] = 1
                }

                n = 0
                while (n !== 1) {
                    let pos_x_temp = nAleatorio(15, 140);
                    let pos_y_temp = nAleatorio(jogo.height, 1600);
                    sobreposicao = false;
                    for (item = 0; item < this.num; item++) {
                        if (pos_x_temp >= this.x[item] - this.largura && pos_x_temp <= this.x[item] + this.largura && pos_y_temp >= this.y[item] - this.altura && pos_y_temp <= this.y[item] + this.altura) {
                            console.log("sobreposicao");
                            sobreposicao = true;
                            break;
                        }
                    }
                    if (sobreposicao === false) {
                        this.x[i] = pos_x_temp
                        this.y[i] = pos_y_temp
                        n = 1;
                    }
                }
            }
        }
    }
};
familiar.img[0].src = "imgs/familiar.png"
familiar.img[1].src = "imgs/familiar2.png"


var moeda = {
    img: new Image(),
    audio: new Audio("sons/moeda.mp3"),
    x: -36,
    y: -40,
    largura: 36,
    altura: 40,
    spriteX: 0,
    tempo: nAleatorio(4000, 7000),
    totais: 0,
    timer: function () {
        idmoeda = setTimeout(function () {
            moeda.tempo = nAleatorio(4000, 7000)
            if (Math.random() < 0.5) {
                moeda.x = nAleatorio(200, 1240)
                moeda.y = nAleatorio(300, 750)
            } else {
                moeda.x = -moeda.largura
                moeda.y = -moeda.altura
            }
            //chamar a função de novo com novos tempos
            moeda.timer()
        }, moeda.tempo)
    }
};
moeda.img.src = "imgs/moeda.png"


var loja = {
    botaoSair: new Image(),
    item: [new Image(), new Image(), new Image(), new Image()],
    estado: [localStorage.getItem("item0"), localStorage.getItem("item1"), localStorage.getItem("item2"), localStorage.getItem("item3")],
    ativar: function () {

        cancelAnimationFrame(idpausa)

        jogo.removeEventListener("click", processaBotoesPausa);
        jogo.removeEventListener("click", processaBotoes);
        idloja = requestAnimationFrame(loja.ativar)

        c.drawImage(fundoLoja, 0, 0, jogo.width, jogo.height);

        //se não tiver sido efetuada nenhuma compra, temos de adicionar ao array o valor "comprar"
        for (let i = 0; i < 4; i++) {
            if (loja.estado[i] === null)
                localStorage.setItem("item" + i + "", "comprar");
            loja.estado[i] = localStorage.getItem("item" + i + "")

            loja.item[i].src = "imgs/item" + i + "" + loja.estado[i] + ".png";
            c.drawImage(loja.item[i], 0, 0, jogo.width, jogo.height);
        }

        c.drawImage(loja.botaoSair, 0, 0, jogo.width, jogo.height);


        //mostrar saldo
        c.drawImage(moedaIcon, 1078, 125, 28, 32);
        c.fillText(carteira, 1110, 155);

        document.addEventListener("click", processaBotoesLoja)

    }

};
loja.botaoSair.src = "imgs/loja_sair.png"


var powerup = {
    tipo: 0,
    img: new Image(),
    musica1: new Audio("sons/powerup.mp3"),
    musica2: new Audio("sons/powerup2.mp3"),
    musica3: new Audio("sons/powerup3.mp3"),
    x: -44,
    y: -104,
    largura: 44,
    altura: 104,
    spriteX: 0,
    tempo: nAleatorio(3000, 6000),
    tempoativo: 6000 * upgradeTempo,
    ativo: false,
    timer: function () {
        idpowerup = setTimeout(function () {
            powerup.tempo = nAleatorio(3000, 6000)
            if (powerup.ativo === false) {
                if (Math.random() < 0.4) {
                    powerup.x = nAleatorio(200, 1240)
                    powerup.y = nAleatorio(300, 696)
                } else {
                    powerup.x = -powerup.largura
                    powerup.y = -powerup.altura
                }

            }
            //chamar a função de novo com novo tempo aleatorio
            powerup.timer()
        }, powerup.tempo)
    }
};
powerup.img.src = "imgs/powerup.png"
powerup.musica1.loop = true;
powerup.musica2.loop = true;
powerup.musica3.loop = true;


var nuvem = {
    img: new Image(),
    num: 8,
    x: [],
    y: [],
    tamanho: 1,
    largura: 314,
    lAleatoria: [],
    altura: 1200,
    aAleatoria: [],
    vel: [],
    posicionar: function () {
        for (let i = 0; i <= this.num; i++) {

            this.x.push(nAleatorio(0, jogo.width))
            this.y.push(nAleatorio(0, 130))
            this.tamanho = Math.random() * 0.45 + 0.35
            this.lAleatoria.push(this.largura * this.tamanho);
            this.aAleatoria.push(this.altura * this.tamanho);

            if (this.tamanho < 0.35) {
                this.vel.push(Math.random() * 0.20 + 0.15)
            } else if (this.tamanho < 0.4) {
                this.vel.push(Math.random() * 0.15 + 0.1)
            } else {
                this.vel.push(Math.random() * 0.1 + 0.05)
            }
        }
    },
    mover: function () {
        //número de nuvens defindo pelo nuvens.num
        for (let i = 0; i <= this.num; i++) {
            //Desenho das imagens
            c.drawImage(this.img, this.x[i], this.y[i], this.lAleatoria[i], this.aAleatoria[i]);
            //enquato é visivel na área de jogo, a nuvem anda
            if (this.x[i] > -150) {
                this.x[i] -= this.vel[i]
            } else {
                //gera-se uma nova posição
                this.x[i] = nAleatorio(jogo.width, jogo.width + 1000)
                this.y[i] = nAleatorio(0, 130)
                //define-se um novo tamanho. Este valor vai ser multiplicado pelo tamanho base da nuvem
                this.tamanho = Math.random() * 0.45 + 0.35
                this.lAleatoria[i] = this.largura * this.tamanho
                this.aAleatoria[i] = this.altura * this.tamanho
                //é gerada uma velocidade aleatório tendo em conta o tamanho
                //nuvens mais pequenas andam mais depressa
                if (this.tamanho < 0.35) {
                    this.vel[i] = Math.random() * 0.2 + 0.15
                } else if (this.tamanho < 0.4) {
                    this.vel[i] = Math.random() * 0.15 + 0.1
                } else {
                    this.vel[i] = Math.random() * 0.1 + 0.05
                }
            }
        }
        //se o powerup 1 estiver ativo, todas a nuvens vão ter a vel 40
        if (powerup.ativo && powerup.tipo === 1)
            nuvem.vel.fill(40)
    }
}
nuvem.img.src = "imgs/nuvem1.png"


var tiro = {
    img: new Image(),
    x: -128,
    y: -64,
    largura: 128,
    altura: 64,
    vel: 8,
    spriteX: 0,
    ativo: false,
    mover: function () {
        animacaoSprite(this.img, this.largura * this.spriteX, 0, this.largura, this.altura, this.x, this.y, this.largura, this.altura);
        this.x += this.vel
        if (this.x > jogo.width) {
            this.ativo = false
        }
    }
}
tiro.img.src = "imgs/tiro.png"


var botaoSprite = {
    jogar: 1,
    instru: 0,
    sobre: 0,
    info: 0,
    pause: 0,
    minmax: 0,
    musica: 1,
    sons: 1
}

var idtempo, idSprites


var botao = {
    jogar: new Image(),
    instru: new Image(),
    sobre: new Image(),
    pause: new Image(),
    minmax: new Image(),
    musica: new Image(),
    sons: new Image()
};
botao.jogar.src = "imgs/botaojogar.png"
botao.sobre.src = "imgs/botaosobre.png"
botao.pause.src = "imgs/botaopause.png"
botao.minmax.src = "imgs/botaominmax.png"
botao.instru.src = "imgs/botaoinstru.png"
botao.musica.src = "imgs/botaomusica.png"
botao.sons.src = "imgs/botaosons.png"


//INÍCIO
setTimeout(creditosIniciais, 400);


//fade in e fade out UA
function creditosIniciais() {
    opacidade = 0
    let idfadein = setInterval(function () {
        c.globalAlpha = opacidade;
        c.clearRect(0, 0, 1280, 800);
        c.drawImage(creditos1, 0, 0, jogo.width, jogo.height);
        opacidade += 0.025
        if (opacidade >= 1) {
            clearInterval(idfadein);

            let idfadeout = setInterval(function () {
                c.globalAlpha = opacidade;
                c.clearRect(0, 0, 1280, 800);

                c.drawImage(creditos1, 0, 0, jogo.width, jogo.height);


                opacidade -= 0.025
                if (opacidade <= 0) {
                    c.clearRect(0, 0, 1280, 800);
                    clearInterval(idfadeout);
                    setTimeout(function () {
                        opacidade = 1
                        c.globalAlpha = opacidade;
                        c.clearRect(0, 0, jogo.width, jogo.height);
                        musica.play()
                        menu_iniciar();
                    }, 800)

                }
            }, 1000 / 24)
        }
    }, 1000 / 24)
};


//MENU DO JOGO
function menu_iniciar() {
    idmenu = requestAnimationFrame(menu_iniciar);
    c.drawImage(fundoMenu, 0, 0, jogo.width, jogo.height);
    c.drawImage(logo, 490, 75, 300, 300);
    c.drawImage(botao.jogar, 446 * botaoSprite.jogar, 0, 446, 90, 417, 400, 446, 90);
    c.drawImage(botao.instru, 446 * botaoSprite.instru, 0, 446, 90, 417, 490, 446, 90);
    c.drawImage(botao.sobre, 446 * botaoSprite.sobre, 0, 446, 90, 417, 580, 446, 90);
    c.drawImage(melhorP, jogo.width - 199, 0, 199, 75);
    c.font = "20px 'Press Start 2P'";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText(melhorPontos, jogo.width - 100, 84);
    c.textAlign = "left";
    document.addEventListener("keydown", navegarMenuTeclado);
    jogo.addEventListener("mousemove", navegarMenuOver);
    jogo.addEventListener("click", navegarMenuClique);


}

function instrucoes() {
    cancelAnimationFrame(idmenu)
    document.removeEventListener("keydown", navegarMenuTeclado);
    jogo.removeEventListener("mousemove", navegarMenuOver);
    jogo.removeEventListener("click", navegarMenuClique);
    c.drawImage(fundoMenu, 0, 0, jogo.width, jogo.height);
    c.drawImage(instruimg, 0, 0, jogo.width, jogo.height);
    document.onkeydown = function (event) {
        if (event.key === "Enter") {
            audioClicou.load()
            audioClicou.play()
            document.onkeydown = null;
            menu_iniciar()
        }
    }
    jogo.onclick = function (event) {
        let xrato = event.pageX;
        let yrato = event.pageY;
        if (clique(xrato, yrato, 0.37, 0.63, 0.82, 0.89)) {
            audioClicou.load()
            audioClicou.play()
            jogo.onclick = null;
            menu_iniciar()
        }
    }

}

function sobre() {
    cancelAnimationFrame(idmenu);
    document.removeEventListener("keydown", navegarMenuTeclado);
    jogo.removeEventListener("mousemove", navegarMenuOver);
    jogo.removeEventListener("click", navegarMenuClique);

    c.drawImage(fundoMenu, 0, 0, jogo.width, jogo.height);
    c.drawImage(sobreimg, 0, 0, jogo.width, jogo.height);

    document.onkeydown = function (event) {
        if (event.key === "Enter") {
            audioClicou.load()
            audioClicou.play()
            document.onkeydown = null;
            menu_iniciar()
        }
    }
    jogo.onclick = function (event) {
        let xrato = event.pageX;
        let yrato = event.pageY;
        if (clique(xrato, yrato, 0.37, 0.63, 0.82, 0.89)) {
            audioClicou.load()
            audioClicou.play()
            jogo.onclick = null;
            menu_iniciar()
        }
    }

}

//navegação do menu através de teclado e/ou rato
function navegarMenuTeclado(event) {
    let tecla = event.key

    if (tecla === "ArrowDown" || tecla === "s" || tecla === "S") {
        if (botaoSprite.jogar === 1) {
            botaoSprite.jogar = 0;
            botaoSprite.instru = 1;
            botaoSprite.sobre = 0;
        } else {
            botaoSprite.jogar = 0;
            botaoSprite.instru = 0;
            botaoSprite.sobre = 1;
        }
        audioMenus.load()
        audioMenus.play()
    }

    if (tecla === "ArrowUp" || tecla === "w" || tecla === "W") {
        if (botaoSprite.sobre === 1) {
            botaoSprite.jogar = 0;
            botaoSprite.instru = 1;
            botaoSprite.sobre = 0;
        } else {
            botaoSprite.jogar = 1;
            botaoSprite.instru = 0;
            botaoSprite.sobre = 0;
        }
        audioMenus.load()
        audioMenus.play()
    }


    if (tecla === "Enter" && botaoSprite.jogar === 1) {
        audioClicou.load()
        audioClicou.play()
        jogar()
    }

    if (tecla === "Enter" && botaoSprite.instru === 1) {
        audioClicou.load()
        audioClicou.play()
        instrucoes()
    }

    if (tecla === "Enter" && botaoSprite.sobre === 1) {
        audioClicou.load()
        audioClicou.play()
        sobre()
    }
}

function navegarMenuOver(event) {
    let xrato = event.pageX;
    let yrato = event.pageY;

    //BOTAO JOGAR
    if (clique(xrato, yrato, 0.33, 0.67, 0.51, 0.60)) {
        botaoSprite.jogar = 1;
        botaoSprite.instru = 0;
        botaoSprite.sobre = 0;

        hover++

        if (hover === 1) {
            audioMenus.load()
            audioMenus.play()
        }


    } else if (clique(xrato, yrato, 0.33, 0.67, 0.625, 0.715)) {

        botaoSprite.jogar = 0;
        botaoSprite.instru = 1;
        botaoSprite.sobre = 0;
        hover++
        if (hover === 1) {
            audioMenus.load()
            audioMenus.play()
        }


    } else if (clique(xrato, yrato, 0.33, 0.67, 0.75, 0.83)) {
        botaoSprite.jogar = 0;
        botaoSprite.instru = 0;
        botaoSprite.sobre = 1;
        hover++
        if (hover === 1) {
            audioMenus.load()
            audioMenus.play()
        }

    } else {
        hover = 0
    }

}

function navegarMenuClique(event) {
    let xrato = event.pageX;
    let yrato = event.pageY;

    //BOTAO JOGAR
    if (clique(xrato, yrato, 0.33, 0.67, 0.51, 0.60)) {
        audioClicou.load()
        audioClicou.play()
        jogar()

    }

    //BOTÃO INSTRUÇÕES
    if (clique(xrato, yrato, 0.33, 0.67, 0.625, 0.715)) {
        audioClicou.load()
        audioClicou.play()
        instrucoes()
    }

    //BOTÕES SOBRE
    if (clique(xrato, yrato, 0.33, 0.67, 0.75, 0.83)) {
        audioClicou.load()
        audioClicou.play()
        sobre()

    }


}













//JOGO

function jogar() {
    //Cancelar Menu
    cancelAnimationFrame(idmenu);
    document.removeEventListener("keydown", navegarMenuTeclado);
    jogo.removeEventListener("mousemove", navegarMenuOver);
    jogo.removeEventListener("click", navegarMenuClique);

    //tocar musica
    musica.load()
    musica.play()

    // repor váriaveis para nova partida
    seg = 0
    min = 0
    lenhador.vel = 4
    lenhador.areax = 6000
    tempoTotal = "0:00"
    botaoSprite = {
        jogar: 1,
        instru: 0,
        sobre: 0,
        info: 0,
        pause: 0,
        minmax: 0,
        musica: 0,
        sons: 0
    }

    pontos = {
        arvore: 0,
        mortos: 0,
        floresta: 0,
        totais: 0,
        barra: 303,
        familiaresMortos: 0
    }


    //dificuldade aumenta a cada 30seg
    dificuldade = setInterval(function () {
        lenhador.vel += 0.4

        //diminuir a area de colocação dos lenhadores
        /* o if impede que o jogo bloqueie, pois se a lagura de coloção dos lenhadores for demasiado pequena, o jogo entra
            num ciclo infinito, porque não consegue encontrar uma posição que não esteja em colisao com outra*/
        if (lenhador.areax > 2000) lenhador.areax *= 0.95
    }, 30000)


    while (movimento_vertical.length < lenhador.num) {
        movimento_vertical.push(0)
    }

    //posicionar os difirentes elementos de jogo de forma aleatória
    jogador.posicionar()
    nuvem.posicionar()
    familiar.posicionar()
    lenhador.posicionar()


    animar();
    jogo.addEventListener("click", processaBotoes);


    //apesar de o nosso jogo correr a 60fps, queremos que a animação dos Sprites seja feita a 10 fps
    idSprites = setInterval(function () {
        tiro.spriteX++
        if (tiro.spriteX >= 8) {
            tiro.spriteX = 0

        }


        familiar.spriteX++
        if (familiar.spriteX >= 6) {
            familiar.spriteX = 0
        }

        lenhador.spriteX++
        if (lenhador.spriteX >= 4) {
            lenhador.spriteX = 0

        }

        moeda.spriteX++
        if (moeda.spriteX >= 6) {
            moeda.spriteX = 0
        }

        powerup.spriteX++
        if (powerup.spriteX >= 10) {
            powerup.spriteX = 0

        }


        if (jogador.andar) {
            jogador.spriteX++
            if (jogador.spriteX >= 6) {
                jogador.spriteX = 0
            }


        }


    }, 1000 / 10);


    idtempo = setInterval(tempo, 1000)


    moeda.timer()
    powerup.timer()

    window.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "a":
            case "A":
                tecla_a = true;
                jogador.andar = true;
                break;
            case "w":
            case "W":
                tecla_w = true;
                jogador.andar = true;
                break;
            case "s":
            case "S":
                tecla_s = true;
                jogador.andar = true;
                break;
            case "d":
            case "D":
                tecla_d = true;
                jogador.andar = true;
                break;
            case "Enter":
                tecla_enter = true;
        }

    })

    window.addEventListener("keyup", function (event) {
        switch (event.key) {
            case "a":
            case "A":
                tecla_a = false;
                break;
            case "w":
            case "W":
                tecla_w = false;

                break;
            case "s":
            case "S":
                tecla_s = false;

                break;
            case "d":
            case "D":
                tecla_d = false;

                break;
            case "Enter":
                tecla_enter = false;

        }

        //evitar que o movimento trave quando se levante uma tecla
        //so se todas estiver levantadas é que o movimento para
        if (tecla_a === false && tecla_w === false && tecla_s === false && tecla_d === false) {
            jogador.andar = false;
        }
    })

}


function moveJogador() {


    if (tecla_w && jogador.y > 224 - sprite_y_removido) {
        jogador.y -= jogador.vel
    }

    if (tecla_s && jogador.y < jogo.height - jogador.altura + sprite_y_removido) {
        jogador.y += jogador.vel
    }

    if (tecla_a && jogador.x > -20 - sprite_x_removido) {
        jogador.x -= jogador.vel
        direcao = "esq"
    }

    if (tecla_d && jogador.x < jogo.width - jogador.largura + sprite_x_removido) {
        jogador.x += jogador.vel
        direcao = "drt"
    }


    if (tecla_w && tecla_a === false && tecla_s === false && tecla_d === false) {
        jogador.spriteY = 0
    } else if (tecla_a && tecla_w === false && tecla_s === false && tecla_d === false || tecla_a && tecla_w || tecla_a && tecla_s) {
        jogador.spriteY = 2
    } else if (tecla_s && tecla_w === false && tecla_a === false && tecla_d === false) {
        jogador.spriteY = 3
    } else if (tecla_d && tecla_w === false && tecla_a === false && tecla_s === false || tecla_d && tecla_w || tecla_d && tecla_s) {
        jogador.spriteY = 1
    }


    //diminuir a velocidade na diagonal
    if (tecla_a && tecla_w) {
        jogador.y += jogador.vel / 3
        jogador.x += jogador.vel / 5
    }

    if (tecla_d && tecla_w) {
        jogador.y += jogador.vel / 3
        jogador.x -= jogador.vel / 5
    }

    if (tecla_a && tecla_s) {
        jogador.y -= jogador.vel / 3
        jogador.x += jogador.vel / 5
    }

    if (tecla_d && tecla_s) {
        jogador.y -= jogador.vel / 3
        jogador.x -= jogador.vel / 5
    }

    if (powerup.tipo === 2 && powerup.ativo) {
        if (tecla_enter) {
            if (tiro.ativo === false) {

                tiro.ativo = true
                tiro.x = jogador.x - 20
                tiro.y = jogador.y + 20
            }
        }

    }

}

//ANIMAÇAO DO JOGO
function animar() {
    idAnimar = requestAnimationFrame(animar);
    //Código para definir o número de fps e desta forma evitar que existam diferentes velocidades - RETIRADO DO GITHUB
    //https://gist.github.com/elundmark/38d3596a883521cb24f5
    now = Date.now();
    delta = now - then;

    if (delta > interval) {

        then = now - (delta % interval);


        if (pontos.barra < 0) fimJogo()


        //FUNDO DO JOGO
        c.drawImage(fundo, 0, 0, jogo.width, jogo.height);


        //FAMILIARES
        familiar.mover()

        //ZONA DE ENTRADA DAS BARATAS NA ÁRVORE
        c.drawImage(zonaEntrada, 0, 0, 249, jogo.height);

        //NUVENS
        nuvem.mover()

        //ÁRVORE MÃE
        c.drawImage(arvoreMae, 0, 0, 249, jogo.height);


        //MOEDA
        animacaoSprite(moeda.img, moeda.largura * moeda.spriteX, 0, moeda.largura, moeda.altura, moeda.x, moeda.y, moeda.largura, moeda.altura);


        //POWERUP
        animacaoSprite(powerup.img, powerup.largura * powerup.spriteX, 0, powerup.largura, powerup.altura, powerup.x, powerup.y, powerup.largura, powerup.altura);


        //LENHADOR
        lenhador.mover()

        //TIRO
        if (tiro.ativo) {
            tiro.mover()
        }


        //JOGADOR
        animacaoSprite(jogador.img, jogador.largura * jogador.spriteX, jogador.altura * jogador.spriteY, jogador.largura, jogador.altura, jogador.x, jogador.y, jogador.largura, jogador.altura);
        jogador.recorteSprite()


        //FLORESTA
        c.drawImage(floresta, 0, 0, 74, jogo.height);


        //BARRA DE PONTUAÇÃO
        c.drawImage(barraPontos, jogo.width - 405, 20, 305, 16);
        pontos.barra -= 0.08
        if (pontos.barra > 80) {
            c.fillStyle = "#4f9860";
        } else {
            c.fillStyle = "#c32d37";
        }
        c.fillRect(jogo.width - 404, 21, pontos.barra, 14);


        //AVISO DISPARO
        if (powerup.tipo === 2) c.drawImage(avisoDisparo, 0, 0, jogo.width, jogo.height);


        moveJogador();


        c.font = "600 20px 'Press Start 2P'";
        c.fillStyle = "white";
        c.fillText(tempoTotal, jogo.width - 180, jogo.height - 20);


        pontos.totais = pontos.mortos + pontos.arvore - pontos.floresta;
        if (pontos.totais < 0) {
            pontos.totais = 0
        }

        c.fillText(pontos.totais, jogo.width - 180, jogo.height - 42);

        c.font = "600 25px 'Press Start 2P'";
        c.drawImage(moedaIcon, 875, 40, 28, 32);
        c.fillText(carteira, 905, 70);

        c.drawImage(botao.pause, 71 * botaoSprite.pause, 0, 71, 54, jogo.width - 91, 20, 71, 54);


        // botao para fullscreen
        c.drawImage(botao.minmax, 71 * botaoSprite.minmax, 0, 71, 54, jogo.width - 91, jogo.height - 74, 71, 54);
        if (document.fullscreenElement) {
            botaoSprite.minmax = 1
        } else {
            botaoSprite.minmax = 0
        }


        detectaColisao();


    }
}

//DETECTAR COLISÕES
function detectaColisao() {
//COLISAO LENHADORES -- BARATAS
    //repetir este processo para os "8" familiares
    for (let i = 0; i < familiar.num; i++) {

        //temos de repetir também o processo para o x de lenhadores que existirem
        for (let j = 0; j <= lenhador.num; j++) {
            //se o lenhador interceptar a barata, esta é morta
            if (lenhador.x[j] < familiar.x[i] + familiar.largura &&
                lenhador.x[j] + lenhador.largura > familiar.x[i] &&
                lenhador.y[j] < familiar.y[i] + familiar.altura &&
                lenhador.y[j] + lenhador.altura > familiar.y[i]) {

                pontos.familiaresMortos++
                c.drawImage(bomba, familiar.x[i] + 5, familiar.y[i], 50, 115);

                // gerar novas posições
                if (Math.random() < 0.5) {
                    familiar.tipo[i] = 0
                } else {
                    familiar.tipo[i] = 1
                }

                n = 0
                while (n !== 1) {
                    let pos_x_temp = nAleatorio(15, 140)
                    let pos_y_temp = nAleatorio(jogo.height, 1600)
                    sobreposicao = false;
                    for (item = 0; item < familiar.num; item++) {
                        if (pos_x_temp >= familiar.x[item] - familiar.largura &&
                            pos_x_temp <= familiar.x[item] + familiar.largura &&
                            pos_y_temp >= familiar.y[item] - familiar.altura &&
                            pos_y_temp <= familiar.y[item] + familiar.altura) {
                            sobreposicao = true;
                            break;
                        }
                    }
                    if (sobreposicao === false) {
                        familiar.x[i] = pos_x_temp
                        familiar.y[i] = pos_y_temp
                        n = 1;
                    }
                }

            }
        }
    }


    //COLISAO STAG -- LENHADORES
    for (let i = 0; i <= lenhador.num; i++) {

        if (jogador.x + sprite_x_removido < lenhador.x[i] + lenhador.largura &&
            jogador.x + jogador.largura - sprite_x_removido > lenhador.x[i] &&
            jogador.y + sprite_y_removido < lenhador.y[i] + lenhador.altura &&
            jogador.y + jogador.altura - sprite_y_removido > lenhador.y[i]) {


            c.drawImage(bomba, lenhador.x[i] + 20, lenhador.y[i], 50, 115);


            if (lenhador.cor[i] === 1) {
                for (let j = 0; j <= lenhador.num; j++) {
                    c.drawImage(bomba, lenhador.x[j] + 20, lenhador.y[j], 50, 115);

                }
                pontos.mortos += lenhador.num
                lenhador.posicionar()
                audioCol.load()
                audioCol.play()
            } else if (lenhador.cor[i] === 2) {
                moeda.audio.load()
                moeda.audio.play()
                carteira++
                localStorage.setItem("carteira", carteira)
            } else {
                audioCol.load()
                audioCol.play()
            }

            pontos.mortos++
            corAleatoria = Math.random()
            console.log(corAleatoria)
            if (corAleatoria < 0.94) {
                lenhador.cor[i] = 0
            } else if (corAleatoria < 0.99) {
                lenhador.cor[i] = 2
            } else {
                lenhador.cor[i] = 1
            }


            n = 0
            while (n !== 1) {
                let pos_x_temp = nAleatorio(jogo.width, lenhador.areax)
                let pos_y_temp = nAleatorio(124, 676)
                let sobreposicao = false;
                for (item = 0; item < lenhador.num; item++) {
                    if (pos_x_temp >= lenhador.x[item] - lenhador.largura &&
                        pos_x_temp <= lenhador.x[item] + lenhador.largura &&
                        pos_y_temp >= lenhador.y[item] - lenhador.altura &&
                        pos_y_temp <= lenhador.y[item] + lenhador.altura) {
                        console.log("sobreposicao");
                        sobreposicao = true;
                        break;
                    }
                }
                if (sobreposicao === false) {
                    lenhador.x[i] = pos_x_temp
                    lenhador.y[i] = pos_y_temp
                    console.log(lenhador.y)
                    n = 1;
                }
            }


        }


        //COLISAO TIRO -- LENHADORES
        if (tiro.x < lenhador.x[i] + lenhador.largura &&
            tiro.x + tiro.largura > lenhador.x[i] &&
            tiro.y < lenhador.y[i] + lenhador.altura &&
            tiro.y + tiro.altura > lenhador.y[i]) {

            pontos.mortos++

            if (lenhador.cor[i] === 1) {
                for (let j = 0; j <= lenhador.num; j++) {
                    c.drawImage(bomba, lenhador.x[j] + 20, lenhador.y[j], 50, 115);

                }
                pontos.mortos += lenhador.num
                lenhador.posicionar()
                audioCol.load()
                audioCol.play()
            } else if (lenhador.cor[i] === 2) {
                moeda.audio.load()
                moeda.audio.play()
                carteira++
                localStorage.setItem("carteira", carteira)
            } else {
                audioCol.load()
                audioCol.play()
            }

            tiro.ativo = false
            tiro.x = -tiro.largura
            tiro.y = -tiro.altura
            c.drawImage(bomba, lenhador.x[i] + 15, lenhador.y[i], 50, 115);


            corAleatoria = Math.random()
            console.log(corAleatoria)
            if (corAleatoria < 0.93) {
                lenhador.cor[i] = 0
            } else if (corAleatoria < 0.99) {
                lenhador.cor[i] = 2
            } else {
                lenhador.cor[i] = 1
            }


            n = 0
            while (n !== 1) {
                let pos_x_temp = nAleatorio(jogo.width, lenhador.areax);
                let pos_y_temp = nAleatorio(124, 676);
                let sobreposicao = false;
                for (item = 0; item < lenhador.num; item++) {
                    if (pos_x_temp >= lenhador.x[item] - lenhador.largura &&
                        pos_x_temp <= lenhador.x[item] + lenhador.largura &&
                        pos_y_temp >= lenhador.y[item] - lenhador.altura &&
                        pos_y_temp <= lenhador.y[item] + lenhador.altura) {
                        console.log("sobreposicao");
                        sobreposicao = true;
                        break;
                    }
                }
                if (sobreposicao === false) {
                    lenhador.x[i] = pos_x_temp
                    lenhador.y[i] = pos_y_temp
                    n = 1;
                }
            }


        }


    }


    //SE O STAG PARAR, TEMOS DE FAZER COM QUE O LENHADORES SE DESVIEM DELE
    for (let i = 0; i <= lenhador.num; i++) {
        if (jogador.andar === false) {


            //area da "frente" (lado drt) do stag --- jogador.x + largura + 200
            if (jogador.x + sprite_x_removido + 200 < lenhador.x[i] + lenhador.largura &&
                jogador.x + jogador.largura - sprite_x_removido + 200 > lenhador.x[i] &&
                jogador.y + sprite_y_removido < lenhador.y[i] + lenhador.altura &&
                jogador.y + jogador.altura - sprite_y_removido > lenhador.y[i]) {

                //fazer com que pare de andar na horizontal
                lenhador.x[i] += lenhador.vel

                if (movimento_vertical[i] === 0) {
                    //se a metade do lenhador for menor que a metade do stag, o lenhador sobe. se a metade for maior, desce
                    //mas não podemos deixar que os lenhadores vão para o céu ou saiam da area de jogo. Por ex se a sua posicao final for no ceu, o lenhador vai ser obrigado a descer
                    if (lenhador.y[i] + lenhador.altura / 2 < jogador.y + jogador.altura / 2) {
                        pos_final_temp = jogador.y + sprite_y_removido - lenhador.altura
                        if (pos_final_temp > 140) {
                            mov_vertical_sentido[i] = "sobe"
                        } else {
                            mov_vertical_sentido[i] = "desce"
                        }
                    } else {
                        pos_final_temp = jogador.y - sprite_y_removido + jogador.altura
                        if (pos_final_temp < jogo.height - lenhador.altura) {
                            mov_vertical_sentido[i] = "desce"
                        } else {
                            mov_vertical_sentido[i] = "sobe"
                        }
                    }
                }
                if (mov_vertical_sentido[i] === "desce") {
                    lenhador.y[i] += lenhador.vel
                    //sprite do lenhador que anda para cima
                    if (jogador.andar === false) lenhador.spriteY[i] = 0
                } else if (mov_vertical_sentido[i] === "sobe") {
                    lenhador.y[i] -= lenhador.vel
                    //sprite do lenhador que anda para baixo
                    if (jogador.andar === false) lenhador.spriteY[i] = 3
                }

                movimento_vertical[i]++;


            } else {
                lenhador.spriteY[i] = 1
            }

        } else {
            movimento_vertical[i] = 0;
            lenhador.spriteY[i] = 1
        }

    }

    // STAG APANHA MOEDAS
    if (jogador.x + sprite_x_removido < moeda.x + moeda.largura &&
        jogador.x + jogador.largura - sprite_x_removido > moeda.x &&
        jogador.y + sprite_y_removido < moeda.y + moeda.altura &&
        jogador.y + jogador.altura - sprite_y_removido > moeda.y) {
        moeda.x = -moeda.largura
        moeda.y = -moeda.altura
        moeda.audio.load()
        moeda.audio.play()
        carteira++
        localStorage.setItem("carteira", carteira);
    }


    // STAG APANHA POWERUPS
    if (jogador.x + sprite_x_removido < powerup.x + powerup.largura &&
        jogador.x + jogador.largura - sprite_x_removido > powerup.x &&
        jogador.y + sprite_y_removido < powerup.y + powerup.altura &&
        jogador.y + jogador.altura - sprite_y_removido > powerup.y) {

        powerup.x = -powerup.largura
        powerup.y = -powerup.altura


        setTimeout(terminarPowerUp, powerup.tempoativo)


        powerup.tipo = nAleatorio(1, 3)


        switch (powerup.tipo) {
            case 1:
                jogador.vel = 10
                nuvem.vel.fill(40);
                powerup.musica1.load()
                powerup.musica1.play()
                break;
            case 2:
                fundo.src = "imgs/jogoback2.png"
                zonaEntrada.src = "imgs/zona_entrada2.png"
                powerup.musica2.load()
                powerup.musica2.play()
                break;
            case 3:
                jogador.img.src = "imgs/stag2.png"
                jogador.largura *= 1.5
                jogador.altura *= 1.5
                sprite_x_removido *= 1.5
                sprite_y_removido *= 1.5
                lenhador.vel *= 0.4
                familiar.vel *= 0.4
                nuvem.vel.fill(0.05)
                powerup.musica3.load()
                powerup.musica3.play()

        }

        powerup.ativo = true

        musica.pause()


    }

}

//PAUSA DO JOGO
function menuPausaJogo() {
    botaoSprite.pause = 1
    cancelAnimationFrame(idAnimar)
    idpausa = requestAnimationFrame(menuPausaJogo);

    c.drawImage(botoesPausa, 0, 0, jogo.width, jogo.height);
    c.drawImage(botao.pause, 70 * botaoSprite.pause, 0, 70, 56, jogo.width - 91, 20, 70, 56);


    if (musica.muted) {
        botaoSprite.musica = 1
    } else {
        botaoSprite.musica = 0
    }

    c.drawImage(botao.musica, 210 * botaoSprite.musica, 0, 210, 90, 423, 255, 210, 90);
    c.drawImage(botao.sons, 210 * botaoSprite.sons, 0, 210, 90, 646, 255, 210, 90);


    musica.pause();
    powerup.musica1.pause()
    powerup.musica2.pause()
    powerup.musica3.pause()


    // botao para fullscreen
    c.drawImage(botao.minmax, 70 * botaoSprite.minmax, 0, 70, 56, jogo.width - 91, jogo.height - 74, 70, 56);
    if (document.fullscreenElement) {
        botaoSprite.minmax = 1
    } else {
        botaoSprite.minmax = 0
    }


    jogo.addEventListener("click", processaBotoesPausa);

}

//FIM DO JOGO
function fimJogo() {
    jogo.removeEventListener("click", processaBotoes);
    jogo.removeEventListener("click", processaBotoesPausa);
    jogo.removeEventListener("click", loja.processaBotoes);
    clearInterval(idSprites)
    clearInterval(idtempo)
    clearInterval(dificuldade)
    clearTimeout(idmoeda)
    clearTimeout(idpowerup)
    cancelAnimationFrame(idAnimar)
    musica.pause()
    powerup.musica1.pause()
    powerup.musica2.pause()
    powerup.musica3.pause()
    musicaFim.load()
    musicaFim.play()


    c.font = "25px 'Press Start 2P'";
    c.fillStyle = "white";


    botaoSprite.pause = 1
    c.globalAlpha = 0;


    if (pontos.totais > melhorPontos) {
        localStorage.setItem("melhorPontos", pontos.totais);
    }

    melhorPontos = localStorage.getItem("melhorPontos");

    idfadeoutfim = setInterval(function () {
        c.globalAlpha += 0.01;
        c.fillStyle = "#000000";
        console.log(c.globalAlpha)
        c.fillRect(0, 0, jogo.width, jogo.height);
        if (c.globalAlpha > 0.99) {
            clearTimeout(idfadeoutfim)
            c.font = "25px 'Press Start 2P'";
            c.fillStyle = "white";
            c.textAlign = "center";
            c.drawImage(fimDoJogo, 0, 0, jogo.width, jogo.height)
            c.fillText(pontos.totais, 424, 495);
            c.fillText(melhorPontos, 855, 495);
            c.fillText(pontos.arvore, 335, 360);
            c.fillText(pontos.familiaresMortos, 475, 360);
            c.fillText(pontos.mortos, 876, 360);

        }

    }, 20)
    jogo.addEventListener("click", processaBotoesFim);
}


//PROCESSAR CLIQUE NOS BOTÕES

function processaBotoes(event) {
    let xrato = event.pageX;
    let yrato = event.pageY;


    //se o x do rato for superior ao fim da area de jogo - 50 e o y do rato também, é ativado o fullscreen
    // nao precisamos de fazer entre dois valores porque o onclick é só relativo ao canvas "jogo"


    //clicou no botao para fullscreen do jogo
    if (clique(xrato, yrato, 0.93, 0.985, 0.9, 0.98)) {
        audioClicou.load()
        audioClicou.play()

        if (botaoSprite.minmax === 1) {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msCancelFullScreen) {
                document.msCancelFullScreen();
            }
        } else {
            if (jogo.requestFullscreen) {
                jogo.requestFullscreen()
            } else if (jogo.mozRequestFullScreen) {
                jogo.mozRequestFullScreen();
            } else if (jogo.webkitRequestFullScreen) {
                jogo.webkitRequestFullScreen();
            } else if (jogo.msRequestFullscreen) {
                jogo.msRequestFullscreen();
            }

        }

    }


    //PAUSA
    if (clique(xrato, yrato, 0.93, 0.985, 0.025, 0.08)) {
        audioClicou.load()
        audioClicou.play()
        //
        if (botaoSprite.pause === 1) {
            botaoSprite.pause = 0
            tparado = false
            jogo.removeEventListener("click", processaBotoesPausa)
            cancelAnimationFrame(idpausa)
            animar()
            musica.play();

        } else {
            terminarPowerUp()
            tparado = true
            c.drawImage(fundoPausa, 0, 0, jogo.width, jogo.height);
            menuPausaJogo()
        }
    }
}

function processaBotoesPausa(event) {
    let xrato = event.pageX;
    let yrato = event.pageY;


    //clicou no botao para musica __ percetagens para poder ser responsive
    if (clique(xrato, yrato, 0.333, 0.5, 0.335, 0.42)) {
        audioClicou.load()
        audioClicou.play()
        musica.muted = botaoSprite.musica === 0;
        powerup.musica1.muted = botaoSprite.musica === 0
        powerup.musica2.muted = botaoSprite.musica === 0
        powerup.musica3.muted = botaoSprite.musica === 0
    }


    //clicou no botao para sons
    if (clique(xrato, yrato, 0.507, 0.666, 0.335, 0.42)) {
        audioClicou.load()
        audioClicou.play()

        if (botaoSprite.sons === 0) {
            botaoSprite.sons = 1
            audioClicou.muted = true;
            audioMenus.muted = true;
            audioClicou.muted = true;
            audioCol.muted = true;
            moeda.audio.muted = true;
        } else {
            audioClicou.muted = false;
            audioMenus.muted = false;
            audioClicou.muted = false;
            audioCol.muted = false;
            moeda.audio.muted = false;
            botaoSprite.sons = 0
        }


    }

    //botao loja
    if (clique(xrato, yrato, 0.333, 0.666, 0.455, 0.54)) {
        audioClicou.load()
        audioClicou.play()
        loja.ativar()
    }

    //botao sair
    if (clique(xrato, yrato, 0.333, 0.666, 0.58, 0.665)) {
        audioClicou.load()
        audioClicou.play()
        cancelAnimationFrame(idAnimar)
        cancelAnimationFrame(idpausa)
        clearTimeout(idmoeda)
        clearTimeout(idpowerup)
        clearInterval(idSprites)
        clearInterval(idtempo)
        clearInterval(dificuldade)

        menu_iniciar()
    }


}

function processaBotoesLoja(event) {
    let xrato = event.pageX;
    let yrato = event.pageY;

    if (clique(xrato, yrato, 0.375, 0.625, 0.72, 0.786)) {
        audioClicou.load()
        audioClicou.play()
        cancelAnimationFrame(idloja)
        document.removeEventListener("click", processaBotoesLoja)
        c.clearRect(0, 0, jogo.width, jogo.height);
        c.drawImage(fundoPausa, 0, 0, jogo.width, jogo.height);
        jogo.addEventListener("click", processaBotoesPausa);
        jogo.addEventListener("click", processaBotoes);
        menuPausaJogo();
    }

    if (clique(xrato, yrato, 0.082, 0.266, 0.557, 0.605)) {
        if (loja.estado[0] === "comprar") {
            if (carteira > 50) {

                //retira o valor da compra
                carteira -= 50
                localStorage.setItem("carteira", carteira)

                //Muda a imagem do card para "adquirdo"
                localStorage.setItem("item0", "adquirido")


                loja.estado[0] = localStorage.getItem("item0")
                loja.item[0].src = "imgs/item0" + loja.estado[0] + ".png"

                if (localStorage.getItem("tempo") === 1)
                    localStorage.setItem("tempo", 2)

                upgradeTempo = localStorage.getItem("tempo")
                powerup.tempoativo *= upgradeTempo
                audioClicou.load()
                audioClicou.play()
            } else {
                audioErro.load()
                audioErro.play()
            }

        }


    }

    if (clique(xrato, yrato, 0.305, 0.489, 0.557, 0.605)) {
        if (loja.estado[1] === "comprar") {
            if (carteira > 100) {
                carteira -= 100
                localStorage.setItem("carteira", carteira)

                localStorage.setItem("item1", "adquirido")
                loja.estado[1] = localStorage.getItem("item1")
                loja.item[1].src = "imgs/item1" + loja.estado[1] + ".png";

                if (localStorage.getItem("velocidade") === 1)
                    localStorage.setItem("velocidade", 1.2)

                upgradeVel = localStorage.getItem("velocidade")
                jogador.vel *= upgradeVel
                audioClicou.load()
                audioClicou.play()
            } else {
                audioErro.load()
                audioErro.play()

            }

        }


    }

    if (clique(xrato, yrato, 0.52, 0.704, 0.557, 0.605)) {
        if (loja.estado[2] === "comprar") {
            if (carteira > 250) {
                carteira -= 250
                localStorage.setItem("carteira", carteira)

                localStorage.setItem("item2", "adquirido")
                loja.estado[2] = localStorage.getItem("item2")
                loja.item[2].src = "imgs/item2" + loja.estado[2] + ".png"

                localStorage.setItem("tempo", 3)

                upgradeTempo = localStorage.getItem("tempo")
                powerup.tempoativo *= upgradeTempo
                audioClicou.load()
                audioClicou.play()
            } else {
                audioErro.load()
                audioErro.play()
            }

        }


    }

    if (clique(xrato, yrato, 0.734, 0.916, 0.557, 0.605)) {

        if (loja.estado[3] === "comprar") {
            if (carteira > 500) {
                carteira -= 500
                localStorage.setItem("carteira", carteira)
                localStorage.setItem("item3", "adquirido")
                loja.estado[3] = localStorage.getItem("item3")
                loja.item[3].src = "imgs/item3" + loja.estado[3] + ".png"
                localStorage.setItem("velocidade", 1.5)
                upgradeVel = localStorage.getItem("velocidade")
                jogador.vel *= upgradeVel
                audioClicou.load()
                audioClicou.play()
            } else {
                audioErro.load()
                audioErro.play()
            }

        }


    }


}

function processaBotoesFim(event) {
    let xrato = event.pageX;
    let yrato = event.pageY;

    if (clique(xrato, yrato, 0.355, 0.645, 0.705, 0.785)) {
        window.open("https://twitter.com/intent/tweet?text=A%20minha%20pontuação%20no%20%40StagTheSavior%20foi%3A%20" + pontos.totais + "!%F0%9F%8E%89%20%23Games4Nature%20%23LabMM3%20%23Javascript");
    }

    if (clique(xrato, yrato, 0.375, 0.625, 0.82, 0.89)) {
        jogo.removeEventListener("click", processaBotoesFim);
        musicaFim.pause()
        audioClicou.load()
        audioClicou.play()
        menu_iniciar()
    }


}


//OUTRAS FUNÇÕES

function animacaoSprite(img, sX, sY, sL, sA, dX, dY, dL, dA) {
    c.drawImage(img, sX, sY, sL, sA, dX, dY, dL, dA)
}

function clique(xrato, yrato, xmin, xmax, ymin, ymax) {
    if (xrato > tLargura * xmin + (innerWidth - tLargura) / 2 &&
        xrato < tLargura * xmax + (innerWidth - tLargura) / 2 &&
        yrato > tAltura * ymin + (innerHeight - tAltura) / 2 &&
        yrato < tAltura * ymax + (innerHeight - tAltura) / 2) {
        return true
    }

}

function nAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function tempo() {
    if (tparado === false) {
        seg++
        if (parseInt(seg) < 10) {
            seg = "0" + seg
        }
        if (seg === 60) {
            seg = 0
            min++
            tempoTotal = min + ":00"
        } else {
            tempoTotal = min + ":" + seg
        }


    }

}

function terminarPowerUp() {
    if (powerup.tipo === 3) lenhador.vel /= 0.4
    //REPOR VALORES ORIGINAIS
    familiar.vel = 1
    powerup.tipo = 0
    nuvem.vel.fill(0.3);
    powerup.ativo = false
    jogador.vel = 5 * upgradeVel
    musica.play()
    powerup.musica1.pause()
    powerup.musica2.pause()
    powerup.musica3.pause()
    jogador.img.src = "imgs/stag.png"
    jogador.largura = 124
    jogador.altura = 124
    fundo.src = "imgs/jogoback.png"
    zonaEntrada.src = "imgs/zona_entrada.png"
}
