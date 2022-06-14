var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score;
var trex ,trex_running,trex_collided;
var cloud,cloudImage,cloudsGroup;
var ground,groundImage,invisibleGround;
var obstaclesGroup,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var gameOverImg,restartImg;
var jumpSound,dieSound,checkPointSound;

function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
groundImage = loadImage("ground2.png");
cloudImage = loadImage("cloud.png");
obstacle1 = loadImage("obstacle1.png");
obstacle2 = loadImage("obstacle2.png");
obstacle3 = loadImage("obstacle3.png");
obstacle4 = loadImage("obstacle4.png");
obstacle5 = loadImage("obstacle5.png");
obstacle6 = loadImage("obstacle6.png");
gameOverImg = loadImage("gameOver.png");
restartImg = loadImage("restart.png");

jumpSound = loadSound("jump.mp3");
dieSound = loadSound("die.mp3");
checkPointSound = loadSound("checkpoint.mp3");
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  
  
  trex = createSprite(50,windowHeight-90,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5

  ground = createSprite(windowWidth/2,windowHeight,1200,10);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  invisibleGround = createSprite(300,windowHeight+17,600,40);
  invisibleGround.visible = false;

  gameOver = createSprite(windowWidth/2,windowHeight/2-20, 400,20);
  gameOver.addImage(gameOverImg);
  restart = createSprite(windowWidth/2,windowHeight/2+20);
  restart.addImage(restartImg);
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  trex.setCollider("circle",0,0,40);
  //trex.debug = true;
  score = 0;

}

function draw(){
  background("white");
  text("score:" + score,1200,30)
if(gameState === PLAY){
  gameOver.visible = false;
  restart.visible = false;

ground.velocityX = -(4 + 3* score%100);
//ground.velocityX = -20
score = score + Math.round(getFrameRate()/60);
if(score > 0 && score%500 === 0){
  checkPointSound.play();
}

if(ground.x < 0){
ground.x = ground.width/2;
}

if(keyDown("space")&& trex.y >=600){
  trex.velocityY = -10;
  //jumpSound.play();
  touches = []
}

trex.velocityY = trex.velocityY +0.8
spawnObstacles();

spawnClouds();

if(obstaclesGroup.isTouching(trex)){
  //trex.velocityY = -12;
  //jumpSound.play();
  
gameState = END;
dieSound.play();
}

}
else if(gameState === END){
  gameOver.visible = true;
  restart.visible = true;
ground.velocityX = 0;
trex.velocityX = 0;
trex.changeAnimation("collided",trex_collided);
obstaclesGroup.setLifetimeEach(-1);
cloudsGroup.setLifetimeEach(-1);
obstaclesGroup.setVelocityXEach(0);
cloudsGroup.setVelocityXEach(0);
}
trex.collide(invisibleGround);

if(mousePressedOver(restart)){
  //console.log("reiniciar jogo")
  reset();
}
  drawSprites();

}
function reset(){
  gameState = PLAY;
  restart.visible = false;
  gameOver.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
 trex.changeAnimation("running",trex_running);
}
function spawnClouds(){
if(frameCount %60 === 0){
cloud = createSprite(windowWidth,100,40,10);
cloud.y = Math.round(random(100,220));
cloud.addImage(cloudImage);
cloud.velocityX = -2;
cloud.scale = 1;
cloud.lifetime = 550;

cloud.depth = trex.depth;
trex.depth = cloud.depth;
cloudsGroup.add(cloud);
}
}

function spawnObstacles(){
  if(frameCount %60 === 0){
    obstacle = createSprite(windowWidth,windowHeight-20,10,40);
    obstacle.velocityX = -(6 + score%30);
    //obstacle.velocityX = -20
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1:obstacle.addImage(obstacle1);
      break;
      case 2:obstacle.addImage(obstacle2);
      break;
      case 3:obstacle.addImage(obstacle3);
      break;
      case 4:obstacle.addImage(obstacle4);
      break;
      case 5:obstacle.addImage(obstacle5);
      break;
      case 6:obstacle.addImage(obstacle6);
      break;
      default: break;
    }   

    obstacle.scale = 0.4;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle)
  }
}
