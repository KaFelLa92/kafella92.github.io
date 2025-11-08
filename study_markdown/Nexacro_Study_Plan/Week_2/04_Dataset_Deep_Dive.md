# 2주차 - 1~2일차: 데이터셋(Dataset) 완전 정복

## 학습 목표
- 넥사크로의 핵심 객체인 데이터셋의 개념을 완벽히 이해한다.
- 스튜디오에서 데이터셋을 생성하고, 스크립트로 제어할 수 있다.

## 1. 데이터셋(Dataset)이란? (★★★★★)

**"클라이언트(화면)에 존재하는 가상의 데이터베이스 테이블"**

- 데이터셋은 넥사크로 애플리케이션의 **모든 데이터 처리를 담당하는 핵심 객체**입니다.
- 서버로부터 받아온 데이터, 서버로 전송할 데이터, 화면 내부에서 계산되는 데이터 등 모든 데이터는 일단 데이터셋에 담깁니다.
- React의 `useState`로 관리하는 객체 배열과 유사하지만, 정형화된 행(Row)과 열(Column) 구조를 가진다는 점이 가장 큰 특징입니다.

## 2. 데이터셋 생성하기

1.  **`Invisible Objects`에 생성**:
    - `Design` 탭 하단의 `Invisible Objects` 영역에서 마우스 오른쪽 클릭 > `Add Object > Dataset`을 선택합니다.
    - 생성된 데이터셋의 `name`을 `ds_user`로 변경합니다.

2.  **컬럼(Column) 정의**:
    - `ds_user` 데이터셋을 더블클릭하면 데이터셋 편집 창이 열립니다.
    - 상단의 `+` 버튼을 눌러 컬럼을 추가합니다.
    - `id` (String, 256), `name` (String, 256), `age` (INT, 256) 세 개의 컬럼을 추가합니다.

## 3. 스크립트로 데이터셋 제어하기

버튼을 클릭할 때마다 데이터셋에 행을 추가하고, 값을 가져오는 예제를 만들어 봅시다.

1.  **컴포넌트 배치**: `Button` 2개(`btn_add`, `btn_get`), `TextArea` 1개(`txa_result`)를 배치합니다.

2.  **스크립트 작성**:

    ```javascript
    // 전역 변수로 row index 관리
    this.nRow = 0;

    // [행추가] 버튼 클릭 이벤트
    this.btn_add_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
    {
        // ds_user 데이터셋에 새로운 행(Row)을 추가하고, 해당 행의 index를 반환
        var nNewRow = this.ds_user.addRow();

        // 새로 추가된 행에 값을 설정
        this.ds_user.setColumn(nNewRow, "id", "user_" + this.nRow);
        this.ds_user.setColumn(nNewRow, "name", "사용자" + this.nRow);
        this.ds_user.setColumn(nNewRow, "age", 20 + this.nRow);

        this.nRow++;
        this.txa_result.set_value("새로운 행이 추가되었습니다. Index: " + nNewRow);
    };

    // [값가져오기] 버튼 클릭 이벤트
    this.btn_get_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
    {
        var strResult = "";

        // 데이터셋의 전체 행 개수만큼 반복
        for (var i = 0; i < this.ds_user.getRowCount(); i++)
        {
            // i번째 행의 "name"과 "age" 컬럼 값을 가져옴
            var sName = this.ds_user.getColumn(i, "name");
            var nAge = this.ds_user.getColumn(i, "age");

            strResult += "[" + i + "행] 이름: " + sName + ", 나이: " + nAge + "\n";
        }

        this.txa_result.set_value(strResult);
    };
    ```

## 주요 데이터셋 함수

- `addRow()`: 새 행 추가
- `deleteRow(nRow)`: 특정 행 삭제
- `setColumn(nRow, sColId, sValue)`: 특정 행, 특정 컬럼에 값 설정
- `getColumn(nRow, sColId)`: 특정 행, 특정 컬럼의 값 조회
- `getRowCount()`: 전체 행 개수 조회
- `clearData()`: 모든 행 삭제

## 오늘의 과제
- [ ] 위 예제를 직접 따라 만들어보기
- [ ] "행삭제" 버튼을 추가하여, `ds_user`의 마지막 행을 삭제하는 기능 구현하기
