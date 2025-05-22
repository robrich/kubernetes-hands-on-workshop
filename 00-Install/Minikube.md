Using Other Container Builders and Runtimes
===========================================

[Docker Desktop](README.md) is definitely the easiest tool to learn. But if you have concerns with licensing Docker Desktop, you can use alternate systems.  With minor adjustments, this course will work with **Minikube**.

[Minikube](https://github.com/kubernetes/minikube/) is a single-node Kubernetes cluster in a Linux VM.  This package works on Mac, Windows, and Linux.

Note that unlike Docker Desktop, Podman, and others, Minikube does not integrate with WSL2.

Note that Minikube replaces the Docker runtime, but does not replace the Docker CLI.  You'll still need a CLI such as [Docker Engine](https://docs.docker.com/engine/install/) or [Podman CLI](https://github.com/containers/podman).  Both are free and open-source.

Let's get Minikube and a CLI installed.


Install Minikube
----------------

1. Choose one virtualization platform:

   a. Install VirtualBox from https://www.virtualbox.org/wiki/Downloads

   OR

   b. **Windows Only:** Install `Hyper-V` from Start -> Control Panel -> Programs and Features -> Turn Windows Features on or off.

      ![Hyper-V](hyperv.png)

2. Download latest version of Minikube for your OS from https://github.com/kubernetes/minikube/releases and rename it to `minikube` or `minikube.exe` (Windows).

3. Move `minikube` into your PATH.  You may choose to create a new folder like `C:\Program Files\Minikube` and move the minikube executable into it, then add this directory to your path.  See also https://helpdeskgeek.com/windows-10/add-windows-path-environment-variable/

4. Optional: You may wish to give Minikube more RAM and CPUs:

   ```
   minikube config set memory 4096
   minikube config set cpus 4
   ```

   These numbers are good defaults, but you may need to adjust these numbers to be less than the CPUs and RAM you have available on your machine.


Install Kubernetes CLI
----------------------

1. Download `kubectl` for your OS from https://kubernetes.io/docs/tasks/tools/install-kubectl/

2. Put `kubectl` in your `PATH`.  You may choose to move kubectl to the same folder as minikube.


Install Container CLI
---------------------

You need a CLI to build and run containers.  Pick one of the free and open-source tools:

### Podman CLI

1. Download Podman CLI from https://github.com/containers/podman/releases and install it.

2. Create a symlink or shortcut from `podman` or `podman.exe` to `docker` or `docker.exe`.  See also [Installing Docker Shim](README.md#installing-docker-shim)

OR

### Docker Engine

"Docker Engine" is the free and open-source pieces of Docker.  "Docker Desktop" is a paid product that sits on top and offers many conveniences.  There are no purchase requirements to using Docker Engine.

The most up-to-date install instructions are on https://docs.docker.com/engine/install/

#### [Linux](https://docs.docker.com/engine/install/binaries/#install-daemon-and-client-binaries-on-linux)

**Note**: You may find it easier to use your distro's package manager.

1. Download the latest Docker Engine binaries from https://download.docker.com/linux/static/stable/

2. Untar the archive and move it to `/usr/bin`

3. There is no need to start the Docker daemon; we're using Minikube for that.


#### [Mac](https://docs.docker.com/engine/install/binaries/#install-client-binaries-on-macos)

1. Download the latest Docker Engine binaries from https://download.docker.com/mac/static/stable/

2. Untar the archive and move it to `/usr/local/bin`

3. Docker Engine for Mac doesn't include the Docker daemon.  That's ok.  We're using Minikube for that.


#### [Windows](https://docs.docker.com/engine/install/binaries/#install-server-and-client-binaries-on-windows)

1. Download the latest Docker Engine binaries from https://download.docker.com/win/static/stable/x86_64

2. Unzip the zip archive.

3. Move the files into your PATH.  You may choose to move them to `C:\Program Files\Minikube` for example.

4. No need to start Docker daemon; we're using Minikube for that.


Start Minikube
--------------

1. If you're using VirtualBox:

   ```
   minikube start
   ```

   OR

   If you're using Hyper-V:

   ```
   minikube start --vm-driver="hyperv" --hyperv-virtual-switch="YOUR_EXTERNAL_SWITCH_HERE"
   ```

   Change the name of the switch to match your Hyper-V external switch.  Start -> Hyper-V -> Virtual Switch Manager -> find the switch marked as "External".

2. Set docker environment variables:

   ```
   minikube docker-env
   ```

   Copy and paste these environment variables into every terminal you'll use through this course.

   For every new terminal you start today, you'll need to re-run this step.

   You'll need to set similar variables in any IDEs with Docker plugins.  See the setup for [VS Code](https://code.visualstudio.com/remote/advancedcontainers/develop-remote-host#_a-basic-remote-example) for example.


Adjusting the Courseware
------------------------

Unlike Docker Desktop, Minikube does not automatically proxy localhost into the Docker VM.  Instead, you'll need to specify the name or IP of the Minikube VM.

In all the examples that say `http://localhost:...`, you'll need to swap them to say `http://minikube:...`

**Windows only**: Minikube on Hyper-V doesn't automatically mount volumes.  Note that Hyper-V isn't listed in https://minikube.sigs.k8s.io/docs/handbook/mount/#driver-mounts

When you use volumes, you'll first need to mount the folder into the Minikube VM:

```
minikube mount "C:\Users\YourName\path\to\folder:/mnt/folder" --ip {host_ip}
```

Get your current machine's IP using `ipconfig`. Choose the IP that matches the switch you used to start Minikube above.  Then replace `{host_ip}`.  My IP is 192.0.0.92 so my command is `minikube mount "C:\path:/mnt/myapp" --ip 192.0.0.92`.

Then use this Linux path when creating the mount:

```
docker run -v /mnt/folder:/path/inside/container image-name
```


### Verify

After you have a Docker and Kubernetes runtime and a container builder CLI installed, verify they all work as expected:

```
docker --version
docker run hello-world
kubectl version
kubectl cluster-info
```

If you don't see an error message, it worked.

Start downloading docker images
-------------------------------

Once all the tools are installed, you're good to start pulling images.  In the main README, go to the section marked ["Start downloading images"](README.md#start-downloading-docker-images) and run the `docker pull ...` commands.
