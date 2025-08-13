import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResourcePage({ isArchived }) {
  const { state } = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [alert, setAlert] = useState(state?.message);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    fetch(isArchived ? "resource?isArchived=true" : "resource")
      .then((response) => {
        response.json().then((resources) => {
          setResources(resources);
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isArchived]);

  const handleDelete = async (e, resource) => {
    e.preventDefault();

    if (
      !window.confirm(
        `Вы уверены, что хотите ${isArchived ? "разархивировать" : "удалить"} ${
          resource.name
        }?`
      )
    ) {
      return;
    }
    let response;

    if (isArchived) {
      resource.isArchived = !resource.isArchived;

      response = await fetch("/resource", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resource),
      });
    } else {
      response = await fetch(`/resource?id=${resource.id}`, {
        method: "DELETE",
      });
    }

    if (!response.ok) {
      setAlert({
        message: isArchived
          ? "Не удалось получить из архива"
          : "Не удалось удалить или заархивировать ресурса",
        isError: true,
      });

      return;
    }

    setResources((prev) => prev.filter((r) => r.id !== resource.id));

    setAlert({
      message: isArchived
        ? "Успешно извлечено из архива"
        : "Ресурс удален успешно",
      isError: false,
    });
  };

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h1>Ресурсы</h1>
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
          navigate(
            isArchived ? "/dashboard/resource" : "/dashboard/resource/archived"
          );
        }}
      >
        {isArchived ? "Просмотр активных" : "Просмотреть архив"}
      </button>
      {!resources || resources.length <= 0 ? (
        <p>Нет ресурсов...</p>
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
            {resources.map((resource) => {
              return (
                <tr key={resource.id}>
                  <td
                    className={
                      isArchived
                        ? "text-muted text-decoration-line-through"
                        : ""
                    }
                  >
                    {resource.name}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link"
                      disabled={isArchived ? "disabled" : null}
                      onClick={() => {
                        navigate(`/dashboard/resource/update`, {
                          state: { resource },
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
                      onClick={(e) => handleDelete(e, resource)}
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
          navigate(`/dashboard/resource/add`);
        }}
      >
        Добавить новый ресурс
      </button>
    </div>
  );
}
