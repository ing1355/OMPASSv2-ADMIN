import { FormattedMessage } from 'react-intl'
import './ErrorPage.css'
import { ompassDefaultLogoImage } from '../../Constants/ConstantValues'
import Button from 'Components/CommonCustomComponents/Button'

const ErrorPage = () => {
    return <>
    <div className="error-page-container">
        <div className="error-page-content">
            <img src={ompassDefaultLogoImage} width={100} height={100}/>
            <h1><FormattedMessage id="ERROR_PAGE_TITLE_LABEL"/></h1>
            <p><FormattedMessage id="ERROR_PAGE_SUBTITLE_LABEL"/></p>
            <Button className='st3' onClick={() => {
                window.location.reload()
            }}>
                <FormattedMessage id="REFRESH" />
            </Button>
        </div>
    </div>
    </>
}

export default ErrorPage