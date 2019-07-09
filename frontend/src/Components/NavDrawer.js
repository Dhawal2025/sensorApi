import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import HomeIcon from "@material-ui/icons/Home";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import TimelineIcon from "@material-ui/icons/Timeline";
import AddIcon from "@material-ui/icons/Add";
import StarIcon from "@material-ui/icons/Stars";
import SettingsIcon from "@material-ui/icons/Settings";
import HelpIcon from "@material-ui/icons/Help";
import FeedbackIcon from "@material-ui/icons/Feedback";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CreditCardIcon from "@material-ui/icons/CreditCard";

const pinkButton = {
    color: "#000",
    backgroundColor: "#880E4F"
};

const blueButton = {
    color: "#000",
    backgroundColor: "#5C6BC0"
};

const yellowButton = {
    color: "#000",
    backgroundColor: "#FFEE58"
};

const greenButton = {
    color: "#000",
    backgroundColor: "#C0CA33"
};

const redButton = {
    color: "#000",
    backgroundColor: "#FF7043"
};

class NavDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
    this.handleClosing = this.handleClosing.bind(this);
    /*
    this.openAdd = this.openAdd.bind(this);
    this.openProfile = this.openProfile.bind(this);
    this.openSend = this.openSend.bind(this);*/
  }

  handleClosing() {
    this.props.onClose("left", false);
  }

  openAdd() {
      console.log("open")
  }

  openSend() {
    console.log("send")
  }

  openProfile() {
    console.log("leader")
  }

  render() {
    return (
      <div>
        <Drawer open={this.props.open} onClose={this.handleClosing}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.handleClosing}
            onKeyDown={this.handleClosing}
          >
            <div>

              <ListItem button onClick={this.openProfile}>
                <ListItemIcon>
                  <Avatar style={greenButton}>
                    <HomeIcon />
                  </Avatar>
                </ListItemIcon>

                <ListItemText primary="Dashboard" />
              </ListItem>


              <ListItem button onClick={this.openAdd}>
                <ListItemIcon>
                  <Avatar style={blueButton}>
                    <AddIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Add Sensor" />
              </ListItem>

              <Divider />
              <Divider />

              <ListItem button>
                <ListItemIcon>
                  <Avatar style={yellowButton}>
                    <SettingsIcon />
                  </Avatar>
                </ListItemIcon>

                <ListItemText primary="Settings" />
              </ListItem>

              <ListItem button>
                <ListItemIcon>
                  <Avatar style={redButton}>
                    <HelpIcon />
                  </Avatar>
                </ListItemIcon>

                <ListItemText primary="Help and Support" />
              </ListItem>

              <ListItem button>
                <ListItemIcon>
                  <Avatar style={pinkButton}>
                    <FeedbackIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Feedback" />
              </ListItem>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default NavDrawer;
