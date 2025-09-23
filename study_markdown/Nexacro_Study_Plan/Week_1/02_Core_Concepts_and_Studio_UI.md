# 1주차 - 2~3일차: 핵심 용어 및 넥사크로 스튜디오 탐색

## 학습 목표
- 넥사크로 프로젝트의 기본 구조와 핵심 용어를 이해한다.
- 넥사크로 스튜디오의 주요 패널과 기능에 익숙해진다.

## 1. 넥사크로 핵심 용어

- **Application**: 하나의 넥사크로 프로젝트 결과물(.xadl). 웹으로 치면 하나의 웹사이트 또는 SPA(Single Page Application) 전체에 해당합니다.
- **Form**: 사용자가 실제로 보게 되는 하나의 화면 단위. React의 '페이지 컴포넌트'와 유사합니다.
- **Component**: Form을 구성하는 UI 요소들. `Button`, `Edit`(input), `Grid`(table), `Div`(container) 등이 있습니다. React의 일반적인 '컴포넌트'와 같습니다.
- **Project**: 넥사크로 스튜디오에서 관리하는 개발 단위. 하나의 프로젝트가 하나의 Application을 만듭니다.

## 2. 넥사크로 스튜디오 둘러보기

스튜디오를 실행하고 `File > New > Project`를 선택하여 새 프로젝트를 생성해 보세요. (템플릿은 'Nexacro N' 기본으로 생성)

- **① Project Explorer**: 프로젝트의 전체 파일 구조를 보여주는 탐색기. Form 파일(.xfdl), 이미지, 스크립트 파일 등을 여기서 관리합니다.
- **② Design/Source/Script 탭**:
    - **Design**: Form을 시각적으로 디자인하는 화면 (WYSIWYG)
    - **Source**: 디자인한 Form의 XML 소스 코드. (직접 수정할 일은 거의 없습니다.)
    - **Script**: Form의 로직을 작성하는 JavaScript 코드 편집기. **가장 많이 보게 될 화면입니다.**
- **③ Toolbox**: Form에 추가할 수 있는 컴포넌트 목록. 여기서 원하는 컴포넌트를 드래그 앤 드롭하여 화면에 배치합니다.
- **④ Properties**: 선택한 컴포넌트의 속성을 설정하는 패널. 컴포넌트의 이름(name), 텍스트(text), 색상, 크기, 이벤트 등을 여기서 설정합니다.
- **⑤ Invisible Objects**: 화면에 보이지 않는 객체들을 관리하는 곳. **`Dataset`** 이나 `Transaction` 객체들이 여기에 위치합니다.

![Nexacro Studio Layout](https://docs.tobesoft.com/files/nexacro-n-21/images/ko/8a3e50a8e245414b_1.png)
*(이미지 출처: 투비소프트 공식 문서)*

## 오늘의 과제
- [ ] 새 프로젝트 생성하기
- [ ] Toolbox에서 `Button`, `Edit`, `Static` 컴포넌트를 Form으로 드래그하여 배치해보기
- [ ] Properties 창을 이용해 버튼의 `text` 속성과 `Static`의 `text` 속성 변경해보기
