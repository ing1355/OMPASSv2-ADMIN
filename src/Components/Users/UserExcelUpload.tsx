import { message } from "antd";
import Button from "Components/CommonCustomComponents/Button";
import { emailRegex, idRegex, nameRegex, phoneRegex } from "Components/CommonCustomComponents/CommonRegex";
import CustomModal from "Components/Modal/CustomModal";
import CustomTable from "Components/CommonCustomComponents/CustomTable";
import CustomUpload from "Components/CommonCustomComponents/CustomUpload";
import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import { AddUserWithCsvDataFunc } from "Functions/ApiFunctions";
import useFullName from "hooks/useFullName";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as XLSX from 'xlsx'
import './UserExcelUpload.css'
import { userSelectPageSize } from "Constants/ConstantValues";
import { downloadExcelUserList } from "Functions/GlobalFunctions";

type ExcelRegexErrorDataType = {
    row: number
    key: (keyof UserExcelDataType | keyof UserNameType)[]
}

const decodeCSV = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const textDecoder = new TextDecoder("utf-8"); // 기본적으로 UTF-8 시도
    let text = textDecoder.decode(new Uint8Array(arrayBuffer));

    // 한글이 깨질 경우 EUC-KR로 재시도
    if (/�/.test(text)) { // �: 깨진 문자 확인
        const eucKrDecoder = new TextDecoder("euc-kr");
        text = eucKrDecoder.decode(new Uint8Array(arrayBuffer));
    }

    return text;
};


