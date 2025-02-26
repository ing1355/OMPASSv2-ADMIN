import BottomLineText from "Components/CommonCustomComponents/BottomLineText"
import Button from "Components/CommonCustomComponents/Button"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import downloadIcon from '../../assets/downloadIcon.png';
import downloadIconWhite from '../../assets/downloadIconWhite.png';
import uploadIcon from '../../assets/uploadIcon.png';
import uploadIconHover from '../../assets/uploadIconHover.png';
import { FormattedMessage } from "react-intl"

const License = () => {
    return <>
        <Contents>
            <ContentsHeader title="LICENSE_MANAGEMENT" subTitle="LICENSE_MANAGEMENT">
                <Button className="st5" icon={downloadIcon} hoverIcon={downloadIconWhite}>
                    <FormattedMessage id="LICENSE_REQUEST_FILE_DOWNLOAD_LABEL" />
                </Button>
                <Button className="st5" icon={uploadIcon} hoverIcon={uploadIconHover}>
                    <FormattedMessage id="LICENSE_FILE_UPLOAD_LABEL" />
                </Button>
            </ContentsHeader>
            <div className="contents-header-container">
                <BottomLineText title="라이선스 정보" />
                <CustomInputRow title="테스트">
                    test
                </CustomInputRow>
            </div>
        </Contents>
    </>
}

export default License