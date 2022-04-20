#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AWS_ACCOUNT_ID, AWS_REGION, STACK_NAME } from '../lib/params';
import { RocketpoolAwsInfraStack } from '../lib/rocketpool-aws-infra-stack';

const app = new cdk.App();
new RocketpoolAwsInfraStack(app, STACK_NAME, {
    env: {
        region: AWS_REGION,
        account: AWS_ACCOUNT_ID
    }
});
