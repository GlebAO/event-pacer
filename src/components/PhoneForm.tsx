import React, { FormEvent, useState } from "react";
import { phoneIsValid } from "../utils/validateUtils";

interface PhoneFormInterface {
  requestCode: (phone: string) => void
}

const PhoneForm:React.FC<PhoneFormInterface> = ({requestCode}) => {

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
      requestCode(phone);
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
          <label htmlFor="phone" className="form-label">Телефон</label>
          <input
            autoFocus
            name="phone"
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e)}
            className="form-control"
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
