import React from "react";
interface prop {
    hasError?: boolean;
    children?: JSX.Element;
}
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // 你同样可以将错误日志上报给服务器
        console.error(error, errorInfo);
    }

    render() {
        if ((this.state as prop).hasError == true) {
            // 你可以自定义降级后的 UI 并渲染
            return (
                <>
                </>
            );
        }

        return (this.props as prop).children;
    }
}