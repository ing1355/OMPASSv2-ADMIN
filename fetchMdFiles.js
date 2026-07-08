// const { NodeSSH } = require("node-ssh");
// const ssh = new NodeSSH();
require('dotenv').config();
const path = require("path");
const fs = require("fs");
const Client = require('ssh2-sftp-client');
const dayjs = require('dayjs');
const readline = require('readline');

const sftp = new Client();

// './public/docs/' 폴더를 재귀적으로 삭제
const docsDir = './public/docs';

const config = {
    host: process.env.REMOTE_HOST,
    port: '22',
    username: process.env.REMOTE_USER,
    // password는 실행 시점에 CLI 입력 또는 인자로 전달받음
};

function getModifyTimeDateString(time) {
    const remoteModTime = dayjs(time); // 초 -> 밀리초 변환
    const formattedDate = remoteModTime.format('YYYY-MM-DD');
    return formattedDate
}

function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);  // 하위 디렉토리까지 모두 생성
        // console.log(`디렉토리 생성: ${dirPath}`);
    }
}

async function downloadWithRetry(localPath, remotePath, count) {
    if (count < 5) {
        await sftp.get(remotePath, localPath)
        const stats = fs.statSync(localPath);
        if (stats.size === 0) {
            console.log('다운로드 실패! 재시도!!', localPath, remotePath)
            downloadWithRetry(localPath, remotePath, count + 1)
        }
    }
}

async function fetchRemoteFile(locale, pathName) {
    const remoteFilePath = `/opt/oms/ompass2/server/doc/${locale}/${pathName}`; // 원격 파일 경로 (locale별)
    const localFilePath = `./public/docs/${locale}/${pathName}`;    // 로컬 저장 파일 경로 (locale별)
    // let isUpdated = false
    ensureDirectoryExists(localFilePath)
    try {
        // await ssh.connect(config);
        const items = await sftp.list(remoteFilePath)
        const isLeaf = items.filter(item => item.type === 'd').length === 0
        let localModifyTime = null;
        for (const item of items) {
            const remoteItemPath = `${remoteFilePath}/${item.name}`
            const localItemPath = `${localFilePath}/${item.name}`
            if (item.type === 'd') {
                await fetchRemoteFile(locale, `${pathName}/${item.name}`)
            } else if (item.type === '-') {
                await downloadWithRetry(localItemPath, remoteItemPath, 0)

                if (!localModifyTime || (localModifyTime && item.modifyTime > localModifyTime)) {
                    localModifyTime = item.modifyTime
                }
            }
        }
        if(isLeaf) {
            fs.writeFileSync(localFilePath + '/modifyTime', getModifyTimeDateString(localModifyTime))
        }
    } catch (error) {
        console.error('Error during SCP folder transfer:', error);
        process.exit(1); // 오류 발생 시 빌드를 중단
    } finally {
        // ssh.dispose();
        // console.log('SCP folder transfer completed.');
    }
}

function getArgValue(...names) {
    for (const name of names) {
        const prefix = `${name}=`;
        const found = process.argv.find(arg => arg.startsWith(prefix));
        if (found) return found.slice(prefix.length);
    }
    return undefined;
}

function promptHidden(queryText) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true,
        });
        // 입력 내용을 화면에 그대로 출력하지 않고 '*'로만 표시
        rl.stdoutMuted = true;
        const originalWrite = rl._writeToOutput;
        rl._writeToOutput = function (stringToWrite) {
            if (rl.stdoutMuted) {
                // 질문 프롬프트는 그대로, 입력 문자는 '*'로 대체
                if (stringToWrite.startsWith(queryText)) {
                    process.stdout.write(queryText);
                } else {
                    // 붙여넣기 등 여러 문자 입력도 별 개수만큼 출력
                    const visibleLen = stringToWrite.replace(/\u001b\[[0-9;]*m/g, '').length;
                    process.stdout.write('*'.repeat(Math.max(visibleLen, 0)));
                }
            } else {
                originalWrite.call(rl, stringToWrite);
            }
        };
        rl.question(queryText, (value) => {
            rl.stdoutMuted = false;
            process.stdout.write('\n');
            rl.close();
            resolve(value);
        });
    });
}

(async function () {
    // 비밀번호를 커맨드라인에서 입력 또는 옵션으로 전달
    let passwordFromArg = getArgValue('--password', '--pass');
    if (!passwordFromArg && process.env.REMOTE_PASS && !process.stdin.isTTY) {
        // 비대화식 환경(CI 등)에서만 환경변수 허용 (대화식이면 항상 직접 입력 유도)
        passwordFromArg = process.env.REMOTE_PASS;
    }
    let finalPassword = passwordFromArg;
    if (!finalPassword) {
        if (!process.stdin.isTTY) {
            console.error('비대화식 환경입니다. --password=비밀번호 옵션을 사용해 주세요.');
            process.exit(1);
        }
        finalPassword = await promptHidden('원격 비밀번호 입력: ');
        if (!finalPassword) {
            console.error('비밀번호가 입력되지 않았습니다.');
            process.exit(1);
        }
    }
    config.password = finalPassword;

    if (fs.existsSync(docsDir)) {
        fs.rmSync(docsDir, { recursive: true, force: true });
        console.log(`폴더 삭제: ${docsDir}`);
    }
    
    ensureDirectoryExists('./public/docs')
    await sftp.connect(config);
    try {
        const locales = ['ko', 'en', 'ja']
        const roots = ['application', 'etc', 'portal', 'start', 'user']
        for (const locale of locales) {
            ensureDirectoryExists(`./public/docs/${locale}`)
            for (const root of roots) {
                await fetchRemoteFile(locale, root)
                console.log(`${locale}/${root} 폴더 완료`)
            }
        }
    } catch (error) {
        console.error('Error during SCP folder transfer:', error);
        process.exit(1); // 오류 발생 시 빌드를 중단
    } finally {
        // ssh.dispose();
        console.log('SCP folder transfer completed.');
    }
})().finally(async () => {
    await sftp.end()
})