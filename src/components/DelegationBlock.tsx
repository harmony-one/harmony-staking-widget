import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Text } from 'grommet';
import Web3 from "web3";
import { StakingContract } from "harmony-staking-sdk";
import { Input, Label, Link } from ".";
import { convertToONE } from "../utils";

const MIN_AMOUNT = 100;

interface IDelegationProps {
    web3: Web3 | null;
    stakingContract: StakingContract | null;
    balance: string;
    account: string;
    validatorAddress: string;
    onSuccess: () => void;
}

export const DelegationBlock = (props: IDelegationProps) => {
    const { web3, stakingContract, balance, account, validatorAddress } = props;

    const [delegationAmount, setDelegationAmount] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [txHash, setTxHash] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    const [isTouched, setIsTouched] = useState(false);

    // useEffect(() => {
    //     if (+balance/1e18 < MIN_AMOUNT) {
    //         setDelegationAmount(convertToONE(+balance - 2*1e18))
    //     }
    // }, [balance]);

    useEffect(() => {
        if (isTouched && +delegationAmount < MIN_AMOUNT) {
            // setError(`Amount must be more than ${MIN_AMOUNT}`);
            setError(`Minimum amount for delegation ${MIN_AMOUNT} ONE`);
            return;
        }

        if (account && web3 && balance !== '') {
            const balanceONE = convertToONE(+balance);

            if (+delegationAmount > +balanceONE) {
                setError(`Amount must be less than ${convertToONE(+balance - 2 * 1e18)} ONE`);
                return;
            }
        }

        setError('');
    }, [delegationAmount, account, web3, balance, isTouched])

    const handleDelegate = async () => {
        if (!web3) {
            setError('Web3 wallet not connected');
            return;
        }

        if (!stakingContract) {
            setError("Staking contract not initialized");
            return;
        }

        try {
            const balanceONE = convertToONE(+balance);

            if (+delegationAmount > (+balanceONE - 2)) {
                throw new Error(`Amount must be less than ${convertToONE(+balance - 2 * 1e18)} ONE`);
            }

            if (+delegationAmount < MIN_AMOUNT) {
                throw new Error(`Minimum amount for delegation ${MIN_AMOUNT} ONE`);
            }

            setLoading(true);
            setSuccess(false);
            setTxHash('');
            setError('');

            const tx = await stakingContract.delegate(
                validatorAddress,
                delegationAmount,
                (txHash) => {
                    // setLoading(false);
                    setTxHash(txHash);
                }
            );

            setSuccess(true);
            setLoading(false);
            props.onSuccess();

            console.log("Delegate transaction confirmed:", tx);
        } catch (err) {
            setError(err?.message);
            setLoading(false);
        }
    };

    return (
        <Box
            direction="column"
            gap="20px"
            align="end"
            fill={true}
        >
            <Box
                direction="row"
                justify="between"
                align="end"
                fill={true}
                gap="10px"
            >
                <Input
                    type="number"
                    min={MIN_AMOUNT}
                    placeholder="Amount"
                    value={delegationAmount}
                    disabled={loading}
                    onChange={(e) => setDelegationAmount(e.target.value)}
                    onBlur={() => setIsTouched(true)}
                    max={convertToONE(+balance - 2 * 1e18)}
                    // max="100000000"
                />
                <Button
                    onClick={handleDelegate}
                    disabled={loading}
                    style={{
                        background: "#0a93eb",
                        color: 'white',
                        width: 200,
                        height: 47,
                        borderRadius: 5,
                        textAlign: 'center'
                    }}
                >
                    <Text size="18px" margin={{ bottom: "2px" }}>
                        {loading ? 'Delegating' : 'Confirm'}
                    </Text>
                </Button>
            </Box>

            {
                txHash && <Box fill={true} align="start">
                    Transaction Hash:{' '}
                    <Link
                        href={`https://explorer.harmony.one/tx/${txHash}`}
                        target="_blank"
                    >
                        <Text>{txHash}</Text>
                    </Link>
                </Box>
            }
            {
                error && <Box fill={true} align="start">
                    <Text
                        color="red"
                        style={{
                            overflowWrap: "anywhere"
                        }}
                    >
                        {error}
                    </Text>
                </Box>
            }
            {
                success && <Box fill={true} align="start">
                    <Text
                        color="#14a266"
                        style={{
                            overflowWrap: "anywhere"
                        }}
                    >
                        Your tokens have been successfully delegated
                    </Text>
                </Box>
            }
        </Box>
    );
};