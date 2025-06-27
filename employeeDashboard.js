/*

[ 작업순서 ]
1. [프] 화면스케치
2. [프] HTML, CSS(선택)
3. [백] 데이터모델링
4. [백] 기능(함수) 설계
5. [백] 구현/로직
6. [백] 테스트

CSS는 선택

*/

/*

[ 실습15 - 인사 관리 대시보드 ] * 제출
1. 목표
    부서, 사원, 그리고 휴가 신청 정보를 하나의 웹 페이지에서 통합적으로 관리하는 대시보드를 제작합니다.
    사용자는 부서 등록/삭제/수정, 사원 등록/삭제/수정, 휴가 신청/취소 기능을 직관적으로 사용할 수 있어야 합니다.

2. 화면 구성
    페이지는 '부서 관리(왼쪽)', '사원 관리(가운데)', '휴가 관리(오른쪽)' 라는 3개의 명확한 컬럼으로 구성되어야 합니다.
    (flex하라는 뜻)
    부서 관리 영역:
        부서 등록:  
            새로운 부서의 이름을 텍스트로 입력할 수 있는 입력창과 "추가" 버튼이 있어야 합니다.
        부서 목록:  
            등록된 모든 부서 정보를 보여주는 표(테이블)가 있어야 합니다.
            표는 "부서명"과 "관리" 열로 구성됩니다.
            각 부서 항목마다 해당 부서를 수정하고 삭제할 수 있는 버튼이 제공되어야 합니다.

    사원 관리 영역:
        사원 등록:
            사원의 이름과 직급을 입력하는 텍스트 필드가 있어야 합니다.
            등록된 부서 목록에서 소속될 부서를 선택할 수 있는 드롭다운 메뉴가 있어야 합니다.
            사원의 사진을 등록할 수 있는 파일 선택 버튼이 있어야 합니다.
        사원 목록:
            등록된 모든 사원 정보를 보여주는 표(테이블)가 있어야 합니다.
            표는 "사진", "이름", "부서", "직급", "관리" 순서의 열로 구성됩니다.
            각 사원 항목마다 해당 사원의 이름과 직급을 수정하고, 사원 정보를 삭제할 수 있는 버튼이 제공되어야 합니다.

    휴가 관리 영역:
        휴가 신청:
            등록된 사원 목록에서 휴가를 신청할 사원을 선택하는 드롭다운 메뉴가 있어야 합니다.
            휴가 시작일과 종료일을 선택할 수 있는 날짜 입력 필드가 있어야 합니다.
            휴가 사유를 텍스트로 간단히 기입할 수 있는 입력창이 있어야 합니다.
        휴가 신청 전체 목록:
            제출된 모든 휴가 신청 내역을 보여주는 목록이 있어야 합니다.
            각 항목에는 신청한 사원의 이름, 휴가 기간, 사유가 표시되어야 합니다.
            각 휴가 신청 항목마다 해당 신청을 취소할 수 있는 "신청취소" 버튼이 제공되어야 합니다.

3. 핵심 기능
    초기 데이터 표시:
        모든 데이터(부서, 사원, 휴가)는 웹 페이지가 실행되는 동안에만 유지되는 전역 배열을 통해 관리됩니다. 페이지를 새로고침하면 데이터는 초기 샘플 상태로 돌아갑니다.
        사용자가 처음 페이지에 접속했을 때, 시스템 사용법을 쉽게 파악할 수 있도록 부서, 사원, 휴가 신청에 대한 예시 데이터가 기본적으로 화면에 표시되어 있어야 합니다.

    부서 관리 기능:
        등록: "추가" 버튼 클릭 시, 입력된 부서가 부서 목록과 사원 등록의 부서 선택 메뉴에 즉시 반영되어야 합니다. 이미 존재하는 부서명은 등록되지 않아야 합니다.
        수정: "수정" 버튼 클릭 시, prompt 대화상자가 나타나 새로운 부서명을 입력받고, 입력 완료 시 목록에 즉시 반영되어야 합니다.
        삭제: "삭제" 버튼 클릭 시, 해당 부서가 목록에서 제거되어야 합니다. 단, 해당 부서에 소속된 사원이 한 명이라도 있을 경우, 삭제할 수 없다는 경고 메시지를 표시해야 합니다.

    사원 관리 기능:
        등록: 사원 정보를 입력하고 "등록" 버튼 클릭 시, 사원 목록과 휴가 신청의 사원 선택 메뉴에 즉시 추가되어야 합니다. 사진을 첨부하면 해당 사진이, 첨부하지 않으면 기본 이미지가 표시되어야 합니다.
        수정: "수정" 버튼 클릭 시, prompt 대화상자를 통해 새로운 이름과 직책을 입력받아 해당 사원의 정보를 수정하고 목록을 즉시 갱신해야 합니다.
        삭제: "삭제" 버튼 클릭 시, 해당 사원이 목록에서 제거되며, 관련된 모든 휴가 신청 기록도 함께 삭제되어야 합니다.

    휴가 관리 기능:
        신청: 휴가 정보를 입력하고 "신청" 버튼 클릭 시, 휴가 신청 목록에 즉시 추가되어야 합니다.
        취소: "신청취소" 버튼 클릭 시, 해당 휴가 신청 내역이 목록에서 제거되어야 합니다.

*/

