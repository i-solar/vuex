/**
 * @file 混入 Vuex 到全局的属性中去
 * @param {Vue} Vue Vue 实例
 */
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  // 只关注 Vue 2.x 的版本
  if (version >= 2) {
    // 在 Vue 的 beforeCreate 生命周期挂载 Vuex
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    // 此处是获得 new Vue({ store }) 配置中的 store
    // 如果获取不到，则获取父的？
    // 获取后赋值给 this.$store
    if (options.store) {
      // 通过这个 store 既可以是 Function，也可以是别的东西了
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
