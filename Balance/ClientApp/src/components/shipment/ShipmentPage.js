import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogisticFilter from "../LogisticFilter";

export default function ShipmentPage() {
  const { state } = useLocation();

  const [shipments, setshipments] = useState([]);
  const [alert, setAlert] = useState(state?.message);
  const [resourceFilters, setResourceFilters] = useState([]);
  const [unitFilters, setUnitFilters] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      `shipment?${resourceFilters
        .map((r) => `resourceFilters=${r}`)
        .join("&")}&${unitFilters.map((u) => `unitFilters=${u}`).join("&")}`
    ).then((response) => {
      response.json().then((shipments) => {
        setshipments(shipments);
      });
    });
  }, [resourceFilters, unitFilters]);

  const handleDelete = async (e, shipment) => {
    e.preventDefault();

    if (
      !window.confirm(
        `Вы уверены, что хотите "удалить ${shipment.purchaseOrder}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/shipment?id=${shipment.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setAlert({
          message: "Не удалось удалить отгрузка, проверить баланс!",
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
      <LogisticFilter
        resourceFilters={resourceFilters}
        setResourceFilters={setResourceFilters}
        unitFilters={unitFilters}
        setUnitFilters={setUnitFilters}
      />
      {!shipments || shipments.errors || shipments.length <= 0 ? (
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
                  <td>{shipment.purchaseOrder}</td>
                  <td>{shipment?.date?.split("T")?.[0]}</td>
                  <td>{shipment?.customer?.name}</td>
                  <td>
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
