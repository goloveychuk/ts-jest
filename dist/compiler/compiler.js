'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var ts = require('typescript');
var fs = require('fs');
var utils = require('./utils');
function formatTscParserErrors(errors) {
  return errors
    .map(function(s) {
      return JSON.stringify(s, null, 4);
    })
    .join('\n');
}
var Files = (function() {
  function Files() {
    this.files = new Map();
  }
  Files.prototype.update = function(_a) {
    var path = _a.path,
      src = _a.src;
    var file = this.get(path);
    if (file === undefined) {
      var newFile = {
        src: src,
        path: path,
        version: 0,
        snapshot: ts.ScriptSnapshot.fromString(src),
      };
      this.files.set(path, newFile);
      return;
    }
    if (file.src === src) {
      return;
    }
    file.src = src;
    file.version += 1;
    file.snapshot = ts.ScriptSnapshot.fromString(src);
  };
  Files.prototype.get = function(path) {
    return this.files.get(path);
  };
  Files.prototype.getFileNames = function() {
    return Array.from(this.files.values()).map(function(f) {
      return f.path;
    });
  };
  Files.prototype.getScriptVersion = function(path) {
    var f = this.get(path);
    if (f === undefined) {
      return '';
    }
    return f.version.toString();
  };
  return Files;
})();
var Compiler = (function() {
  function Compiler(options) {
    this.files = new Files();
    this.options = options;
    this.service = this.createServiceHost();
  }
  Compiler.prototype.setOptions = function(options) {
    this.options = options;
  };
  Compiler.prototype.setCustomTransformersPath = function(path) {
    if (this.customTransformersPath === path) {
      return;
    }
    if (path === undefined) {
      this.customTransformers = undefined;
      this.customTransformersPath = undefined;
    } else {
      this.customTransformersPath = path;
      this.customTransformers = require(path);
    }
  };
  Compiler.prototype.createServiceHost = function() {
    var that = this;
    var service;
    var ServiceHost = (function() {
      function ServiceHost() {
        this.getCurrentDirectory = function() {
          return process.cwd();
        };
        this.getCompilationSettings = function() {
          return that.options;
        };
        this.getDefaultLibFileName = function(options) {
          return ts.getDefaultLibFilePath(options);
        };
        this.fileExists = ts.sys.fileExists;
        this.readFile = ts.sys.readFile;
        this.readDirectory = ts.sys.readDirectory;
      }
      ServiceHost.prototype.getCustomTransformers = function() {
        if (that.customTransformers === undefined) {
          return undefined;
        }
        return that.customTransformers(service.getProgram())();
      };
      ServiceHost.prototype.getScriptFileNames = function() {
        return that.files.getFileNames();
      };
      ServiceHost.prototype.getScriptVersion = function(fileName) {
        return that.files.getScriptVersion(fileName);
      };
      ServiceHost.prototype.getScriptSnapshot = function(fileName) {
        var file = that.files.get(fileName);
        if (file !== undefined) {
          return file.snapshot;
        }
        if (!fs.existsSync(fileName)) {
          return undefined;
        }
        var src = fs.readFileSync(fileName).toString();
        that.files.update({ path: fileName, src: src });
        return that.files.get(fileName).snapshot;
      };
      return ServiceHost;
    })();
    service = ts.createLanguageService(
      new ServiceHost(),
      ts.createDocumentRegistry()
    );
    return service;
  };
  Compiler.prototype.emitFile = function(_a) {
    var path = _a.path,
      src = _a.src;
    this.files.update({ path: path, src: src });
    var output = this.service.getEmitOutput(path);
    if (output.emitSkipped) {
      var errors = this.formatErrors(path);
      throw new Error('Errors while compile ts: \n' + errors);
    }
    var res = utils.findResultFor(path, output);
    return res;
  };
  Compiler.prototype.formatErrors = function(fileName) {
    var allDiagnostics = this.service
      .getCompilerOptionsDiagnostics()
      .concat(this.service.getSyntacticDiagnostics(fileName))
      .concat(this.service.getSemanticDiagnostics(fileName));
    var res = '';
    allDiagnostics.forEach(function(diagnostic) {
      var message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      );
      if (diagnostic.file) {
        var _a = diagnostic.file.getLineAndCharacterOfPosition(
            diagnostic.start
          ),
          line = _a.line,
          character = _a.character;
        res +=
          '  Error ' +
          diagnostic.file.fileName +
          ' (' +
          (line + 1) +
          ',' +
          (character + 1) +
          '): ' +
          message +
          '\n';
      } else {
        res += '  Error: ' + message + '\n';
      }
    });
    return res;
  };
  return Compiler;
})();
exports.Compiler = Compiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcGlsZXIvY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFDakMsdUJBQXlCO0FBRXpCLCtCQUFpQztBQUVqQywrQkFBK0IsTUFBdUI7SUFDcEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQTFCLENBQTBCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEUsQ0FBQztBQVNEO0lBRUU7UUFDRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUlELHNCQUFNLEdBQU4sVUFBTyxFQUE0QztZQUExQyxjQUFJLEVBQUUsWUFBRztRQUNoQixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQU0sT0FBTyxHQUFTO2dCQUNwQixHQUFHLEtBQUE7Z0JBQ0gsSUFBSSxNQUFBO2dCQUNKLE9BQU8sRUFBRSxDQUFDO2dCQUNWLFFBQVEsRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7YUFDNUMsQ0FBQztZQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUM7UUFDVCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQztRQUNULENBQUM7UUFDRCxJQUFJLENBQUMsR0FBRyxHQUFH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
