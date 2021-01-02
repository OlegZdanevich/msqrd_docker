import React, {Component} from 'react';
import './Photos.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AlbumsFrame from "../../frames/AlbumsFrame";
import PhotosFrame from "../../frames/PhotosFrame";
import Album from "../album/Album";


class Photos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            albumsDetails: false,
            currentAlbumID: "",
            currentAlbumTitle: ""
        };
        this.viewDetails = this.viewDetails.bind(this);
        this.closeDetails = this.closeDetails.bind(this);
    }

    viewDetails(currentAlbumID, currentAlbumTitle) {
        this.setState({
            albumsDetails: true,
            currentAlbumID: currentAlbumID,
            currentAlbumTitle: currentAlbumTitle
        })
    }

    closeDetails() {
        this.setState({
            albumsDetails: false,
            currentAlbumID: "",
            currentAlbumTitle: ""
        })
    }


    render() {
        if (this.state.albumsDetails === true) {
            return (
                <div className="data-container">
                    <div className="container">
                        <div className="data-info">
                            <Album id={this.state.currentAlbumID} title={this.state.currentAlbumTitle}
                                   closeDetailsFunction={this.closeDetails}/>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="data-container">
                <div className="container">
                    <div className="data-info">
                        <h1>Albums</h1>
                        <AlbumsFrame viewDetailsFunction={this.viewDetails}/>
                    </div>
                    <hr/>
                    <div className="data-info">
                        <h1>Photos</h1>
                        <PhotosFrame/>
                    </div>
                </div>
            </div>
        );
    }
}


export default Photos