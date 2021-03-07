// eslint-disable-next-line @typescript-eslint/no-var-requires
const ModuleDependencyWarning = require('webpack/lib/ModuleDependencyWarning')

module.exports = class IgnoreNotFoundExportPlugin {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  apply (compiler) {
    const messageRegExp = /export '.*'( \(reexported as '.*'\))? was not found in/

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function doneHook (stats) {
      stats.compilation.warnings = stats.compilation.warnings.filter(function (warn) {
        return !(warn instanceof ModuleDependencyWarning && messageRegExp.test(warn.message))
      })
    }

    if (compiler.hooks) {
      compiler.hooks.done.tap('IgnoreNotFoundExportPlugin', doneHook)
    } else {
      compiler.plugin('done', doneHook)
    }
  }
}
