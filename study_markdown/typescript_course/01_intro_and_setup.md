# 1장: TypeScript 소개 및 개발 환경 설정

JavaScript 코드에 타입을 더해 안정성을 높이는 TypeScript의 세계에 오신 것을 환영합니다. TypeScript가 왜 필요한지, Java와 비교했을 때 어떤 장점이 있는지 알아보고, 첫 코드를 작성하기 위한 개발 환경을 설정합니다.

---

## 1. TypeScript, 왜 필요한가요?

JavaScript는 매우 유연한 동적 타입 언어지만, 프로젝트의 규모가 커질수록 이 유연함은 예기치 않은 버그의 원인이 되기도 합니다.

**JavaScript의 문제점 (Java와 비교)**
```javascript
// 숫자를 더하는 함수를 만들었습니다.
function add(a, b) {
    return a + b;
}

add(10, 20); // 30 (정상)
add('10', '20'); // '1020' (의도와 다른 결과, 문자열이 합쳐짐)
```
Java였다면 `add(String a, String b)`와 `add(int a, int b)`는 다른 메소드로 인식되거나, 애초에 타입이 맞지 않아 컴파일 에러가 발생했을 겁니다. JavaScript는 에러 없이 그냥 실행해버리죠. 이런 문제는 프로젝트가 커질수록 찾기 어려운 버그를 만듭니다.

**TypeScript의 해결책**

TypeScript는 JavaScript의 모든 기능을 포함하면서 **타입(Type) 시스템**을 추가한, JavaScript의 슈퍼셋(Superset) 언어입니다. 코드를 실행하기 전(컴파일 단계)에 타입 관련 에러를 미리 잡아낼 수 있게 해줍니다.

```typescript
// 매개변수 a와 b는 숫자(number)만 가능하다고 명시합니다.
function add(a: number, b: number): number { // 반환 타입도 명시 가능
    return a + b;
}

add(10, 20); // 30 (정상)
add('10', '20'); // 에러! 컴파일 단계에서 "string 타입은 number 타입에 할당할 수 없습니다." 라는 오류를 보여줍니다.
```
> **핵심:** 타입스크립트는 코드가 실행되기 전에 버그를 찾을 수 있도록 도와주는 **정적 타입 검사기(Static Type Checker)**입니다.

## 2. 개발 환경 설정

타입스크립트 파일(`.ts`)은 브라우저나 Node.js가 직접 실행할 수 없습니다. `.ts` 파일을 `.js` 파일로 **컴파일(Compile) 또는 트랜스파일(Transpile)**하는 과정이 필요합니다.

1.  **Node.js 설치**: [nodejs.org](https://nodejs.org/)에서 LTS 버전을 설치합니다. (npm이 함께 설치됩니다)

2.  **TypeScript 전역 설치**: 터미널(cmd 또는 PowerShell)을 열고 다음 명령어를 입력하여 TypeScript 컴파일러(tsc)를 전역으로 설치합니다.
    ```bash
    npm install -g typescript
    ```

3.  **프로젝트 폴더 및 `tsconfig.json` 생성**:
    ```bash
    mkdir my-ts-project
    cd my-ts-project
    tsc --init # tsconfig.json 파일 생성
    ```
    - `tsconfig.json`은 TypeScript 컴파일러의 설정을 담는 파일입니다. 어떤 버전의 JavaScript로 변환할지, 어떤 파일을 포함/제외할지 등 다양한 옵션을 설정할 수 있습니다.

4.  **첫 코드 작성 및 컴파일**:
    - `src/index.ts` 파일을 만들고 아래 코드를 작성하세요. (`src` 폴더를 만드는 것이 일반적입니다.)
      ```typescript
      // src/index.ts
      const message: string = 'Hello, TypeScript!';
      console.log(message);
      ```
    - 터미널에서 `tsc` 명령어를 실행하세요. `tsconfig.json` 설정에 따라 `src` 폴더의 모든 `.ts` 파일이 컴파일됩니다.
    - `src/index.js` 파일이 생성된 것을 볼 수 있습니다. 이 변환된 js 파일을 기존처럼 사용하면 됩니다.

---

## 3. 연습 문제

### 문제 1: 프로젝트 설정 및 컴파일
- **요구사항**: `learning-ts` 라는 이름의 새 프로젝트를 만들고, TypeScript 개발 환경을 직접 설정해보세요.
- **세부사항**:
    1. `learning-ts` 폴더를 만듭니다.
    2. `npm init -y`로 `package.json`을 생성합니다.
    3. `npm install typescript --save-dev`로 TypeScript를 개발용 의존성으로 설치합니다.
    4. `npx tsc --init`으로 `tsconfig.json` 파일을 생성합니다.
    5. `tsconfig.json` 파일에서 `outDir` 옵션을 찾아 주석을 해제하고 값을 `./dist`로 설정하세요. (컴파일된 JS 파일이 `dist` 폴더에 저장되도록 설정)
    6. `hello.ts` 파일을 만들고 간단한 코드를 작성한 뒤, `npx tsc` 명령어로 컴파일하여 `dist/hello.js` 파일이 생성되는지 확인하세요.

<details>
<summary>문제 1 힌트</summary>

**`tsconfig.json` 수정 부분:**
```json
{
  "compilerOptions": {
    // ... 다른 옵션들
    "outDir": "./dist",
    // ...
  }
}
```

**`hello.ts` 예시:**
```typescript
function greet(name: string) {
  console.log(`Hello, ${name}!`);
}
greet('World');
```

**컴파일 명령어:**
```bash
npx tsc
```
</details>
