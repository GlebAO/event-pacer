import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Modal from "./Modal";
import PhoneForm from "./PhoneForm";
import ConfirmPhoneForm from "./ConfirmPhoneFrom";

const LoginButton = () => {
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const authContext = useAuthContext();
  const { authState } = authContext;

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
            !authState.confirmingPhone ? <PhoneForm /> : <ConfirmPhoneForm />
          }
          onClose={() => setLoginModalOpened(false)}
        />
      )}

      <button onClick={() => setLoginModalOpened(true)}>Войти</button>
    </>
  );
};

export default LoginButton;
