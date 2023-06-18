import "../styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PolybaseProvider } from "@polybase/react";
import { Polybase } from "@polybase/client";

export default function App({ Component, pageProps }) {
  return (
    <PolybaseProvider polybase={Polybase}>
      <GoogleOAuthProvider clientId="">
        <Component {...pageProps} />
      </GoogleOAuthProvider>
    </PolybaseProvider>
  );
}
