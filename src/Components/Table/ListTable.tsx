import { FormattedMessage } from "react-intl";
import list_upload from '../../assets/list_upload.png';
import { Pagination } from "antd";
import type { PaginationProps } from 'antd';
import { useEffect, useState } from "react";
import { CustomAxiosGet } from "Components/CustomHook/CustomAxios";
import { GetPutUsersApi } from "Constants/ApiRoute";
import { GetPutUsersApiArrayType, GetPutUsersApiType } from "Types/ServerResponseDataTypes";

interface ListTableProps {
  type: string;
}

const ListTable = ({ type }: ListTableProps) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(0);
  const [adminData, setAdminData] = useState<GetPutUsersApiArrayType>([]);

  console.log('pageNum: ', pageNum);
  console.log('adminData',adminData);
  const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
    setPageNum(pageNumber-1);
    setTableCellSize(pageSizeOptions);
    console.log('pageSizeOptions',pageSizeOptions)
  };

  useEffect(() => {
    if(type === 'admins') {
      CustomAxiosGet(
        GetPutUsersApi,
        (data:GetPutUsersApiArrayType) => {
          
          setAdminData(data);
        },
        {
          page_size: tableCellSize,
          role: "ADMIN",
          page: pageNum,
        },
        () => {
          console.log('admin 유저 가져오기')
        }
      )
    }
  },[tableCellSize, pageNum]);

  return (
    <div 
      style={{width: '1200px', marginTop: '1.8%'}}
    >
      <div
        style={{float: 'right'}}
        className='mb20'
      >
        <button className='tab_download_upload_button'>
          <img src={list_upload} width='20px' className='tab_download_upload_button_img' />
          {type === 'admins' &&
            <span className='tab_download_upload_button_title'>관리자 등록</span>
          }
          {type === 'agent' &&
            <span className='tab_download_upload_button_title'><FormattedMessage id='UPLOAD_FOR_WINDOWS' /></span>
          }
        </button>
        {/* <button className='tab_download_upload_button'>
          <img src={list_upload} width='20px' className='tab_download_upload_button_img' />
          <span className='tab_download_upload_button_title'><FormattedMessage id='UPLOAD_FOR_MAC' /></span>
        </button> */}
      </div>
      {/* 테이블 */}
      {type === 'admins' &&
        <div className='table-st1'>
          <table>
            <thead>
              <tr>
                <th>관리자 아이디</th>
                <th>이름</th>
                <th>전화번호</th>
              </tr>
            </thead>
            <tbody>
              {adminData.map((data:GetPutUsersApiType) => (
                <tr>
                  <td>{data.username}</td>
                  <td>{data.name}</td>
                  <td>{data.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table> 
          <div
            className="mt50"
            style={{textAlign: 'center'}}
          >
            <Pagination showQuickJumper total={200} onChange={onChangePage}/>
          </div>
        </div>
      }
      {type === 'agent' &&
        <div className='table-st1'>
          <table>
            <thead>
              <tr>
                <th>버전</th>
                <th>업로드 일시</th>
                <th>업로드 관리자 아이디</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>v1.1.0</td>
                <td>2023.05.11</td>
                <td>dkskek123</td>
              </tr>
              <tr>
                <td>v1.1.0</td>
                <td>2023.05.11</td>
                <td>dkskek123</td>
              </tr>
              <tr>
                <td>v1.1.0</td>
                <td>2023.05.11</td>
                <td>dkskek123</td>
              </tr>
              <tr>
                <td>v1.1.0</td>
                <td>2023.05.11</td>
                <td>dkskek123</td>
              </tr>
              <tr>
                <td>v1.1.0</td>
                <td>2023.05.11</td>
                <td>dkskek123</td>
              </tr>
              <tr>
                <td>v1.1.0</td>
                <td>2023.05.11</td>
                <td>dkskek123</td>
              </tr>
              <tr>
                <td>v1.1.0</td>
                <td>2023.05.11</td>
                <td>dkskek123</td>
              </tr>
              <tr>
                <td>v1.1.0</td>
                <td>2023.05.11</td>
                <td>dkskek123</td>
              </tr>
              <tr>
                <td>v1.1.0</td>
                <td>2023.05.11</td>
                <td>dkskek123</td>
              </tr>
              <tr>
                <td>v1.1.0</td>
                <td>2023.05.11</td>
                <td>dkskek123</td>
              </tr>
            </tbody>
          </table> 
          <div
            className="mt50"
            style={{textAlign: 'center'}}
          >
            <Pagination showQuickJumper total={200} onChange={onChangePage}/>
          </div>
        </div>
      }
    </div>
  )
}

export default ListTable;