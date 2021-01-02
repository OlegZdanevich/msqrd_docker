FROM maven:3.6.0-jdk-11-slim
WORKDIR /tmp_util
COPY ./backend/request_api/src /tmp_util/src
COPY ./backend/request_api/pom.xml /tmp_util/pom.xml
RUN mvn clean install
WORKDIR /tmp
COPY ./backend/user_service/src /tmp/src
COPY ./backend/user_service/pom.xml /tmp/pom.xml
ENTRYPOINT [ "sh", "-c", "mvn spring-boot:run" ]