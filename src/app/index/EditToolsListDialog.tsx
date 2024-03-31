"use client";
import {
    TextField,
    Button,
    ButtonGroup
} from "@mui/material";
import {
    setState
} from '../declare';
import {
    get
} from "react-intl-universal";
import {
    useState
} from "react";
import dynamic from 'next/dynamic';
const PureDialog = dynamic(() => import("../components/dialog/PureDialog"));
import TransferList from "../components/TransferList";
import {
    lists
} from "./Sidebar";
import useToolsList from "./getToolsList";
import {
    getTools
} from "../tools/info";
import setSetting from "../setting/setSetting";
import useReadSetting from "../setting/useReadSetting";
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
        defaultList = [],
        realList = useReadSetting("lists", defaultList),
        [list, setList] = useState<lists>(() => {
            const lists = realList || defaultList;
            return lists;
        }),
        edit = (forList: lists) => forList.some(single => single[0] === dialogListName),
        createOrEdit = !edit(list) ? get("category.创建分类") : get("category.编辑分类"),
        toolsList = useToolsList(getTools(get));
    var right = toolsList.map(atool => atool.name).filter(v => props.left.every(val => val !== v));
    return (
        <PureDialog open={props.open} title={createOrEdit} onClose={() => {
            setDialogTools([]);
            setDialogListName("");
            setDialogOpen(false);
        }}>
            <TextField value={dialogListName} autoFocus margin="dense" label={get("category.分类名称")} fullWidth variant="standard" onChange={event => {
                setDialogListName(event.target.value);
            }} />
            <TransferList left={props.left} right={right} onLeftChange={context => {
                var tos: string[] = [];
                context.forEach(name => tos.push(toolsList.find(fullTool => fullTool.name === name).to));
                setDialogTools(tos);
            }} onRightChange={context => null} />
            <ButtonGroup fullWidth>
                <Button variant="contained" onClick={event => {
                    var listDraft: lists = list.slice(0),
                        index = list.findIndex(singleList => singleList[0] === dialogListName),
                        have: boolean = index !== -1;
                    if (index !== -1) {
                        listDraft[index] = [list[index][0], dialogTools];
                    }
                    if (!have) {
                        listDraft.push([dialogListName, dialogTools]);
                    }
                    setList(listDraft);
                    props.setList(listDraft);
                    setSetting("lists", "集合列表", listDraft);
                    setDialogListName("");
                    setDialogTools([]);
                    return setDialogOpen(false);
                }}>
                    {createOrEdit}
                </Button>
                {edit(list) && <Button variant="outlined" onClick={event => {
                    props.setRemoveDialogOpen(true);
                    setDialogTools([]);
                    return setDialogOpen(false);
                }}>
                    {get("category.删除此分类")}
                </Button>}
            </ButtonGroup>
        </PureDialog>
    );
}
