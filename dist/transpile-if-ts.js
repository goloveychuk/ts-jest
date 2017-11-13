'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var utils_1 = require('./utils');
var compiler_1 = require('./compiler/compiler');
function transpileIfTypescript(path, contents, config) {
  if (path && (path.endsWith('.tsx') || path.endsWith('.ts'))) {
    var options = utils_1.getTSConfig(
      config || utils_1.mockGlobalTSConfigSchema(global),
      true
    );
    var compiler = new compiler_1.Compiler(options);
    return compiler.emitFile({ path: path, src: contents }).text;
  }
  return contents;
}
exports.transpileIfTypescript = transpileIfTypescript;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwaWxlLWlmLXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3RyYW5zcGlsZS1pZi10cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFnRTtBQUNoRSxnREFBK0M7QUFFL0MsK0JBQXNDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTztJQUMzRCxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUQsSUFBTSxPQUFPLEdBQUcsbUJBQVcsQ0FDekIsTUFBTSxJQUFJLGdDQUF3QixDQUFDLE1BQU0sQ0FBQyxFQUMxQyxJQUFJLENBQ0wsQ0FBQztRQUNGLElBQU0sUUFBUSxHQUFHLElBQUksbUJBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksTUFBQSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN6RCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBVkQsc0RBVUMifQ==
