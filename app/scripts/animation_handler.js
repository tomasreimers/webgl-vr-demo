/*jshint esversion: 6 */

module.exports = function () {
  const self = this;

  self._callbacks = [];
  self._last_updated = Date.now();
  self._fps = 60;
  self._pause = false;

  self.togglePause = function () {
    self._pause = !self._pause;
  };

  self.add = function (callback) {
    self._callbacks.push(callback);
  };

  self._update = function () {
    if (self._pause) { return; }

    for (var i = 0; i < self._callbacks.length; i++) {
      self._callbacks[i]();
    }
  };

  self.tick = function () {
    if (((Date.now() - self._last_updated) / 1000) >= (1.0 / self._fps)) {
      self._last_updated = Date.now();
      self._update();
    }
  };
};
