# Deployment Guide - MedVoice Microservices

This guide covers deploying the MedVoice microservices to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Cloud Platforms](#cloud-platforms)
- [Database Setup](#database-setup)
- [Monitoring](#monitoring)
- [Security](#security)
- [CI/CD](#cicd)

---

## Prerequisites

### Required

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Node.js** 20+
- **PostgreSQL** 16+
- **Redis** 7+

### For Kubernetes

- **kubectl** 1.28+
- **Kubernetes cluster** (GKE, EKS, AKS, or self-hosted)
- **Helm** 3.0+ (optional)

### API Keys

- OpenAI API key
- Deepgram API key
- ElevenLabs API key
- Twilio credentials (for SMS)
- SMTP credentials (for email)
- GCP credentials (for storage)

---

## Environment Setup

### 1. Production Environment Variables

Create `.env.production`:

```bash
# Node Environment
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@postgres-host:5432/medvoice?schema=public

# Redis
REDIS_HOST=redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-super-secret-production-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-production-refresh-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AI Services
OPENAI_API_KEY=sk-prod-your-openai-key
DEEPGRAM_API_KEY=your-deepgram-key
ELEVENLABS_API_KEY=your-elevenlabs-key

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@medvoice.com

# GCP Storage
GCP_PROJECT_ID=your-project-id
GCP_BUCKET_NAME=medvoice-storage
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# CORS
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=info
```

### 2. Security Best Practices

```bash
# Generate secure secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET

# Never commit .env files
echo ".env*" >> .gitignore
```

---

## Docker Deployment

### Option 1: Docker Compose (Simple Production)

#### 1. Build Images

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Or build individually
docker build -f Dockerfile.gateway -t medvoice-gateway:latest .
docker build -f Dockerfile.auth -t medvoice-auth:latest .
docker build -f Dockerfile.voice-agent -t medvoice-voice-agent:latest .
docker build -f Dockerfile.appointments -t medvoice-appointments:latest .
docker build -f Dockerfile.notifications -t medvoice-notifications:latest .
```

#### 2. Create Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: medvoice
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - medvoice-network

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - medvoice-network

  gateway:
    image: medvoice-gateway:latest
    restart: always
    ports:
      - "80:3000"
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
      - auth
      - voice-agent
      - appointments
      - notifications
    networks:
      - medvoice-network

  auth:
    image: medvoice-auth:latest
    restart: always
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    networks:
      - medvoice-network

  voice-agent:
    image: medvoice-voice-agent:latest
    restart: always
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    networks:
      - medvoice-network

  appointments:
    image: medvoice-appointments:latest
    restart: always
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    networks:
      - medvoice-network

  notifications:
    image: medvoice-notifications:latest
    restart: always
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    networks:
      - medvoice-network

volumes:
  postgres_data:
  redis_data:

networks:
  medvoice-network:
    driver: bridge
```

#### 3. Deploy

```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec gateway npm run prisma:migrate

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Option 2: Docker Swarm (Multi-node)

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml medvoice

# Scale services
docker service scale medvoice_voice-agent=3
docker service scale medvoice_appointments=2

# Check services
docker service ls
docker service logs medvoice_gateway
```

---

## Kubernetes Deployment

### 1. Create Namespace

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: medvoice
```

```bash
kubectl apply -f namespace.yaml
```

### 2. Create Secrets

```bash
# Create secret from .env file
kubectl create secret generic medvoice-secrets \
  --from-env-file=.env.production \
  -n medvoice

# Or create manually
kubectl create secret generic medvoice-secrets \
  --from-literal=DATABASE_URL='postgresql://...' \
  --from-literal=JWT_SECRET='...' \
  --from-literal=OPENAI_API_KEY='...' \
  -n medvoice
```

### 3. Deploy PostgreSQL

```yaml
# postgres-deployment.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: medvoice
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: medvoice
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:16-alpine
        env:
        - name: POSTGRES_DB
          value: medvoice
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: medvoice-secrets
              key: DB_USER
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: medvoice-secrets
              key: DB_PASSWORD
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: medvoice
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
```

### 4. Deploy Redis

```yaml
# redis-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: medvoice
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: medvoice
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
```

### 5. Deploy Microservices

```yaml
# gateway-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gateway
  namespace: medvoice
spec:
  replicas: 2
  selector:
    matchLabels:
      app: gateway
  template:
    metadata:
      labels:
        app: gateway
    spec:
      containers:
      - name: gateway
        image: your-registry/medvoice-gateway:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: medvoice-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: gateway
  namespace: medvoice
spec:
  type: LoadBalancer
  selector:
    app: gateway
  ports:
  - port: 80
    targetPort: 3000
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: gateway-hpa
  namespace: medvoice
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: gateway
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

Repeat similar deployments for other services (auth, voice-agent, appointments, notifications).

### 6. Deploy All

```bash
kubectl apply -f postgres-deployment.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f gateway-deployment.yaml
kubectl apply -f auth-deployment.yaml
kubectl apply -f voice-agent-deployment.yaml
kubectl apply -f appointments-deployment.yaml
kubectl apply -f notifications-deployment.yaml

# Check deployments
kubectl get deployments -n medvoice
kubectl get pods -n medvoice
kubectl get services -n medvoice
```

---

## Cloud Platforms

### Google Cloud Platform (GKE)

```bash
# Create GKE cluster
gcloud container clusters create medvoice-cluster \
  --num-nodes=3 \
  --machine-type=n1-standard-2 \
  --zone=us-central1-a

# Get credentials
gcloud container clusters get-credentials medvoice-cluster

# Deploy
kubectl apply -f k8s/
```

### AWS (EKS)

```bash
# Create EKS cluster
eksctl create cluster \
  --name medvoice-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3

# Deploy
kubectl apply -f k8s/
```

### Azure (AKS)

```bash
# Create AKS cluster
az aks create \
  --resource-group medvoice-rg \
  --name medvoice-cluster \
  --node-count 3 \
  --node-vm-size Standard_D2s_v3

# Get credentials
az aks get-credentials --resource-group medvoice-rg --name medvoice-cluster

# Deploy
kubectl apply -f k8s/
```

---

## Database Setup

### Run Migrations

```bash
# Docker Compose
docker-compose exec gateway npm run prisma:migrate

# Kubernetes
kubectl exec -it deployment/gateway -n medvoice -- npm run prisma:migrate
```

### Backup Strategy

```bash
# PostgreSQL backup
pg_dump -h localhost -U medvoice medvoice > backup.sql

# Automated backups (cron)
0 2 * * * pg_dump -h localhost -U medvoice medvoice | gzip > /backups/medvoice-$(date +\%Y\%m\%d).sql.gz
```

---

## Monitoring

### Prometheus + Grafana

```yaml
# prometheus-config.yaml
scrape_configs:
  - job_name: 'medvoice-services'
    static_configs:
      - targets:
        - 'gateway:3000'
        - 'auth:3001'
        - 'voice-agent:3002'
```

### Logging with ELK Stack

```bash
# Deploy Elasticsearch, Logstash, Kibana
kubectl apply -f elk-stack.yaml
```

---

## Security

### SSL/TLS

```bash
# Let's Encrypt with cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create certificate
kubectl apply -f ssl-certificate.yaml
```

### Network Policies

```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: medvoice
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

---

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker images
        run: |
          docker build -f Dockerfile.gateway -t ${{ secrets.REGISTRY }}/gateway:${{ github.sha }} .
          docker build -f Dockerfile.auth -t ${{ secrets.REGISTRY }}/auth:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          docker push ${{ secrets.REGISTRY }}/gateway:${{ github.sha }}
          docker push ${{ secrets.REGISTRY }}/auth:${{ github.sha }}
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/gateway gateway=${{ secrets.REGISTRY }}/gateway:${{ github.sha }} -n medvoice
```

---

## Health Checks

```bash
# Check all services
curl https://api.medvoice.com/api/v1/health

# Individual services
curl http://gateway:3000/api/v1/health
curl http://auth:3001/health
curl http://voice-agent:3002/health
```

---

## Troubleshooting

### Common Issues

1. **Service won't start**: Check logs with `kubectl logs`
2. **Database connection**: Verify `DATABASE_URL` in secrets
3. **High memory usage**: Increase resource limits
4. **Slow response**: Scale up replicas

---

## Rollback

```bash
# Kubernetes rollback
kubectl rollout undo deployment/gateway -n medvoice

# Docker Compose rollback
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

---

**Last Updated**: 2024-01-01  
**Version**: 2.0
