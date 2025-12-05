import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import {useSaarockToast} from "./hooks";
import Header from './components/header/header';
import Footer from './components/footer/footer';


const Layout = () => {

  const {saarockToast} = useSaarockToast();


  // useEffect(() => {
  //   (async () => {
  //     const { saarock } = await import("https://cdn.jsdelivr.net/gh/saarock/saarock.js@main/dist/index.js");
      
  //     saarockToast.backToTop({
  //       backColor: "#1a1f5a",
  //     });
  //   })();
  // }, []);


  return (
    <>
      <Header />
      <ToastContainer />
      <main style={{position: "relative"}}>
        <Outlet />
      </main>
      <Footer />

    </>
  )
}

export default Layout