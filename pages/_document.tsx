import Document, {
    Html,
    Head,
    Main,
    NextScript,
    DocumentContext
} from 'next/document';
export default class ModifyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }
    render() {
        return (
            <Html lang="zh-cmn-Hans-CN">
                <Head>
                    <meta charSet="utf-8" />
                    <link rel="manifest" href="/index.webmanifest" />
                    <meta name="description" content="Neila的一些没用工具。" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="application-name" content="NeilaTools" />
                    <meta name="apple-mobile-web-app-title" content="NeilaTools" />
                    <meta name="msapplication-tooltip" content="NeilaTools" />
                    <meta name="theme-color" content="#1976d2" />
                    <meta name="msapplication-navbutton-color" content="#1976d2" />
                    <meta name="msapplication-starturl" content="/" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <link rel="icon" href="/image/favicon.png" type="image/png" />
                </Head>
                <body>
                    <NextScript />
                    <Main />
                </body>
            </Html>
        )
    }
};