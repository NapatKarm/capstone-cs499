import React, { Component } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 0,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 0,
    backgroundColor: 'rgb(171, 25, 30)',
  },
}))(LinearProgress);

class PopupComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      limit: 0
    }
  }
  componentDidMount(){
    console.log(this.props.businessDetails,"WEEEE")
    this.setState({limit:this.props.businessDetails.limit,counter:this.props.businessDetails.counter})
  }
  closePop = () => {
    console.log("BLEH")
  }
  render() {
    let percent = (this.props.businessDetails.counter/this.props.businessDetails.limit)*100
    if(percent>100) percent = 100;
    return (
      <div className="display-popup">
        <div className="popupHeader">
          <div>
            {this.props.businessDetails.businessname}
          </div>
          <div>
            <IconButton aria-label="refresh" onClick={() => this.props.closePop()} style={{ textAlign: "right" }}>
              <CloseIcon style={{ color: "white" }} />
            </IconButton>
          </div>
        </div>
        <div>{this.props.businessDetails.businessaddr}</div>
        <div className="lineBar">
          <BorderLinearProgress
          variant="determinate" 
          value={percent} 
          />
        </div>
        <div className="lineInfo">
          <div>
            Current Occupants: {this.props.businessDetails.counter}
          </div>
          <div>
            Maximum Capacity: {this.props.businessDetails.limit}
          </div>
        </div>
        
      </div>
    )
  };
}

export default PopupComponent