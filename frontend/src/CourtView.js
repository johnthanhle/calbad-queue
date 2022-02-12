import { Box, Container, Button } from "@material-ui/core";
import CourtTabs from "./CourtTabs";
import logo from "./logo.png";
import PlayerList from "./PlayerList";
import { Add, Remove } from "@material-ui/icons";
import PlayerInfo from "./PlayerInfo";

const CourtView = (props) => {
  const { user, users } = props;

  const handleJoinQueue = () => {
    const msg = { type: "action", action: "add-queue", value: user };
    props.wsSend(JSON.stringify(msg));
  };
  const handleLeaveQueue = () => {
    const msg = { type: "action", action: "remove-queue", value: user };
    props.wsSend(JSON.stringify(msg));
  };

  return (
    <Container maxWidth="sm">
      <h1>
        <center>Open Gym Queue</center>
      </h1>
      <Box
        display="flex"
        justifyContent="center"
        bottom={10}
        sx={{ p: 2, border: "1px grey" }}
      >
        <img src={logo} alt="Queue is empty" />
      </Box>
      <Box sx={{ p: 2, border: "0.25px dashed grey" }}>
        <h4>
          <strong>Instructions:</strong> <br></br> Please enter all your
          information below by clicking the pencil icon. Once you have entered
          your information, click the black checkbox to confirm. You will not be
          able to join the queue until this has been done. If there is currently
          a challenge court and you want to queue for it, please indicate "Yes"
          in the challenge select box. Lastly, we are sorry if we incorrectly
          pronounce your names.
        </h4>
      </Box>
      {user && (
        <PlayerInfo
          user={props.user}
          defaultUser={props.defaultUser}
          updateUser={props.updateUser}
        ></PlayerInfo>
      )}
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
    </Container>
  );
};
export default CourtView;
