/* eslint-disable react/no-danger */

import Document, { Html, Head, Main, NextScript } from 'next/document';
import theme from '@ewarren/persist/lib/theme';
import removeCommentsAndSpacing from '../util/removeCommentsAndSpacing';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content={theme.colors.navy} />
          <meta name="apple-mobile-web-app-capable" content="no" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Switchboard" />
          <link
            rel="apple-touch-icon"
            href="/img/icons/apple-touch-icon-152x152.png"
          />
          <link
            rel="mask-icon"
            href="/img/icons/safari-pinned-tab.svg"
            color={theme.colors.navy}
          />
          <meta
            name="msapplication-TileImage"
            content="/img/icons/msapplication-icon-144x144.png"
          />
          <meta name="msapplication-TileColor" content={theme.colors.navy} />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.elizabethwarren.com/_public/fonts/fonts.css"
          />
          {process.env.NODE_ENV === 'production' && (
            <script
              dangerouslySetInnerHTML={{
                __html: removeCommentsAndSpacing(`
window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=t.forceSSL||"https:"===document.location.protocol,a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=(r?"https:":"http:")+"//cdn.heapanalytics.com/js/heap-"+e+".js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(a,n);for(var o=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=o(p[c])};
heap.load("${process.env.HEAP_ID}");
`).trim(),
              }}
            />
          )}
          <script src="/scripts/tinymce/tinymce.min.js" />
        </Head>
        <style jsx global>{`
          html,
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          label,
          button {
            cursor: pointer;
          }
        `}</style>
        <body className="font-sans overflow-x-hidden m-0 p-0">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
