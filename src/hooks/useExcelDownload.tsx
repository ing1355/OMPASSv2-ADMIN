import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

const useExcelDownload = () => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const { formatMessage } = useIntl()

    return (rows: {
        username: string
        name: UserNameType
        email: string
        phone: string
    }[], isTemplete?: boolean) => {
        const BOM = '\uFEFF'
        let csvContent = "data:text/csv;charset=utf-8," + BOM;
        let columns = [formatMessage({ id: 'USER_EXCEL_USER_ID_LABEL' }), formatMessage({ id: 'LAST_NAME' }), formatMessage({ id: 'FIRST_NAME' }), formatMessage({ id: 'EMAIL' }), formatMessage({ id: 'PHONE_NUMBER' })]
        csvContent += columns.join(',') + '\n';
        csvContent += rows.map(_ => `${_.username},${_.name.lastName},${_.name.firstName},${_.email},${_.phone}`).join('\n')

        let link = document.createElement('a');
        link.download = `OMPASS_사용자_리스트${isTemplete ? `(${formatMessage({ id: 'USER_EXCEL_TEMPLATE_LABEL' })})` : ''}.csv`;
        if (lang === 'KR') {
            link.download = `OMPASS_사용자_리스트${isTemplete ? '(템플릿)' : ''}.csv`;
        } else {
            link.download = `OMPASS_USER_LIST${isTemplete ? '(Form)' : ''}.csv`;
        }
        link.href = encodeURI(csvContent);
        link.click();
    }
}

export default useExcelDownload