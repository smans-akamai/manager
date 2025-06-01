import { useVPCQuery } from '@linode/queries';
import { Button, Typography } from '@linode/ui';
import { Grid } from '@mui/material';
import React from 'react';

import {
  StyledGridContainer,
  StyledLabelTypography,
  StyledValueGrid,
} from '../DatabaseSummary/DatabaseSummaryClusterConfiguration.style';
import { useStyles } from '../DatabaseSummary/DatabaseSummaryConnectionDetails.style';

import type { Database } from '@linode/api-v4';
import type { Theme } from '@mui/material';

interface Props {
  database: Database;
  disabled?: boolean;
}

export const DatabaseManageNetworking = ({ database }: Props) => {
  const { classes } = useStyles();
  const vpcId = Number(database.private_network?.vpc_id);
  const hasVPCConfigured = Boolean(vpcId);
  const gridContainerSize = { lg: 7, md: 10 };
  const gridValueSize = { md: 8, xs: 9 };
  const gridLabelSize = { md: 4, xs: 3 };

  const { data: vpc } = useVPCQuery(vpcId, hasVPCConfigured);

  const currentSubnet = React.useMemo(
    () =>
      vpc?.subnets.find(
        (subnet) => subnet.id === database?.private_network?.subnet_id
      ),
    [vpc]
  );

  const readOnlyHostValue =
    database?.hosts?.standby ?? database?.hosts?.secondary ?? '';

  const readOnlyHost = () => {
    const defaultValue = 'N/A';
    const value = readOnlyHostValue ? readOnlyHostValue : defaultValue;
    return <Typography>{value}</Typography>;
  };

  return (
    <>
      <Grid container justifyContent={'space-between'}>
        <Grid size={9}>
          <Typography variant="h2">Manage Networking</Typography>
          <Typography sx={{ mb: 1, mt: 1, maxWidth: '500px' }}>
            Update access settings or the VPC assignment.
            <br />
            Note that a change of VPC assignment settings can disrupt service
            availability. Avoid writing data to the database while a change is
            in progress.
          </Typography>
        </Grid>
        <Button
          buttonType="outlined"
          disabled={true} // Disabled until manage networking is fully implemented
          sx={(theme: Theme) => ({
            height: '1px',
            minWidth: 225,
            [theme.breakpoints.down('md')]: {
              alignSelf: 'flex-start',
              marginBottom: '1rem',
            },
          })}
          title="Manage Networking"
        >
          Manage Networking
        </Button>
      </Grid>

      <StyledGridContainer container size={gridContainerSize} spacing={0}>
        <Grid size={gridLabelSize}>
          <StyledLabelTypography>Connection Type</StyledLabelTypography>
        </Grid>
        <StyledValueGrid size={gridValueSize}>
          <Typography>{hasVPCConfigured ? 'VPC' : 'Public'}</Typography>
        </StyledValueGrid>
        {hasVPCConfigured ? (
          <>
            <Grid size={gridLabelSize}>
              <StyledLabelTypography>VPC</StyledLabelTypography>
            </Grid>
            <StyledValueGrid size={gridValueSize}>
              <Typography>{vpc?.label}</Typography>
            </StyledValueGrid>
            <Grid size={gridLabelSize}>
              <StyledLabelTypography>Subnet</StyledLabelTypography>
            </Grid>
            <StyledValueGrid size={gridValueSize}>
              {`${currentSubnet?.label} (${currentSubnet?.ipv4})`}
            </StyledValueGrid>
          </>
        ) : null}

        <Grid size={gridLabelSize}>
          <StyledLabelTypography>Host</StyledLabelTypography>
        </Grid>
        <StyledValueGrid size={gridValueSize}>
          <Typography>
            {database.hosts?.primary ? (
              database.hosts?.primary
            ) : (
              <span className={classes.provisioningText}>
                Your hostname will appear here once it is available.
              </span>
            )}
          </Typography>
        </StyledValueGrid>
        <Grid size={gridLabelSize}>
          <StyledLabelTypography>Read-only Host</StyledLabelTypography>
        </Grid>
        <StyledValueGrid size={gridValueSize}>{readOnlyHost()}</StyledValueGrid>
        {hasVPCConfigured ? (
          <>
            <Grid size={gridLabelSize}>
              <StyledLabelTypography>Public Access</StyledLabelTypography>
            </Grid>
            <StyledValueGrid size={gridValueSize}>
              <Typography>
                {database?.private_network?.public_access ? 'Yes' : 'No'}
              </Typography>
            </StyledValueGrid>
          </>
        ) : null}
      </StyledGridContainer>
    </>
  );
};
