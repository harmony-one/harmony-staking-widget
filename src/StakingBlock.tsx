import React, { useState, useEffect } from "react";
import { Box, Button, TextInput, Text } from 'grommet';
import Web3 from "web3";
import { StakingContract } from "harmony-staking-sdk";
import { convertToONE } from "./utils";
import { Link } from "./components";

const MIN_AMOUNT = 100;

const StakingBlock = ({ validatorAddress }: { validatorAddress: string }) => {
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [stakingContract, setStakingContract] = useState<StakingContract | null>(null);
    const [delegationAmount, setDelegationAmount] = useState<string>(String(MIN_AMOUNT));
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [txHash, setTxHash] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [balance, setBalance] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    const loadBalance = async () => {
        if (web3 && account) {
            const b = await web3.eth.getBalance(account);
            setBalance(b);
            return b;
        }

        return '';
    }

    useEffect(() => {
        loadBalance();
    }, [web3, account])

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

    useEffect(() => {
        const initializeWeb3 = async () => {
            //@ts-ignore
            if (window.ethereum) {
                //@ts-ignore
                const web3 = new Web3(window.ethereum);
                try {
                    //@ts-ignore
                    // await window.ethereum.enable();
                    setWeb3(web3);
                } catch (error) {
                    console.error(error);
                }
                //@ts-ignore
            } else if (window.web3) {
                //@ts-ignore
                setWeb3(new Web3(window.web3.currentProvider));
            } else {
                console.error("No Web3 provider detected");
            }
        };
        initializeWeb3();
    }, []);

    useEffect(() => {
        if (web3) {
            const initializeStakingContract = async () => {
                const stakingContract = new StakingContract({
                    provider: web3.currentProvider as any,
                });
                setStakingContract(stakingContract);
            };
            initializeStakingContract();
        }
    }, [web3]);

    const getAccount = async () => {
        if (web3) {
            const [account] = await web3.eth.getAccounts();
            setAccount(account);
        }
    };

    const handleDelegate = async () => {
        if (!web3) {
            setError('Web3 not initilized');
            return;
        }

        if (!stakingContract) {
            setError("Staking contract not initialized");
            return;
        }

        try {
            if (!account) {
                //@ts-ignore
                await window.ethereum.enable();
                await getAccount();
            }

            const balance = await loadBalance() as any;
            const balanceONE = convertToONE(+balance);

            if (+delegationAmount > +balanceONE) {
                throw new Error(`Amount must be less than ${convertToONE(+balance)} ONE`);
            }

            if (+delegationAmount < MIN_AMOUNT) {
                throw new Error(`Amount must be more than ${MIN_AMOUNT}`);
            }

            setLoading(true);
            setSuccess(false);
            setTxHash('');
            setError('');

            const tx = await stakingContract.delegate(
                validatorAddress,
                web3.utils.toWei(delegationAmount.toString(), 'ether'),
                (txHash) => {
                    // setLoading(false);
                    setTxHash(txHash);
                }
            );

            setSuccess(true);

            console.log("Delegate transaction confirmed:", tx);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <Box
            direction="column"
            pad="medium"
            gap="10px"
            align="end"
        >
            <Box direction="row" justify="between" fill={true}>
                <Text>
                    Delegation amount (ONE)
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
            <Button
                onClick={handleDelegate}
                disabled={loading}
                style={{
                    background: "#0a93eb",
                    color: 'white',
                    width: 150,
                    padding: "12px 20px",
                    borderRadius: 5,
                    textAlign: 'center'
                }}
            >
                <Text size="18px">
                    {loading ? 'Delegating' : 'Delegate'}
                </Text>
            </Button>
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

export default StakingBlock;