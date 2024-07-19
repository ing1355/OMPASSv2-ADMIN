import { message } from "antd";
import { DownloadAgentInstallerFunc } from "Functions/ApiFunctions";

export function AgentFileDownload(setIsFileDownloadDisable: React.Dispatch<React.SetStateAction<boolean>>, errMessage: any) {
  setIsFileDownloadDisable(true);
  DownloadAgentInstallerFunc().catch(err => {
    message.error(errMessage);
  }).finally(() => {
    setIsFileDownloadDisable(false);
  })
}