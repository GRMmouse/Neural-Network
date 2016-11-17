// Global Variables
var NEURON_RADIUS = 30;

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
var Neuron = function (type, x, y, vth){
  this.type = type;
  this.x = x;
  this.y = y;
  this.vth = vth;
  this.val = 0;
  this.id = 0;
  this.output = new Map();
  G.addVertex(this);
};

Neuron.prototype = {
  // Methods
  connectTo: function(to, w){
    G.addEdge(this, to, w);
    if (!this.output.has(to.id)){
      this.output.set(to.id, to);
      return;
    }
    
  },

  removeConnection: function(to){
    G.removeEdge(this, to);
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
    return;
  },

  clear: function(){
    this.val = 0;
  },

  getWeight: function(to){
    return G.getWeight(this, to);
  },

  draw: function(ctx){
    // Draw a circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, NEURON_RADIUS, 0,2*Math.PI);
    var old = ctx.fillStyle;
    if (this.isFiring()) {
      console.log(this.val);
      ctx.fillStyle = 'yellow';
      ctx.fill();
    }
    ctx.stroke();
    ctx.fillStyle = old;

    // Draw Vth
    ctx.font = "20px Arial";
    ctx.textAlign="center";
    ctx.fillText(this.vth.toString(),this.x,this.y+5);

    // Draw connections and edge weights
    for (var to of this.output.values()) {
        ctx.moveTo(this.x+NEURON_RADIUS, this.y);
        ctx.lineTo(to.x-NEURON_RADIUS, to.y);
        ctx.stroke();
        var w = this.getWeight(to);
        ctx.fillText(w.toString(),(this.x+to.x)/2,(this.y+to.y)/2);
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

// Tests for Graph
var N1 = new Neuron("input", 200, 400, 10);
var N2 = new Neuron("output", 400, 300, 10);
var N3 = new Neuron("output", 400, 500, 10);
N1.connectTo(N2, 42);
N1.connectTo(N3, 42);

// Tests for Neuron
for (var n of G.vertices.values()){
  n.draw(ctx);
}
N1.val = 100;
for (var n of G.vertices.values()){
  n.draw(ctx);
}
ctx.clearRect(0, 0, canvas.width, canvas.height);
var s = new Set();
for (var n of G.vertices.values()){
  if (n.isFiring()) s.add(n)
}
for (let item of s){
  item.fire();
  item.clear();
}
console.log(N1.val);
console.log(N2.val);
for (var n of G.vertices.values()){
  n.draw(ctx);
}


