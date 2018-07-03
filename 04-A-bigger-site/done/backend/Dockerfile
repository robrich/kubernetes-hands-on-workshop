FROM microsoft/dotnet:2.1-sdk-alpine AS build

WORKDIR /src

COPY backend.csproj .
RUN dotnet restore backend.csproj

COPY . .
RUN dotnet build backend.csproj -c Release
RUN dotnet publish backend.csproj -c Release -o /app


FROM microsoft/dotnet:2.1-aspnetcore-runtime-alpine

ENV ASPNETCORE_URLS http://+:5000
EXPOSE 5000

WORKDIR /app
COPY --from=build /app .

ENTRYPOINT ["dotnet", "backend.dll"]
