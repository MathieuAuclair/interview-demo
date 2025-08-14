import React, { useState, useEffect } from "react";
import LogisticFilter from "../LogisticFilter";

export default function BalancePage() {
  const [balances, setBalances] = useState([]);
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

  return (
    <div>
      <h1>Баланс</h1>
      <LogisticFilter
        resourceFilters={resourceFilters}
        setResourceFilters={setResourceFilters}
        unitFilters={unitFilters}
        setUnitFilters={setUnitFilters}
      />
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
