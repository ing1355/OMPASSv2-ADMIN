import { message } from "antd";
import Button from "Components/CommonCustomComponents/Button";
import { emailRegex, idRegex, nameRegex, phoneRegex } from "Constants/CommonRegex";
import CustomModal from "Components/Modal/CustomModal";
import CustomTable from "Components/CommonCustomComponents/CustomTable";
import CustomUpload from "Components/CommonCustomComponents/Input/CustomUpload";
import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import { AddUserWithCsvDataFunc } from "Functions/ApiFunctions";
import useFullName from "hooks/useFullName";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as XLSX from 'xlsx'
import './UserExcelUpload.css'
import { userSelectPageSize } from "Constants/ConstantValues";
import { useSelector } from "react-redux";
import useExcelDownload from "hooks/useExcelDownload";
import Locale from '../../../Locale';
import parsePhoneNumberFromString from "libphonenumber-js";
import BulkUserRegexErrorModal from "Components/CommonCustomComponents/BulkUserRegexErrorModal";
import useBulkUserDataRegex from "hooks/useBulkUserDataRegex";

const decodeCSV = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const textDecoder = new TextDecoder("utf-8");
    let text = textDecoder.decode(new Uint8Array(arrayBuffer));

    // 한글이 깨질 경우 EUC-KR로 재시도
    if (/�/.test(text)) { // �: 깨진 문자 확인
        const eucKrDecoder = new TextDecoder("euc-kr");
        text = eucKrDecoder.decode(new Uint8Array(arrayBuffer));
    }

    return text;
};

const makeErrorData = (row: number, key: string, msg: string, value?: string) => {
    return {
        row,
        key,
        msg,
        value
    } as UserRegexErrorDataType
}

const convertTxtToJson = (txtData: string) => {
    const lines = txtData.trim().split('\n');
    const headers = lines[0].split('\t'); // 헤더로 첫 번째 줄 사용
    const jsonData = lines.slice(1).map(line => {
        const values = line.split('\t');
        return headers.reduce((acc: { [key: string]: string }, header: string, index: number) => {
            acc[header] = values[index] || ''; // 값이 없으면 빈 문자열
            return acc;
        }, {});
    });
    return jsonData;
};


const UserExcelUpload = () => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const [datas, setDatas] = useState<UserExcelDataType[]>([])
    const [showError, setShowError] = useState<UserRegexErrorDataType[]>([])
    const [pageSetting, setPageSetting] = useState({
        page: 1,
        showPerPage: userSelectPageSize()
    })
    const [loading, setLoading] = useState(false)
    const createHeaderColumn = (formattedId: string) => <FormattedMessage id={formattedId} />
    const {regexTestBulkUserData} = useBulkUserDataRegex()
    const { formatMessage } = useIntl()
    const getFullName = useFullName()
    const excelDownload = useExcelDownload()

    const tableData = useMemo(() => {
        const { page, showPerPage } = pageSetting
        return datas.slice((page - 1) * showPerPage, page * showPerPage)
    }, [datas, pageSetting])

    const findColumnWithLocale = (key: string, columns: string[]) => {

        const locales = Object.keys(Locale).map((_) => (Locale as {
            [key: string]: any
        })[_][key])
        const index = columns.findIndex(_ => locales.includes(_))
        return index !== -1 ? index : undefined
    }

    return <>
        <Contents>
            <ContentsHeader subTitle={'USER_ADD_EXCEL_UPLOAD_ITEM_LABEL'}>
                <Button loading={loading} disabled={datas.length === 0} className="st3" onClick={() => {
                    setLoading(true)
                    AddUserWithCsvDataFunc({
                        userSyncMethod: 'CSV',
                        users: datas.map(_ => ({
                            ..._,
                            role: 'USER'
                        }))
                    }, res => {
                        message.success(formatMessage({ id: 'EXCEL_USER_ADD_SUCCESS_MSG' }))
                        setDatas([])
                    }).finally(() => {
                        setLoading(false)
                    })
                }}>
                    <FormattedMessage id="SAVE" />
                </Button>
                <Button disabled={datas.length === 0} className="st8" onClick={() => {
                    setDatas([])
                    message.success(formatMessage({ id: 'EXCEL_DATA_INIT_MSG' }))
                }}>
                    <FormattedMessage id="NORMAL_RESET_LABEL" />
                </Button>
                <Button className="st5" onClick={async () => {
                    excelDownload([], true)
                }}>
                    <FormattedMessage id="EXCEL_TEMPLATE_DOWNLOAD_LABEL" />
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
                            message.error(formatMessage({ id: 'EXCEL_UPLOAD_FAIL_FILE_NOT_CORRECTED_MSG' }));
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
                            const testString = XLSX.utils.sheet_to_txt(sheet)
                            const jsonData = convertTxtToJson(testString)
                            // const jsonData = XLSX.utils.sheet_to_json(sheet, {
                            //     defval: "",
                            //     raw: true
                            // });

                            if (jsonData.length === 0) {
                                return message.error(formatMessage({ id: 'EXCEL_EMPTY_MSG' }));
                            }

                            const columns = Object.keys(jsonData[0] as object)

                            const usernameInd = findColumnWithLocale('USER_EXCEL_USER_ID_LABEL', columns) || 0
                            const firstNameInd = findColumnWithLocale('FIRST_NAME', columns) || 1
                            const lastNameInd = findColumnWithLocale('LAST_NAME', columns) || 2
                            const emailInd = findColumnWithLocale('EMAIL', columns) || 3
                            const phoneInd = findColumnWithLocale('PHONE_NUMBER', columns) || 4

                            if (usernameInd === -1 || firstNameInd === -1 || lastNameInd === -1 || emailInd === -1 || phoneInd === -1) {
                                return message.error(formatMessage({ id: 'EXCEL_UPLOAD_FAIL_MSG' }))
                            }
                            
                            const bulkUserDatas: DefaultUserDataType[] = jsonData.map((_, ind) => {
                                const temp = Object.values(_)
                                return {
                                    username: temp[usernameInd],
                                    name: {
                                        firstName: temp[firstNameInd],
                                        lastName: temp[lastNameInd]
                                    },
                                    email: temp[emailInd],
                                    phone: temp[phoneInd].startsWith('\u200B') ? temp[phoneInd].slice(1) : temp[phoneInd],
                                    role: 'USER'
                                }
                            })
                            
                            if(bulkUserDatas.length > 0) {
                                regexTestBulkUserData(bulkUserDatas).then(datas => {
                                    setDatas(datas)
                                    message.success(formatMessage({ id: 'EXCEL_UPLOAD_SUCCESS_MSG' }));
                                }).catch(errorDatas => {
                                    setShowError(errorDatas)
                                }).finally(() => {
                                    setLoading(false)
                                })
                            } else {
                                message.error(formatMessage({ id: 'EXCEL_EMPTY_MSG' }));
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
        <BulkUserRegexErrorModal open={showError.length > 0} onCancel={() => {
            setShowError([])
        }} onOk={async () => {
            setShowError([])
        }} showError={showError} />
    </>
}

export default UserExcelUpload;