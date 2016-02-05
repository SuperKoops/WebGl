var gl;
var canvas;
var shaderProgram;
var hexagonVertexBuffer;
var triangleVertexBuffer;
var triangleVertexColorBuffer;
var stripVertexBuffer;
var stripElementBuffer;

function startup() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLDebugUtils.makeDebugContext(createGLContext(canvas));

    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Load shaders and initialize attribute buffers
    setupShaders();
    // Load the data into the GPU        
    setupBuffers();

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
  
    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);// enable culling
    gl.cullFace(gl.BACK); 

    draw(); 
}

function setupShaders(){
    shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition"); 
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
}

function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

function setupBuffers() {
  hexagonVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, hexagonVertexBuffer);
  var hexagonVertices = [
        -0.3,  0.6,  0.0, 
        -0.4,  0.8,  0.0, 
        -0.6,  0.8,  0.0, 
        -0.7,  0.6,  0.0, 
        -0.6,  0.4,  0.0, 
        -0.4,  0.4,  0.0, 
        -0.3,  0.6,  0.0, 
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexagonVertices), gl.STATIC_DRAW);
  hexagonVertexBuffer.itemSize = 3;
  hexagonVertexBuffer.numberOfItems = 7;

  triangleVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
  var triangleVertices = [
        0.3,  0.4,  0.0, 
        0.7,  0.4,  0.0, 
        0.5,  0.8,  0.0, 
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  triangleVertexBuffer.itemSize = 3;
  triangleVertexBuffer.numberOfItems = 3;
  
  triangleVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
  var colors = [
            1.0, 0.0, 0.0, 1.0, 
            0.0, 1.0, 0.0, 1.0, 
            0.0, 0.0, 1.0, 1.0  
        ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  triangleVertexColorBuffer.itemSize = 4;
  triangleVertexColorBuffer.numberOfItems = 3;
 

  stripVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, stripVertexBuffer);
  var stripVertices = [
        -0.5,  0.2,  0.0, //ts000
        -0.4,  0.0,  0.0, //ts001
        -0.3,  0.2,  0.0, //ts002
        -0.2,  0.0,  0.0, //ts003
        -0.1,  0.2,  0.0, //ts004
         0.0,  0.0,  0.0, //ts005
         0.1,  0.2,  0.0, //ts006
         0.2,  0.0,  0.0, //ts007
         0.3,  0.2,  0.0, //ts008
         0.4,  0.0,  0.0, //ts009
         0.5,  0.2,  0.0, //ts010
		-0.5,  -0.3,  0.0, //ts100
        -0.4,  -0.5,  0.0, //ts101
        -0.3,  -0.3,  0.0, //ts102
        -0.2,  -0.5,  0.0, //ts103
        -0.1,  -0.3,  0.0, //ts104
         0.0,  -0.5,  0.0, //ts105
         0.1,  -0.3,  0.0, //ts106
         0.2,  -0.5,  0.0, //ts107
         0.3,  -0.3,  0.0, //ts108
         0.4,  -0.5,  0.0, //ts109
         0.5,  -0.3,  0.0  //ts110
  ];
  
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stripVertices), gl.STATIC_DRAW);
  stripVertexBuffer.itemSize = 3;
  stripVertexBuffer.numberOfItems = 22;
  
  stripElementBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, stripElementBuffer);
  var indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  stripElementBuffer.numberOfItems = 11;
    
}

function draw() { 
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  // Draw the hexagon with lines
  gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute); //disable the vertex color                 
  gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 0.0, 0.0, 1.0, 1.0); // color the lines blue
  
  gl.bindBuffer(gl.ARRAY_BUFFER, hexagonVertexBuffer); // bind the hexagon vertices
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         hexagonVertexBuffer.itemSize, gl.FLOAT, false, 0, 0); // define the array, and set the size
 
  gl.drawArrays(gl.LINE_STRIP, 0, hexagonVertexBuffer.numberOfItems); // draw the lines


  // Draw the triangle
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute); // enable the vertex color attribute
  
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer); // create the triangle buffer
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,  // set the vertex color 
                         triangleVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
                         
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);  //bind the color buffer 
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                         triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0); //define the array, and set the size
                                                 
  gl.drawArrays(gl.TRIANGLES, 0, triangleVertexBuffer.numberOfItems); // draw the triangle
   
   
  // draw the first triangle strip
  gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute); // disable the vertex color attribute again
  gl.bindBuffer(gl.ARRAY_BUFFER, stripVertexBuffer);               // bind the strip 
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         stripVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
                         
  gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 1.0, 1.0, 0.0, 1.0); // fill the strip with our color 
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, stripElementBuffer);                // bind the element buffer
  
  gl.drawElements(gl.TRIANGLE_STRIP, stripElementBuffer.numberOfItems, gl.UNSIGNED_SHORT, 0); // draw the first triangle strip using indeces
  gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 0.0, 0.0, 0.0, 1.0); // reset the color attribute
  
  // draw the lines along the strip
  gl.drawArrays(gl.LINE_STRIP, 0, 11);
   
   
   // draw the second triangle  strip
  gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);  // rinse repeat
  gl.bindBuffer(gl.ARRAY_BUFFER, stripVertexBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         stripVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
                         
  gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 1.0, 1.0, 0.0, 1.0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, stripElementBuffer);
  
  gl.drawElements(gl.TRIANGLE_STRIP, 11, gl.UNSIGNED_SHORT, 22); // draw the second triangle strip using the ll-22nd indeces
  gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 0.0, 0.0, 0.0, 1.0);
  
// draw the second line using the same indeces
  gl.drawElements(gl.LINE_STRIP, 11, gl.UNSIGNED_SHORT, 22);
}