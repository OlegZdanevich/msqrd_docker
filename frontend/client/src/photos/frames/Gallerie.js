import React, {useCallback, useState} from "react";
import Gallery from "react-photo-gallery";
import Carousel, {Modal, ModalGateway} from "react-images";
import {PhotoHeader} from "./HeaderGallerie";

export const Gallerie = props => {
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    const openLightbox = useCallback((event, {photo, index}) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    const setMask=()=>{
        const url=photosData[currentImage];
        props.mask(url.src);
    };

    const photosData = props.photos.map(elem => (
        {
            src: elem.baseUrl,
            width: 4,
            height: 4
        }
    ));


    return (
        <div>
            <Gallery photos={photosData} onClick={openLightbox}/>
            <ModalGateway>
                {viewerIsOpen ? (
                    <Modal onClose={closeLightbox} allowFullscreen={setMask}>
                        <Carousel
                            currentIndex={currentImage}
                            components={{Header: PhotoHeader}}
                            frameProps={{ autoSize: 'height' }}
                            views={photosData.map(x => ({
                                ...x,
                                srcset: x.srcSet,
                                caption: x.title
                            }))}

                        />

                    </Modal>
                ) : null}
            </ModalGateway>
        </div>
    );
};