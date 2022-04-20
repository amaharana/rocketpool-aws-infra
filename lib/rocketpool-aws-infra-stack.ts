import { Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { STACK_RESOURCE_PREFIX } from './params';

export class RocketpoolAwsInfraStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = this.getVpc();
    const securityGroup = this.getSecurityGroup(vpc);
    const role = this.getWebserverRole();
    const vpcSubnets = this.getSubnets();
    const instanceType = this.getInstanceType();
    const machineImage = this.getMachineImage();
    const rootVolume = this.getBlockDevice();

    const ec2Instance = new ec2.Instance(this, `${STACK_RESOURCE_PREFIX}-ec2-instance`, {
      vpc,
      vpcSubnets,
      role,
      securityGroup,
      instanceType,
      machineImage,
      blockDevices: [rootVolume],
      keyName: 'ec2-key-pair',
    });
  }

  private getVpc(): ec2.Vpc {
    return new ec2.Vpc(this, `${STACK_RESOURCE_PREFIX}-cdk-vpc`, {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      subnetConfiguration: [
        { name: 'public', cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC },
      ],
    });
  }

  private getBlockDevice(): ec2.BlockDevice {
    return {
      deviceName: '/dev/sda1', // Use the root device name from Step 1
      volume: ec2.BlockDeviceVolume.ebs(250), // Override the volume size in Gibibytes (GiB)
    };
  }

  private getMachineImage(): ec2.IMachineImage {
    return new ec2.GenericLinuxImage({
      // https://ubuntu.com/server/docs/cloud-images/amazon-ec2
      'us-west-2': 'ami-0974095049096f83a'
    })
  }
  private getInstanceType(): ec2.InstanceType {
    return ec2.InstanceType.of(
      ec2.InstanceClass.T2,
      ec2.InstanceSize.XLARGE
    )
  }

  private getSubnets(): ec2.SubnetSelection {
    return { subnetType: ec2.SubnetType.PUBLIC }
  }

  private getSecurityGroup(vpc: ec2.Vpc): ec2.SecurityGroup {
    const webserverSG = new ec2.SecurityGroup(this, `${STACK_RESOURCE_PREFIX}-webserver-sg`, {
      vpc,
      allowAllOutbound: true
    })

    webserverSG.addIngressRule(
      // TODO: lock it down to home IP
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'allow SSH access from anywhere'
    );

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(30303),
      'ETH1 P2P TCP'
    )

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.udp(30303),
      'ETH1 P2P UDP'
    )

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(9001),
      'ETH2 P2P TCP'
    )

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.udp(9001),
      'ETH2 P2P UDP'
    )

    return webserverSG;
  }

  private getWebserverRole(): iam.Role {
    return new iam.Role(this, `${STACK_RESOURCE_PREFIX}-webserver-role`, {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: []
    });
  }
}
