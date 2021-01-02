package edu.bsu.msqrd.api.auth.db.controllers;

import edu.bsu.msqrd.api.auth.db.controllers.entity.UpdateAlbum;
import edu.bsu.msqrd.api.auth.db.model.User;
import edu.bsu.msqrd.api.auth.db.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user/{id}")
    public User getUser(@PathVariable String id) {
        return userService.loadUserById(id);
    }

    @PostMapping("/user")
    public void createUser(@RequestBody User newUser) {
        userService.createUser(newUser);
    }

    @PostMapping("/user/album")
    public User updateUser(@RequestBody UpdateAlbum updateAlbum) {
        return userService.updateAlbum(updateAlbum.getId(), updateAlbum.getAlbum());
    }
}
