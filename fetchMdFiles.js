const { NodeSSH } = require("node-ssh");
const ssh = new NodeSSH();
require('dotenv').config();
const path = require("path");
const fs = require("fs");

const config = {
    host: process.env.REMOTE_HOST,
    username: process.env.REMOTE_USER,
    password: process.env.REMOTE_PASS,
};

const getMdModifyTime = (directoryPath, file) => {
    const fullPath = path.join(directoryPath, file)
    const stats = fs.statSync(fullPath);
    let time = getDateTimeString(stats.mtime)
    fs.writeFile(path.join(directoryPath, 'modifyTime'), time.split(' ')[0], (err) => {
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
    console.log(`- Modified: ${time}`);
    console.log("---");
}

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

async function sendLocalToRemoteFile(pathName) {
    const remoteFilePath = '/opt/oms/ompass2/server/doc/' + pathName; // 원격 파일 경로
    const localFilePath = './public/docs/' + pathName;

    try {
        console.log('Starting SCP local to remote folder transfer...');
        await ssh.connect(config);
        console.log('SSH connection established.');

        // 원격 폴더를 로컬로 가져오기
        console.log(`Copied ${localFilePath} -> ${remoteFilePath}`);
        await ssh.putDirectory(localFilePath, remoteFilePath, {
            recursive: true,       // 폴더 내 모든 파일 가져오기
            tick: (localPath, remotePath, error) => {
                if (error) {
                    console.error(`Failed to copy ${remotePath}: ${error.message}`);
                } else {
                    // console.log(`Copied ${localPath} -> ${remotePath}`);
                }
            }
        });
        console.log(`Folder downloaded successfully: ${localFilePath}`);

        await printLocalFileInfo(localFilePath, pathName);
    } catch (error) {
        console.error('Error during SCP folder transfer:', error.message);
        process.exit(1); // 오류 발생 시 빌드를 중단
    } finally {
        ssh.dispose();
        console.log('SCP folder transfer completed.');
    }
}

async function fetchRemoteFile(pathName) {
    const remoteFilePath = `/opt/oms/ompass2/server/doc/${pathName}`; // 원격 파일 경로
    const localFilePath = `./public/docs/${pathName}`;    // 로컬 저장 파일 경로
    try {
        await ssh.connect(config);

        // 원격 폴더를 로컬로 가져오기
        console.log(`Copied ${remoteFilePath} -> ${localFilePath}`);
        await ssh.getDirectory(localFilePath, remoteFilePath, {
            recursive: true,       // 폴더 내 모든 파일 가져오기
            tick: (localPath, remotePath, error) => {
                if (error) {
                    console.error(`Failed to copy ${remotePath}: ${error.message}`);
                } else {
                    // console.log(`Copied ${remotePath} -> ${localPath}`);
                }
            }
        });
        console.log(`Folder downloaded successfully: ${localFilePath}`);

        await printRemoteFileInfo(localFilePath, pathName);
    } catch (error) {
        console.error('Error during SCP folder transfer:', error.message);
        process.exit(1); // 오류 발생 시 빌드를 중단
    } finally {
        ssh.dispose();
        console.log('SCP folder transfer completed.');
    }
}

async function printRemoteFileInfo(directoryPath, pathName) {
    try {
        console.log("Fetching file details...");
        const isDetailDirectory = pathName.includes('/')
        if(isDetailDirectory) {
            const files = fs.readdirSync(directoryPath);
            for (const file of files) {
                if(file.includes('.md')) {
                    getMdModifyTime(directoryPath, file)
                }
            }
        } else {
            const directories = fs.readdirSync(directoryPath);
            for (const folder of directories) {
                const fullDirectoryPath = path.join(directoryPath, folder)
                const files = fs.readdirSync(fullDirectoryPath)
                for (const file of files) {
                    if(file.includes('.md')) {
                        getMdModifyTime(fullDirectoryPath, file)
                    }
                }
                
            }
        }
    } catch (error) {
        console.error("Error fetching remote file details:", error.message);
    }
}

async function printLocalFileInfo(directoryPath, pathName) {
    try {
        const folders = fs.readdirSync(directoryPath);
        const isDetailDirectory = pathName.includes('/')
        for (const target of folders.filter(_ => isDetailDirectory ? (_ !== 'modifyTime') : (!_.includes('.') && _ !== 'modifyTime'))) {
            if (isDetailDirectory) {
                if (target.includes('.md')) {
                    getMdModifyTime(directoryPath, target)
                }
            } else {
                const fullDirectoryPath = path.join(directoryPath, target);
                const files = fs.readdirSync(fullDirectoryPath)
                for (const file of files) {
                    if (file.includes('.md')) {
                        getMdModifyTime(fullDirectoryPath, file)
                    }
                }

            }

            for (const file of folders) {

            }
        }
    } catch (error) {
        console.error("Error fetching local file details:", error.message);
    }
}

// 실행
// fetchRemoteFile('application').then(async () => {
//     await sendLocalToRemoteFile('start')
//     await sendLocalToRemoteFile('user/etc')
//     await sendLocalToRemoteFile('user/started')
//     await fetchRemoteFile('portal/user')
//     await fetchRemoteFile('portal/group')
//     await sendLocalToRemoteFile('portal/passcode')
//     await sendLocalToRemoteFile('portal/authLog')
//     await sendLocalToRemoteFile('portal/userLog')
//     await sendLocalToRemoteFile('portal/application')
//     await sendLocalToRemoteFile('portal/policy')
//     await sendLocalToRemoteFile('portal/package')
//     await sendLocalToRemoteFile('portal/setting')
//     await fetchRemoteFile('user/application')
//     await fetchRemoteFile('etc')
// })

const main = async () => {
    await fetchRemoteFile('user/application')
}

main()