FROM mcr.microsoft.com/dotnet/core/sdk:3.1-alpine AS build


# TODO: add the Docker commands to do these build steps:

# set the current directory
# copy the manifest file: backend.csproj
# from a shell, run `dotnet restore`
# copy the content into place
# from a shell, run `dotnet build -c Release`
# from a shell, run `dotnet publish -c Release -o /app`


FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-alpine

ENV ASPNETCORE_URLS http://+:5000
EXPOSE 5000


# TODO: add the Docker commands to do these image build and container run steps:

# set the current directory
# copy the content from the app folder on the build stage above

# as the container starts:
# `dotnet backend.dll`
