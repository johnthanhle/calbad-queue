import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate } from "react-router-dom";

function LinkTab(props) {
  const navigation = useNavigate();
  return (
    <Tab
      onClick={(event) => {
        navigation.push(event.href);
      }}
      {...props}
    />
  );
}

const CourtTabs = () => {
  return (
    <Tabs variant="scrollable" scrollButtons="auto">
      <LinkTab label="Court 1" href="/court1" />
      <LinkTab label="Court 2" href="/court2" />
      <LinkTab label="Court 3" href="/court3" />
      <LinkTab label="Court 4" href="/court4" />
      <LinkTab label="Court 5" href="/court5" />
      <LinkTab label="Court 6" href="/court6" />
    </Tabs>
  );
};

export default CourtTabs;