/* 

[ 데이터 모델링 ]

 1. 부서관리 (왼쪽)
    (1) 부서 등록 - 텍스트(부서명) , 버튼(등록)
    (2) 부서 목록 - 부서명 , 버튼(수정 , 삭제)

 2. 사원관리 (가운데)
    (1) 사원 등록 - 드롭다운(부서) , 텍스트(이름) , 텍스트(직급) , 이미지(사진) , 버튼(사진파일선택)
    (2) 사원 목록 - 테이블(사진, 이름, 부서, 직급, 관리) 버튼(수정 , 삭제)

 3. 휴가관리 (오른쪽)
    (1) 휴가 신청 - 드롭다운(사원이름) , 날짜(휴가시작) , 날짜(휴가종료) 텍스트(휴가사유)
    (2) 전체 목록 - 텍스트(이름 , 휴가사유) , 날짜(휴가시작-휴가종료) , 버튼(신청취소)

*/

/*

[ 함수 처리 ]

 1. 부서 관리
    (1) 부서 등록함수       -> departAdd()
    (2) 부서 목록 출력함수  -> departPrint()
    (3) 부서 목록 수정함수  -> departEdit()
    (4) 부서 목록 삭제함수  -> departDelete()

 2. 사원 관리
    (1) 사원 등록함수       -> employAdd()
    (2) 사원 등록 미리보기함수 -> employPriview()
    (3) 사원 목록 출력함수  -> employPrint()
    (4) 사원 목록 수정함수  -> employEdit()
    (5) 사원 목록 삭제함수  -> employDelete()

 3. 휴가 관리
    (1) 휴가 신청함수       -> vacaApp()
    (2) 휴가 목록 출력함수  -> vacaPrint()
    (3) 휴가 목록 취소함수  -> vacaCancel()

 */


const departList = [
    { dno: 1, dname: '마케팅' },
    { dno: 2, dname: '재무부' },
    { dno: 3, dname: '지원부' },
    { dno: 4, dname: '개발부' },
    { dno: 5, dname: '영업부' }
];
let currentDno = 5; // * 코드 자동대입을 위한 현재 샘플 코드번호.

const employList = [
    { eno: 1, dno: 2, ename: '노채무', erank: '이사', eimg: 'https://placehold.co/100x100', edate: '2025-06-20' },
    { eno: 2, dno: 4, ename: '박애견', erank: '차장', eimg: 'https://placehold.co/100x100', edate: '2025-06-20' },
    { eno: 3, dno: 3, ename: '오지원', erank: '대리', eimg: 'https://placehold.co/100x100', edate: '2025-06-20' },
    { eno: 4, dno: 1, ename: '강홍보', erank: '주임', eimg: 'https://placehold.co/100x100', edate: '2025-06-20' },
];
let currentEno = 4; // * 현재 샘플 코드번호

const vacaList = [
    { vno: 1, eno: 4, vstart: '2025-06-22', vend: '2025-06-28', vinfo: '개인사정' },
    { vno: 2, eno: 1, vstart: '2025-05-19', vend: '2025-06-23', vinfo: '친구결혼식' },
    { vno: 3, eno: 2, vstart: '2025-06-15', vend: '2025-06-27', vinfo: '급체' }
];

