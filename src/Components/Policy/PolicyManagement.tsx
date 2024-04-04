import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import './PolicyManagement.css'
import arrowIcon from '../../assets/arrow.png'
import { useState, useEffect, useLayoutEffect, useMemo } from "react"
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { useNavigate } from "react-router"
import { GetPoliciesListFunc, GetPolicyDetailDataFunc, PolicyDataType, PolicyListDataType } from "Functions/ApiFunctions"
import { FormattedMessage } from "react-intl"

// const authTestPolicies: = [
//     {
//         id: 't1t1t1',
//         name: '정책 111111',
//         targets: ['사용자1', '어플리케이션1', '그룹2', '사용자3']
//     },
//     {
//         id: '13tw4gdrgdf',
//         name: '정책 77432',
//         targets: ['사용자1', '어플리케이션1', '그룹2', '사용자3']
//     },
//     {
//         id: '13rqfse',
//         name: '정책 666666',
//         targets: ['사용자1', '어플리케이션1', '그룹2', '사용자3']
//     },
//     {
//         id: 't3t4t4t',
//         name: '정책 4444',
//         targets: ['사용자1', '어플리케이션1', '그룹2', '사용자3']
//     },
//     {
//         id: 't3t3t3t',
//         name: '정책 33333',
//         targets: ['사용자1', '어플리케이션1', '그룹2', '사용자3']
//     },
//     {
//         id: 't1t1t122',
//         name: '정책 222222',
//         targets: ['사용자1', '어플리케이션1', '그룹2', '사용자3']
//     }
// ]

const userTestPolicies = [
    {
        id: 't1t124141231t1',
        name: '정책 111123111',
        targets: ['사용자1', '어플리케이션1', '그룹2', '사용자3']
    },
    {
        id: '13tw4124124gdrgdf',
        name: '정책 773432',
        targets: ['사용자1', '어플리케이션1', '그룹2', '사용자3']
    },
    {
        id: '13r1231231qfse',
        name: '정책 6661666',
        targets: ['사용자1', '어플리케이션1', '그룹2', '사용자3']
    },
    {
        id: 't3t1231234t4t',
        name: '정책 44144',
        targets: ['사용자1', '어플리케이션1', '그룹2', '사용자3']
    },
    {
        id: 't3t333eeeet3t',
        name: '정책 3337333',
        targets: ['사용자1', '어플리케이션1', '그룹2', '사용자3']
    },
    {
        id: 't1t1tfsfsvsfa122',
        name: '정책 2221222',
        targets: ['사용자1', '어플리케이션1', '그룹2', '사용자3']
    }
]

const TableComponent = ({opened, policyId}: {
    opened: boolean
    policyId: PolicyListDataType['id']
}) => {
    const [tableLoading, setTableLoading] = useState(false)
    const [data, setData] = useState<PolicyDataType>()
    const tableData = useMemo(() => {
        const temp = [
            {
                type: "인증 수단",
                selected: data?.enableAuthenticators
            }
        ]
    },[data])
    
    useLayoutEffect(() => {
        if(opened) {
            setTableLoading(true)
            GetPolicyDetailDataFunc(policyId).then(_ => {
                setData(_)
                console.log(_)
            }).finally(() => {
                setTableLoading(false)
            })
        }
    },[opened])

    return <div className={"policy-select-contents-body" + (opened ? '' : ' close')}>
        <div className={"policy-select-contents-body-inner" + (opened ? '' : ' close')}>
            <CustomTable<{ policyType: string, selected: boolean, contents: string }>
                theme='table-st1'
                loading={tableLoading}
                columns={[
                    {
                        key: 'policyType',
                        title: '종류'
                    },
                    {
                        key: 'selected',
                        title: '적용 여부',
                        render: (data) => data ? '적용됨' : '적용 안됨'
                    },
                    {
                        key: 'contents',
                        title: '내용'
                    }
                ]}
                datas={[
                    {
                        policyType: '인증 정책',
                        selected: true,
                        contents: '인증 필수!!'
                    },
                    {
                        policyType: '위치 정책',
                        selected: false,
                        contents: '다 됨'
                    },
                    {
                        policyType: '브라우저 정책',
                        selected: true,
                        contents: '크롬만 됨'
                    },
                    {
                        policyType: 'IP 정책',
                        selected: true,
                        contents: '192.168.xxx.xxx 대역만 됨'
                    },
                    {
                        policyType: '인증 수단 정책',
                        selected: true,
                        contents: 'OMPASS만 됨'
                    }
                ]}
            />
        </div>
    </div>
}

