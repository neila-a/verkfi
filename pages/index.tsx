import Link from "next/link";
import HeadBar from "../components/HeadBar";
import Center from "../components/Center";
import * as React from 'react';
import {
    Stack,
    Paper
} from "@mui/material";
import { styled } from '@mui/material/styles';
/**
 * 被包装的`Paper`
 * @param {React.ReactNode} children 子节点
 */
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
interface page {
    name: string,
    to: string
}
export const pages: page[] = [
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
    {
        name: "滤镜",
        to :"filter"
    }
];
export default function Index(): JSX.Element {
    return (
        <>
            <HeadBar isIndex={true} pageName="NeilaTools" />
            <br />
            <Center>
                <Stack spacing={5}>
                    {pages.map((page) => (
                        <Item key={page.to}>
                            <Link href={page.to} style={{
                                textDecoration: "none",
                                color: "#1976d2"
                            }}>{page.name}</Link>
                        </Item>
                    ))}
                </Stack>
            </Center>
        </>
    );
};