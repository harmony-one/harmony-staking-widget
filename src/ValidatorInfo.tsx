import React, { useEffect, useState } from "react";
import { StakingAPI, IValidatorFull, NETWORK_TYPE } from "harmony-staking-sdk";
import { calculateUniqueDelegators, convertToONE } from "./utils";
import { Box, Text } from 'grommet';
import { Link, ValueItem } from "./components";

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
        return <div>Loading...</div>;
    }

    return (
        <Box pad="medium">
            <Box direction="row" gap="30px" align="center">
                <Box>
                    <img
                        src={stakingApi.getValidatorAvatarUrl(
                            NETWORK_TYPE.MAINNET,
                            validatorInfo.address
                        )}
                        alt="validator avatar"
                        style={{ maxWidth: "100%", width: "140px" }}
                    />
                </Box>

                <Box direction="column" align="start" gap="5px">
                    <Text weight="bold">{validatorInfo.name}</Text>
                    {/* <Text>Desciption: {validatorInfo.details}</Text> */}

                    {/* <Text>Address: {validatorInfo.address}</Text> */}
                    <Text>
                        Total Stake:{' '}
                        <ValueItem>{convertToONE(validatorInfo.total_stake)} ONE</ValueItem>
                    </Text>
                    <Text>
                        Self Stake:{' '}
                        <ValueItem>{convertToONE(validatorInfo.self_stake)} ONE</ValueItem>
                    </Text>
                    <Text>
                        Total Delegators:{' '}
                        <ValueItem>{calculateUniqueDelegators(validatorInfo.delegations)}</ValueItem>
                    </Text>
                    <Text>
                        Website:{' '}
                        <Link
                            href={validatorInfo.website}
                            target="_blank"
                        >
                            {validatorInfo.website}
                        </Link>
                    </Text>
                </Box>
            </Box>
        </Box>
    );
};

export default ValidatorInfo;
