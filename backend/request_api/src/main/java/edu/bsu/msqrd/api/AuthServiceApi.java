package edu.bsu.msqrd.api;

import edu.bsu.msqrd.properties.URLProperty;
import okhttp3.*;

public class AuthServiceApi {
    public final static String BASE_URL = "http://" + URLProperty.URL + "/auth-service";

    private final static OkHttpClient client = new OkHttpClient();


    public static Call validate(String jwt) {
        RequestBody formBody = new FormBody.Builder()
                .add("jwt", jwt)
                .build();

        Request request = new Request.Builder()
                .url(BASE_URL + "/validate")
                .post(formBody)
                .build();
        return client.newCall(request);
    }

}
