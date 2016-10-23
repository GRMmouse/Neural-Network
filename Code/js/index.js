// Global Structure for connectivity
var G = {
  counter: 0,
  vertices: new Map(),
  edges: new Map(),

  isValidVertex: function(v){
    return (vertices.has(v.id));
  },

  isConnected: function(v1, v2){
    var i1 = v1.id;
    var i2 = v2.id;
    return edges.has([i1, i2]);
  },

  addVertex: function(v){
    v.id = counter;
    counter++;
    vertices.set(v.id, v);
  },

  removeVertex: function(v){
    if (!isValidVertex(v)){
      console.log("Vertex not in graph.\n");
      return;
    }
    vertices.delete(v.id);
  },

  addEdge: function(v1, v2){
    if (isConnected(v1, v2)){
      console.log("Edge in graph already.\n");
      return;
    }
    var i1 = v1.id;
    var i2 = v2.id;
    edges.set([i1, i2], [v1, v2]);
  },

  removeEdge: function(v1, v2){
    if (!isConnected(v1, v2)){
      console.log("Edge not in graph.\n");
      return;
    }
    var i1 = v1.id;
    var i2 = v2.id;
    edges.delete([i1, i2]);
  }
}

// Neuron class
var Neuron = function (type, x, y){
  this.type = type;
  this.x = x;
  this.y = y;
  this.id = 0;
  this.weight = new Map();
};

Neuron.prototype = {

}


// Intialize Canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width = 800;
var ch = canvas.height = 600;



