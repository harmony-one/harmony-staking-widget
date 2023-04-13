import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, TextInput, Text } from 'grommet';
import Web3 from "web3";
import { StakingContract } from "harmony-staking-sdk";
import { Link } from ".";
import { convertToONE } from "../utils";

const MIN_AMOUNT = 0;

interface IDelegationProps {
    web3: Web3 | null;
    stakingContract: StakingContract | null;
    balance: string;
    account: string;
    validatorAddress: string;
    onSuccess: () => void;
}

export const UnDelegationBlock = (props: IDelegationProps) => {
    const { web3, stakingContract, balance, account, validatorAddress } = props;

    const [delegationAmount, setDelegationAmount] = useState<string>(String(MIN_AMOUNT));
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [txHash, setTxHash] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    const [isTouched, setIsTouched] = useState(false);

    useEffect(() => {
        if (+delegationAmount < MIN_AMOUNT) {
            setError(`Amount must be more than ${MIN_AMOUNT}`);
            return;
        }

        if (account && web3 && balance !== '') {
            const balanceONE = convertToONE(+balance);

            if (+delegationAmount > +balanceONE) {
                setError(`Amount must be less than ${convertToONE(+balance)} ONE`);
                return;
            }
        }

        setError('');
    }, [delegationAmount, account, web3, balance])

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

            if (+delegationAmount > (+balanceONE)) {
                throw new Error(`Amount must be less than ${convertToONE(+balance)} ONE`);
            }

            if (+delegationAmount < MIN_AMOUNT) {
                throw new Error(`Amount must be more than ${MIN_AMOUNT}`);
            }

            setLoading(true);
            setSuccess(false);
            setTxHash('');
            setError('');

            const tx = await stakingContract.unDelegate(
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

    if (!+balance) {
        return <Box
            align="center"
            justify="center"
            style={{
                border: "1px solid rgb(207, 217, 222)",
                borderRadius: "12px"
            }}
            pad="medium"
            gap="30px"
            fill={true}
        >
            You don't have any tokens delegated for this validator
        </Box>
    }

    return (
        <Box
            direction="column"
            gap="10px"
            align="end"
            fill={true}
        >

            <Box direction="row" justify="between" align="end" fill={true} gap="10px">
                <Box
                    direction="column"
                    gap="10px"
                    align="end"
                    fill={true}
                >
                    <Box direction="row" justify="between" fill={true}>
                        <Text>
                            Amount
                        </Text>
                        <Text>
                            {web3 && account ? `Max ${convertToONE(+balance)} ONE` : ''}
                        </Text>
                    </Box>
                    <TextInput
                        type="number"
                        min={MIN_AMOUNT}
                        placeholder="Enter amount"
                        value={delegationAmount}
                        disabled={loading}
                        onChange={(e) => setDelegationAmount(e.target.value)}
                        onBlur={() => setIsTouched(true)}
                    />
                </Box>
                <Button
                    onClick={handleDelegate}
                    disabled={loading}
                    style={{
                        background: "#0a93eb",
                        color: 'white',
                        width: 200,
                        height: 43,
                        borderRadius: 5,
                        textAlign: 'center'
                    }}
                >
                    <Text size="18px">
                        {loading ? 'Undelegating' : 'Confirm'}
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
                        Your tokens have been successfully undelegated
                    </Text>
                </Box>
            }
        </Box>
    );
};