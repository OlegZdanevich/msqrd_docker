import {ACCESS_TOKEN, ACCESS_TOKEN_GOOGLE, USER_API_BASE_URL} from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });
    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }
    if (options.method === "post") {
        headers.append("Access-Control-Allow-Origin", "http://localhost:3000");
    }
    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: USER_API_BASE_URL + "/user/me",
        method: 'GET'
    });
}


export function setMaskRequest(url) {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: USER_API_BASE_URL + "/user/mask",
        method: 'POST',
        body: JSON.stringify({url: url})
    });
}

export function updateAlbum(id, album) {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: USER_API_BASE_URL + "/user/album",
        method: 'POST',
        body: JSON.stringify({id: id, album: album})
    });
}


export function initAlbumsData() {
    return requestToGoogle({
        url: "https://photoslibrary.googleapis.com/v1/albums?pageSize=3",
        method: 'GET'
    });
}

export function loadAlbumsData(token) {
    return requestToGoogle({
        url: "https://photoslibrary.googleapis.com/v1/albums?pageSize=3&pageToken=" + token,
        method: 'GET'
    });
}


export function initPhotosData() {
    return requestToGoogle({
        url: "https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=7",
        method: 'GET'
    });
}


export function loadPhotosData(token) {
    return requestToGoogle({
        url: "https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=7&pageToken=" + token,
        method: 'GET'
    });
}

export function loadAllAlbums() {
    return requestToGoogle({
        url: "https://photoslibrary.googleapis.com/v1/albums?excludeNonAppCreatedData=true",
        method: 'GET'
    });
}

export function initAlbumDetailsData(id) {
    return requestToGoogle({
        url: "https://photoslibrary.googleapis.com/v1/mediaItems:search?pageSize=7&albumId=" + id,
        method: 'POST'
    });
}


export function loadAlbumDetailsData(id, token) {
    return requestToGoogle({
        url: "https://photoslibrary.googleapis.com/v1/mediaItems:search?pageSize=7&pageToken=" + token + "&albumId=" + id,
        method: 'POST'
    });
}

export function cerateAlbum(title) {
    return requestToGoogle({
        url: "https://photoslibrary.googleapis.com/v1/albums",
        method: 'POST',
        body: JSON.stringify({
            album: {
                title: title
            }
        })
    })
}

export function loadPhotoAlbum(id, image) {
    console.log(Buffer.from(image, 'base64'));
    requestToGoogleUploadToken({
        url: "https://photoslibrary.googleapis.com/v1/uploads",
        method: 'POST',
        body: Buffer.from(image, 'base64')
    }).then(response => {
        console.log(response);
        requestToGoogle({
            url: "https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate",
            method: 'POST',
            body: JSON.stringify({
                albumId: id,
                newMediaItems: [
                    {
                        description: "Created By MSQRD",
                        simpleMediaItem: {
                            uploadToken: response
                        }
                    }
                ]
            })
        }).then(r => {
            console.log(r);
            return true;
        }).catch(error => {
            console.log(error);
            return false;
        });
    }).catch(error => {
        console.log(error);
        return false;
    });
}

const requestToGoogle = (options) => {

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_GOOGLE)
    });

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);
    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

const requestToGoogleUploadToken = (options) => {

    const headers = new Headers({
        'Content-Type': 'application/octet-stream',
        'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_GOOGLE),
        'X-Goog-Upload-Protocol': "raw",
        'X-Goog-Upload-File-Name': new Date().toLocaleDateString() + "_" + new Date().toLocaleTimeString('en-GB', {
            hour: "numeric",
            minute: "numeric"
        }) + ".jpg"
    });

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);
    return fetch(options.url, options)
        .then(response => response.text())
        .then(data => {
            console.log(data);
            return data;
        })
};


