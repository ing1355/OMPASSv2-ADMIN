import CustomModal from "Components/Modal/CustomModal"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"
import singleUserAddIcon from '@assets/singleUserAddIcon.png'
import bulkUserAddIcon from '@assets/bulkUserAddIcon.png'
import exceclUploadIcon from '@assets/exceclUploadIcon.png'
import apiSyncIcon from '@assets/apiSyncIcon.png'
import activeDirectorySyncIcon from '@assets/activeDirectorySyncIcon.png'
import msEntraIdSyncIcon from '@assets/msEntraIdSyncIcon.png'
import externalStorageSyncIcon from '@assets/externalStorageSyncIcon.png'
import ldapSyncIcon from '@assets/ldapSyncIcon.png'
import { useEffect, useState } from "react"
import { ExternalDirectoryTypes } from "Constants/ConstantValues"

type UserBulkAddModalProps = {
    addOpen: boolean
    setAddOpen: (open: boolean) => void
}

type UserAddContainerType = 'none' | 'bulk' | 'external'

const UserBulkAddModal = ({ addOpen, setAddOpen }: UserBulkAddModalProps) => {
    const [type, setType] = useState<UserAddContainerType>('none')

    useEffect(() => {
        if (addOpen) {
            setType('none')
        }
    }, [addOpen])

    return <CustomModal
        noBtns
        open={addOpen}
        onCancel={() => {
            setAddOpen(false)
        }}
        title={<FormattedMessage id={type === 'external' ? "USER_ADD_EXTERNAL_DIRECTORY_MODAL_TITLE" : type === 'bulk' ? "USER_ADD_BULK_MODAL_TITLE" : "USER_ADD_MODAL_TITLE"} />}
        width={1000}
        backCallback={type !== 'none' ? (() => {
            setType('none')
        }) : undefined}>
        <UserAddContainer type={type} setType={setType}/>
    </CustomModal>
}

const UserAddContainer = ({ type, setType }: {
    type: UserAddContainerType
    setType: (type: UserAddContainerType) => void
}) => {
    const navigate = useNavigate()
    if (type === 'external') {
        return <div className="user-add-modal-contents-container" key={1}>
            <UserAddItem title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_LDAP_SYNC_LABEL" />} icon={ldapSyncIcon} onClick={() => {
                navigate(`/UserManagement/externalDirectory/${ExternalDirectoryTypes.OPEN_LDAP}`)
            }} />
            <UserAddItem title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_AD_SYNC_LABEL" />} icon={activeDirectorySyncIcon} onClick={() => {
                navigate(`/UserManagement/externalDirectory/${ExternalDirectoryTypes.MICROSOFT_ACTIVE_DIRECTORY}`)
            }} />
            <UserAddItem title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_MS_ENTRA_ID_SYNC_LABEL" />} icon={msEntraIdSyncIcon} onClick={() => {
                navigate(`/UserManagement/externalDirectory/${ExternalDirectoryTypes.MICROSOFT_ENTRA_ID}`)
            }} />
        </div>
    } else if (type === 'bulk') {
        return <div className="user-add-modal-contents-container" key={2}>
            <UserAddItem title={<FormattedMessage id="USER_ADD_EXCEL_UPLOAD_ITEM_LABEL" />} icon={exceclUploadIcon} onClick={() => {
                navigate('/UserManagement/excelUpload')
            }} />
            <UserAddItem title={<FormattedMessage id="USER_ADD_API_SYNC_ITEM_LABEL" />} icon={apiSyncIcon} onClick={() => {
                navigate('/UserManagement/apiSync')
            }} />
        </div>
    } else {
        return <div className="user-add-modal-contents-container" key={3}>
            <UserAddItem title={<FormattedMessage id="USER_ADD_SINGLE_USER_ITEM_LABEL" />} icon={singleUserAddIcon} onClick={() => {
                navigate('/UserManagement/detail')
            }} />
            <UserAddItem title={<FormattedMessage id="USER_ADD_BULK_USER_ITEM_LABEL" />} icon={bulkUserAddIcon} onClick={() => {
                setType('bulk')
            }} />
            <UserAddItem title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_SYNC_ITEM_LABEL" />} icon={externalStorageSyncIcon} onClick={() => {
                setType('external')
            }} />
        </div>
    }
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
