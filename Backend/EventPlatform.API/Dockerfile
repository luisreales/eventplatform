FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["EventPlatform.API/EventPlatform.API.csproj", "EventPlatform.API/"]
COPY ["EventPlatform.Application/EventPlatform.Application.csproj", "EventPlatform.Application/"]
COPY ["EventPlatform.Domain/EventPlatform.Domain.csproj", "EventPlatform.Domain/"]
COPY ["EventPlatform.Infrastructure/EventPlatform.Infrastructure.csproj", "EventPlatform.Infrastructure/"]
RUN dotnet restore "EventPlatform.API/EventPlatform.API.csproj"
COPY . .
WORKDIR "/src/EventPlatform.API"
RUN dotnet build "EventPlatform.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EventPlatform.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EventPlatform.API.dll"] 