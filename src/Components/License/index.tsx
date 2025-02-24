import BottomLineText from "Components/CommonCustomComponents/BottomLineText"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"

const License = () => {
    return <>
        <Contents>
            <ContentsHeader title="LICENSE_MANAGEMENT" subTitle="LICENSE_MANAGEMENT">
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