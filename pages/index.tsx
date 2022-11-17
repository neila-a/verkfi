import Head from "next/head";
import HeadBar from "../components/HeadBar";
import * as React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from "@mui/material";
function Index(): JSX.Element {
    const pages = [
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
                <title>NeilaNotes</title>
            </Head>
            <HeadBar isIndex={true} pageName="NeilaNotes" />
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <nav aria-label="main mailbox folders">
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary="Inbox" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary="Drafts" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </nav>
            </Box>
        </>
    );
}
export default Index;