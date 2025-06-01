import { useVPCQuery } from '@linode/queries';
import { Button, Typography } from '@linode/ui';
import { Grid } from '@mui/material';
import React from 'react';
import { makeStyles } from 'tss-react/mui';

import {
  StyledGridContainer,
  StyledLabelTypography,
  StyledValueGrid,
} from '../DatabaseSummary/DatabaseSummaryClusterConfiguration.style';

import type { Database } from '@linode/api-v4';
import type { Theme } from '@mui/material';

interface Props {
  database: Database;
  disabled?: boolean;
}

export const DatabaseManageNetworking = ({ database }: Props) => {
  const useStyles = makeStyles()((theme: Theme) => ({
    manageNetworkingBtn: {
      minWidth: 225,
      [theme.breakpoints.down('md')]: {
        alignSelf: 'flex-start',
        marginBottom: '1rem',
      },
    },
    sectionText: {
      marginBottom: '1rem',
      marginRight: 0,
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
      width: '65%',
    },
    sectionTitle: {
      marginBottom: '0.25rem',
    },
    sectionTitleAndText: {
      width: '100%',
    },
    table: {
      border: `solid 1px ${theme.borderColors.borderTable}`,
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
      width: '50%',
    },
    topSection: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
      },
    },
    provisioningText: {
      font: theme.font.normal,
      fontStyle: 'italic',
    },
  }));

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
      <div className={classes.topSection}>
        <div className={classes.sectionTitleAndText}>
          <div className={classes.sectionTitle}>
            <Typography variant="h3">Manage Networking</Typography>
          </div>
          <Typography sx={{ maxWidth: '500px' }}>
            Update access settings or the VPC assignment.
            <br />
            Note that a change of VPC assignment settings can disrupt service
            availability. Avoid writing data to the database while a change is
            in progress.
          </Typography>
        </div>
        <Button
          buttonType="outlined"
          className={classes.manageNetworkingBtn}
          disabled={true} // Disabled until manage networking is fully implemented
          onClick={() => null}
        >
          Manage Networking
        </Button>
      </div>

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
              <Typography>{`${currentSubnet?.label} (${currentSubnet?.ipv4})`}</Typography>
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
