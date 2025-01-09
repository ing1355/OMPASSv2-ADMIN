const { NodeSSH } = require("node-ssh");
require('dotenv').config();
const path = require("path");
const ssh = new NodeSSH();
const fs = require("fs");

const getDateTimeString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    const datetimeString = `${year}-${month}-${day} ${hour}:${minute}:${second}`

    return datetimeString;
}

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

        printLocalFileInfo(localFilePath);
    } catch (error) {
        console.error('Error during SCP folder transfer:', error.message);
        process.exit(1); // 오류 발생 시 빌드를 중단
    } finally {
        ssh.dispose();
        console.log('SCP folder transfer completed.');
    }
}

function printLocalFileInfo(directoryPath) {
    try {
        console.log("Fetching file details...");
        const files = fs.readdirSync(directoryPath);
        files.filter(_ => !_.includes('.')).forEach((file) => {
            const fullPath = path.join(directoryPath, file);
            const stats = fs.statSync(fullPath);
            fs.writeFile(path.join(fullPath, 'modifyTime'), getDateTimeString(stats.mtime), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                } else {
                    console.log('File written successfully!');
                }
            });

            console.log(`File: ${file}`);
            console.log(`- Path: ${fullPath}`);
            console.log(`- Size: ${stats.size} bytes`);
            console.log(`- Created: ${stats.birthtime}`);
            console.log(`- Modified: ${stats.mtime}`);
            console.log("---");
        });
    } catch (error) {
        console.error("Error fetching file details:", error.message);
    }
}

// 실행
fetchRemoteFile();