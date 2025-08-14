import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function UpdateReceiptInput({ isArchived }) {
  const navigate = useNavigate();

  const { state } = useLocation();
  const receipt = state?.receipt ?? {
    receiptResources: [],
  };

  const [resources, setResources] = useState([]);
  const [units, setUnits] = useState([]);

  const [purchaseOrder, setPurchaseOrder] = useState(receipt.purchaseOrder);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [receiptResources, setReceiptResources] = useState(
    receipt.receiptResources
  );

  useEffect(() => {
    fetch("resource?ignoreArchiveFlag=true").then((response) => {
      response.json().then((resources) => {
        setResources(resources);
      });
    });

    fetch("unit?ignoreArchiveFlag=true").then((response) => {
      response.json().then((units) => {
        setUnits(units);
      });
    });
  }, []);

  const isValidSubmission = useMemo(() => {
    return receiptResources.filter((sr) => sr.quantity > 0).length > 0;
  }, [receiptResources]);

  const handleFailureNavigation = () => {
    navigate(`/dashboard/receipt`, {
      state: {
        message: {
          message: "Не удалось обновить поступление, проверить баланс!",
          isError: true,
        },
      },
    });
  };

  const handleSubmit = async (isArchived) => {
    const data =
      isArchived === receipt.isArchived
        ? {
            ...receipt,
            date,
            receiptResources: receiptResources.map((sr) => {
              return {
                ...sr,
                unit: null,
                resource: null,
              };
            }),
            purchaseOrder,
            isArchived,
          }
        : { ...receipt, isArchived };

    try {
      const response = await fetch("/receipt", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate(`/dashboard/receipt`, {
          state: {
            message: {
              message: "Поступление успешно обновлено!",
              isError: false,
            },
          },
        });
      } else {
        handleFailureNavigation();
      }
    } catch (error) {
      console.error(error);
      handleFailureNavigation();
    }
  };

  const handleReceiptResourceUpdate = (id, resourceId) => {
    setReceiptResources((prev) =>
      prev.map((item) =>
        item.id === id || item.index === id ? { ...item, resourceId } : item
      )
    );
  };

  const handleReceiptUnitUpdate = (id, unitId) => {
    setReceiptResources((prev) =>
      prev.map((item) =>
        item.id === id || item.index === id ? { ...item, unitId } : item
      )
    );
  };

  const handleReceiptQuantityUpdate = (id, quantity) => {
    setReceiptResources((prev) =>
      prev.map((item) =>
        item.id === id || item.index === id
          ? { ...item, quantity: parseInt(quantity, 0) }
          : item
      )
    );
  };

  const handleRemoveResource = (id) => {
    setReceiptResources((prev) =>
      prev.filter((item) => item.id !== id && item.index !== id)
    );
  };

  return (
    <div>
      <h1>Поступления</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(receipt.isArchived);
        }}
        className="d-flex flex-column gap-3"
      >
        <div className="form-floating">
          <input
            value={purchaseOrder}
            minLength={6}
            maxLength={50}
            onChange={(e) => setPurchaseOrder(e.target.value)}
            required
            className="form-control"
            id="floatingInput"
          />
          <label htmlFor="floatingInput">номер заказа</label>
        </div>
        <div className="form-floating">
          <input
            value={date}
            minLength={6}
            maxLength={150}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            required
            className="form-control"
            id="floatingInput"
          />
          <label htmlFor="floatingInput">Дата</label>
        </div>
        <div className="card my-3 p-3">
          <h3>Ресурсы</h3>
          {receiptResources.map((sr) => {
            return (
              <div className="d-flex flex-column gap-2">
                <div className="form-floating">
                  <input
                    value={sr.quantity}
                    type="number"
                    min={0}
                    onChange={(e) =>
                      handleReceiptQuantityUpdate(
                        sr.id ?? sr.index,
                        e.target.value
                      )
                    }
                    required
                    className="form-control"
                  />
                  <label htmlFor="floatingInput">количество</label>
                </div>
                <div className="card p-2">
                  <label className="text-muted" htmlFor="floatingInput">
                    ресурс
                  </label>
                  <select
                    className="form-select"
                    aria-label="ресурс"
                    onChange={(e) =>
                      handleReceiptResourceUpdate(
                        sr.id ?? sr.index,
                        e.target.value
                      )
                    }
                    required
                  >
                    {resources
                      .filter(
                        (resource) =>
                          !resource.isArchived || sr.resourceId === resource.id
                      )
                      .map((resource) => {
                        return (
                          <option
                            key={resource.id}
                            value={resource.id}
                            selected={
                              resource.id === sr.resourceId ? "selected" : false
                            }
                          >
                            {resource.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="card p-2">
                  <label className="text-muted" htmlFor="floatingInput">
                    единица измерения
                  </label>
                  <select
                    className="form-select"
                    aria-label="единица измерения"
                    onChange={(e) =>
                      handleReceiptUnitUpdate(sr.id ?? sr.index, e.target.value)
                    }
                    required
                  >
                    {units
                      .filter(
                        (unit) => !unit.isArchived || sr.unitId === unit.id
                      )
                      .map((unit) => {
                        return (
                          <option
                            key={unit.id}
                            value={unit.id}
                            selected={
                              unit.id === sr.unitId ? "selected" : false
                            }
                          >
                            {unit.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => handleRemoveResource(sr.id ?? sr.index)}
                    className={`btn btn-link ${
                      isArchived ? "link-warning" : "link-danger"
                    }`}
                  >
                    {isArchived ? "Разархивировать" : "Удалить"}
                  </button>
                </div>
                <hr />
              </div>
            );
          })}
          <button
            type="button"
            onClick={() =>
              setReceiptResources([
                ...receiptResources,
                {
                  resourceId: resources?.[0]?.id,
                  unitId: units?.[0]?.id,
                  index: Date.now(),
                  quantity: 0,
                },
              ])
            }
            className="btn btn-outline-success"
          >
            Добавить новый ресурс
          </button>
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          aria-disabled={
            isValidSubmission ? null : "Поступления не может быть пустым!"
          }
          disabled={isValidSubmission ? false : "disabled"}
        >
          Сохранить
        </button>
        <i className="text-muted text-center">
          {isValidSubmission ? null : "Поступления не может быть пустым!"}
        </i>
      </form>
    </div>
  );
}
