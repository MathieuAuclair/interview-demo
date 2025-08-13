import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddResourceInput() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const handleFailureNavigation = (trace) => {
    navigate(`/dashboard/resource`, {
      state: {
        message: {
          message: "Не удалось добавить ресурс",
          isError: true,
        },
      },
    });

    console.log(trace);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resource = { name, isArchived: false };

    try {
      const response = await fetch("/resource", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resource),
      });

      if (response.ok) {
        navigate(`/dashboard/resource`, {
          state: {
            message: {
              message: "Новый ресурс успешно добавлен",
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
      <h1>Добавить ресурс</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            value={name}
            minLength={3}
            maxLength={50}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
            id="floatingInput"
          />
          <label htmlFor="floatingInput">название</label>
        </div>
        <button className="btn btn-primary" type="submit">
          Сохранить
        </button>
      </form>
    </div>
  );
}
