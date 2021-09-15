module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // presets: [
  //   '@vue/app',
  //   // '@vue/cli-plugin-babel/preset',
  //   [
  //     '@babel/preset-env',
  //     {
  //       'useBuiltIns': 'entry'
  //     }
  //   ]
  // ],
  plugins: [
      [
        'import',
        { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true },
        '@babel/plugin-syntax-dynamic-import'
      ]
    ]
}
