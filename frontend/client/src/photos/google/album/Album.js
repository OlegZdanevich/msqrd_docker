import React, {Component} from 'react';
import '../general/Photos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlbumPhotoFrame from "../../frames/AlbumPhotoFrame";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";


class Album extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            title: props.title,
            closeDetailsFunction: props.closeDetailsFunction
        }
    }


    render() {
        return (
            <div className="data-container">
                <div className="container">
                    <div className="data-info">
                        <Container>
                            <Row>
                                <Col xs={11} md={11} lg={11}>
                                    <h1>Album: {this.state.title}</h1>
                                </Col>
                                <Col xs={1} md={1} lg={1}>
                                    <Button variant="primary"
                                            onClick={this.state.closeDetailsFunction}>Return</Button>
                                </Col>
                            </Row>
                        </Container>
                        <AlbumPhotoFrame id={this.state.id}/>
                    </div>
                </div>
            </div>
        );
    }
}


export default Album