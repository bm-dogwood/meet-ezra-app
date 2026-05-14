# Ezrabot Deployment & Onboarding Guide

## Hostnames

| Service | URL | Description |
|---------|-----|-------------|
| Backend API | `https://api.meetezra.bot` | Django REST API |
| Frontend Portal | `https://meetezra.hachiai.com` | Next.js Portal |
| Django Admin | `https://api.meetezra.bot/admin/` | Admin Panel |

---

## Infrastructure Overview

### GCP Resources (via Terraform)

| Component | Name | Region |
|-----------|------|--------|
| GCP Project | `ezrabot-481216` | - |
| GKE Cluster | `ezrabot-prod-gke` | `us-east1` |
| Cloud SQL | `ezrabot-prod-postgres` | `us-east1` |
| Artifact Registry | `ezrabot-repo` | `us-east1` |
| VPC Network | `ezrabot-prod` | `us-east1` |

### Kubernetes Namespace

- **ezrabot**: Backend and Frontend deployments
- **kong**: API Gateway (if used)

---

## Deployment Steps

### Prerequisites

1. **GCP CLI** installed and authenticated
2. **kubectl** configured with GKE cluster credentials
3. **Terraform** >= 1.0
4. **GitHub Actions** secrets configured:
   - `GOOGLE_CREDENTIALS` - Service account JSON key
   - `NEXT_PUBLIC_API_URL` - Backend API URL

### Step 1: Infrastructure Deployment (Terraform)

```bash
# Clone terraform modules
cd ezrabot-terraform-modules

# Enable required GCP APIs
./enable-apis.sh

# Grant IAM permissions
./grant-iam-permissions.sh

# Deploy infrastructure
cd environment/prod
terraform init
terraform plan
terraform apply
```

### Step 2: Configure kubectl

```bash
gcloud container clusters get-credentials ezrabot-prod-gke --region us-east1 --project ezrabot-481216
```

### Step 3: Create Kubernetes Secrets

```bash
# Create namespace
kubectl create namespace ezrabot

# Create backend secrets
kubectl create secret generic backend-secrets -n ezrabot \
  --from-literal=SECRET_KEY='<your-django-secret-key>' \
  --from-literal=DATABASE_URL='postgresql://user:password@host:5432/dbname' \
  --from-literal=INGESTION_API_KEY='<your-ingestion-api-key>'
```

### Step 4: Deploy Application

#### Option A: GitHub Actions (Recommended)

1. Go to GitHub repository → **Actions** tab
2. Select **Docker build and deploy (manual)** workflow
3. Choose:
   - **Folder**: `backend` or `meetezraportal`
   - **Tag**: `latest` or specific version (e.g., `v1.0.0`)
4. Click **Run workflow**

#### Option B: Manual Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/backend/
kubectl apply -f k8s/meetezraportal/

# Verify deployments
kubectl get pods -n ezrabot
kubectl get svc -n ezrabot
```

### Step 5: Run Database Migrations

```bash
# Get backend pod name
POD=$(kubectl get pods -n ezrabot -l app=backend -o jsonpath='{.items[0].metadata.name}')

# Run migrations
kubectl exec -n ezrabot $POD -- python manage.py migrate
```

---

## Onboarding Guide

### User Roles

| Role | Description | Admin Access |
|------|-------------|--------------|
| `super_admin` | Full system access | Full Django Admin |
| `franchisor_admin` | Franchise organization admin | Limited Django Admin (own tenant only) |
| `franchise_user` | Store-level user | UI Portal only |

### Step 1: Create SuperAdmin User

```bash
# Get backend pod
POD=$(kubectl get pods -n ezrabot -l app=backend -o jsonpath='{.items[0].metadata.name}')

# Create superuser
kubectl exec -it -n ezrabot $POD -- python manage.py createsuperuser

# Follow prompts:
# - Username: admin
# - Email: admin@example.com
# - Password: <secure-password>
```

After creating the superuser, update their role in Django Admin:

1. Login to Django Admin: `https://api.meetezra.bot/admin/`
2. Go to **Users** → Select the superuser
3. Set **Role** to `Super Admin`
4. Check **is_staff** and **is_superuser**
5. Save

### Step 2: Create Tenants (Organizations)

SuperAdmin only:

1. Login to Django Admin
2. Go to **Tenants** → **Add Tenant**
3. Fill in:
   - **Name**: Organization name (e.g., "Acme Franchise Corp")
   - **Code**: Unique identifier (e.g., "ACME")
   - **Is Active**: ✓ Checked
4. Save

### Step 3: Create Franchisor Admin Users

SuperAdmin only:

1. Go to **Users** → **Add User**
2. Fill in:
   - **Username**: franchisor_admin_acme
   - **Email**: admin@acme.com
   - **Password**: Set secure password
   - **Tenant**: Select the tenant (e.g., "Acme Franchise Corp")
   - **Role**: `Franchisor Admin`
   - **Is Staff**: ✓ Checked (allows Django Admin access)
   - **Is Superuser**: ✗ Unchecked
3. Save

### Step 4: Map Stores to Tenants

SuperAdmin only:

1. Go to **Stores** → **Add Store**
2. Fill in:
   - **Tenant**: Select organization
   - **Name**: Store name
   - **External Code**: External system identifier
   - **City/State**: Location
   - **Status**: `Active`
4. Save

### Step 5: Franchisor Admin Creates Franchise Users

Franchisor Admin (limited access):

1. Login to Django Admin with Franchisor Admin credentials
2. Go to **Users** → **Add User**
3. Fill in:
   - **Username**: store_user_01
   - **Email**: user@store.com
   - **Password**: Set secure password
4. Save

> **Note**: The system automatically assigns:
> - Tenant = Franchisor Admin's tenant
> - Role = `franchise_user`
> - is_staff = False
> - is_superuser = False

### Step 6: Franchise User Accesses Portal

1. Navigate to Portal: `https://meetezra.hachiai.com`
2. Login with credentials created by Franchisor Admin
3. User can now view analytics for stores in their tenant

---

## Role-Based Access Control Summary

### SuperAdmin

| Model | View | Add | Change | Delete |
|-------|------|-----|--------|--------|
| Tenant | ✓ All | ✓ | ✓ | ✓ |
| User | ✓ All | ✓ | ✓ | ✓ |
| Store | ✓ All | ✓ | ✓ | ✓ |
| RawReport | ✓ All | ✓ | ✓ | ✓ |
| ReportMetric | ✓ All | ✓ | ✓ | ✓ |
| StoreTarget | ✓ All | ✓ | ✓ | ✓ |

### Franchisor Admin

| Model | View | Add | Change | Delete |
|-------|------|-----|--------|--------|
| Tenant | ✓ Own only | ✗ | ✓ Own only | ✗ |
| User | ✓ Own tenant | ✓ Franchise Users only | ✓ Franchise Users only | ✓ Franchise Users only |
| Store | ✓ Own tenant | ✗ | ✗ | ✗ |
| RawReport | ✗ Hidden | ✗ | ✗ | ✗ |
| ReportMetric | ✓ Own tenant | ✗ | ✗ | ✗ |
| StoreTarget | ✓ Own tenant | ✗ | ✗ | ✗ |

### Franchise User

- No Django Admin access
- Portal access only
- Can view analytics for stores in their tenant

---

## Troubleshooting

### Check Pod Status

```bash
kubectl get pods -n ezrabot
kubectl describe pod <pod-name> -n ezrabot
kubectl logs <pod-name> -n ezrabot
```

### Database Connection Issues

```bash
# Test from pod
kubectl exec -it -n ezrabot <pod-name> -- python manage.py dbshell
```

### Reset Admin Password

```bash
kubectl exec -it -n ezrabot $POD -- python manage.py changepassword admin
```

---

## Quick Reference Commands

```bash
# Get GKE credentials
gcloud container clusters get-credentials ezrabot-prod-gke --region us-east1 --project ezrabot-481216

# View pods
kubectl get pods -n ezrabot

# View logs
kubectl logs -f deployment/backend -n ezrabot

# Scale deployment
kubectl scale deployment backend --replicas=3 -n ezrabot

# Restart deployment
kubectl rollout restart deployment/backend -n ezrabot

# Run migrations
kubectl exec -n ezrabot $(kubectl get pods -n ezrabot -l app=backend -o jsonpath='{.items[0].metadata.name}') -- python manage.py migrate

# Create superuser
kubectl exec -it -n ezrabot $(kubectl get pods -n ezrabot -l app=backend -o jsonpath='{.items[0].metadata.name}') -- python manage.py createsuperuser
```