let currentVno = 3;



// 1-1 부서 등록함수 : 실행조건 : 등록버튼 눌렀을 때

function departAdd() {
    console.log(`departAdd XXOK`)
    // (1) input(입력 마크업 객체) 값을 각각 가져오기
    const departInput = document.querySelector('#departInput'); console.log(departInput)
    // (2) input(입력 마크업 객체)의 입력값 가져오기
    const dname = departInput.value; console.log(dname);
    // (3) 유효성 검사 -> 입력한 값이 있는지 체크
    if (dname == '') { // 부서명 입력 안 했을 때
        alert('부서명을 입력 후 등록해주세요.')
        return; // 
    }
    // (4) 여러 데이터 객체 구성하기
    const depart = {
        dno: ++currentDno, // 현재 부서코드에 1증가 후 구성
        dname: dname    // 문자열은 그대로 씁니다.
    }

    // (5) 객체 배열에 저장하기
    departList.push(depart); console.log(departList);

    // (6) 성공했을 때
    alert('부서명이 등록되었습니다.')
    departInput.value = ''; // 입력창 초기화해서 무한 반복 막기
    departPrint();  // 새로 렌더링하는 출력함수. 이제 출력함수에서 HTMl 구성하면 됨.
}

// 1-2 부서 목록 출력함수 : 실행조건 : 새로고침 and 부서 등록함수 실행되었을 때
departPrint(); // 체크
function departPrint() {
    console.log(`departPrint XXOK`)
    // (1) 어디에 출력되는가 : <div id="departBox"> 밑에 부서 목록 출력하기
    const departBox = document.querySelector('#departBox'); console.log(departBox)
    // (2) 무엇을 출력하는가 : 객체 정보를 html 형식으로 표현하기
    let html = '';  // html 변수 넣기
    for (let i = 0; i <= departList.length - 1; i++) {
        const depart = departList[i]; console.log(depart); // 부서리스트의 인덱스를 부서 상수로
        html += `<div class="departFlex">
                        ${depart.dname} <button class="btnEdit" onclick="departEdit(${depart.dno})"> 수정 </button>
                        <button class="btnDelete" onclick="departDelete(${depart.dno})"> 삭제 </button>
                    </div>`;
    }   // ` 백틱 위치 잘 봐라
    // (3) 출력
    departBox.innerHTML = html; // console.log(html);

    // (4) 사원등록 항의 부서 목록 출력
    const employInput = document.querySelector('#employInput ');
    html += `<option value="" disabled selected> 부서를 선택하세요. </option>`
    for (let i = 0; i <= departList.length - 1; i++) {
        const employ = departList[i];
        html += `<option value="${employ.dno}"> ${employ.dname} </option> `
    }
    employInput.innerHTML = html;

}

// 1-3 부서 목록 수정함수 : 새 정보를 받아 배열 내 수정 객체 찾아 대입. <매개변수 : 부서코드> 실행조건 : [수정버튼] onclick했을 때
function departEdit(dno) {  // depart 넘버를 매개함수로 입력
    console.log(`departEdit XXOK`)
    console.log(dno);
    // (1) 수정할 번호의 객체를 찾는다. for문에서 if문으로 부서 코드가 같은지 확인
    for (let i = 0; i <= departList.length - 1; i++) {
        let depart = departList[i]
        if (depart.dno == dno) { // 부서리스트의 인덱스 숫자가 상수 dno 숫자와 같을 때
            const dname = prompt('수정할 부서명을 입력하세요.');
            depart.dname = dname; // 프롬프트에 적은 문자열로 변경.
            alert('부서명 수정 완료.') // 안내
            departPrint(); // 부서목록 새로고침
            return; // 함수 강제 종료.
        }   // if end
    }   // for end
    // (2) 수정할 번호가 없을 경우
    alert('없는 부서명입니다.');
} // func end

