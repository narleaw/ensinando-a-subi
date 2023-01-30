// variaveis estados do Jogo
var PLAY = 1;
var END = 0;
var gameState = PLAY;

// variavel personagens jogo
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg, restartImg;

// variaveis m usicas do jogo
var jumpSound, checkpointSound, dieSound;

// carregando as imagens que usaremos no jogo;
function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");

  // carregando os Sons
  jumpSound = loadSound("jump.mp3");
  checkpointSound = loadSound("checkpoint.mp3");
  dieSound = loadSound("die.mp3");

}

function setup() {
  // criando a area do jogo
  createCanvas(600, 200);

  // criando o TREX
  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;

  // Criando o chão visivel
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  // criando a animação GameOver
  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  // criando a animação RESTART
  restart = createSprite(300, 140);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  // criando o chão invisivel
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  //criar os grupos de obstáculos e nuvens 
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  console.log("Hello" + 5);

  // criando a area de colisão
  trex.setCollider("circle", 0, 0, 40);
  
  // se debug tiver verdadeiro mostra a area de colisão do TREX com os cactos
  trex.debug = false;

  score = 0;
}

function draw() {
  background(220);
  //exibindo pontuação
  text("Score: " + score, 500, 50);

  console.log("this is ", gameState)

  // estado de Jogo PLAY
  if (gameState === PLAY) {
    gameOver.visible = false
    restart.visible = false

    //Aumentando a velocidade do solo -(4+3* score/100);
    ground.velocityX = -(4 + 3 * score / 100);

    //pontuação
    score = score + Math.round(frameCount / 60);

    if (score > 0 && score % 100 === 0) {
      checkpointSound.play();

    }




    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //pular quando a tecla espaço for pressionada
    if (keyDown("space") && trex.y >= 100) {
      trex.velocityY = -12;
      jumpSound.play();
    }

    //adicionar gravidade
    trex.velocityY = trex.velocityY + 1;

    //gerar as nuvens
    spawnClouds();

    //gerar obstáculos no chão
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play();
    }
  }
  else if (gameState === END) {
    
    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;

    //mudar a animação do trex
   trex.changeAnimation("trex_collided", trex_collided);
    
    //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1); 
   
   
   
   
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }


  //impedir que o trex caia
  trex.collide(invisibleGround);



  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(400, 165, 10, 40);

    // aumentando a velocidade a cada 100 pontos;
    obstacle.velocityX = -(6 + score / 100);

    //gerar obstáculos aleatórios
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }

    //atribua dimensão e tempo de vida aos obstáculos             
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.y = Math.round(random(10, 60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //atribua tempo de vida à variável
    cloud.lifetime = 134;

    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adicionando nuvens ao grupo
    cloudsGroup.add(cloud);
  }
}