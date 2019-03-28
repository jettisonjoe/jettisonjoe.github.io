var sketch = function(p) {
  const BASE_URL = 'https://timercheck.io';

  var timerId,
      command,
      argument;

  p.preload = function() {
    timerId = url.searchParams.get('id');
    command = url.searchParams.get('cmd');
    argument = url.searchParams.get('arg');
  };

  p.setup = function() {};

  p.draw = function() {
    p.noLoop();
    switch (command) {
      case 'set':
        p.loadJSON(
            BASE_URL + '/' + timerId + '/' + argument,
            function(response) {});
        break;
      case 'add':
        p.loadJSON(
          BASE_URL + '/' + timerId,
          function(response) {
            var newSeconds = toString(
                response.seconds_remaining + parseInt(argument));
            p.loadJSON(
                BASE_URL + '/' + timerId + '/' + newSeconds,
                function(response) {},
                function(errorResponse) {});
          },
          function(errorResponse) {
            p.loadJSON(
              BASE_URL + '/' + timerId + '/' + argument,
              function(response) {});
          });
        break;
      case 'sub':
        p.loadJSON(
          BASE_URL + '/' + timerId,
          function(response) {
            var newSeconds = toString(
                max(response.seconds_remaining - parseInt(argument), 0));
            p.loadJSON(
              BASE_URL + '/' + timerId + '/' + newSeconds,
              function(response) {},
              function(errorResponse) {});
          },
          function(errorResponse) {});
        break;
      default:
        break;
    }
  };

  p.windowResized = function() {};
};