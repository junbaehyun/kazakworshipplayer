import type { Language } from '../types';

export interface TranslationStrings {
  brand: string;
  tabListen: string;
  tabChart: string;
  tabKaynar: string;
  tabOffline: string;
  tabUpload: string;
  tabSettings: string;
  noticeBtn: string;
  searchPlaceholder: string;
  bannerTitle: string;
  bannerSub: string;
  playBtn: string;
  shuffleBtn: string;
  topPlayedTitle: string;
  seeAll: string;
  allSongsTitle: string;
  unknownAuthor: string;
  sharedPerm: string;
  plays: string;
  offlineReady: string;
  offlineEmpty: string;
  saveOffline: string;
  savedOffline: string;
  uploadTitle: string;
  uploadSubtitle: string;
  songTitleLabel: string;
  songTitlePlaceholder: string;
  authorLabel: string;
  unknownAuthorCheck: string;
  audioFileLabel: string;
  audioFileHint: string;
  lyricsLabel: string;
  lyricsPlaceholder: string;
  uploadConsent: string;
  uploadSubmitBtn: string;
  uploadingBtn: string;
  uploadSuccess: string;
  uploadPendingSuccess: string;
  closePlayer: string;
  lyricsBtn: string;
  repeatOff: string;
  repeatAll: string;
  repeatOne: string;
  claimAuthorBtn: string;
  noticeModalTitle: string;
  noticeModalBody: string;
  reportTypeClaim: string;
  reportTypeRemove: string;
  reportTypeMessage: string;
  reportContactPlaceholder: string;
  reportMessagePlaceholder: string;
  reportSubmitBtn: string;
  reportSuccess: string;
  settingsTitle: string;
  storageCardTitle: string;
  storageClearBtn: string;
  adminSectionTitle: string;
  adminEmailPlaceholder: string;
  adminPasswordPlaceholder: string;
  adminLoginBtn: string;
  adminLogoutBtn: string;
  adminLoggedInAs: string;
  adminPendingTitle: string;
  adminInboxTitle: string;
  adminApproveBtn: string;
  adminDeleteBtn: string;
  adminResolveBtn: string;
  noSongsFound: string;
  contactEmailLabel: string;
  installTitle: string;
  installSub: string;
  installBtn: string;
  installIosHint: string;
  myPlaylistTitle: string;
  addToPlaylist: string;
  inPlaylist: string;
  playlistEmpty: string;
}

