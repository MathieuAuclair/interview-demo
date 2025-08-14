import React, { useState, useEffect } from "react";

export default function BalancePage() {
  const [balances, setBalances] = useState([]);
  const [resources, setResources] = useState([]);
  const [units, setUnits] = useState([]);

  const [resourceFilters, setResourceFilters] = useState([]);
  const [unitFilters, setUnitFilters] = useState([]);

  useEffect(() => {
    fetch(
      `balance?${resourceFilters
        .map((r) => `resourceFilters=${r}`)
        .join("&")}&${unitFilters.map((u) => `unitFilters=${u}`).join("&")}`
    ).then((response) => {
      response.json().then((balances) => {
        setBalances(balances);
      });
    });
  }, [resourceFilters, unitFilters]);

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

  return (
    <div>
      <h1>Баланс</h1>
      <div>
        <div className="d-flex justify-content-end border rounded gap-2 p-2 my-2">
          <p className="my-auto me-auto">Фильтр по ресурсу</p>
          {resources.map((resource) => {
            const isActive = resourceFilters.includes(resource.id);

            return (
              <button
                className={`d-flex btn btn-${
                  isActive ? "" : "outline-"
                }secondary`}
                onClick={() =>
                  setResourceFilters(
                    isActive
                      ? resourceFilters.filter((r) => r !== resource.id)
                      : [...resourceFilters, resource.id]
                  )
                }
                key={`resourceFilter${resource.id}`}
              >
                {resource.name}
              </button>
            );
          })}
        </div>
        <div className="d-flex justify-content-end border rounded gap-2 p-2 my-2">
          <p className="my-auto me-auto">Фильтр по единице измерения</p>
          {units.map((unit) => {
            const isActive = unitFilters.includes(unit.id);

            return (
              <button
                className={`d-flex btn btn-${
                  isActive ? "" : "outline-"
                }secondary`}
                onClick={() =>
                  setUnitFilters(
                    isActive
                      ? unitFilters.filter((u) => {
                          return u !== unit.id;
                        })
                      : [...unitFilters, unit.id]
                  )
                }
                key={`resourceFilter${unit.id}`}
              >
                {unit.name}
              </button>
            );
          })}
        </div>
      </div>
      {!balances || balances.errors || balances.length <= 0 ? (
        <p>Нет единица...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Ресурс</th>
              <th>Единица измерения</th>
              <th>Количество</th>
            </tr>
          </thead>
          <tbody>
            {balances.map((balance) => {
              return (
                <tr key={balance.id}>
                  <td>{balance.resource.name}</td>
                  <td>{balance.unit.name}</td>
                  <td>{balance.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
