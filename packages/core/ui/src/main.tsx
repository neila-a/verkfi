import {
    createRoot
} from "react-dom/client";
import {
    createBrowserRouter,
    RouteObject,
    RouterProvider
} from "react-router-dom";
import {
    lazy,
    StrictMode,
    Suspense
} from "react";
/* existing imports */
import Error from "error";
import Layout from "layout/layout";
import Loading from "loading";
import getCache from "setting/about/reset/getCache";
const settingPages = import.meta.glob("./setting/*/page.tsx"),
    tools = import.meta.glob("../../../tools/tool-*/page.tsx"),
    Index = lazy(() => import("page")),
    DirectInstall = lazy(() => import("setting/extensions/installExtension")),
    SettingsLayout = lazy(() => import("setting/layout")),
    ToolsLayout = lazy(() => import("tools/layout")),
    ExtensionLoader = lazy(() => import("tools/extension/page")),
    router = createBrowserRouter([
        {
            path: "/",
            Component: Layout,
            ErrorBoundary: Error,
            children: [
                {
                    index: true,
                    Component: Index
                },
                {
                    path: "/setting/extensions/install",
                    id: "installExtensions",
                    Component: DirectInstall,
                    async loader({
                        request
                    }) {
                        const
                            {
                                searchParams
                            } = new URL(request.url),
                            url = searchParams.get("url"),
                            response = await fetch(url),
                            blob = await response.blob(),
                            arrayBuffer = await blob.arrayBuffer();
                        return arrayBuffer;
                    }
                },
                {
                    path: "/setting",
                    Component: SettingsLayout,
                    children: Object.keys(settingPages).map(pagePath => {
                        const
                            {
                                page
                            } = /\.\/setting\/(?<page>.*)\/page\.tsx/.exec(pagePath).groups,
                            Element = lazy(settingPages[page] as Parameters<typeof lazy>[0]);
                        return {
                            path: page,
                            Component: Element,
                            ...page === "about" ? {
                                id: "settingsAbout",
                                loader: () => Promise.all(["usage", "quota"].map(getCache))
                            } : {
                            }
                        } as RouteObject;
                    })
                },
                {
                    path: "/tools",
                    Component: ToolsLayout,
                    children: [
                        {
                            path: "a",
                            Component: lazy(() => import("setting/appearance/page"))
                        },
                        {
                            path: "extension",
                            Component: ExtensionLoader
                        },
                        ...Object.keys(tools).map(pagePath => {
                            const
                                {
                                    page
                                } = /\.\.\/\.\.\/\.\.\/tools\/tool\-(?<page>.*)\/page\.tsx/.exec(pagePath).groups,
                                Element = lazy(tools[page] as Parameters<typeof lazy>[0]);
                            return {
                                path: page,
                                Component: Element
                            } as RouteObject;
                        })
                    ]
                }
            ]
        }
    ]);
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Suspense fallback={<Loading>
            Main
        </Loading>}>
            <RouterProvider router={router} />
        </Suspense>
    </StrictMode>
);
