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
        const isEn = lang === 'EN'
        const BOM = '\uFEFF'
        let csvContent = "data:text/csv;charset=utf-8," + BOM;
        let columns = [formatMessage({ id: 'USER_EXCEL_USER_ID_LABEL' }), formatMessage({ id: isEn ? 'FIRST_NAME' : 'LAST_NAME' }), formatMessage({ id: isEn ? 'LAST_NAME' : 'FIRST_NAME' }), formatMessage({ id: 'EMAIL' }), formatMessage({ id: 'PHONE_NUMBER' })]
        csvContent += columns.join(',') + '\n';
        if(!isTemplete) {
            csvContent += rows.map(_ => `${_.username},${isEn ? _.name.firstName : _.name.lastName},${isEn ? _.name.lastName : _.name.firstName},${_.email},${_.phone.startsWith('0') ? `\u200B${_.phone}` : _.phone}`).join('\n')
        }
        
        let link = document.createElement('a');
        link.download = `${formatMessage({id: 'CSV_DOWNLOAD_NAME_LABEL'})}${isTemplete ? formatMessage({id: 'CSV_TEMPLATE_LABEL'}) : ''}.csv`
        link.href = encodeURI(csvContent);
        link.click();
    }
}

export default useExcelDownload