/*
[실습14: 제품 관리 페이지]
1. 목표
    사용자가 카테고리, 제품명, 가격, 이미지를 포함한 제품 정보를 등록하고, 등록된 모든 제품을 표 형태로 한눈에 확인하며 관리할 수 있는 웹 페이지를 제작합니다.
2. 화면 구성
    페이지는 사용자가 정보를 입력하는 **'제품 등록 영역'**과 등록된 결과를 보여주는 **'제품 목록 영역'**으로 명확히 구분되어야 합니다.
    제품 등록 영역 (<div id="header">):
        카테고리 선택: 미리 정의된 카테고리 목록에서 제품의 분류를 선택할 수 있는 드롭다운 메뉴가 있어야 합니다. (예: '음료', '과자')
        제품명 입력: 등록할 제품의 이름을 텍스트로 입력할 수 있어야 합니다. (예: "코카콜라")
        제품 가격 입력: 제품의 가격을 숫자로 입력할 수 있어야 합니다. (예: 1000)
        제품 이미지 입력: 제품의 사진을 사용자의 컴퓨터에서 파일 형태로 선택하여 첨부할 수 있어야 합니다.
        등록 버튼: 모든 정보를 입력한 후, 목록에 제품을 추가하기 위한 "등록" 버튼이 있어야 합니다.
    제품 목록 영역 (<div id="main">):
        등록된 모든 제품 정보를 보여주는 표(테이블)가 있어야 합니다.
        표는 "이미지", "카테고리명", "상품명", "가격", "등록일", "비고" 순서의 열로 구성되어야 합니다.
        각 제품 항목(행)마다 해당 제품을 관리할 수 있는 "삭제" 버튼과 "수정" 버튼이 포함되어야 합니다.

3. 핵심 기능
    초기 데이터 표시:
        사용자가 페이지에 처음 방문했을 때, 카테고리 선택 메뉴에는 두 개의 예시 카테고리('음료', '과자')가 기본적으로 표시되어 있어야 합니다.
        제품 목록 표에는 사용법을 쉽게 이해할 수 있도록 네 개의 예시 제품이 기본적으로 표시되어 있어야 합니다.

    제품 등록 기능:
        사용자가 '등록 영역'에 카테고리, 제품명, 가격을 모두 입력하고 "등록" 버튼을 클릭하면, 해당 제품이 '목록 영역' 표에 새로운 행으로 즉시 추가되어야 합니다.
        제품 등록 시, 등록 날짜는 현재 날짜로 자동 기록되어야 합니다.
        첨부된 이미지는 목록의 '이미지' 열에 표시되어야 하며, 이미지를 첨부하지 않은 경우 기본 이미지가 대신 표시되어야 합니다.

    제품 관리 기능:
        삭제: 각 제품의 "삭제" 버튼을 클릭하면 해당 제품이 목록에서 즉시 제거되어야 합니다.
        수정: "수정" 버튼을 클릭하면, prompt 창을 통해 새로운 제품명과 가격을 입력받아 해당 제품의 정보를 수정하고 목록을 즉시 갱신해야 합니다.
*/

/*
    
    기획자가 생각하는 코드 vs 개발자가 생각하는 코드
    [작업순서]  -> 100% 예측은 없는 거예요~
        1. [프] 화면스케치(프로토타입. Figma로 처리)
        2. [프] HTML과 CSS 표현
        3. [백] 데이터 모델링
        4. [백] 기능(함수) 설계 (API 명세서)
        5. [백] 구현/로직
        6. [백] 테스트

*/

// [1] 데이터 모델링 샘플
// 1. 카테고리 목록
const categoryList = [{ cno: 1, cname: '음료류' }, { cno: 2, cname: '과자류' }];
let currentCno = 2;  // * 코드를 자동대입하기 위한 현재 코드번호. 샘플 마지막 코드 번호로 초기화함.

// 2. 제품 목록 , 이미지 등록 없을 경우 : https://placehold.co/100x100 경로 샘플
const productList = [
    { pno: 1, cno: 1, pname: '코카콜라', pprice: 1000, pimg: 'https://placehold.co/100x100', pdate: '2025-06-17' },
    { pno: 2, cno: 2, pname: '새우깡', pprice: 1200, pimg: 'https://placehold.co/100x100', pdate: '2025-06-18' },
    { pno: 3, cno: 1, pname: '칠성사이다', pprice: 900, pimg: 'https://placehold.co/100x100', pdate: '2025-06-19' }
];
let currentPno = 3; // * 코드를 자동대입하기 위한 현재 코드번호. 샘플 마지막 코드 번호로 초기화함.
// * 확인차
console.log(categoryList);
console.log(productList);