const PolicyManagement = () => {
    const [datas, setDatas] = useState<PolicyListDataType[]>([])
    const [opened, setOpened] = useState<string[]>([])

    const navigate = useNavigate()

    useEffect(() => {
        GetPoliciesListFunc({}, ({ results, totalCount }) => {
            setDatas(results)
        })
    }, [])

    return <Contents>
        <ContentsHeader title="POLICY_MANAGEMENT" subTitle="POLICY_MANAGEMENT" />
        <div className="contents-header-container policy-select-container">
            <div className="policy-select-item">
                <div className="policy-select-title">
                    인증 정책
                    <button onClick={() => {
                        navigate('/Policies/auth/detail')
                    }}>
                        추가
                    </button>
                </div>
                {
                    datas.map((_, ind) => <div className={"policy-select-contents"} key={_.id} >
                        <div className="policy-select-contents-header" onClick={() => {
                            if (opened.includes(_.id)) {
                                setOpened(opened.filter(__ => _.id !== __))
                            } else {
                                setOpened(opened.concat(_.id))
                            }
                        }}>
                            <div className="policy-select-contents-header-top">
                                <div>
                                    {_.policyType === 'DEFAULT' ? <FormattedMessage id={_.name} /> : _.name}
                                    <img src={arrowIcon} />
                                </div>
                                <button onClick={(e) => {
                                    navigate('/Policies/auth/detail/' + _.id)
                                }}>
                                    Edit
                                </button>
                            </div>
                            <div className="policy-select-contents-header-bottom">
                                설명 - {_.description || "없음"}
                                {/* 적용 대상 - {_.targets.map((__,_ind, arr) => <Fragment key={_ind}><a href="#">
                                    {__}
                                </a>
                                {_ind !== arr.length ? ', ' : ''}</Fragment>)} */}
                            </div>
                        </div>
                        <TableComponent opened={opened.includes(_.id)} policyId={_.id}/>
                    </div>)
                }
            </div>
            {/* <div className="policy-select-item">
                <div className="policy-select-title">
                    사용자 권한 정책
                    <button onClick={() => {
                        navigate('/Policies/user/detail')
                    }}>
                        추가
                    </button>
                </div>
                {
                    userTestPolicies.map((_, ind) => <div className={"policy-select-contents"} key={_.id}>
                        <div className="policy-select-contents-header">
                            <div className="policy-select-contents-header-top" onClick={() => {
                                if (opened.includes(_.id)) {
                                    setOpened(opened.filter(__ => _.id !== __))
                                } else {
                                    setOpened(opened.concat(_.id))
                                }
                            }}>
                                <div>
                                    {_.name}
                                    <img src={arrowIcon} />
                                </div>
                                <button onClick={() => {
                                    navigate('/Policies/user/detail/' + _.id)
                                }}>
                                    Edit
                                </button>
                            </div>
                            <div className="policy-select-contents-header-bottom">
                                적용 대상 - {_.targets.map((__,_ind, arr) => <Fragment key={_ind}><a href="#">
                                    {__}
                                </a>
                                {_ind !== arr.length ? ', ' : ''}</Fragment>)}
                            </div>
                        </div>
                        <div className={"policy-select-contents-body" + (opened.includes(_.id) ? '' : ' close')}>
                            <div className={"policy-select-contents-body-inner" + (opened.includes(_.id) ? '' : ' close')}>
                                <CustomTable<{ policyType: string, selected: boolean, contents: string }>
                                    theme='table-st1'
                                    columns={[
                                        {
                                            key: 'policyType',
                                            title: '정책 종류'
                                        },
                                        {
                                            key: 'selected',
                                            title: '적용 여부',
                                            render: (data) => data ? '적용됨' : '적용 안됨'
                                        },
                                        {
                                            key: 'contents',
                                            title: '내용'
                                        }
                                    ]}
                                    datas={[
                                        {
                                            policyType: '사용자 관리',
                                            selected: true,
                                            contents: '정보 수정'
                                        },
                                        {
                                            policyType: '관리자 관리',
                                            selected: false,
                                            contents: '다 됨'
                                        },
                                        {
                                            policyType: '버전 관리',
                                            selected: true,
                                            contents: '파일 업로드'
                                        },
                                        {
                                            policyType: '패스코드 관리',
                                            selected: true,
                                            contents: '발급, 수정'
                                        },
                                        {
                                            policyType: 'OMPASS 설정',
                                            selected: true,
                                            contents: '비밀키 수정'
                                        }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>)
                }
            </div> */}
        </div>
    </Contents>
}
//미번
export default PolicyManagement