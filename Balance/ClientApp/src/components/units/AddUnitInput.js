import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddUnitInput() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const handleFailureNavigation = (trace) => {
    navigate(`/dashboard/unit`, {
      state: {
        message: {
          message: "Не удалось добавить единица",
          isError: true,
        },
      },
    });

    console.log(trace);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const unit = { name, isArchived: false };

    try {
      const response = await fetch("/unit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unit),
      });

      if (response.ok) {
        navigate(`/dashboard/unit`, {
          state: {
            message: {
              message: "Новый единица успешно добавлен",
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
        <div class="form-floating mb-3">
          <input
            value={name}
            minLength={3}
            maxLength={50}
            onChange={(e) => setName(e.target.value)}
            required
            class="form-control"
            id="floatingInput"
          />
          <label for="floatingInput">название</label>
        </div>
        <button class="btn btn-primary" type="submit">
          Сохранить
        </button>
      </form>
    </div>
  );
}
