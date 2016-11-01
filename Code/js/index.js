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
  connectTo: function(to){
    G.addEdge(this, to);
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
// var N1 = new Neuron("input", 0, 0, 10);
// var N2 = new Neuron("output", 0, 0, 10);
// console.log(G.isConnected(N1, N2));
// G.addEdge(N1, N2, 42);
// G.addEdge(N1, N2, 42);
// G.removeVertex(N1);
// G.addVertex(N1);
// console.log(G.isConnected(N1, N2));
// G.addEdge(N1, N2, 42);
// console.log(G.isConnected(N1, N2));
// console.log(G.getWeight(N1, N2));



