package edu.bsu.msqrd.api;


import edu.bsu.msqrd.properties.URLProperty;
import okhttp3.*;

public class UserApi {

    public final static String BASE_URL = "http://" + URLProperty.URL + "/db-service";


    private final static OkHttpClient client = new OkHttpClient();

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    public static Call getUser(String id) {
        Request request = new Request.Builder()
                .url(BASE_URL + "/user/" + id)
                .build();
        return client.newCall(request);
    }


    public static Call createUser(String id, String email) {
        String json = "{\"id\":\"" + id + "\",\"email\":\"" + email + "\"}";
        RequestBody body = RequestBody.create(JSON, json);
        Request request = new Request.Builder()
                .url(BASE_URL + "/user")
                .post(body)
                .build();
        return client.newCall(request);
    }

    public static Call updateAlbum(String id, String album) {
        String json = "{\"id\":\"" + id + "\",\"album\":\"" + album + "\"}";
        RequestBody body = RequestBody.create(JSON, json);
        Request request = new Request.Builder()
                .url(BASE_URL + "/user/album")
                .post(body)
                .build();
        return client.newCall(request);
    }
}
