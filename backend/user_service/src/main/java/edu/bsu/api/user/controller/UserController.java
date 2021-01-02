package edu.bsu.api.user.controller;


import edu.bsu.api.user.entity.Image;
import edu.bsu.api.user.entity.URL;
import edu.bsu.api.user.entity.UpdateAlbum;
import edu.bsu.msqrd.api.AuthServiceApi;
import edu.bsu.msqrd.api.UserApi;
import okhttp3.Call;
import okhttp3.Response;
import org.json.JSONObject;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@CrossOrigin
@RestController
public class UserController {


    private final RabbitTemplate template;

    @Autowired
    public UserController(RabbitTemplate rabbitTemplate) {
        this.template = rabbitTemplate;
    }

    @GetMapping("/user/me")
    public String getCurrentUser(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Response authResponse = checkUserAuthStatus(request);
        if (authResponse.isSuccessful()) {
            String body = authResponse.body().string();
            JSONObject jsonObject = new JSONObject(body);
            String id = jsonObject.getString("id");
            return UserApi.getUser(id).execute().body().string();
        } else {
            response.setStatus(authResponse.code());
        }
        return "";
    }

    @PostMapping("/user/mask")
    public Image setMask(HttpServletRequest request, HttpServletResponse response, @RequestBody URL url) throws IOException {
        Response authResponse = checkUserAuthStatus(request);
        if (authResponse.isSuccessful()) {
            byte[] mqResponse = (byte[]) template.convertSendAndReceive("msqrd-mq-1", url.getUrl());
            Image image = new Image();
            image.setImage(mqResponse);
            return image;
        } else {
            response.setStatus(authResponse.code());
        }
        return new Image();
    }

    @PostMapping("/user/album")
    public String updateAlbum(HttpServletRequest request, HttpServletResponse response, @RequestBody UpdateAlbum updateAlbum) throws IOException {
        Response authResponse = checkUserAuthStatus(request);
        if (authResponse.isSuccessful()) {
            Call update = UserApi.updateAlbum(updateAlbum.getId(), updateAlbum.getAlbum());
            Response

                    updateResponse = update.execute();
            if (updateResponse.isSuccessful()) {
                return updateResponse.body().string();
            } else {
                response.setStatus(updateResponse.code());
            }
        } else {
            response.setStatus(authResponse.code());
        }
        return "";
    }

    private Response checkUserAuthStatus(HttpServletRequest request) throws IOException {
        String jwt = getJwtFromRequest(request);
        Call call = AuthServiceApi.validate(jwt);
        return call.execute();
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
