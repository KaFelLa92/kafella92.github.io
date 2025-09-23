# 1주차 - 4~5일차: "Hello World" 및 이벤트 처리

## 학습 목표
- Form에 컴포넌트를 배치하고 이벤트 핸들러를 작성할 수 있다.
- JavaScript를 사용하여 간단한 상호작용을 구현할 수 있다.

## 1. "Hello World" 만들어보기

가장 기본적인 예제인 버튼 클릭 시 알림 창을 띄우는 기능을 만들어 봅시다.

1.  **컴포넌트 배치**:
    - `Toolbox`에서 `Button` 컴포넌트 하나를 `Design` 탭의 Form 위로 드래그 앤 드롭합니다.
    - `Properties` 창에서 버튼의 `name`을 `btn_hello`로, `text`를 "인사하기"로 변경합니다.

2.  **이벤트 핸들러 생성**:
    - `btn_hello` 버튼을 선택한 상태에서 `Properties` 창의 번개 모양 아이콘(⚡)을 클릭하여 이벤트 목록을 엽니다.
    - 여러 이벤트 중 `onclick` 이벤트의 오른쪽 빈 칸을 더블클릭합니다.
    - 그러면 `Script` 탭으로 자동 이동하며, 아래와 같은 이벤트 핸들러 함수가 생성됩니다.

    ```javascript
    this.btn_hello_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
    {
        // 여기에 코드를 작성합니다.
    };
    ```

3.  **스크립트 작성**:
    - 생성된 `btn_hello_onclick` 함수 내부에 알림 창을 띄우는 코드를 작성합니다.

    ```javascript
    this.btn_hello_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
    {
        this.alert("안녕하세요, 넥사크로!");
    };
    ```
    - `this.alert()`는 넥사크로에서 제공하는 기본적인 알림 창 함수입니다.

4.  **실행 및 확인**:
    - `F5` 키를 누르거나 상단의 실행 버튼(▶)을 눌러 QuickView로 실행합니다.
    - 새로 뜬 애플리케이션 창에서 "인사하기" 버튼을 클릭했을 때 "안녕하세요, 넥사크로!" 알림이 뜨면 성공입니다.

## 2. 간단한 상호작용 예제

입력창(Edit)에 있는 값을 가져와 알림 창에 띄워봅시다.

1.  **컴포넌트 추가 배치**:
    - `Toolbox`에서 `Edit` 컴포넌트를 Form에 추가하고, `name`을 `edt_name`으로 설정합니다.
    - `Toolbox`에서 `Static` 컴포넌트를 `Edit` 컴포넌트 옆에 배치하고, `text`를 "이름:"으로 설정합니다.

2.  **스크립트 수정**:
    - `btn_hello_onclick` 함수를 아래와 같이 수정합니다.

    ```javascript
    this.btn_hello_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
    {
        // edt_name 컴포넌트의 값을 가져옵니다.
        var sName = this.edt_name.get_value();

        // 값이 비어있는지 확인합니다.
        if (this.gfn_IsNull(sName))
        {
            this.alert("이름을 입력해주세요.");
            return; // 함수 종료
        }

        var sMessage = sName + "님, 안녕하세요!";
        this.alert(sMessage);
    };

    // 공통 Null 체크 함수 (실제 프로젝트에서는 공통 스크립트 파일에 작성)
    this.gfn_IsNull = function (sValue)
    {
        if (new String(sValue).valueOf() == "undefined") return true;
        if (sValue == null) return true;
        if (("x" + sValue == "xNaN") && (new String(sValue.length).valueOf() == "undefined")) return true;
        if (sValue.length == 0) return true;

        return false;
    }
    ```
    - `this.컴포넌트명.get_value()`: 해당 컴포넌트의 값을 가져오는 함수입니다.
    - `this.컴포넌트명.set_value("값")`: 값을 설정하는 함수입니다.

## 1주차 마무리 과제
- [ ] 이름과 나이를 입력받는 `Edit` 컴포넌트 2개를 만들고, 버튼 클릭 시 "홍길동님의 나이는 20세입니다." 와 같이 출력하는 기능 구현하기
