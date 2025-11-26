// // const { NodeSSH } = require("node-ssh");
// // const ssh = new NodeSSH();
// require('dotenv').config();
// const path = require("path");
// const fs = require("fs");
// const Client = require('ssh2-sftp-client');
// const dayjs = require('dayjs');

// const sftp = new Client();

// // './public/docs/' 폴더를 재귀적으로 삭제
// const docsDir = './public/docs';
// if (fs.existsSync(docsDir)) {
//     fs.rmSync(docsDir, { recursive: true, force: true });
//     console.log(`폴더 삭제: ${docsDir}`);
// }

// const config = {
//     host: process.env.REMOTE_HOST,
//     port: '22',
//     username: process.env.REMOTE_USER,
//     password: process.env.REMOTE_PASS,
// };

// function getModifyTimeDateString(time) {
//     const remoteModTime = dayjs(time); // 초 -> 밀리초 변환
//     const formattedDate = remoteModTime.format('YYYY-MM-DD');
//     return formattedDate
// }

// function ensureDirectoryExists(dirPath) {
//     if (!fs.existsSync(dirPath)) {
//         fs.mkdirSync(dirPath);  // 하위 디렉토리까지 모두 생성
//         // console.log(`디렉토리 생성: ${dirPath}`);
//     }
// }

// async function downloadWithRetry(localPath, remotePath, count) {
//     if (count < 5) {
//         await sftp.get(remotePath, localPath)
//         const stats = fs.statSync(localPath);
//         if (stats.size === 0) {
//             console.log('다운로드 실패! 재시도!!', localPath, remotePath)
//             downloadWithRetry(localPath, remotePath, count + 1)
//         }
//     }
// }

// async function fetchRemoteFile(locale, pathName) {
//     const remoteFilePath = `/opt/oms/ompass2/server/doc/${locale}/${pathName}`; // 원격 파일 경로 (locale별)
//     const localFilePath = `./public/docs/${locale}/${pathName}`;    // 로컬 저장 파일 경로 (locale별)
//     // let isUpdated = false
//     ensureDirectoryExists(localFilePath)
//     try {
//         // await ssh.connect(config);
//         const items = await sftp.list(remoteFilePath)
//         const isLeaf = items.filter(item => item.type === 'd').length === 0
//         let localModifyTime = null;
//         for (const item of items) {
//             const remoteItemPath = `${remoteFilePath}/${item.name}`
//             const localItemPath = `${localFilePath}/${item.name}`
//             if (item.type === 'd') {
//                 await fetchRemoteFile(locale, `${pathName}/${item.name}`)
//             } else if (item.type === '-') {
//                 await downloadWithRetry(localItemPath, remoteItemPath, 0)

//                 if (!localModifyTime || (localModifyTime && item.modifyTime > localModifyTime)) {
//                     localModifyTime = item.modifyTime
//                 }
//             }
//         }
//         if(isLeaf) {
//             fs.writeFileSync(localFilePath + '/modifyTime', getModifyTimeDateString(localModifyTime))
//         }
//     } catch (error) {
//         console.error('Error during SCP folder transfer:', error);
//         process.exit(1); // 오류 발생 시 빌드를 중단
//     } finally {
//         // ssh.dispose();
//         // console.log('SCP folder transfer completed.');
//     }
// }

// (async function () {
//     ensureDirectoryExists('./public/docs')
//     await sftp.connect(config);
//     try {
//         const locales = ['ko', 'en', 'ja']
//         const roots = ['application', 'etc', 'portal', 'start', 'user']
//         for (const locale of locales) {
//             ensureDirectoryExists(`./public/docs/${locale}`)
//             for (const root of roots) {
//                 await fetchRemoteFile(locale, root)
//                 console.log(`${locale}/${root} 폴더 완료`)
//             }
//         }
//     } catch (error) {
//         console.error('Error during SCP folder transfer:', error);
//         process.exit(1); // 오류 발생 시 빌드를 중단
//     } finally {
//         // ssh.dispose();
//         console.log('SCP folder transfer completed.');
//     }
// })().finally(async () => {
//     await sftp.end()
// })