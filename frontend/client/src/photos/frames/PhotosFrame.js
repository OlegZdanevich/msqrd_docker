import React, {Component} from "react";
import {initPhotosData, loadPhotosData, setMaskRequest} from "../../util/APIUtils";
import LoadingIndicator from "../../common/LoadingIndicator";
import Button from "react-bootstrap/Button";
import {EmptyData, GoogleError} from './Util'
import {Gallerie} from "./Gallerie";
import MaskPhoto from "../mask/MaskPhoto";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class PhotosFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            photos: null,
            isError: false,
            nextPageToken: null,
            isLoadingPhotoPart: false,
            maskSet: false,
            image: null
        };
        this.initPhotos = this.initPhotos.bind(this);
        this.loadPhotos = this.loadPhotos.bind(this);
        this.setMask = this.setMask.bind(this);
        this.closeMask=this.closeMask.bind(this);
    }

    closeMask(){
        this.setState({
            maskSet:false
        })
    }

    initPhotos() {
        this.setState({
            loading: true
        });
        initPhotosData()
            .then(response => {
                this.setState({
                    photos: response.mediaItems,
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

    setMask(url){
        this.setState({
            maskSet:true,
            loading: true
        });
        setMaskRequest(url)
            .then(response => {
                this.setState({
                    image: response.image,
                    loading: false
                });
            }).catch(error => {
            console.log(error);
            this.setState({
                maskSet:false,
                loading: false,
            });
        });
    }

    loadPhotos() {
        this.setState({
            isLoadingPhotoPart: true
        });
        loadPhotosData(this.state.nextPageToken)
            .then(response => {
                const prevPhotos = this.state.photos;
                this.setState({
                    photos: prevPhotos.concat(response.mediaItems),
                    nextPageToken: response.nextPageToken,
                    isLoadingPhotoPart: false
                });
            }).catch(error => {
            this.setState({
                isError: true,
                isLoadingPhotoPart: false
            });
        });
    }


    componentDidMount() {
        this.initPhotos();
    }


    render() {

        if (this.state.loading) {
            return <LoadingIndicator/>
        } else {
            if (this.state.isError === true) {
                return <GoogleError/>;
            }
            if (this.state.photos === undefined) {
                return <EmptyData data={"photos"}/>
            }
            if(this.state.maskSet === true){
                return (<div>
                    <Container>
                        <Row>
                            <Col xs={11} md={11} lg={11}>
                            </Col>
                            <Col xs={1} md={1} lg={1}>
                                <Button variant="primary" onClick={this.closeMask}>Close</Button>
                            </Col>
                        </Row>
                    </Container>

                    <MaskPhoto image={this.state.image}/>
                </div>)
            }

            const photos = this.state.photos.filter(e => e.mimeType === "image/jpeg");

            return (
                <div className="data-container">
                    <div className="container">
                        <div className="data-info">
                            <Gallerie photos={photos} mask={this.setMask}/>
                            <div className="data-container">
                                {this.state.nextPageToken !== undefined ?
                                    <Button variant="outline-primary" disabled={this.state.isLoadingPhotoPart}
                                            onClick={this.loadPhotos}>
                                        {this.state.isLoadingPhotoPart ? 'Loading…' : 'Load next'}
                                    </Button>
                                    : ""}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

    }
}


export default PhotosFrame