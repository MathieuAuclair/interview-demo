import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CustomerPage({ isArchived }) {
  const { state } = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [alert, setAlert] = useState(state?.message);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    fetch(isArchived ? "customer?isArchived=true" : "customer")
      .then((response) => {
        response.json().then((customers) => {
          setCustomers(customers);
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

    if (
      !window.confirm(
        `Вы уверены, что хотите ${isArchived ? "разархивировать" : "удалить"} ${
          customer.name
        }?`
      )
    ) {
      return;
    }

    let response;
    if (isArchived) {
      customer.isArchived = !customer.isArchived;

      response = await fetch("/customer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });
    } else {
      response = await fetch(`/customer?id=${customer.id}`, {
        method: "DELETE",
      });
    }

    if (!response.ok) {
      setAlert({
        message: isArchived
          ? "Не удалось получить из архива"
          : "Не удалось удалить или заархивировать клиент",
        isError: true,
      });

      return;
    }

    setCustomers((prev) => prev.filter((r) => r.id !== customer.id));

    setAlert({
      message: isArchived
        ? "Успешно извлечено из архива"
        : "Клиент удален успешно",
      isError: false,
    });
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
        {isArchived ? "Просмотр активных" : "Просмотреть архив"}
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
              <th>{isArchived ? "Разархивирование" : "Удаление"}</th>
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
                      disabled={isArchived ? "disabled" : null}
                      onClick={() => {
                        navigate(`/dashboard/customer/update`, {
                          state: { customer },
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
                      onClick={(e) => handleDelete(e, customer)}
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
          navigate(`/dashboard/customer/add`);
        }}
      >
        Добавить новый клиент
      </button>
    </div>
  );
}
