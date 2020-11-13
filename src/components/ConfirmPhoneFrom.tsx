import React, { FormEvent, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { getResource } from "../utils/fetchUtils";
import { useFormFields } from "../utils/hookUtils";

const ConfirmPhoneFrom = () => {
  const authContext = useAuthContext();
  const {
    authState: { phone },
    setAuthInfo,
  } = authContext;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [fields, handleFieldChange] = useFormFields({
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
  });

  function handlePhoneChange() {
    setAuthInfo({ authenticated: false, confirmingPhone: false, phone: null });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const code = Object.values(fields).join("");
    if(code.length === 4 ){
        setIsLoading(true);
        try {
            const request = await getResource(
              `/auth/login?phone=${encodeURIComponent(phone!)}&code=${code}`,
              "POST"
            );
            if(request.result === "WaitBeforeSend") {
                const {nextSendAfterSec, remainCheckCount} = request.smsSessionParameters

                if(remainCheckCount === 0){
                    setAuthInfo({ authenticated: false, confirmingPhone: false, phone: null });
                }

                setError(`Подождите ${nextSendAfterSec}`)
            }
            if (request.tokens) {
                const {accessToken, refreshToken} = request.tokens;

                setAuthInfo({ authenticated: true, confirmingPhone: false, phone: phone, accessToken, refreshToken});
            }
            setIsLoading(false);
          } catch (e) {
            setIsLoading(false);
            setAuthInfo({ authenticated: false, confirmingPhone: false, phone: null });
          }
    }
  }

  function handleDigitChange(e: { target: HTMLInputElement }) {
    const value = e.target.value;
    if (!isNaN(Number(value)) && value.length === 1) {
      handleFieldChange(e);
    }
  }

  function renderInputs(amount: number) {
    let inputs = [];
    for (let i = 1; i <= amount; i++) {
      inputs.push(
        <input
          key={i}
          id={`digit${i}`}
          value={fields[`digit${i}`]}
          onChange={(e) => handleDigitChange(e)}
        />
      );
    }
    return inputs;
  }

  return (
    <div>
      <p>Мы отправили код подтверждения на номер {phone}</p>
      <button onClick={handlePhoneChange}>Изменить</button>
      <form onSubmit={handleSubmit}>
          <div>
            {renderInputs(4)}
          </div>  
          <div>
              {error}
          </div>
        <button type="submit" disabled={isLoading}>
          Отправить
        </button>
      </form>
    </div>
  );
};

export default ConfirmPhoneFrom;
