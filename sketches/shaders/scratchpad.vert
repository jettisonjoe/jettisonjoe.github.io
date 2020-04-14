#ifdef GL_ES
precision mediump float;
#endif

// Built-in shader variable the holds the position of the vertex.
attribute vec3 aPosition;

void main() {
  // Necessary boiler plate (according to the interwebs).
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  // Set the built-in shader variable gl_Position;
  gl_Position = positionVec4;
}
