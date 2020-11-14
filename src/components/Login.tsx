import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Modal from "./Modal";
import PhoneForm from "./PhoneForm";
import ConfirmPhoneForm from "./ConfirmPhoneForm";
import { getResource } from "../utils/fetchUtils";

const LoginButton = () => {
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const authContext = useAuthContext();
  const { authState, setAuthInfo } = authContext;

  async function requestCode(phone: string) {
    const request = await getResource(
      `/auth/requestCode?phone=${encodeURIComponent(phone)}`,
      "POST"
    );
    if (request.result === "Ok") {
      const {nextSendAfterSec} = request.smsSessionParameters
      setAuthInfo({authenticated: false, confirmingPhone: true, nextSendAfterSec, phone});
    }
  }

  return (
    <>
      {loginModalOpened && (
        <Modal
          title={
            !authState.confirmingPhone
              ? "Войдите или зарегистрируйтесь, чтобы продолжить"
              : "Введите код"
          }
          content={
            !authState.confirmingPhone ? <PhoneForm requestCode={requestCode}/> : <ConfirmPhoneForm requestCode={requestCode} />
          }
          onClose={() => setLoginModalOpened(false)}
        />
      )}

      <button onClick={() => setLoginModalOpened(true)}>Войти</button>
    </>
  );
};

export default LoginButton;
