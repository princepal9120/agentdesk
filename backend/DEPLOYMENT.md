# Deployment Guide - MedVoice Backend

## Google Cloud Platform (GCP) Deployment

### Prerequisites
- GCP account with billing enabled
- `gcloud` CLI installed and configured
- Docker installed locally

### 1. Setup GCP Project

```bash
# Set project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  storage-api.googleapis.com \
  pubsub.googleapis.com \
  cloudscheduler.googleapis.com
```

### 2. Create Cloud SQL Instance (PostgreSQL)

```bash
# Create instance
gcloud sql instances create medvoice-db \
  --database-version=POSTGRES_14 \
  --tier=db-g1-small \
  --region=us-central1 \
  --root-password=SECURE_PASSWORD \
  --storage-type=SSD \
  --storage-size=10GB

# Create database
gcloud sql databases create medvoice \
  --instance=medvoice-db

# Create user
gcloud sql users create medvoice \
  --instance=medvoice-db \
  --password=SECURE_PASSWORD
```

### 3. Setup Redis (Memorystore)

```bash
gcloud redis instances create medvoice-redis \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_7_0
```

### 4. Create Cloud Storage Bucket

```bash
gsutil mb -l us-central1 gs://medvoice-storage
gsutil iam ch allUsers:objectViewer gs://medvoice-storage
```

### 5. Build and Push Docker Image

```bash
# Build image
gcloud builds submit --tag gcr.io/$PROJECT_ID/medvoice-backend

# Or using Docker
docker build -t gcr.io/$PROJECT_ID/medvoice-backend .
docker push gcr.io/$PROJECT_ID/medvoice-backend
```

### 6. Deploy to Cloud Run

```bash
# Get Cloud SQL connection name
export SQL_CONNECTION=$(gcloud sql instances describe medvoice-db \
  --format='value(connectionName)')

# Get Redis host
export REDIS_HOST=$(gcloud redis instances describe medvoice-redis \
  --region=us-central1 --format='value(host)')

# Deploy
gcloud run deploy medvoice-backend \
  --image gcr.io/$PROJECT_ID/medvoice-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 2 \
  --timeout 300 \
  --concurrency 80 \
  --min-instances 1 \
  --max-instances 10 \
  --add-cloudsql-instances $SQL_CONNECTION \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "PORT=8080" \
  --set-env-vars "DATABASE_URL=postgresql://medvoice:PASSWORD@/medvoice?host=/cloudsql/$SQL_CONNECTION" \
  --set-env-vars "REDIS_HOST=$REDIS_HOST" \
  --set-env-vars "REDIS_PORT=6379"
```

### 7. Set Secrets (Recommended)

```bash
# Create secrets
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-
echo -n "your-openai-key" | gcloud secrets create openai-api-key --data-file=-
echo -n "your-deepgram-key" | gcloud secrets create deepgram-api-key --data-file=-
echo -n "your-elevenlabs-key" | gcloud secrets create elevenlabs-api-key --data-file=-

# Grant access to Cloud Run service account
gcloud secrets add-iam-policy-binding jwt-secret \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Update Cloud Run with secrets
gcloud run services update medvoice-backend \
  --update-secrets JWT_SECRET=jwt-secret:latest \
  --update-secrets OPENAI_API_KEY=openai-api-key:latest \
  --update-secrets DEEPGRAM_API_KEY=deepgram-api-key:latest \
  --update-secrets ELEVENLABS_API_KEY=elevenlabs-api-key:latest
```

### 8. Run Database Migrations

```bash
# Connect to Cloud SQL
gcloud sql connect medvoice-db --user=medvoice

# Or use Cloud SQL Proxy
cloud_sql_proxy -instances=$SQL_CONNECTION=tcp:5432

# Run migrations locally
DATABASE_URL="postgresql://medvoice:PASSWORD@localhost:5432/medvoice" \
  npx prisma migrate deploy
```

### 9. Setup Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service medvoice-backend \
  --domain api.yourdomain.com \
  --region us-central1
