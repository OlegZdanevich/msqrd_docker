import React, {Component} from "react";
import {initAlbumDetailsData, loadAlbumDetailsData,setMaskRequest} from "../../util/APIUtils";
import LoadingIndicator from "../../common/LoadingIndicator";
import Button from "react-bootstrap/Button";
import MaskPhoto from "../mask/MaskPhoto";
import {EmptyData, GoogleError} from './Util'
import {Gallerie} from "./Gallerie";

class AlbumPhotoFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            photos: null,
            isError: false,
            nextPageToken: null,
            isLoadingPhotoPart: false,
            maskSet: false,
            id: props.id,
            image: null
        };
        this.initAlbumDetails = this.initAlbumDetails.bind(this);
        this.loadAlbumDetails = this.loadAlbumDetails.bind(this);
        this.setMask = this.setMask.bind(this);
    }

    initAlbumDetails() {
        this.setState({
            loading: true
        });
        initAlbumDetailsData(this.state.id)
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


    loadAlbumDetails() {
        this.setState({
            isLoadingPhotoPart: true
        });
        loadAlbumDetailsData(this.state.id, this.state.nextPageToken)
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
        this.initAlbumDetails();
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
                return <MaskPhoto image={this.state.image}/>
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
                                            onClick={this.loadAlbumDetails}>
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


export default AlbumPhotoFrame