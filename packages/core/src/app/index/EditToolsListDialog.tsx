"use client";
import {
    TextField,
    Button,
    ButtonGroup
} from "@mui/material";
import {
    setState
} from 'declare';
import {
    get
} from "react-intl-universal";
import {
    useContext
} from "react";
import dynamic from 'next/dynamic';
const PureDialog = dynamic(() => import("dialog/Pure"));
import TransferList from "components/TransferList";
import {
    lists
} from "./Sidebar";
import useToolsList from "./getToolsList";
import {
    getTools
} from "tools/info";
import convertExtensionTools from "./convertExtensionTools";
import {
    extensions,
    lists as listsContext
} from "layout/layoutClient";
export default function EditToolsListDialog(props: {
    dialogTools: string[];
    setDialogTools: setState<string[]>;
    setList: setState<lists>;
    dialogListName: string;
    setDialogListName: setState<string>;
    setDialogOpen: setState<boolean>;
    left: string[];
    setRemoveDialogOpen: setState<boolean>;
    open: boolean;
}) {
    const {
        dialogTools, setDialogTools, dialogListName, setDialogListName, setDialogOpen
    } = props,
        usedList = useContext(listsContext),
        list = usedList.value,
        edit = (forList: lists) => forList.some(single => single[0] === dialogListName),
        createOrEdit = !edit(list) ? get("category.创建分类") : get("category.编辑分类"),
        extensionTools = useContext(extensions).value,
        converted = convertExtensionTools(extensionTools),
        toolsList = useToolsList(getTools(get)),
        right = toolsList.concat(converted).filter(atool => atool !== undefined).map(atool => atool.name).filter(v => props.left.every(val => val !== v));
    return (
        <PureDialog action={(
            <ButtonGroup fullWidth>
                <Button variant="contained" onClick={event => {
                    const listDraft: lists = list.slice(0),
                        index = list.findIndex(singleList => singleList[0] === dialogListName),
                        have: boolean = index !== -1;
                    if (index !== -1) {
                        listDraft[index] = [list[index][0], dialogTools];
                    }
                    if (!have) {
                        listDraft.push([dialogListName, dialogTools]);
                    }
                    props.setList(listDraft);
                    usedList.set(listDraft);
                    setDialogListName("");
                    setDialogTools([]);
                    return setDialogOpen(false);
                }}>
                    {createOrEdit}
                </Button>
                {edit(list) && (
                    <Button variant="outlined" onClick={event => {
                        props.setRemoveDialogOpen(true);
                        setDialogTools([]);
                        return setDialogOpen(false);
                    }}>
                        {get("category.删除此分类")}
                    </Button>
                )}
            </ButtonGroup>
        )} open={props.open} title={createOrEdit} onClose={() => {
            setDialogTools([]);
            setDialogListName("");
            setDialogOpen(false);
        }}>
            <TextField value={dialogListName} autoFocus margin="dense" label={get("category.分类名称")} fullWidth onChange={event => {
                setDialogListName(event.target.value);
            }} />
            <TransferList left={props.left} right={right} onLeftChange={context => {
                setDialogTools(context.map(name => toolsList.concat(converted).find(fullTool => fullTool.name === name).to));
            }} onRightChange={context => null} />
        </PureDialog>
    );
}
