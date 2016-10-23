// Global Structure for connectivity

var Graph = function(){
  this.vertices = new Map();
  this.edges = new Map();
  this.counter =  0;
}

Graph.prototype = {
  isValidVertex: function(v){
    return (this.vertices.has(v.id));
  },

  isConnected: function(v1, v2){
    var i1 = v1.id;
    var i2 = v2.id;
    return this.edges.has(i1.toString()+" "+i2.toString());
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

  addEdge: function(v1, v2, w){
    if (this.isConnected(v1, v2)){
      console.log("Edge in graph already.\n");
      return;
    }
    var i1 = v1.id;
    var i2 = v2.id;
    this.edges.set(i1.toString()+" "+i2.toString(), w);
  },

  removeEdge: function(v1, v2){
    if (!this.isConnected(v1, v2)){
      console.log("Edge not in graph.\n");
      return;
    }
    var i1 = v1.id;
    var i2 = v2.id;
    this.edges.delete(i1.toString()+" "+i2.toString());
  }
}

var G = new Graph();
// Neuron class
var Neuron = function (type, x, y){
  this.type = type;
  this.x = x;
  this.y = y;
  this.id = 0;
  G.addVertex(this);
};

Neuron.prototype = {
  // Methods
}

var n1 = new Neuron("abc", 0, 0);
var n2 = new Neuron("def", 0, 0);
G.removeVertex(n1);
G.addVertex(n1);
G.addEdge(n1, n2, 42);
console.log(G.isConnected(n1, n2));
G.addEdge(n1, n2, 42);
G.removeEdge(n1, n2);
console.log(G.isConnected(n1, n2));


// Intialize Canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width = 800;
var ch = canvas.height = 600;



