import React, {Component} from "react";
import {initAlbumsData, loadAlbumsData} from "../../util/APIUtils";
import LoadingIndicator from "../../common/LoadingIndicator";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import {EmptyData, GoogleError} from './Util'

class AlbumsFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            albums: null,
            isError: false,
            nextPageToken: null,
            isLoadingAlbumPart: false,

            viewDetailsFunction: props.viewDetailsFunction
        };
        this.initAlbums = this.initAlbums.bind(this);
        this.loadAlbums = this.loadAlbums.bind(this);
    }

    initAlbums() {
        initAlbumsData()
            .then(response => {
                this.setState({
                    albums: response.albums,
                    nextPageToken: response.nextPageToken,
                    loading: false
                });
            }).catch(error => {
            this.setState({
                loading: false,
                isError: true
            });
        });
    }

    loadAlbums() {
        this.setState({
            isLoadingAlbumPart: true
        });
        loadAlbumsData(this.state.nextPageToken)
            .then(response => {
                const prevAlbums = this.state.albums;
                this.setState({
                    albums: prevAlbums.concat(response.albums),
                    nextPageToken: response.nextPageToken,
                    isLoadingAlbumPart: false
                });
            }).catch(error => {
            this.setState({
                isError: true,
                isLoadingAlbumPart: false
            });
        });
    }



    componentDidMount() {
        this.initAlbums();
    }

    render() {

        if (this.state.loading) {
            return <LoadingIndicator/>
        } else {
            if (this.state.isError === true) {
                return <GoogleError/>;
            }
            if (this.state.albums === undefined) {
                return <EmptyData data={"albums"}/>
            }


            let cardArray = [];
            let cardPortionArray = [];
            this.state.albums.map((album, i) => {
                cardPortionArray.push(<PhotoCard album={album} func={this.state.viewDetailsFunction} i={i}/>);
                if ((i + 1) % 3 === 0 && i !== 0) {
                    cardArray.push(cardPortionArray);
                    cardPortionArray = [];
                }
            });
            if (cardPortionArray.length > 0) {
                cardArray.push(cardPortionArray);
            }
            return (
                <div className="data-container">
                    <div className="data-info">
                        <Container>
                            {
                                cardArray.map((portion, i) => {
                                    return (
                                        <Row key={i}>
                                            {portion[0]}
                                            {portion[1] !== undefined ? portion[1] : ""}
                                            {portion[2] !== undefined ? portion[2] : ""}
                                        </Row>

                                    )
                                })}
                        </Container>

                        <div className="data-container">
                            {this.state.nextPageToken !== undefined ?
                                <Button variant="outline-primary" disabled={this.state.isLoadingAlbumPart}
                                        onClick={this.loadAlbums}>
                                    {this.state.isLoadingAlbumPart ? 'Loading…' : 'Load next'}
                                </Button>
                                : ""}
                        </div>
                    </div>
                </div>
            );
        }

    }
}

const PhotoCard = (props) => {
    return (<Col>
        <Card key={props.i} style={{width: '18rem'}}>
            <Card.Img variant="top" src={props.album.coverPhotoBaseUrl}/>
            <Card.Body>
                <Card.Title>{props.album.title}</Card.Title>
                <Button variant="primary" onClick={() => props.func(props.album.id, props.album.title)}>Details</Button>
            </Card.Body>
        </Card>
    </Col>);
};

export default AlbumsFrame;