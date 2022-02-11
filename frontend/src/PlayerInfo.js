import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import { Edit, CheckBox } from "@material-ui/icons";
import { Box } from "@material-ui/core";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const PlayerInfo = props => {
    const [isEdit, setIsEdit] = useState(false);
    const [userName, setUserName] = useState(props.user.name);
    const [partnerName, setPartnerName] = useState(props.user.partnerName)
    const [badmintonEvent, setBadmintonEvent] = useState(props.user.event || "Doubles");

    const handleSelectChange = (event) => {
        setBadmintonEvent(event.target.value);
    };

    const handleTextBoxUpdate = event => {
        setUserName(event.target.value);
    };

    const handleTextBoxUpdate2 = event => {
        setPartnerName(event.target.value);
    };

    const save = () => {
        const newUser = {};
        Object.assign(newUser, props.user);
        if (userName === undefined || userName.trim().length <= 0) {
            return;
        }
        newUser.name = userName
        if (partnerName && partnerName.trim().length <= 0) {
            newUser.partnerName = undefined;
        } else {
            newUser.partnerName = partnerName;
        }
        newUser.event = badmintonEvent;
        props.updateUser(newUser);
        setIsEdit(false);
    };

    return (
        <Box m={0.4} pt={0.4}>
            {!isEdit && (
                <h4 onClick={() => setIsEdit(true)}>
                    Name: {props.user.name} <br></br> Partner: {props.user.partnerName === props.defaultUser.partnerName ? "" : props.user.partnerName} <br></br> Event: {props.user.event} <Edit fontSize="small" />
                </h4>
            )}
            {isEdit && (
                <div>
                    <TextField
                        value={userName === props.defaultUser.name ? "" : userName}
                        onChange={handleTextBoxUpdate}
                        required={true}
                        label="Name"
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        value={setPartnerName === props.defaultUser.partnerName ? "" : partnerName}
                        onChange={handleTextBoxUpdate2}
                        label="Partner Name"
                        variant="outlined"
                        size="small"
                    />
                    <FormControl
                        variant="outlined"
                        size="small"
                        required={true}
                    >
                        <InputLabel>Event</InputLabel>
                        <Select
                            label="Event"
                            value={badmintonEvent}
                            displayEmpty
                            onChange={handleSelectChange}
                        >
                            <MenuItem value={'Singles'}>Singles</MenuItem>
                            <MenuItem value={'Doubles'}>Doubles</MenuItem>
                        </Select>
                    </FormControl>
                    <CheckBox onClick={save} />
                </div>
            )}
        </Box>
    );
};

export default PlayerInfo;