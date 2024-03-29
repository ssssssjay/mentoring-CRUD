## 개요

vite + vue3 + composition api로 클라이언트 환경을 구축하고, nodejs + express로 서버환경을 구축하여 CRUD기능을 가진 간단한 블로그 홈페이지 개발

## 사양

### 1. DB(데이터베이스)는 자유롭게 선택

- DB는 `mysql`을 선택하였습니다.

### 2. 로그인 시스템은 JWT 토큰 방식 이용

- 토큰은 `refresh`, `access` 토큰 두 가지를 발행하는 방식을 채택하였습니다.
- 인증이 필요한 요청에는 검증하는 **미들웨어를** 두어 검사하게 됩니다.
- `refresh`는 쿠키에, `access`는 클라이언트에 저장하는 방식으로 인증과정을 구현했습니다.
- 액세스는 1시간, 리프레쉬는 7일의 만료기간을 두었고, 리프레쉬마저도 만료일 시, 인증이 필요한 모든 요청은 거절되며 경고알림으로 렌더합니다.

### 3. "back-end sever"는 express 서버를 이용

#### 3-1. 기존 express 경험자는 nestjs 를 사용하여 개발(https://nestjs.com/)

- "back-end sever"는 `nodejs` + `express`를 기반으로 구현했습니다.

### 4. 게시판은 CRUD(create, read, update, delete) 기능 포함

- 로컬, 배포환경에서의 게시판 CRUD 기능 구현 완료했습니다.

### 5. VUE 3 버전으로 개발

### 5-1. TYPESCRIPT 적용(class 스타일 적용 안함)

- `vite`기반의 `vue3` 및 `composition api`를 활용하여 구현했습니다.
- 사용되는 타입들에 관한 선언 폴더를 두고, 이를 활용하는 방식으로 적용했습니다.

### 6. VUE STORE 기능을 적극 이용

- 라이브러리는 `pinia`를 사용하였습니다.
- 중앙 상태 저장에는 유저의 아이디와 토큰 값을 두고, 이를 인증이 필요한 요청에서 활용합니다.

### 7. 소스 형상관리는 GITHUB 이용

- `Gitlab`의 하나의 **레포지토리에서 디렉토리로 구분을 두어** back/front 작업을 진행했습니다.

### 8. 완성된 어플리케이션은 **자신의 도메인** 만들어서 인터넷에서 접근 가능하도록 발행.

- **도메인은** 가비아를 통해서 구매하였으며, 원격 서버는 NCP 무료 서버를 사용하여 `nginx`, `ubuntu`, `mysql` 환경에서 구동되도록 하였습니다.

### 9-1. HTTPS 로 접근 가능하도록 한다

- **letsencrypt, certbot**을 활용하여 인증과정을 구현하였습니다.

## 시연

- 비로그인 유저 : 조회가 가능하며, 글쓰기를 할 수 없다.

- 로그인 : 비로그인이 가능한 기능 + 생성 및 수정이 가능하다.

  - 단, 본인이 작성한 게시글에 한해서 버튼이 활성화 된다.

- 만일, 인증이 필요한 요청인데 비정상적인 경로로 요청을 보내더라도 서버에서 검증과정이 미들웨어에 걸려있기에 원하는대로의 과정으로 이루어지지 않는다.
  - (예시) 비정상적으로 `disabled`된 버튼을 활성화 시켜서 요청을 보내더라도 정상적인 과정처럼 실행되지 않는다.

## 접속 가능한 도메인 정보

[`https://kwaksungjae.store/`](https://kwaksungjae.store/)
