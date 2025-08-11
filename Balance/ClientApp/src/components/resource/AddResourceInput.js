import React, { useState } from "react";

export default function AddResourceInput({ onResponse }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resource = { name, isArchived: false };

    try {
      const response = await fetch("/resource", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resource),
      });

      onResponse(response);
    } catch {
      onResponse({});
    }
  };
  
  return (
    <div>
      <h1>Добавить ресурсы</h1>
      <form onSubmit={handleSubmit}>
        <div class="form-floating mb-3">
          <input
            value={name}
            minLength={6}
            maxLength={50}
            onChange={(e) => setName(e.target.value)}
            required
            class="form-control"
            id="floatingInput"
          />
          <label for="floatingInput">название</label>
        </div>
        <button class="btn btn-primary" type="submit">
          Сохранить
        </button>
      </form>
    </div>
  );
}