```

### 10. Setup Cloud Scheduler (Cron Jobs)

```bash
# Create scheduler for reminders
gcloud scheduler jobs create http appointment-reminders \
  --schedule="0 */2 * * *" \
  --uri="https://your-service-url/api/v1/cron/send-reminders" \
  --http-method=POST \
  --oidc-service-account-email=PROJECT_NUMBER-compute@developer.gserviceaccount.com
```

## AWS Deployment (Alternative)

### 1. Setup RDS PostgreSQL

```bash
aws rds create-db-instance \
  --db-instance-identifier medvoice-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username medvoice \
  --master-user-password SECURE_PASSWORD \
  --allocated-storage 20
```

### 2. Setup ElastiCache Redis

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id medvoice-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

### 3. Deploy to ECS Fargate

```bash
# Create ECR repository
aws ecr create-repository --repository-name medvoice-backend

# Build and push
aws ecr get-login-password | docker login --username AWS --password-stdin ECR_URL
docker build -t medvoice-backend .
docker tag medvoice-backend:latest ECR_URL/medvoice-backend:latest
docker push ECR_URL/medvoice-backend:latest

# Create ECS cluster
aws ecs create-cluster --cluster-name medvoice-cluster

# Create task definition (see task-definition.json)
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster medvoice-cluster \
  --service-name medvoice-backend \
  --task-definition medvoice-backend \
  --desired-count 2 \
  --launch-type FARGATE
```

## Environment Variables Checklist

### Required
- ✅ `NODE_ENV=production`
- ✅ `PORT=8080`
- ✅ `DATABASE_URL`
- ✅ `REDIS_HOST`
- ✅ `REDIS_PORT`
- ✅ `JWT_SECRET`
- ✅ `JWT_REFRESH_SECRET`
- ✅ `OPENAI_API_KEY`
- ✅ `DEEPGRAM_API_KEY`
- ✅ `ELEVENLABS_API_KEY`

### Optional
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `GCP_PROJECT_ID`
- `GCP_STORAGE_BUCKET`
- `SENTRY_DSN`
- `CORS_ORIGIN`

## Post-Deployment

### 1. Health Check

```bash
curl https://your-service-url/api/v1/health
```

### 2. Test API

```bash
# Signup
curl -X POST https://your-service-url/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'

# Login
curl -X POST https://your-service-url/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### 3. Monitor Logs

```bash
# GCP
gcloud run logs read medvoice-backend --limit 50

# AWS
aws logs tail /aws/ecs/medvoice-backend --follow
```

### 4. Setup Monitoring

- Configure Cloud Monitoring/CloudWatch alerts
- Set up error tracking (Sentry)
- Configure uptime checks
- Set up performance monitoring

## Scaling Configuration

### Auto-scaling (GCP Cloud Run)

```bash
gcloud run services update medvoice-backend \
  --min-instances 2 \
  --max-instances 20 \
  --cpu-throttling \
  --concurrency 100
```

### Database Connection Pooling

Update DATABASE_URL:
```
postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=20
```

## Backup Strategy

### Database Backups

```bash
# GCP Cloud SQL
gcloud sql backups create \
  --instance=medvoice-db \
  --description="Manual backup"

# Enable automated backups
gcloud sql instances patch medvoice-db \
  --backup-start-time=03:00
```

### Storage Backups

```bash
# GCP Cloud Storage versioning
gsutil versioning set on gs://medvoice-storage
```

## Security Checklist

- ✅ Use secrets management (GCP Secret Manager / AWS Secrets Manager)
- ✅ Enable HTTPS only
- ✅ Configure CORS properly
- ✅ Enable rate limiting
- ✅ Use VPC for database connections
- ✅ Enable Cloud Armor / WAF
- ✅ Regular security updates
- ✅ Audit logging enabled

## Troubleshooting

### Common Issues

1. **Database connection fails**
   - Check Cloud SQL connection name
   - Verify service account permissions
   - Check VPC configuration

2. **Redis connection timeout**
   - Verify Redis host/port
   - Check VPC peering
   - Verify firewall rules

3. **High latency**
   - Increase CPU/memory
   - Enable connection pooling
   - Add Redis caching
   - Scale instances

4. **Out of memory**
   - Increase memory allocation
   - Check for memory leaks
   - Optimize queries

---

For more help, see the main README or contact support.
