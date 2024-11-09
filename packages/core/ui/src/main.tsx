import {
    createRoot
} from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import {
    StrictMode
} from "react";
/* existing imports */
import Error from "error";
import DirectInstall from "setting/extensions/installExtension";
import Layout from "layout/layout";
import SettingsLayout from "setting/layout";
import ToolsLayout from "tools/layout";
import About from "setting/about/page";
import ColorTool from "setting/appearance/page";
import ExtensionManager from "setting/extensions/page";
import Options from "setting/option/page";
import Index from "page";
import getCache from "setting/about/reset/getCache";
import ExtensionLoader from "tools/extension/page";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <Error />,
        children: [
            {
                path: "/home",
                element: <Index />
            },
            {
                path: "/setting/extensions/install",
                id: "installExtensions",
                element: <DirectInstall />,
                loader: async ({
                    request
                }) => {
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
                element: <SettingsLayout />,
                children: [
                    {
                        path: "about",
                        element: <About />,
                        id: "settingsAbout",
                        loader: () => Promise.all(["usage", "quota"].map(getCache))
                    },
                    {
                        path: "appearance",
                        element: <ColorTool />
                    },
                    {
                        path: "extensions",
                        element: <ExtensionManager />
                    },
                    {
                        path: "/setting/option",
                        element: <Options />
                    }
                ]
            },
            {
                path: "/tools",
                element: <ToolsLayout />,
                children: [
                    {
                        path: "extension",
                        element: <ExtensionLoader />
                    }
                ]
            }
        ]
    }
]);
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
