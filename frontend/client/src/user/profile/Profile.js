import React, {Component} from 'react';
import Form from 'react-bootstrap/Form'
import './Profile.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import {loadAllAlbums, updateAlbum,cerateAlbum} from "../../util/APIUtils";
import LoadingIndicator from "../../common/LoadingIndicator";
import {GoogleError} from '../../photos/frames/Util'

class Profile extends Component {
    constructor(props) {

        super(props);
        this.state = {
            loading: true,
            albums: null,
            isError: false,
            isErrorUpdate: false,
            id: this.props.currentUser.album,
            currentUser: this.props.currentUser
        };
        this.loadAlbums = this.loadAlbums.bind(this);
        this.changeId = this.changeId.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.createAlbum = this.createAlbum.bind(this);
    }

    componentDidMount() {
        this.loadAlbums();
    }

    saveUser() {
        this.setState({
            loading: true
        });
        updateAlbum(this.state.currentUser.id, this.state.id)
            .then(response => {
                this.setState({
                    currentUser: response,
                    loading: false
                });
            }).catch(error => {
            this.setState({
                loading: false,
                isErrorUpdate: true
            });
        });
    }

    createAlbum() {
        const title=document.getElementById("album").value;
        if(title !==""){
            this.setState({
                loading: true
            });
            cerateAlbum(title)
                .then(response => {
                    this.loadAlbums()
                }).catch(error => {
                this.setState({
                    loading: false,
                    isErrorUpdate: true
                });
            });
        }
    }

    changeId(e) {
        this.setState({
            id: e.target.value
        })
    }


    loadAlbums() {
        this.setState({
            loading: true
        });
        loadAllAlbums()
            .then(response => {
				if(response.albums === undefined){
					this.setState({
						albums: [],
						loading: false
                }	);
				}
				else{
					this.setState({
						albums: response.albums,
						loading: false
                }	);
				}

            }).catch(error => {
            this.setState({
                loading: false,
                isError: true
            });
        });
    }

    render() {
        if (this.state.loading) {
            return <LoadingIndicator/>
        } else {
            if (this.state.isError === true) {
                return <GoogleError/>;
            }
            const rowStyle = {
                padding: '5% 0'
            };
			

            return (
                <div className="profile-container">
                    <div className="container">
                        <div className="profile-info">
                            <div className="profile-avatar">
                                {
                                    this.state.currentUser.imageUrl ? (
                                        <img src={this.state.currentUser.imageUrl} alt={this.state.currentUser.email}/>
                                    ) : (
                                        <div className="text-avatar">
                                            <span>{this.state.currentUser.email}</span>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="profile-name">
                                <h2>{this.state.currentUser.name}</h2>
                                <p className="profile-email">{this.state.currentUser.email}</p>
                            </div>
                            <Container>
                                <Row style={rowStyle}>
                                    <Col>
                                        <Form.Label>Default Album</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control as="select" onChange={this.changeId} defaultValue={this.state.id}>
                                            {this.state.albums.map((answer, i) => {
                                                return (<option key={i} value={answer.id}>{answer.title}</option>)
                                            })}
                                        </Form.Control>
                                    </Col>
                                    <Col>
                                        <Button type="submit" onClick={this.saveUser}>Save</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Label>New Album</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" id="album" placeholder="Album"/>
                                    </Col>
                                    <Col>
                                        <Button type="submit" onClick={this.createAlbum}>Create</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>
                </div>
            );
        }

    }
}

export default Profile