import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainLayout: FC = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ToastContainer className="toast-container" />
    </>
  );
};

export default MainLayout;
