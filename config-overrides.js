const path = require('path');

module.exports = function override(config, env) {
    // Webpack 설정에서 .md 파일을 처리하는 규칙 추가
    // config.module.rules.push({
    //     test: /\.md$/,
    //     type: 'asset/source',
    // });

    // config.module.rules.push({
    //     test: /\.(png|jpg|gif|svg)$/,
    //     type: 'asset/resource', // 이미지 파일을 처리하고, 파일 URL을 반환
    //     include: /\/docsImage\//, // /docsImage/ 경로로 시작하는 파일들만 처리
    //     generator: {
    //       filename: (pathData) => {
    //         // pathData.context는 파일이 위치한 디렉토리 경로입니다.
    //         const directory = pathData.context.split(path.sep).pop(); // 디렉토리명 추출 (예: 'windows_logon')
    //         return `assets/docs/${directory}/[name].[hash:8][ext]`; // 동적 경로 설정
    //       },
    //       publicPath: '/assets/docs/'
    //   }});

    config.resolve.alias = {
        ...config.resolve.alias,
        '@assets': path.resolve(__dirname, 'src/assets'),
    }

    return config;
};