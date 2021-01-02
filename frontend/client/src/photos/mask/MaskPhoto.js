import React, {Component} from "react";
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from "react-bootstrap/Button";
import googleLogo from "../../img/google-logo.png";
import ShareOnGoogle from "./ShareOnGoogle";


class MaskPhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shareInGoogle:false
        };
        this.showShare=this.showShare.bind(this);
        this.closeShare=this.closeShare.bind(this);
    }

    showShare(){
        this.setState({
            shareInGoogle:true
        })
    }

    closeShare(){
        this.setState({
            shareInGoogle:false
        })
    }

    render() {
        if(this.state.shareInGoogle===true){
            return <ShareOnGoogle image={this.props.image} closeShare={this.closeShare}/>;
        }
        else {
            const containerStyle = {
                padding: '5%'
            };
            return (
                <Container>
                    <Row style={containerStyle}>
                        <Col md={{span: 6, offset: 3}}><Image src={"data:image/jpeg;base64," + this.props.image}
                                                              fluid/></Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="outline-primary" type="submit" onClick={this.showShare} className="login">
                                <img className="icon"
                                     src={googleLogo}
                                     alt="Google"/>
                                Share it
                            </Button>
                        </Col>
                        <Col>
                            <Button href={"data:image/jpeg;base64," + this.props.image}
                                    download={new Date().toLocaleDateString() + "_" + new Date().toLocaleTimeString('en-GB', {
                                        hour: "numeric",
                                        minute: "numeric"
                                    }) + ".jpg"} variant="outline-primary">Download</Button>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}

export default MaskPhoto