import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField
} from "@mui/material";
import { useState } from "react";
export default function MathGen(): JSX.Element {
    var [calcs,setCalcs] = useState();
    return (
        <div>
            <FormGroup>
                <TextField label="上限" type="number" InputLabelProps={{
                    shrink: true,
                }} />
                <TextField label="下限" type="number" InputLabelProps={{
                    shrink: true,
                }} />
                <TextField label="个数" type="number" InputLabelProps={{
                    shrink: true,
                }} />
                <>
                    <FormControlLabel label="全选" control={
                        <Checkbox
                            checked={checked[0] && checked[1]}
                            indeterminate={checked[0] !== checked[1]}
                            onChange={handleChange1}
                        />
                    } />
                    <>
                    {}
                        <FormControlLabel label="Child 2" control={
                            <Checkbox checked={checked[1]} onChange={handleChange3} />
                        } />
                    </>
                </>
            </FormGroup>
        </div>
    );
}