const UserExcelUpload = () => {
    const [datas, setDatas] = useState<UserExcelDataType[]>([])
    const [showError, setShowError] = useState<ExcelRegexErrorDataType[]>([])
    const [pageSetting, setPageSetting] = useState({
        page: 1,
        showPerPage: userSelectPageSize()
    })
    const [loading, setLoading] = useState(false)
    const createHeaderColumn = (formattedId: string) => <FormattedMessage id={formattedId} />
    const { formatMessage } = useIntl()
    const getFullName = useFullName()

    const tableData = useMemo(() => {
        const { page, showPerPage } = pageSetting
        return datas.slice((page - 1) * showPerPage, page * showPerPage)
    }, [datas, pageSetting])

    return <>
        <Contents>
            <ContentsHeader subTitle={'USER_ADD_EXCEL_UPLOAD_ITEM_LABEL'}>
                <Button loading={loading} disabled={datas.length === 0} className="st3" onClick={() => {
                    setLoading(true)
                    AddUserWithCsvDataFunc(datas.map(_ => ({
                        ..._,
                        role: 'USER'
                    })), res => {
                        message.success("사용자 추가에 성공하였습니다.")
                        setDatas([])
                    }).finally(() => {
                        setLoading(false)
                    })
                }}>
                    <FormattedMessage id="SAVE" />
                </Button>
                <Button disabled={datas.length === 0} className="st8" onClick={() => {
                    setDatas([])
                    message.success("엑셀 데이터가 초기화 되었습니다.")
                }}>
                    <FormattedMessage id="NORMAL_RESET_LABEL" />
                </Button>
                <Button className="st5" onClick={async () => {
                    downloadExcelUserList([], true)
                    // const BOM = '\uFEFF'
                    // let csvContent = "data:text/csv;charset=utf-8," + BOM;
                    // let columns = ['사용자 아이디,성,이름,이메일,전화 번호']
                    // csvContent += columns.join(',') + '\n';
                    // let link = document.createElement('a');
                    // link.download = 'OMPASS_사용자_리스트(템플릿).csv';
                    // // let blob = new Blob([text], { type: 'text/plain' });
                    // // const url = URL.createObjectURL(blob);
                    // link.href = encodeURI(csvContent);
                    // link.click();
                    // // URL.revokeObjectURL(url)
                }}>
                    템플릿 다운로드
                </Button>
            </ContentsHeader>
            <div className="contents-header-container">
                {datas.length > 0 ? <CustomTable<UserExcelDataType>
                    datas={tableData}
                    theme='table-st1'
                    pagination
                    onPageChange={(page, size) => {
                        setPageSetting({
                            page,
                            showPerPage: size
                        })
                    }}
                    totalCount={datas.length}
                    columns={[
                        {
                            key: 'username',
                            title: createHeaderColumn('USER_ID')
                        },
                        {
                            key: 'name',
                            title: createHeaderColumn('NAME'),
                            render: (data) => getFullName(data)
                        },
                        {
                            key: 'email',
                            title: createHeaderColumn('EMAIL'),
                        },
                        {
                            key: 'phone',
                            title: createHeaderColumn('PHONE_NUMBER'),
                            noWrap: true
                        },
                    ]}
                /> : <CustomUpload onChange={(file) => {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        const binaryStr = e.target?.result;

                        if (!binaryStr) {
                            message.error("파일 읽기에 실패했습니다.");
                            return;
                        }

                        try {
                            let workbook;

                            // CSV 처리: 인코딩 감지 및 UTF-8 변환
                            if (file.name.endsWith(".csv")) {
                                const text = await decodeCSV(binaryStr as ArrayBuffer);
                                workbook = XLSX.read(text, { type: "string" });
                            } else {
                                // Excel 처리: 바이너리 데이터를 읽음
                                workbook = XLSX.read(binaryStr, { type: "binary" });
                            }

                            // 첫 번째 시트 읽기
                            const sheetName = workbook.SheetNames[0];
                            const sheet = workbook.Sheets[sheetName];

                            // 시트를 JSON으로 변환
                            const jsonData = XLSX.utils.sheet_to_json(sheet, {
                                defval: ""
                            });
                            let temp: ExcelRegexErrorDataType[] = []
                            
                            const resultData = jsonData.map((_, ind) => {
                                let errorTemp: ExcelRegexErrorDataType = {
                                    row: ind + 1,
                                    key: []
                                }
                                let result = Object.values(_ as Object).reduce((pre, cur, ind) => {
                                    cur = (cur as string).trim()
                                    if (ind === 0) {
                                        if (!idRegex.test(cur)) {
                                            errorTemp.key.push('username')
                                        }
                                        pre["username"] = cur;
                                    } else if (ind === 1) {
                                        if (cur.length > 0 && !nameRegex.test(cur)) {
                                            errorTemp.key.push('firstName')
                                        }
                                        pre["name"] = {
                                            "firstName": cur
                                        }
                                    } else if (ind === 2) {
                                        if (!nameRegex.test(cur)) {
                                            errorTemp.key.push('lastName')
                                        }
                                        pre["name"] = {
                                            ...pre["name"],
                                            "lastName": cur
                                        }
                                    } else if (ind === 3) {
                                        if (!emailRegex.test(cur)) {
                                            errorTemp.key.push('email')
                                        }
                                        pre["email"] = cur;
                                    } else if (ind === 4) {
                                        if (cur.length > 0 && !phoneRegex.test(cur)) {
                                            errorTemp.key.push('phone')
                                        }
                                        pre["phone"] = cur;
                                    }
                                    return pre;
                                }, {})
                                if (errorTemp.key.length > 0) temp.push(errorTemp);
                                return result;
                            }); // 데이터 저장
                            console.log(resultData)
                            if (temp.length > 0) {
                                setShowError(temp)
                                message.error(formatMessage({ id: 'EXCEL_UPLOAD_FAIL_MSG' }));
                            } else {
                                setDatas(resultData)
                                message.success(formatMessage({ id: 'EXCEL_UPLOAD_SUCCESS_MSG' }));
                            }
                        } catch (error) {
                            console.error(error);
                            message.error(formatMessage({ id: 'EXCEL_UPLOAD_FAIL_MSG' }));
                        }
                    }
                    if (file.name.endsWith(".csv")) {
                        reader.readAsArrayBuffer(file); // CSV는 ArrayBuffer로 읽기
                    } else {
                        reader.readAsBinaryString(file); // Excel은 BinaryString으로 읽기
                    }
                }} accept="csv,xlsx" />}
            </div>
        </Contents>
        <CustomModal
            open={showError.length > 0}
            onCancel={() => {
                setShowError([])
            }}
            width={800}
            justConfirm
            okText={"확인"}
            okClassName="excel-errors-modal-button"
            type="warning"
            okCallback={async () => {
                setShowError([])
            }}
            typeTitle={"데이터 오류"}
            typeContent={<>
                <div className="excel-errors-container">
                    <div className="excel-errors-row header">
                        <div>
                            행 수
                        </div>
                        <div>
                            실패한 값
                        </div>
                    </div>
                    {
                        showError.map((_, ind) => <div key={ind} className="excel-errors-row">
                            <div>
                                {_.row}
                            </div>
                            <div>
                                {_.key.map((__, _ind, arr) => <span key={_ind} style={{
                                    marginRight: '4px'
                                }}>
                                    <FormattedMessage id={`USER_${__.toUpperCase()}_LABEL`} />
                                    {_ind !== arr.length - 1 && ','}
                                </span>)}
                            </div>
                        </div>)
                    }
                </div>
            </>}
            buttonLoading />
    </>
}

export default UserExcelUpload;