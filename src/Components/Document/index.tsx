import { useLocation, useNavigate } from "react-router"
import { Route, Routes } from "react-router"
import './index.css'
import { convertLangToIntlVer, ompassDefaultLogoImage } from "Constants/ConstantValues";
import LoadMdFileComponent from "./LoadMdFileComponent";
import { IntlProvider } from "react-intl";
import Locale from "Locale";
import { useSelector } from "react-redux";
import { ApplicationMenuItems, ApplicationUserMenuItems, EtcMenuItems, EtcUserMenuItems, PortalMenuItems, StartAdminMenuItems, StartUserMenuItems } from "./DocsMenuItems";

const Document = () => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const location = useLocation()
    const navigate = useNavigate()
    const isUserDocs = location.pathname.startsWith('/docs/user')

    const MenuItem = ({ title, items }: {
        title: string
        items: {
            title: React.ReactNode
            route: string
        }[]
    }) => {
        return <div className="document-menu-item">
            <div className="document-menu-title">
                - {title}
            </div>
            <div className="document-menu-inner-items">
                {
                    items.map((_, ind) => <div key={ind} className={`document-menu-inner-item-row${(location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname) === ('/docs' + _.route) ? ' selected' : ''}`} onClick={() => {
                        navigate('/docs' + _.route)
                    }}>
                        {_.title}
                    </div>)
                }
            </div>
        </div>
    }
    
    return <IntlProvider locale={convertLangToIntlVer(lang)} messages={Locale[lang]}>
        <div className="document-container">
            <div className="document-title">
                <div>
                    <img src={ompassDefaultLogoImage} />
                    OMPASS v2.0 Docs
                </div>
                <div>
                    {/* Last Updated: 2024. 12. 17. */}
                </div>
            </div>
            <div className="document-body">
                <div className="document-menu-container">
                    <div className="document-menu-items-container">
                        {
                            isUserDocs ? <>
                                <MenuItem title="시작하기" items={StartUserMenuItems} />
                                <MenuItem title="어플리케이션" items={ApplicationUserMenuItems} />
                                <MenuItem title="기타" items={EtcUserMenuItems} />
                            </> : <>
                                <MenuItem title="시작하기" items={StartAdminMenuItems} />
                                <MenuItem title="포탈 메뉴" items={PortalMenuItems} />
                                <MenuItem title="어플리케이션" items={ApplicationMenuItems} />
                                <MenuItem title="기타" items={EtcMenuItems} />
                            </>
                        }
                    </div>
                </div>
                <div className="document-contents-container">
                    <Routes>
                        <Route path="/:category/:type" element={<LoadMdFileComponent key={location.pathname} />} />
                        <Route
                            path="/"
                            element={
                                <div className="document-no-content-container">
                                    메인입니다.(내용 준비 중)
                                </div>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </div>
    </IntlProvider>
}

export default Document