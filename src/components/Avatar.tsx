import React, { useState } from "react";
import { Box } from 'grommet';
import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
import { Spinner } from "./Spinner";

const RandomAvatar = (props: { alt: string }) => {
    const avatar = useMemo(() => {
        return createAvatar(botttsNeutral, {
            size: 128,
            seed: props.alt
        }).toDataUriSync();
    }, []);

    return <img
        src={avatar}
        alt={props.alt}
        style={{
            maxWidth: "100%",
            // width: "200px" 
            maxHeight: '140px',
            height: '100%'
        }}
    />;
}

interface IAvatarProps {
    href: string;
    srcUrl: string;
    hasLogo: boolean;
    alt: string;
}

export const Avatar = (props: IAvatarProps) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [loadedWithError, setLoadedWithError] = useState(false);

    return <Box>
        <a
            href={props.href}
            target="_blank"
            style={{
                maxWidth: "100%",
                // width: "200px" 
                maxHeight: '140px',
                height: '100%'
            }}
        >
            {props.hasLogo && !imageLoaded && !loadedWithError ?
                <Box width="140px" align="center" justify="center">
                    <Spinner />
                </Box>
                : null}
            {props.hasLogo && !loadedWithError ?
                <img
                    src={props.srcUrl}
                    alt="validator avatar"
                    style={{
                        maxWidth: "100%",
                        // width: "200px" 
                        maxHeight: '140px',
                        height: '100%'
                    }}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setLoadedWithError(true)}
                /> : null}
            {!props.hasLogo || loadedWithError ?
                <RandomAvatar alt={props.alt} /> : null}
        </a>
    </Box>

}