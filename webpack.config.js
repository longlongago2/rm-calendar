const path = require('path');
const chalk = require('chalk');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const localIP = require('quick-local-ip').getLocalIP4();

/* eslint-disable prefer-destructuring, no-console */
const log = console.log;

module.exports = function webpackConfig(env, argv) {
  // 打包方式
  const buildType = argv['build-type'];

  // 打印信息
  log(`
  ${chalk.bgBlue(' 构建信息：')}

  ${chalk.green('mode')}: ${chalk.yellow(env.production ? 'production' : 'development')}
  ${chalk.green('build-type')}: ${chalk.yellow(buildType)}
  `);

  // 基础配置
  const postcssPlugins = () => [
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
  ];

  const baseConfig = {
    mode: env.production ? 'production' : 'development',
    stats: {
      // 统计信息
      all: false, // 下文没有出现的设置均默认为false
      assets: true,
      builtAt: true,
      colors: true,
      errors: true,
      errorDetails: true,
    },
    entry: {
      'rm-calendar': './src/index.js',
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          loader: 'html-loader',
        },
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [['react-app', { helpers: true }]],
            plugins: buildType === 'dev' ? ['react-hot-loader/babel'] : [],
          },
        },
        {
          test: /\.css$/,
          use: [
            buildType !== 'dev' ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: { importLoaders: 1, modules: true },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: postcssPlugins,
              },
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            buildType !== 'dev' ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                modules: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: postcssPlugins,
              },
            },
            'less-loader',
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    ],
  };

  // dist 配置
  if (buildType === 'dist') {
    process.env.BABEL_ENV = 'production';
    process.env.NODE_ENV = 'production';
    return merge.smart(baseConfig, {
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/',
        library: 'RMCalendar',
        libraryTarget: 'var',
      },
      externals: {
        react: 'React',
      },
    });
  }

  // lib 配置
  if (buildType === 'lib') {
    process.env.BABEL_ENV = 'production';
    process.env.NODE_ENV = 'production';
    return merge.smart(baseConfig, {
      output: {
        path: path.resolve(__dirname, 'lib'),
        filename: '[name].js',
        publicPath: '/',
        library: 'RMCalendar',
        libraryTarget: 'umd',
      },
      externals: {
        react: {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'react',
          root: 'React', // 指向全局变量
        },
        moment: {
          commonjs: 'moment',
          commonjs2: 'moment',
          amd: 'moment',
          root: 'moment', // 指向全局变量
        },
      },
      plugins: [
        new CopyWebpackPlugin([
          {
            from: './src/*.less',
            to: './theme-less',
            flatten: true,
          },
        ]),
      ],
    });
  }

  // dev 配置
  log(`
  ${chalk.bgBlue(' Dev Server 已启动：')}

  ${chalk.green('Local')}：${chalk.yellow('http://localhost:8081')}
  ${chalk.green('Network')}：${chalk.yellow(`http://${localIP}:8081`)}
  `);

  process.env.BABEL_ENV = 'development';
  process.env.NODE_ENV = 'development';
  return merge.smart(baseConfig, {
    entry: './example/index.js',
    devtool: 'none',
    devServer: {
      contentBase: './example/dist',
      host: '0.0.0.0',
      useLocalIp: true,
      port: 8081,
      hot: true,
      compress: false,
      noInfo: true,
      open: true,
      overlay: true, // 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层显示信息
      disableHostCheck: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
          BABEL_ENV: JSON.stringify('development'),
        },
      }),
      new CleanWebpackPlugin(['./example/dist'], { verbose: false }),
      new HtmlWebpackPlugin({
        template: 'example/index.html',
        minify: false,
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'example/dist'),
    },
    resolve: {
      modules: [
        'node_modules',
        path.join(__dirname, 'lib'), // 作为依赖modules导入：可简写模块加载路径 ./lib路径可省略
      ],
    },
  });
};
