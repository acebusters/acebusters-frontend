#!/bin/bash

set -e

declare -A lambdas

lambdas["pr-account-service"]="account-service"
lambdas["pr-contract-scanner"]="contract-scanner"
lambdas["pr-event-worker"]="event-worker"
lambdas["pr-inverval-scanner-2"]="interval-scanner"
lambdas["pr-oracle-cashgame"]="oracle"
lambdas["pr-seat-reservation"]="reserve-service"
lambdas["pr-stream-scanner"]="stream-scanner"

for function_name in ${!lambdas[@]}; do
    zip_name=${lambdas[${function_name}]}

    # Update Staging lambda with sandbox snapshot
    aws lambda update-function-code --function-name ${function_name} --s3-bucket builds.acebusters --s3-key staging/${zip_name}.zip

    # Copy staging snapshot as a Production snapshot
    aws s3 cp s3://builds.acebusters/staging/${zip_name}.zip s3://builds.acebusters/production/${zip_name}.zip
done

# Download sandbox frontend snapshot
aws s3 cp s3://builds.acebusters/staging/ab-web-frontend.zip ab-web-frontend.zip
unzip ab-web-frontend.zip -d build_production

# Sync it to s3://staging.acebusters.com/
aws s3 sync build_production/ s3://dapp.acebusters.com/ --delete --acl public-read
rm -r build_production

# Invalidate staging.acebusters.com CloudFront distribution
aws cloudfront create-invalidation --distribution-id E3LJB6X8QH2BTQ --paths '/*'
