package edu.bsu.msqrd.api.auth.db;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DBService {

    public static void main(String[] args) {
        SpringApplication.run(DBService.class, args);
    }
}
