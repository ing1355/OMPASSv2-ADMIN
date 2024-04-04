import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomInputRow from "Components/Layout/CustomInputRow"
import { useState } from "react";
import { FormattedMessage } from "react-intl"
import { useParams } from "react-router";

const userManagementItem = [
    'modifyUserInfo',
    'deleteUserInfo',
    'unRegisterDevice',
    'createPasscode',
    'deletePasscode'
];

const adminManagementItem = [
    'accessAdminPage',
    'registerAdmin',
    'deleteAdmin'
];

const versionManagementItem = [
    'accessVersionPage',
    'uploadFile',
    'deleteVersion',
    'currentTarget'
];

const applciationManagementItem = [
    'modifyApplication',
    'deleteApplication',
    'addApplication',
]

const policyManagemenemtItem = [
    'modifyPolicy',
    'deletePolicy',
    'addPolicy'
]

const passcodeManagementItem = [
    'accessPasscodePage'
]

const settingManagementItem = [
    'accessSettingPage',
    'modifySecretKey',
    'modifyUrl'
];

const userPoliciesDatas = [
    {
        key: 'USER_MANAGEMENT',
        items: userManagementItem
    },
    {
        key: 'ADMIN_MANAGEMENT',
        items: adminManagementItem
    },
    {
        key: 'VERSION_MANAGEMENT',
        items: versionManagementItem
    },
    {
        key: 'PASSCODE_MANAGEMENT',
        items: passcodeManagementItem
    },
    {
        key: 'OMPASS_SETTINGS',
        items: settingManagementItem
    },
    {
        key: 'POLICY_MANAGEMENT',
        items: policyManagemenemtItem
    },
    {
        key: 'APPLICATION_MANAGEMENT',
        items: applciationManagementItem
    }
]

const UserPolicyDetail = () => {
    const [checked, setChecked] = useState<string[]>([])
    const { uuid } = useParams()
    const isAdd = !uuid
    return <Contents>
    <ContentsHeader title="POLICY_MANAGEMENT" subTitle={isAdd ? "USER_POLICY_ADD" : "USER_POLICY_DETAIL"}>
        {!isAdd && <div className="custom-detail-header-items-container">
            <div>
                정책 삭제
            </div>
        </div>}
    </ContentsHeader>
    <div className="contents-header-container">
        <CustomInputRow title="정책명">
            <input />
        </CustomInputRow>
        <CustomInputRow title="설명">
            <input />
        </CustomInputRow>
        <CustomInputRow title="정책 설정">
            <div className="policy-setting-box">
                {
                    userPoliciesDatas.map((_, ind) => <div className="policy-setting-item-row" key={ind}>
                        <div className="policy-setting-item-title">
                            <label>
                                <input type="checkbox" checked={_.items.every(__ => checked.includes(__))} onChange={(e) => {
                                    if(e.currentTarget.checked) setChecked([...new Set(checked.concat(_.items))])
                                    else setChecked(checked.filter(__ => !_.items.includes(__)))
                                }} />
                                <FormattedMessage id={_.key} />
                            </label>
                        </div>
                        <div className="policy-setting-item-contents">
                            {
                                _.items.map((__, _ind) => <div className="policy-setting-item-contents-col" key={_ind}>
                                    <label>
                                        <input type="checkbox" checked={checked.includes(__)} onChange={e => {
                                            if(e.currentTarget.checked) setChecked(checked.concat(__))
                                            else setChecked(checked.filter(___ => ___ !== __))
                                        }}/>
                                        <FormattedMessage id={__} />
                                    </label>
                                </div>)
                            }
                        </div>
                    </div>)
                }
            </div>
        </CustomInputRow>
    </div>
    <button>
        저장하기
    </button>
</Contents>
}
//미번
export default UserPolicyDetail