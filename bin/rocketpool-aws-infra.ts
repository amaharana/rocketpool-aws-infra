#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { RocketpoolAwsInfraStack } from '../lib/rocketpool-aws-infra-stack';

const app = new cdk.App();
new RocketpoolAwsInfraStack(app, 'RocketpoolAwsInfraStack');
