import { useCallback, useRef } from "react";

const useThrottle = () => {
    const isWaiting = useRef(false);

    return useCallback(
        (callback: (...arg: any) => void, delay: number) =>
            (...arg: any) => {
                if (!isWaiting.current) {
                    callback(...arg);
                    isWaiting.current = true;
                    setTimeout(() => {
                        isWaiting.current = false;
                    }, delay);
                }
            },
        [],
    );
};

export default useThrottle