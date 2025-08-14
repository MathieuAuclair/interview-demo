import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ReceiptPage() {
  const { state } = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [receipts, setreceipts] = useState([]);
  const [alert, setAlert] = useState(state?.message);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    fetch("receipt")
      .then((response) => {
        response.json().then((receipts) => {
          console.log(receipts);

          setreceipts(receipts);
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

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
      {!receipts || receipts.length <= 0 ? (
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
