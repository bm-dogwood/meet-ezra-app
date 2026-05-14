## Ezrabot Kubernetes Dev Environment

This folder contains Kubernetes manifests for the **dev environment** of the Ezrabot stack.

### Key Differences from Production

- **Namespace**: `dev-ezrabot` (instead of `ezrabot`)
- **Backend URLs**:
  - `ADMIN_URL`: `https://dev-api.meetezra.bot/admin`
  - `FRONTEND_URL`: `https://dev-meetezra.bot/login`
- **Ingress Hosts**:
  - Backend: `dev-api.meetezra.bot`
  - Portal: `dev-meetezra.bot` and `www.dev-meetezra.bot`

### Deployment

To deploy to the dev environment:

```bash
# Create namespace if it doesn't exist
kubectl create namespace dev-ezrabot

# Apply secrets first
kubectl apply -f ../backend-secrets.yaml -n dev-ezrabot
kubectl apply -f ../meetezraportal-secrets.yaml -n dev-ezrabot

# Apply backend
kubectl apply -f backend/

# Apply meetezraportal
kubectl apply -f meetezraportal/
```

### DNS Configuration

Make sure the following DNS records are configured:
- `dev-api.meetezra.bot` → points to your ingress controller
- `dev-meetezra.bot` → points to your ingress controller
- `www.dev-meetezra.bot` → points to your ingress controller

