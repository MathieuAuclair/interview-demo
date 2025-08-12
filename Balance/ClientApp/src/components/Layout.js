import React, { Component } from "react";
import { Container } from "reactstrap";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <div className="d-flex">
          <div className="p-3 bg-dark vh-100 w-25 text-center text-white">
            <h1 className="lead">Управление складом</h1>
            <hr />
            <h3>Склад</h3>
            <div className="d-flex flex-column gap-3 my-3">
              <a className="btn btn-outline-light" href="#">
                Баланс
              </a>
              <a className="btn btn-outline-light" href="#">
                Поступления
              </a>
              <a className="btn btn-outline-light" href="#">
                Отгрузки
              </a>
            </div>
            <h3>Справочники</h3>
            <div className="d-flex flex-column gap-3 my-3">
              <a className="btn btn-outline-light" href="#">
                Клиенты
              </a>
              <a className="btn btn-outline-light" href="/dashboard/unit">
                Единицы измерения
              </a>
              <a className="btn btn-outline-light" href="/dashboard/resource">
                Ресурсы
              </a>
            </div>
          </div>
          <Container tag="main" className="p-3">{this.props.children}</Container>
        </div>
      </div>
    );
  }
}