// 1-4 부서 목록 삭제함수 : 배열내 삭제할 개체를 찾아 .splice 한다. <매개변수 : 부서코드> 실행조건 : [삭제버튼] onclick했을 때
function departDelete(dno) { // depart 넘버 매개함수로 입력
    console.log(`departDelete XXOK`)
    console.log(dno);
    // (1) 삭제할 번호의 객체를 찾는다. for문 if문 splice 활용
    for (let i = 0; i <= departList.length - 1; i++) {
        if (departList[i].dno == dno) { // i번째 부서코드가 삭제할 부서코드와 같으면
            departList.splice(i, 1); // 해당 i(인덱스)에서 1개 요소 삭제
            alert(`부서명 삭제 완료`) // 안내
            departPrint(); // 부서목록 새로고침
            return; // 함수 강제 종료
        }   // if end
    }   // for end
    // (2) 삭제할 번호가 없는 경우
    alert('삭제할 수 없습니다.');
}   // func end

// 2-1 사원 등록함수 : 실행조건 : 등록버튼 눌렀을 때 
function employAdd() {
    console.log(`employAdd XXOK`);
    // (1) input(입력 마크업 객체) 값을 가져오기
    const employInput = document.querySelector('#employInput'); console.log(employInput);
    const nameInput = document.querySelector('#nameInput'); console.log(nameInput);
    const rankInput = document.querySelector('#rankInput'); console.log(rankInput);
    const imgInput = document.querySelector('#imgInput'); console.log(imgInput);
    // (2) input 입력값 가져오기
    const dno = employInput.value; console.log(dno);    //  부서 넘버를 가져오기
    const ename = nameInput.value; console.log(ename);  // 직원명
    const erank = rankInput.value; console.log(erank);  // 직급명
    const eimg = imgInput.files[0]; console.log(eimg);     // 첨부파일은 files[0] : 첫 번째 파일 객체
    // (3) 날짜 시간 구하기 
    let year = new Date().getFullYear(); // 현재 연도 반환 함수.
    let month = new Date().getMonth() + 1; // 현재 월 반환 함수 * 1월이 0부터 시작하므로 +1 넣기
    month = month < 9 ? `0${month}` : month; // 삼항연산자로 month값 9보다 작을 경우 앞에 0을 넣으세요
    let day = new Date().getDate(); // 현재 일 반환 함수
    day = day < 9 ? `0${day}` : day; // 일이 한 자리 수면 앞에 0 붙여!
    let edate = `${year}-${month}-${day}`; // ` 백틱 주의하시오
    console.log(edate)

    // (4) 유효성검사
    if (dno == '' || ename == '' || erank == '') {   // 부서, 이름, 직급 입력 안되어있으면 출력 안함
        alert('정보를 입력하세요.');
        return; // 아래 코드를 생략하고 함수 종료
    }
    // (5) 데이터 객체화
    const employ = {    // 필요한 데이터 객체로 묶기
        eno: ++currentEno,     // 현재 사원코드에 1 증가 후 구성하기
        dno: Number(dno),  // 부서코드는 리터럴
        ename: ename,
        erank: erank,
        eimg: eimg ? URL.createObjectURL(eimg) : 'https://placehold.co/100x100',
        edate: edate //연월일 입력 위에 넣기
    }; console.log(employ);
    // (6) 객체 배열에 저장
    employList.push(employ); console.log(employList);
    // (7) 기타
    alert('사원 등록되었습니다.')

    // (8) 미리보기 기능
    const employAddRight = document.querySelector('.employAddRight')
    // 부서넘버로 부서명 출력
    for (let i = 0; i <= departList.length - 1; i++) {
        if (departList[i].dno == employ.dno) {
            dname = departList[i].dname;
            break;
        }

    }
    let html = '';
    html += `<img id="imgPreview" src="${employ.eimg}" alt="employPhoto" />
                        <p id="textPreview"> 사원번호: 00${employ.eno} <br /> 부서: ${dname} <br /> 성함: ${employ.ename} <br /> 직급: ${employ.erank} <br /> 등록일:
                            ${employ.edate} </p>`

    employAddRight.innerHTML = html;
    employPrint();
}

