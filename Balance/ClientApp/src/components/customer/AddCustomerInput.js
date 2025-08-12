import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddCustomerInput() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleFailureNavigation = (trace) => {
    navigate(`/dashboard/customer`, {
      state: {
        message: {
          message: "Не удалось добавить клиент",
          isError: true,
        },
      },
    });

    console.log(trace);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const customer = { name, address, isArchived: false };

    try {
      const response = await fetch("/customer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });

      if (response.ok) {
        navigate(`/dashboard/customer`, {
          state: {
            message: {
              message: "Новый клиент успешно добавлен",
              isError: false,
            },
          },
        });
      } else {
        handleFailureNavigation(response);
      }
    } catch (error) {
      handleFailureNavigation(error);
    }
  };

  return (
    <div>
      <h1>Добавить единиц</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            value={name}
            minLength={6}
            maxLength={50}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
            id="floatingInput"
          />
          <label htmlFor="floatingInput">имя</label>
        </div>
        <div className="form-floating mb-3">
          <input
            value={address}
            minLength={6}
            maxLength={150}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="form-control"
            id="floatingInput"
          />
          <label htmlFor="floatingInput">адрес</label>
        </div>
        <button className="btn btn-primary" type="submit">
          Сохранить
        </button>
      </form>
    </div>
  );
}
