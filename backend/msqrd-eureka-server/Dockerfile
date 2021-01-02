FROM maven:3.6.0-jdk-11-slim
WORKDIR /tmp
COPY src /tmp/src
COPY pom.xml /tmp/pom.xml
ENTRYPOINT [ "sh", "-c", "mvn spring-boot:run" ]

