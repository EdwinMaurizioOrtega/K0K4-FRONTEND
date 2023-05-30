import React from 'react';
import getConfig from 'next/config';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        const contextPath = getConfig().publicRuntimeConfig.contextPath;

        return (
            <Html lang="es">
                <Head>
                    <link id="theme-link" href={`${contextPath}/theme/theme-dark/pink/theme.css`} rel="stylesheet"></link>
                    <script
                        async
                        src="https://www.googletagmanager.com/gtag/js?id=G-3B7XL16EFL"
                    ></script>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-3B7XL16EFL');
              `,
                        }}
                    ></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                    <div className="layout-preloader-container">
                        <div className="layout-preloader">
                            <span></span>
                        </div>
                    </div>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
