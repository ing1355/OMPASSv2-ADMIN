import './AgentManagement.css';
import { FormattedMessage } from "react-intl";
import Header from "Components/Header/Header";
import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';
import { Link } from 'react-router-dom';
import { Pagination, PaginationProps, message } from 'antd';
import { useEffect, useState } from 'react';
import { GetAgentApiArrayType, GetAgentApiDataType, GetAgentApiType } from 'Types/ServerResponseDataTypes';
import { CustomAxiosGet, CustomAxiosPost } from 'Components/CustomHook/CustomAxios';
import { GetAgentInstallerApi, PostAgentInstallerUploadApi } from 'Constants/ApiRoute';

const AgentManagement = () => {
  const height = useWindowHeightHeader();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [agentData, setAgentData] = useState<GetAgentApiArrayType>([]);
  const [isAddVersion, setIsAddVersion] = useState<boolean>(false);
  const [isVersionAlert, setIsVersionAlert] = useState<boolean>(false);

  const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
    setPageNum(pageNumber);
    setTableCellSize(pageSizeOptions);
    console.log('pageNumber',pageNumber)
    console.log('pageSizeOptions',pageSizeOptions)
    console.log('tableCellSize',tableCellSize)
  };

  useEffect(() => {
    CustomAxiosGet(
      GetAgentInstallerApi,
      (data: GetAgentApiDataType) => {
        setAgentData(data.agentProgramHistories);
        setTotalCount(data.queryTotalCount);
      },
      {
        page_size: tableCellSize,
        page: pageNum -1
      },
      () => {

      }
    )
  },[tableCellSize, pageNum])

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
            <div><FormattedMessage id='VERSION_MANAGEMENT' /></div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1><FormattedMessage id='VERSION_LIST' /></h1>
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
              {isAddVersion ?
              <button className='tab_download_upload_button admins_management_button'
                type='submit'
                form='addVersionForm'
              >
                <span>버전 등록</span>
              </button>
              :
              <button className='tab_download_upload_button admins_management_button'
                type='button'
                onClick={(e) => {
                  e.preventDefault();
                  setIsAddVersion(true);
                }}
              >
                <span>버전 업로드</span>
              </button>
              }

            </div>

            {isAddVersion ?
              <div
                className='create_account_content'
              >
                <form
                  id='addVersionForm'
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    console.log('버전관리')
                    e.preventDefault();
                    // const { version } = (e.currentTarget.elements as any);
                    const { version, uploadFile } = (e.currentTarget.elements as any);
                    const metaDataVersion = version.value;
                    const multipartFile = uploadFile.files[0];

                    if(metaDataVersion) {
                      setIsVersionAlert(false);
                    } else {
                      setIsVersionAlert(true);
                    }

                    if(metaDataVersion && multipartFile && !isVersionAlert) {
                      console.log('os 업로드 api');
                      CustomAxiosPost(
                        PostAgentInstallerUploadApi,
                        (data: any) => {
                          console.log('data', data);
                          setIsAddVersion(false);
                        },
                        {
                          // metaData: {version: metaDataVersion}, 
                          'metaData.version': metaDataVersion,                          
                          multipartFile: multipartFile,
                        },
                        () => {
                          message.error('업로드 실패');
                        },
                        {
                          headers: {
                            'Content-Type': 'multipart/form-data',
                          },
                        }
                      );
                    } else {
                      console.log('에러');
                    }
                  }}
                >
                  <div>
                    <label>버전명</label>
                    <input 
                      id='version'
                      type='text'
                      className={'input-st1 create_account_input mt8 mb5 ' + (isVersionAlert ? 'red' : '')}
                      maxLength={16}
                      autoComplete='off'
                      onChange={(e) => {
                        const value = e.currentTarget.value;
                        if(value) {
                          setIsVersionAlert(false);
                        } else {
                          setIsVersionAlert(true);
                        }
                      }}
                    />
                    <div
                      className={'regex-alert ' + (isVersionAlert ? 'visible' : '')}
                    >
                      버전을 입력해주세요
                    </div>
                  </div>
                  <div>
                    <label>파일 업로드</label>
                    <input 
                      id='uploadFile'
                      type='file'
                    />
                    {/* <div
                      className={'regex-alert ' + (isVersionAlert ? 'visible' : '')}
                    >
                      파일을 등록해주세요
                    </div> */}
                  </div>
                </form>
              </div>
            :
              <div className='table-st1'>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>버전</th>
                      <th>OS</th>
                      <th>업로드 일시</th>
                      <th>업로드 관리자 아이디</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentData.map((data: GetAgentApiType, index: number) => (
                      <tr
                        key={'agent_data_' + index}
                      >
                        <td><input type='checkbox' /></td>
                        <td>{data.version}</td>
                        <td>{data.os}</td>
                        <td>{data.uploadDate}</td>
                        <td>{data.uploader}</td>
                        <td>
                          <button>다운로드</button>
                          <button>확인</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table> 
                <div
                  className="mt50 mb40"
                  style={{textAlign: 'center'}}
                >
                  <Pagination showQuickJumper showSizeChanger current={pageNum} total={totalCount} onChange={onChangePage}/>
                </div>
              </div>
            }

          </div>
        </div>
      </div>
    </>
  )
}

export default AgentManagement;