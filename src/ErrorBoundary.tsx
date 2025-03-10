import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        console.log(error)
        return { hasError: true, error };
    }

    componentDidMount() {
        // Promise의 Unhandled Rejection 감지
        // window.onunhandledrejection = async (event) => {
        //     axios.post('/log/front', {
        //         ua: navigator.userAgent,
        //         device: await DeviceInfo(),
        //         reason: JSON.stringify(event.reason)
        //     })
        //     console.log(event.reason, { componentStack: "Unhandled Promise Rejection" });
        //     // document.body.innerHTML = `<p>${JSON.stringify(event.reason)}</p>`
        // };
    }

    render() {
        if (this.state.hasError) {
            return <h1>⚠️ 페이지에서 문제가 발생했습니다.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;