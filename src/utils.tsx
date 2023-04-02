import { IDelegation, zeroDecimals } from "harmony-staking-sdk";

export const convertToONE = (amount: number) => {
    return zeroDecimals(amount / 1e18);
};

export const calculateUniqueDelegators = (delegations: IDelegation[]) => {
    const delegatorsObj = {} as any;

    delegations.forEach((item) => delegatorsObj[item["delegator-address"]] = true);

    return Object.keys(delegatorsObj).length;
}