/* 

    [2] 데이터 모델링 샘플
    데이터 모델링 단계 -> 위에서 처리함
    (1) 저장할 자료 찾기 : 카테고리넘버, 카테고리종류, 제품넘버, 제품명, 제품가격, 제품썸네일, 제품등록일
    (2) 저장할 자료의 분리 : 
            카테고리목록 : 카테넘버, 카테종류
            제품목록 : 제품넘버, 카테넘버, 제품명, 제품가격, 제품썸네일, 
    (3) 분리된 자료의 연관관계 : 

    필요한 함수 목록
    (1) 카테고리출력함수 : 카테고리목록의 객체정보를 <select>에 출력하는 함수
    (2) 제품 등록함수 :
    (3) 제품목록 출력함수 :
    (4) 제품 삭제함수 :
    (5) 제품 수정함수 : 

*/

// 1. 카테고리 출력함수 : 실행조건 : 페이지 열렸을 때 초기 1회 실행.
categoryPrint();
function categoryPrint() {
    console.log(`categoryList in`);
    // 1. 어디에 , <select id="categoryInput">
    const categoryInput = document.querySelector('#categoryInput'); console.log(categoryInput);
    // 2. 무엇을 , 카테고리목록(배열)내 객체정보를 하나씩 HTML 형식으로
    let html = '<option value="" disabled selected> 카테고리 선택하세요. </option>';
    for (let i = 0; i <= categoryList.length - 1; i++) {    // i번째 카테고리리스트 객체 꺼내기        
        const category = categoryList[i]; console.log(category);
        html += `<option value="${category.cno}"> ${category.cname} </option>`
        // ` 백틱 주의
    }
    // 3. 출력
    categoryInput.innerHTML = html; console.log(html);
}   // func end

// 2. 제품 등록함수 : 실행조건 : <등록버튼> onclick했을 때

function productAdd() {
    console.log(`addProduct in`)    // 확인 완료
    // 1. 어디에 , <button class="btnAdd">
    const productInput = document.querySelector('.btnAdd'); console.log(productInput);
    // 2. input(입력 마크업 객체) 값을 각각 가져오기
    const categoryInput = document.querySelector('#categoryInput'); console.log(categoryInput);
    const pnameInput = document.querySelector('#pnameInput'); console.log(pnameInput);
    const ppriceInput = document.querySelector('#ppriceInput'); console.log(ppriceInput);
    const pimgInput = document.querySelector('#pimgInput'); console.log(pimgInput);
    // 3. input에서 입력값 가져오기
    const cno = categoryInput.value; console.log(cno)
    const pname = pnameInput.value; console.log(pname)
    const pprice = ppriceInput.value; console.log(pprice)
    const pimg = pimgInput.files[0]; console.log(pimg)
    // 첨부파일은 value 대신에 files[0] : 선택된 첨부파일의 첫번째 파일객체 가져오기.

    // * 현재 날짜/시간 구하기 == new Date() 객체
    let year = new Date().getFullYear(); // 현재 연도 반환 함수.
    let month = new Date().getMonth() + 1; // 현재 월 반환 함수 * 1월이 0부터 시작. +1 넣어라
    month = month < 9 ? `0${month}` : month; // 월이 한 자리수면 앞에 0 붙여라.
    let day = new Date().getDate(); // 현재 일 반환 함수
    day = day < 9 ? `0${day}` : day; // 일이 한 자리수면 앞에 0 붙여라.
    let pdate = `${year}-${month}-${day}`; // ` 백틱 주의                           
    console.log(pdate)

    // 4. 유효성검사
    // * 입력한 값이 없으면 등록 실패
    if (cno == '' || pname == '' || pprice == '') {  // 카테고리, 제품명, 가격 입력 안하면 출력 안해
        alert('비어있는 항목이 있습니다. [실패]');
        return; // 반환값 없는 함수 종료 : 아래코드는 실행되지 않는다.
    }

    // 5. 여러 데이터 객체로 구성하기
    const product = {
        pno: ++currentPno, // 현재 제품코드에 1 증가 후 구성
        cno: Number(cno), // 카테고리 코드는 숫자 리터럴로 변환
        pname: pname, pprice: Number(pprice), // 제품가격은 숫자형 타입변환
        pimg: pimg ? URL.createObjectURL(pimg) : 'https://placehold.co/100x100',
        // URL.createobjectURL() : 선택한 파일객체의 url 주소 생성 함수
        pdate: pdate
    }; console.log(product);
    // 6. 구성한 객체를 배열에 저장
    productList.push(product); console.log(productList);
    // 7. 기타등등
    categoryInput.value = '';
    pnameInput.value = '';
    ppriceInput.value = '';
    alert('[성공] 제품등록')
    productPrint(); // [ 다시 제품 출력함으로써 새로고침 ] '렌더링'
}   // func end : 등록함수 끝

// 콘솔로그로 계속 중간점검해서 오류 있는지 확인할 것

