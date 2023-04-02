import React, { useEffect, useState } from "react";
import { Box, Text } from 'grommet';

export const ValueItem = ({ children }: any) => {
    return <Text weight="bold">
        {children}
    </Text>
}

export const Link = (
    props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
) => {
    return <a {...props} style={{ color: "#00ade8", overflowWrap: "anywhere" }}>
        {props.children}
    </a>
}