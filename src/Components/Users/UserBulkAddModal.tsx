import CustomModal from "Components/Modal/CustomModal"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"
import singleUserAddIcon from './../../assets/singleUserAddIcon.png'
import exceclUploadIcon from './../../assets/exceclUploadIcon.png'
import activeDirectorySyncIcon from './../../assets/activeDirectorySyncIcon.png'
import msEntraIdSyncIcon from './../../assets/msEntraIdSyncIcon.png'
import externalStorageSyncIcon from './../../assets/externalStorageSyncIcon.png'
import ldapSyncIcon from './../../assets/ldapSyncIcon.png'
import { useEffect, useState } from "react"
import { ExternalDirectoryTypes } from "Constants/ConstantValues"

type UserBulkAddModalProps = {
    addOpen: boolean
    setAddOpen: (open: boolean) => void
}

const UserBulkAddModal = ({ addOpen, setAddOpen }: UserBulkAddModalProps) => {
    const navigate = useNavigate()
    const [isExternal, setIsExternal] = useState(false)

    useEffect(() => {
        if (addOpen) {
            setIsExternal(false)
        }
    }, [addOpen])

    return <CustomModal
        noBtns
        open={addOpen}
        onCancel={() => {
            setAddOpen(false)
        }}
        title={<FormattedMessage id={isExternal ? "USER_ADD_EXTERNAL_DIRECTORY_MODAL_TITLE" : "USER_ADD_MODAL_TITLE"} />}
        width={1000}
        backCallback={isExternal ? (() => {
            setIsExternal(false)
        }) : undefined}>
        {
            !isExternal ?
                <div className="user-add-modal-contents-container" key={1}>
                    <UserAddItem title={<FormattedMessage id="USER_ADD_SINGLE_USER_ITEM_LABEL" />} icon={singleUserAddIcon} onClick={() => {
                        navigate('/UserManagement/detail')
                    }} />
                    <UserAddItem title={<FormattedMessage id="USER_ADD_EXCEL_UPLOAD_ITEM_LABEL" />} icon={exceclUploadIcon} onClick={() => {
                        navigate('/UserManagement/excelUpload')
                    }} />
                    <UserAddItem title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_SYNC_ITEM_LABEL" />} icon={externalStorageSyncIcon} onClick={() => {
                        setIsExternal(true)
                    }} />
                </div> :
                <div className="user-add-modal-contents-container" key={2}>
                    <UserAddItem title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_LDAP_SYNC_LABEL" />} icon={ldapSyncIcon} onClick={() => {
                        navigate(`/UserManagement/externalDirectory/${ExternalDirectoryTypes.OPEN_LDAP}`)
                    }} />
                    <UserAddItem title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_AD_SYNC_LABEL" />} icon={activeDirectorySyncIcon} onClick={() => {
                        navigate(`/UserManagement/externalDirectory/${ExternalDirectoryTypes.ACTIVE_DIRECTORY}`)
                    }} />
                    <UserAddItem title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_MS_ENTRA_ID_SYNC_LABEL" />} icon={msEntraIdSyncIcon} onClick={() => {
                        navigate(`/UserManagement/externalDirectory/${ExternalDirectoryTypes.MICROSOFT_ENTRA_ID}`)
                    }} />
                </div>
        }
    </CustomModal>
}

const UserAddItem = ({ title, icon, onClick }: {
    title: React.ReactNode
    icon: string
    onClick: React.DOMAttributes<HTMLDivElement>['onClick']
}) => {
    return <div className="user-add-modal-contents-item" onClick={onClick}>
        <img src={icon} />
        {title}
    </div>
}

export default UserBulkAddModal