// 3. 제품목록 출력함수 , 실행조건 : (1) 페이지 열렸을 때 (2) 등록/삭제/수정 처리했을 때
productPrint(); // 페이지 열렸을 때 초기 1번 함수 실행
function productPrint() {
    console.log(`productPrint in`);
    // 배열 내 객체 1개 당 <tr> 1개
    // (1) 어디에 : <tbody id ="productBody">아래에 등록한 자료(제품목록) 출력하기
    const productBody = document.querySelector('#productBody'); console.log(productBody)
    // (2) 무엇을 : 배열 내 객체 정보를 html 형식으로 표현하기
    let html = '';
    for (let i = 0; i <= productList.length - 1; i++) {
        const product = productList[i];
        // 현재 제품 저장된 카테고리번호로 카테고리객체구하기.
        const category = getCategory( product.cno );    
        // cno를 매개변수로 넣어서 카테고리 객체 반환. 아래 ${getCategory(product.cno).cname} 대신 ${category.cname} 넣으면 돌아감.
        html += `<tr>
                    <td> <img src="${product.pimg}" /> </td>
                    <td> ${getCategory(product.cno).cname} </td>
                    <td> ${product.pname} </td>
                    <td> ${product.pprice.toLocaleString()} </td>
                    <td> ${product.pdate} </td>
                    <td> <button class="btnDelete" onclick="productDelete( ${product.pno} )"> 삭제 </button> 
                    <button class="btnEdit" onclick="productEdit( ${product.pno} )"> 수정 </button> </td>       
                </tr>`;
        // html 출력이 상기로 옮겨졌으므로, 삭제 수정 관련된 온클릭 함수 주소도 위에 적는다.
        // pno를 함수의 매개변수로 입력한다. 
        // 카테고리번호cno를 getCategory 함수로 묶어준다.
    } // for end
    // (3) 출력 : 
    productBody.innerHTML = html; console.log(html);
}   //func end : 출력함수 끝


// 4. 제품 삭제함수 : 배열내 삭제할 객체를 찾아서 .splice 한다. < 매개변수 : 제품코드 > 실행조건 : [삭제버튼] onclick했을 때

function productDelete(pno) {
    console.log('잘가라');
    console.log(pno);
    // (1) 삭제할 번호의 객체를 찾는다. for
    for (let i = 0; i <= productList.length - 1; i++) {
        if (productList[i].pno == pno) { // 만약 i번째 제품코드와 삭제할 제품코드가 같으면
            productList.splice(i, 1); // 해당 i에서 요소 1개 삭제
            alert('[성공] 제품 삭제') // 안내
            productPrint(); // 삭제 이후 제품목록 새로고침/렌더링
            return; // 목표 이뤘으니 함수 종료.
        }
    } // for end
    // (2) 못 찾았다.
    alert('[오류] 제품번호 불일치')
}   // func end : 삭제함수 끝

// 5. 제품 수정함수 : 새로운 정보를 받아 배열내 수정할 객체를 찾아 대입한다. < 매개변수 : 제품코드 > 실행조건 : [수정버튼] onclick했을 때

function productEdit(pno) {
    console.log('고쳐드립니다');
    console.log(pno);
    // (1) 수정할 번호의 객체를 찾는다. for
    for (let i = 0; i <= productList.length - 1; i++) {
        if (productList[i].pno == pno) { // i번째 제품코드와 수정할 제품코드와 같으면
            const pname = prompt('수정할 제품명 : ');
            const pprice = prompt('수정할 제품가격 : ');
            productList[i].pname = pname; // 입력받은 값으로 수정
            productList[i].pprice = Number(pprice); // 입력받은 값으로 수정
            alert('[성공] 제품 수정') // 안내
            productPrint(); // 제품목록 새로고침
            return; // 목표를 이뤘으니 함수 강제 종료.
        } // if end
    } // for end
    // (2)
    alert('[실패] 제품 수정');
} // func end : 수정함수 끝

// return은 함수 밖으로 나감. break는 for문 밖으로 나감.

// 6. 카테고리번호(cno)에 해당하는 카테고리객체 1개 반환 함수
// cname값을 cno값으로 리턴하기 위함

function getCategory(cno) {
    console.log(' 카테고리함수 체크 ');
    console.log(cno);
    // (1) 매개변수(cno)와 동일한 카테고리객체 찾기
    for (let i = 0; i <= categoryList.length - 1; i++) {
        if (categoryList[i].cno == cno) { // 만일 i번째 cno와 cno가 같으면
            return categoryList[i]; // 찾은 객체를 반환한다.
        }   // if end
    }   // for end
    // (2) 못찾았다.
    return null;    //
}   // func end

// 콘솔로그로 계속 중간점검해서 오류 있는지 확인할 것22

// CRUD를 배워본 것임. create reed update delete

