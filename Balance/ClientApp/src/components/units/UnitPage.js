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

    if (!window.confirm(`Вы уверены, что хотите удалить ${unit.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/unit?id=${unit.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setAlert({
          message: "Не удалось удалить или заархивировать единица",
          isError: true,
        });

        return;
      }

      setUnits((prev) => prev.filter((r) => r.id !== unit.id));

      setAlert({
        message: "единица удален успешно",
        isError: false,
      });
    } catch (error) {
      console.error("Ошибка при удалении единица:", error);
    }
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
        {isArchived ? "просмотр активных" : "просмотреть архив"}
      </button>
      {!units || units.length <= 0 ? (
        <p>Нет единица...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Обновление</th>
              <th>Удаление</th>
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
                      onClick={() => {
                        navigate(`/dashboard/unit/update`, {
                          state: { unit },
                        });
                      }}
                    >
                      Обновление
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link link-danger"
                      onClick={(e) => handleDelete(e, unit)}
                    >
                      Удаление
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
        Добавить новый единица
      </button>
    </div>
  );
}
