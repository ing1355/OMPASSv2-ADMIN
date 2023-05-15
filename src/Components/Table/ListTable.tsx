import { FormattedMessage } from "react-intl";
import list_upload from '../../assets/list_upload.png';

interface ListTableProps {
  type: string;
}

const ListTable = ({ type }: ListTableProps) => {
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
      <div className='table-st1'>
        {type === 'admins' &&
          <table>
            <thead>
              <tr>
                <th>관리자 아이디</th>
                <th>이름</th>
                <th>전화번호</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>admin1</td>
                <td>박00</td>
                <td>010-1111-1111</td>
              </tr>
              <tr>
                <td>admin1</td>
                <td>박00</td>
                <td>010-1111-1111</td>
              </tr>
              <tr>
                <td>admin1</td>
                <td>박00</td>
                <td>010-1111-1111</td>
              </tr>
              <tr>
                <td>admin1</td>
                <td>박00</td>
                <td>010-1111-1111</td>
              </tr>
              <tr>
                <td>admin1</td>
                <td>박00</td>
                <td>010-1111-1111</td>
              </tr>
              <tr>
                <td>admin1</td>
                <td>박00</td>
                <td>010-1111-1111</td>
              </tr>
              <tr>
                <td>admin1</td>
                <td>박00</td>
                <td>010-1111-1111</td>
              </tr>
              <tr>
                <td>admin1</td>
                <td>박00</td>
                <td>010-1111-1111</td>
              </tr>
              <tr>
                <td>admin1</td>
                <td>박00</td>
                <td>010-1111-1111</td>
              </tr>
              <tr>
                <td>admin1</td>
                <td>박00</td>
                <td>010-1111-1111</td>
              </tr>
            </tbody>
          </table> 
        }
        {type === 'agent' &&
          <table>
            <thead>
              <tr>
                <th>버전</th>
                <th>일시</th>
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
        }
      </div>
    </div>
  )
}

export default ListTable;