// (3) 사원 목록 출력함수  -> employPrint()
employPrint();
function employPrint() {
    const employBody = document.querySelector('#employBody')
    let html = '';
    for (let i = 0; i <= employList.length - 1; i++) {
        const employ = employList[i];
        let dname = '';
        for (let j = 0; j <= departList.length + 1; j++) {
            if (departList[j].dno === employ.dno) {
                dname = departList[j].dname;
                break;
            }
        }
        html += `<tr>
                    <td> <img src="${employ.eimg}" /> </td>
                    <td> ${employ.ename} </td>
                    <td> ${dname} </td>
                    <td> ${employ.erank} </td>
                    <td> <button class="btnEdit" onclick="employEdit(${employ.eno})"> 수정 </button> </td>
                    <td> <button class="btnDelete" onclick="employDelete(${employ.eno})"> 삭제 </button> </td>
                 </tr>`
    }
    employBody.innerHTML = html;

    // 휴가등록 항의 사원명 출력
    const employName = document.querySelector('#employName');
    let html2 = `<option value="" disabled selected> 사원명 </option>`;
    for (let i = 0; i <= employList.length - 1; i++) {
        const employ = employList[i];
        html2 += `<option value="${employ.eno}"> ${employ.ename} </option> `
    }

    employName.innerHTML = html2;
}

//(4) 사원 목록 수정함수
function employEdit(eno) {
    for (let i = 0; i <= employList.length - 1; i++) {
        if (employList[i].eno == eno) {
            const ename = prompt('수정할 사원명을 입력하세요.')
            let dname = prompt('수정할 부서명을 입력하세요.')
            const erank = prompt('수정할 직급명을 입력하세요.')
            let foundDno = null;
            for (let j = 0; j <= departList.length - 1; j++) {
                if (departList[j].dname == dname) {
                    foundDno = departList[j].dno
                    break;
                }
            }

            if (foundDno == null) {
                alert('입력한 부서명이 존재하지 않습니다.');
                return;
            }

            employList[i].ename = ename;
            employList[i].dno = foundDno;
            employList[i].erank = erank;
            alert('사원 목록 수정되었습니다.')
            employPrint();
            return;
        }

    }
    alert('해당 사원 목록을 수정할 수 없습니다.')
}

//(5) 사원 목록 삭제함수
function employDelete(eno) {
    for (let i = 0; i <= employList.length - 1; i++) {
        if (employList[i].eno == eno) {
            employList.splice(i, 1);
            alert('사원 목록 삭제되었습니다.')
            employPrint();
            return;
        }
    }
    alert('해당 사원 목록을 삭제할 수 없습니다.');

}

// 3-1 휴가 신청함수       -> vacaApp()

function vacaApp() {
    const employName = document.querySelector('#employName')
    const vacaStart = document.querySelector('#vacaStart')
    const vacaEnd = document.querySelector('#vacaEnd')
    const vacaInput = document.querySelector('#vacaInput')

    const ename = employName.value;
    const vstart = vacaStart.value;
    const vend = vacaEnd.value;
    const vinfo = vacaInput.value;

    const vacation = {
        vno: ++currentVno,
        eno: Number(ename),
        vstart,
        vend,
        vinfo
    }

    vacaList.push(vacation);
    alert('휴가 신청 완료')
    employName.value = '';
    vacaStart.value = '';
    vacaEnd.value = '';
    vacaInput.value = '';
    vacaPrint();

}

// 3-2 휴가 목록 출력함수  -> vacaPrint()

vacaPrint();
function vacaPrint() {
    const vacaBox = document.querySelector('#vacaBox');
    let html = '';

    for (let i = 0; i <= vacaList.length - 1; i++) {
        const vaca = vacaList[i]
        let ename = '';
        for (let j = 0; j <= employList.length - 1; j++) {
            if (employList[j].eno == vaca.eno) {
                ename = employList[j].ename;
                break;
            }
        }
        html += `<tr>
                    <td> ${ename} </td>
                    <td> ${vaca.vstart} </td>
                    <td> ${vaca.vend} </td>
                    <td> ${vaca.vinfo} </td>
                    <td> <button class="btnCancel" onclick="vacaCancel(${vaca.vno})"> 신청취소 </button> </td>
                </tr>`
    }
    vacaBox.innerHTML = html;
}


// 3-3 휴가 목록 신청 취소함수  -> vacaCancel()

function vacaCancel(vno) {
    for(let i = 0; i <= vacaList.length - 1; i++){
        if(vacaList[i].vno == vno){
            vacaList.splice(i , 1);
            alert('휴가 신청이 취소되었습니다.')
            vacaPrint();
            return;
        }
    }
    alert('휴가 신청을 취소할 수 없습니다.')
}