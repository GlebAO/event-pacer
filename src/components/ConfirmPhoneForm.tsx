import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { getResource } from "../utils/fetchUtils";
import { useFormFields } from "../utils/hookUtils";

import "./ConfirmPhoneForm.css";

interface ConfirmPhoneFromInterface {
  requestCode: (phone: string) => void;
}

const ConfirmPhoneFrom: React.FC<ConfirmPhoneFromInterface> = ({
  requestCode,
}) => {
  const authContext = useAuthContext();
  const {
    authState: { phone, nextSendAfterSec },
    setNextSend,
    onLoginSuccess,
    onLoginFail,
  } = authContext;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const initialFormState = {
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
  }

  const [fields, handleFieldChange, setFormValues ] = useFormFields(initialFormState);

  useEffect(() => {
    let timerId = setTimeout(function tick() {
      if (nextSendAfterSec) {
        setNextSend(nextSendAfterSec - 1);
      }
      timerId = setTimeout(tick, 1000);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [nextSendAfterSec, setNextSend]);

  useEffect(() => {
    const code = Object.values(fields).join("");
    if (code.length === 4 && error.length === 0) {
      setIsLoading(true);

      getResource(
        `/auth/login?phone=${encodeURIComponent(phone!)}&code=${code}`,
        "POST"
      )
        .then((data) => {
          if (data.tokens) {
            const { accessToken, refreshToken } = data.tokens;
            onLoginSuccess(accessToken, refreshToken);
          }
        })
        .catch((err) => {
          if (err.result === "InvalidCode") {
            const { remainCheckCount } = err.smsSessionParameters;
            if (+remainCheckCount === 0) {
              onLoginFail();
            }
            setError(`Неверный код. Попробуйте ещё раз`);
          }
          if (err.result === "NewCodeRequired") {
            onLoginFail();
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [fields, phone, error, onLoginSuccess, onLoginFail]);

  function handlePhoneChange() {
    onLoginFail();
  }

  function handleDigitChange(event: { target: HTMLInputElement }) {
    const value = event.target.value;
    if (value.length > 1) {
      return;
    }
    if (!isNaN(Number(value))) {
      handleFieldChange(event);
    }
  }

  function clearForm() {
    if (error.length > 0) {
      setError("");
      setFormValues(initialFormState);
    }
  }

  function renderInputs() {
    let inputs = [];
    for (let i = 1; i <= 4; i++) {
      inputs.push(
        <input
          key={i}
          id={`digit${i}`}
          value={fields[`digit${i}`]}
          onChange={(e) => handleDigitChange(e)}
          onFocus={() => clearForm()}
          disabled={isLoading}
          className="form-control"
        />
      );
    }
    return inputs;
  }

  function renderNextSend() {
    return nextSendAfterSec === 0 && phone ? (
      <button onClick={() => requestCode(phone)}>Получить код</button>
    ) : (
      <p>Получить новый код можно через {nextSendAfterSec}</p>
    );
  }

  return (
    <div>
      <p>
        Мы отправили код подтверждения на номер {phone}
        <button onClick={handlePhoneChange}>Изменить</button>
      </p>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="digit-inputs__holder">{renderInputs()}</div>
        <div>{error}</div>
        <div>{renderNextSend()}</div>
      </form>
    </div>
  );
};

export default ConfirmPhoneFrom;
