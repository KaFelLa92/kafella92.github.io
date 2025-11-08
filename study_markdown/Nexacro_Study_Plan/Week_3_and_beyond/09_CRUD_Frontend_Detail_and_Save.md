# 3주차 이후 - 4~5일차: 실전 CRUD - 상세/등록/수정 화면 개발

## 학습 목표
- 게시글 상세 정보를 조회하고, 등록 및 수정 기능을 구현한다.
- 넥사크로에서 서버로 데이터를 전송하는 `transaction` 사용법을 익힌다.

## 1. 상세/등록/수정 Form 개발

1.  **새 Form 생성**: `frm_board_detail.xfdl`을 생성합니다.

2.  **데이터셋 정의**: `Invisible Objects`에 `ds_board_detail` 데이터셋을 생성하고, Spring `Board` 엔티티의 필드(`id`, `title`, `content`, `author`, `createdAt`)와 동일한 컬럼을 정의합니다. (단, `id`는 `Long` 타입이므로 `INT`로, `createdAt`은 `String`으로 정의할 수 있습니다.)
    - `ds_board_detail`은 단일 게시글의 정보를 담을 것이므로, 초기에는 1개의 빈 행을 `addRow()`로 추가해두는 것이 편리합니다.

3.  **컴포넌트 배치**: `frm_board_detail`에 다음 컴포넌트들을 배치합니다.
    - `Static`과 `Edit` 컴포넌트를 조합하여 ID, 제목, 작성자, 작성일, 내용을 표시/입력하는 폼을 만듭니다.
        - `id`는 `Edit` 컴포넌트의 `readonly` 속성을 `true`로 설정하여 수정 불가하게 합니다.
        - `content`는 `TextArea` 컴포넌트를 사용합니다.
    - `Button` 컴포넌트: `name`을 `btn_save`로, `text`를 "저장"으로 설정합니다.
    - `Button` 컴포넌트: `name`을 `btn_delete`로, `text`를 "삭제"로 설정합니다.
    - `Button` 컴포넌트: `name`을 `btn_close`로, `text`를 "닫기"로 설정합니다.

4.  **데이터 바인딩**: `ds_board_detail` 데이터셋의 각 컬럼을 해당 `Edit` 또는 `TextArea` 컴포넌트에 바인딩합니다.

## 2. 상세 정보 조회 기능 구현

`frm_board_detail`이 열릴 때, 전달받은 `boardId`가 있다면 해당 게시글의 상세 정보를 조회합니다.

