## Ezrabot Kubernetes / Kong / DNS Guide

This folder contains Kubernetes manifests for the Ezrabot stack (Kong, Redis, authz, pyapi, MeetEzra portal, shared JWS keys, etc.). Use this guide when you:

- Switch DNS / domains
- Update the Ezra bot ingress
- Change allowed CORS origins in Kong

---

### 1. Changing DNS / domains

Update these files when changing public DNS:

- `k8s/kong/kong-ingress.yaml` – Kong proxy/admin/manager hosts (`spec.rules[*].host`, `spec.tls[*].hosts`).
- `k8s/kong/certificates.yaml` – TLS `spec.dnsNames` for those hosts.
- `k8s/meetezraportal/ingress.yaml` – Ezrabot portal host (`spec.rules[0].host`, `spec.tls[0].hosts[0]`).

---

### 2. CORS configuration in Kong

File: `k8s/kong/kong-config.yaml` (`ConfigMap` named `kong-config` with a `kong.yml` key).

- Global CORS plugin: `plugins[]` where `name: cors`.
- Allowed origins: `plugins[].config.origins`.

To add a new frontend origin:

1. Edit `k8s/kong/kong-config.yaml`.
2. Add the origin under `data.kong.yml.plugins[name: cors].config.origins`.
3. Apply: `kubectl apply -f k8s/kong/kong-config.yaml -n kong`.

---

### 3. Where the Kong YAML config lives

Kong runs in **database mode** (`KONG_DATABASE=postgres` in `k8s/kong/kong-deployment.yaml`).

- Canonical routes/plugins live in `k8s/kong/kong-config.yaml` (`data.kong.yml`).
- When you change routes/plugins, update that file and apply it.

---

### 4. Quick checklist when changing Ezrabot domain

1. **DNS**: update Kong proxy/admin/manager hosts + Ezrabot portal host in your DNS provider.
2. **Manifests**: update:
   - `k8s/kong/kong-ingress.yaml`
   - `k8s/kong/certificates.yaml`
   - `k8s/meetezraportal/ingress.yaml`
3. **CORS**: edit `k8s/kong/kong-config.yaml` → `data.kong.yml.plugins[name=cors].config.origins`.
4. **Apply**:
   - `kubectl apply -f k8s/kong/`
   - `kubectl apply -f k8s/meetezraportal/`
5. **Verify**:
   - `kubectl get ing -n kong`
   - `kubectl get ing -n ezrabot`


