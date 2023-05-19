import { useWindowHeightHeader } from "Components/CustomHook/useWindowHeight";
import Header from "Components/Header/Header";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { CustomAxiosGet, CustomAxiosPut } from "Components/CustomHook/CustomAxios";
import { GetPutSecretKeyApi } from "Constants/ApiRoute";
import { GetPutSecretKeyApiType } from "Types/ServerResponseDataTypes";
import { message } from "antd";

const SecretKey = () => {
  const height = useWindowHeightHeader();
  const [isAddSecretKey, setIsAddSecretKey] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [secretKeyData, setSecretKeyData] = useState<string>('');

  useEffect(() => {
    CustomAxiosGet(
      GetPutSecretKeyApi,
      (data: GetPutSecretKeyApiType) => {
        setSecretKeyData(data.secretKey);
      }
    )
  },[])

  return (
    <>
      <Header />
      <div style={{overflowY: 'auto', height: height}}>
        <div
          className='content-center'
          style={{flexDirection: 'column', marginTop: '70px'}}
        >
          <div
            className='agent_management_header'
          >
            <div>비밀키 관리</div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1>비밀키 관리</h1>
              <div
                className="App-view-manual-font"
              ><Link to='/Manual'><FormattedMessage id='VIEW_MANUAL' /></Link></div>
            </div>
          </div>

          <div 
            style={{width: '1200px', marginTop: '1.8%'}}
          >
            <div
              style={{float: 'right'}}
              className='mb20'
            >
              {isAddSecretKey ?
                <button className='tab_download_upload_button admins_management_button'
                  type='submit'
                  form='addSecretKeyForm'
                >
                  <span>비밀키 등록</span>
                </button>
                :
                <button className='tab_download_upload_button admins_management_button'
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddSecretKey(true);
                  }}
                >
                  <span>비밀키 수정</span>
                </button>
              }
            </div>

            <div>
              <form
                id='addSecretKeyForm'
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const { secretKey } = (e.currentTarget.elements as any);
                  if(isAddSecretKey) {
                    CustomAxiosPut(
                      GetPutSecretKeyApi,
                      () => {
                        setIsAddSecretKey(false);
                        message.success('비밀키 변경 성공');
                      },
                      {
                        secretKey: secretKey.value
                      },
                      () => {
                        console.log('비밀키 변경 에러')
                      }
                    )
                  }
                }}
              >
                <table>
                  <tbody>
                    <td>
                      비밀키
                    </td>
                    <td>
                      <input 
                        id='secretKey'
                        type='text'
                        className={'input-st1 create_account_input mt8 mb5'}
                        style={{width: '700px'}}
                        autoComplete='off'
                        disabled={isAddSecretKey ? false : true}
                        value={secretKeyData}
                        onChange={(e) => {
                          setSecretKeyData(e.currentTarget.value);
                        }}
                      />
                    </td>
                  </tbody>
                </table>

              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default SecretKey;