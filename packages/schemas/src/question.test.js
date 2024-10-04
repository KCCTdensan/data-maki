"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bun_test_1 = require("bun:test");
var typia_1 = require("typia");
var exampleJson =
  '\n{\n  "board": {\n    "width": 6,\n    "height": 4,\n    "start": [\n      "220103",\n      "213033",\n      "022103",\n      "322033"\n    ],\n    "goal": [\n      "000000",\n      "111222",\n      "222233",\n      "333333"\n    ]\n  },\n  "general": {\n    "n": 2,\n    "patterns": [\n      {\n        "p": 25,\n        "width": 4,\n        "height": 2,\n        "cells": [\n          "0111",\n          "1001"\n        ]\n      },\n      {\n        "p": 26,\n        "width": 2,\n        "height": 2,\n        "cells": [\n          "10",\n          "01"\n        ]\n      }\n    ]\n  }\n}\n';
var expectedObject = {
  board: {
    width: 6,
    height: 4,
    start: ["220103", "213033", "022103", "322033"],
    goal: ["000000", "111222", "222233", "333333"],
  },
  general: {
    n: 2,
    patterns: [
      {
        p: 25,
        width: 4,
        height: 2,
        cells: ["0111", "1001"],
      },
      {
        p: 26,
        width: 2,
        height: 2,
        cells: ["10", "01"],
      },
    ],
  },
};
(0, bun_test_1.describe)("question parsing", function () {
  (0, bun_test_1.test)("example question json correctly parses", function () {
    var object = JSON.parse(exampleJson);
    var question = (function () {
      var $guard = typia_1.default.assertEquals.guard;
      var $join = typia_1.default.assertEquals.join;
      var $io0 = function (input, _exceptionable) {
        if (_exceptionable === void 0) {
          _exceptionable = true;
        }
        return (
          "object" === typeof input.board &&
          null !== input.board &&
          $io1(input.board, true && _exceptionable) &&
          "object" === typeof input.general && null !== input.general &&
          $io2(input.general, true && _exceptionable) &&
          (2 === Object.keys(input).length ||
            Object.keys(input).every(function (key) {
              if (
                ["board", "general"].some(function (prop) {
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
      var $io1 = function (input, _exceptionable) {
        if (_exceptionable === void 0) {
          _exceptionable = true;
        }
        return (
          "number" === typeof input.width &&
          Math.floor(input.width) === input.width && 0 <= input.width && input.width <= 4294967295 &&
          input.width <= 256 &&
          "number" === typeof input.height &&
            Math.floor(input.height) === input.height && 0 <= input.height && input.height <= 4294967295 &&
          input.height <= 256 &&
          Array.isArray(input.start) && 1 <= input.start.length && input.start.length <= 256 &&
          input.start.every(function (elem, _index1) {
            return "string" === typeof elem && 1 <= elem.length && elem.length <= 256;
          }) &&
          Array.isArray(input.goal) && 1 <= input.goal.length && input.goal.length <= 256 &&
          input.goal.every(function (elem, _index2) {
            return "string" === typeof elem && 1 <= elem.length && elem.length <= 256;
          }) &&
          (4 === Object.keys(input).length ||
            Object.keys(input).every(function (key) {
              if (
                ["width", "height", "start", "goal"].some(function (prop) {
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
      var $io2 = function (input, _exceptionable) {
        if (_exceptionable === void 0) {
          _exceptionable = true;
        }
        return (
          "number" === typeof input.n &&
          Math.floor(input.n) === input.n && 0 <= input.n && input.n <= 4294967295 &&
          input.n <= 256 &&
          Array.isArray(input.patterns) && input.patterns.length <= 256 &&
          input.patterns.every(function (elem, _index3) {
            return "object" === typeof elem && null !== elem && $io3(elem, true && _exceptionable);
          }) &&
          (2 === Object.keys(input).length ||
            Object.keys(input).every(function (key) {
              if (
                ["n", "patterns"].some(function (prop) {
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
      var $io3 = function (input, _exceptionable) {
        if (_exceptionable === void 0) {
          _exceptionable = true;
        }
        return (
          "number" === typeof input.p &&
          Math.floor(input.p) === input.p && 0 <= input.p && input.p <= 4294967295 &&
          input.p <= 281 &&
          "number" === typeof input.width &&
            Math.floor(input.width) === input.width && 0 <= input.width && input.width <= 4294967295 &&
          input.width <= 256 &&
          "number" === typeof input.height &&
            Math.floor(input.height) === input.height && 0 <= input.height && input.height <= 4294967295 &&
          input.height <= 256 &&
          Array.isArray(input.cells) && 1 <= input.cells.length && input.cells.length <= 256 &&
          input.cells.every(function (elem, _index4) {
            return "string" === typeof elem && 1 <= elem.length && elem.length <= 256;
          }) &&
          (4 === Object.keys(input).length ||
            Object.keys(input).every(function (key) {
              if (
                ["p", "width", "height", "cells"].some(function (prop) {
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
          (((("object" === typeof input.board && null !== input.board) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".board",
                expected: "Board",
                value: input.board,
              },
              _errorFactory,
            )) &&
            $ao1(input.board, _path + ".board", true && _exceptionable)) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".board",
                expected: "Board",
                value: input.board,
              },
              _errorFactory,
            )) &&
          (((("object" === typeof input.general && null !== input.general) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".general",
                expected: "General",
                value: input.general,
              },
              _errorFactory,
            )) &&
            $ao2(input.general, _path + ".general", true && _exceptionable)) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".general",
                expected: "General",
                value: input.general,
              },
              _errorFactory,
            )) &&
          (2 === Object.keys(input).length ||
            false === _exceptionable ||
            Object.keys(input).every(function (key) {
              if (
                ["board", "general"].some(function (prop) {
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
      var $ao1 = function (input, _path, _exceptionable) {
        if (_exceptionable === void 0) {
          _exceptionable = true;
        }
        return (
          (("number" === typeof input.width &&
            ((Math.floor(input.width) === input.width && 0 <= input.width && input.width <= 4294967295) ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".width",
                  expected: 'number & Type<"uint32">',
                  value: input.width,
                },
                _errorFactory,
              )) &&
            (input.width <= 256 ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".width",
                  expected: "number & Maximum<256>",
                  value: input.width,
                },
                _errorFactory,
              ))) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".width",
                expected: '(number & Type<"uint32"> & Maximum<256>)',
                value: input.width,
              },
              _errorFactory,
            )) &&
          (("number" === typeof input.height &&
            ((Math.floor(input.height) === input.height && 0 <= input.height && input.height <= 4294967295) ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".height",
                  expected: 'number & Type<"uint32">',
                  value: input.height,
                },
                _errorFactory,
              )) &&
            (input.height <= 256 ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".height",
                  expected: "number & Maximum<256>",
                  value: input.height,
                },
                _errorFactory,
              ))) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".height",
                expected: '(number & Type<"uint32"> & Maximum<256>)',
                value: input.height,
              },
              _errorFactory,
            )) &&
          (((Array.isArray(input.start) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".start",
                expected: "(Array<string & MinLength<1> & MaxLength<256>> & MinItems<1> & MaxItems<256>)",
                value: input.start,
              },
              _errorFactory,
            )) &&
            (1 <= input.start.length ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".start",
                  expected: "Array<> & MinItems<1>",
                  value: input.start,
                },
                _errorFactory,
              )) &&
              (input.start.length <= 256 ||
                $guard(
                  _exceptionable,
                  {
                    path: _path + ".start",
                    expected: "Array<> & MaxItems<256>",
                    value: input.start,
                  },
                  _errorFactory,
                )) &&
            input.start.every(function (elem, _index5) {
              return (
                ("string" === typeof elem &&
                  (1 <= elem.length ||
                    $guard(
                      _exceptionable,
                      {
                        path: _path + ".start[" + _index5 + "]",
                        expected: "string & MinLength<1>",
                        value: elem,
                      },
                      _errorFactory,
                    )) &&
                  (elem.length <= 256 ||
                    $guard(
                      _exceptionable,
                      {
                        path: _path + ".start[" + _index5 + "]",
                        expected: "string & MaxLength<256>",
                        value: elem,
                      },
                      _errorFactory,
                    ))) ||
                $guard(
                  _exceptionable,
                  {
                    path: _path + ".start[" + _index5 + "]",
                    expected: "(string & MinLength<1> & MaxLength<256>)",
                    value: elem,
                  },
                  _errorFactory,
                )
              );
            })) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".start",
                expected: "(Array<string & MinLength<1> & MaxLength<256>> & MinItems<1> & MaxItems<256>)",
                value: input.start,
              },
              _errorFactory,
            )) &&
          (((Array.isArray(input.goal) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".goal",
                expected: "(Array<string & MinLength<1> & MaxLength<256>> & MinItems<1> & MaxItems<256>)",
                value: input.goal,
              },
              _errorFactory,
            )) &&
            (1 <= input.goal.length ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".goal",
                  expected: "Array<> & MinItems<1>",
                  value: input.goal,
                },
                _errorFactory,
              )) &&
              (input.goal.length <= 256 ||
                $guard(
                  _exceptionable,
                  {
                    path: _path + ".goal",
                    expected: "Array<> & MaxItems<256>",
                    value: input.goal,
                  },
                  _errorFactory,
                )) &&
            input.goal.every(function (elem, _index6) {
              return (
                ("string" === typeof elem &&
                  (1 <= elem.length ||
                    $guard(
                      _exceptionable,
                      {
                        path: _path + ".goal[" + _index6 + "]",
                        expected: "string & MinLength<1>",
                        value: elem,
                      },
                      _errorFactory,
                    )) &&
                  (elem.length <= 256 ||
                    $guard(
                      _exceptionable,
                      {
                        path: _path + ".goal[" + _index6 + "]",
                        expected: "string & MaxLength<256>",
                        value: elem,
                      },
                      _errorFactory,
                    ))) ||
                $guard(
                  _exceptionable,
                  {
                    path: _path + ".goal[" + _index6 + "]",
                    expected: "(string & MinLength<1> & MaxLength<256>)",
                    value: elem,
                  },
                  _errorFactory,
                )
              );
            })) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".goal",
                expected: "(Array<string & MinLength<1> & MaxLength<256>> & MinItems<1> & MaxItems<256>)",
                value: input.goal,
              },
              _errorFactory,
            )) &&
          (4 === Object.keys(input).length ||
            false === _exceptionable ||
            Object.keys(input).every(function (key) {
              if (
                ["width", "height", "start", "goal"].some(function (prop) {
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
      var $ao2 = function (input, _path, _exceptionable) {
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
              )) &&
            (input.n <= 256 ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".n",
                  expected: "number & Maximum<256>",
                  value: input.n,
                },
                _errorFactory,
              ))) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".n",
                expected: '(number & Type<"uint32"> & Maximum<256>)',
                value: input.n,
              },
              _errorFactory,
            )) &&
          (((Array.isArray(input.patterns) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".patterns",
                expected: "(Array<Pattern> & MaxItems<256>)",
                value: input.patterns,
              },
              _errorFactory,
            )) &&
            (input.patterns.length <= 256 ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".patterns",
                  expected: "Array<> & MaxItems<256>",
                  value: input.patterns,
                },
                _errorFactory,
              )) &&
            input.patterns.every(function (elem, _index7) {
              return (
                ((("object" === typeof elem && null !== elem) ||
                  $guard(
                    _exceptionable,
                    {
                      path: _path + ".patterns[" + _index7 + "]",
                      expected: "Pattern",
                      value: elem,
                    },
                    _errorFactory,
                  )) &&
                  $ao3(elem, _path + ".patterns[" + _index7 + "]", true && _exceptionable)) ||
                $guard(
                  _exceptionable,
                  {
                    path: _path + ".patterns[" + _index7 + "]",
                    expected: "Pattern",
                    value: elem,
                  },
                  _errorFactory,
                )
              );
            })) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".patterns",
                expected: "(Array<Pattern> & MaxItems<256>)",
                value: input.patterns,
              },
              _errorFactory,
            )) &&
          (2 === Object.keys(input).length ||
            false === _exceptionable ||
            Object.keys(input).every(function (key) {
              if (
                ["n", "patterns"].some(function (prop) {
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
      var $ao3 = function (input, _path, _exceptionable) {
        if (_exceptionable === void 0) {
          _exceptionable = true;
        }
        return (
          (("number" === typeof input.p &&
            ((Math.floor(input.p) === input.p && 0 <= input.p && input.p <= 4294967295) ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".p",
                  expected: 'number & Type<"uint32">',
                  value: input.p,
                },
                _errorFactory,
              )) &&
            (input.p <= 281 ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".p",
                  expected: "number & Maximum<281>",
                  value: input.p,
                },
                _errorFactory,
              ))) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".p",
                expected: '(number & Type<"uint32"> & Maximum<281>)',
                value: input.p,
              },
              _errorFactory,
            )) &&
          (("number" === typeof input.width &&
            ((Math.floor(input.width) === input.width && 0 <= input.width && input.width <= 4294967295) ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".width",
                  expected: 'number & Type<"uint32">',
                  value: input.width,
                },
                _errorFactory,
              )) &&
            (input.width <= 256 ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".width",
                  expected: "number & Maximum<256>",
                  value: input.width,
                },
                _errorFactory,
              ))) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".width",
                expected: '(number & Type<"uint32"> & Maximum<256>)',
                value: input.width,
              },
              _errorFactory,
            )) &&
          (("number" === typeof input.height &&
            ((Math.floor(input.height) === input.height && 0 <= input.height && input.height <= 4294967295) ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".height",
                  expected: 'number & Type<"uint32">',
                  value: input.height,
                },
                _errorFactory,
              )) &&
            (input.height <= 256 ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".height",
                  expected: "number & Maximum<256>",
                  value: input.height,
                },
                _errorFactory,
              ))) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".height",
                expected: '(number & Type<"uint32"> & Maximum<256>)',
                value: input.height,
              },
              _errorFactory,
            )) &&
          (((Array.isArray(input.cells) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".cells",
                expected: "(Array<string & MinLength<1> & MaxLength<256>> & MinItems<1> & MaxItems<256>)",
                value: input.cells,
              },
              _errorFactory,
            )) &&
            (1 <= input.cells.length ||
              $guard(
                _exceptionable,
                {
                  path: _path + ".cells",
                  expected: "Array<> & MinItems<1>",
                  value: input.cells,
                },
                _errorFactory,
              )) &&
              (input.cells.length <= 256 ||
                $guard(
                  _exceptionable,
                  {
                    path: _path + ".cells",
                    expected: "Array<> & MaxItems<256>",
                    value: input.cells,
                  },
                  _errorFactory,
                )) &&
            input.cells.every(function (elem, _index8) {
              return (
                ("string" === typeof elem &&
                  (1 <= elem.length ||
                    $guard(
                      _exceptionable,
                      {
                        path: _path + ".cells[" + _index8 + "]",
                        expected: "string & MinLength<1>",
                        value: elem,
                      },
                      _errorFactory,
                    )) &&
                  (elem.length <= 256 ||
                    $guard(
                      _exceptionable,
                      {
                        path: _path + ".cells[" + _index8 + "]",
                        expected: "string & MaxLength<256>",
                        value: elem,
                      },
                      _errorFactory,
                    ))) ||
                $guard(
                  _exceptionable,
                  {
                    path: _path + ".cells[" + _index8 + "]",
                    expected: "(string & MinLength<1> & MaxLength<256>)",
                    value: elem,
                  },
                  _errorFactory,
                )
              );
            })) ||
            $guard(
              _exceptionable,
              {
                path: _path + ".cells",
                expected: "(Array<string & MinLength<1> & MaxLength<256>> & MinItems<1> & MaxItems<256>)",
                value: input.cells,
              },
              _errorFactory,
            )) &&
          (4 === Object.keys(input).length ||
            false === _exceptionable ||
            Object.keys(input).every(function (key) {
              if (
                ["p", "width", "height", "cells"].some(function (prop) {
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
                    expected: "Question",
                    value: input,
                  },
                  _errorFactory,
                )) &&
                $ao0(input, _path + "", true)) ||
              $guard(
                true,
                {
                  path: _path + "",
                  expected: "Question",
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
    (0, bun_test_1.expect)(question).toStrictEqual(expectedObject);
  });
});
