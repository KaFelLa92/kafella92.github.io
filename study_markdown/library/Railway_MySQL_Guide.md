# Railway를 이용한 외부 MySQL DB 연동 및 배포 가이드

이 문서는 로컬 서버가 아닌 외부 클라우드 데이터베이스(MySQL)를 구축하고, 애플리케이션을 배포하여 연결하는 전체 과정을 안내합니다. PaaS 플랫폼인 [Railway.app](http://railway.app)을 사용하여 쉽고 빠르게 실습 환경을 구축합니다.

## 왜 Railway를 사용하는가?

- **간편함**: 몇 번의 클릭만으로 데이터베이스와 서버를 생성하고 배포할 수 있습니다.
- **자동화**: GitHub 리포지토리를 연결하면 코드가 푸시될 때마다 자동으로 빌드 및 배포(CI/CD)가 진행됩니다.
- **무료 제공**: 학습 및 소규모 프로젝트에 충분한 무료 사용량을 제공하여 부담 없이 시작할 수 있습니다.

---

## 전체 과정 요약

1.  **Railway에서 MySQL 데이터베이스 생성**
2.  **생성된 DB의 연결 정보 확인**
3.  **로컬 개발 환경에서 외부 DB 연결 테스트**
4.  **애플리케이션 코드를 GitHub에 푸시**
5.  **Railway에 애플리케이션 배포 및 DB 연동**

---

## 1단계: Railway에서 MySQL 데이터베이스 생성

1.  [Railway.app](http://railway.app)에 GitHub 계정으로 로그인합니다.
2.  대시보드에서 `Start a New Project` 버튼을 클릭합니다.
3.  여러 옵션 중 `Provision MySQL`을 선택합니다.
    -   잠시 기다리면 프로젝트 내에 새로운 MySQL 데이터베이스 서비스가 생성됩니다.

## 2단계: 데이터베이스 연결 정보 확인

1.  생성된 MySQL 서비스를 클릭하여 대시보드로 들어갑니다.
2.  `Connect` 탭을 선택하면 데이터베이스에 연결하는 데 필요한 모든 정보가 변수 형태로 제공됩니다.
    -   `MYSQLHOST`: 데이터베이스 서버 주소
    -   `MYSQLUSER`: 사용자 이름
    -   `MYSQLPASSWORD`: 비밀번호
    -   `MYSQLDATABASE`: 데이터베이스 이름
    -   `MYSQLPORT`: 포트 번호

    > **⚠️ 중요:** 이 정보는 민감 정보이므로 코드에 직접 하드코딩하지 마세요.

## 3단계: 로컬 개발 환경에서 외부 DB 연결

이제 내 컴퓨터(로컬)에서 개발 중인 프로젝트가 Railway에 생성된 외부 DB를 바라보도록 설정합니다.

1.  **환경 변수 설정**: 프로젝트 루트에 `.env` 파일을 만들고 2단계에서 확인한 연결 정보를 아래와 같이 입력합니다. `.env` 파일은 Git에 올라가지 않도록 `.gitignore`에 추가해야 합니다.

    ```
    # .env
    DB_HOST="<MYSQLHOST 값>"
    DB_USER="<MYSQLUSER 값>"
    DB_PASSWORD="<MYSQLPASSWORD 값>"
    DB_NAME="<MYSQLDATABASE 값>"
    DB_PORT="<MYSQLPORT 값>"
    ```

2.  **애플리케이션 설정**: 사용하는 언어나 프레임워크에 맞춰 `.env` 파일의 변수를 읽어와 데이터베이스 연결에 사용하도록 코드를 수정합니다.
    -   **(예시: Node.js의 `dotenv` 라이브러리)**
        ```javascript
        require('dotenv').config();

        const dbConfig = {
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          port: process.env.DB_PORT
        };
        ```
    -   **(예시: Java Spring Boot의 `application.properties`)**
        ```properties
        spring.datasource.url=jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}
        spring.datasource.username=${DB_USER}
        spring.datasource.password=${DB_PASSWORD}
        ```

3.  애플리케이션을 실행하여 로컬 환경에서 Railway의 외부 DB에 정상적으로 연결되는지 확인합니다.

## 4단계: GitHub 리포지토리에 코드 푸시

-   DB 연결 설정이 완료된 프로젝트를 GitHub 리포지토리에 푸시합니다.
-   `.env` 파일이 `.gitignore`에 포함되어 있는지 다시 한번 확인하세요.

## 5단계: Railway에 애플리케이션 배포 및 DB 연동

1.  Railway 프로젝트 대시보드로 돌아가 `+ New` 또는 `Add a service` 버튼을 클릭합니다.
2.  `GitHub Repo`를 선택하고, 4단계에서 코드를 푸시한 리포지토리를 지정합니다.
3.  Railway가 코드를 분석하여 자동으로 빌드 및 배포를 시작합니다. (예: `package.json`이 있으면 Node.js 프로젝트로, `pom.xml`이나 `build.gradle`이 있으면 Java 프로젝트로 인식)

**가장 중요한 부분입니다:**

-   Railway는 같은 프로젝트 내에 있는 서비스(애플리케이션, 데이터베이스)들을 자동으로 인식합니다.
-   배포된 애플리케이션은 **별도의 설정 없이** `MYSQLHOST`, `MYSQLPASSWORD` 같은 환경 변수들을 **자동으로 주입받아** 데이터베이스에 연결됩니다.
-   즉, 3단계에서 로컬 테스트를 위해 `.env` 파일을 사용했지만, 배포 환경에서는 Railway가 이 변수들을 직접 제공해주므로 코드를 수정할 필요가 없습니다.

배포가 완료되면 애플리케이션 로그를 확인하여 데이터베이스 연결이 성공했는지 최종적으로 검증합니다. 이제 여러분의 애플리케이션은 외부 DB와 연동되어 동작하게 됩니다.
