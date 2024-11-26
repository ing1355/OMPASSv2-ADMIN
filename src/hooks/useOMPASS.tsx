import { useCallback, useEffect, useRef } from "react";

const useOMPASS = () => {
    const ws = useRef<WebSocket>()

    const socketOpen = useCallback((userId: string, successCallback: () => void, failCallback: () => void) => {
        // ws.current = new WebSocket(`wss:${data.interfaceServerConnection.host.replace('https://', '')}:${data.interfaceServerConnection.webSocketPort}/web`)
        ws.current!.onopen = () => {
            console.log('OMPASS 웹소켓 OPEN!')
            // ws.current.send(`${JSON.stringify({
            //     clientType: "BROWSER",
            //     nonce
            //   })}`)
        }
        ws.current!.onmessage = (e: MessageEvent) => {
            console.log('OMPASS 웹소켓 메세지', e.data)
        }
        // ws.current.onclose = (e) => {
        //     console.log('ws 연결 종료', e)
        //   }
        //   ws.current.onerror = (e) => {
        //     console.log('ws 연결 에러', e)
        //   }
    }, [])

    return socketOpen;
}

export default useOMPASS