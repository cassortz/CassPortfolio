/**
Cassandra Ortiz Portfolio Website
**/

Matter.use('matter-attractors');

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Mouse = Matter.Mouse;
var Common = Matter.Common;
var MouseConstraint = Matter.MouseConstraint;
var Composites = Matter.Composites;
var Vertices = Matter.Vertices;
var Svg = Matter.Svg;

var engine;
let bg;
let asteroid = [];
let rocks = [];
let rock_col;
let first_name, last_name;

let boundsArray = [];
let didact;

var canvas;

let projectList = ['POTENS FEM INA', 'ENDANGERED LANGUAGES','KAGIMA','TILT-A-STORY','BASTET','LA M IXTECA'];
let myLink;
let fr;

function preload(){
  //background image
  bg = loadImage('img/web_bg1.png');
  ast_image = loadImage('img/asteroid2.png');
  proj_image0 = createImg('img/proj0.png', '');
//  proj_image1 = createImg('img/proj0.png', '');
  didact = loadFont('fonts/DidactGothic-Regular.ttf');
  myLink0 = createA('http://google.com', '', '_blank');
  myLink1 = createA('new-page.html', '', '_blank');
  first_name_image = loadImage('img/name_img0.png');
  last_name_image = loadImage('img/last_name_img0.png');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  // create an engine
  engine = Engine.create();

  // no gravity
  engine.world.gravity.scale = 0;
  engine.timing.timeScale = .05;

  loadObjects(windowWidth,windowHeight);

  // setup mouse
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);
}

function draw() {
  background(bg, 0, 0);

  Engine.update(engine);

  //console.log(frameRate());
  for (i in boundsArray) {
    boundsArray[i].show();
  }

  for (i in rocks) {
    rocks[i].draw();
  }

  for (i in asteroid) {
    asteroid[i].draw();
  }

  first_name.show();
  last_name.show();
}

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);
  Engine.update(engine);
}

//function for setup  objects
function loadObjects(winW, winH){

  //bottom
  boundsArray.push(new Boundary(winW / 2, winH - 10, winW * 2, 20));
  //top
  boundsArray.push(new Boundary(winW / 2, 0, winW * 2, 20));
  //left
  boundsArray.push(new Boundary(0, winH/2, 20, winH));
  //right
  boundsArray.push(new Boundary(winW, winH/2, 20, winH));

  for (let i = 0; i < 50; i++) {
    rocks.push(new Rocks(winW/2,winH/2,random(1,20)));
  }

  for (let i = 0; i < projectList.length; i++) {
    asteroid.push(new Asteroid(winW/2,winH/2, 130,random(0.1,5), ast_image, proj_image0,myLink1, projectList[i]));
  }

  first_name = new NameBlock(width/2-50, height/2, first_name_image.width, first_name_image.height, first_name_image);
  last_name = new NameBlock(width/2, height/2, last_name_image.width, last_name_image.height, last_name_image);
}


function Rocks(posX,posY,r){

  this.options = {
    //mass: Common.random(25, 35),
  //  mass: 2,
    frictionAir: 0,
    plugin: {
      attractors: [
        MatterAttractors.Attractors.gravity
      ]
    }
  }

  this.outerbodies = Bodies.circle(posX,posY, r,this.options);

  var speed = 0.5;
  Body.setVelocity(this.outerbodies, {
    x: Common.random(-speed, speed),
    y: Common.random(-speed, speed)
  });

  let pos = this.outerbodies.position;
  let r_color = color(random(150,255),random(100,220), random(0,60));

  World.add(engine.world, this.outerbodies);

  this.selectColor = function(){
    return color(0,random(0,100), random(255));
  }

  this.draw = function(){
    //r_color = this.selectColor();
    noStroke();
    fill(r_color);
    push();
    ellipseMode(CENTER);
    ellipse(pos.x, pos.y, r);
    pop();
  }
}

function NameBlock(x,y,w,h, img) {

  this.options = {
    restitution: 1,
    frictionAir: 0.0,
    // friction: 0.3,
    isStatic:false,
    plugin: {
      attractors: [
        MatterAttractors.Attractors.gravity
      ]
    }
  }

  this.body = Bodies.rectangle(x,y,w+15,h+15,this.options);
  this.w = w;
  this.h = h;
  let pos = this.body.position;

  World.add(engine.world, this.body);
  console.log(this.body);

  this.show = function(){
    push();
    translate(pos.x, pos.y);
    imageMode(CENTER);
    image(img, 0, 0, this.w, this.h);
    pop();
  }
}

function Boundary(x,y,w,h) {
  var options = {
    // restitution: 0.1,
    // //frictionAir: 0.06,
    // friction: 0.3,
    isStatic:true
  }

  this.body = Bodies.rectangle(x,y,w,h,options);
  this.w = w;
  this.h = h;
  World.add(engine.world, this.body);
  console.log(this.body);

  this.show = function(){
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    //fill(150);
    noStroke();
  //  noFill();
    rectMode(CENTER);
    rect(0,0, this.w, this.h);
    pop();
  }
}

