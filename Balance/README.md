# Настройка разработчика

Команды предназначены для ArchLinux, найдите эквивалент для вашего дистрибутива.

```bash
 sudo pacman -S dotnet-sdk-8.0
 sudo pacman -S docker
```

# Настройка проект

```bash
# создать экземпляр контейнера Docker (Использование стабильной версии)
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=StrongPassw0rd\!" \
   --name mssql
   -p 1433:1433 \
   -d \
   mcr.microsoft.com/mssql/server:2022-latest
```