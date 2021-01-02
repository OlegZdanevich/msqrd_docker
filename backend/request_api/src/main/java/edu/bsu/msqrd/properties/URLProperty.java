package edu.bsu.msqrd.properties;

import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class URLProperty {
    public static final String URL;

    static {
        ClassPathResource resource = new ClassPathResource("app.properties");
        Properties p = new Properties();
        try (InputStream inputStream = resource.getInputStream()) {
            p.load(inputStream);
        } catch (IOException e) {
            System.err.println(e);
        }
        URL = p.getProperty("url");
    }
}
