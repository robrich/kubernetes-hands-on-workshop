Installing Docker Desktop
=========================

We're going to install Docker Desktop, and turn on Kubernetes mode.  If you can't get Docker Desktop running or are burdened by licensing issues you can use [Podman](Podman.md), [Minikube](Minikube.md), or [other runtimes](Other-runtimes.md) instead.  You'll need to customize the courseware in places to get these other tools to fit.  Note that Docker Desktop is far-and-away the easiest.


Install Docker Desktop for your OS
----------------------------------

### Linux

Follow the instructions on https://docs.docker.com/desktop/install/linux-install/ to install Docker Desktop and configure it for Linux.

1. Visit https://docs.docker.com/desktop/install/linux-install/ to ensure you have the necessary requirements.

2. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/) and install as you would any Linux app.

Though you can use Docker Engine for the first few chapters, it doesn't provision a Kubernetes cluster, making later work harder.  You can use Docker Engine together with Minikube, k3s, Podman, or other runtime that will provision both a Docker build environment and a Kubernetes cluster.


### Mac

1. Visit https://docs.docker.com/docker-for-mac/install/#what-to-know-before-you-install to ensure you have the necessary requirements.

2. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/) and install as you would any Mac app.

   ![Mac Install](mac.png)


### Windows!

1. Virtualization enabled in the BIOS.

   In Windows, open the Task Manager, click on "more details" (if you're not there already), switch to the Performance tab, and click on CPU.

   [Task Manager](task-manager.png)

   Does it say `Virtualization: Enabled`?

   - If it says `Virtualization: Enabled`, this step is already done.
   - If it says `Virtualization: Disabled` you first need to enable virtualization in the BIOS.

   Every BIOS is different, so you'll need to search your manufacturer's site or your BIOS screens for the setting.  Here's an example BIOS screen; your computer's BIOS options will likely look very different.

   ![Windows Install](windows.gif)

2. Install Windows Subsystem for Linux version 2.  See also https://docs.microsoft.com/en-us/windows/wsl/install-win10  Note: these are instructions for Windows 10 and 11 Pro and Enterprise.  If you're using an earlier version of Windows or Windows Home, you can't use WSL2.

   Run these commands in an admin terminal:

   ```
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

   Install https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi

   Run these commands in an admin terminal:

   ```
   wsl --set-default-version 2
   wsl install Ubuntu
   ```

3. Is your WSL distribution version 2?

   Check your version:

   ```
   wsl --list --verbose
   ```

   If it's not version 2:

   ```
   wsl --set-version Ubuntu 2
   ```

   Replace Ubuntu with your Linux package name.

4. Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) and install as you would any Windows app.

5. Carefully pick "Linux Containers mode" when prompted.

6. Gratuitously reboot.


### Docker in a VM

If you're not in a VM, you can skip this section.

If you're installing Docker in a VMware Workstation VM, reference [this post](https://communities.vmware.com/thread/498837) to get a VMware Workstation virtual machine to run Docker.  This assumes you've enabled virtualization on the host's BIOS so you can run VMware.

If you're installing Docker in a Windows VM running inside Parallels on your mac, see [this post](http://tattoocoder.com/configure-docker-for-windows-under-parallels/) to configure Parallels for nested virtualization.

Most of us aren't running Docker in a VM, so you can ignore both articles above.


Verify it Works
---------------

1. Ensure you're in Linux containers:

   In the system tray (to the left of the clock), right-click on the whale icon, and ensure it says "Switch to Windows Containers".  If you find an option that says "Switch to Linux Containers", select this option.

2. Ensure Docker works:

   From a command prompt / terminal, type:

   ```
   docker --version
   ```

   then type:

   ```
   docker run hello-world
   ```

   If you don't see an error message, it worked.


Enable Kubernetes Mode
----------------------

1. In the task tray (bottom-right corner on Windows, top-right corner on Mac), click on the whale icon, and choose settings.

2. Switch to the Kubernetes tab, enable Kubernetes, and click apply.  The first time you do this, it'll take a good while to download all the containers and start the Kubernetes control plane.

   ![Kubernetes mode](kubernetes-mode.png)

### **Don't have the Kubernetes tab?**

- If you don't have the Kubernetes tab in your Docker settings, upgrade your version of Docker.

- If running Docker Desktop on Windows, ensure you're in Linux Containers mode. Right-click on the whale icon, "Switch to Linux Containers".  If it says "Switch to Windows Containers", you're already in the right place.


Verify kubectl works
--------------------

`kubectl` is the command-line tool for Kubernetes, and was installed by Docker when you enabled Kubernetes mode.

From a command prompt / terminal, type:

```
kubectl version
```

If this returns a result for both client and server, you succeeded!

```
kubectl config get-contexts
```

Ensure the selected context is "docker-desktop".  If it isn't, run this:

```
kubectl config use-context docker-desktop
```


Start downloading docker images
-------------------------------

Downloading docker images takes a while, so let's kick this off so we make sure they exist when we need them:

**Note**: Running on Windows?  Ensure you're in Linux mode.  Right-click on the docker system tray icon, and choose "Switch to Linux Containers".  If it says "Switch to Windows containers", you don't need to do anything, you're already there.

1. `docker pull node:alpine`
2. `docker pull mcr.microsoft.com/dotnet/sdk:9.0-alpine`
3. `docker pull mcr.microsoft.com/dotnet/aspnet:9.0-alpine`

If you get an error about throttled docker pull requests, change the commands to this:

1. ```
   docker pull robrich.azurecr.io/node:alpine
   docker tag robrich.azurecr.io/node:alpine node:alpine
   ```
2. ```
   docker pull robrich.azurecr.io/dotnet-sdk:9.0-alpine
   docker tag robrich.azurecr.io/dotnet-sdk:9.0-alpine mcr.microsoft.com/dotnet/sdk:9.0-alpine
   ```
3. ```
   docker pull robrich.azurecr.io/dotnet-aspnet:9.0-alpine
   docker tag robrich.azurecr.io/dotnet-aspnet:9.0-alpine mcr.microsoft.com/dotnet/aspnet:9.0-alpine
   ```

You're ready
------------

Now that everything is running smoothly, you're ready to begin learning.  Head to Chapter 1, and the geek in front of the room will start teaching.
