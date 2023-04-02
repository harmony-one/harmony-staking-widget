import React from "react";
import ValidatorInfo from './ValidatorInfo';
import StakingBlock from './StakingBlock';
import { Box } from 'grommet';

export const Widget = ({ validator }: { validator: string }) => {
    return (
        <Box direction="column" width="650px" style={{ maxWidth: "100%" }}>
            <ValidatorInfo validatorAddress={validator} />
            <StakingBlock validatorAddress={validator} />
        </Box>
    );
}
