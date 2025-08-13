import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function UnitPage({ isArchived }) {
  const { state } = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [units, setUnits] = useState([]);
  const [alert, setAlert] = useState(state?.message);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    fetch(isArchived ? "unit?isArchived=true" : "unit")
      .then((response) => {
        response.json().then((units) => {
          setUnits(units);
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isArchived]);

  const handleDelete = async (e, unit) => {
    e.preventDefault();

    if (
      !window.confirm(
        `Вы уверены, что хотите ${isArchived ? "разархивировать" : "удалить"} ${
          unit.name
        }?`
      )
    ) {
      return;
    }

    let response;

    if (isArchived) {
      unit.isArchived = !unit.isArchived;

      response = await fetch("/unit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unit),
      });
    } else {
      response = await fetch(`/unit?id=${unit.id}`, {
        method: "DELETE",
      });
    }

    if (!response.ok) {
      setAlert({
        message: isArchived
          ? "Не удалось получить из архива"
          : "Не удалось удалить или заархивировать единицаю",
        isError: true,
      });

      return;
    }

    setUnits((prev) => prev.filter((r) => r.id !== unit.id));

    setAlert({
      message: isArchived
        ? "Успешно извлечено из архива"
        : "Единица измерения успешно удалена!",
      isError: false,
    });
  };

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h1>Единицы измерения</h1>
      {alert && (
        <div
          className={`alert alert-${alert.isError ? "danger" : "info"}`}
          role="alert"
        >
          {alert.message}
        </div>
      )}
      <button
        className="btn btn-secondary my-2"
        onClick={() => {
          navigate(isArchived ? "/dashboard/unit" : "/dashboard/unit/archived");
        }}
      >
        {isArchived ? "Просмотр активных" : "Просмотреть архив"}
      </button>
      {!units || units.length <= 0 ? (
        <p>Нет единица...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Обновление</th>
              <th>{isArchived ? "Разархивирование" : "Удаление"}</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => {
              return (
                <tr key={unit.id}>
                  <td
                    className={
                      isArchived
                        ? "text-muted text-decoration-line-through"
                        : ""
                    }
                  >
                    {unit.name}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link"
                      disabled={isArchived ? "disabled" : null}
                      onClick={() => {
                        navigate(`/dashboard/unit/update`, {
                          state: { unit },
                        });
                      }}
                    >
                      Обновить
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-link ${
                        isArchived ? "link-warning" : "link-danger"
                      }`}
                      onClick={(e) => handleDelete(e, unit)}
                    >
                      {isArchived ? "Разархивировать" : "Удалить"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <button
        className="btn btn-outline-primary"
        onClick={() => {
          navigate(`/dashboard/unit/add`);
        }}
      >
        Добавить новую единицу
      </button>
    </div>
  );
}