1.  **Form `onload` 이벤트**: `frm_board_detail`의 `onload` 이벤트에 스크립트를 작성합니다.

    ```javascript
    // frm_board_detail.xfdl Script

    this.fv_boardId = null; // 전역 변수로 게시글 ID 저장

    this.frm_board_detail_onload = function(obj:nexacro.Form,e:nexacro.LoadEventInfo)
    {
        // 부모 Form으로부터 전달받은 boardId가 있는지 확인
        if (!this.gfn_IsNull(this.parent.boardId)) {
            this.fv_boardId = this.parent.boardId;
            this.fn_searchDetail(this.fv_boardId); // 상세 조회 함수 호출
        } else {
            // 신규 등록 모드일 경우, ds_board_detail에 빈 행 추가 (바인딩을 위해)
            this.ds_board_detail.addRow();
            this.btn_delete.set_enable(false); // 신규 등록 시 삭제 버튼 비활성화
        }
    };

    // 게시글 상세 조회 함수
    this.fn_searchDetail = function(boardId)
    {
        var strUrl = "http://localhost:8080/api/board/" + boardId; // Spring Boot API 주소

        this.transaction(
            "tr_board_detail",
            strUrl,
            "",
            "ds_board_detail=this.ds_board_detail", // 응답 데이터를 ds_board_detail에 매핑
            "",
            "fn_callback"
        );
    };

    // 콜백 함수 (목록 조회와 동일하게 사용)
    this.fn_callback = function(strSvcID, nErrorCode, strErrorMsg)
    {
        if (nErrorCode < 0)
        {
            this.alert("통신 실패: " + strErrorMsg);
            return;
        }

        if (strSvcID == "tr_board_detail")
        {
            // 조회된 데이터가 ds_board_detail에 자동으로 바인딩됩니다.
            this.alert("게시글 상세 정보가 조회되었습니다.");
        }
        else if (strSvcID == "tr_board_save")
        {
            this.alert("게시글이 성공적으로 저장되었습니다.");
            this.close(); // 저장 후 Form 닫기
        }
        else if (strSvcID == "tr_board_delete")
        {
            this.alert("게시글이 성공적으로 삭제되었습니다.");
            this.close(); // 삭제 후 Form 닫기
        }
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

## 3. 게시글 등록/수정 기능 구현

`btn_save` 버튼 클릭 시 `ds_board_detail`의 데이터를 Spring API로 전송합니다.

1.  **`btn_save_onclick` 이벤트**: `btn_save` 버튼의 `onclick` 이벤트에 스크립트를 작성합니다.

    ```javascript
    // btn_save_onclick 이벤트
    this.btn_save_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
    {
        // 데이터 유효성 검사 (예: 제목, 작성자, 내용 필수 입력)
        if (this.gfn_IsNull(this.ds_board_detail.getColumn(0, "title"))) {
            this.alert("제목을 입력해주세요.");
            return;
        }
        if (this.gfn_IsNull(this.ds_board_detail.getColumn(0, "author"))) {
            this.alert("작성자를 입력해주세요.");
            return;
        }
        if (this.gfn_IsNull(this.ds_board_detail.getColumn(0, "content"))) {
            this.alert("내용을 입력해주세요.");
            return;
        }

        var strUrl = "http://localhost:8080/api/board"; // Spring Boot API 주소

        this.transaction(
            "tr_board_save",
            strUrl,
            "this.ds_board_detail=this.ds_board_detail", // InDatasets (ds_board_detail의 데이터를 서버로 전송)
            "",                                        // OutDatasets (응답 데이터셋 없음)
            "",
            "fn_callback",
            false, // 비동기 여부 (true: 비동기, false: 동기 - 일반적으로 비동기 사용)
            0,     // Timeout
            "POST" // HTTP Method 지정 (POST)
        );
    };
    ```

## 4. 게시글 삭제 기능 구현

`btn_delete` 버튼 클릭 시 현재 게시글을 삭제합니다.

1.  **`btn_delete_onclick` 이벤트**: `btn_delete` 버튼의 `onclick` 이벤트에 스크립트를 작성합니다.

    ```javascript
    // btn_delete_onclick 이벤트
    this.btn_delete_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
    {
        if (this.gfn_IsNull(this.fv_boardId)) {
            this.alert("삭제할 게시글 정보가 없습니다.");
            return;
        }

        if (this.confirm("정말로 삭제하시겠습니까?")) {
            var strUrl = "http://localhost:8080/api/board/" + this.fv_boardId; // Spring Boot API 주소

            this.transaction(
                "tr_board_delete",
                strUrl,
                "",
                "",
                "",
                "fn_callback",
                false,
                0,
                "DELETE" // HTTP Method 지정 (DELETE)
            );
        }
    };
    ```

## 5. 목록 화면과 상세 화면 연동

`frm_board_list`에서 `btn_new` 클릭 시 신규 등록 모드로, `grd_board` 더블클릭 시 수정 모드로 `frm_board_detail`을 띄우도록 수정합니다.

1.  **`frm_board_list` 스크립트 수정**: `frm_board_list`의 `btn_new_onclick`과 `grd_board_oncelldblclick` 함수를 수정합니다.

    ```javascript
    // frm_board_list.xfdl Script

    // [새 글] 버튼 클릭 이벤트
    this.btn_new_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
    {
        this.gfn_openDetailForm(null, "insert"); // 신규 등록 모드
    };

    // grd_board.oncelldblclick 이벤트 (수정)
    this.grd_board_oncelldblclick = function(obj:nexacro.Grid,e:nexacro.GridClickEventInfo)
    {
        var nBoardId = this.ds_board_list.getColumn(e.row, "id");
        if (this.gfn_IsNull(nBoardId)) {
            return;
        }
        this.gfn_openDetailForm(nBoardId, "update"); // 수정 모드
    };

    // 상세 Form을 띄우는 공통 함수 (팝업으로 띄우는 예시)
    this.gfn_openDetailForm = function(boardId, mode)
    {
        var objParam = { boardId: boardId, mode: mode }; // 상세 Form으로 전달할 파라미터
        var sPopupId = "popup_board_detail";
        var sUrl = "Base::frm_board_detail.xfdl"; // 상세 Form 경로
        var sOption = "width=800,height=600,showtitlebar=true,titletext=게시글 상세";

        this.gfn_openPopup(sPopupId, sUrl, objParam, sOption, "fn_popup_callback");
    };

    // 팝업 콜백 함수
    this.fn_popup_callback = function(sPopupId, sReturn)
    {
        if (sPopupId == "popup_board_detail") {
            if (sReturn == "save" || sReturn == "delete") {
                this.fn_search(); // 상세 화면에서 저장/삭제 후 목록 재조회
            }
        }
    };

    // 팝업 오픈 공통 함수 (프로젝트 공통 스크립트에 정의)
    this.gfn_openPopup = function(sPopupId, sUrl, objParam, sOption, sCallbackFunc)
    {
        var objNewForm = new nexacro.Form();
        objNewForm.init(sPopupId, 0, 0, 0, 0, null, null);
        objNewForm.set_url(sUrl);
        objNewForm.set_openalign("center,middle");
        objNewForm.set_showtitlebar(true);
        objNewForm.set_titletext("팝업");

        // 파라미터 전달
        if (objParam) {
            for (var p in objParam) {
                if (objParam.hasOwnProperty(p)) {
                    objNewForm.set_formscrolltype("none");
                    objNewForm[p] = objParam[p];
                }
            }
        }

        objNewForm.showModal(this.getOwnerFrame(), objParam, this, sCallbackFunc);
    };
    ```

2.  **`frm_board_detail` 스크립트 수정**: `btn_close` 클릭 시 팝업을 닫고, 저장/삭제 후에는 부모 Form에 알림을 보냅니다.

    ```javascript
    // frm_board_detail.xfdl Script

    // [닫기] 버튼 클릭 이벤트
    this.btn_close_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
    {
        this.close(); // Form 닫기
    };

    // 저장/삭제 콜백 함수에서 부모 Form에 결과 전달
    // (fn_callback 함수 내부에 추가)
    // ...
    else if (strSvcID == "tr_board_save")
    {
        this.alert("게시글이 성공적으로 저장되었습니다.");
        this.close("save"); // 저장 후 Form 닫고, 부모에 "save" 문자열 전달
    }
    else if (strSvcID == "tr_board_delete")
    {
        this.alert("게시글이 성공적으로 삭제되었습니다.");
        this.close("delete"); // 삭제 후 Form 닫고, 부모에 "delete" 문자열 전달
    }
    // ...
    ```

## 오늘의 과제
- [ ] `frm_board_detail.xfdl` Form 생성 및 컴포넌트 배치, 데이터 바인딩
- [ ] 상세 조회, 등록/수정, 삭제 기능 구현 및 Spring Boot 서버와 연동 확인
- [ ] 목록 화면과 상세 화면을 팝업으로 연동하여 전체 CRUD 흐름 테스트
