"use client";
import {
    Button,
    ButtonGroup,
    TextField
} from "@mui/material";
import TransferList from "@verkfi/shared/TransferList";
import {
    setState
} from "declare";
import {
    useAtom,
    useAtomValue
} from "jotai";
import {
    convertedExtensionsAtom
} from "@verkfi/shared/atoms/extensions";
import {
    listsAtom
} from "@verkfi/shared/atoms";
import dynamic from "next/dynamic";
import {
    get
} from "react-intl-universal";
import {
    lists
} from "..";
import toolsListAtom from "@verkfi/shared/atoms/toolsList";
const PureDialog = dynamic(() => import("@verkfi/shared/dialog/Pure"));
export default function EditToolsListDialog(props: {
    dialogTools: string[];
    setDialogTools: setState<string[]>;
    dialogListName: string;
    setDialogListName: setState<string>;
    setDialogOpen: setState<boolean>;
    left: string[];
    setRemoveDialogOpen: setState<boolean>;
    open: boolean;
}) {
    const
        {
            dialogTools,
            setDialogTools,
            dialogListName,
            setDialogListName,
            setDialogOpen
        } = props,
        [list, setList] = useAtom(listsAtom),
        edit = (forList: lists) => forList.some(single => single[0] === dialogListName),
        createOrEdit = !edit(list) ? get("category.创建分类") : get("category.编辑分类"),
        incorrect = ["__global__", "__home__"].some(incorrectListName => incorrectListName === dialogListName),
        converted = useAtomValue(convertedExtensionsAtom),
        toolsList = useAtomValue(toolsListAtom),
        right = toolsList.concat(converted).filter(
            atool => atool !== undefined
        ).map(atool => atool.name).filter(v => props.left.every(val => val !== v));
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
                    setList(listDraft);
                    setDialogListName("");
                    setDialogTools([]);
                    return setDialogOpen(false);
                }}>
                    {createOrEdit}
                </Button>
                {edit(list)
                    && <Button variant="outlined" onClick={event => {
                        props.setRemoveDialogOpen(true);
                        setDialogTools([]);
                        return setDialogOpen(false);
                    }}>
                        {get("category.删除此分类")}
                    </Button>
                }
            </ButtonGroup>
        )} open={props.open} title={createOrEdit} onClose={() => {
            setDialogTools([]);
            setDialogListName("");
            setDialogOpen(false);
        }}>
            <TextField value={dialogListName} autoFocus margin="dense" label={get("category.分类名称")} fullWidth onChange={event => {
                setDialogListName(event.target.value);
            }} error={incorrect} helperText={incorrect && get("index.incorrectCategoryName")} />
            <TransferList left={props.left} right={right} onLeftChange={context => {
                setDialogTools(context.map(name => toolsList.concat(converted).find(fullTool => fullTool.name === name).to));
            }} onRightChange={context => null} />
        </PureDialog>
    );
}
