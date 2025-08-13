import React, { useState, useEffect } from "react";

export default function BalancePage({ isArchived }) {
  const [isLoading, setIsLoading] = useState(true);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    fetch("balance")
      .then((response) => {
        response.json().then((balances) => {
          console.log(balances);
          setBalances(balances);
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isArchived]);

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h1>Баланс</h1>
      {!balances || balances.length <= 0 ? (
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
