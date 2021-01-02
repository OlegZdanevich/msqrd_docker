package edu.bsu.msqrd.api.auth.controller;

import edu.bsu.msqrd.api.auth.security.providers.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
public class AuthController {

    private TokenProvider tokenProvider;


    @Autowired
    public AuthController(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/validate")
    public String getCurrentUser(HttpServletRequest request, HttpServletResponse response) {
        String jwt = request.getParameter("jwt");
        if (validate(jwt)) {
            String id = getID(jwt);
            return "{\"id\":\"" + id + "\"}";
        } else {
            response.setStatus(401);
            return "";
        }
    }

    protected String getID(String jwt) {
        return tokenProvider.getUserIdFromToken(jwt);
    }


    protected boolean validate(String jwt) {
        return StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt);
    }
}
