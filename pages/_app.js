/* eslint-disable react/jsx-props-no-spreading */

import App from 'next/app';
import AuthProvider from '../components/AuthProvider';
import GlitterProvider from '../components/glitter/GlitterProvider';
import NotificationsProvider from '../components/NotificationsProvider';
import '../styles/index.css';

const Amplify =
  typeof window !== 'undefined' ? require('aws-amplify').default : {};

class MyApp extends App {
  componentDidMount() {
    if (typeof window !== 'undefined') {
      Amplify.configure({
        Auth: {
          region: process.env.COGNITO_REGION,
          userPoolId: process.env.COGNITO_USER_POOL_ID,
          userPoolWebClientId: process.env.COGNITO_CLIENT_ID,
        },
      });
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <AuthProvider>
        <NotificationsProvider>
          <GlitterProvider>
            <Component {...pageProps} />
          </GlitterProvider>
        </NotificationsProvider>
      </AuthProvider>
    );
  }
}

export default MyApp;
