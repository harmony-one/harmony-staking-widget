import React, { useEffect, useState } from "react";
import { StakingAPI, IValidatorFull, NETWORK_TYPE } from "harmony-staking-sdk";
import { calculateUniqueDelegators, convertToONE, percent } from "./utils";
import { Box, Text } from 'grommet';
import { Link, ValueItem, Website } from "./components";

const stakingApi = new StakingAPI({
    apiUrl: "https://api.stake.hmny.io",
});

const ValidatorInfo = ({ validatorAddress }: { validatorAddress: string }) => {
    const [validatorInfo, setValidatorInfo] = useState<IValidatorFull | null>(
        null
    );

    useEffect(() => {
        const getValidatorInfo = async () => {
            const validator = await stakingApi.fetchValidatorByAddress(
                NETWORK_TYPE.MAINNET,
                validatorAddress
            );
            setValidatorInfo(validator);
        };
        getValidatorInfo();
    }, [validatorAddress]);

    if (!validatorInfo) {
        return <Box
            align="center"
            justify="center"
            style={{
                border: "1px solid rgb(207, 217, 222)",
                borderRadius: "12px"
            }}
            pad="medium"
            gap="30px"
            margin="medium"
        >
            Loading...
        </Box>
    }

    return (
        <Box gap="15px">
            <Text weight="bold">{validatorInfo.name}</Text>
            <Box direction="row" gap="30px" align="center" justify="between" fill={true}>
                <Box>
                    <img
                        src={stakingApi.getValidatorAvatarUrl(
                            NETWORK_TYPE.MAINNET,
                            validatorInfo.address
                        )}
                        alt="validator avatar"
                        style={{ 
                            maxWidth: "100%", 
                            // width: "200px" 
                            maxHeight: '140px',
                            height: '100%'
                        }}
                    />
                </Box>

                <Box direction="column" align="start" gap="5px">
                    {/* <Text>Desciption: {validatorInfo.details}</Text> */}

                    {/* <Text>Address: {validatorInfo.address}</Text> */}
                    <Text>
                        Total Stake:{' '}
                        <ValueItem>{convertToONE(validatorInfo.total_stake)} ONE</ValueItem>
                    </Text>
                    <Text>
                        Expected return:{' '}
                        <ValueItem>{percent(validatorInfo.apr)}</ValueItem>
                    </Text>
                    <Text>
                        Total Delegators:{' '}
                        <ValueItem>{calculateUniqueDelegators(validatorInfo.delegations)}</ValueItem>
                    </Text>
                    <Website website={validatorInfo.website} />
                </Box>
            </Box>
        </Box>
    );
};

export default ValidatorInfo;
