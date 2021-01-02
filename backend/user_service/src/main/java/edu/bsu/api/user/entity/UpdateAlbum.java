package edu.bsu.api.user.entity;

public class UpdateAlbum {
    private String id;
    private String album;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAlbum() {
        return album;
    }

    public void setAlbum(String album) {
        this.album = album;
    }
}
