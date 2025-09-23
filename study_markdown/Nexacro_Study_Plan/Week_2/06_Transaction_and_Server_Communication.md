# 2주차 - 4~5일차: 서버 통신 (Transaction)

## 학습 목표
- 넥사크로에서 서버 API를 호출하는 `transaction` 함수의 사용법을 익힌다.
- 서버와 데이터를 주고받는 전체 과정을 이해한다.

## 1. Transaction 이란?

- 넥사크로가 **서버와 비동기(Asynchronous)로 통신**하기 위해 사용하는 기능입니다.
- Spring 서버의 `@RestController` API를 호출하고, 그 결과를 데이터셋으로 받는 역할을 합니다.
- `fetch`나 `axios`와 유사하지만, **데이터셋을 직접 주고받을 수 있도록 최적화**되어 있습니다.

## 2. `transaction` 함수의 주요 파라미터

```javascript
this.transaction(
    "strSvcID",          // 1. 서비스 ID (임의의 Unique한 문자열)
    "strURL",            // 2. 요청할 서버 API 주소
    "strInDatasets",     // 3. 서버로 보낼 데이터셋 ( "전송할_데이터셋_이름=로컬_데이터셋_이름" )
    "strOutDatasets",    // 4. 서버로부터 받을 데이터셋 ( "로컬_데이터셋_이름=응답받을_데이터셋_이름" )
    "strArgument",       // 5. 서버로 보낼 일반 파라미터 (Key=Value 형태)
    "strCallbackFunc"    // 6. 통신 완료 후 실행될 콜백 함수 이름
);
```

- **In/Out Datasets 형식**: `서버에서 사용할 이름=로컬 데이터셋 이름` 입니다. `ds_search=ds_search` 처럼 보통 동일하게 맞춥니다.
- **비동기 처리**: `transaction` 함수는 호출 즉시 다음 코드로 넘어가며, 서버 응답이 오면 지정된 `strCallbackFunc` 함수가 실행됩니다.

## 3. 통신 실습: 공공 데이터 API 호출하기

Spring 서버가 준비되지 않았으므로, 우선 외부에 공개된 [기상청 동네예보 조회서비스](https://www.data.go.kr/data/15059093/openapi.do)를 호출하여 그리드에 날씨 정보를 표시해 봅시다.

1.  **데이터셋 준비**: `ds_weather` 데이터셋을 만들고, API 응답에 맞춰 `category`, `fcstValue`, `fcstTime` 등의 컬럼을 추가합니다.

2.  **화면 준비**: `Button`(btn_search), `Grid`(grd_weather)를 배치합니다. 그리드의 `binddataset`은 `ds_weather`로 설정합니다.

3.  **스크립트 작성**:

    ```javascript
    // [조회] 버튼 클릭 이벤트
    this.btn_search_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
    {
        // 서비스 URL (실제로는 환경설정 등에서 관리)
        var strURL = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

        // 요청 파라미터
        var strArgument = "";
        strArgument += " serviceKey='[발급받은 서비스키]'"; // 공공데이터포털에서 발급받은 키
        strArgument += " pageNo=1";
        strArgument += " numOfRows=100";
        strArgument += " dataType=XML"; // 넥사크로는 XML/JSON 모두 처리 가능
        strArgument += " base_date=20250923";
        strArgument += " base_time=0500";
        strArgument += " nx=55 ny=127";

        this.transaction(
            "getWeather",
            strURL,
            "", // 보낼 데이터셋 없음
            "ds_weather=response.body.items.item", // 응답 데이터의 item 목록을 ds_weather에 담기
            strArgument,
            "fn_callback"
        );
    };

    // 콜백 함수
    this.fn_callback = function(strSvcID, nErrorCode, strErrorMsg)
    {
        if (nErrorCode < 0)
        {
            // 통신 실패 시
            this.alert("통신 실패: " + strErrorMsg);
            return;
        }

        // 통신 성공 시
        if (strSvcID == "getWeather")
        {
            this.alert("총 " + this.ds_weather.getRowCount() + "건의 날씨 정보가 조회되었습니다.");
        }
    };
    ```
    - **`strOutDatasets` 경로**: `response.body.items.item` 처럼 응답 데이터의 구조에 맞춰 원하는 데이터의 경로를 지정할 수 있습니다.

## 2주차 마무리 과제
- [ ] 위 기상청 API 예제를 직접 구현해보기 (서비스키는 [공공데이터포털](https://www.data.go.kr)에서 발급)
- [ ] `transaction` 함수의 각 파라미터가 어떤 의미인지 다시 한번 복습하기
- [ ] 성공 콜백과 실패 콜백의 차이점 이해하기
