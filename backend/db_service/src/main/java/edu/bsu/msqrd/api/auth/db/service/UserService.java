package edu.bsu.msqrd.api.auth.db.service;


import edu.bsu.msqrd.api.auth.db.exception.CreationException;
import edu.bsu.msqrd.api.auth.db.exception.ResourceNotFoundException;
import edu.bsu.msqrd.api.auth.db.model.User;
import edu.bsu.msqrd.api.auth.db.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class UserService {


    private UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User loadUserById(String id) {
        return userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User", "id", id)
        );
    }

    @Transactional
    public void createUser(User user) {
        if (!userRepository.existsById(user.getId())) {
            try {
                userRepository.save(user);
            } catch (Exception e) {
                throw new CreationException("User", user);
            }
        }
    }

    @Transactional
    public User updateAlbum(String id, String album) {
        User user = userRepository.findById(id).get();
        if (user != null) {
            try {
                user.setAlbum(album);
                return userRepository.save(user);
            } catch (Exception e) {
                throw new CreationException("User", user);
            }
        }
        return null;
    }
}