"use client";
import I18N from 'react-intl-universal';
import {
    Box,
    IconButton
} from "@mui/material";
import {
    Edit as EditIcon
} from "@mui/icons-material";
import {
    Hex,
    setState
} from '../declare';
import {
    useState
} from 'react';
import {
    getTools,
    tool
} from "../tools/info";
import getToolsList from './getToolsList';
import {
    locales
} from '../layoutClient';
import setSetting from '../setting/setSetting';
import Image from 'next/image';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../extendedTools/db';
import SingleSelect from './SingleSelect';
import {
    lists,
    EditToolsListDialog,
    CheckDialog
} from './Sidebar';
export default function Selects(props: {
    list: lists;
    setList: setState<lists>;
    setEditing: setState<boolean>;
    sortingFor: string;
    setSortingFor: setState<string>;
    searchText: string;
    setSearchText: setState<string>;
    setSortedTools: setState<tool[]>;
    setTools: setState<tool[]>;
    editMode: boolean;
    isSidebar?: boolean;
    searchTools(search: string): void;
    modifyClickCount(value: number | "++"): void;
}) {
    const extendedTools = useLiveQuery(() => db.extendedTools.toArray()), convertedExtendedTools: tool[] = extendedTools?.map(single => ({
        name: single.name,
        to: `/extendedTools?id=${single.to}` as Lowercase<string>,
        desc: single.desc,
        icon: () => <Image src={single.icon} alt={single.name} height={24} width={24} />,
        color: single.color as [Hex.Hex, Hex.Hex],
        isGoto: true
    })), {
        list, setList, setTools, searchTools, searchText, setSearchText, sortingFor, setSortingFor, setEditing
    } = props;
    var [dialogOpen, setDialogOpen] = useState<boolean>(false), [dialogTools, setDialogTools] = useState<string[]>([]), [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false), [dialogListName, setDialogListName] = useState<string>("");
    return (
        <Box sx={{
            width: "100%",
            display: Boolean(props.isSidebar) ? "" : "flex",
            justifyContent: "space-evenly"
        }}>
            {([[I18N.get("全部"), getToolsList(getTools(I18N)).map(atool => atool.to)]] as lists).concat(list).map(single => {
                const isAll = Object.values(locales).some(singleLang => {
                    const strings = Object.values(singleLang);
                    let have: boolean = strings.includes(single[0]);
                    return have;
                });
                return (
                    <>
                        <SingleSelect isSidebar={Boolean(props.isSidebar)} sortingFor={sortingFor} searchText={searchText} setEditing={setEditing} key={single[0]} tool={single[0]} onClick={event => {
                            setEditing(true);
                            setSearchText("");
                            searchTools("");
                            let draft: tool[] = [];
                            props.modifyClickCount("++");
                            if (isAll) {
                                draft = getToolsList(getTools(I18N));
                                if (sortingFor !== "__global__") {
                                    props.modifyClickCount(0);
                                }
                                setSortingFor("__global__");
                            } else {
                                draft = single[1].map(toolTo => getToolsList(getTools(I18N)).filter(one => one.to === toolTo)[0]);
                                if (sortingFor !== single[0]) {
                                    props.modifyClickCount(0);
                                }
                                setSortingFor(single[0]);
                            }
                            props.setSortedTools(draft);
                            setTools(draft);
                        }} editButton={(
                            (props.editMode && !isAll) ? <IconButton onClick={event => {
                                setDialogOpen(true);
                                setDialogListName(single[0]);
                            }} sx={{
                                position: "absolute",
                                right: "0"
                            }}>
                                <EditIcon />
                            </IconButton> : <></>
                        )} wantSortingFor={isAll ? "__global__" : single[0]} />
                    </>
                );
            })}
            <SingleSelect isSidebar={Boolean(props.isSidebar)} sortingFor={sortingFor} searchText={searchText} setEditing={setEditing} wantSortingFor="__extended__" tool={I18N.get("扩展工具")} onClick={event => {
                props.modifyClickCount("++");
                if (sortingFor !== "__extended__") {
                    props.modifyClickCount(0);
                }
                setSortingFor("__extended__");
                setEditing(false);
                props.setSortedTools(convertedExtendedTools);
                setTools(convertedExtendedTools);
            }} editButton={<></>} />
            {dialogOpen && <EditToolsListDialog
                dialogTools={dialogTools}
                setDialogTools={setDialogTools}
                dialogListName={dialogListName}
                setDialogListName={setDialogListName}
                setDialogOpen={setDialogOpen}
                setRemoveDialogOpen={setRemoveDialogOpen}
                setList={setList}
                left={(() => {
                    var realLeft: string[] = [];
                    list.forEach(single => {
                        if (single[0] === dialogListName) {
                            single[1].forEach(to => {
                                getToolsList(getTools(I18N)).forEach(tool => {
                                    if (tool.to === to) {
                                        realLeft.push(tool.name);
                                    }
                                });
                            });
                        }
                    });
                    return realLeft;
                })()} />}
            {removeDialogOpen && <CheckDialog
                title={I18N.get("删除此工具列表")}
                description={I18N.get("确定删除此工具列表吗？")}
                onTrue={() => {
                    var listDraft: lists = list;
                    listDraft.forEach(draftSingle => {
                        if (draftSingle[0] === dialogListName) {
                            listDraft.splice(listDraft.indexOf(draftSingle), 1);
                        }
                    });
                    setList(listDraft);
                    setSetting("lists", "集合列表", JSON.stringify(listDraft));
                    setDialogListName("");
                    return setRemoveDialogOpen(false);
                }}
                onFalse={() => {
                    setDialogListName("");
                    return setRemoveDialogOpen(false);
                }} />}
        </Box>
    );
}
