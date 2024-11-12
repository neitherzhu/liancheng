import type { Preset, SourceCodeTransformer } from 'unocss'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'
import {
  presetApplet,
  presetRemRpx,
  transformerAttributify
} from 'unocss-applet'

const isApplet = process.env?.UNI_PLATFORM?.startsWith('mp-') ?? false
const presets: Preset[] = []
const transformers: SourceCodeTransformer[] = []

if (isApplet) {
  /**
   * UnoCSS Applet
   * @see https://github.com/unocss-applet/unocss-applet
   */
  presets.push(presetApplet())
  presets.push(presetRemRpx()) // 如果需要使用 rem 转 rpx 单位，需要启用此插件
  transformers.push(
    transformerAttributify({
      ignoreAttributes: ['block'],
      deleteAttributes: false
    })
  )
} else {
  presets.push(presetApplet())
  presets.push(presetAttributify())
  presets.push(presetRemRpx({ mode: 'rpx2rem' }))
}

export default defineConfig({
  presets: [
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      }
    }),
    ...presets
  ],
  transformers: [
    transformerDirectives(), // 启用 @apply 功能
    transformerVariantGroup(), // 启用 () 分组功能
    ...transformers
  ],
  rules: [
    [
      'p-safe',
      {
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)'
      }
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
    [/^flex-([\.\d]+)$/, ([_, num]) => ({ flex: `${num}` })]
  ]
})