/**
Circular Text Code adapted from Vamoss
Original code link:
https://www.openprocessing.org/sketch/697891

**/
function Asteroid(posX,posY, r, rotAng, img, link_img, link, circText) {
  // make position here

  this.options = {
    isStatic: false,
    // mass: Common.random(10,15),
  //  mass: 200,
    frictionAir: 0,
  //  speed: 0.2,
    plugin: {
      attractors: [
        function(bodyA, bodyB) {
          return {
            x: (bodyA.position.x - bodyB.position.x) * 1e-6,
            y: (bodyA.position.y - bodyB.position.y) * 1e-6,
          };
        }
      ]
    }
  }

  this.attractor = Bodies.circle(posX, posY, r+25, this.options);
  this.asteroid_img = img;
  this.link_img = link_img;
  // this.link = link;

  //this.link.child(this.link_img);

  link.child(link_img);

  let speed = 0.5;
  Body.setVelocity(this.attractor, {
    x: Common.random(-speed, speed),
    y: Common.random(-speed, speed)
  });

  //Body.setAngle(this.attractor, rotAng);

  let ang = this.attractor.angle;
  let pos = this.attractor.position;
  //let button = createButton('VIEW MORE');

  World.add(engine.world, this.attractor);

  this.draw = function(){
    // this.drawSprite(this.attractor,this.asteroid_img, this.link_img);
    this.drawSprite(this.asteroid_img, link_img);
    // rectMode(CENTER);
    // rect(pos.x,pos.y, r,r);
    this.drawText();
    this.drawLinkImage(this.link_img);
    //this.drawButton();
  }

  this.changeCol = function(){
    let col = color(255, 255, 200);
    button.style('background-color', col);
  }

  this.drawButton = function(){
    button.size(120,60);
    button.position(pos.x-(r),pos.y-(r));
  }

  this.drawSprite = function(img, l_img) {
    push();
    translate(pos.x, pos.y);
    rotate(ang);
    imageMode(CENTER);
    image(img, 0, 0, r*2,r*2);
    // image(l_img, 0, 0,r *2, r*2);
    //  l_img.style('visibility', 'hide');
    // l_img.style('border-radius','50%');
    // l_img.style('box-shadow', '0 0 8px 8px white inset')
    pop();
  }

  this.drawLinkImage = function(l_img){
  //    l_img.style('visibility', 'hidden');
    if(mouseX>(pos.x-r) && mouseX<(pos.x+r) && mouseY> (pos.y-r) && mouseY <(pos.y+r)){
      //  this.drawLinkImage(l_img)
      l_img.style('visibility', 'visible');
    push();
    translate(pos.x, pos.y);
    rotate(ang);
    imageMode(CENTER);
      l_img.style('width', '270px');
      l_img.position(pos.x-(r+5), pos.y-(r+15));
      pop();
    }

    else{
      l_img.style('visibility', 'hidden');
    }

  }

  this.drawText = function(){
    //draw text
    let pct = atan2(mouseY - pos.y, mouseX - pos.x) / TWO_PI;//follow mouse
    let pct2 = PI/2;//dont follow mouse
    let pixToAngularPct = 1/((r/2)*TWO_PI);

    for (var i = 0; i < circText.length; i++) {
      let charWidth = textWidth(circText.charAt(i));

      if(mouseX>(pos.x-r) && mouseX<(pos.x+r) && mouseY> (pos.y-r) && mouseY <(pos.y+r)){

        pct += charWidth * pixToAngularPct;
        //calculate angle
        let leftP = this.pointForIndex(pct-0.01);
        let rightP = this.pointForIndex(pct+0.01);
        let angle = atan2(leftP.y - rightP.y, leftP.x - rightP.x) + PI;

        push();
        let p = this.pointForIndex(pct);
        fill(180,200,50);
      //  fill(250);
        textFont(didact);
        textSize(36);

        //apply angle
        translate(p.x, p.y);
        rotate(angle);
        translate(-p.x, -p.y);
        text(circText.charAt(i), p.x-charWidth, p.y);
        pop();
        pct += charWidth/2 * pixToAngularPct;

      }
      else{

        pct2 += charWidth * pixToAngularPct;
        //calculate angle
        let leftP = this.pointForIndex(pct2-0.01);
        let rightP = this.pointForIndex(pct2+0.01);
        let angle = atan2(leftP.y - rightP.y, leftP.x - rightP.x) + PI;

        push();
        let p = this.pointForIndex(pct2);
        fill(100,200,200);
        //fill(250);
        textFont(didact);
        textSize(36);
        //apply angle
        translate(p.x, p.y);
        rotate(angle);
        translate(-p.x, -p.y);
        text(circText.charAt(i), p.x-charWidth, p.y);
        pop();

        pct2 += charWidth/2 * pixToAngularPct;

      }
    }
  }

  this.pointForIndex = function(pct) {
    let angle = pct * TWO_PI;
    let cosAngle = cos(angle);
    let sinAngle = sin(angle);
    return {
      x: r * cosAngle + pos.x,
      y: r * sinAngle + pos.y
    };
  }
}
