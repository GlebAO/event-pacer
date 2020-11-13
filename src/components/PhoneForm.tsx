import React, { FormEvent, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { getResource } from "../utils/fetchUtils";
import { phoneIsValid } from "../utils/validateUtils";

const PhoneForm = () => {
  const authContext = useAuthContext();
  const { setAuthInfo} = authContext;

  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [phone, setPhone] = useState("+7");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!phoneIsValid(phone)) {
      return setPhoneError("Некорректный формат телефона");
    }
    setIsLoading(true);
    try {
      const request = await getResource(
        `/auth/requestCode?phone=${encodeURIComponent(phone)}`,
        "POST"
      );
      if (request.result === "Ok") {
        setAuthInfo({authenticated: false, confirmingPhone: true, phone});
      }
      if(request.result === "WaitBeforeSend") {
        setPhoneError(`Подождите ${request?.smsSessionParameters?.nextSendAfterSec} секунд`);
      }
    } catch (e) {
      setIsLoading(false);
    }
  }

  function handlePhoneChange(e: { target: HTMLInputElement }) {
    setPhoneError("");
    setPhone(e.target.value);
  }

  return (
    <div className="phone-form">
       <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phone">Телефон</label>
          <input
            autoFocus
            name="phone"
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e)}
          />
          {phoneError && <p>{phoneError}</p>}
        </div>

        <button type="submit" disabled={isLoading}>
          Получить код
        </button>
      </form>
    </div>
  );
};

export default PhoneForm;
