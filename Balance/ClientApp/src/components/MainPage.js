export default function MainPage() {
  return (
    <div className="bg-light">
      <div className="container my-5">
        <div className="card mb-4">
          <div className="card-body d-flex justify-content-between">
            <div>
              <h2 className="card-title">Оклер Матьё</h2>
              <p className="card-text">
                Мужчина, 27 лет, родился 12 сентября 1997
              </p>
              <p className="text-success fw-bold">Активно ищу работу</p>
              <p>
                Санкт-Петербург, м. Девяткино, не готов к переезду, готов к
                командировкам
              </p>
            </div>
            <div>
              <img src="/hh.ru.svg" alt="HH.ru logo" />
            </div>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Контакты</h5>
            <ul className="list-unstyled mb-0">
              <li>
                Телефон: +7 903 046-00-95 — предпочитаемый способ связи{" "}
                <span className="badge bg-success">Подтвержден</span>
              </li>
              <li>Telegram: @mathieuauclair</li>
              <li>
                Email:{" "}
                <a href="mailto:mathieu.auclair+hhru@mail.ru">
                  mathieu.auclair+hhru@mail.ru
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Желаемая позиция</h5>
            <p>Backend-разработчик</p>
            <p>
              Специализации: DevOps-инженер, Программист, разработчик,
              Технический директор (CTO)
            </p>
            <p>Занятость: полная занятость</p>
            <p>График работы: полный день</p>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Опыт работы: 8 лет 1 месяц</h5>

            <div className="mb-3">
              <h6>Gleeph (Ноябрь 2024 — по настоящее время, 10 месяцев)</h6>
              <p>Fullstack-разработчик, Франция, gleeph.net</p>
              <ul>
                <li>
                  Поддержка и внедрение новых функций для модулей аналитики
                  Gleeph Pro B2B (Django & React + Redux)
                </li>
                <li>
                  Мобильная разработка для приложения Gleeph (React Native)
                </li>
                <li>
                  Development of the new gleeph web application (Django & React)
                </li>
                <li>
                  Аналитическая панель с использованием Google BigQuery и Looker
                  Studio
                </li>
                <li>
                  Администрирование приборных панелей с помощью Retool & Django
                  Admin
                </li>
              </ul>
              <p>
                <strong>Основные достижения:</strong> Вовремя реализовали план
                новых функций перед инвестиционным раундом.
              </p>
              <p>
                <strong>Навыки:</strong> Django · Python · Elasticsearch · GCP ·
                AWS · Next.js · React.js · React Native · Terraform · PostgreSQL
                · Google BigQuery
              </p>
            </div>

            <div className="mb-3">
              <h6>Coinmiles (Апрель 2022 — Ноябрь 2024, 2 года 8 месяцев)</h6>
              <p>Технический директор (CTO), Канада, Монреаль</p>
              <ul>
                <li>
                  Руководство командой из 5 человек с ключевыми целями по
                  достижению результатов
                </li>
                <li>
                  Архитектура и оптимизация инфраструктуры (75 микросервисов на
                  AWS Lambda)
                </li>
                <li>
                  Разработка и внедрение платформы вознаграждений для более чем
                  70 000 пользователей
                </li>
                <li>
                  Мониторинг финансовых транзакций (~100–150 в день) и выявление
                  мошенничества
                </li>
              </ul>
              <p>
                <strong>Основные достижения:</strong> Сокращение времени
                загрузки приложения с 32с до 2,4с, внедрение магазина подарочных
                карт с доходом {">"} 50K$CAD в год.
              </p>
              <p>
                <strong>Навыки:</strong> Cryptocurrency · TypeScript · Affiliate
                Networks · AWS Lambda · MongoDB
              </p>
              <p>
                <a
                  href="https://coinmiles.io/for-business"
                  target="_blank"
                  rel="noreferrer"
                >
                  Сайт компании
                </a>
              </p>
            </div>
            <hr />
            <p>
              Для получения более подробной информации о моей карьере, посетите
              мой профиль на HH.ru.
            </p>
            <a
              className="btn btn-outline-success"
              href="https://spb.hh.ru/resume/d9190740ff0ef793030039ed1f397065647376"
            >
              Посмотреть на HH.ru
            </a>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Навыки</h5>
            <p>
              Git · PostgreSQL · Node.js · JavaScript · Python · Linux · MySQL ·
              PHP · MongoDB · TeamCity · Docker · MS SQL · Vue.js · Nginx ·
              Ubuntu · CentOS · Arch Linux · Oracle PL/SQL · Java · C# · C++ ·
              Laravel · .NET · COBOL · React · React Native · Android SDK ·
              Arduino · Веб-программирование
            </p>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Образование</h5>
            <p>
              2019 — UQAC (Университет Квебека в Шикутими), Computer Science
              (Информатика), Бакалавр
            </p>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Языки</h5>
            <ul>
              <li>Французский — Родной</li>
              <li>Английский — C2 — В совершенстве</li>
              <li>Русский — B1 — Средний</li>
            </ul>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Гражданство и разрешение на работу</h5>
            <p>Гражданство: Канада</p>
            <p>Разрешение на работу: Канада, Россия</p>
            <p>Желательное время в пути до работы: Не имеет значения</p>
          </div>
        </div>
      </div>
    </div>
  );
}
