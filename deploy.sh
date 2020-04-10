docker build -t bilmakovchik/gh-chat:latest -t bilmakovchik/gh-chat:$SHA -f ./Dockerfile .
docker push bilmakovchik/gh-chat:latest
docker push bilmakovchik/gh-chat:$SHA
kubectl apply -f k8s
kubectl set image deployments/web-deployment web=bilmakovchik/gh-chat:$SHA
