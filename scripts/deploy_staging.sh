#!/bin/bash

set -e

declare -A lambdas

lambdas["st-account-service"]="account-service"
lambdas["st-contract-scanner"]="contract-scanner"
lambdas["st-event-worker"]="event-worker"
lambdas["st-interval-scanner"]="interval-scanner"
lambdas["st-oracle-cashgame"]="oracle"
lambdas["st-seat-reservation"]="reserve-service"
lambdas["st-stream-scanner"]="stream-scanner"

for function_name in ${!lambdas[@]}; do
    zip_name=${lambdas[${function_name}]}

    # Update Staging lambda with sandbox snapshot
    aws lambda update-function-code --function-name ${function_name} --s3-bucket builds.acebusters --s3-key sandbox/${zip_name}.zip

    # Copy sandbox snapshot as a Staging snapshot
    aws s3 cp s3://builds.acebusters/sandbox/${zip_name}.zip s3://builds.acebusters/staging/${zip_name}.zip
done

# Download sandbox frontend snapshot
aws s3 cp s3://builds.acebusters/sandbox/ab-web-frontend.zip ab-web-frontend.zip
unzip ab-web-frontend.zip -d build_staging

# Sync it to s3://staging.acebusters.com/
aws s3 sync build_staging/ s3://staging.acebusters.com/ --delete --acl public-read
rm -r build_staging

# Invalidate staging.acebusters.com CloudFront distribution
aws cloudfront create-invalidation --distribution-id E2IMWXGWRO29FC --paths '/*'
