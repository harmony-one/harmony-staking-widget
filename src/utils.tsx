import { IDelegation, zeroDecimals } from "harmony-staking-sdk";

export const convertToONE = (amount: number) => {
    return zeroDecimals(amount / 1e18);
};

export const calculateUniqueDelegators = (delegations: IDelegation[]) => {
    const delegatorsObj = {} as any;

    delegations.forEach((item) => delegatorsObj[item["delegator-address"]] = true);

    return Object.keys(delegatorsObj).length;
}

const language = "en-US"

export function isNotAvailable(value: any) {
    return value === -1 || value === null
}

export function percent(number = 0) {
    if (isNotAvailable(number)) {
        return number
    }

    return (
        new Intl.NumberFormat(language, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Math.round(number * 10000) / 100) + `%`
    )
}