let cnv;
let opposite1;
let opposite2;
let hypotenuse1;
let hypotenuse2;

var database;

function setup() {
  cnv = createCanvas(500, 500);
  cnv.mouseClicked(saveData);
  ellipseMode(CENTER);

  var firebaseConfig = {
    apiKey: "AIzaSyAz0EJaVHhTxTx8RKkWe-6Vwyxu26GQluM",
    authDomain: "simply-triangles-data.firebaseapp.com",
    databaseURL: "https://simply-triangles-data.firebaseio.com",
    projectId: "simply-triangles-data",
    storageBucket: "simply-triangles-data.appspot.com",
    messagingSenderId: "907294129613",
    appId: "1:907294129613:web:8551b430a835d4ca"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.firestore();
}

let centerX = 250;
let centerY = 250;
let earthAngle = 0;
let moonAngle = 0;
let a = 200;
let b = 160;
let x1, y1, x2, y2;

function draw() {
  background(240);
  drawTrack();
  drawEarth();
}

function drawTrack() {
  // draw the ellipse track
  push();
  stroke(color(0)); // red track
  noFill();
  ellipse(centerX, centerY, 2 * a, 2 * b);
  stroke(color(100));
  strokeWeight(3);
  line(centerX-a, centerY, centerX+a, centerY);//horizontal line
  pop();

  // draw the center and the circular track
  noStroke();
  fill(255);
  ellipse(centerX, centerY, 8, 8);
}

// ellipse width = 2a, height = 2b
// (x/a)^2+(y/b)^2=1
// x=r(θ)cosθ, y=r(θ)sinθ

function drawEarth() {
  let mouseDist = dist(mouseX, mouseY, centerX, centerY);
  let distRatio = (mouseY-centerY)/mouseDist
  let earthAngle = asin(distRatio);
  let rEarth = a * b / sqrt(sq(b * cos(earthAngle)) + sq(a * sin(earthAngle)));
  x1 = rEarth * cos(earthAngle);
  y1 = rEarth * sin(earthAngle);

  translate(centerX, centerY);
  if (mouseX<centerX) {
    x1= x1*-1
  }

// earth ellipse
  fill(85, 123, 250, 200);
  ellipse(x1, y1, 35, 35);

// dark blue triangle
  stroke(color(26, 61, 165));
  strokeWeight(1);
  noFill();
  triangle(0, 0, mouseX-centerX, mouseY-centerY, mouseX-centerX, 0);

// c1
  push();
  translate((mouseX-centerX)/2, (mouseY-centerY)/2);
  rotate(atan2(mouseY-centerY, mouseX-centerX));
  let c1 = int(mouseDist);
  text('c1: ' + c1, 0, -5);
  pop();
  hypotenuse1 = c1;

// a1
  push();
  translate(mouseX-centerX, (mouseY-centerY)/2);
  rotate(PI/2);
  let a1 = int(centerY-mouseY);
  if (a1<0) {
    a1 = a1*-1
  }
  text('a1: ' + a1, 0, -5);
  pop();
  opposite1 = a1;

// light blue triangle
  stroke(color(128, 246, 208  , 80));
  strokeWeight(7);
  noFill();
  triangle(0, 0, x1, y1, x1, 0);
  strokeWeight(1);

// c2
  push();
  stroke(color(109, 199, 170));
  translate((x1)/2, (y1)/2);
  rotate(atan2(y1, x1));
  let c2 = int(rEarth);
  text('c2: ' + c2, -10, 15);
  pop();
  hypotenuse2 = c2;

// a2
  push();
  stroke(color(109, 199, 170));
  translate(x1, y1/2);
  rotate(PI/2);
  let a2 = int(y1);
  if (a2<0) {
    a2 = a2*-1
  }
  text('a2: ' + a2, 0, -5);
  pop();
  opposite2 = a2;


}

// const firebase = require("firebase");
// // Required for side-effects
// require("firebase/firestore");


function saveData() {
  // alert(hypotenuse1 + opposite1);

  var edgeLengths = database.collection('edgeLengths');
  var myKey = edgeLengths.doc().id;
  database.collection('edgeLengths').doc(myKey).set({
    id: myKey,
    a1: opposite1,
    c1: hypotenuse1,
    ratio1: nf(opposite1/hypotenuse1, 1, 2),
    a2: opposite2,
    c2: hypotenuse2,
    ratio2: nf(opposite2/hypotenuse2, 1, 2)

  });
  // let numberEl = document.getElementById('listContent');
  // numberEl.innerHTML = 'abc';


 edgeLengths.onSnapshot(function(snapshot) {
   var lengths = [];
   var contentHTML = "";

   // forEach method
   snapshot.forEach(function(doc) {
     lengths.push(doc.data());
     contentHTML += `<li>${ doc.data().ratio1 } ${ doc.data().ratio2 }</li>`
   });

   var listEl = document.getElementById('listContent');
   listEl.innerHTML = contentHTML;

   var usersList = snapshot.docs;
 });

}



// firebase.firestore() is not a function, added firestore script in html
// followed documentation and added const firebase = require('firebase')
// error: require is not defined
// updated firebase, npm install -g firebase-tools
// npm WARN optional SKIPPING OPTIONAL DEPENDENCY:
// fsevents@2.0.7 (node_modules\firebase-tools\node_modules\fsevents):
// npm WARN notsup SKIPPING OPTIONAL DEPENDENCY:
// Unsupported platform for fsevents@2.0.7: wanted {"os":"darwin","arch":"any"}
// (current: {"os":"win32","arch":"x64"})
