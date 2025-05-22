FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build

WORKDIR /src

COPY MultiStage.csproj .
RUN dotnet restore MultiStage.csproj

COPY . .
RUN dotnet build MultiStage.csproj -c Release
RUN dotnet publish MultiStage.csproj -c Release -o /app


FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

WORKDIR /app
COPY --from=build /app .

CMD ["dotnet", "MultiStage.dll"]
