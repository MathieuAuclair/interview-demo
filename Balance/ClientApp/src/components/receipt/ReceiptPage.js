import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ReceiptPage({ isArchived }) {
  const { state } = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [receipts, setreceipts] = useState([]);
  const [alert, setAlert] = useState(state?.message);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    fetch(isArchived ? "receipt?isArchived=true" : "receipt")
      .then((response) => {
        response.json().then((receipts) => {
          console.log(receipts);

          setreceipts(receipts);
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isArchived]);

  const isArchivedStyling = useMemo(() => {
    return isArchived ? "text-muted text-decoration-line-through" : "";
  }, [isArchived]);

  const handleDelete = async (e, receipt) => {
    e.preventDefault();

    if (!window.confirm(`Вы уверены, что хотите удалить ${receipt.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/receipt?id=${receipt.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setAlert({
          message: "Не удалось удалить или заархивировать отгрузка",
          isError: true,
        });

        return;
      }

      setreceipts((prev) => prev.filter((r) => r.id !== receipt.id));

      setAlert({
        message: "отгрузка удален успешно",
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
      <h1>Отгрузкы</h1>
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
            isArchived ? "/dashboard/receipt" : "/dashboard/receipt/archived"
          );
        }}
      >
        {isArchived ? "просмотр активных" : "просмотреть архив"}
      </button>
      {!receipts || receipts.length <= 0 ? (
        <p>Нет отгрузка...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Номер заказа</th>
              <th>Дата</th>
              <th>Ресурс</th>
              <th>Обновление</th>
              <th>Удаление</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => {
              return (
                <tr key={receipt.id}>
                  <td className={isArchivedStyling}>
                    {receipt.purchaseOrder}
                  </td>
                  <td className={isArchivedStyling}>
                    {receipt?.date?.split("T")?.[0]}
                  </td>
                  <td>
                    <ul>
                      {(receipt?.receiptResources ?? []).map((sr) => {
                        return (
                          <li>
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
                      Обновление
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link link-danger"
                      onClick={(e) => handleDelete(e, receipt)}
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
          navigate(`/dashboard/receipt/add`);
        }}
      >
        Добавить новый отгрузка
      </button>
    </div>
  );
}
