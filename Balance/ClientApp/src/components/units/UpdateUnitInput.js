import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function UpdateUnitInput() {
  const navigate = useNavigate();

  const { state } = useLocation();
  const { unit } = state;

  const [name, setName] = useState(unit.name);

  const handleFailureNavigation = () => {
    navigate(`/dashboard/unit`, {
      state: {
        message: {
          message: "Не удалось обновить единица.",
          isError: true,
        },
      },
    });
  };

  const handleSubmit = async (isArchived) => {
    const data = { id: unit.id, name, isArchived };

    try {
      const response = await fetch("/unit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate(`/dashboard/unit`, {
          state: {
            message: {
              message: "Единица успешно обновлена!",
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
        handleSubmit(unit.isArchived);
      }}
    >
      <h1>Обновление единицы измерения</h1>
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
      <div className="d-flex gap-2">
        <button className="btn btn-primary" type="submit">
          Сохранить
        </button>
        <button
          onClick={() => handleSubmit(!unit.isArchived)}
          className="btn btn-warning"
          type="button"
        >
          {unit.isArchived ? "Разархивировать" : "В архив"}
        </button>
      </div>
    </form>
  );
}
