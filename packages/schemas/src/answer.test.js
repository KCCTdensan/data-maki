"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bun_test_1 = require("bun:test");
var typia_1 = require("typia");
var exampleJson =
  '\n{\n  "n":3,\n  "ops":[\n    {\n      "p":4,\n      "x":5,\n      "y":6,\n      "s":2\n    },\n    {\n      "p":11,\n      "x":3,\n      "y":-12,\n      "s":3\n    },\n    {\n      "p":25,\n      "x":6,\n      "y":0,\n      "s":0\n    }\n  ]\n}\n';
var expectedObject = {
  n: 3,
  ops: [
    {
      p: 4,
      x: 5,
      y: 6,
      s: 2,
    },
    {
      p: 11,
      x: 3,
      y: -12,
      s: 3,
    },
    {
      p: 25,
      x: 6,
      y: 0,
      s: 0,
    },
  ],
};
(0, bun_test_1.describe)("answer parsing", function () {
  (0, bun_test_1.test)("example answer json correctly parses", function () {
    var object = JSON.parse(exampleJson);
    var answer = (function () {
      var $guard = typia_1.default.assertEquals.guard;
      var $join = typia_1.default.assertEquals.join;
      var $io0 = function (input, _exceptionable) {
        if (_exceptionable === void 0) {
          _exceptionable = true;
        }
        return (
          "number" === typeof input.n &&
          Math.floor(input.n) === input.n && 0 <= input.n &&
          input.n <= 4294967295 &&
          (1 === Object.keys(input).length ||
            Object.keys(input).every(function (key) {
              if (
                ["n"].some(function (prop) {
                  return key === prop;
                })
              )
                return true;
              var value = input[key];
              if (undefined === value) return true;
              return false;
            }))
        );
      };
      var $ao0 = function (input, _path, _exceptionable) {
        if (_exceptionable === void 0) {
          _exceptionable = true;
        }
        return (
          (("number" === typeof input.n &&
            ((Math.floor(input.n) === input.n && 0 <= input.n && input.n <= 4294967295) ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".n",
                  expected: 'number & Type<"uint32">',
                  value: input.n,
                },
                _errorFactory,
              ))) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".n",
                expected: '(number & Type<"uint32">)',
                value: input.n,
              },
              _errorFactory,
            )) &&
          (1 === Object.keys(input).length ||
            false === _exceptionable ||
            Object.keys(input).every(function (key) {
              if (
                ["n"].some(function (prop) {
                  return key === prop;
                })
              )
                return true;
              var value = input[key];
              if (undefined === value) return true;
              return $guard(
                _exceptionable,
                {
                  path: _path + $join(key),
                  expected: "undefined",
                  value: value,
                },
                _errorFactory,
              );
            }))
        );
      };
      var __is = function (input, _exceptionable) {
        if (_exceptionable === void 0) {
          _exceptionable = true;
        }
        return "object" === typeof input && null !== input && $io0(input, true);
      };
      var _errorFactory;
      return function (input, errorFactory) {
        if (false === __is(input)) {
          _errorFactory = errorFactory;
          (function (input, _path, _exceptionable) {
            if (_exceptionable === void 0) {
              _exceptionable = true;
            }
            return (
              ((("object" === typeof input && null !== input) ||
                $guard(
                  true,
                  {
                    path: _path + "",
                    expected: "Answer",
                    value: input,
                  },
                  _errorFactory,
                )) &&
                $ao0(input, _path + "", true)) ||
              $guard(
                true,
                {
                  path: _path + "",
                  expected: "Answer",
                  value: input,
                },
                _errorFactory,
              )
            );
          })(input, "$input", true);
        }
        return input;
      };
    })()(object);
    (0, bun_test_1.expect)(answer).toStrictEqual(expectedObject);
  });
});
