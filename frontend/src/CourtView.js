import { Box, Container, Button } from "@material-ui/core";
import CourtTabs from "./CourtTabs";
import logo from './logo.png';
import PlayerList from "./PlayerList";
import { Add, Remove } from "@material-ui/icons";
import PlayerInfo from "./PlayerInfo";

const CourtView = props => {
    const { user, users } = props;

    const handleJoinQueue = () => {
        const msg = { type: "action", action: "add-queue", value: user };
        props.wsSend(JSON.stringify(msg));
    };
    const handleLeaveQueue = () => {
        const msg = { type: "action", action: "remove-queue", value: user };
        props.wsSend(JSON.stringify(msg));
    };

    return (<Container maxWidth="sm">
        <h1><center>Open Gym Queue</center></h1>
        <Box display="flex" justifyContent="center" bottom={10}>
            <img src={logo} alt="Queue is empty" />
        </Box>
        {user && (<PlayerInfo
            user={props.user}
            defaultUser={props.defaultUser}
            updateUser={props.updateUser}
        ></PlayerInfo>)}
        <CourtTabs admin={false}></CourtTabs>
        <PlayerList users={users}></PlayerList>
        <Box display="flex" flexDirection="row" justifyContent="center">
            <Box p={1}>
                <Button
                    onClick={handleJoinQueue}
                    color="primary"
                    variant="contained"
                    startIcon={<Add />}
                >
                    Join Queue
                </Button>
            </Box>
            <Box p={1}>
                <Button
                    onClick={handleLeaveQueue}
                    color="secondary"
                    variant="contained"
                    startIcon={<Remove />}
                >
                    Leave Queue
                </Button>
            </Box>
        </Box>
    </Container>);
}
export default CourtView;