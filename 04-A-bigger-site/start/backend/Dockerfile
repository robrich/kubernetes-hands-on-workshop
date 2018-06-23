FROM microsoft/dotnet:2.1-sdk-alpine AS build


# TODO: add the Docker commands to do these build steps:

# set the current directory
# copy the manifest file: backend.csproj
# `dotnet restore`
# copy the content into place
# `dotnet build -c Release`
# `dotnet publish -c Release -o /app`


FROM microsoft/dotnet:2.1-aspnetcore-runtime-alpine

ENV ASPNETCORE_URLS http://+:5000
EXPOSE 5000


# TODO: add the Docker commands to do these image build and container run steps:

# set the current directory
# copy the content from the app folder on the build stage above

# as the container starts:
# `dotnet backend.dll`
