import React, {Component} from "react";
import {loadAllAlbums,getCurrentUser,loadPhotoAlbum} from "../../util/APIUtils";
import Form from "react-bootstrap/Form";
import LoadingIndicator from "../../common/LoadingIndicator";
import {GoogleError} from "../frames/Util";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import googleLogo from "../../img/google-logo.png";


class ShareOnGoogle extends Component {
    constructor(props) {
        super(props);
        this.loadAlbums = this.loadAlbums.bind(this);
        this.loadUser=this.loadUser.bind(this);
        this.savePhoto=this.savePhoto.bind(this);
        this.changeId=this.changeId.bind(this);
        this.state = {
            albums: null,
            isError: false,
            id: null,
            currentUser: null
        };
    }

    changeId(e) {
        this.setState({
            id: e.target.value
        })
    }

    savePhoto() {
        console.log(this.state.id,this.props.image);
        loadPhotoAlbum(this.state.id,this.props.image);
        this.props.closeShare();
    }

    loadAlbums() {
        loadAllAlbums()
            .then(response => {
                console.log(response);
                this.setState({
                    albums: response.albums,
                });
            }).catch(error => {
            this.setState({
                isError: true
            });
        });
    }
    loadUser(){
        getCurrentUser()
            .then(response => {
                console.log(response);
                this.setState({
                    currentUser: response,
                    id:response.album
                });
            }).catch(error => {
            this.setState({
                isError: true
            });
        });
    }

    componentDidMount() {
        this.loadAlbums();
        this.loadUser();
    }


    render() {
        console.log(this.state.albums);
        if (this.state.currentUser===null || this.state.albums===null) {
            return <LoadingIndicator/>
        } else {
            if (this.state.isError === true) {
                return <GoogleError/>;
            }
            return (<Container>
                <Row>
                    <Col md={{span: 4, offset: 4}}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Choose Album</Form.Label>
                            <Form.Control as="select" onChange={this.changeId} defaultValue={this.state.id}>
                                {this.state.albums.map((answer, i) => {
                                    return (<option key={i} value={answer.id}>{answer.title}</option>)
                                })}
                            </Form.Control>
                        </Form.Group>
                        <Button variant="outline-primary" type="submit" onClick={this.savePhoto} className="login">
                            <img className="icon"
                                 src={googleLogo}
                                 alt="Google"/>
                            Share it
                        </Button>
                    </Col>
                </Row>
            </Container>)
        }
    }
}

export default ShareOnGoogle