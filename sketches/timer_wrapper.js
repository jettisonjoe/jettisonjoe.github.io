var sketch = function(p) {
  const BASE_URL = 'https://api.keyvalue.xyz';

  var timerId,
      token,
      command,
      argument;

  p.preload = function() {
    key = url.searchParams.get('id');
    token = url.searchParams.get('token');
    command = url.searchParams.get('cmd');
    argument = url.searchParams.get('arg');
  };

  p.setup = function() {};

  p.draw = function() {
    p.noLoop();
    switch (command) {
      case 'set':
        p.httpPost(
            BASE_URL + '/' + token + '/' + key,
            parseInt(argument),
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
