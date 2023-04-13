import React from "react";
import ValidatorInfo from './ValidatorInfo';
import StakingBlock from './StakingBlock';
import { Box } from 'grommet';

export const Widget = ({ validator }: { validator: string }) => {
    return (
        <Box direction="column" style={{ maxWidth: "100%" }} gap="20px">
            <ValidatorInfo validatorAddress={validator} />
            <StakingBlock validatorAddress={validator} />
        </Box>
    );
}
