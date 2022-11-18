import Head from "next/head";
import Link from "next/link";
import HeadBar from "../components/HeadBar";
import Center from "../components/Center";
import * as React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from "@mui/material";
function Index(): JSX.Element {
    interface page {
        name: string,
        to: string
    }
    const pages: page[] = [
        {
            name: "AudioTools",
            to: "audiotools"
        },
        {
            name: "CountLetter",
            to: "countletter"
        },
        {
            name: "BigTime",
            to: "bigtime"
        },
        {
            name: "π计算器",
            to: "pi"
        },
        {
            name: "翻转",
            to: "reversal"
        },
        {
            name: "掷骰子",
            to: "shaizi"
        },
    ];
    return (
        <>
            <Head>
                <title>NeilaTools</title>
            </Head>
            <HeadBar isIndex={true} pageName="NeilaTools" />
            <Center>
                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <nav aria-label="main linkbox folders">
                        <List>
                            {pages.map((page) => {
                                return (
                                    <ListItem key={page.to} disablePadding>
                                        <ListItemButton>
                                            <Link href={page.to}>
                                                <ListItemText primary={page.name} />
                                            </Link>
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </nav>

                </Box>
            </Center>
        </>
    );
}
export default Index;