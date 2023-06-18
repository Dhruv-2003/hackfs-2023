import "../styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Link from "next/link";

export default function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId="">
      <>
        <nav className=" flex justify-between items-center py-2 px-5 w-full border-b border-gray-600 fixed z-50 bg-black bg-opacity-40 backdrop-blur-sm ">
          <h1>Ark</h1>
          <Link
            href=""
            class="relative inline-block text-base group transition-all ease-in-out active:scale-95"
          >
            <span class="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
              <span class="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
              <span class="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
              <span class="relative">Create Account</span>
            </span>
            <span
              class="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
              data-rounded="rounded-lg"
            ></span>
          </Link>
        </nav>
        <div className=" py-20">
          <Component {...pageProps} />
        </div>
      </>
    </GoogleOAuthProvider>
  );
}
