"use client";
import {
    TextField,
    Button,
    ButtonGroup
} from "@mui/material";
import {
    setState
} from '../declare';
import I18N from "react-intl-universal";
import {
    useState
} from "react";
import PureDialog from "../components/dialog/PureDialog";
import TransferList from "../components/TransferList";
import {
    lists
} from "./Sidebar";
import checkOption from "../setting/checkOption";
import getToolsList from "./getToolsList";
import {
    getTools
} from "../tools/info";
import setSetting from "../setting/setSetting";
export default function EditToolsListDialog(props: {
    dialogTools: string[];
    setDialogTools: setState<string[]>;
    setList: setState<lists>;
    dialogListName: string;
    setDialogListName: setState<string>;
    setDialogOpen: setState<boolean>;
    left: string[];
    setRemoveDialogOpen: setState<boolean>;
}) {
    const {
        dialogTools, setDialogTools, dialogListName, setDialogListName, setDialogOpen
    } = props,
        edit = (forList: lists) => forList.some(single => single[0] === dialogListName),
        [toolsList, setToolsList] = useState(getToolsList(getTools(I18N)));
    var [list, setList] = useState<lists>(() => {
        const defaultList: lists = [],
            defaultListJSON = JSON.stringify(defaultList),
            realListJSON = checkOption("lists", "集合列表", defaultListJSON),
            lists = realListJSON || defaultListJSON;
        return JSON.parse(lists) as lists;
    }),
        right = toolsList.map(atool => atool.name),
        createOrEdit = !edit(list) ? I18N.get("创建工具列表") : I18N.get("编辑工具列表");
    right = right.filter(v => props.left.every(val => val !== v));
    return (
        <>
            <PureDialog title={createOrEdit} onClose={() => {
                setDialogTools([]);
                setDialogListName("");
                setDialogOpen(false);
            }}>
                <TextField value={dialogListName} autoFocus margin="dense" label={I18N.get("工具列表名称")} fullWidth variant="standard" onChange={event => {
                    setDialogListName(event.target.value);
                }} />
                <TransferList left={props.left} right={right} onLeftChange={context => {
                    var tos: string[] = [];
                    context.forEach(name => {
                        toolsList.forEach(fullTool => {
                            if (fullTool.name === name) {
                                tos.push(fullTool.to);
                            }
                        });
                    });
                    setDialogTools(tos);
                }} onRightChange={context => null} />
                <ButtonGroup fullWidth>
                    <Button variant="contained" onClick={event => {
                        var listDraft: lists = list,
                            have: boolean = false;
                        list.forEach((singleList, index) => {
                            if (singleList[0] === dialogListName) {
                                listDraft[index] = [singleList[0], dialogTools];
                                have = true;
                            }
                        });
                        if (!have) {
                            listDraft.push([dialogListName, dialogTools]);
                        }
                        setList(listDraft);
                        props.setList(listDraft);
                        setSetting("lists", "集合列表", JSON.stringify(listDraft));
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
                        {I18N.get("删除此工具列表")}
                    </Button>}
                </ButtonGroup>
            </PureDialog>
        </>
    );
}