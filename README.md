# Github Issue Viewer
GitHub의 Public Repository를 검색해 등록하고, 등록된 Repository의 Issue들을 최신 순으로 모아볼 수 있는 어플리케이션입니다.

https://user-images.githubusercontent.com/60309558/141093534-2da72578-2d5b-435c-a3fe-79f307b278eb.mp4

## Feature
- Public Repository를 검색해 등록할 수 있습니다.
- Repository는 최대 4개까지 등록할 수 있으며, 초과 시 알림이 표시됩니다.
- 등록된 Repository의 Issue들을 최신 순으로 확인할 수 있습니다. Issue에는 Repository명, Issue 타이틀, Issue 번호, 등록 시간, labels와 assignees가 표시되며, Issue 클릭 시 브라우저에서 해당 페이지로 이동합니다.
- 등록한 Repository 정보는 Async Storage를 이용해 유지합니다.

## Setup
본 프로젝트는 React-Native Cli를 이용해 개발되었습니다.

기본적으로 node, watchman이 필요하며, iOS인 경우 XCode, CocoaPods, Android인 경우 Java Development Kit, Android Studio 및 환경변수 설정이 추가로 필요합니다.

Virtual Device 등 관련 상세 설정은 [react-native environment-setup](https://reactnative.dev/docs/environment-setup)을 참조해주세요.



Virtual Device 설정이 끝나셨다면, 프로젝트를 클론 받아주세요.
```
git clone https://github.com/hayjo/github-issue-viewer.git
```
그리고 필요한 디펜던시를 설치해주세요.
```
$ cd github-issue-viewer
$ npm install
```
iOS라면 다음 설치도 필요합니다.
```
$ cd ios
$ pod install
```

## Development
먼저 새 터미널을 열어 아래와 같이 입력해주세요.
```
$ npx react-native start
```
위의 터미널을 유지하고, 별도의 터미널을 열어 아래 명령을 실행해주세요.
```
$ npx react-native run-ios
```
안드로이드에서 실행하고 싶다면 먼저 Android Virtual Device를 구동시킨 후(환경변수 설정이 필요합니다), 아래 명령어를 사용하시면 됩니다.
```
$ npx react-native run-android
```
터미널에 success Successfully launched the app on the simulator가 표시되면 시뮬레이터가 구동됩니다.


## Comments

#### 배운 점
- useAggregatedIssueList 훅에서, 여러 레포지토리의 이슈 데이터를 모아 최신 순으로 정렬하는 로직을 작성하면서 가장 고민을 많이 했습니다. 전체 데이터의 일부만 가지고 있는 상황에서 정렬된 상태를 어떻게 유지할 수 있을까를 고민하다가, 정렬된 부분이 어디까지인지를 표시해주는 메타 데이터를 추가하기로 했습니다. 각 데이터의 마지막 일자 시간 중 가장 최근 일자를 찾아 그 기간까지의 데이터만 보여주고, 보여줄 데이터가 모자라면 일자 순으로 추가 패치하는 방식을 도입했습니다. 레포지토리 목록이 변경되는 경우에 대해서 아직 추가 최적화 여지가 있지만, 일부분만 정렬한다는 아이디어를 구현하면서 구조에 대해 고민할 부분이 많아 유익했습니다.
- flow를 이용한 타입 체크를 처음 시도해보았는데 유용했습니다. 특히 리듀서에서 액션별 페이로드 타입을 명시할 수 있어 해당 부분 에러 해결에 큰 도움이 되었습니다. 다만 어느 정도 기능 구현이 완료된 후 도입해 누적된 에러를 처리하느라 시간이 꽤 소요되었는데, 초반부터 도입했다면 디버깅 시간이 많이 단축되었을 것 같습니다.
#### 아쉬운 점
- 초반에 useMemo, useCallback 등을 사용한 최적화를 시도했으나, 커스텀 훅을 도입하면서 업데이터 함수가 dispatch로 대체돼 이 부분을 걷어내었습니다. 이후 별도의 렌더링 최적화를 적극적으로 시도하지 못한 부분이 아쉽습니다.
- Async Storage 접근 등 side effect가 발생하는 로직을 커스텀 훅에서 처리하기 위해 상태 관리 라이브러리 대신 useReducer를 사용했는데, state depth가 깊어지면서 불변성을 보장하기 위한 코드가 많아졌습니다. 특히 useAggregatedIssueList 훅에서 immer를 사용했다면 reducer 로직이 훨씬 간결해질 수 있었을 것 같아 아쉬움이 남습니다.
- 이슈 클릭 시 해당 페이지로 이동하는 부분을 deep link로 구현해보고 싶었고, 그래서 stack navigation을 선택했었으나 현재 단계에서 완성되지 않아 아쉽습니다. 이후 시도할 예정입니다. (2021. 11. 15에 해결)
