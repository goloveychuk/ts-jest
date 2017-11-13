'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var crypto = require('crypto');
var fs = require('fs-extra');
var nodepath = require('path');
var postprocess_1 = require('./postprocess');
var utils_1 = require('./utils');
var compiler_1 = require('./compiler/compiler');
var compiler = new compiler_1.Compiler();
function process(src, path, config, transformOptions) {
  if (transformOptions === void 0) {
    transformOptions = { instrument: false };
  }
  var compilerOptions = utils_1.getTSConfig(
    config.globals,
    transformOptions.instrument
  );
  var tsJestConfig = utils_1.getTSJestConfig(config.globals);
  var isTsFile = path.endsWith('.ts') || path.endsWith('.tsx');
  var isJsFile = path.endsWith('.js') || path.endsWith('.jsx');
  var isHtmlFile = path.endsWith('.html');
  var postHook = postprocess_1.getPostProcessHook(
    compilerOptions,
    config,
    tsJestConfig
  );
  if (isHtmlFile && config.globals.__TRANSFORM_HTML__) {
    src = 'module.exports=`' + src + '`;';
  }
  var processFile =
    compilerOptions.allowJs === true ? isTsFile || isJsFile : isTsFile;
  if (processFile) {
    compiler.setOptions(compilerOptions);
    compiler.setCustomTransformersPath(tsJestConfig.customTransformersPath);
    var tsTranspiled = compiler.emitFile({ path: path, src: src });
    var outputText = postHook(
      tsTranspiled.text,
      path,
      config,
      transformOptions
    );
    if (!config.testRegex || !path.match(config.testRegex)) {
      var outputFilePath = nodepath.join(
        config.cacheDirectory,
        '/ts-jest/',
        crypto
          .createHash('md5')
          .update(path)
          .digest('hex')
      );
      fs.outputFileSync(outputFilePath, outputText);
    }
    var start = outputText.length > 12 ? outputText.substr(1, 10) : '';
    var modified =
      start === 'use strict'
        ? "'use strict';require('ts-jest').install();" + outputText
        : "require('ts-jest').install();" + outputText;
    return modified;
  }
  return src;
}
exports.process = process;
function getCacheKey(fileData, filePath, configStr, options) {
  if (options === void 0) {
    options = { instrument: false };
  }
  var jestConfig = JSON.parse(configStr);
  var tsConfig = utils_1.getTSConfig(jestConfig.globals, options.instrument);
  return crypto
    .createHash('md5')
    .update(JSON.stringify(tsConfig), 'utf8')
    .update(JSON.stringify(options), 'utf8')
    .update(fileData + filePath + configStr, 'utf8')
    .digest('hex');
}
exports.getCacheKey = getCacheKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3ByZXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpQztBQUNqQyw2QkFBK0I7QUFDL0IsK0JBQWlDO0FBRWpDLDZDQUFtRDtBQUNuRCxpQ0FBdUQ7QUFDdkQsZ0RBQStDO0FBRS9DLElBQU0sUUFBUSxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDO0FBRWhDLGlCQUNFLEdBQVcsRUFDWCxJQUFVLEVBQ1YsTUFBa0IsRUFDbEIsZ0JBQTBEO0lBQTFELGlDQUFBLEVBQUEscUJBQXVDLFVBQVUsRUFBRSxLQUFLLEVBQUU7SUFJMUQsSUFBTSxlQUFlLEdBQUcsbUJBQVcsQ0FDakMsTUFBTSxDQUFDLE9BQU8sRUFDZCxnQkFBZ0IsQ0FBQyxVQUFVLENBQzVCLENBQUM7SUFDRixJQUFNLFlBQVksR0FBRyx1QkFBZSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVyRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0QsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9ELElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFMUMsSUFBTSxRQUFRLEdBQUcsZ0NBQWtCLENBQUMsZUFBZSxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztJQUUzRSxFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7UUFDcEQsR0FBRyxHQUFHLGtCQUFrQixHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDeEMs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
