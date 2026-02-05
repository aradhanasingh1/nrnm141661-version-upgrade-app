// module.exports = {
//   presets: [
//     ['@babel/preset-env', { targets: { node: '14.18' } }],
//     '@babel/preset-react',
//     '@babel/preset-typescript'
//   ]
// }


module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: '14.18' } }],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
};
