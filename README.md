# Тестовое задание

- оригинал: https://docs.google.com/document/d/1kysWVjkzO6x0HIIkFC7xxVkklAmdiyWdWtIr--eC3vk/edit?tab=t.0
- копия: https://docs.google.com/document/d/12rJhkqgascbz46nbfo7ve1ptOzC9FnjYl3vvEMn12Ek/edit?usp=sharing

# Личное примечание

> **Примечание**: По моему мнению, сущность «balance» не имеет смысла. Я выполнил задачу, как описано, но более простой, эффективный и продуктивный дизайн предполагал бы использование представления (VIEW) базы данных. Представление, особенно в MSSQL, идеально подходит для кэширования, оно обновляется само и остается в базе данных, что позволяет избежать задержек между сервером и базой данных, экономит пропускную способность и вычислительные ресурсы сервера.

# Настройка разработчика

Команды предназначены для ArchLinux, найдите эквивалент для вашего дистрибутива.

```bash
 sudo pacman -S dotnet-sdk-8.0
 sudo pacman -S aspnet-runtime-8.0
 sudo pacman -S npm
 sudo npm install -g n
 sudo n 18.15.0
 sudo pacman -S docker
```

# Настройка проекта

```bash
# создать экземпляр контейнера Docker (Использование стабильной версии)
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=StrongPassw0rd\!" \
   --name mssql
   -p 1433:1433 \
   -d \
   mcr.microsoft.com/mssql/server:2022-latest
```

# Запуск проекта (локально)

```bash
dotnet run
```