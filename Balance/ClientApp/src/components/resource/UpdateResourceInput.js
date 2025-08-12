import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function UpdateResourceInput() {
  const navigate = useNavigate();

  const { state } = useLocation();
  const { resource } = state;

  const [name, setName] = useState(resource.name);

  const handleFailureNavigation = () => {
    navigate(`/dashboard/resource`, {
      state: {
        message: {
          message: "Не удалось обновить ресурс.",
          isError: true,
        },
      },
    });
  };

  const handleSubmit = async (isArchived) => {
    const data =
      isArchived === resource.isArchived
        ? { id: resource.id, name, isArchived }
        : { ...resource, isArchived };

    try {
      const response = await fetch("/resource", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate(`/dashboard/resource`, {
          state: {
            message: {
              message: "Ресурс успешно обновлен!",
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
        handleSubmit(resource.isArchived);
      }}
    >
      <h1>Обновление ресурсы</h1>
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
          onClick={() => handleSubmit(!resource.isArchived)}
          className="btn btn-warning"
          type="button"
        >
          {resource.isArchived ? "Разархивировать" : "В архив"}
        </button>
      </div>
    </form>
  );
}
