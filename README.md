# TOPIK Mate - 운영자 페이지(demo)

운영자의 로컬에 있는 문제 데이터 셋과 멀티미디어 파일을 데이터베이스에 적재하기 위한 운영자 페이지입니다.


문제 데이터셋(csv)과 멀티미디어 파일이 들어있는 폴더를

웹을 통해 업로드하면 csv 파일은 json으로 변환되어 Firebase cloud database에 적재되고,

멀티미디어 파일(이미지, 오디오)은 Firebase Storage에 적재됩니다.

------------------------------------


1. Git clone
```
# 방법1 - 각 브랜치가 갖고 있는 모든 파일들을 다 fetch하게 됨
git clone --branch admin-server https://github.com/yujin37/TOPIK_Mate.git

# 방법2 - 특정한 브랜치의 파일들만 fetch하고 다른 브랜치들에서는 fetch를 하지 않음
git clone --branch admin-server --single-branch https://github.com/yujin37/TOPIK_Mate.git
```

2. 필요한 패키지 다운로드
```
npm install
```

3. Firebase SDK 적용

3-1. Firebase 프로젝트에 웹 앱 등록
![화면 캡처 2023-04-13 103526](https://user-images.githubusercontent.com/55731054/235166482-da066003-0876-4b9c-abd9-a3e470fce6f8.png)

![화면 캡처 2023-04-13 103551](https://user-images.githubusercontent.com/55731054/235166490-28c8abeb-2d53-43c1-b160-4993c6950dc7.png)

3-2. 앱 등록 및 Firebase SDK(Software Development Kit) 추가

앱 이름을 등록 후, 프로젝트 루트 디렉토리에 비어 있는 config.js 파일을 생성하세요!
config.js 파일에는 아래 사진의
"Your web app's Firebase configuration" 이후 코드를 복사하여 붙여넣고 저장합니다!
![화면 캡처 2023-04-13 103631](https://user-images.githubusercontent.com/55731054/235169448-2e0be1ab-0c4f-48e4-8448-06b0508ce638.png)

4. Firebase Admin SDK 생성

4-1. 비공개 키 생성

Firebase 프로젝트의 <b>프로젝트 설정 > 서비스 계정</b> 메뉴로 이동하여, </b>새 비공개 키</b>를 생성합니다.
![화면 캡처 2023-04-13 104446](https://user-images.githubusercontent.com/55731054/235170993-669ebf9e-0f0c-43df-a32c-472509cbada7.png)
![화면 캡처 2023-04-13 104524](https://user-images.githubusercontent.com/55731054/235169462-2533797b-9a85-4b45-ac6c-d4412b9c15e2.png)

4-2. 다운받아진 비공개 키 json 파일의 이름을 <b>serviceAccount.json</b>으로 변경하여 프로젝트 루트 디렉토리 바로 아래 위치시킵니다.
![화면 캡처 2023-04-28 231459](https://user-images.githubusercontent.com/55731054/235172055-68fa3247-61f8-47a5-9838-fde7a2273769.png)

5. 로컬 서버 구동

프로젝트를 clone한 디렉토리로 이동하여 터미널에서 아래 명령어를 수행합니다.

```
node app.js
```

6. http://localhost:3000 접속
![화면 캡처 2023-04-28 231728](https://user-images.githubusercontent.com/55731054/235172680-c0a4ed54-0a44-4768-a0cd-6211e9b201a8.png)
