import { Navigate, useLocation, useNavigate } from "react-router"
import { Route, Routes } from "react-router"
import './index.css'
import { convertLangToIntlVer, ompassDefaultLogoImage } from "Constants/ConstantValues";
// import LoadMdFileComponent from "./LoadMdFileComponent";
import { IntlProvider } from "react-intl";
import Locale from "Locale";
import { useSelector } from "react-redux";
import { ApplicationMenuItems, ApplicationUserMenuItems, EtcMenuItems, EtcUserMenuItems, PortalMenuItems, PortalUserMenuItems, StartAdminMenuItems, StartUserMenuItems } from "./DocsMenuItems";
import { isMobile } from "react-device-detect";
import { lazy, Suspense } from "react";
import LocaleChange from "Components/CommonCustomComponents/Input/LocaleChange";
import { useIntl } from "react-intl";

const LoadMdFile = lazy(() => import('./LoadMdFileComponent'))

const DocumentTitle = () => {
    const { formatMessage } = useIntl();
    const navigate = useNavigate()
    const location = useLocation()
    const pathName = location.pathname
    const isUserDocs = pathName.startsWith('/docs/user')

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
                        <div>
                            {_.title}
                        </div>
                    </div>)
                }
            </div>
        </div>
    }

    return isUserDocs ? <>
        <MenuItem title={formatMessage({ id: 'DOCS_START_LABEL' })} items={StartUserMenuItems} />
        <MenuItem title={formatMessage({ id: 'DOCS_PORTAL_LABEL' })} items={PortalUserMenuItems} />
        <MenuItem title={formatMessage({ id: 'DOCS_APPLICATION_LABEL' })} items={ApplicationUserMenuItems} />
        <MenuItem title={formatMessage({ id: 'DOCS_ETC_LABEL' })} items={EtcUserMenuItems} />
    </> : <>
        <MenuItem title={formatMessage({ id: 'DOCS_START_LABEL' })} items={StartAdminMenuItems} />
        <MenuItem title={formatMessage({ id: 'DOCS_PORTAL_LABEL' })} items={PortalMenuItems} />
        <MenuItem title={formatMessage({ id: 'DOCS_APPLICATION_LABEL' })} items={ApplicationMenuItems} />
        <MenuItem title={formatMessage({ id: 'DOCS_ETC_LABEL' })} items={EtcMenuItems} />
    </>
}

const Document = () => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const location = useLocation()

    return <IntlProvider locale={convertLangToIntlVer(lang)} messages={Locale[lang]}>
        <div className="document-container">
            <div className="document-title">
                <div>
                    <img src={ompassDefaultLogoImage} />
                    OMPASS v2.0 Docs
                </div>
                <div style={{
                    fontSize: '1rem'
                }}>
                    <LocaleChange />
                </div>
            </div>
            <div className="document-body">
                <div className="document-menu-container">
                    <div className="document-menu-items-container">
                        <DocumentTitle />
                    </div>
                </div>
                <div className="document-contents-container">
                    <Routes>
                        {!isMobile && <Route path="/:category/:type" element={<Suspense fallback={<div>Loading...</div>}><LoadMdFile key={location.pathname} /></Suspense>} />}
                        <Route
                            path="/*"
                            element={
                                <Navigate to={(userInfo && userInfo.role !== 'USER') ? "/docs/start/signup" : "/docs/user/start/signup"} />
                            }
                        />
                    </Routes>
                </div>
            </div>
        </div>
    </IntlProvider>
}

export default Document