# 3주차 이후 - 1일차: 실전 CRUD 프로젝트 - 기획 및 백엔드 준비

## 학습 목표
- 넥사크로와 연동할 Spring Boot 백엔드 프로젝트를 구성한다.
- 간단한 게시판 CRUD API를 설계하고 구현한다.

## 1. 프로젝트 목표: 간단한 게시판 CRUD

넥사크로의 핵심 기능을 모두 활용하여 간단한 게시판(Board)을 만들어 봅시다. 기능은 다음과 같습니다.
- 게시글 목록 조회
- 게시글 상세 조회
- 게시글 등록/수정
- 게시글 삭제

## 2. Spring Boot 백엔드 프로젝트 구성

넥사크로와 통신할 Spring Boot 백엔드를 먼저 준비합니다. 기존에 사용하시던 Spring Boot 프로젝트가 있다면 활용하셔도 좋습니다.

1.  **프로젝트 생성**: Spring Initializr (start.spring.io)를 통해 새로운 Spring Boot 프로젝트를 생성합니다.
    - **Dependencies**: `Spring Web`, `Spring Data JPA`, `H2 Database` (또는 MySQL, PostgreSQL 등), `Lombok`

2.  **엔티티(Entity) 정의**: `Board` 엔티티를 정의합니다.

    ```java
    // src/main/java/com/example/nexacroboard/domain/Board.java
    package com.example.nexacroboard.domain;

    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import javax.persistence.*;
    import java.time.LocalDateTime;

    @Entity
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class Board {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String title;
        private String content;
        private String author;
        private LocalDateTime createdAt;

        @PrePersist
        public void prePersist() {
            this.createdAt = LocalDateTime.now();
        }
    }
    ```

3.  **레포지토리(Repository) 정의**: `BoardRepository`를 정의합니다.

    ```java
    // src/main/java/com/example/nexacroboard/repository/BoardRepository.java
    package com.example.nexacroboard.repository;

    import com.example.nexacroboard.domain.Board;
    import org.springframework.data.jpa.repository.JpaRepository;

    public interface BoardRepository extends JpaRepository<Board, Long> {
    }
    ```

4.  **서비스(Service) 정의**: `BoardService`를 정의합니다.

    ```java
    // src/main/java/com/example/nexacroboard/service/BoardService.java
    package com.example.nexacroboard.service;

    import com.example.nexacroboard.domain.Board;
    import com.example.nexacroboard.repository.BoardRepository;
    import lombok.RequiredArgsConstructor;
    import org.springframework.stereotype.Service;

    import java.util.List;

    @Service
    @RequiredArgsConstructor
    public class BoardService {
        private final BoardRepository boardRepository;

        public List<Board> findAll() {
            return boardRepository.findAll();
        }

        public Board findById(Long id) {
            return boardRepository.findById(id).orElse(null);
        }

        public Board save(Board board) {
            return boardRepository.save(board);
        }

        public void deleteById(Long id) {
            boardRepository.deleteById(id);
        }
    }
    ```

5.  **컨트롤러(Controller) 정의**: `BoardController`를 정의합니다.

    ```java
    // src/main/java/com/example/nexacroboard/controller/BoardController.java
    package com.example.nexacroboard.controller;

    import com.example.nexacroboard.domain.Board;
    import com.example.nexacroboard.service.BoardService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/board")
    @RequiredArgsConstructor
    public class BoardController {
        private final BoardService boardService;

        // 게시글 목록 조회
        @GetMapping
        public ResponseEntity<List<Board>> getAllBoards() {
            return ResponseEntity.ok(boardService.findAll());
        }

        // 게시글 상세 조회
        @GetMapping("/{id}")
        public ResponseEntity<Board> getBoardById(@PathVariable Long id) {
            Board board = boardService.findById(id);
            return board != null ? ResponseEntity.ok(board) : ResponseEntity.notFound().build();
        }

        // 게시글 등록/수정
        @PostMapping
        public ResponseEntity<Board> saveBoard(@RequestBody Board board) {
            return ResponseEntity.ok(boardService.save(board));
        }

        // 게시글 삭제
        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteBoard(@PathVariable Long id) {
            boardService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
    }
    ```

6.  **CORS 설정 (필수)**: 넥사크로(다른 도메인)에서 Spring API를 호출하려면 CORS 설정을 해주어야 합니다.

    ```java
    // src/main/java/com/example/nexacroboard/config/WebConfig.java
    package com.example.nexacroboard.config;

    import org.springframework.context.annotation.Configuration;
    import org.springframework.web.servlet.config.annotation.CorsRegistry;
    import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins("*") // 넥사크로 개발 서버 주소 (예: http://localhost:8080) 또는 "*" (모든 도메인 허용, 개발 시에만 사용)
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(false);
        }
    }
    ```

## 오늘의 과제
- [ ] Spring Boot 프로젝트 생성 및 위 코드들 작성하기
- [ ] `application.properties`에 H2 데이터베이스 설정 추가하기 (인메모리 DB)
- [ ] Spring Boot 애플리케이션 실행 후 Postman 등으로 API 정상 동작 확인하기
