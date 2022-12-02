import Document, { Html, Head, Main, NextScript } from 'next/document';
class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }
    render() {
        return (
            <Html>
                <Head>
                    <link rel="manifest" href="/manifest.json" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="application-name" content="NeilaTools" />
                    <meta name="apple-mobile-web-app-title" content="NeilaTools" />
                    <meta name="msapplication-tooltip" content="NeilaTools" />
                    <meta name="theme-color" content="#27ae60" />
                    <meta name="msapplication-navbutton-color" content="#27ae60" />
                    <meta name="msapplication-starturl" content="/" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, shrink-to-fit=no"
                    />
                    <link rel="icon" href="/favicon.png" type="image/png" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
};
export default MyDocument;