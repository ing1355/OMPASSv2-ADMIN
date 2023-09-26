import './PermissionComponent.css';

import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import { CustomAxiosGet } from 'Components/CommonCustomComponents/CustomAxios';
import { GetPatchPermissionsSettingApi } from 'Constants/ApiRoute';
import { GetPermissionsSettingApiType } from 'Types/ServerResponseDataTypes';

const userManagementItem = [
  'modifyUserInfo',
  'deleteUserInfo',
  'unRegisterDevice',
  'createPasscode',
  'deletePasscode',
];

const managerMangementItem = [
  'accessAdminPage',
  'registerAdmin',
  'deleteAdmin',
];

const versionManagementItem = [
  'accessVersionPage',
  'uploadFile',
  'deleteVersion',
  'currentTarget',
];

const passcodeManagementItem = [
  'accessPasscodePage',
]

const settingManagementItem = [
  'accessSettingPage',
  'modifySecretKey',
  'modifyUrl',
];

const PermissionComponent = ({ roleType }: { roleType: string }) => {

  useEffect(() => {
    CustomAxiosGet(
      GetPatchPermissionsSettingApi,
      (data: GetPermissionsSettingApiType) => {

      }
    )
  },[]);

  return (
    <>
      {roleType === 'USER' ?
      <div className='mt10' style={{border: '1px solid #ccc', borderRadius: '8px', padding: '2px 20px'}}>
        <div className='permission_component_menu_container noline'>
          <div
            className='permission_component_menu_item'
          >
            <input type="checkbox" />
            <span className='permission_component_checkbox_label title'><FormattedMessage id='USER_MANAGEMENT' /></span>
          </div>
          <div className='permission_component_all_checkbox_container'>
            {userManagementItem.map((data) => {
              return (
                <div key={'user_mgmt_' + data} className='permission_component_checkbox_container'>
                  <input type="checkbox" />
                  <span className='permission_component_checkbox_label'><FormattedMessage id={data} /></span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      :
      <div className='mt10' style={{border: '1px solid #ccc', borderRadius: '8px', padding: '2px 20px'}}>
        <div className='permission_component_menu_container'>
          <div
            className='permission_component_menu_item'
          >
            <input type="checkbox" />
            <span className='permission_component_checkbox_label title'><FormattedMessage id='USER_MANAGEMENT' /></span>
          </div>
          <div className='permission_component_all_checkbox_container'>
            {userManagementItem.map((data) => {
              return (
                <div key={'user_mgmt_' + data} className='permission_component_checkbox_container'>
                  <input type="checkbox" />
                  <span className='permission_component_checkbox_label'><FormattedMessage id={data} /></span>
                </div>
              )
            })}
          </div>
        </div>
        <div className='permission_component_menu_container'>
          <div
            className='permission_component_menu_item'
          >
            <input type="checkbox" />
            <span className='permission_component_checkbox_label title'><FormattedMessage id='ADMIN_MANAGEMENT' /></span>
          </div>
          <div className='permission_component_all_checkbox_container'>
            {managerMangementItem.map((data) => {
              return (
                <div key={'manager_mgmt_' + data} className='permission_component_checkbox_container'>
                  <input type="checkbox" />
                  <span className='permission_component_checkbox_label'><FormattedMessage id={data} /></span>
                </div>
              )
            })}
          </div>
        </div>
        <div className='permission_component_menu_container'>
          <div
            className='permission_component_menu_item'
          >
            <input type="checkbox" />
            <span className='permission_component_checkbox_label title'><FormattedMessage id='VERSION_MANAGEMENT' /></span>
          </div>
          <div className='permission_component_all_checkbox_container'>
            {versionManagementItem.map((data) => {
              return (
                <div key={'version_mgmt_' + data} className='permission_component_checkbox_container'>
                  <input type="checkbox" />
                  <span className='permission_component_checkbox_label'><FormattedMessage id={data} /></span>
                </div>
              )
            })}
          </div>
        </div>
        <div className='permission_component_menu_container'>
          <div
            className='permission_component_menu_item'
          >
            <input type="checkbox" />
            <span className='permission_component_checkbox_label title'><FormattedMessage id='PASSCODE_MANAGEMENT' /></span>
          </div>
          <div className='permission_component_all_checkbox_container'>
            {passcodeManagementItem.map((data) => {
              return (
                <div key={'passcode_mgmt_' + data} className='permission_component_checkbox_container'>
                  <input type="checkbox" />
                  <span className='permission_component_checkbox_label'><FormattedMessage id={data} /></span>
                </div>
              )
            })}
          </div>
        </div>
        <div className='permission_component_menu_container noline'>
          <div
            className='permission_component_menu_item'        
          >
            <input type="checkbox" />
            <span className='permission_component_checkbox_label title'><FormattedMessage id='OMPASS_SETTINGS' /></span>
          </div>
          <div className='permission_component_all_checkbox_container'>
            {settingManagementItem.map((data) => {
              return (
                <div key={'ompass_setting_mgmt_' + data} className='permission_component_checkbox_container'>
                  <input type="checkbox" />
                  <span className='permission_component_checkbox_label'><FormattedMessage id={data} /></span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      }
    </>

  )
}

export default PermissionComponent;