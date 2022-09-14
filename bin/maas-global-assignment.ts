#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MaasGlobalAssignmentStack } from '../lib/maas-global-assignment-stack';

const app = new cdk.App();
new MaasGlobalAssignmentStack(app, 'MaasGlobalAssignmentStack', {});
