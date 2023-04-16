import React, { useEffect, useState } from "react";
import { Box, Button, Text, TextInput, TextInputProps } from 'grommet';
import styled from "styled-components";

export const ValueItem = ({ children }: any) => {
    return <Text weight="bold">
        {children}
    </Text>
}

export const Link = (
    props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
) => {
    return <a {...props} style={{
        color: "#00ade8",
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        maxWidth: "100%"
    }}>
        {props.children}
    </a>
}

interface IMenuBarOption<T> {
    text: string;
    value: T;
}

interface IMenuBarProps<T> {
    options: IMenuBarOption<T>[];
    value: string;
    onClick: (value: T) => void;
}

export const MenuBar = (props: IMenuBarProps<any>) => {
    return <Box direction="row" gap="10px" align="start" fill={true}>
        {
            props.options.map(option => {
                const selected = option.value === props.value;

                return <Button
                    key={option.value}
                    onClick={() => props.onClick(option.value)}
                    style={{
                        background: selected ? "#0c93eb1f" : "transparent",
                        color: '#0a93eb',
                        width: 150,
                        padding: "12px 0px",
                        borderRadius: 5,
                        textAlign: 'center',
                        border: '1px solid #0a93eb'
                    }}
                >
                    <Text size="18px">
                        {option.text}
                    </Text>
                </Button>
            })
        }
    </Box>
}

const getWebsiteName = (value: string) => {
    let websiteName = value;

    if (websiteName.indexOf('http://') === 0) {
        websiteName = websiteName.slice(7);
    }

    if (websiteName.indexOf('https://') === 0) {
        websiteName = websiteName.slice(8);
    }

    if (websiteName.indexOf('www.') === 0) {
        websiteName = websiteName.slice(4);
    }

    // if (websiteName.indexOf('w') === -1) {
    //     if (websiteName.length > 25) {
    //         websiteName = websiteName.slice(0, 25) + '...';
    //     }
    // } else {
    //     if (websiteName.length > 18) {
    //         websiteName = websiteName.slice(0, 18) + '...';
    //     }
    // }

    return websiteName;
}

const getWebsiteUrl = (value: string) => {
    let websiteUrl = value;

    if (websiteUrl.includes('http://') || websiteUrl.includes('https://')) {
        return websiteUrl;
    }

    return 'https://' + websiteUrl;
}

export const Website = ({ website }: any) => {
    const websiteUrl = getWebsiteUrl(website);
    const websiteName = getWebsiteName(website);

    return <Text style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        maxWidth: 260
    }}>
        {websiteName.length < 20 ? "Website: " : ""}
        <Link
            href={websiteUrl}
            target="_blank"
        >
            {websiteName}
        </Link>
    </Text>
}

export const getLinkToStaking = (address: string) => {
    return `https://staking.harmony.one/validators/mainnet/${address}`
}

export const Label = (props: { value: string; onClick: () => void }) => {
    return <Box
        style={{
            cursor: 'pointer'
        }}
        onClick={() => props.onClick()}
    >
        <Text color="#0c93eb" size="16px">
            {props.value}
        </Text>
    </Box>
}

export const ExtendedInput: React.FC<TextInputProps & { max?: string }> = (props) => {
    return <Box
        direction="row"
        fill={true}
        align="center"
        style={{
            borderRadius: 5,
            border: "1px solid rgba(0,0,0,0.33)",
            height: "47px"
        }}
    >
        <TextInput
            plain
            focusIndicator={false}
            {...props}
        />
        <Button
            style={{
                textAlign: 'right',
                padding: "0px 11px",
                minWidth: "122px",
                maxWidth: "122px",
                display: "block",
                boxSizing: "content-box"
            }}>
            <Text
                color="#0c93eb"
                size="16px"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    if (props.onChange && props.max) {
                        props.onChange({ target: { value: props.max } } as any)
                    }
                }}
            >
                {`Max ${props.max} ONE`}
            </Text>
        </Button>
    </Box>
}

export const Input = styled(ExtendedInput)`
    ::-webkit-inner-spin-button{
        -webkit-appearance: none; 
        margin: 0; 
    }
    ::-webkit-outer-spin-button{
        -webkit-appearance: none; 
        margin: 0; 
    } 

    height: 45px;
`;