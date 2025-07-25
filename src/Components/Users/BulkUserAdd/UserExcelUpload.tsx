import { message } from "antd";
import Button from "Components/CommonCustomComponents/Button";
import { emailRegex, idRegex, nameRegex, phoneRegex } from "Constants/CommonRegex";
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
import { useSelector } from "react-redux";
import useExcelDownload from "hooks/useExcelDownload";
import Locale from '../../../Locale';

type ExcelRegexErrorDataType = {
    row: number
    key: (keyof UserExcelDataType | keyof UserNameType)
    msg: string
    value: string
}

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

const makeErrorData = (row: number, key: string, msg: string, value: string) => {
    return {
        row,
        key,
        msg,
        value
    } as ExcelRegexErrorDataType
}


const UserExcelUpload = () => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);
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
    const excelDownload = useExcelDownload()

    const tableData = useMemo(() => {
        const { page, showPerPage } = pageSetting
        return datas.slice((page - 1) * showPerPage, page * showPerPage)
    }, [datas, pageSetting])

    const findColumnWithLocale = (key: string, columns: string[]) => {
        
        const locales = Object.keys(Locale).map((_) => (Locale as {
            [key: string]: any
        })[_][key])
        return columns.findIndex(_ => locales.includes(_))
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
                            const jsonData = XLSX.utils.sheet_to_json(sheet, {
                                defval: ""
                            });
                            console.log(jsonData)

                            if(jsonData.length === 0) {
                                return message.error(formatMessage({ id: 'EXCEL_EMPTY_MSG' }));
                            }
                            let errorTemp: ExcelRegexErrorDataType[] = []

                            const columns = Object.keys(jsonData[0] as object)

                            const usernameInd = findColumnWithLocale('USER_EXCEL_USER_ID_LABEL', columns)
                            const firstNameInd = findColumnWithLocale('FIRST_NAME', columns)
                            const lastNameInd = findColumnWithLocale('LAST_NAME', columns)
                            const emailInd = findColumnWithLocale('EMAIL', columns)
                            const phoneInd = findColumnWithLocale('PHONE_NUMBER', columns)

                            if(usernameInd === -1 || firstNameInd === -1 || lastNameInd === -1 || emailInd === -1 || phoneInd === -1) {
                                return message.error(formatMessage({id: 'EXCEL_UPLOAD_FAIL_MSG'}))
                            }

                            const usernameSet = new Map<string, number>()
                            const duplicatedUsernames: string[] = []

                            const resultData = jsonData.map((_, ind) => {
                                let result = Object.values(_ as Object).reduce((pre, cur, _ind) => {
                                    if(typeof cur === 'number') cur = cur.toString()
                                    cur = cur.trim()
                                    if (_ind === usernameInd) {
                                        if (!idRegex.test(cur)) {
                                            errorTemp.push(makeErrorData(ind + 1, 'username', formatMessage({ id: 'USERNAME_CHECK' }), cur))
                                        }
                                        if (usernameSet.get(cur)) {
                                            if(duplicatedUsernames.includes(cur)) {
                                                errorTemp.push(makeErrorData(ind+1, 'username', formatMessage({ id: 'DUPLICATED_DATA_EXISTS' }), cur))
                                            } else {
                                                errorTemp.push(makeErrorData(usernameSet.get(cur)!, 'username', formatMessage({ id: 'DUPLICATED_DATA_EXISTS' }), cur))
                                                errorTemp.push(makeErrorData(ind+1, 'username', formatMessage({ id: 'DUPLICATED_DATA_EXISTS' }), cur))
                                                duplicatedUsernames.push(cur)
                                            }
                                        } else {
                                            usernameSet.set(cur, ind + 1)
                                        }
                                        pre["username"] = cur;
                                    }
                                    if (_ind === firstNameInd) {
                                        if (cur.length > 0 && !nameRegex.test(cur)) {
                                            errorTemp.push(makeErrorData(ind + 1, 'firstName', formatMessage({ id: 'FIRST_NAME_CHECK' }), cur))
                                        }
                                        pre["name"] = {
                                            ...pre["name"],
                                            "firstName": cur
                                        }
                                    }
                                    if (_ind === lastNameInd) {
                                        if (!nameRegex.test(cur)) {
                                            errorTemp.push(makeErrorData(ind + 1, 'lastName', formatMessage({ id: 'LAST_NAME_CHECK' }), cur))
                                        }
                                        pre["name"] = {
                                            ...pre["name"],
                                            "lastName": cur
                                        }
                                    }
                                    if (_ind === emailInd) {
                                        if (!cur) {
                                            errorTemp.push(makeErrorData(ind + 1, 'email', formatMessage({ id: 'PLEASE_INPUT_EMAIL' }), cur))
                                        } else if (!emailRegex.test(cur)) {
                                            errorTemp.push(makeErrorData(ind + 1, 'email', formatMessage({ id: 'EMAIL_CHECK' }), cur))
                                        }
                                        pre["email"] = cur;
                                    }
                                    if (_ind === phoneInd) {
                                        if (cur.length > 0 && !phoneRegex.test(cur)) {
                                            errorTemp.push(makeErrorData(ind + 1, 'phone', formatMessage({ id: 'PHONE_NUMBER_CHECK' }), cur))
                                        }
                                        pre["phone"] = cur;
                                    }
                                    
                                    return pre;
                                }, {})
                                return result;
                            }); // 데이터 저장
                            
                            if (errorTemp.length > 0) {
                                setShowError(errorTemp)
                            } else {
                                if(resultData.length === 0) {
                                    message.error(formatMessage({ id: 'EXCEL_EMPTY_MSG' }));
                                } else {
                                    setDatas(resultData)
                                    message.success(formatMessage({ id: 'EXCEL_UPLOAD_SUCCESS_MSG' }));
                                }
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
            width={1000}
            justConfirm
            okText={formatMessage({ id: 'CONFIRM' })}
            okClassName="excel-errors-modal-button"
            type="warning"
            okCallback={async () => {
                setShowError([])
            }}
            typeTitle={<FormattedMessage id="EXCEL_UPLOAD_ERROR_MODAL_TITLE_LABEL" />}
            typeContent={<>
                <div className="excel-errors-container">
                    <div className="excel-errors-row header">
                        <div>
                            <FormattedMessage id="EXCEL_UPLOAD_ERROR_MODAL_SUBSCRIPTION_1_LABEL" />
                        </div>
                        <div>
                            <FormattedMessage id="EXCEL_UPLOAD_ERROR_MODAL_SUBSCRIPTION_2_LABEL" />
                        </div>
                        <div>
                            <FormattedMessage id="EXCEL_UPLOAD_ERROR_MODAL_SUBSCRIPTION_4_LABEL" />
                        </div>
                        <div>
                            <FormattedMessage id="EXCEL_UPLOAD_ERROR_MODAL_SUBSCRIPTION_3_LABEL" />
                        </div>
                    </div>
                    {
                        showError.map((_, ind) => <div key={ind} className="excel-errors-row">
                            <div>
                                {_.row}
                            </div>
                            <div>
                                <FormattedMessage id={`USER_${_.key.toUpperCase()}_LABEL`} />
                                {/* {_.key.map((__, _ind, arr) => <span key={_ind} style={{
                                    marginRight: '4px'
                                }}>
                                    <FormattedMessage id={`USER_${__.toUpperCase()}_LABEL`} />
                                    {_ind !== arr.length - 1 && ','}
                                </span>)} */}
                            </div>
                            <div>
                                {_.value}
                            </div>
                            <div>
                                {_.msg}
                            </div>
                        </div>)
                    }
                </div>
            </>}
            buttonLoading />
    </>
}

export default UserExcelUpload;