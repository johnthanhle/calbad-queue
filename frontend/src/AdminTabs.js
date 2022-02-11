import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate } from 'react-router-dom';


function LinkTab(props) {
    const navigation = useNavigate();
    return (
        <Tab
            component="a"
            onClick={(event) => {
                navigation.push(event.href)
            }}
            {...props}
        />
    );
}

const AdminTabs = props => {
    return (<Tabs
        variant="scrollable"
        scrollButtons="auto"
    >
        <LinkTab label="Queue" href="/admin" />
        <LinkTab label="Court 1" href="/court1-admin" />
        <LinkTab label="Court 2" href="/court2-admin" />
        <LinkTab label="Court 3" href="/court3-admin" />
        <LinkTab label="Court 4" href="/court4-admin" />
        <LinkTab label="Court 5" href="/court5-admin" />
        <LinkTab label="Court 6" href="/court6-admin" />
    </Tabs>);
}

export default AdminTabs;