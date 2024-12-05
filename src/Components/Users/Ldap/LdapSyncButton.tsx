import { message } from "antd"
import BottomLineText from "Components/CommonCustomComponents/BottomLineText"
import Button from "Components/CommonCustomComponents/Button"
import CustomLoading from "Components/CommonCustomComponents/CustomLoading"
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import CustomModal from "Components/Modal/CustomModal"
import { userSelectPageSize } from "Constants/ConstantValues"
import { AddUserWithCsvDataFunc, SyncLdapUserListFunc } from "Functions/ApiFunctions"
import useFullName from "hooks/useFullName"
import { useMemo, useState } from "react"

type LdapSyncButtonProps = {
    id: LdapConfigDataType['id']
}

const LdapSyncButton = ({ id }: LdapSyncButtonProps) => {
    const [dataLoading, setDataLoading] = useState(false)
    const [sureSync, setSureSync] = useState(false)
    const [syncDatas, setSyncDatas] = useState<LdapUserDataType[]>([])
    const [pageSetting, setPageSetting] = useState({
        page: 1,
        showPerPage: userSelectPageSize()
    })
    const tableData = useMemo(() => {
        const { page, showPerPage } = pageSetting
        return syncDatas.slice((page - 1) * showPerPage, page * showPerPage)
    }, [syncDatas, pageSetting])
    
    return <>
        <BottomLineText title="LDAP 사용자 목록" style={{
            marginTop: '48px'
        }} buttons={<>
            <Button className="st3" onClick={() => {
                message.info("사용자 목록을 불러옵니다.")
                setDataLoading(true)
                SyncLdapUserListFunc(id, res => {
                    console.log(res)
                    setSyncDatas(res)
                }).finally(() => {
                    setDataLoading(false)
                })
            }}>
                불러오기
            </Button>
            <Button className="st3" onClick={() => {
                if(syncDatas.length === 0) {
                    return message.error("동기화 할 사용자가 존재하지 않습니다. 불러오기를 먼저 진행해주세요.")
                }
                setSureSync(true)
            }}>
                동기화
            </Button>
        </>} />
        <div className="ldap-sync-user-list-container">
            {dataLoading ? <div className="ldap-sync-user-list-loading-container">
                <CustomLoading />
                데이터 불러오는 중...
            </div> : <CustomTable<LdapUserDataType>
                theme="table-st1"
                datas={tableData}
                pagination={tableData.length > 0}
                totalCount={syncDatas.length}
                onPageChange={(page, size) => {
                    setPageSetting({
                        page,
                        showPerPage: size
                    })
                }}
                columns={[
                    {
                        key: 'username',
                        title: '아이디'
                    }, {
                        key: 'firstName',
                        title: '성',
                        render: (data, ind, row) => row.name.firstName ?? "-"
                    }, {
                        key: 'lastName',
                        title: '이름',
                        render: (data, ind, row) => row.name.lastName ?? "-"
                    }, {
                        key: 'org',
                        title: '조직명'
                    }, {
                        key: 'email',
                        title: '이메일'
                    }
                ]}
            />}
        </div>
        <CustomModal
            open={sureSync}
            onCancel={() => {
                setSureSync(false)
            }}
            type="info"
            typeTitle='안내'
            typeContent={<>
                LDAP에서 불러온 사용자 목록을 포탈 사용자로 등록합니다.<br />
                기존에 등록했던 사용자는 최신 데이터로 갱신됩니다.<br/>
                진행하시겠습니까?
            </>}
            yesOrNo
            okCallback={async () => {
                return AddUserWithCsvDataFunc(syncDatas.map(_ => ({
                    username: _.username,
                    name: _.name,
                    email: _.email,
                    phone: _.phone,
                    role: 'USER'
                })), () => {
                    message.success("LDAP 사용자 목록 동기화에 성공하였습니다.")
                    setSureSync(false)
                })
            }} buttonLoading />
    </>
}

export default LdapSyncButton