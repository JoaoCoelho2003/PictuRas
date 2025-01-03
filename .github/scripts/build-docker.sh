docker build -t web:latest -f .github/scripts/web.Dockerfile .
docker tag ${PROJECT} localhost:5000/${PROJECT}
docker push localhost:5000/${PROJECT}

SUBPROJECTS=("api-gateway" "auto-adjust-filter" "binarization-filter" "borders-add-filter" "brightness-filter" "contrast-filter" "cropping-filter" "filter-helper" "grayscale-filter" "object-identification-filter" "ocr-filter" "person-count-filter" "projects-ms" "remove-bg-filter" "resize-filter" "rotate-filter" "saturation-filter" "smart-crop-filter" "subscriptions-ms" "users-ms" "ws-gateway")

for PROJECT in "${SUBPROJECTS[@]}"; do
  IMAGE_NAME="${PROJECT}:latest"
  docker build --build-arg SUBPROJECT=${PROJECT} -t ${IMAGE_NAME} f .github/scripts/picturas.Dockerfile .
  docker tag ${PROJECT} localhost:5000/${PROJECT}
  docker push localhost:5000/${PROJECT}
done
