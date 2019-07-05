```
dk build -t cloudrun-sample-node .
dk run --rm -p 8080:8080 cloudrun-sample-node
```

```
gcloud config set project cloudrun-sample-245604
gcloud builds submit --config cloudbuild.yaml
gcloud builds submit --tag gcr.io/cloudrun-sample-245604/cloudrun-sample-node
gcloud beta run deploy --image gcr.io/cloudrun-sample-245604/cloudrun-sample-node --platform managed --memory 2Gi
```
