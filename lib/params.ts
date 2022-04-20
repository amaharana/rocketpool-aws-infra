export const STACK_NAME = 'RocketpoolAwsInfraStack';
export const STACK_RESOURCE_PREFIX = 'rocketpool';
export const AWS_ACCOUNT_ID = '';
export const AWS_REGION = 'us-west-2';

// https://ubuntu.com/server/docs/cloud-images/amazon-ec2
// Ubuntu, 20.04 LTS
export const LINUX_AMI_ID = 'ami-0974095049096f83a';

// https://davidagood.com/aws-ec2-cdk-specify-root-volume-size/
// Volume label for AMI ID mentioned above, and size to configure
export const VOLUME_LABEL = '/dev/sda1';
export const VOLUME_SIZE_GB = 250;
