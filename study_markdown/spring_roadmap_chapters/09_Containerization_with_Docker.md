# 9장: Docker를 이용한 컨테이너화

"제 컴퓨터에서는 잘 되는데, 서버에서는 안 돼요." 라는 말을 없애주는 기술, 컨테이너에 대해 배웁니다. 내가 만든 Spring Boot 애플리케이션을 어떤 환경에서든 동일하게 실행할 수 있도록 Docker 컨테이너 이미지로 만드는 방법을 학습합니다.

---

## 1. 핵심 개념

- **컨테이너(Container)**: 애플리케이션과 그 실행에 필요한 모든 것(라이브러리, 종속성, 설정 등)을 패키징한 독립적인 실행 단위입니다. 가상 머신(VM)보다 훨씬 가볍고 빠릅니다.
- **Docker**: 컨테이너 기술을 쉽게 사용할 수 있도록 해주는 오픈소스 플랫폼입니다.
- **이미지(Image)**: 컨테이너를 생성하기 위한 읽기 전용 템플릿입니다. 애플리케이션과 실행 환경이 코드 형태로 기록되어 있습니다.
- **Dockerfile**: 이미지를 만들기 위한 설계도입니다. 어떤 베이스 이미지에서 시작하여, 어떤 파일들을 복사하고, 어떤 명령어들을 실행할지 순서대로 정의하는 텍스트 파일입니다.
- **Docker Compose**: 여러 개의 컨테이너(예: 웹 애플리케이션 컨테이너, 데이터베이스 컨테이너)를 하나의 파일로 정의하고 함께 실행하고 관리할 수 있게 해주는 도구입니다.

---

## 2. 예제 코드

Spring Boot 애플리케이션을 위한 간단한 `Dockerfile` 예제입니다.

```dockerfile
# 1. 베이스 이미지 선택 (Java 17 실행 환경이 포함된 이미지)
FROM openjdk:17-jdk-slim

# 2. JAR 파일이 저장될 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# 3. 빌드된 JAR 파일을 컨테이너의 작업 디렉토리로 복사
# build/libs/프로젝트명-0.0.1-SNAPSHOT.jar 파일을 app.jar 라는 이름으로 복사
COPY build/libs/*.jar app.jar

# 4. 컨테이너가 외부에 노출할 포트 설정
EXPOSE 8080

# 5. 컨테이너가 시작될 때 실행할 명령어
ENTRYPOINT ["java", "-jar", "app.jar"]
```

`docker-compose.yml` 예제입니다.
```yaml
version: '3.8'
services:
  # Spring Boot 애플리케이션 서비스
  app:
    build: . # 현재 디렉토리의 Dockerfile을 사용하여 이미지 빌드
    ports:
      - "8080:8080" # 호스트의 8080 포트와 컨테이너의 8080 포트 연결
    depends_on:
      - db # db 서비스가 먼저 시작된 후에 app 서비스 시작
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/springweb2

  # MySQL 데이터베이스 서비스
  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=1234
      - MYSQL_DATABASE=springweb2
```

---

## 3. 직접 풀 문제

1. 로컬 환경에 Docker Desktop을 설치하세요.
2. `dongjinWeb2` 프로젝트 루트에 위 예제와 같은 `Dockerfile`을 작성하세요. (JAR 파일 경로는 실제 파일에 맞게 수정해야 합니다.)
3. 터미널에서 `docker build -t my-spring-app .` 명령어를 실행하여 도커 이미지를 빌드해보세요.
4. `docker run -p 8080:8080 my-spring-app` 명령어로 컨테이너를 실행하고, 브라우저에서 `http://localhost:8080`으로 접속하여 애플리케이션이 정상 동작하는지 확인해보세요.
