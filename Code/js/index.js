// Global Variables
var NEURON_RADIUS = 40;
var NEURON_VDROP = -15;
var ARROW_LEN = 10;
var ARROW_ANGLE = Math.PI/7;
var MARGIN_WIDTH = 30;
var MODE = "Add"; // Navigation, Add, Delete, Edit, Trigger
var FOCUS = null;

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
var Neuron = function (type, x, y, G){
  this.type = type;
  this.x = x;
  this.y = y;
  var temp = parseInt(prompt("Please enter a threshold voltage:", '10'));
  if (!isNaN(temp)){
    this.vth = temp; 
  }else{
    FOCUS = null;
    return; // Failed to add new neuron
  }
  this.val = 0;
  this.id = 0;
  this.output = new Map();
  this.G = G;
  this.G.addVertex(this);
};

Neuron.prototype = {
  // Methods
  connectTo: function(to){
    var w = prompt("Please enter a weight:", '40');
    if (isNaN(w) || w==null){
      return; // Failed to add new edge
    }
    this.G.addEdge(this, to, parseInt(w));
    if (!this.output.has(to.id)){
      this.output.set(to.id, to);
      return;
    }
    
  },

  isConnected: function(to){
    return this.G.isConnected(this, to);
  },

  removeConnection: function(to){
    this.G.removeEdge(this, to);
    if (this.output.has(to.id)){
      this.output.delete(to.id);
      return;
    }
  },

  updateConnection: function(to){
    if (!this.isConnected(to)){
      console.log("Failed to update. Edge does not exist.")
      return;
    }
    // Easiest way is to remove and add a new edge
    this.removeConnection(to);
    this.connectTo(to);
  },

  delete: function(){
    for (n of this.G.vertices.values()){
      // Remove all vertices
      n.removeConnection(this);
      this.removeConnection(n);
    }
    this.G.removeVertex(this);
  },

  isFiring: function(){
    return (this.val >= this.vth);
  },

  isAffected: function(){
    return (this.val != 0);
  },

  fire: function(){
    // Currently switch model, consider sigmoid later
    for (var to of this.output.values()) {
      to.val += G.getWeight(this, to);
    }
    return;
  },

  clear: function(){
    this.val = 0;
  },

  getWeight: function(to){
    return this.G.getWeight(this, to);
  },

  updateVal: function(){
    var temp = parseInt(prompt("Please enter an activation voltage:", '100'));
    if (!isNaN(temp)){
      this.val = temp; 
    }
    return;
  },

  updateThreshold: function(){
    var temp = parseInt(prompt("Please enter a threshold voltage:", '10'));
    if (!isNaN(temp)){
      this.vth = temp; 
    }
    return;
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
    ctx.font = "15px Arial";
    ctx.textAlign="center";
    var textInfo1 = "Vth = "+this.vth.toString();
    var textInfo2 = "Val = "+this.val.toString();
    ctx.fillText(textInfo1,this.x,this.y-5);
    ctx.fillText(textInfo2,this.x,this.y+15);


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

/* View */
var redrawAll = function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (n of G.vertices.values()){
    n.draw(ctx);
  }
  // Draw a blue circle around focus
  var old = ctx.strokeStyle;
  var oldFill = ctx.fillStyle;
  if (FOCUS != null){
    ctx.beginPath();
    ctx.arc(FOCUS.x, FOCUS.y, NEURON_RADIUS, 0,2*Math.PI);
    var oldWidth = ctx.lineWidth;
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.lineWidth = oldWidth;
  }

  // Display the current mode
  var oldFont = ctx.font;
  ctx.font = "20px Arial";
  ctx.fillStyle = 'blue';
  ctx.textAlign = 'left';
  ctx.fillText("Mode: "+MODE, MARGIN_WIDTH, MARGIN_WIDTH);
  ctx.strokeStyle = old;
  ctx.fillStyle = oldFill;
  ctx.font = oldFont;
  ctx.closePath()
};


/* Control */
// Next Button
var next = function(){
  var s = new Set();
  var f = new Set();
  for (n of G.vertices.values()){
    if (n.isAffected()) s.add(n);
    if (n.isFiring()) f.add(n)
  }

  for (let item of s){
    item.clear();
  }

  for (let item of f){
    item.fire();
  }
  redrawAll();
}

// Clear Button
var clearAll = function(){
  G = new Graph();
  MODE = "Add";
  FOCUS = null;
  redrawAll();
}

// Help Button
var help = function(){
  // Please note that the introduction webpage is currently running on my
  // own webpage. Future implementations should focus on finding a better
  // way to link the help page to the main page.
  window.open("https://www.andrew.cmu.edu/user/ail1/help/");
}

// KeyPress Events
var onKeyPress = function(evt){
  switch(evt.keyCode) {
    case 32: // c
      MODE = "Navigation";
      console.log("Navigation Mode");
      break;
    case 68: // d
      MODE = "Delete";
      console.log("Delete Mode");
      break;
    case 65: // a
      MODE = "Add";
      console.log("Add Mode");
      break;
    case 69: // e
      MODE = "Edit";
      console.log("Edit Mode");
      break;
    case 84: // t
      MODE = "Trigger";
      console.log("Trigger Mode");
      break;
    case 78: // n
      next();
      break;
    default:
      console.log(evt.keyCode + " Pressed");
      break;
  }
  FOCUS = null;
  redrawAll();
};

var onMousePress = function(evt){
  var x = evt.pageX - canvas.offsetLeft;
  var y = evt.pageY - canvas.offsetTop;

  switch(MODE){
    case "Navigation":
      return;
    case "Add":
      for (var n of G.vertices.values()){
        if ((x-n.x)*(x-n.x)+(y-n.y)*(y-n.y) <= 4*NEURON_RADIUS*NEURON_RADIUS){
          if ((x-n.x)*(x-n.x)+(y-n.y)*(y-n.y) <= NEURON_RADIUS*NEURON_RADIUS){
            FOCUS = n;
          }
          redrawAll();
          return; // Too near for adding Neuron
        }
      }
      var N = new Neuron("connect", x, y, G);
      if (G.isValidVertex(N)){
        FOCUS = N;  
      }
      break;
    case "Edit":
    case "Trigger":
    case "Delete":
      for (var n of G.vertices.values()){
        if ((x-n.x)*(x-n.x)+(y-n.y)*(y-n.y) <= NEURON_RADIUS*NEURON_RADIUS){
          FOCUS = n;
          redrawAll();
          return;
        }
      }
      FOCUS = null;
      break;
    default:
      console.log("Unknown Mode:" + MODE)
  }
  redrawAll();
}

var onMouseRelease = function(evt){
  if (FOCUS == null) return;
  var x = evt.pageX - canvas.offsetLeft;
  var y = evt.pageY - canvas.offsetTop;
  switch(MODE){
    case "Navigation":
      return;
    case "Add":
      if ((x-FOCUS.x)*(x-FOCUS.x)+(y-FOCUS.y)*(y-FOCUS.y) <= NEURON_RADIUS*NEURON_RADIUS){
        // Same Neuron
        return;
      }
      for (var n of G.vertices.values()){        
        if ((x-n.x)*(x-n.x)+(y-n.y)*(y-n.y) <= NEURON_RADIUS*NEURON_RADIUS){
          FOCUS.connectTo(n);
          FOCUS = null;
          break;
        }
      }      
      break;
    case "Delete":
      if ((x-FOCUS.x)*(x-FOCUS.x)+(y-FOCUS.y)*(y-FOCUS.y) <= NEURON_RADIUS*NEURON_RADIUS){
        // Same Neuron, remove vertex
        FOCUS.delete();
        FOCUS = null;
      }
      for (var n of G.vertices.values()){        
        if ((x-n.x)*(x-n.x)+(y-n.y)*(y-n.y) <= NEURON_RADIUS*NEURON_RADIUS){
          // Different Neuron, remove edge
          n.removeConnection(FOCUS);
          FOCUS = null;
          break;
        }
      }      
      break;
    case "Edit":
      if ((x-FOCUS.x)*(x-FOCUS.x)+(y-FOCUS.y)*(y-FOCUS.y) <= NEURON_RADIUS*NEURON_RADIUS){
        // Same Neuron, update vertex
        FOCUS.updateThreshold();
        FOCUS = null;
        break;
      }
      for (var n of G.vertices.values()){        
        if ((x-n.x)*(x-n.x)+(y-n.y)*(y-n.y) <= NEURON_RADIUS*NEURON_RADIUS){
          // Different Neuron, update edge
          FOCUS.updateConnection(n);
          FOCUS = null;
          break;
        }
      }      
      break;
    case "Trigger":
      if ((x-FOCUS.x)*(x-FOCUS.x)+(y-FOCUS.y)*(y-FOCUS.y) <= NEURON_RADIUS*NEURON_RADIUS){
        // Same Neuron, update val
        FOCUS.updateVal();
        FOCUS = null;
        break;
      }
    default:
      console.log("Unknown Mode:" + MODE)
  }
  redrawAll();
}


/* Run function */
// Intialize Canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width = 800;
var ch = canvas.height = 600;

// canvas.addEventListener("click", functionTest, false);


// Intialize neural network
var G = new Graph();

// Bind
document.getElementById("nextButton").onclick = next;
document.getElementById("clearButton").onclick = clearAll;
document.getElementById("helpButton").onclick = help;
canvas.addEventListener("mousedown", onMousePress, false);
canvas.addEventListener("mouseup", onMouseRelease, false);
window.addEventListener('keydown',onKeyPress,false);

redrawAll();