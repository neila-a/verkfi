"use client";
import ErrorBoundary from "./components/ErrorBoundary";
import Window from "./components/window/Window";
import {
    windows
} from "./layoutClient";
export default function WindowContainer() {
    return (
        <ErrorBoundary>
            <windows.Consumer>
                {value => value.windows.map(single => (
                    <Window {...single} key={single.id} />
                ))}
            </windows.Consumer>
        </ErrorBoundary>
    );
}