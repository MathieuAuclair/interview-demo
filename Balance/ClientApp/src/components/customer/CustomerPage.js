import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CustomerPage({ isArchived }) {
  const { state } = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [customers, setcustomers] = useState([]);
  const [alert, setAlert] = useState(state?.message);

  const navigate = useNavigate();

  useEffect(() => {
    // Извлекать обновленные данные только после отправки клиент
    setIsLoading(true);

    fetch(isArchived ? "customer?isArchived=true" : "customer")
      .then((response) => {
        response.json().then((customers) => {
          setcustomers(customers);
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isArchived]);

  const isArchivedStyling = useMemo(() => {
    return isArchived ? "text-muted text-decoration-line-through" : "";
  }, [isArchived]);

  const handleDelete = async (e, customer) => {
    e.preventDefault();

    if (!window.confirm(`Вы уверены, что хотите удалить ${customer.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/customer?id=${customer.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setAlert({
          message: "Не удалось удалить или заархивировать клиент",
          isError: true,
        });

        return;
      }

      setcustomers((prev) => prev.filter((r) => r.id !== customer.id));

      setAlert({
        message: "клиент удален успешно",
        isError: false,
      });
    } catch (error) {
      console.error("Ошибка при удалении клиент:", error);
    }
  };

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h1>Клиенты</h1>
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
            isArchived ? "/dashboard/customer" : "/dashboard/customer/archived"
          );
        }}
      >
        {isArchived ? "просмотр активных" : "просмотреть архив"}
      </button>
      {!customers || customers.length <= 0 ? (
        <p>Нет клиент...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Адрес</th>
              <th>Обновление</th>
              <th>Удаление</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              return (
                <tr key={customer.id}>
                  <td className={isArchivedStyling}>{customer.name}</td>
                  <td className={isArchivedStyling}>{customer.address}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => {
                        navigate(`/dashboard/customer/update`, {
                          state: { customer },
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
                      onClick={(e) => handleDelete(e, customer)}
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
          navigate(`/dashboard/customer/add`);
        }}
      >
        Добавить новый клиент
      </button>
    </div>
  );
}
