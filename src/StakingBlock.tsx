import React, { useState, useEffect, useCallback } from "react";
import { Box } from 'grommet';
import Web3 from "web3";
import { StakingContract, StakingAPI, NETWORK_TYPE } from "harmony-staking-sdk";
import { DelegationBlock } from "./components/DelegationBlock";
import { MenuBar } from "./components";
import { UnDelegationBlock } from "./components/UnDelegationBlock";

export enum ACTION_TYPE {
    DELEGATION = 'DELEGATION',
    UNDELEGATION = 'UNDELEGATION',
}

const stakingApi = new StakingAPI({
    apiUrl: "https://api.stake.hmny.io",
});

const StakingBlock = ({ validatorAddress }: { validatorAddress: string }) => {
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [stakingContract, setStakingContract] = useState<StakingContract | null>(null);
    const [balance, setBalance] = useState('');
    const [action, setAction] = useState(ACTION_TYPE.DELEGATION)
    const [delegated, setDelegated] = useState<string>('');

    const loadBalance = async () => {
        if (web3 && account) {
            const b = await web3.eth.getBalance(account);
            setBalance(b);
            return b;
        }

        return '';
    }

    const getDelegations = async () => {
        if (account) {
            const delegations = await stakingApi.fetchDelegationsByAddress(
                NETWORK_TYPE.MAINNET,
                account
            );

            delegations.forEach(d => {
                if (d.validatorAddress === validatorAddress) {
                    setDelegated(String(d.delegationAmount));
                }
            })
        }
    }

    useEffect(() => {
        getDelegations();
    }, [validatorAddress, account]);

    useEffect(() => {
        loadBalance();
    }, [web3, account])

    const accountsChanged = (accounts: string[]) => {
        if (accounts.length) {
            setAccount(accounts[0]);
            localStorage.setItem('staking-widtget', JSON.stringify({ metamaskAuthorised: true }));
        } else {
            setAccount('');
            localStorage.setItem('staking-widtget', JSON.stringify({ metamaskAuthorised: false }));
        }
    }

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

            //@ts-ignore
            window.ethereum.on('accountsChanged', accountsChanged);
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

            const localStorageString = localStorage.getItem('staking-widtget');
            if (localStorageString) {
                const { metamaskAuthorised } = JSON.parse(localStorageString);

                if (metamaskAuthorised) {
                    getAccount();
                }
            }
        }
    }, [web3]);

    const getAccount = async () => {
        //@ts-ignore
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(accountsChanged)
    };

    if (!account) {
        return <Box
            align="center"
            justify="center"
            style={{
                border: "1px solid rgb(207, 217, 222)",
                borderRadius: "12px"
            }}
            pad="small"
            gap="10px"
            onClick={getAccount}
        >
            Please connect your metamask wallet to delegate tokens
            <img
                src="https://1.country/images/metamaskFox.svg"
                width="60px"
                height="60px"
            />
        </Box>
    }

    return (
        <Box
            direction="column"
            gap="20px"
            align="end"
        >
            <MenuBar
                options={[
                    { text: "Delegate", value: ACTION_TYPE.DELEGATION },
                    { text: "Undelegate", value: ACTION_TYPE.UNDELEGATION },
                ]}
                value={action}
                onClick={(value) => setAction(value)}
            />

            {action === ACTION_TYPE.DELEGATION && <DelegationBlock
                validatorAddress={validatorAddress}
                web3={web3}
                balance={balance}
                stakingContract={stakingContract}
                account={account}
                onSuccess={() => {
                    loadBalance();
                    getDelegations();
                }}
            />
            }

            {action === ACTION_TYPE.UNDELEGATION && <UnDelegationBlock
                validatorAddress={validatorAddress}
                web3={web3}
                balance={delegated}
                stakingContract={stakingContract}
                account={account}
                onSuccess={() => {
                    loadBalance();
                    getDelegations();
                }}
            />
            }
        </Box>
    );
};

export default StakingBlock;