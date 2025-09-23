# 3주차 이후 - 2~3일차: 실전 CRUD - 목록 화면 개발

## 학습 목표
- Spring Boot 백엔드에서 제공하는 게시글 목록 API를 호출하여 넥사크로 그리드에 데이터를 표시한다.
- 그리드에서 특정 행을 클릭했을 때 상세 화면으로 이동하는 기능을 구현한다.

## 1. 넥사크로 프로젝트 준비

1.  **새 Form 생성**: `Project Explorer`에서 `Forms` 폴더에 마우스 오른쪽 클릭 > `Add > Form`을 선택하여 `frm_board_list.xfdl`을 생성합니다.

2.  **데이터셋 정의**: `Invisible Objects`에 `ds_board_list` 데이터셋을 생성하고, Spring `Board` 엔티티의 필드(`id`, `title`, `content`, `author`, `createdAt`)와 동일한 컬럼을 정의합니다.

3.  **컴포넌트 배치**: `frm_board_list`에 다음 컴포넌트들을 배치합니다.
    - `Grid` 컴포넌트: `name`을 `grd_board`로 설정하고, `binddataset`을 `ds_board_list`로 설정합니다. 그리드를 더블클릭하여 `Recreate` 버튼을 눌러 컬럼을 자동 생성합니다.
    - `Button` 컴포넌트: `name`을 `btn_search`로, `text`를 "조회"로 설정합니다.
    - `Button` 컴포넌트: `name`을 `btn_new`로, `text`를 "새 글"로 설정합니다.

## 2. 게시글 목록 조회 기능 구현

1.  **Form `onload` 이벤트**: Form이 로드될 때 자동으로 게시글 목록을 조회하도록 `onload` 이벤트에 스크립트를 작성합니다.

    ```javascript
    // frm_board_list.xfdl Script

    this.frm_board_list_onload = function(obj:nexacro.Form,e:nexacro.LoadEventInfo)
    {
        this.fn_search(); // Form 로드 시 조회 함수 호출
    };

    // [조회] 버튼 클릭 이벤트
    this.btn_search_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
    {
        this.fn_search();
    };

    // 게시글 목록 조회 함수
    this.fn_search = function()
    {
        var strUrl = "http://localhost:8080/api/board"; // Spring Boot API 주소

        this.transaction(
            "tr_board_list", // 서비스 ID
            strUrl,          // 요청 URL
            "",              // InDatasets (보낼 데이터셋 없음)
            "ds_board_list=this.ds_board_list", // OutDatasets (응답 데이터를 ds_board_list에 매핑)
            "",              // Argument (보낼 파라미터 없음)
            "fn_callback"    // 콜백 함수
        );
    };

    // 콜백 함수
    this.fn_callback = function(strSvcID, nErrorCode, strErrorMsg)
    {
        if (nErrorCode < 0)
        {
            this.alert("통신 실패: " + strErrorMsg);
            return;
        }

        if (strSvcID == "tr_board_list")
        {
            this.alert("게시글 " + this.ds_board_list.getRowCount() + "건이 조회되었습니다.");
        }
    };
    ```

## 3. 상세 화면 이동 기능 구현

그리드에서 특정 게시글을 더블클릭했을 때 상세 화면으로 이동하도록 합니다.

1.  **그리드 `oncelldblclick` 이벤트**: `grd_board` 컴포넌트의 `oncelldblclick` 이벤트에 스크립트를 작성합니다.

    ```javascript
    // grd_board.oncelldblclick 이벤트
    this.grd_board_oncelldblclick = function(obj:nexacro.Grid,e:nexacro.GridClickEventInfo)
    {
        // 현재 선택된 행의 ID 값을 가져옵니다.
        var nBoardId = this.ds_board_list.getColumn(e.row, "id");

        if (this.gfn_IsNull(nBoardId)) {
            return;
        }

        // 상세 화면을 팝업으로 띄우거나, 현재 Form을 상세 화면으로 전환하는 로직
        // 여기서는 간단하게 alert으로 ID를 표시합니다. (다음 단계에서 상세 화면 구현)
        this.alert("선택된 게시글 ID: " + nBoardId);

        // TODO: 다음 단계에서 상세 화면(frm_board_detail.xfdl)을 띄우는 코드로 대체
        // this.gfn_openDetailForm(nBoardId, "update");
    };

    // 공통 Null 체크 함수 (이전 주차에서 작성)
    this.gfn_IsNull = function (sValue)
    {
        if (new String(sValue).valueOf() == "undefined") return true;
        if (sValue == null) return true;
        if (("x" + sValue == "xNaN") && (new String(sValue.length).valueOf() == "undefined")) return true;
        if (sValue.length == 0) return true;

        return false;
    }
    ```

## 오늘의 과제
- [ ] `frm_board_list.xfdl` Form 생성 및 컴포넌트 배치
- [ ] `ds_board_list` 데이터셋 정의
- [ ] 게시글 목록 조회 기능 구현 및 Spring Boot 서버와 연동하여 데이터가 그리드에 잘 표시되는지 확인
- [ ] 그리드 더블클릭 시 선택된 게시글 ID를 알림으로 띄우는 기능 구현
