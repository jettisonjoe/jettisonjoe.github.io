var sketch = function(p) {
  const SHADER_DIR = 'shaders/';
  const TIME_SCALE = 0.01;

  let theShader;

  p.preload = function() {
    shaderName = url.searchParams.get('shader');
    theShader = p.loadShader(
        SHADER_DIR + shaderName + '.vert',
        SHADER_DIR + shaderName + '.frag');
  };

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.noStroke();
  };

  p.draw = function() {
    theShader.setUniform('u_resolution', [p.width, p.height]);
    theShader.setUniform('u_time', p.frameCount * TIME_SCALE);
    p.shader(theShader);
    p.rect(0, 0, p.width, p.height);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}
