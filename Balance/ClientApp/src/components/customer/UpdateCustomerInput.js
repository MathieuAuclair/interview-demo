import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function UpdateCustomerInput() {
  const navigate = useNavigate();

  const { state } = useLocation();
  const { customer } = state;

  const [name, setName] = useState(customer.name);
  const [address, setAddress] = useState(customer.address);

  const handleFailureNavigation = () => {
    navigate(`/dashboard/customer`, {
      state: {
        message: {
          message: "Не удалось обновить клиент.",
          isError: true,
        },
      },
    });
  };

  const handleSubmit = async (isArchived) => {
    const data =
      isArchived === customer.isArchived
        ? { id: customer.id, name, address, isArchived }
        : { ...customer, isArchived };

    try {
      const response = await fetch("/customer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate(`/dashboard/customer`, {
          state: {
            message: {
              message: "Клиент успешно обновлен!",
              isError: false,
            },
          },
        });
      } else {
        handleFailureNavigation();
      }
    } catch (error) {
      console.error(error);
      handleFailureNavigation();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(customer.isArchived);
      }}
    >
      <h1>Обновление клиент</h1>
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
        <label htmlFor="floatingInput">название</label>
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
      <div className="d-flex gap-2">
        <button className="btn btn-primary" type="submit">
          Сохранить
        </button>
        <button
          onClick={() => handleSubmit(!customer.isArchived)}
          className="btn btn-warning"
          type="button"
        >
          {customer.isArchived ? "Разархивировать" : "В архив"}
        </button>
      </div>
    </form>
  );
}
