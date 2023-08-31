import { message } from "antd";
import { CustomAxiosGetFile } from "./CustomAxios";
import { GetAgentInstallerDownloadApi } from "Constants/ApiRoute";

export function AgentFileDownload(setIsFileDownloadDisable: React.Dispatch<React.SetStateAction<boolean>>, errMessage: any) {
  setIsFileDownloadDisable(true);
  CustomAxiosGetFile(
    GetAgentInstallerDownloadApi,
    (res:any) => {
      const versionName = res.headers['content-disposition'].split(';').filter((str:any) => str.includes('filename'))[0].match(/filename="([^"]+)"/)[1];
      const fileDownlaoadUrl = URL.createObjectURL(res.data);
      const downloadLink = document.createElement('a');
      downloadLink.href = fileDownlaoadUrl;
      downloadLink.download = versionName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(fileDownlaoadUrl);
    },
    {
    },
    () => {
      message.error(errMessage);
    },{},
    (err:any) => {
      setIsFileDownloadDisable(false);
    }
  )
}