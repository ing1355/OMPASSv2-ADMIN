// const { NodeSSH } = require("node-ssh");
// const ssh = new NodeSSH();
require('dotenv').config();
const path = require("path");
const fs = require("fs");
const Client = require('ssh2-sftp-client');
const dayjs = require('dayjs');

const sftp = new Client();

// './public/docs/' 폴더를 재귀적으로 삭제
const docsDir = './public/docs';
if (fs.existsSync(docsDir)) {
    fs.rmSync(docsDir, { recursive: true, force: true });
    console.log(`폴더 삭제: ${docsDir}`);
}

const config = {
    host: process.env.REMOTE_HOST,
    port: '22',
    username: process.env.REMOTE_USER,
    password: process.env.REMOTE_PASS,
};

function getModifyTimeDateString(time) {
    const remoteModTime = dayjs(time); // 초 -> 밀리초 변환
    const formattedDate = remoteModTime.format('YYYY-MM-DD');
    return formattedDate
}

function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);  // 하위 디렉토리까지 모두 생성
        console.log(`디렉토리 생성: ${dirPath}`);
    }
}

async function downloadWithRetry(localPath, remotePath, count) {
    if(count < 5) {
        await sftp.get(remotePath, localPath)
        const stats = fs.statSync(localPath);
        if (stats.size === 0) {
            console.log('다운로드 실패! 재시도!!', localPath, remotePath)
            downloadWithRetry(localPath, remotePath, count + 1)
        }
    }
}

async function fetchRemoteFile(pathName) {
    const remoteFilePath = `/opt/oms/ompass2/server/doc/${pathName}`; // 원격 파일 경로
    const localFilePath = `./public/docs/${pathName}`;    // 로컬 저장 파일 경로
    let isUpdated = false
    ensureDirectoryExists(localFilePath)
    try {
        // await ssh.connect(config);
        const items = await sftp.list(remoteFilePath)

        for (const item of items) {
            const remoteItemPath = `${remoteFilePath}/${item.name}`
            const localItemPath = `${localFilePath}/${item.name}`
            if (item.type === 'd') {
                await fetchRemoteFile(`${pathName}/${item.name}`)
            } else if (item.type === '-') {
                if (fs.existsSync(localItemPath)) {
                    const localStats = fs.statSync(localItemPath)
                    const localModTime = localStats.mtimeMs.toFixed(0) * 1
                    if (item.modifyTime > localModTime) {
                        await downloadWithRetry(localItemPath, remoteItemPath, 0)
                        // await sftp.get(remoteItemPath, localItemPath)
                        fs.writeFileSync(localItemPath.replace(item.name, 'modifyTime'), getModifyTimeDateString(item.modifyTime), err => {
                            if (err) {
                                console.error('Error writing file:', err);
                            } else {
                                console.log('File written successfully!');
                            }
                        })
                        isUpdated = true
                    } else {
                        // console.log(`최신 상태 유지 ${remoteItemPath}`)
                    }
                } else {
                    await downloadWithRetry(localItemPath, remoteItemPath, 0)
                    // await sftp.get(remoteItemPath, localItemPath)
                    fs.writeFileSync(localItemPath.replace(item.name, 'modifyTime'), getModifyTimeDateString(item.modifyTime), err => {
                        if (err) {
                            console.error('Error writing file:', err);
                        } else {
                            console.log('File written successfully!');
                        }
                    })
                    isUpdated = true
                }
            }
        }
        console.log(`${remoteFilePath} -> ${localFilePath} 업데이트 ${isUpdated ? '' : '안'}됨`)
    } catch (error) {
        console.error('Error during SCP folder transfer:', error);
        process.exit(1); // 오류 발생 시 빌드를 중단
    } finally {
        // ssh.dispose();
        console.log('SCP folder transfer completed.');
    }
}

(async function () {
    ensureDirectoryExists('./public/docs')
    await sftp.connect(config);
    await fetchRemoteFile('application')
    await fetchRemoteFile('etc')
    await fetchRemoteFile('portal')
    await fetchRemoteFile('start')
    await fetchRemoteFile('user')
})().finally(async () => {
    await sftp.end()
})