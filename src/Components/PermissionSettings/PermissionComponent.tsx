import './PermissionComponent.css';

import { FormattedMessage } from 'react-intl';
import { useEffect, useState, ChangeEvent } from 'react';

type menuType = 'userMgmt' | 'adminMgmt' | 'versionMgmt' | 'passcodeMgmt' | 'settingMgmt';

type selectCheckboxType = {
  role: userRoleType;
  menu: menuType;
  name: string;
  isChecked: boolean;
}

type allselectCheckboxType = {
  role: userRoleType;
  menu: menuType;
  isChecked: boolean;
}

const userManagementItem = [
  'modifyUserInfo',
  'deleteUserInfo',
  'unRegisterDevice',
  'createPasscode',
  'deletePasscode'
];

const managerMangementItem = [
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

const passcodeManagementItem = [
  'accessPasscodePage'
]

const settingManagementItem = [
  'accessSettingPage',
  'modifySecretKey',
  'modifyUrl'
];

const allManagememtItem = userManagementItem.concat(
  managerMangementItem,
  versionManagementItem,
  passcodeManagementItem,
  settingManagementItem
);

const s_allManagememtItem: selectCheckboxType[] = allManagememtItem.map((data) => ({
  role: 'ROOT',
  menu: userManagementItem.includes(data) ? 'userMgmt' :
    managerMangementItem.includes(data) ? 'adminMgmt' :
    versionManagementItem.includes(data) ? 'versionMgmt' :
    passcodeManagementItem.includes(data) ? 'passcodeMgmt' : 'settingMgmt',
  name: data,
  isChecked: false
}))

const a_allManagememtItem: selectCheckboxType[] = allManagememtItem.map((data) => ({
  role: 'ADMIN',
  menu: userManagementItem.includes(data) ? 'userMgmt' :
    managerMangementItem.includes(data) ? 'adminMgmt' :
    versionManagementItem.includes(data) ? 'versionMgmt' :
    passcodeManagementItem.includes(data) ? 'passcodeMgmt' : 'settingMgmt',
  name: data,
  isChecked: false
}))

const u_allManagememtItem: selectCheckboxType[] = userManagementItem.map((data) => ({
  role: 'USER',
  menu: 'userMgmt',
  name: data,
  isChecked: false
}))

const selectCheckboxItem = s_allManagememtItem.concat(
  a_allManagememtItem,
  u_allManagememtItem
);

const mgmtItem = [
  'userMgmt',
  'adminMgmt',
  'versionMgmt',
  'passcodeMgmt',
  'settingMgmt'
];

const s_allCheck: allselectCheckboxType[] = mgmtItem.map((data) => ({
  role: 'ROOT',
  menu: data as menuType,
  isChecked: false
}))

const a_allCheck: allselectCheckboxType[] = mgmtItem.map((data) => ({
  role: 'ADMIN',
  menu: data as menuType,
  isChecked: false
}))

const allCheckItem = s_allCheck.concat(
  a_allCheck,
  {
    role: 'USER',
    menu: 'userMgmt',
    isChecked: false
  }
)

const PermissionComponent = ({ roleType }: { roleType: userRoleType }) => {
  const [allCheck, setAllCheck] = useState<allselectCheckboxType[]>(allCheckItem);
  const [selectCheckbox, setSelectCheckbox] = useState<selectCheckboxType[]>(selectCheckboxItem);
  
  const allCheckboxFun = (event: ChangeEvent<HTMLInputElement>, allChk: allselectCheckboxType) => {
    let allCheckboxTemp = [...allCheck];
    let checkboxTemp = [...selectCheckbox];

    allCheckboxTemp.forEach((data) => {
      if((data.role === allChk.role) && (data.menu === allChk.menu)) {
        data.isChecked = event.target.checked;
      }
    })
    setAllCheck(allCheckboxTemp);

    checkboxTemp.forEach((data) => {
      if((data.role === allChk.role) && (data.menu === allChk.menu)) {
        data.isChecked = event.target.checked;
      }
    })
    setSelectCheckbox(checkboxTemp);
  }

  const singleCheckboxFun = (event: ChangeEvent<HTMLInputElement>, chk: selectCheckboxType) => {
    let allCheckboxTemp = [...allCheck];
    let checkboxTemp = [...selectCheckbox];

    checkboxTemp.forEach((data) => {
      if((data.role === chk.role) && (data.menu === chk.menu) && (data.name === chk.name)) {
        data.isChecked = event.target.checked;
      }
    })
    setSelectCheckbox(checkboxTemp);

    allCheckboxTemp.forEach((data) => {
      if((data.role === chk.role) && (data.menu === chk.menu)) {
        data.isChecked = checkboxTemp.filter((d) => (d.role === chk.role) && (d.menu === chk.menu)).every((i) => i.isChecked);
      }
    })

    setAllCheck(allCheckboxTemp);

  }

  const permissionCheckboxFun = (roleType: userRoleType) => {
    const s_MenuTemp = [...new Set(selectCheckbox.filter((data) => data.role === 'ROOT').map((d) => d.menu))];
    const a_MenuTemp = [...new Set(selectCheckbox.filter((data) => data.role === 'ADMIN').map((d) => d.menu))];
    const u_MenuTemp = [...new Set(selectCheckbox.filter((data) => data.role === 'USER').map((d) => d.menu))];

    return (
      roleType === 'ROOT'?
        allCheck.filter((d) => d.role === 'ROOT').map((chk, index) => {
          return (
            <div 
              key={'s_Menu' + chk.role + chk.menu}
              className={'permission_component_menu_container ' + (s_MenuTemp.length === index + 1 ? 'noline' : '')}
            >
              {selectCheckboxDivFun(chk)}
            </div>
          )
        })
      :
        roleType === 'ADMIN' ?
          allCheck.filter((d) => d.role === 'ADMIN').map((chk, index) => {
            return (
              <div 
                key={'a_Menu' + chk.role + chk.menu}
                className={'permission_component_menu_container ' + (a_MenuTemp.length === index + 1 ? 'noline' : '')}
              >
                {selectCheckboxDivFun(chk)}
              </div>
            )
          })
        :
          allCheck.filter((d) => d.role === 'USER').map((chk, index) => {
            return (
              <div 
                key={'u_Menu' + chk.role + chk.menu}
                className={'permission_component_menu_container ' + (u_MenuTemp.length === index + 1 ? 'noline' : '')}
              >
                {selectCheckboxDivFun(chk)}
              </div>
            )
          })
    )
  }

  const selectCheckboxDivFun = (allChk: allselectCheckboxType) => {
    return (
      <>
        <div
          className='permission_component_menu_item'
        >
          <input type="checkbox" id={allChk.role + allChk.menu} checked={allChk.isChecked} onChange={(e) => {allCheckboxFun(e, allChk)}}/>
          <label htmlFor={allChk.role + allChk.menu}>
            <span className='permission_component_checkbox_label title'>
              {allChk.menu === 'userMgmt' ?
                <FormattedMessage id='USER_MANAGEMENT' />
              :
                allChk.menu === 'adminMgmt' ?
                  <FormattedMessage id='ADMIN_MANAGEMENT' />
                :
                  allChk.menu === 'versionMgmt' ?
                    <FormattedMessage id='VERSION_MANAGEMENT' />
                  :
                    allChk.menu === 'passcodeMgmt' ?
                      <FormattedMessage id='PASSCODE_MANAGEMENT' />
                    :
                      <FormattedMessage id='OMPASS_SETTINGS' />
              }  
            </span>
          </label>
        </div>
        <div className='permission_component_all_checkbox_container'>
          {selectCheckbox.filter((data) => data.role === allChk.role && data.menu === allChk.menu).map((chk) => {
            return (
              <div key={chk.role + chk.menu + chk.name} className='permission_component_checkbox_container'>
                <input type="checkbox" id={chk.role + chk.menu + chk.name} checked={chk.isChecked} onChange={(e) => {singleCheckboxFun(e, chk)}} />
                <label htmlFor={chk.role + chk.menu + chk.name}>
                  <span className='permission_component_checkbox_label'>
                    <FormattedMessage id={chk.name} />
                  </span>
                </label>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  return (
    <div className='mt10' style={{border: '1px solid #ccc', borderRadius: '8px', padding: '2px 20px'}}>
      {permissionCheckboxFun(roleType)}
    </div>
  )
}

export default PermissionComponent;