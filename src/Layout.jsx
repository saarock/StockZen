import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import {useSaarockToast} from "./hooks";


const Layout = () => {

  const {saarockToast} = useSaarockToast();


  useEffect(() => {
    (async () => {
      const { saarock } = await import("https://cdn.jsdelivr.net/gh/saarock/saarock.js@main/dist/index.js");
      
      saarockToast.backToTop({
        backColor: "blue",
      });
    })();
  }, []);


  return (
    <>
      {/* <Header /> */}
      <ToastContainer />
      <main style={{position: "relative"}}>
        <Outlet />
      </main>
      {/* <Footer /> */}

    </>
  )
}

export default Layout