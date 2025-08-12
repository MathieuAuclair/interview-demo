import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function UpdateShipmentInput() {
  const navigate = useNavigate();

  const { state } = useLocation();
  const shipment = state?.shipment ?? {
    shipmentResources: [],
  };

  const [customers, setCustomers] = useState([]);
  const [resources, setResources] = useState([]);
  const [units, setUnits] = useState([]);

  const [customerId, setCustomerId] = useState(shipment.customerId);
  const [purchaseOrder, setPurchaseOrder] = useState(shipment.purchaseOrder);
  const [isSigned, setIsSigned] = useState(shipment.isSigned);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [shipmentResources, setShipmentResources] = useState(
    shipment.shipmentResources
  );

  useEffect(() => {
    fetch("customer").then((response) => {
      response.json().then((customers) => {
        setCustomers(customers);
      });
    });

    fetch("resource").then((response) => {
      response.json().then((resources) => {
        setResources(resources);
      });
    });

    fetch("unit").then((response) => {
      response.json().then((units) => {
        setUnits(units);
      });
    });
  }, []);

  useEffect(() => {
    if (!customerId) {
      setCustomerId(customers?.[0]?.id);
    }
  }, [customers, customerId]);

  const handleFailureNavigation = () => {
    navigate(`/dashboard/shipment`, {
      state: {
        message: {
          message: "Не удалось обновить отгрузка.",
          isError: true,
        },
      },
    });
  };

  const handleSubmit = async (isArchived) => {
    const data =
      isArchived === shipment.isArchived
        ? {
            ...shipment,
            date,
            customerId,
            customer: null,
            shipmentResources: shipmentResources.map((sr) => {
              return {
                ...sr,
                unit: null,
                resource: null,
              };
            }),
            purchaseOrder,
            isSigned,
            isArchived,
          }
        : { ...shipment, isArchived };

    try {
      const response = await fetch("/shipment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate(`/dashboard/shipment`, {
          state: {
            message: {
              message: "Отгрузка успешно обновлен!",
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

  const handleShipmentResourceUpdate = (id, resourceId) => {
    setShipmentResources((prev) =>
      prev.map((item) =>
        item.id === id || item.index === id ? { ...item, resourceId } : item
      )
    );
  };

  const handleShipmentUnitUpdate = (id, unitId) => {
    setShipmentResources((prev) =>
      prev.map((item) =>
        item.id === id || item.index === id ? { ...item, unitId } : item
      )
    );
  };

  const handleShipmentQuantityUpdate = (id, quantity) => {
    setShipmentResources((prev) =>
      prev.map((item) =>
        item.id === id || item.index === id
          ? { ...item, quantity: parseInt(quantity, 0) }
          : item
      )
    );
  };

  const handleRemoveResource = (id) => {
    setShipmentResources((prev) =>
      prev.filter((item) => item.id !== id && item.index !== id)
    );
  };

  return (
    <div>
      <h1>Отгрузка</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(shipment.isArchived);
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
          <label htmlFor="floatingInput">адрес</label>
        </div>
        <select
          className="form-select"
          aria-label="Клиент"
          onChange={(e) => setCustomerId(e.target.value)}
          required
        >
          {customers.map((customer) => {
            return (
              <option
                key={customer.id}
                value={customer.id}
                selected={customer.id === customerId ? "selected" : false}
              >
                {customer.name}
              </option>
            );
          })}
        </select>
        <label
          onClick={() => {
            setIsSigned(!isSigned);
          }}
          className={`btn ${
            isSigned ? "btn-success" : "btn-outline-secondary"
          }`}
        >
          {isSigned ? "Signed" : "Processing"}
        </label>
        <div className="card my-3 p-3">
          <h3>Resources</h3>
          {shipmentResources.map((sr) => {
            return (
              <div className="d-flex flex-column gap-2">
                <div className="form-floating">
                  <input
                    value={sr.quantity}
                    type="number"
                    onChange={(e) =>
                      handleShipmentQuantityUpdate(
                        sr.id ?? sr.index,
                        e.target.value
                      )
                    }
                    required
                    className="form-control"
                  />
                  <label htmlFor="floatingInput">адрес</label>
                </div>
                <select
                  className="form-select"
                  aria-label="Клиент"
                  onChange={(e) =>
                    handleShipmentResourceUpdate(
                      sr.id ?? sr.index,
                      e.target.value
                    )
                  }
                  required
                >
                  {resources.map((resource) => {
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
                <select
                  className="form-select"
                  aria-label="Клиент"
                  onChange={(e) =>
                    handleShipmentUnitUpdate(sr.id ?? sr.index, e.target.value)
                  }
                  required
                >
                  {units.map((unit) => {
                    return (
                      <option
                        key={unit.id}
                        value={unit.id}
                        selected={unit.id === sr.unitId ? "selected" : false}
                      >
                        {unit.name}
                      </option>
                    );
                  })}
                </select>
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => handleRemoveResource(sr.id ?? sr.index)}
                    className="btn btn-outline-warning"
                  >
                    remove
                  </button>
                </div>
                <hr />
              </div>
            );
          })}
          <button
            type="button"
            onClick={() =>
              setShipmentResources([
                ...shipmentResources,
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
            Add new resource
          </button>
        </div>
        <button className="btn btn-primary" type="submit">
          Сохранить
        </button>
      </form>
    </div>
  );
}
