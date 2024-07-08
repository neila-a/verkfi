import {
    atom as createAtom,
    useAtomValue,
    Getter,
    Setter,
    useSetAtom,
    useAtom
} from "jotai";
import {
    atomWithReducer,
    atomWithRefresh
} from "jotai/utils";
import {
    defaultSpeechTime,
    emptyBlobContext,
    NoiseVoiceWatershedWave,
    RecordingStateWithResume,
    secondDivMS,
    SpeechingWatershedWave,
    vibrateTime,
    vibrateTimes
} from "./consts";
import {
    useEffect
} from "react";
import getRecording from "@verkfi/shared/getRecording";
import {
    emptySymbol
} from "@verkfi/shared/reader/atomWithStorage";
import getShortTimeEnergy from "./getShortTimeEnergy";
namespace atoms {
    /**
     * 只有第一个块里才有文件头
     */
    const firstChunk = createAtom(new Blob(emptyBlobContext));
    export namespace selectTime {
        export const total = createAtom(defaultSpeechTime),
            remaining = createAtom(defaultSpeechTime),
            dialogOpen = createAtom(false);
    }
    export namespace warnings {
        export const show = createAtom(false),
            record = createAtom<Record<
                /**
                 * 发生时间
                 */
                number,
                /**
                 * 持续时间
                 */
                number
            >>({
            });
    }
    export namespace mediaRecorder {
        const atom = createAtom<typeof emptySymbol | MediaRecorder>(emptySymbol);
        export function useMediaRecorder() {
            const setAudioFile = useSetAtom(audioFile),
                [usedFirstChunk, setFirstChunk] = useAtom(firstChunk),
                [used, setUsed] = useAtom(atom),
                setHaveTime = useSetAtom(haveTime);
            useEffect(() => {
                if (used === emptySymbol) {
                    getRecording(blob => {
                        setAudioFile(new Blob([blob]));
                    }, async chunk => {
                        // 加载文件头
                        let blob: Blob;
                        if (await usedFirstChunk.text() === emptyBlobContext[0]) {
                            setFirstChunk(chunk);
                            blob = chunk;
                        } else {
                            blob = new Blob([usedFirstChunk, chunk]);
                        }

                        // 解码数据
                        const context = new AudioContext(),
                            decodedBuffer = await context.decodeAudioData(await blob.arrayBuffer()),
                            channelData = decodedBuffer.getChannelData(0),

                            // 计算数据
                            energy = getShortTimeEnergy(channelData),
                            sum = energy.reduce((a, b) => a + b),
                            avg = sum / energy.length,
                            max = energy.toSorted()[energy.length - 1],
                            watershed = max / avg,
                            have = watershed < NoiseVoiceWatershedWave;

                        // 更新状态
                        if (have) {
                            setHaveTime();
                        }
                    }).then(recording => setUsed(recording));
                }
            }, [used]);
            return used;
        }
    }
    const haveTime = atomWithRefresh(() => Date.now());
    export const countdown = createAtom(0),
        audioFile = createAtom<typeof emptySymbol | Blob>(emptySymbol),
        status = createAtom("inactive" as RecordingStateWithResume, async (get, set, update: RecordingStateWithResume, recorder: MediaRecorder) => {
            const bulkUpdate = (action: intervalerIds.intervalUpdateActions) => [intervalerIds.main, intervalerIds.speechTime].map(atom => set(atom, {
                action,
                get,
                set
            })),
                baseStop = () => bulkUpdate("stop");
            function baseStart() {
                set(haveTime);
                bulkUpdate("start");
            }
            if (recorder instanceof MediaRecorder) {
                switch (update) {
                    case "inactive":
                        recorder.stop();
                        baseStop();
                        break;
                    case "paused":
                        recorder.pause();
                        baseStop();
                        break;

                    case "recording":
                        recorder.start(secondDivMS);
                        baseStart();
                        break;
                    case "resume":
                        recorder.resume();
                        baseStart();
                        break;
                }
            }
            return update;
        });
    namespace intervalerIds {
        export type intervalUpdateActions = "start" | "stop";
        const intervalAtom = (intervaler: (get: Getter, set: Setter) => any) => atomWithReducer(0, (old, update: {
            action: intervalUpdateActions;
            get: Getter;
            set: Setter;
        }) => {
            clearInterval(old);
            return update.action === "start" ? setInterval(() => intervaler(update.get, update.set), secondDivMS) as unknown as number : 0;
        });
        export const main = intervalAtom((get, set) => {
            const time = Math.floor((Date.now() - get(haveTime) / secondDivMS));
            if ("vibrate" in window.navigator) {
                if (time > SpeechingWatershedWave) {
                    window.navigator.vibrate(Array(vibrateTimes).fill(vibrateTime));
                    set(warnings.record, {
                        ...get(warnings.record),
                        [get(haveTime)]: time
                    });
                } else {
                    window.navigator.vibrate(0);
                }
            }
            set(countdown, time);
        }),
            speechTime = intervalAtom((get, set) => get(selectTime.remaining) > -1 && set(selectTime.remaining, get(selectTime.remaining) - 1));
    }
    export function useCleanIDsonUnmount() {
        const intervalID = useAtomValue(intervalerIds.main),
            speechTimeIntervalID = useAtomValue(intervalerIds.speechTime);

        // 作为生命周期使用
        useEffect(() => {
            return () => {
                clearInterval(intervalID);
                clearInterval(speechTimeIntervalID);
            };
        }, []);
    }
}
export default atoms;
