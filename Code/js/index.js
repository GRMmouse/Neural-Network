// Global Variables
var NEURON_RADIUS = 30;
var NEURON_VDROP = -15;
var ARROW_LEN = 10;
var ARROW_ANGLE = Math.PI/7;

// Graph Class
// The graph class represent a directed graph structure G = {V, E}
// with weight place on each edge
var Graph = function(){
  this.vertices = new Map();
  this.edges = new Map();
  this.counter =  0;
}

Graph.prototype = {
  isValidVertex: function(v){
    return (this.vertices.has(v.id));
  },

  isConnected: function(from, to){
    return this.edges.has(this.makeKey(from, to));
  },

  addVertex: function(v){
    v.id = this.counter;
    this.counter++;
    this.vertices.set(v.id, v);
  },

  removeVertex: function(v){
    if (!this.isValidVertex(v)){
      console.log("Vertex not in graph.\n");
      return;
    }
    this.vertices.delete(v.id);
  },

  makeKey: function(from, to){
    var i1 = from.id;
    var i2 = to.id;
    return i1.toString()+" "+i2.toString()
  },

  addEdge: function(from, to, w){
    if (this.isConnected(from, to)){
      console.log("Edge in graph already.\n");
      return;
    }
    this.edges.set(this.makeKey(from, to), w);
  },

  removeEdge: function(from, to){
    if (!this.isConnected(from, to)){
      console.log("Edge not in graph.\n");
      return;
    }
    this.edges.delete(this.makeKey(from, to));
  },

  getWeight: function(from, to){
    if (!this.isConnected(from, to)){
      console.log("Edge not in graph.\n");
      return 0;
    }
    return this.edges.get(this.makeKey(from, to));
  }
}

// Neuron class
// A neuron is the basic firing cell of the 
var Neuron = function (type, x, y, vth, G){
  this.type = type;
  this.x = x;
  this.y = y;
  this.vth = vth;
  this.val = 0;
  this.id = 0;
  this.output = new Map();
  this.G = G;
  this.G.addVertex(this);
};

Neuron.prototype = {
  // Methods
  connectTo: function(to, w){
    this.G.addEdge(this, to, w);
    if (!this.output.has(to.id)){
      this.output.set(to.id, to);
      return;
    }
    
  },

  removeConnection: function(to){
    this.G.removeEdge(this, to);
    if (this.output.has(to.id)){
      this.output.delete(to.id);
      return;
    }
  },

  isFiring: function(){
    return (this.val >= this.vth);
  },

  fire: function(){
    // Currently swith model, consider sigmoid later
    if (this.isFiring()){
      for (var to of this.output.values()) {
        to.val += G.getWeight(this, to);
      }
    }
    this.val = 0;
    return;
  },

  getWeight: function(to){
    return this.G.getWeight(this, to);
  },

  draw: function(ctx){
    // Draw a circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, NEURON_RADIUS, 0,2*Math.PI);
    var old = ctx.fillStyle;
    if (this.isFiring()) {
      ctx.fillStyle = 'yellow';
      ctx.fill();
    }
    ctx.stroke();
    ctx.closePath()
    ctx.fillStyle = old;

    // Draw Vth
    ctx.font = "20px Arial";
    ctx.textAlign="center";
    ctx.fillText(this.vth.toString(),this.x,this.y+5);

    for (var to of this.output.values()) {
      // draw arrows
      ctx.beginPath();
      var angle = Math.atan2(to.y-this.y,to.x-this.x);
      var fromX = this.x+NEURON_RADIUS*Math.cos(angle);
      var fromY = this.y+NEURON_RADIUS*Math.sin(angle);
      var toX = to.x-NEURON_RADIUS*Math.cos(angle);
      var toY = to.y-NEURON_RADIUS*Math.sin(angle);
      var oldStyle = ctx.strokeStyle;
      var oldWidth = ctx.lineWidth;

      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      
      
      var w = this.getWeight(to);   
      if (w < 0){
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.moveTo(toX-ARROW_LEN*Math.cos(angle-Math.PI/2), toY-ARROW_LEN*Math.sin(angle-Math.PI/2))
        ctx.lineTo(toX-ARROW_LEN*Math.cos(angle+Math.PI/2), toY-ARROW_LEN*Math.sin(angle+Math.PI/2))
      }else{
        ctx.strokeStyle = "green";
        ctx.lineWidth = 3;
        ctx.lineTo(toX-ARROW_LEN*Math.cos(angle+ARROW_ANGLE),toY-ARROW_LEN*Math.sin(angle+ARROW_ANGLE));
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX-ARROW_LEN*Math.cos(angle-ARROW_ANGLE),toY-ARROW_LEN*Math.sin(angle-ARROW_ANGLE));
      }   
      ctx.stroke();
      ctx.strokeStyle = oldStyle;
      ctx.lineWidth = oldWidth;
      ctx.fillText(w.toString(),(this.x+to.x)/2,(this.y+to.y)/2);
      ctx.closePath()   
    }
    return;
  }
}

// Intialize Canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width = 800;
var ch = canvas.height = 600;

// Intialize neural network
var G = new Graph();

// Intialize buttons
document.getElementById("nextButton").onclick = function(){
  var s = new Set();
  for (n of G.vertices.values()){
    if (n.isFiring()) s.add(n)
  }
  for (let item of s){
    item.fire();
  }
  s.clear();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (n of G.vertices.values()){
    n.draw(ctx);
  }
}

// Tests for Graph
var N1 = new Neuron("input", 200, 300, 10, G);
var N2 = new Neuron("connect", 400, 200, 10, G);
var N3 = new Neuron("connect", 400, 400, 10, G);
var N4 = new Neuron("output", 600,300, 10, G);

N1.connectTo(N2, 20);
N2.connectTo(N3, 20);
N3.connectTo(N1, +20);
N2.connectTo(N4, 50);
N4.connectTo(N3, -50);
//N4.connectTo(N1, -200);
N1.val = 100;
for (var n of G.vertices.values()){
  n.draw(ctx);
}