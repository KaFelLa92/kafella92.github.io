/*
[ 실습13 : 미니 전화번호부 페이지 ] *제출

1. 목표
   - 사용자가 이름, 전화번호, 그리고 간단한 메모를 함께 저장하여 자신만의 상세한 연락처 목록을 만들고, 
   등록된 모든 연락처를 한눈에 볼 수 있는 전화번호부 웹 페이지를 만듭니다.

2. 화면 구성
   - 페이지는 사용자가 정보를 입력하는 **'연락처 등록 영역'**과 
   그 결과를 보여주는 **'연락처 목록 영역'**으로 명확히 구분되어야 합니다.
   - 연락처 등록 영역:
      - 이름 입력: 저장할 사람의 이름을 텍스트로 자유롭게 입력할 수 있어야 합니다. (예: "홍길동")
      - 전화번호 입력: 연락처의 전화번호를 숫자로 입력할 수 있어야 합니다 (예:010-1234-5678)
      - 메모 입력: 해당 연락처에 대한 추가 정보(소속, 관계 등)를 
      텍스트로 입력할 수 있는 칸이 있어야 합니다. (예: "OO회사 부장")
      - 등록 버튼: 이름과 전화번호를 입력한 후, 목록에 추가하기 위한 "등록" 버튼이 있어야 합니다.

   - 연락처 목록 영역:
      - 등록된 모든 연락처 정보를 보여주는 표가 있어야 합니다.
       - 표는 "이름", "전화번호", "메모" 순서의 열로 구성되어야 합니다.

3. 핵심 기능
   - 초기 데이터 표시:
      - 사용자가 페이지에 처음 방문했을 때, 전화번호부 사용법을 쉽게 이해할 수 있도록 
      두 개의 예시 연락처가 목록 표에 기본적으로 표시되어 있어야 합니다.
   - 연락처 등록 기능:
      - 사용자가 '등록 영역'에 이름과 전화번호를 모두 입력하고 "등록" 버튼을 클릭하면, 
      해당 연락처가 '목록 영역' 표의 가장 아래쪽에 새로운 행으로 즉시 추가되어야 합니다.


[ 작업순서 ]
 1. (프) 화면구성(HTML/CSS) -> 필수는 아님.

 2. (백) 데이터모델링
    (1) 저장할 자료들을 모두 찾기
        - 이름, 전화번호, 메모
    (2) 저장할 자료들의 분리 -> 이름, 전화번호, 메모는 묶어도 되는 정보들
    (3) 분리된 자료들끼리 연관관계 -> 분리 안함

3.  (백) 함수(기능)설계
    (1) 연락처 등록 영역 함수   : 등록버튼 클릭했을 때 입력한 세 정보를 배열에 저장한다.
        함수명 :        'addCallNum'
        매개변수 :      x document.querySelecor()로 처리한다.
        리턴값 :        x
        로직 :          1. input에서 입력한 값 가져오기
                        2. 입력값 3개를 객체 구성
                        3. 객체를 가계부목록(배열)에 저장
        실행조건 :      '등록버튼' 클릭(onclick)했을 때
    (2) 연락처 목록 영역 함수   : 등록된 연락처를 출력한다.
        함수명 :        'viewCallNum
        매개변수 :      x
        리턴값 :        x
        로직 :          테이블을 구성한 후, 배열의 정보를 HTML로 출력한다.
        실행조건 :      1. 페이지 열렸을 때 최초 1번 
                        2. 등록성공했을 때(새로고침)                        

4.  (백) 로직
5.  (프/백) 화면 <--> 기능 연동

*/

// [2] 데이터모델링 예시
const numBook = [
    { code: 1, name: 'john', number: '010-4348-7578', memo: 'aCompCEO' },
    { code: 2, name: 'dongjin', number: '010-1234-5678', memo: 'whiteHand' }
];

let lastIndex = numBook.length - 1;
let codeAuto = numBook[lastIndex].code // 초기배열의 마지막 객체 번호

// [3] 기능(함수단위 구현)
// 1. 등록함수 정의 : 등록버튼 onclick이 실행이다.
function addCallNum() {
    console.log(`--- addCallNum in ---`); // 2. 함수 onclick 확인. 성공했으면 다음 단계
    // 3. input으로 입력받은 값 각각 가져오기
    const nameInput = document.querySelector('#nameInput'); // console.log(nameInput);
    const numInput = document.querySelector('#numInput'); // console.log(numInput);
    const memoInput = document.querySelector('#memoInput'); // console.log(memoInput);
    // 4. 마크업 객체에서 입력한 값 가져오기
    const name = nameInput.value; console.log(name);
    const number = numInput.value; console.log(number);
    const memo = memoInput.value; console.log(memo);
    // 5. 원하는 속성 구성으로 객체 만들기 설계: { 코드 : , 이름 : , 전번 : , 메모 : }
        // * 코드번호를 1씩 상승시키는 변수 대입
        codeAuto ++;
    const obj = { code: codeAuto, name: name, number: number, memo: memo };
    // 6. 구성한 객체를 전역(배열)변수에 저장한다.
    numBook.push(obj); console.log(numBook);
    // 7. 새로고침 , 출력함수 재호출
    viewCallNum();
}   // func end

// 2. 목록함수 정의 : 실행조건 1) JS 열렸을 때, 2) 등록 성공
viewCallNum();  // 실행버튼이 없으므로, 확인 위해 초기 1번 함수 호출.
function viewCallNum() {
    console.log(`--- viewCallNum in---`) // 확인.
    // 배열내 객체 1개당 <tr> 1개
    // 3. 어디에    , <tbody id ="numberBody"> 아래에 등록한 자료 출력합니다.
    const numberBody = document.querySelector('#numberBody'); console.log(numberBody); // 호출 확인
    // 4. 무엇을    , 배열내 객체정보 -> html 형식 표현
    // (1) 배열내 모든(for) 객체 정보
    let html = ``;  // html값 출력
    for (let i = 0; i <= numBook.length - 1; i++) { // 배열내 모든 객체 정보 호출
        const obj = numBook[i];   // i번째 객체를 호출
        html += `<tr>
                    <td> ${obj.name} </td>
                    <td> ${obj.number} </td>
                    <td> ${obj.memo} </td>      
                </tr>`
    }   // for end
    // 5. 출력      , innerHTML
    numberBody.innerHTML = html;    // 반복문 이용하여 객체를 HTML 형식으로 표현한 누적 HTMl 대입
}   // func end



