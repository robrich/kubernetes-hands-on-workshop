Using Other Container Builders and Runtimes
===========================================

**[Docker Desktop](README.md)** is definitely the easiest to learn and use. But if it isn't working for you because of firewall issues or you don't have admin access to your machine or you have Windows 7 or 8, or other issues, you can try these alternate Docker runtimes.  Note that you'll likely need to adjust the courseware to match the quirks of your chosen platform.

- **[Podman](Podman.md)** runs on Mac, Windows, and Linux.  It's *almost* a drop-in replacement for both the Docker CLI and a Docker runtime.  See the Podman setup instructions in [Podman.md](Podman.md).

- **[Minikube](Minikube.md)** is a single-node Kubernetes cluster in a Linux VM.  This package works on Mac, Windows, and Linux.  Minikube is only the Docker runtime; you still need a CLI such as Docker engine or Podman, both free.  See the Minikube setup instructions in [Minikube.md](Minikube.md).

- **[MicroK8s](https://microk8s.io/)** runs on most Linux distributions, and is a light-weight, single-node Kubernetes cluster with Docker installed.

   When using microk8s, swap the command line `docker` with `microk8s.docker` in all examples.

   You'll also need to download `kubectl` for your OS from https://kubernetes.io/docs/tasks/tools/install-kubectl/

- **[k3s](https://k3s.io/)** runs on most Linux distributions but doesn't run on Windows or Mac. It's a light-weight, single-node Kubernetes cluster but it doesn't include Docker build.  For this reason, you'll not find much success with k3s in this course.

### Comparison of Runtimes

| Runtime      | OS Support         | Docker Build | Kubernetes | Notes                        |
|--------------|--------------------|--------------|------------|------------------------------|
| Docker Desktop | Win, Mac, Linux  | Yes          | Yes        | The easy button               |
| Podman         | Win, Mac, Linux  | Yes          | No         | Docker CLI compatible         |
| Minikube       | Win, Mac, Linux  | Yes          | Yes        | Needs Docker/Podman CLI       |
| MicroK8s       | Linux            | Yes          | Yes        | Use `microk8s.docker`         |
| k3s            | Linux            | No           | Yes        | No docker build               |

### Verify

After you have a Docker and Kubernetes runtime installed, verify they both work as expected:

```
docker --version
docker run hello-world
kubectl version
kubectl cluster-info
```

If you get no errors from any of these commands, you're good to start pulling images.  Return to the section marked ["Start downloading images"](README.md#start-downloading-docker-images) and run the `docker pull ...` commands.
