const { NodeSSH } = require("node-ssh");
require('dotenv').config();
const ssh = new NodeSSH();

async function fetchRemoteFile() {
    const config = {
        host: process.env.REMOTE_HOST,
        username: process.env.REMOTE_USER,
        password: process.env.REMOTE_PASS,
    };

    const remoteFilePath = '/opt/oms/ompass2/server/doc'; // 원격 파일 경로
    const localFilePath = './public/docs';    // 로컬 저장 파일 경로

    try {
        console.log('Starting SCP folder transfer...');
        await ssh.connect(config);
        console.log('SSH connection established.');

        // 원격 폴더를 로컬로 가져오기
        await ssh.getDirectory(localFilePath, remoteFilePath, {
            recursive: true,       // 폴더 내 모든 파일 가져오기
            tick: (localPath, remotePath, error) => {
                if (error) {
                    console.error(`Failed to copy ${remotePath}: ${error.message}`);
                } else {
                    console.log(`Copied ${remotePath} -> ${localPath}`);
                }
            }
        });
        console.log(`Folder downloaded successfully: ${localFilePath}`);
    } catch (error) {
        console.error('Error during SCP folder transfer:', error.message);
        process.exit(1); // 오류 발생 시 빌드를 중단
    } finally {
        ssh.dispose();
        console.log('SCP folder transfer completed.');
    }
}

// 실행
fetchRemoteFile();