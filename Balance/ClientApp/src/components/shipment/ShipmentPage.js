import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ShipmentPage({ isArchived }) {
  const { state } = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [shipments, setshipments] = useState([]);
  const [alert, setAlert] = useState(state?.message);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    fetch(isArchived ? "shipment?isArchived=true" : "shipment")
      .then((response) => {
        response.json().then((shipments) => {
          setshipments(shipments);
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isArchived]);

  const isArchivedStyling = useMemo(() => {
    return isArchived ? "text-muted text-decoration-line-through" : "";
  }, [isArchived]);

  const handleDelete = async (e, shipment) => {
    e.preventDefault();

    if (!window.confirm(`Вы уверены, что хотите удалить ${shipment.purchaseOrder}?`)) {
      return;
    }

    try {
      const response = await fetch(`/shipment?id=${shipment.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setAlert({
          message: "Не удалось удалить или заархивировать отгрузка",
          isError: true,
        });

        return;
      }

      setshipments((prev) => prev.filter((r) => r.id !== shipment.id));

      setAlert({
        message: "Отгрузка успешно удалена!",
        isError: false,
      });
    } catch (error) {
      console.error("Ошибка при удалении отгрузка:", error);
    }
  };

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h1>Отгрузки</h1>
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
            isArchived ? "/dashboard/shipment" : "/dashboard/shipment/archived"
          );
        }}
      >
        {isArchived ? "Просмотр активных" : "Просмотреть архив"}
      </button>
      {!shipments || shipments.length <= 0 ? (
        <p>Нет отгрузка...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Номер заказа</th>
              <th>Дата</th>
              <th>Клиент</th>
              <th>Статус</th>
              <th>Ресурсы</th>
              <th>Обновление</th>
              <th>Удаление</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => {
              return (
                <tr key={shipment.id}>
                  <td className={isArchivedStyling}>
                    {shipment.purchaseOrder}
                  </td>
                  <td className={isArchivedStyling}>
                    {shipment?.date?.split("T")?.[0]}
                  </td>
                  <td className={isArchivedStyling}>
                    {shipment?.customer?.name}
                  </td>
                  <td className={isArchivedStyling}>
                    <div
                      className={`badge rounded-pill text-bg-${
                        shipment.isSigned ? "success" : "secondary"
                      }`}
                    >
                      {shipment?.isSigned ? "Подписан" : "Не подписан"}
                    </div>
                  </td>
                  <td>
                    <ul>
                      {(shipment?.shipmentResources ?? []).map((sr) => {
                        return (
                          <li key={sr.id}>
                            {sr?.quantity} {sr?.unit?.name} -{" "}
                            <b>{sr?.resource?.name}</b>
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => {
                        navigate(`/dashboard/shipment/update`, {
                          state: { shipment },
                        });
                      }}
                    >
                      Обновить
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link link-danger"
                      onClick={(e) => handleDelete(e, shipment)}
                    >
                      Удалить
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
          navigate(`/dashboard/shipment/add`);
        }}
      >
        Добавить новую отгрузку
      </button>
    </div>
  );
}
