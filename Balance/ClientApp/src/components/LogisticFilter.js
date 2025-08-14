import { useEffect, useState } from "react";

export default function LogisticFilter({
  resourceFilters,
  setResourceFilters,
  unitFilters,
  setUnitFilters,
}) {
  const [resources, setResources] = useState([]);
  const [units, setUnits] = useState([]);

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
  );
}
