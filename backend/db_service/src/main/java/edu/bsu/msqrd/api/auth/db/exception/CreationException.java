package edu.bsu.msqrd.api.auth.db.exception;

import edu.bsu.msqrd.api.auth.db.model.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@EqualsAndHashCode(callSuper = true)
@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
@Data
public class CreationException extends RuntimeException {
    private String resourceName;
    private User user;

    public CreationException(String resourceName, User user) {
        super(String.format("%s wasn't created data: %s ", resourceName, user));
        this.resourceName = resourceName;
        this.user = user;
    }
}
