import React, { useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import useBasket from "./hooks/useBasket";
import { useGlobals } from "./hooks/useGlobals";
import MemberService from "./services/MemberService";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../lib/sweetAlert";
import { Messages } from "../lib/config";
import HomePage from "./screens/homePage";
import ProductsPage from "./screens/productsPage";
import OrdersPage from "./screens/ordersPage";
import UserPage from "./screens/userPage";
import HelpPage from "./screens/helpPage";
import HomeNavbar from "./components/headers/HomeNavbar";
import OtherNavber from "./components/headers/OtherNavbar";
import Footer from "./components/footer";
import AuthenticationModal from "./components/auth";
import HandCursor from "./HandCursor";
import FaceControlGate from "./FaceControlGate";

import "../css/app.css";
import "../css/navbar.css";
import "../css/footer.css";

function App() {
  const location = useLocation();
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
  const { setAuthMember } = useGlobals();

  // FACE ID HOLATLARI
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [faceIdBypassed, setFaceIdBypassed] = useState(false);

  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleLoginRequest = async () => {
    try {
      const member = new MemberService();
      await member.logout();
      await sweetTopSuccessAlert("success", 700);
      setAuthMember(null);
    } catch (err) {
      sweetErrorHandling(Messages.error1);
    }
  };

  /** 1. FACE ID SCANNER EKRANI **/
  // Agar hali ruxsat berilmagan bo'lsa VA o'chirib qo'yilmagan bo'lsa
  if (!isAuthorized && !faceIdBypassed) {
    return (
      <>
        {/* <FaceControlGate onAccessGranted={() => setIsAuthorized(true)} /> */}
        <button
          onClick={() => {
            setFaceIdBypassed(true);
            setIsAuthorized(true);
          }}
          style={{
            position: "fixed", bottom: "30px", right: "30px", zIndex: 10000000,
            padding: "12px 20px", borderRadius: "8px", border: "1px solid #ff0000",
            background: "rgba(0,0,0,0.8)", color: "#ff0000", fontWeight: "bold", cursor: "pointer",
            boxShadow: "0 0 15px rgba(255,0,0,0.3)"
          }}
        >
          Skanerni o'chirish (Bypass)
        </button>
      </>
    );
  }

  /** 2. ASOSIY SAYT INTERFEYSI **/
  return (
    <>
      {/* HandCursor'ga bypass holatini yuboramiz */}
      <HandCursor isBypassed={faceIdBypassed} />

      {location.pathname === "/" ? (
        <HomeNavbar
          cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} onDelete={onDelete}
          onDeleteAll={onDeleteAll} setSignupOpen={setSignupOpen} setLoginOpen={setLoginOpen}
          anchorEl={anchorEl} handleLogoutClick={(e) => setAnchorEl(e.currentTarget)}
          handleCloseLogout={() => setAnchorEl(null)} handleLoginRequest={handleLoginRequest}
        />
      ) : (
        <OtherNavber
          cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} onDelete={onDelete}
          onDeleteAll={onDeleteAll} setSignupOpen={setSignupOpen} setLoginOpen={setLoginOpen}
          anchorEl={anchorEl} handleLogoutClick={(e) => setAnchorEl(e.currentTarget)}
          handleCloseLogout={() => setAnchorEl(null)} handleLoginRequest={handleLoginRequest}
        />
      )}

      <div className="app-main-content">
        <Switch>
          <Route path="/products"><ProductsPage onAdd={onAdd} /></Route>
          <Route path="/orders"><OrdersPage /></Route>
          <Route path="/member-page"><UserPage /></Route>
          <Route path="/help"><HelpPage /></Route>
          <Route path="/"><HomePage /></Route>
        </Switch>
      </div>

      <Footer />

      <AuthenticationModal
        signupOpen={signupOpen} loginOpen={loginOpen}
        handleLoginClose={() => setLoginOpen(false)} handleSignupClose={() => setSignupOpen(false)}
      />
    </>
  );
}

export default App;