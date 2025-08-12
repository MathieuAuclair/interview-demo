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
        console.log("OK");
        navigate(`/dashboard/unit`, {
          state: {
            message: {
              message: "Единица успешно обновлен!",
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
    <div>
      <h1>Обновление единиц</h1>
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
      <div className="d-flex gap-2">
        <button
          onClick={() => handleSubmit(unit.isArchived)}
          class="btn btn-primary"
          type="submit"
        >
          Сохранить
        </button>
        <button
          onClick={() => handleSubmit(!unit.isArchived)}
          class="btn btn-warning"
          type="submit"
        >
          {unit.isArchived ? "Разархивировать" : "В архив"}
        </button>
      </div>
    </div>
  );
}
