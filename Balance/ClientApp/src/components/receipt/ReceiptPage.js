import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogisticFilter from "../LogisticFilter";

export default function ReceiptPage() {
  const { state } = useLocation();

  const [receipts, setreceipts] = useState([]);
  const [alert, setAlert] = useState(state?.message);
  const [resourceFilters, setResourceFilters] = useState([]);
  const [unitFilters, setUnitFilters] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      `receipt?${resourceFilters
        .map((r) => `resourceFilters=${r}`)
        .join("&")}&${unitFilters.map((u) => `unitFilters=${u}`).join("&")}`
    ).then((response) => {
      response.json().then((receipts) => {
        setreceipts(receipts);
      });
    });
  }, [resourceFilters, unitFilters]);

  const handleDelete = async (e, receipt) => {
    e.preventDefault();

    if (
      !window.confirm(
        `Вы уверены, что хотите удалить ${receipt.purchaseOrder}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/receipt?id=${receipt.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setAlert({
          message: "Не удалось удалить поступление, проверить баланс!",
          isError: true,
        });

        return;
      }

      setreceipts((prev) => prev.filter((r) => r.id !== receipt.id));

      setAlert({
        message: "Поступление успешно удалено",
        isError: false,
      });
    } catch (error) {
      console.error("Ошибка при удалении поступления:", error);
    }
  };

  return (
    <div>
      <h1>Поступления</h1>
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
      {!receipts || receipts.errors || receipts.length <= 0 ? (
        <p>Нет отгрузка...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Номер заказа</th>
              <th>Дата</th>
              <th>Ресурсы</th>
              <th>Обновление</th>
              <th>Удаление</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => {
              return (
                <tr key={receipt.id}>
                  <td>{receipt.purchaseOrder}</td>
                  <td>{receipt?.date?.split("T")?.[0]}</td>
                  <td>
                    <ul>
                      {(receipt?.receiptResources ?? []).map((sr) => {
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
                        navigate(`/dashboard/receipt/update`, {
                          state: { receipt },
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
                      onClick={(e) => handleDelete(e, receipt)}
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
          navigate(`/dashboard/receipt/add`);
        }}
      >
        Добавить новое поступление
      </button>
    </div>
  );
}
