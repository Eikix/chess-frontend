import '../styles/global.css';
import {SocketContextWrapper} from "../components/chess/SocketContext";

function MyApp({ Component, pageProps }) {
  return (
    <SocketContextWrapper>
      <Component {...pageProps} />
    </SocketContextWrapper>
  )
}

export default MyApp
