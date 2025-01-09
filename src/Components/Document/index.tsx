import { useLocation, useNavigate } from "react-router"
import { Navigate, Route, Routes } from "react-router"
import './index.css'
import { applicationTypes, convertLangToIntlVer, getApplicationTypeLabel, ompassDefaultLogoImage } from "Constants/ConstantValues";
import LoadMdFileComponent from "./LoadMdFileComponent";
import { IntlProvider } from "react-intl";
import Locale from "Locale";
import { useSelector } from "react-redux";

const Document = () => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const location = useLocation()
    const navigate = useNavigate()

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
                    items.map((_, ind) => <div key={ind} className={`document-menu-inner-item-row${location.pathname === _.route ? ' selected' : ''}`} onClick={() => {
                        navigate(_.route)
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
                    OMPASSv2.0 Docs
                </div>
                <div>
                    {/* Last Updated: 2024. 12. 17. */}
                </div>
            </div>
            <div className="document-body">
                <div className="document-menu-container">
                    <div className="document-menu-items-container">
                        <MenuItem title="어플리케이션" items={[...applicationTypes.filter(_ => _ !== 'ADMIN').map(_ => ({
                            title: getApplicationTypeLabel(_),
                            route: `/docs/application/${_}`
                        }))]} />
                    </div>
                </div>
                <div className="document-contents-container">
                    <Routes>
                        <Route path="/application/:type" element={<LoadMdFileComponent key={new Date().getTime()} />} />
                        <Route
                            path="/"
                            element={
                                <div className="document-no-content-container">
                                    메인입니다.(내용 준비 중)
                                </div>
                            }
                        />
                        <Route
                            path="/*"
                            element={
                                <Navigate to='/' replace={true} />
                            }
                        />
                    </Routes>
                </div>
            </div>
        </div>
    </IntlProvider>
}

export default Document