export const translations: Record<Language, TranslationStrings> = {
  kk: {
    brand: 'Қазақша Мадақ',
    tabListen: 'Тыңдау',
    tabChart: 'Чарт',
    tabKaynar: 'Бақыт қайнар',
    tabOffline: 'Офлайн',
    tabUpload: 'Жүктеу',
    tabSettings: 'Баптау',
    noticeBtn: 'Авторлық',
    searchPlaceholder: 'Ән атын немесе сөзін іздеу...',
    bannerTitle: 'Авторы белгісіз және еркін бөлісілетін әндер',
    bannerSub: 'Коммерциялық емес мадақ үшін. Авторды білсеңіз немесе өшіруді сұрасаңыз, осында басыңыз.',
    playBtn: 'Ойнату',
    shuffleBtn: 'Араластыру',
    topPlayedTitle: 'Көп тыңдалған (Топ Чарт)',
    seeAll: 'Барлығы',
    allSongsTitle: 'Барлық әндер',
    unknownAuthor: 'Белгісіз автор',
    sharedPerm: 'Рұқсатпен бөлісілген',
    plays: 'рет',
    offlineReady: 'Құрылғыда сақталған (IndexedDB)',
    offlineEmpty: 'Әзірге офлайн ән жоқ. Әннің жанындағы ↓ түймесін басыңыз.',
    saveOffline: 'Офлайн сақтау',
    savedOffline: 'Сақталған',
    uploadTitle: 'Жаңа ән жүктеу',
    uploadSubtitle: 'Рұқсатпен бөлісілген қазақша мадақ әндері',
    songTitleLabel: 'Ән атауы *',
    songTitlePlaceholder: 'Мысалы: Ұлы Құдай',
    authorLabel: 'Автор / Орындаушы',
    unknownAuthorCheck: 'Авторы белгісіз (No one knows the author)',
    audioFileLabel: 'Аудио файл (.mp3, .m4a, .wav) *',
    audioFileHint: 'Файлды таңдау үшін басыңыз',
    lyricsLabel: 'Ән сөзі (Міндетті емес)',
    lyricsPlaceholder: 'Ән сөзін осында жазыңыз...',
    uploadConsent: 'Бұл қазақша мадақ әні екенін және еркін бөлісуге рұқсат етілгенін (немесе авторы белгісіз екенін) растаймын.',
    uploadSubmitBtn: 'Әнді жүктеу',
    uploadingBtn: 'Жүктелуде...',
    uploadSuccess: 'Ән сәтті жүктелді!',
    uploadPendingSuccess: 'Ән тексеруге жіберілді. Админ растаған соң шығады.',
    closePlayer: 'Жабу',
    lyricsBtn: 'Сөзі',
    repeatOff: 'Қайталамау',
    repeatAll: 'Барлығы',
    repeatOne: '1 ән',
    claimAuthorBtn: 'Автор',
    noticeModalTitle: 'Авторлық құқық және хабарлама жіберу',
    noticeModalBody: 'Бұл қосымшада тек еркін бөлісуге рұқсат етілген немесе авторы белгісіз қазақша мадақ әндері жинақталған. Егер сіз автор болсаңыз немесе сұрағыңыз болса, хабарласыңыз:',
    reportTypeClaim: 'Автордың атын қосу / түзету',
    reportTypeRemove: 'Әнді қолданбадан өшіруді сұрау',
    reportTypeMessage: 'Әзірлеушіге хабарлама жіберу',
    reportContactPlaceholder: 'Байланыс (Email / Telegram / WhatsApp)',
    reportMessagePlaceholder: 'Хабарламаңызды жазыңыз...',
    reportSubmitBtn: 'Хабарлама жіберу',
    reportSuccess: 'Хабарламаңыз сәтті жіберілді! Рақмет.',
    settingsTitle: 'Баптаулар және Админ',
    storageCardTitle: 'Офлайн жад (IndexedDB)',
    storageClearBtn: 'Офлайн кэшті тазалау',
    adminSectionTitle: 'Админ режимі (Developer Login)',
    adminEmailPlaceholder: 'Admin Email (Supabase Auth)',
    adminPasswordPlaceholder: 'Құпия сөз (Password)',
    adminLoginBtn: 'Админ ретінде кіру',
    adminLogoutBtn: 'Шығу',
    adminLoggedInAs: 'Кірген админ:',
    adminPendingTitle: 'Тексерудегі әндер',
    adminInboxTitle: 'Келген хабарламалар мен өтініштер',
    adminApproveBtn: 'Жариялау',
    adminDeleteBtn: 'Өшіру',
    adminResolveBtn: 'Орындалды',
    noSongsFound: 'Әндер табылмады.',
    contactEmailLabel: 'Байланыс поштасы:',
    installTitle: 'Қолданбаны орнату',
    installSub: 'Офлайн тыңдау және жылдам ашу үшін негізгі экранға қосыңыз.',
    installBtn: 'Орнату',
    installIosHint: 'Safari-де Бөлісу (↑) → «Басты экранға» басыңыз.',
    myPlaylistTitle: 'Менің плейлистім',
    addToPlaylist: 'Плейлистке қосу',
    inPlaylist: 'Плейлистте',
    playlistEmpty: 'Кез келген әннің жанындағы + түймесін басып, плейлистке қосыңыз.'
  },
  ko: {
    brand: '카자흐 찬양',
    tabListen: '지금 듣기',
    tabChart: '인기 차트',
    tabKaynar: 'Бақыт қайнар',
    tabOffline: '보관함',
    tabUpload: '업로드',
    tabSettings: '설정',
    noticeBtn: '저작권',
    searchPlaceholder: '찬양 제목 또는 가사 검색...',
    bannerTitle: '작자 미상 및 무료 나눔 찬양 안내',
    bannerSub: '비상업적 예배 목적으로 공유됩니다. 원작자 제보나 삭제 요청은 여기를 눌러주세요.',
    playBtn: '재생',
    shuffleBtn: '임의 재생',
    topPlayedTitle: '가장 많이 재생된 찬양',
    seeAll: '전체 보기',
    allSongsTitle: '전체 찬양',
    unknownAuthor: '작자 미상',
    sharedPerm: '공유 허락됨',
    plays: '회',
    offlineReady: '기기에 오프라인 저장됨 (IndexedDB)',
    offlineEmpty: '저장된 오프라인 곡이 없습니다. 곡 옆의 ↓ 버튼을 눌러 저장하세요.',
    saveOffline: '오프라인 저장',
    savedOffline: '저장됨',
    uploadTitle: '새 찬양 업로드',
    uploadSubtitle: '공유가 허락된 카자흐어 찬양곡만 업로드해 주세요',
    songTitleLabel: '찬양 제목 *',
    songTitlePlaceholder: '예: Ұлы Құдай',
    authorLabel: '작곡가 / 아티스트',
    unknownAuthorCheck: '작자 미상 (원작자를 모름)',
    audioFileLabel: '오디오 파일 (.mp3, .m4a, .wav) *',
    audioFileHint: '여기를 눌러 오디오 파일 선택',
    lyricsLabel: '가사 (선택 사항)',
    lyricsPlaceholder: '찬양 가사를 입력하세요...',
    uploadConsent: '이 곡은 공유가 허락되었거나 작자 미상인 카자흐 찬양곡이며 비상업적 나눔에 동의합니다.',
    uploadSubmitBtn: '찬양 업로드하기',
    uploadingBtn: '업로드 중...',
    uploadSuccess: '찬양이 성공적으로 업로드되었습니다!',
    uploadPendingSuccess: '업로드 요청이 접수되었습니다. 관리자 승인 후 게시됩니다.',
    closePlayer: '닫기',
    lyricsBtn: '가사',
    repeatOff: '반복 끔',
    repeatAll: '전체 반복',
    repeatOne: '한 곡 반복',
    claimAuthorBtn: '저작자',
    noticeModalTitle: '저작권 안내 및 메시지 보내기',
    noticeModalBody: '이 앱은 공유가 허락되었거나 원작자를 알 수 없는 카자흐어 찬양곡만 비상업적으로 나눕니다. 원작자 표기, 삭제 요청 또는 문의 사항을 남겨주세요:',
    reportTypeClaim: '원작자 이름 제보 / 수정 요청',
    reportTypeRemove: '곡 삭제 요청 (원작자/권리자)',
    reportTypeMessage: '개발자에게 일반 메시지 보내기',
    reportContactPlaceholder: '연락처 (이메일 / 텔레그램 / 카카오톡)',
    reportMessagePlaceholder: '내용을 입력해 주세요...',
    reportSubmitBtn: '메시지 전송',
    reportSuccess: '메시지가 성공적으로 전송되었습니다. 감사합니다!',
    settingsTitle: '설정 및 관리자',
    storageCardTitle: '오프라인 저장소 (IndexedDB)',
    storageClearBtn: '오프라인 캐시 비우기',
    adminSectionTitle: '관리자 모드 (개발자 로그인)',
    adminEmailPlaceholder: '관리자 이메일 (Supabase Auth)',
    adminPasswordPlaceholder: '비밀번호',
    adminLoginBtn: '관리자 로그인',
    adminLogoutBtn: '로그아웃',
    adminLoggedInAs: '로그인 계정:',
    adminPendingTitle: '승인 대기 중인 곡',
    adminInboxTitle: '수신된 메시지 및 저작권 요청',
    adminApproveBtn: '게시 승인',
    adminDeleteBtn: '삭제',
    adminResolveBtn: '처리 완료',
    noSongsFound: '검색된 찬양이 없습니다.',
    contactEmailLabel: '문의 이메일:',
    installTitle: '앱으로 설치하기',
    installSub: '오프라인 재생과 빠른 실행을 위해 홈 화면에 추가하세요.',
    installBtn: '설치',
    installIosHint: 'Safari 하단 공유(↑) → "홈 화면에 추가"를 눌러주세요.',
    myPlaylistTitle: '내 플레이리스트',
    addToPlaylist: '플레이리스트에 추가',
    inPlaylist: '플레이리스트에 있음',
    playlistEmpty: '찬양 옆의 + 버튼을 눌러 내 플레이리스트에 담아보세요.'
  },
  en: {
    brand: 'Kazakh Worship',
    tabListen: 'Listen Now',
    tabChart: 'Charts',
    tabKaynar: 'Бақыт қайнар',
    tabOffline: 'Offline',
    tabUpload: 'Upload',
    tabSettings: 'Settings',
    noticeBtn: 'Copyright',
    searchPlaceholder: 'Search songs or lyrics...',
    bannerTitle: 'Unknown Authors & Free Sharing Notice',
    bannerSub: 'Shared non-commercially with permission or unknown authorship. Tap here to credit an author or message us.',
    playBtn: 'Play',
    shuffleBtn: 'Shuffle',
    topPlayedTitle: 'Most Played Chart',
    seeAll: 'See All',
    allSongsTitle: 'All Songs',
    unknownAuthor: 'Unknown Author',
    sharedPerm: 'Shared with Permission',
    plays: 'plays',
    offlineReady: 'Saved in Browser IndexedDB',
    offlineEmpty: 'No offline songs yet. Tap ↓ next to any song to cache it for offline playback.',
    saveOffline: 'Save Offline',
    savedOffline: 'Saved',
    uploadTitle: 'Upload Worship Song',
    uploadSubtitle: 'Share Kazakh worship songs permitted for community use',
    songTitleLabel: 'Song Title *',
    songTitlePlaceholder: 'e.g., Ұлы Құдай',
    authorLabel: 'Author / Artist',
    unknownAuthorCheck: 'Unknown author (No one knows the author)',
    audioFileLabel: 'Audio File (.mp3, .m4a, .wav) *',
    audioFileHint: 'Tap to choose an audio file',
    lyricsLabel: 'Lyrics (Optional)',
    lyricsPlaceholder: 'Paste song lyrics here...',
    uploadConsent: 'I confirm this is a Kazakh worship song permitted for free sharing or has an unknown author.',
    uploadSubmitBtn: 'Upload Song',
    uploadingBtn: 'Uploading...',
    uploadSuccess: 'Song uploaded successfully!',
    uploadPendingSuccess: 'Song submitted! It will appear once approved by the admin.',
    closePlayer: 'Close',
    lyricsBtn: 'Lyrics',
    repeatOff: 'Off',
    repeatAll: 'All',
    repeatOne: 'One',
    claimAuthorBtn: 'Author',
    noticeModalTitle: 'Copyright Notice & Send Message',
    noticeModalBody: 'This app shares Kazakh worship songs permitted for free sharing or whose original authors are unknown. Strictly non-commercial. If you know the author, want a song removed, or have a message:',
    reportTypeClaim: 'Claim / Credit Original Author',
    reportTypeRemove: 'Request Song Removal',
    reportTypeMessage: 'Send a Message to Developer',
    reportContactPlaceholder: 'Your Contact (Email / Telegram / WhatsApp)',
    reportMessagePlaceholder: 'Write your message...',
    reportSubmitBtn: 'Send Message',
    reportSuccess: 'Your message has been sent. Thank you!',
    settingsTitle: 'Settings & Admin',
    storageCardTitle: 'Offline Storage (IndexedDB)',
    storageClearBtn: 'Clear Offline Cache',
    adminSectionTitle: 'Admin Mode (Developer Login)',
    adminEmailPlaceholder: 'Admin Email (Supabase Auth)',
    adminPasswordPlaceholder: 'Password',
    adminLoginBtn: 'Sign In as Admin',
    adminLogoutBtn: 'Sign Out',
    adminLoggedInAs: 'Signed in as:',
    adminPendingTitle: 'Pending Uploads',
    adminInboxTitle: 'Messages & Copyright Requests',
    adminApproveBtn: 'Publish',
    adminDeleteBtn: 'Delete',
    adminResolveBtn: 'Resolve',
    noSongsFound: 'No songs found.',
    contactEmailLabel: 'Contact Email:',
    installTitle: 'Install App',
    installSub: 'Add to your home screen for offline playback & native feel.',
    installBtn: 'Install',
    installIosHint: 'In Safari, tap Share (↑) → "Add to Home Screen".',
    myPlaylistTitle: 'My Playlist',
    addToPlaylist: 'Add to Playlist',
    inPlaylist: 'In Playlist',
    playlistEmpty: 'Tap + on any song to add it to your playlist.'
  },
  ru: {
    brand: 'Казахские Песни',
    tabListen: 'Слушать',
    tabChart: 'Чарт',
    tabKaynar: 'Бақыт қайнар',
    tabOffline: 'Офлайн',
    tabUpload: 'Загрузить',
    tabSettings: 'Настройки',
    noticeBtn: 'Права',
    searchPlaceholder: 'Поиск песен или текста...',
    bannerTitle: 'Неизвестные авторы и свободный доступ',
    bannerSub: 'Некоммерческое распространение. Нажмите, чтобы указать автора, удалить песню или написать нам.',
    playBtn: 'Слушать',
    shuffleBtn: 'Перемешать',
    topPlayedTitle: 'Самые прослушиваемые',
    seeAll: 'Все',
    allSongsTitle: 'Все песни',
    unknownAuthor: 'Неизвестный автор',
    sharedPerm: 'Разрешено к распространению',
    plays: 'прослуш.',
    offlineReady: 'Сохранено в браузере (IndexedDB)',
    offlineEmpty: 'Нет сохраненных песен. Нажмите ↓ рядом с песней для офлайн-доступа.',
    saveOffline: 'Скачать',
    savedOffline: 'Скачано',
    uploadTitle: 'Загрузить песню',
    uploadSubtitle: 'Делитесь казахскими песнями хвалы с разрешением на публикацию',
    songTitleLabel: 'Название песни *',
    songTitlePlaceholder: 'Например: Ұлы Құдай',
    authorLabel: 'Автор / Исполнитель',
    unknownAuthorCheck: 'Автор неизвестен',
    audioFileLabel: 'Аудиофайл (.mp3, .m4a, .wav) *',
    audioFileHint: 'Нажмите, чтобы выбрать файл',
    lyricsLabel: 'Текст песни (необязательно)',
    lyricsPlaceholder: 'Вставьте текст песни...',
    uploadConsent: 'Подтверждаю, что песня разрешена для свободного распространения или её автор неизвестен.',
    uploadSubmitBtn: 'Загрузить песню',
    uploadingBtn: 'Загрузка...',
    uploadSuccess: 'Песня успешно загружена!',
    uploadPendingSuccess: 'Отправлено! Песня появится после проверки администратором.',
    closePlayer: 'Закрыть',
    lyricsBtn: 'Текст',
    repeatOff: 'Выкл',
    repeatAll: 'Все',
    repeatOne: 'Одна',
    claimAuthorBtn: 'Автор',
    noticeModalTitle: 'Авторские права и сообщение',
    noticeModalBody: 'В приложении собраны казахские песни хвалы, разрешенные для свободного распространения или с неизвестным автором. Если вы автор или хотите написать нам:',
    reportTypeClaim: 'Указать / исправить имя автора',
    reportTypeRemove: 'Запросить удаление песни',
    reportTypeMessage: 'Отправить сообщение разработчику',
    reportContactPlaceholder: 'Контакт (Email / Telegram / WhatsApp)',
    reportMessagePlaceholder: 'Введите сообщение...',
    reportSubmitBtn: 'Отправить',
    reportSuccess: 'Сообщение успешно отправлено! Спасибо.',
    settingsTitle: 'Настройки и Админ',
    storageCardTitle: 'Офлайн-память (IndexedDB)',
    storageClearBtn: 'Очистить офлайн-кэш',
    adminSectionTitle: 'Режим администратора (Вход)',
    adminEmailPlaceholder: 'Email администратора',
    adminPasswordPlaceholder: 'Пароль',
    adminLoginBtn: 'Войти как админ',
    adminLogoutBtn: 'Выйти',
    adminLoggedInAs: 'Вы вошли как:',
    adminPendingTitle: 'Ожидающие проверки',
    adminInboxTitle: 'Сообщения и запросы об авторстве',
    adminApproveBtn: 'Опубликовать',
    adminDeleteBtn: 'Удалить',
    adminResolveBtn: 'Решено',
    noSongsFound: 'Песни не найдены.',
    contactEmailLabel: 'Почта для связи:',
    installTitle: 'Установить приложение',
    installSub: 'Добавьте на главный экран для быстрого доступа и офлайн-режима.',
    installBtn: 'Установить',
    installIosHint: 'В Safari нажмите «Поделиться» (↑) → «На экран «Домой».',
    myPlaylistTitle: 'Мой плейлист',
    addToPlaylist: 'Добавить в плейлист',
    inPlaylist: 'В плейлисте',
    playlistEmpty: 'Нажмите + рядом с любой песней, чтобы добавить её в плейлист.'
  }
};
