import type { AppProps } from 'next/app';
import '@styles/global.scss';

const App = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

export default App;
