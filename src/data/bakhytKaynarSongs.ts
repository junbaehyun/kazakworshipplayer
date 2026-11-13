export interface KaynarLyricLine {
  kk: string;
  chords?: string;
  reading?: string;
  meaning?: string;
  koHymn?: string;
  en?: string;
}

export interface KaynarSection {
  id: string;
  kind: string;
  label: { kk: string; ko: string };
  lines: KaynarLyricLine[];
}

export interface KaynarSong {
  id: string;
  slug: string;
  event?: string;
  date?: string;
  title: {
    kk: string;
    reading?: string;
    ko?: string;
    koHymn?: string;
    en?: string;
  };
  group?: string;
  note?: string;
  hasKoreanHymn?: boolean;
  hasEnglish?: boolean;
  hymnChip?: string;
  songKey?: string;
  capo?: number;
  sections: KaynarSection[];
}

export const BAKHYT_KAYNAR_AUDIO_MAP: Record<string, string> = {
  "tangirdi-madakta": "song-9685",
  "zhuregimdi-ozgertshi": "song-5856",
  "al-meni-kanatyna": "song-12850",
  "aumin": "song-102500",
  "zharatkan-zherdi-de": "song-5855",
  "zhyr-bolyp-bizge-ashylshy": "song-5858",
  "isa-tangir-patshamyiz": "song-6571",
  "atyng-madaqtalsyn": "song-7681",
  "barlyq-aspan": "song-5828",
  "iemizdi-madaqtangdar": "song-5869",
  "manggilik-madaqtaymyn-seni": "song-5769",
  "o-quday-iem": "song-5995",
  "patshalyq-saltanat": "song-9679",
  "rahmet-saghan-quday": "song-6008",
  "tang-atqanda": "song-6040",
  "tangir-zholyma-zharyq-shashyp": "song-6036",
  "qurmetteymin-seni-balangday": "song-5959",
  "an-salyp-bi-bileyik": "song-5814",
  "ar-kunde-isa-maghan-qazhetsing": "song-5873",
  "dunieni-bir-sozingmen": "song-6494",
  "zhasyl-zhaylaugha": "song-7746",
  "zhol-gholghotagha-alys": "song-5860",
  "kel-kel-bizge": "song-5887",
  "kelemin-saghan": "song-5888",
  "meyiriminge-toly": "song-5986",
  "men-saghan-oleng-aytam": "song-5985",
  "meni-qoldaysyng": "song-5989",
  "osy-kundi": "song-5998",
  "rahmet-saghan-quday-isa": "song-6008",
  "sening-mahabbatyng": "song-6013",
  "quanyngdar": "song-12556",
  "quday-sonsha-zhaqsy-kordi": "song-5958",
  "qurmetteymin-seni": "song-5959",
  "berik-turamyn": "song-13145",
  "sen-kushtising": "song-13269",
  "madakta-osanna": "song-13254",
  "siynushymyn": "song-87161",
  "sen-tangirim": "song-6014",
  "kudaiga-shattanam": "song-6052",
  "shattanamyn": "song-6052",
  "nury-alemning": "song-13248",
  "nur-alemning": "song-13248",
  "ar-sozimning-maqsaty": "song-ar-sozimning-maqsaty",
};

export const bakhytKaynarSongs: KaynarSong[] = [
  {
    "id": "biz-tize-bugemiz",
    "slug": "biz-tize-bugemiz",
    "event": "2026 전교인 수련회 · 카작팀 찬양",
    "date": "2026-08-14",
    "title": {
      "kk": "Біз тізе бүгеміз",
      "reading": "브즈 트제 부게므즈",
      "ko": "우리는 무릎을 꿇습니다",
      "koHymn": "우리 함께 기도해"
    },
    "note": "카자흐어로 부르고, 한글 읽기·의미·한국 찬양 가사를 켜고 끌 수 있습니다.",
    "sections": [
      {
        "id": "v1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Біз тізе бүгеміз",
            "reading": "브즈 트-제 부-게-므즈",
            "meaning": "우리는 무릎을 꿇습니다",
            "koHymn": "우리 함께 기도해"
          },
          {
            "kk": "Сенің алдыңда сиынамыз.",
            "reading": "쎄-능 알-등-다 씨-으-나-므즈",
            "meaning": "주님 앞에 예배합니다.",
            "koHymn": "주 앞에 나와 무릎 꿇고"
          },
          {
            "kk": "Әке, мейірлі Құдай,",
            "reading": "애-케, 메이-를-르 쿠-다이",
            "meaning": "아버지, 자비로우신 하나님,",
            "koHymn": "긍휼 베푸시는 주"
          },
          {
            "kk": "Қолды созамыз көкке қарай",
            "reading": "콜-드 쏘-자-므즈 쾩-케 가-라이",
            "meaning": "하늘을 향해 손을 뻗습니다",
            "koHymn": "하늘을 향해 두 손 들고"
          }
        ]
      },
      {
        "id": "chorus",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Сен аш қақпасын көктің, Ізгілік нұрымен,",
            "reading": "쎈 아-싀 칵-파-쓴 쾩-틍, 으즈-글-륵 누-르-멘",
            "meaning": "주님, 하늘의 문을 선하신 빛으로 여소서,",
            "koHymn": "하늘 문이 열리고 은혜의 빛줄기"
          },
          {
            "kk": "Толтыршы әлемді онымен,",
            "reading": "톨-트르-싀 앨-렘-드 오-느-멘",
            "meaning": "그것으로 세상을 채우소서,",
            "koHymn": "이 땅 가득 내리도록"
          },
          {
            "kk": "Осы сәт, Тәңір келші шындық жауынымен,",
            "reading": "오-쓰 샛, 탱-으르 켈-싀 싄-득 쟈우-으-느-멘",
            "meaning": "이 순간, 하나님이여 진리의 비와 함께 오소서,",
            "koHymn": "마침내 주 오셔서 진리의 빛줄기"
          },
          {
            "kk": "Жаудыршы Сен шындығыңды бізге.",
            "reading": "쟈우-드르-싀 쎈 싄-드-긍-드 브즈-게",
            "meaning": "주님의 진리를 우리에게 내려주소서.",
            "koHymn": "우리 위에 부으시도록"
          }
        ]
      }
    ]
  },
  {
    "id": "tangirdi-madakta",
    "slug": "tangirdi-madakta",
    "event": "2026 전교인 수련회 · 카작팀 찬양",
    "date": "2026-08-14",
    "title": {
      "kk": "Тәңірді мадақта",
      "reading": "탱으르드 마닥타",
      "ko": "주님을 찬양하라",
      "koHymn": "송축해 내 영혼"
    },
    "note": "1·2·3절과 후렴. 한국 찬양은 《송축해 내 영혼 (10,000 Reasons)》 대응 가사입니다.",
    "songKey": "Eb",
    "sections": [
      {
        "id": "v1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Тамаша арайлы таң атты,",
            "chords": "[Ab]Тамаша арайлы [Eb]таң атты,",
            "reading": "타–마-샤 아-라일-르 탕 앗-뜨,",
            "meaning": "아름다운 새벽이 밝았습니다,",
            "koHymn": "해가 뜨는 새 아침 밝았네"
          },
          {
            "kk": "Тәңірім ғажап күн жаратты.",
            "chords": "[Bb]Тәңірім ғажап күн [Cm]жаратты.",
            "reading": "탱-으-름 가-쟙 쿤 쟈–랏-뜨.",
            "meaning": "나의 하나님이 놀라운 날을 만드셨습니다.",
            "koHymn": "이제 다시 주님 찬양"
          },
          {
            "kk": "Осынау керемет рақымы үшін",
            "chords": "[Ab]Осынау керемет [Eb]рақымы үшін",
            "reading": "오-쓰–나우 케–레–멧 라-크–므 우-싄",
            "meaning": "이 놀라운 은혜를 위하여",
            "koHymn": "무슨 일이나 어떤 일이 내게 놓여도"
          },
          {
            "kk": "Арнайық біз мадақты",
            "chords": "[Bb]Арнайық біз мадақ-[Eb]ты",
            "reading": "아르–나이–윽 브즈 마–닥-뜨",
            "meaning": "우리는 찬양을 드립니다",
            "koHymn": "저녁이 올 땐 나는 노래해"
          }
        ]
      },
      {
        "id": "chorus",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Тәңірді Мадақта жан-дүнием!",
            "chords": "[Ab]Тәңірді Ма-[Eb]дақта [Bb]жан-дүнием! [Cm]",
            "reading": "탱-으르-드 마–닥-타 쟌두-녬!",
            "meaning": "내 영혼아, 주님을 찬양하라!",
            "koHymn": "송축해 내 영혼 내 영혼아"
          },
          {
            "kk": "Киелі есімін!",
            "chords": "[Ab]Киелі [Eb]есімін! [Bb]",
            "reading": "키–옐-르 예-쓰-믄!",
            "meaning": "거룩하신 그 이름을!",
            "koHymn": "거룩하신 이름"
          },
          {
            "kk": "Бар дауыспен мадақта жан-дүнием!",
            "chords": "[Ab]Бар дауыспен [Cm]мадақта [Ab]жан-дү-[Bb]нием! [Cm]",
            "reading": "바르 다-우쓰-펜 마–닥-타 쟌두-녬!",
            "meaning": "온 목소리로 찬양하라, 내 영혼아!",
            "koHymn": "이전에 없었던 노래로 나"
          },
          {
            "kk": "Тәңірді мадақта!",
            "chords": "[Ab]Тәңірді [Bb]мадақта! [Eb]",
            "reading": "탱-으르-드 마-닥-타!",
            "meaning": "주님을 찬양하라!",
            "koHymn": "주님을 경배해"
          }
        ]
      },
      {
        "id": "v2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Рақымың мен махаббатың шексіз,",
            "reading": "라–크-믕 몐 마–하-밧-뜽 쉑-쓰즈,",
            "meaning": "주님의 은혜와 사랑은 끝이 없고,",
            "koHymn": "노하기를 더디하시는 주"
          },
          {
            "kk": "Тәңірім Сен ұлысың.",
            "reading": "탱–으-름 쎈 울-르-씅.",
            "meaning": "나의 하나님, 주님은 위대하십니다.",
            "koHymn": "그의 크신 사랑 넘치네"
          },
          {
            "kk": "Он мың себеп те аз болар маған",
            "reading": "온 믕 쎄–벱 톄 아즈 볼–라르 마-간",
            "meaning": "만 가지 이유도 내게는 부족하리",
            "koHymn": "주의 선하심 내가 노래하리"
          },
          {
            "kk": "Мәңгі айтар жырымсың!",
            "reading": "맹-그 아이-타르 즈-름-씅!",
            "meaning": "영원히 부를 나의 노래이십니다!",
            "koHymn": "수많은 이유로 나 노래해"
          }
        ]
      },
      {
        "id": "v3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Куатым кеміп сарқылған күні,",
            "reading": "쿠-앗-뜸 켸-믑 싸르-클-간 쿠느,",
            "meaning": "힘이 다해 소진된 날에,",
            "koHymn": "곧 그날에 내 힘 다하고"
          },
          {
            "kk": "Ажалым жетіп ақырғы.",
            "reading": "아–쟐-름 제-틉 아–크르-그.",
            "meaning": "생이 끝나 갈 때에.",
            "koHymn": "나의 삶의 여정 마칠 때"
          },
          {
            "kk": "Жан-дүнием Сені жырлайды тағы,",
            "reading": "쟌두–니옘 쎄느 즈를-라이-드 타-그,",
            "meaning": "내 영혼은 주님을 다시 노래합니다,",
            "koHymn": "끝없는 찬양 나 드리리라"
          },
          {
            "kk": "Мәңгілікке Атыңды!",
            "reading": "맹-글-륵-케 아–틍-드!",
            "meaning": "영원토록 주님의 이름을!",
            "koHymn": "수많은 세월 지나 영원히"
          }
        ]
      }
    ]
  },
  {
    "id": "siynushymyn",
    "slug": "siynushymyn",
    "event": "2026 전교인 수련회 · 카작팀 찬양",
    "date": "2026-08-14",
    "title": {
      "kk": "Сиынушымын",
      "reading": "씨으누싀으문",
      "ko": "나는 예배자입니다",
      "koHymn": "나는 하나님을 예배하는 예배자입니다"
    },
    "note": "1·2절. 한국 찬양은 줄별 대응 가사입니다.",
    "sections": [
      {
        "id": "v1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Мен Құдайым Саған табынатын",
            "reading": "미옌 쿠다이음 싸간 타브나튼",
            "meaning": "나의 하나님, 주님께 예배하는",
            "koHymn": "나는 하나님을 예배하는"
          },
          {
            "kk": "Сиынушымын",
            "reading": "씨으누싀으문",
            "meaning": "예배자입니다",
            "koHymn": "예배자입니다"
          },
          {
            "kk": "Мен қайда болсамда,",
            "reading": "미옌 카이다 볼쌈다,",
            "meaning": "내가 어디에 있든지,",
            "koHymn": "내가 서 있는 곳"
          },
          {
            "kk": "Сол жерде де",
            "reading": "쏠 졔르뎨 뎨",
            "meaning": "그곳에서도",
            "koHymn": "어디서나"
          },
          {
            "kk": "Құдай Саған табынамын.",
            "reading": "쿠다이 싸간 타브나믄.",
            "meaning": "하나님, 주님께 예배합니다.",
            "koHymn": "하나님을 예배합니다"
          }
        ]
      },
      {
        "id": "v2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Жан рухым қасиетті рақымыңа қарай",
            "reading": "잔 루흠 카씨예트 라크믕아 가라이",
            "meaning": "내 영혼과 영이 거룩한 은혜를 향하여",
            "koHymn": "내 영혼 거룩한 은혜를 향하여"
          },
          {
            "kk": "Жүрегім кемелді Құдайыма қарай,",
            "reading": "쥐례금 케몔드 쿠다이음아 가라이,",
            "meaning": "내 마음은 완전하신 하나님을 향하여,",
            "koHymn": "내 마음 완전한 하나님 향하여"
          },
          {
            "kk": "Осы жерде, дәл қазір мен,",
            "reading": "오스 졔르뎨 델 카즈르 몐,",
            "meaning": "바로 이곳에서, 지금 이 순간 나는,",
            "koHymn": "이곳에서 바로 이 시간"
          },
          {
            "kk": "Құдай саған табынамын.",
            "reading": "쿠다이 싸간 타브나믄.",
            "meaning": "하나님, 주님께 예배합니다.",
            "koHymn": "하나님을 예배합니다"
          }
        ]
      }
    ]
  },
  {
    "id": "kutkaryp-aldyn-alemdi",
    "slug": "kutkaryp-aldyn-alemdi",
    "event": "2026 전교인 수련회 · 카작팀 찬양",
    "date": "2026-08-14",
    "title": {
      "kk": "Құтқарып алдың әлемді",
      "reading": "쿳카릅 알등 엘렘드",
      "ko": "세상을 구원하셨네",
      "koHymn": "세상을 구원하셨네"
    },
    "note": "1·2·3절. 한국 찬양 가사는 의미 대응 초안이며, 악보가 있으면 맞춰 수정할 수 있습니다.",
    "songKey": "C",
    "sections": [
      {
        "id": "v1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Құтқарып алдың әлемді",
            "chords": "[C]Құтқарып алдың [G]әлемді,",
            "reading": "쿳 카릅 알등 엘렘 드",
            "meaning": "세상을 구원해 주셨습니다",
            "koHymn": "세상을 구원하셨네"
          },
          {
            "kk": "Махаббат нұрыңды төгіп.",
            "chords": "[Am]Күнәдан тазарт-[F]тың мені.",
            "reading": "마하밧 누릉드 퇴급.",
            "meaning": "사랑의 빛을 부어 주시고.",
            "koHymn": "사랑의 빛 부으시고"
          },
          {
            "kk": "Өшкен жүректі жандырып",
            "chords": "[C]Мадақ Саған, [G]Тәңірім,",
            "reading": "위스껜 쥐렉트 잔드릅",
            "meaning": "꺼진 마음을 다시 살피시고",
            "koHymn": "꺼진 마음 살리시고"
          },
          {
            "kk": "Сенімді бердің.",
            "chords": "[F]Мәңгілік [G]сүйем [C]Сені.",
            "reading": "쎄늠드 베르등.",
            "meaning": "믿음을 주셨습니다.",
            "koHymn": "믿음을 주셨네"
          }
        ]
      },
      {
        "id": "v2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Сенің алдыңа келеміз.",
            "reading": "쎄능 알등아 켈레므즈.",
            "meaning": "주님 앞으로 나아갑니다.",
            "koHymn": "주님 앞에 나아갑니다"
          },
          {
            "kk": "Әке Саған қымбатпыз біз.",
            "reading": "애케 싸간 금밧트프즈 브즈.",
            "meaning": "아버지, 우리는 주님께 귀합니다.",
            "koHymn": "아버지 우린 주님의 자녀"
          },
          {
            "kk": "Иеміз, Сенің атыңды",
            "reading": "이예므즈 쎄능 아틍드",
            "meaning": "우리 주여, 주님의 이름을",
            "koHymn": "우리 주여 그 이름을"
          },
          {
            "kk": "Мадақтаймыз.",
            "reading": "마닥타이므즈.",
            "meaning": "찬양합니다.",
            "koHymn": "찬양합니다"
          }
        ]
      },
      {
        "id": "v3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Мадақпен даңқ Саған болсын,",
            "reading": "마닥펜 당크 싸간 볼쓴,",
            "meaning": "찬양과 영광이 주님께 있기를,",
            "koHymn": "찬양과 영광 주님께"
          },
          {
            "kk": "Барлық халық ғасырларда.",
            "reading": "바를륵 할륵 가쓰르라르다.",
            "meaning": "모든 민족이 대대에 이르게.",
            "koHymn": "모든 민족 대대에"
          },
          {
            "kk": "Күшің Сенің шексіз Ием,",
            "reading": "쿠슁 쎄능 쉑쓰즈 이옘,",
            "meaning": "주님의 능력은 끝이 없으시니, 주여,",
            "koHymn": "주의 능력 한이 없네"
          },
          {
            "kk": "шексіз рақымдылығыңда.",
            "reading": "쉑쓰즈 라큼드르긍다.",
            "meaning": "끝없는 주님의 자비 안에.",
            "koHymn": "끝없는 주의 자비 안에"
          }
        ]
      }
    ]
  },
  {
    "id": "zhuregimdi-ozgertshi",
    "slug": "zhuregimdi-ozgertshi",
    "event": "2026 전교인 수련회 · 카작팀 찬양",
    "date": "2026-08-14",
    "hasKoreanHymn": false,
    "hymnChip": "카작 원곡",
    "title": {
      "kk": "Жүрегімді өзгертші",
      "reading": "쥐레금드 외즈게릇싀",
      "ko": "내 마음을 변화시켜 주소서",
      "koHymn": "카작 원곡"
    },
    "note": "1절 · 후렴 · 2절. 한국 찬양 대응곡 없음 — 카자흐 원곡.",
    "songKey": "C",
    "sections": [
      {
        "id": "v1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Жүрегімді өзгертші Тәңір,",
            "chords": "[C]Жүрегімді [Em]өзгертші, [Dm7]Тәңір,",
            "reading": "쥐-레-금-드 외즈-게릇-싀 탱-으르,",
            "meaning": "내 마음을 변화시켜 주소서, 하나님,"
          },
          {
            "kk": "Сені ғана аңсап тұрайын.",
            "chords": "[G]Сені ғана аңсап [C]тұрайын.",
            "reading": "쎄-느 가-나 앙-쌉 투-라이-은.",
            "meaning": "주님만을 사모하며 살게 하소서."
          },
          {
            "kk": "Жүрегімді өзгертші Тәңір,",
            "chords": "[C]Жүрегімді [Em]өзгертші, [Dm7]Тәңір,",
            "reading": "쥐-레-금-드 외즈-게릇-싀 탱-으르,",
            "meaning": "내 마음을 변화시켜 주소서, 하나님,"
          },
          {
            "kk": "Саған ғана мойын бұрайын.",
            "chords": "[G]Саған ғана мойын [C]бұрайын.",
            "reading": "싸-간 가-나 모이-은 부-라이-은.",
            "meaning": "주님께만 순종하게 하소서."
          }
        ]
      },
      {
        "id": "chorus",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Сенің атың ыстық Махаббат,",
            "chords": "[E]Сенің атың - [Am]Ыстық Махаббат,",
            "reading": "쎄-능 아-틍 으스-특 마-하-밧,",
            "meaning": "주님의 이름은 뜨거운 사랑,"
          },
          {
            "kk": "Сенің атың Рақым, Шапағат",
            "chords": "[F]Сенің атың - [G]Рақым, [C]Шапағат.",
            "reading": "쎄-능 아-틍 라-큼, 샤-파-갓",
            "meaning": "주님의 이름은 은혜, 자비"
          },
          {
            "kk": "Сұраймын мен Сенен",
            "chords": "[E]Сұраймын мен [Am]Сенен",
            "reading": "쑤-라이-믄 몐 쎄-넨",
            "meaning": "주님께 구합니다"
          },
          {
            "kk": "Бер маған даналық, қанағат",
            "chords": "[D7]Бер маған даналық, [G]қанағат.",
            "reading": "베르 마-간 다-날-륵, 카-나-갓",
            "meaning": "지혜와 만족을 내게 주소서"
          }
        ]
      },
      {
        "id": "v2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Өмірімді өзгертші Тәңір,",
            "reading": "외-므-름-드 외즈-게릇-싀 탱-으르,",
            "meaning": "내 삶을 변화시켜 주소서, 하나님,"
          },
          {
            "kk": "Әлемге мен жарық болайын.",
            "reading": "앨-렘-게 몐 쟈-륵 볼-라이-은.",
            "meaning": "세상에 빛이 되게 하소서."
          },
          {
            "kk": "Өмірімді өзгертші Тәңір,",
            "reading": "외-므-름-드 외즈-게릇-싀 탱-으르,",
            "meaning": "내 삶을 변화시켜 주소서, 하나님,"
          },
          {
            "kk": "Рухыңа мен Сенің толайын.",
            "reading": "루-흥-아 몐 쎄-능 톨-라이-은.",
            "meaning": "주님의 영으로 충만하게 하소서."
          }
        ]
      }
    ]
  },
  {
    "id": "al-meni-kanatyna",
    "slug": "al-meni-kanatyna",
    "event": "2026 전교인 수련회 · 카작팀 찬양",
    "date": "2026-08-14",
    "hasEnglish": true,
    "title": {
      "kk": "Ал мені қанатыңа",
      "reading": "알 몌느 카낫틍아",
      "ko": "주의 날개 아래로 나를 품어 주소서",
      "koHymn": "주 품에 품으소서 (Still)",
      "en": "Still"
    },
    "note": "1절 · 후렴 · 2절. Hillsong 《Still》 — 한국 찬양 · 영어 원곡 싱크.",
    "songKey": "C",
    "sections": [
      {
        "id": "v1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Ал мені қанатыңа,",
            "chords": "[C]Ал мені [G]қанаты-[Am]ңа,",
            "reading": "알 몌-느 카-낫-틍-아,",
            "meaning": "주의 날개 아래로 나를 품어 주소서,",
            "koHymn": "주 품에 품으소서",
            "en": "Hide me now under Your wings"
          },
          {
            "kk": "Сақташы, қолыңмен құдіретті!",
            "chords": "[F]Сақташы, қолың-[Dm]мен құдірет-[G]ті!",
            "reading": "싹-타-싀, 콜-릉-몐 쿠-드-렛-뜨!",
            "meaning": "능력의 팔로 덮어 주소서!",
            "koHymn": "능력의 팔로 덮으소서",
            "en": "Cover me within Your mighty hand"
          }
        ]
      },
      {
        "id": "chorus",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Теңіз долданып, дауыл тұрса,",
            "chords": "[F]Теңіз долданып, [G]дауыл тұр-[C]са,",
            "reading": "탱-으즈 돌-다-늡, 다-울 투르-사,",
            "meaning": "바다가 요동치고 폭풍이 일어도,",
            "koHymn": "거친 파도 날 향해 와도",
            "en": "When the oceans rise and thunders roar"
          },
          {
            "kk": "Сенімен самғайм жоғарыда.",
            "chords": "[F]Сенімен самғайм [G]жоғары-[Am]да.",
            "reading": "쎄-느-멘 쌈-가-임 조-가-르-다.",
            "meaning": "주님과 함께 높이 날아갑니다.",
            "koHymn": "주와 함께 날아 오르리",
            "en": "I will soar with You above the storm"
          },
          {
            "kk": "Әке, Патшасың тасқынға да,",
            "chords": "[F]Әке, Патшасың [G]тасқынға [C]да,",
            "reading": "애-케, 팟-샤-씅 타스-큰-가다,",
            "meaning": "아버지, 홍수 위에도 왕 되십니다,",
            "koHymn": "폭풍 가운데 나의 영혼",
            "en": "Father You are King over the flood"
          },
          {
            "kk": "Сен біргесің, білем, Құдайым!",
            "chords": "[F]Сен біргесің, бі-[G]лем, Құдай-[C]ым!",
            "reading": "쎈 브르-게-씅, 블렘, 쿠-다이음!",
            "meaning": "주님이 함께하심을 압니다, 나의 하나님!",
            "koHymn": "잔잔하게 주를 보리라",
            "en": "I will be still and know You are God"
          }
        ]
      },
      {
        "id": "v2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Тыным табам, тек Мәсіхте,",
            "chords": "[C]Тыным табам, [G]тек Мәсіх-[Am]те,",
            "reading": "트-늠 타-밤, 텍 매-슥-톄,",
            "meaning": "오직 그리스도 안에서 쉼을 얻습니다,",
            "koHymn": "주님 안에 나 거하리",
            "en": "Find rest my soul in Christ alone"
          },
          {
            "kk": "Сенемін құдіретіңе Сенің!",
            "chords": "[F]Сенемін құдіреті-[G]ңе Сен-[C]ің!",
            "reading": "쎄-녜-믄 쿠-드-렛-뜽-에 쎄-능!",
            "meaning": "고요함과 신뢰 속에 주님의 능력을 압니다!",
            "koHymn": "주 능력 나 잔잔히 믿네",
            "en": "Know His power in quietness and trust"
          }
        ]
      }
    ]
  },
  {
    "id": "sen-tangirim",
    "slug": "sen-tangirim",
    "event": "2026 전교인 수련회 · 카작팀 찬양",
    "date": "2026-08-16",
    "hasKoreanHymn": false,
    "hymnChip": "카작 원곡",
    "title": {
      "kk": "Сен тәңірім",
      "reading": "쎈 텡으름",
      "ko": "주님, 나의 하나님",
      "koHymn": "카작 원곡"
    },
    "note": "1·2절. 한국·영어 대응 찬양 없음 — 카자흐 원곡.",
    "songKey": "D",
    "sections": [
      {
        "id": "v1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Сен, Тәңірім, күмістен де асыл,",
            "chords": "[D]Сен, Тәңірім, [A]күмістен де [G]асылсың,",
            "reading": "쎈, 텡으름, 쿠므스텐 데 아쓸,",
            "meaning": "주님, 나의 하나님, 은보다도 귀하시니,"
          },
          {
            "kk": "Сен, Тәңірім, алтыннан да қымбат.",
            "chords": "[D]Сен, Тәңірім, [A]алтыннан да [G]қымбатсың.",
            "reading": "쎈, 텡으름, 알튼난 다 큼바트.",
            "meaning": "주님, 나의 하나님, 금보다도 귀하시니."
          },
          {
            "kk": "Сен, Тәңірім, асылдың асылы.",
            "chords": "[D]Сен, Тәңірім, [A]гауһардан да [G]сұлусың,",
            "reading": "쎈, 텡으름, 아쓸등 아쓸르.",
            "meaning": "주님, 나의 하나님, 보배 중의 보배이십니다."
          },
          {
            "kk": "Сен, Бағушым, менің Құдайым!",
            "chords": "[Em]Ешнәрсе Сенімен [A]теңдес емес-[D]тір.",
            "reading": "쎈, 바구쉼, 몌능 쿠다이음!",
            "meaning": "주님, 나의 목자, 나의 하나님이십니다!"
          }
        ]
      },
      {
        "id": "v2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Сенен басқа Құтқарушым жоқ,",
            "reading": "쎈넨 바스카 쿳카르싐 족,",
            "meaning": "주님 외에 나의 구원자가 없고,"
          },
          {
            "kk": "Сенен басқа арманым да жоқ,",
            "reading": "쎈넨 바스카 아르마늠 다 족,",
            "meaning": "주님 외에 나의 소망도 없고,"
          },
          {
            "kk": "Сенен басқа үмітім де жоқ.",
            "reading": "쎈넨 바스카 우뭇틈 데 족.",
            "meaning": "주님 외에 나의 희망도 없습니다."
          },
          {
            "kk": "Сен менің Құдайым!",
            "reading": "쎈 몌능 쿠다이음!",
            "meaning": "주님은 나의 하나님이십니다!"
          }
        ]
      }
    ]
  },
  {
    "id": "aumin",
    "slug": "aumin",
    "event": "2026 전교인 수련회 · 카작팀 찬양",
    "date": "2026-08-16",
    "hasEnglish": true,
    "title": {
      "kk": "Әумин!",
      "reading": "아우민!",
      "ko": "아멘!",
      "koHymn": "축복",
      "en": "The Blessing"
    },
    "note": "1절 · 후렴 · 3–6절. 《The Blessing》 — 한국 찬양 · 영어 싱크.",
    "songKey": "F",
    "sections": [
      {
        "id": "v1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Тәңір Ие, бірге болып,",
            "chords": "[F]Әумин, [C]әумин,",
            "reading": "텡으르 이예, 비르게 볼릅",
            "meaning": "주님께서 너와 함께하시고",
            "koHymn": "주님께서 너와 함께하시고",
            "en": "May the Lord be with you"
          },
          {
            "kk": "Қорған болып саған, жарылқасын.",
            "chords": "[Dm]Әумин, [Bb]әумин,",
            "reading": "코르간 볼릅 사간, 자를카슨",
            "meaning": "너를 지키시고 복 주시기를",
            "koHymn": "너를 지키시고 복 주시기를",
            "en": "May He protect and bless you"
          },
          {
            "kk": "Бет-жүзін бұрып саған,",
            "chords": "[F]Әумин, [C]әу-[F]мин.",
            "reading": "벳 주즌 부릅 사간",
            "meaning": "그 얼굴을 네게로 향하시고",
            "koHymn": "그 얼굴을 네게로 향하시고",
            "en": "May He turn His face toward you"
          },
          {
            "kk": "Тыныштық сыйласын.",
            "reading": "트느슈특 스일라슨",
            "meaning": "네게 평강 주시기를",
            "koHymn": "네게 평강 주시기를",
            "en": "And give you peace"
          }
        ]
      },
      {
        "id": "chorus",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Аумин, аумин, аумин.",
            "reading": "아우민, 아우민, 아우민",
            "meaning": "아멘, 아멘, 아멘",
            "koHymn": "아멘, 아멘, 아멘",
            "en": "Amen, amen, amen"
          },
          {
            "kk": "Аумин, аумин, аумин.",
            "reading": "아우민, 아우민, 아우민",
            "meaning": "아멘, 아멘, 아멘",
            "koHymn": "아멘, 아멘, 아멘",
            "en": "Amen, amen, amen"
          },
          {
            "kk": "Аумин, аумин, аумин.",
            "reading": "아우민, 아우민, 아우민",
            "meaning": "아멘, 아멘, 아멘",
            "koHymn": "아멘, 아멘, 아멘",
            "en": "Amen, amen, amen"
          },
          {
            "kk": "Аумин, аумин, аумин.",
            "reading": "아우민, 아우민, 아우민",
            "meaning": "아멘, 아멘, 아멘",
            "koHymn": "아멘, 아멘, 아멘",
            "en": "Amen, amen, amen"
          }
        ]
      },
      {
        "id": "v3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Ол сенімен бірге болсын,",
            "reading": "올 세느멘 비르게 볼슨",
            "meaning": "주께서 너와 함께하시기를",
            "koHymn": "주께서 너와 함께하시기를",
            "en": "May He be with you"
          },
          {
            "kk": "Ұрпағыңнан ұрпағыңа,",
            "reading": "우르파긍난 우르파긍아",
            "meaning": "대대로, 모든 세대에",
            "koHymn": "대대로, 모든 세대에",
            "en": "From generation to generation"
          },
          {
            "kk": "Өз үйіңде, жүрегіңде,",
            "reading": "외즈 위이응데, 주레깅데",
            "meaning": "너의 가정과 마음속에",
            "koHymn": "너의 가정과 마음속에",
            "en": "In your home and in your heart"
          },
          {
            "kk": "Немереңмен, шөбереңде.",
            "reading": "네메렝멘, 쇠베렝데",
            "meaning": "너의 손자와 증손자에게도",
            "koHymn": "너의 손자와 증손자에게도",
            "en": "With your grandchildren and great-grandchildren"
          }
        ]
      },
      {
        "id": "v4",
        "kind": "verse",
        "label": {
          "kk": "4",
          "ko": "4절"
        },
        "lines": [
          {
            "kk": "Құдай жүрсін, қолдап, қорғап.",
            "reading": "쿠다이 주르슨, 콜답 코르갑",
            "meaning": "하나님께서 동행하시며 돕고 지키시기를",
            "koHymn": "하나님께서 동행하시며 돕고 지키시기를",
            "en": "May God walk with you, help and protect you"
          },
          {
            "kk": "Ол қасыңда, тастамайды.",
            "reading": "올 카승다, 타스타마이 드",
            "meaning": "주께서 네 곁에 계시며 버리지 않으시네",
            "koHymn": "주께서 네 곁에 계시며 버리지 않으시네",
            "en": "He is beside you and will not forsake you"
          },
          {
            "kk": "Қамқорлайды, жетелейді.",
            "reading": "캄코를라이드, 제텔레이드",
            "meaning": "너를 돌보시고 인도하시네",
            "koHymn": "너를 돌보시고 인도하시네",
            "en": "He cares for you and guides you"
          },
          {
            "kk": "Әрқашанда Ол қасыңда.",
            "reading": "애르카샨다 올 카승다",
            "meaning": "언제나 주께서 네 곁에 계시네",
            "koHymn": "언제나 주께서 네 곁에 계시네",
            "en": "He is always beside you"
          }
        ]
      },
      {
        "id": "v5",
        "kind": "verse",
        "label": {
          "kk": "5",
          "ko": "5절"
        },
        "lines": [
          {
            "kk": "Таң сәріден, қара түнге,",
            "reading": "탕 새리덴, 카라 툰게",
            "meaning": "이른 아침부터 깊은 밤까지",
            "koHymn": "이른 아침부터 깊은 밤까지",
            "en": "From early morning until the dark night"
          },
          {
            "kk": "Әрбір жерде Ол жаныңда.",
            "reading": "애르비르 제르데 올 자능다",
            "meaning": "어디에서나 주께서 네 곁에 계시네",
            "koHymn": "어디에서나 주께서 네 곁에 계시네",
            "en": "Wherever you are, He is beside you"
          },
          {
            "kk": "Жыласаң да, қуансаң да,",
            "reading": "즐라상 다, 쿠안상 다",
            "meaning": "네가 울 때에도 기뻐할 때에도",
            "koHymn": "네가 울 때에도 기뻐할 때에도",
            "en": "Whether you weep or rejoice"
          },
          {
            "kk": "Ол сенімен, тастамайды.",
            "reading": "올 세느멘, 타스타마이 드",
            "meaning": "주께서 함께하시며 너를 버리지 않으시네",
            "koHymn": "주께서 함께하시며 너를 버리지 않으시네",
            "en": "He is with you and will not forsake you"
          }
        ]
      },
      {
        "id": "v6",
        "kind": "verse",
        "label": {
          "kk": "6",
          "ko": "6절"
        },
        "lines": [
          {
            "kk": "Әрқашанда Ол қасыңда.",
            "reading": "애르카샨다 올 카승다",
            "meaning": "언제나 주께서 네 곁에 계시네",
            "koHymn": "언제나 주께서 네 곁에 계시네",
            "en": "He is always beside you"
          },
          {
            "kk": "Әрқашанда Ол қасыңда.",
            "reading": "애르카샨다 올 카승다",
            "meaning": "언제나 주께서 네 곁에 계시네",
            "koHymn": "언제나 주께서 네 곁에 계시네",
            "en": "He is always beside you"
          },
          {
            "kk": "Әрқашанда Ол қасыңда.",
            "reading": "애르카샨다 올 카승다",
            "meaning": "언제나 주께서 네 곁에 계시네",
            "koHymn": "언제나 주께서 네 곁에 계시네",
            "en": "He is always beside you"
          },
          {
            "kk": "Аумин, аумин, аумин.",
            "reading": "아우민, 아우민, 아우민",
            "meaning": "아멘, 아멘, 아멘",
            "koHymn": "아멘, 아멘, 아멘",
            "en": "Amen, amen, amen"
          },
          {
            "kk": "Аумин, аумин, аумин.",
            "reading": "아우민, 아우민, 아우민",
            "meaning": "아멘, 아멘, 아멘",
            "koHymn": "아멘, 아멘, 아멘",
            "en": "Amen, amen, amen"
          }
        ]
      }
    ]
  },
  {
    "id": "zharatkan-zherdi-de",
    "slug": "zharatkan-zherdi-de",
    "event": "2026 전교인 수련회 · 카작팀 찬양",
    "date": "2026-08-16",
    "hasKoreanHymn": false,
    "hymnChip": "카작 원곡",
    "title": {
      "kk": "Жаратқан жерді де",
      "reading": "자라칸 제르드 데",
      "ko": "땅도 하늘도 지으신",
      "koHymn": "카작 원곡"
    },
    "note": "1절 · 후렴 · 2·3절. 한국·영어 대응 찬양 확인 전 — 카자흐 가사·의미만.",
    "songKey": "C",
    "sections": [
      {
        "id": "v1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Жаратқан жерді де, аспанды да.",
            "chords": "[C]Жаратқан жерді де, [G]аспанды да,",
            "reading": "자라칸 제르드 데, 아스판드 다.",
            "meaning": "땅도 하늘도 지으신 분."
          },
          {
            "kk": "Шын сүйіп бас ием Құдайыма.",
            "chords": "[Am]Жетеле мені, [F]жетеле.",
            "reading": "싄 쑤이읍 바쓰 이옘 쿠다이음아.",
            "meaning": "진심으로 사랑하며 나의 하나님께 절합니다."
          },
          {
            "kk": "Адамзат күнәдан арылсын деп",
            "chords": "[C]Құдіретті Құдай, [G]біз Сені сүйеміз,",
            "reading": "아담잣 쿠나단 아를쓴 뎁",
            "meaning": "인류가 죄에서 벗어나도록"
          },
          {
            "kk": "Жіберді Өз Ұлы Исаны да.",
            "chords": "[Am]Жетеле бізді, [F]жете-[C]ле.",
            "reading": "즈베르드 위즈 울르 이싸느다.",
            "meaning": "자기 아들 예수님도 보내셨습니다."
          }
        ]
      },
      {
        "id": "chorus",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Жетеле мені, жетеле,",
            "reading": "제텔레 몌느, 제텔레,",
            "meaning": "나를 인도하소서, 인도하소서,"
          },
          {
            "kk": "Ғажайып жұмақ төріне.",
            "reading": "가자이읍 주막 퇴르네.",
            "meaning": "놀라운 낙원의 자리로."
          },
          {
            "kk": "Рухыңды берсең кеудеме,",
            "reading": "루흥드 베르셍 케우데메,",
            "meaning": "성령을 내 가슴에 주시면,"
          },
          {
            "kk": "Мәңгілік құлмын Өзіңе.",
            "reading": "멩글륵 쿨믄 위증에.",
            "meaning": "영원히 주님의 종이 되겠습니다."
          },
          {
            "kk": "Өзіңе ғана бағынам,",
            "reading": "위증에 가나 바그남,",
            "meaning": "주님께만 순종합니다,"
          },
          {
            "kk": "Өзіңе ғана табынам.",
            "reading": "위증에 가나 타브남.",
            "meaning": "주님께만 경배합니다."
          },
          {
            "kk": "Өзіңнен артық панам жоқ,",
            "reading": "위증넨 아르특 파남 족,",
            "meaning": "주님보다 나은 피난처는 없고,"
          },
          {
            "kk": "Құдайым Саған сиынам.",
            "reading": "쿠다이음 싸간 씨이으남.",
            "meaning": "나의 하나님, 주님께 의지합니다."
          }
        ]
      },
      {
        "id": "v2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Адасып көп жылдар шаршадым мен,",
            "reading": "아다습 쿱 즐다르 사르사듬 몐,",
            "meaning": "방황하며 여러 해 지쳐 있었고,"
          },
          {
            "kk": "Сонда да тыныштық таппадым мен.",
            "reading": "쏜다다 트느싀특 탑파듬 몐.",
            "meaning": "그래도 평안을 찾지 못했습니다."
          },
          {
            "kk": "Сол сәтте Құдайды ойға алып едім",
            "reading": "쏠 셋테 쿠다이드 오이가 알릅 예듬",
            "meaning": "그 순간 하나님을 떠올리니"
          },
          {
            "kk": "Бақытқа кенеліп шаттандым мен.",
            "reading": "바컷카 케네릅 샷탄듬 몐.",
            "meaning": "행복에 넘쳐 기뻐했습니다."
          }
        ]
      },
      {
        "id": "v3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Оқыдым Киелі кітабыңды.",
            "reading": "오쿠듬 키옐르 크타븡드.",
            "meaning": "주님의 성경을 읽었습니다."
          },
          {
            "kk": "Жүрегім азаптан құтқарылды.",
            "reading": "쥐레금 아잡탄 쿳카를드.",
            "meaning": "내 마음이 고통에서 구원받았습니다."
          },
          {
            "kk": "Ұмыттым қайғы мен азабымды,",
            "reading": "우뭇틈 카이그 몐 아자븜드,",
            "meaning": "슬픔과 고통을 잊었으니,"
          },
          {
            "kk": "Өйткені таныдым Құдайымды.",
            "reading": "외이케느 타느듬 쿠다이음드.",
            "meaning": "나의 하나님을 알게 되었기 때문입니다."
          }
        ]
      }
    ]
  },
  {
    "id": "kudaiga-shattanam",
    "slug": "kudaiga-shattanam",
    "event": "2026 전교인 수련회 · 카작팀 찬양",
    "date": "2026-08-16",
    "hasKoreanHymn": false,
    "hymnChip": "카작 원곡",
    "title": {
      "kk": "Құдайға шаттанам",
      "reading": "쿠다이가 샤타남",
      "ko": "하나님께 기뻐하노라",
      "koHymn": "카작 원곡"
    },
    "note": "1–3절. 한국·영어 대응 찬양 확인 전 — 카자흐 가사·의미만. (3절은 PDF 두 페이지)",
    "songKey": "F",
    "sections": [
      {
        "id": "v1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Құдайға шаттанам, Ол – жеңімпаз!",
            "chords": "[F]Шаттанамын Ұлы Құдай [C]жүрегімде,",
            "reading": "쿠다이가 샤타남, 올 – 젱음파즈!",
            "meaning": "하나님께 기뻐하노라, 그분은 승리자!"
          },
          {
            "kk": "Жар салып Оны мадақтаймыз!",
            "chords": "[Dm]Менің мәңгі өмір сүрсе [Bb]шаттанамын.",
            "reading": "자르 살릅 오느 마닥타이므즈!",
            "meaning": "소리쳐 그분을 찬양합니다!"
          },
          {
            "kk": "Патшасы барлық халықтардың",
            "chords": "[F]Қуанамын Киелі Рух [C]жүрегімде,",
            "reading": "파샤쓰 바를륵 할륵타르등",
            "meaning": "모든 민족의 왕이시며"
          },
          {
            "kk": "Әрдайым жеңеді Иеміз!",
            "chords": "[Dm]Менің мәңгі өмір сүрсе [Bb]қуана-[F]мын.",
            "reading": "애르다이음 젱에드 이예므즈!",
            "meaning": "언제나 승리하시는 우리 주님이십니다!"
          }
        ]
      },
      {
        "id": "v2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Аллилуйя, о, Аллилуйя!",
            "reading": "알릴루야, 오, 알릴루야!",
            "meaning": "알렐루야, 오, 알렐루야!"
          },
          {
            "kk": "Аллилуйя, о, Аллилуйя!",
            "reading": "알릴루야, 오, 알릴루야!",
            "meaning": "알렐루야, 오, 알렐루야!"
          }
        ]
      },
      {
        "id": "v3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Айқышта мен үшін азап шектің",
            "reading": "아이크싀타 몐 우싄 아잡 쉑틍",
            "meaning": "십자가에서 나를 위해 고난받으셨고"
          },
          {
            "kk": "Күнә бұғауын Сен сындырдың",
            "reading": "쿠나 부가운 쎈 슨드르등",
            "meaning": "죄의 사슬을 주님께서 끊으셨으며"
          },
          {
            "kk": "Қаныңды төгіп Сен құн төледің",
            "reading": "카능등 퇴급 쎈 쿤 톨레등",
            "meaning": "피를 흘려 값을 치르셨고"
          },
          {
            "kk": "Үміт пен күш маған сыйладың",
            "reading": "우뭇 펜 쿠쉬 마간 쓰일라등",
            "meaning": "소망과 힘을 내게 주셨습니다"
          },
          {
            "kk": "Қайғы мен өлім безеді менен",
            "reading": "카이그 몐 외름 베제드 몌넨",
            "meaning": "슬픔과 죽음이 내게서 달아나고"
          },
          {
            "kk": "Иса тозақтан азат етті",
            "reading": "이싸 토작탄 아잣 예트티",
            "meaning": "예수께서 지옥에서 해방하셨으며"
          },
          {
            "kk": "Шындық пен өмір жалғыз Сенде",
            "reading": "싄득 폔 외므르 잘그즈 쎈뎨",
            "meaning": "진리와 생명은 오직 주님께 있고"
          },
          {
            "kk": "Иса, Сені біз дәріптейміз",
            "reading": "이싸, 쎄느 브즈 데릅테이므즈",
            "meaning": "예수님, 주님을 우리가 높여 찬양합니다"
          }
        ]
      }
    ]
  },
  {
    "id": "madakta-osanna",
    "slug": "madakta-osanna",
    "event": "2026 전교인 수련회 · 카작팀 찬양",
    "date": "2026-08-16",
    "hasKoreanHymn": false,
    "hymnChip": "카작 원곡",
    "title": {
      "kk": "Мадақта Осанна",
      "reading": "마닥타 오산나",
      "ko": "찬양하라 호산나",
      "koHymn": "카작 원곡"
    },
    "note": "1·2절 · 후렴. 한국·영어 대응 찬양 확인 전 — 카자흐 가사·의미만.",
    "songKey": "E",
    "sections": [
      {
        "id": "v1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Иса Мәсіх!",
            "chords": "[E]Патша даңқын көремін, [C#m]оттай жанған бұлтын да,",
            "reading": "이싸 매쓰흐!",
            "meaning": "예수 그리스도!"
          },
          {
            "kk": "Тең келмес бұл дүниеде ешкім,",
            "chords": "[F#m]Дүние дір [B]етеді.",
            "reading": "텡 켈메쓰 불 뒤니뎨 예싀큼,",
            "meaning": "이 세상에 견줄 이 없고,"
          },
          {
            "kk": "Бар аспан мадаққа бөленсін,",
            "chords": "[E]Мейірімді көремін, [C#m]күнәларды жуған қан,",
            "reading": "바르 아스판 마닥카 뵐렌슨,",
            "meaning": "온 하늘이 찬양으로 가득하며,"
          },
          {
            "kk": "Әр жүрек Сені дәріптесін!",
            "chords": "[F#m]Әлем ән [B]салады.",
            "reading": "애르 쥐렉 쎄느 데릅테슨!",
            "meaning": "모든 마음이 주님을 높여 찬양하리!"
          }
        ]
      },
      {
        "id": "v2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Иса Мәсіх!",
            "chords": "[E/G#]Осан-[A]на, Осан-[B]на, [C#m]",
            "reading": "이싸 매쓰흐!",
            "meaning": "예수 그리스도!"
          },
          {
            "kk": "Құдай сонша сүйді адамды,",
            "chords": "[A]Осанна көктегі [C#m]Тәңір-[B]ге!",
            "reading": "쿠다이 쏜샤 쉬이드 아담드,",
            "meaning": "하나님이 사람을 이처럼 사랑하사,"
          },
          {
            "kk": "Жалғыз Ұлы құрбан етті Ол,",
            "chords": "[E/G#]Осан-[A]на, Осан-[B]на, [C#m]",
            "reading": "잘그즈 울르 쿠르반 예트 올,",
            "meaning": "독생자를 희생 제물로 주셨으니,"
          },
          {
            "kk": "Сенсең, мәңгі өмірге ие бол!",
            "chords": "[A]Осанна көктегі [B]Тәңір-[E]ге!",
            "reading": "쎈쎙, 맹그 외므르게 이예 볼!",
            "meaning": "믿으면 영생을 얻으리라!"
          }
        ]
      },
      {
        "id": "chorus",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Мадақта Осанна,",
            "reading": "마닥타 오산나,",
            "meaning": "찬양하라 호산나,"
          },
          {
            "kk": "Оның атын мәңгі дәріпте,",
            "reading": "오능 아튼 맹그 데릅테,",
            "meaning": "그 이름을 영원히 높여 찬양하라,"
          },
          {
            "kk": "Иса Мәсіх, мадақ Саған,",
            "reading": "이싸 매쓰흐, 마닥 싸간,",
            "meaning": "예수 그리스도, 찬양이 주님께,"
          },
          {
            "kk": "Иса Мәсіх – ең ұлы Патша!",
            "reading": "이싸 매쓰흐 – 엥 울르 팟샤!",
            "meaning": "예수 그리스도 – 가장 위대하신 왕!"
          }
        ]
      }
    ]
  },
  {
    "id": "zhyr-bolyp-bizge-ashylshy",
    "slug": "zhyr-bolyp-bizge-ashylshy",
    "event": "2026 전교인 수련회 · 카작팀 찬양",
    "date": "2026-08-16",
    "hasKoreanHymn": false,
    "hymnChip": "카작 원곡",
    "title": {
      "kk": "Жыр болып бізге ашылшы Тәңір",
      "reading": "즈르 볼릅 브즈게 아슬싀 텡으르",
      "ko": "노래로 우리에게 드러내소서 하나님",
      "koHymn": "카작 원곡"
    },
    "note": "1절 · 후렴 · 2·3절. 한국·영어 대응 찬양 확인 전 — 카자흐 가사·의미만. PDF 마지막 곡.",
    "songKey": "D",
    "sections": [
      {
        "id": "v1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Жыр болып бізге ашылшы Тәңір,",
            "chords": "[D]Жыр болып бізге [G]ашылшы Тәңір,",
            "reading": "즈르 볼릅 브즈게 아슬싀 텡으르,",
            "meaning": "노래로 우리에게 드러내소서, 하나님,"
          },
          {
            "kk": "Сырыңды маған ақтаршы Ием.",
            "chords": "[A]Ән болып бізге [D]төгілші Тәңір.",
            "reading": "스릉드 마간 앗타르싀 이옘.",
            "meaning": "주님의 비밀을 내게 털어놓으소서, 주님."
          },
          {
            "kk": "Ұнаттың адам баласын неге?",
            "chords": "[Bm]Жүректің терең [Em]сырын ашып,",
            "reading": "오나틍 아담 발라슨 녜게?",
            "meaning": "어찌하여 사람 자식을 사랑하셨나이까?"
          },
          {
            "kk": "Мәнісін мұның ұқтыршы Құдай.",
            "chords": "[G]Біз Саған мадақ [A]айта-[D]мыз.",
            "reading": "메느슨 무능 욱트르싀 쿠다이.",
            "meaning": "그 뜻을 깨닫게 하소서, 하나님."
          }
        ]
      },
      {
        "id": "chorus",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "О, Құдай Ием, Өзіңсің өмір.",
            "reading": "오, 쿠다이 이옘, 위증슨 외므르.",
            "meaning": "오, 나의 하나님, 주님이 생명이십니다."
          },
          {
            "kk": "О, Құдай Ием жаратқан бізді.",
            "reading": "오, 쿠다이 이옘 자랏칸 브즈드.",
            "meaning": "오, 나의 하나님, 우리를 지으셨습니다."
          },
          {
            "kk": "Бас иіп Саған келіп тұр елім,",
            "reading": "바쓰 이읍 싸간 켈릅 투르 옐름,",
            "meaning": "내 백성이 주님께 절하며 나아와 서 있으니,"
          },
          {
            "kk": "Жетелеп баста шындыққа Иса.",
            "reading": "제텔렙 바스타 싄득카 이싸.",
            "meaning": "진리로 인도하여 주소서, 예수님."
          }
        ]
      },
      {
        "id": "v2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Күнәға батқан елімді көріп,",
            "reading": "쿠나가 밧칸 예름드 쾨릅,",
            "meaning": "죄에 빠진 내 백성을 보시고,"
          },
          {
            "kk": "Жібердің бізге Ұлыңды жерге.",
            "reading": "즈베르등 브즈게 울릉드 졔르게.",
            "meaning": "아드님을 땅으로 우리에게 보내셨습니다."
          },
          {
            "kk": "Үзілген үміт жалғанды бүгін,",
            "reading": "우즐겐 우뭇트 잘간드 부근,",
            "meaning": "끊어진 거짓 소망을 오늘,"
          },
          {
            "kk": "Мәңгілік өмір сыйладың бізге.",
            "reading": "맹글륵 외므르 쓰일라등 브즈게.",
            "meaning": "영생으로 우리에게 주셨습니다."
          }
        ]
      },
      {
        "id": "v3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Тыңдашы халқым, таймашы жолдан,",
            "reading": "틍다싀 할큼, 타이마싀 졸단,",
            "meaning": "들으라 내 백성아, 길에서 떠나지 말라,"
          },
          {
            "kk": "Шындықты жырла Исадан алған.",
            "reading": "싄득트 즈를라 이싸단 알간.",
            "meaning": "예수께 받은 진리를 노래하라."
          },
          {
            "kk": "Шақырған бізді шаттыққа толы,",
            "reading": "샤크르간 브즈드 샷특카 톨르,",
            "meaning": "기쁨이 가득한 길로 우리를 부르셨으니,"
          },
          {
            "kk": "Қазағым, елім, Исаңның жолы.",
            "reading": "카자금, 옐름, 이싸능 졸르.",
            "meaning": "나의 카자흐, 내 백성아, 예수의 길이다."
          }
        ]
      }
    ]
  },
  {
    "id": "isa-tangir-patshamyiz",
    "slug": "isa-tangir-patshamyiz",
    "event": "2026 전교인 수련회 · 한국팀 찬양",
    "date": "2026-08-14",
    "group": "korean-team",
    "title": {
      "kk": "Иса – Тәңір, Патшамыз",
      "reading": "이-싸 탱-으르 팟-샤-므즈",
      "ko": "예수 우리 왕이여",
      "koHymn": "예수 우리 왕이여"
    },
    "note": "한국팀 찬양. 한국어로 부르고, 카자흐어·읽기를 켜고 끌 수 있습니다.",
    "songKey": "G",
    "sections": [
      {
        "id": "v1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Иса – Тәңір, Патшамыз",
            "chords": "[G]Иса – Тәңір, [C]Патшамыз,",
            "reading": "이-싸 탱-으르 팟-샤-므즈",
            "meaning": "예수 우리 왕이여",
            "koHymn": "예수 우리 왕이여"
          },
          {
            "kk": "Келші осында",
            "chords": "[D]Оған мадақ [G]айтамыз.",
            "reading": "켈-시 오-썬-다",
            "meaning": "이곳에 오소서",
            "koHymn": "이곳에 오소서"
          },
          {
            "kk": "Тағыңнан орын алшы",
            "chords": "[Em]Барлық әлем [Am]бас исін,",
            "reading": "타-릉-난 오-른 임알-시",
            "meaning": "보좌로 주여 임하소서",
            "koHymn": "보좌로 주여 임하소서"
          },
          {
            "kk": "Мадақты қабыл алшы",
            "chords": "[C]Иса – жалғыз [D]Патша-[G]мыз!",
            "reading": "마-닥-뜨 까-블 알-시",
            "meaning": "찬양을 받아주소서",
            "koHymn": "찬양을 받아주소서"
          }
        ]
      },
      {
        "id": "chorus",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Сыйнам Саған – Құтқарушым",
            "reading": "씨-으-남 싸-간 룻-카-오-루-심",
            "meaning": "주님을 찬양합니다",
            "koHymn": "주님을 찬양합니다"
          },
          {
            "kk": "Мадақтаймын Сені – Мәсіхім",
            "reading": "마-닥-타이-믄 쎄-느 매-오-쓰-금",
            "meaning": "주님을 경배합니다",
            "koHymn": "주님을 경배합니다"
          },
          {
            "kk": "Патшалық келші, Тәңір-Иса",
            "reading": "팟-샤-릅 켈-시 탱-으-르-익",
            "meaning": "왕이신 예수여 오셔서",
            "koHymn": "왕이신 예수여 오셔서"
          },
          {
            "kk": "Келші, басқара көрші",
            "reading": "켈-시 바스-카-라 괴-르-시",
            "meaning": "좌정하사 다스리소서",
            "koHymn": "좌정하사 다스리소서"
          }
        ]
      }
    ]
  }  ,
  {
    "id": "adamzatty-quday-sonsha-suyedi",
    "slug": "adamzatty-quday-sonsha-suyedi",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Адамзатты Құдай сонша сүйеді"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Жалғыз Ұлын біз үшін құрбан етті -"
          },
          {
            "kk": "Түспей тозаққа әркім- Оған сенуші-"
          },
          {
            "kk": "Мәң-гі өмірге ие бола-ды."
          },
          {
            "kk": "Аллелу-я аллелу-я"
          },
          {
            "kk": "Аллелу-я аллелу-я"
          },
          {
            "kk": "Аллелу-я аллелу-я аллелу-я аyмин //"
          }
        ]
      }
    ]
  },
  {
    "id": "aldynga-kelip",
    "slug": "aldynga-kelip",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Алдыңа келіп"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Алдыңа келіп бас ием, Тәңірім Саған",
            "reading": "알-등- 아 켈- 릅 바- 쓰 이-옘, 탱- 으- 름 싸-간 Жұбаныштың жалғыз көзін 주- 바- 느-싀- 틍 쟐- 그즈 쾨-즌 Таптым мен тек Өзіңнен"
          },
          {
            "kk": "Ұлысың Сен! Тең келер жан жоқ Саған",
            "reading": "울-르-씅 쎈! 텡 켈-례르 쟌 족 싸-간 Алдыңа келіп, бас ием, мейірімді Әкем 알-등-아 켈-릅, 바 쓰 이- 옘, 메이- 름-드 애켐"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Теңдес жоқ, Ұлы Құдай, сиынам Саған",
            "reading": "텡-뎨-스 족, 울- 르 쿠-다이 , 씨- 으- 남 싸-간 Тағзым етіп келгенімде 타- 그- 즘 예- 틉 켈-게-늠- 뎨 Тыныштыққа бөлейсің 트-느-싀-특-카 뵐-레이-씅"
          },
          {
            "kk": "Жан-дүниемді, Тәңірім Саған берем."
          }
        ]
      }
    ]
  },
  {
    "id": "alliluyya-isa-tiri",
    "slug": "alliluyya-isa-tiri",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Аллилуйя, Иса тірі"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Аллилуйя, Иса тірі, Өлім жеңілді, мәңгі өмір берілді Иса мәңгі тірі,"
          },
          {
            "kk": "Ол тірі, Ол тірі Алғашқы болып келді Ол, Соңғысы да Ол Ұлы бостаңдықпен, жеңіс берді Ол бізге Тірілген Исамыз, Ол тірі, Ол тірі Аллилуйя, Иса тірі, Иса тірі, Иса тірі."
          }
        ]
      }
    ]
  },
  {
    "id": "atyng-madaqtalsyn",
    "slug": "atyng-madaqtalsyn",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Атың мадақталсын"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Орман тауым көлімде",
            "reading": "오르-만 타우-음 쾰-름-뎨"
          },
          {
            "kk": "Жер мен аспан төрінде",
            "reading": "졔르 멘 아스-판 퇴-른-뎨"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Шексіз мына ғаламда",
            "reading": "쉑-쓰즈 므-나 갈-람-다"
          },
          {
            "kk": "Жүрегім ой санамда",
            "reading": "쥐-례-금 오이 싸-남-다"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Әрбір атқан таңым үшін",
            "reading": "애르-브르 앗-칸 탕-음 우-싄"
          },
          {
            "kk": "мадақтаймын.",
            "reading": "마-닥-타이-믄"
          },
          {
            "kk": "Есіміңді бар әлемге",
            "reading": "예-쓰-믕-드 바르 앨-렘-계"
          },
          {
            "kk": "жариялаймын!",
            "reading": "쟈-리-얄-라이-믄!"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Атың мадақталсын Тәңір",
            "reading": "아-틍 마-닥-탈-쓴 탱-으르"
          },
          {
            "kk": "Мәңгі мадақталсын.",
            "reading": "맹-그 마-닥-탈-쓴"
          },
          {
            "kk": "Өзіңмен ғажап біздің өмір",
            "reading": "외-증-몐 가-쟙 브즈-등 외-므르"
          },
          {
            "kk": "Киелі есімің даңқталсын!",
            "reading": "키-옐-르 예-쓰-믕 당-탈-쓴"
          }
        ]
      },
      {
        "id": "s5",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Биік шыңға жетсем де",
            "reading": "비-윽 싕-가 젯-쎔 뎨,"
          },
          {
            "kk": "Терең құзға кетсем де,",
            "reading": "테-렝 쿠-즈-가 켓-쎔 뎨,"
          }
        ]
      },
      {
        "id": "s6",
        "kind": "verse",
        "label": {
          "kk": "6",
          "ko": "6절"
        },
        "lines": [
          {
            "kk": "Қандай сыннан өтсем де,",
            "reading": "칸-다이 쓴-난 욋-쎔 뎨,"
          },
          {
            "kk": "Шаттыққа кенелсем де,",
            "reading": "샷-특-카 케-녤-쎔 뎨,"
          }
        ]
      },
      {
        "id": "s7",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Әрбір атқан таңым үшін",
            "reading": "애르-브르 앗-칸 탕-음 우-싄"
          },
          {
            "kk": "мадақтаймын.",
            "reading": "마-닥-타이-믄"
          },
          {
            "kk": "Есіміңді бар әлемге",
            "reading": "예-쓰-믕-드 바르 앨-렘-계"
          },
          {
            "kk": "жариялаймын!",
            "reading": "쟈-리-얄-라이-믄!"
          }
        ]
      },
      {
        "id": "s8",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Атың мадақталсын Тәңір",
            "reading": "아-틍 마-닥-탈-쓴 탱-으르"
          },
          {
            "kk": "Мәңгі мадақталсын.",
            "reading": "맹-그 마-닥-탈-쓴"
          },
          {
            "kk": "Өзіңмен ғажап біздің өмір",
            "reading": "외-증-몐 가-쟙 브즈-등 외-므르"
          },
          {
            "kk": "Киелі есімің даңқталсын!",
            "reading": "키-옐-르 예-쓰-믕 당-탈-쓴"
          }
        ]
      },
      {
        "id": "s9",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "//Беретін де Сенсің Ием!",
            "reading": "베-레-튼 뎨 쎈-씅 이-옘"
          },
          {
            "kk": "Алатын да Сенсің Ием!",
            "reading": "알-라-튼 다 쎈-씅 이-옘"
          },
          {
            "kk": "Құдіретің мен еркіңе",
            "reading": "쿠-드-렛-뜽 멘 예르-킁-예"
          },
          {
            "kk": "Мен басымды Ием!//",
            "reading": "몐 바-씀-드 이-옘!"
          }
        ]
      }
    ]
  },
  {
    "id": "balyq-suda-qustar-kokte",
    "slug": "balyq-suda-qustar-kokte",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Балық – суда, құстар – көкте"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Бұғы - тауда, гүлдер - далада.",
            "reading": "부그 – 타우다, 굴뎨르 – 달라다."
          },
          {
            "kk": "Құтқарушы сүйеді бәрін",
            "reading": "쿳-카-루-싀 쒸-예-드 배-른"
          },
          {
            "kk": "Ол бізді, балаларды да!",
            "reading": "올 브즈-드, 발-랄-라르-드 다!"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Корей менен қазақты да, Кытай менен орысты да,",
            "reading": "까-레이 몌-녠 카-작-뜨 다 , 크- 타이 몌-녠 오-르쓰-뜨 다."
          },
          {
            "kk": "Ағын да, қарасын да, Қабылдайды ұясына",
            "reading": "아-근-드 다, 카-라-쓴 다, 카-블-다이-드 우야-쓰-나"
          },
          {
            "kk": "Құтқарушы сүйеді бәрін",
            "reading": "쿳-카-루-싀 쒸-예-드 배-른"
          },
          {
            "kk": "Ол бізді, балаларды да!",
            "reading": "올 브즈-드, 발-랄-라르-드 다!"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Тыңдашы досым! Құдай сені сүйеді,",
            "reading": "등-다-싀 도-씀! 쿠-다이 쎄-느 쉬-예-드"
          },
          {
            "kk": "Құшағын жайып, Күнде күтеді.",
            "reading": "쿠-샤-근 쟈이-읍 , 쿤-뎨 쿳-톄-드"
          },
          {
            "kk": "Құтқарушы сүйеді бәрін",
            "reading": "쿳-카-루-싀 쒸-예-드 배-른"
          },
          {
            "kk": "Ол бізді, балаларды да!",
            "reading": "올 브즈-드, 발-랄-라르-드 다!"
          }
        ]
      }
    ]
  },
  {
    "id": "bar-esimderden",
    "slug": "bar-esimderden",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Бар есімдерден"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Бар есімдерден аты жоғары",
            "reading": "바르 예씀뎨르덴 아트 조가르 Иса - Тәңір, Иса - Тәңір 이싸 탱으르, 이싸 - 탱으르 Адамзат тізе бүгіп, 아담잣 트제 뷔급 Сиынады Оған 씨-으-나-드 오-간"
          },
          {
            "kk": "Иса - Әлемнің Тәңірі",
            "reading": "이-싸 앨-렘-능 탱-으르"
          },
          {
            "kk": "Иса - Тәңір, Иса - Тәңір",
            "reading": "이-싸 탱-으르, 이-싸 탱-으르 Бар тіршілік тағына Оның 바르 트르싈륵 타그나 오능 Тізе бүгіп, бас иеді 트제 뷔급 , 바쓰 이에드 Иса, Иса, Иса - Тәңір 이- 싸, 이-싸 , 이-싸 탱-으르"
          }
        ]
      }
    ]
  },
  {
    "id": "barlyq-aspan",
    "slug": "barlyq-aspan",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Барлық аспан"
    },
    "songKey": "E",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Барлық аспан",
            "chords": "[E]Барлық аспан [B]жар салады,",
            "reading": "바르- 륵 아 – 스 - 판"
          },
          {
            "kk": "Атыңды мадақтайды, Ием",
            "chords": "[C#m]Тәңірдің ұлы [A]даңқын.",
            "reading": "아-틍–드 마-닥–타이–드, 이-옘"
          },
          {
            "kk": "Сенің көркің,",
            "chords": "[E]Көк күмбезі [B]жариялайды,",
            "reading": "쎄- 능 쾨르 - 킁"
          },
          {
            "kk": "Немен теңдеседі екен?",
            "chords": "[A]Қолтаңба-[B]сын О-[E]ның.",
            "reading": "녜- 몐 텡 – 뎨 – 쎄 – 드 예 - 켄"
          },
          {
            "kk": "Мәңгі отырасың",
            "reading": "맹- 그 오 – 트- 라 - 승"
          },
          {
            "kk": "Жарқыраған тақта",
            "reading": "쟈르 – 크 – 라 - 간 탁 - 타"
          },
          {
            "kk": "Тек Сенің алдыңда",
            "reading": "텍 – 쎄 - 능 알 – 등- 다"
          },
          {
            "kk": "Тізе бүгемін мен.",
            "reading": "트 – 제 부 – 계 - 믄 몐"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Мадақтаймын",
            "reading": "마 – 닥 – 타이 - 믄"
          },
          {
            "kk": "Сенің даңқыңды жан Ием.",
            "reading": "쎄-능 당- 킁 - 드 쟌 이-옘"
          },
          {
            "kk": "Сен біз үшін",
            "reading": "쎈 브즈 우 - 싄"
          },
          {
            "kk": "Өміріңді құрбан еттің",
            "reading": "외-므 – 릉 - 드 쿠르 – 반 옛 - 뜽"
          },
          {
            "kk": "Мәңгі отырасың",
            "reading": "맹- 그 오 – 트- 라 - 승"
          },
          {
            "kk": "Жарқыраған тақта",
            "reading": "쟈르 – 크 – 라 - 간 탁 - 타"
          },
          {
            "kk": "Тек Сенің алдыңда",
            "reading": "텍 – 쎄 - 능 알 – 등- 다"
          },
          {
            "kk": "Тізе бүгемін мен.",
            "reading": "트 – 제 부 – 계 - 믄 몐"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Аялаймын",
            "reading": "아 – 얄 – 라이 - 믄"
          },
          {
            "kk": "Сенің Сөзіңді жан Ием",
            "reading": "쎄-능 쐬-증-드 쟌 이-옘"
          },
          {
            "kk": "Жаратушым",
            "reading": "쟈 - 라 – 뚜 - 싐"
          },
          {
            "kk": "Бір Өзіңе дұға етем",
            "reading": "브르 외–증–예 두–가 옛-톔"
          },
          {
            "kk": "Мәңгі отырасың",
            "reading": "맹- 그 오–트-라-승"
          },
          {
            "kk": "Жарқыраған тақта",
            "reading": "쟈르–크–라-간 탁-타"
          },
          {
            "kk": "Тек Сенің алдыңда",
            "reading": "텍 쎄-능 알–등-다"
          },
          {
            "kk": "Тізе бүгемін мен.",
            "reading": "트–제 부–계-믄 몐"
          }
        ]
      }
    ]
  },
  {
    "id": "barlyq-kushterden-biiksing",
    "slug": "barlyq-kushterden-biiksing",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Барлық күштерден биіксің"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Жаратылыстардан, табиғаттардан.",
            "reading": "쟈-라-뜰-르스-타르-단, 타-비-갓-타르-단"
          },
          {
            "kk": "Жоғары бүкіл ақылдан, даналықтан.",
            "reading": "죠-가-르 부-클 아-클-단, 다-날-륵-탄"
          },
          {
            "kk": "Патшалардың Патшасы Сен!",
            "reading": "팟-샤-라르-단 팟-샤-쓰 쎈"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Атақтан, даңқтардан Ол жоғары",
            "reading": "아-탁-탄, 당-타르-단 올 죠-가-르"
          },
          {
            "kk": "Жоғары ғажаптардан адамзат көрген",
            "reading": "죠-가-르 가-쟙-타르-단 아-담-잣 쾨르-겐"
          },
          {
            "kk": "Жер бетіндегі зор байлықтан жоғары,",
            "reading": "졔르 베-튼-뎨 –그 조르 바일-륵-탄 죠-가-르"
          },
          {
            "kk": "Теңдесі жоқ мейірім берген!",
            "reading": "텡-뎨-쓰 죡 메이-으-름 베르겐"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Аяусыз айқышқа таңдырды.",
            "reading": "아-야우-쓰즈 아이-크싀-카 탕-드르-드"
          },
          {
            "kk": "Әкесі бас тартып қалдырды.",
            "reading": "애-케-스 바쓰 타르-틉 칼-드르-드"
          },
          {
            "kk": "Раушандай жерге тапталған,",
            "reading": "라우-샨-다이 제르-계 탑-탈-간"
          },
          {
            "kk": "Бар күнәмнан ақтаған,",
            "reading": "바르 쿠-냄-난 악-타- 간"
          },
          {
            "kk": "Ол жоғары!",
            "reading": "올 죠-가-르"
          }
        ]
      }
    ]
  },
  {
    "id": "berik-turamyn",
    "slug": "berik-turamyn",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Берік тұрамын"
    },
    "songKey": "E",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Берік тұрамын мен Исаның Атымен",
            "chords": "[E]Берік тұрамын мен Исаның [A]Атымен,",
            "reading": "베-륵 투-라-믄 몐 이-사-능 아-트-몐"
          },
          {
            "kk": "Оның берген билігімен берік тұрамын мен.",
            "chords": "[B]Оның берген билігімен берік [E]тұрамын мен.",
            "reading": "오-능 베르-겐 빌-르-그-멘 베-륵 투-라-믄 몐"
          },
          {
            "kk": "Маған дұшпан келсе де, мүлде құлап қалмаймын",
            "chords": "[C#m]Маған дұшпан келсе де, мүлде [F#m]құлап қалмаймын,",
            "reading": "마-간 두-싀-판 켈-쎄 뎨, 물-뎨 쿨-랍 칼-마이-믄"
          },
          {
            "kk": "Оның берген билігімен, Оның берген билігімен",
            "chords": "[A]Оның берген билігімен [B]берік тұ-[E]рам.",
            "reading": "오-능 베르-겐 빌-르-그-몐 오-능 베르-겐 빌-르-그-몐"
          },
          {
            "kk": "Оның берген билігімен берік тұрам.",
            "reading": "오-능 베르-겐 빌-르-그-몐 베-륵 투-람"
          }
        ]
      }
    ]
  },
  {
    "id": "bi-toltyrsyn-uyimizdi",
    "slug": "bi-toltyrsyn-uyimizdi",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Би толтырсын үйімізді"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Шаттық кернеп даланы.",
            "reading": "샷-특 케르-넵 달-라-느"
          },
          {
            "kk": "Иса Алдында бәрі құлап",
            "reading": "이-사 알-든-다 배-르 쿨-랍"
          },
          {
            "kk": "Тәубеге кеп сиынсын.",
            "reading": "태우-베-계 켑 씨-은-쓴"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Асқар таудан аңғарларға",
            "reading": "아스-카르 타우-단 앙-가르-라르-가"
          },
          {
            "kk": "Саған мадақ қалықтасын.",
            "reading": "싸-간 마-닥 칼-륵-타-슨"
          },
          {
            "kk": "Заңғар көктен халықтарға",
            "reading": "장-가르 콕-톈 할-륵-타르-가"
          },
          {
            "kk": "Ғажайып ән құйылсын!",
            "reading": "가-쟈이-읍 앤 쿠이-을-쓴!"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "2. Біз соңыңнан ерген кезде,",
            "reading": "브즈 쏭-응-난 예르-겐 케즈-뎨"
          },
          {
            "kk": "Нұрың түрсін түнекті.",
            "reading": "누-릉 투르-쓴 투-녝-뜨"
          },
          {
            "kk": "Даңқың толтырсын ғаламды,",
            "reading": "당-킁 톨-트르-쓴 갈-람-드"
          },
          {
            "kk": "Тасқынындай тірі судың.",
            "reading": "타스-크-는-다이 트-르 쑤-등"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Асқар таудан аңғарларға",
            "reading": "아스-카르 타우-단 앙-가르-라르-가"
          },
          {
            "kk": "Саған мадақ қалықтасын.",
            "reading": "싸-간 마-닥 칼-륵-타-슨"
          },
          {
            "kk": "Заңғар көктен халықтарға",
            "reading": "장-가르 콕-톈 할-륵-타르-가"
          },
          {
            "kk": "Ғажайып ән құйылсын!",
            "reading": "가-쟈이-읍 앤 쿠이-을-쓴!"
          }
        ]
      },
      {
        "id": "s5",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "//Аллелуя! Аллелуя!",
            "reading": "알렐루야! 알렐루야!"
          },
          {
            "kk": "Аллелуя! Аллелуя!",
            "reading": "알렐루야! 알렐루야!//"
          }
        ]
      }
    ]
  },
  {
    "id": "bizge-bul-kundi",
    "slug": "bizge-bul-kundi",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Бізге бұл күнді"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Бізге бұл күнді(*2) Құдай жаратқан(*2)",
            "reading": "브-즈-게 불 쿤-드 (2) 쿠-다이 자-랏-칸(2)"
          },
          {
            "kk": "Шатанамыз(*2), Әнге саламыз(*2).",
            "reading": "샤-타-나- 므즈(2) 앤-게 쌀-라-므즈 (2)"
          },
          {
            "kk": "Бізге бұл күнді, Құдай жаратқан!",
            "reading": "브-즈-게 불 쿤- 드 쿠-다이 자-랏-칸"
          },
          {
            "kk": "Шатанамыз, Әнге саламыз.",
            "reading": "샤-타-나-므즈, 앤-게 쌀-라-므즈"
          },
          {
            "kk": "Бізге бұл күнді(*2) Құдай жаратқан.",
            "reading": "브즈-게 불 쿤-드 쿠-다이 자-랏-칸"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Иса, Тәңір (*2), Сені сүйеміз(*2).",
            "reading": "이-싸 탱-으르 쎄-느 쒸-예-므즈"
          },
          {
            "kk": "Әнімізді (*2), Саған арнаймыз(*2).",
            "reading": "애-느-므즈-드, 싸-간 아르-나이-므즈"
          },
          {
            "kk": "Иса Тәңір, Сені сүйеміз.",
            "reading": "이-싸 탱-으르 , 쎄-느 쒸-예-므즈"
          },
          {
            "kk": "Әнімізді Саған арнаймыз.",
            "reading": "애-느-므즈-드 싸간 아르-나이-므즈"
          },
          {
            "kk": "Иса Тәңірі, Иса Тәңір, Сені сүйеміз.",
            "reading": "이-싸 탱-으르 , 이-싸 탱-으르, 쎄-느 쒸-예-므즈"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Келгін, досым (*2), Иса Тәңірге(*2).",
            "reading": "켈-근 도-씀 이-싸 탱-으르-게"
          },
          {
            "kk": "Саған береді (*2), Мәңгілік өмір (*2).",
            "reading": "싸-간 볘-례-드, 맹-글-륵 외-므르"
          },
          {
            "kk": "Келгін, досым. Иса Тәңірге",
            "reading": "켈-근 도- 씀, 이-싸 탱-으르-게"
          },
          {
            "kk": "Саған береді Мәңгілік өмір",
            "reading": "싸-간 베-례-드 맹-글-륵 외-므르"
          },
          {
            "kk": "Келгін, досым, Келгін досым, Иса Тәңірге.",
            "reading": "켈-근 도-씀, 켈-근 도-씀 , 이-싸 탱-으르-게"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Бізге бұл күнді(*2) Құдай жаратқан(*2)",
            "reading": "브-즈-게 불 쿤-드 (2) 쿠-다이 자-랏-칸(2)"
          },
          {
            "kk": "Шатанамыз(*2), Әнге саламыз(*2).",
            "reading": "샤-타-나- 므즈(2) 앤-게 쌀-라-므즈 (2)"
          },
          {
            "kk": "Бізге бұл күнді, Құдай жаратқан!",
            "reading": "브-즈-게 불 쿤- 드 쿠-다이 자-랏-칸"
          },
          {
            "kk": "Шатанамыз, Әнге саламыз.",
            "reading": "샤-타-나-므즈, 앤-게 쌀-라-므즈"
          },
          {
            "kk": "Бізге бұл күнді(*2) Құдай жаратқан.",
            "reading": "브즈-게 불 쿤-드 쿠-다이 자-랏-칸"
          }
        ]
      },
      {
        "id": "s5",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Иса, Тәңір (*2), Сені сүйеміз(*2).",
            "reading": "이-싸 탱-으르 쎄-느 쒸-예-므즈"
          },
          {
            "kk": "Әнімізді (*2), Саған арнаймыз(*2).",
            "reading": "애-느-므즈-드, 싸-간 아르-나이-므즈"
          },
          {
            "kk": "Иса Тәңір, Сені сүйеміз.",
            "reading": "이-싸 탱-으르 , 쎄-느 쒸-예-므즈"
          },
          {
            "kk": "Әнімізді Саған арнаймыз.",
            "reading": "애-느-므즈-드 싸간 아르-나이-므즈"
          },
          {
            "kk": "Иса Тәңірі, Иса Тәңір, Сені сүйеміз.",
            "reading": "이-싸 탱-으르 , 이-싸 탱-으르, 쎄-느 쒸-예-므즈"
          }
        ]
      },
      {
        "id": "s6",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Келгін, досым (*2), Иса Тәңірге(*2).",
            "reading": "켈-근 도-씀 이-싸 탱-으르-게"
          },
          {
            "kk": "Саған береді (*2), Мәңгілік өмір (*2).",
            "reading": "싸-간 볘-례-드, 맹-글-륵 외-므르"
          },
          {
            "kk": "Келгін, досым. Иса Тәңірге",
            "reading": "켈-근 도- 씀, 이-싸 탱-으르-게"
          },
          {
            "kk": "Саған береді Мәңгілік өмір",
            "reading": "싸-간 베-례-드 맹-글-륵 외-므르"
          },
          {
            "kk": "Келгін, досым, Келгін досым, Иса Тәңірге.",
            "reading": "켈-근 도-씀, 켈-근 도-씀 , 이-싸 탱-으르-게"
          }
        ]
      }
    ]
  },
  {
    "id": "bizding-patsha-isa-tangir",
    "slug": "bizding-patsha-isa-tangir",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Біздің Патша, Иса Тәңір"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "1. Біздің Патша, Біздің Құдай - Иса Мәсіх!",
            "reading": "브즈-등 팟-샤, 브즈-등 쿠-다이 이-싸 매-슥"
          },
          {
            "kk": "Кім біз үшін құрбан болды - Иса Мәсіх",
            "reading": "큼 브즈 우-싄 쿠르-반 볼-드 이-싸 매-슥"
          },
          {
            "kk": "Кім біз үшін қанын төгіп құтқарылу берді?!",
            "reading": "큼 브즈 우-싄 카-는 퇴-급 쿳-카-를-루 베르-드"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "////Иса - Патша, Иса - Тәңір,",
            "reading": "이-싸 팟-샤, 이-싸 탱-으르,"
          },
          {
            "kk": "Иса - Ием, Ол - Құтқарушы!////",
            "reading": "이-싸 이-옘, 올 쿳-카-루-싀!"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "2. Кім дүниеге нұр болды - Иса Мәсіх,",
            "reading": "큼 브즈 우-싄 카-는 퇴-급 쿳-카-를-루 베르-드"
          }
        ]
      }
    ]
  },
  {
    "id": "bukil-ataq",
    "slug": "bukil-ataq",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Бүкіл атақ"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Бүкіл атақ мәртебемді беремін,",
            "reading": "뷔-클 아-탁 매르-테-벰-드 베-례-믄"
          },
          {
            "kk": "Бар еңбегім, даңқымды алдыңа қоямын!",
            "reading": "바르 옝-볘-금, 당-큼-드 알-등-아 코-야-믄"
          },
          {
            "kk": "Көрмеп еді әлем Сендей, ешкімді,",
            "reading": "쾨르-몝 예-드 앨-렘 쎈-데이 예싀-큼-드"
          },
          {
            "kk": "Сен ғана, лайықсың, жалғыз Сен лайықсың!",
            "reading": "쎈 가-나, 라이-윽-씅, 잘-그즈 쎈 라이-윽-씅"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Құрметтеген атыңды Сен жақынсың,",
            "reading": "쿠르-멧-톄-겐 아-틍-드 쎈 자-큰-씅"
          },
          {
            "kk": "Мәңгі жомарт, сүюші де сол- Сен Өзіңсің",
            "reading": "맹그 죠-마르-트, 쒸-유-싀 뎨 쏠 – 쎈 외-증-씅"
          },
          {
            "kk": "Өмірімді бір Өзіңмен толтырдың,",
            "reading": "외-므-름-드 브르 외-증-몐 톨-트르-등"
          },
          {
            "kk": "Барлық мадақ тек Саған!(*2)",
            "reading": "바를-륵 마닥- 텍 싸-간"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "//Сен лайықсың, О, Ием, ұлы даңққа!",
            "reading": "쎈 라이-윽-씅, 오, 이-옘, 울-르 당-카"
          },
          {
            "kk": "Сен лайықсың, барлық құрметке,",
            "reading": "쎈 라이-윽-씅, 바를-륵 쿠르-멧-케,"
          },
          {
            "kk": "Сен үшін өмір сүрем, менде бардың бәрімен",
            "reading": "쎈 우-싄 외-므르 쒸-롐, 몐-데 바르-등 배-르-몐"
          },
          {
            "kk": "Өміріммен табынам Саған!//",
            "reading": "외-므-름-몐 타-브-남 싸-간"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "verse",
        "label": {
          "kk": "4",
          "ko": "4절"
        },
        "lines": [
          {
            "kk": "Бүкіл атақ мәртебемді...(Қр.)"
          },
          {
            "kk": "//Табынам – Саған",
            "reading": "타-브-남 - 싸-간"
          },
          {
            "kk": "Құрметтейм(ін)!",
            "reading": "쿠르-멧-테-임"
          },
          {
            "kk": "Мадақтайм(ын), Сені - Ием!//",
            "reading": "마-닥-타-임, 쎄-느 - 이-옘"
          }
        ]
      }
    ]
  },
  {
    "id": "bukil-ataq-martebemdi",
    "slug": "bukil-ataq-martebemdi",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Бүкіл атақ мәртебемді"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Бүкіл атақ...... (1)"
          },
          {
            "kk": "Бүкіл атақ мәртебемді беремін,",
            "reading": "뷔-클 아-탁 매르-테-벰-드 베-례-믄"
          },
          {
            "kk": "Бар еңбегім, даңқымды алдыңа қоямын!",
            "reading": "바르 옝-볘-금, 당-큼-드 알-등-아 코-야-믄"
          },
          {
            "kk": "Көрмеп еді әлем Сендей, ешкімді,",
            "reading": "쾨르-몝 예-드 앨-렘 쎈-데이 예싀-큼-드"
          },
          {
            "kk": "Сен ғана, лайықсың, жалғыз Сен лайықсың!",
            "reading": "쎈 가-나, 라이-윽-씅, 잘-그즈 쎈 라이-윽-씅"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Құрметтеген атыңды Сен жақынсың,",
            "reading": "쿠르-멧-테-곈 아-틍-드 쎈 쟈-큰-씅"
          },
          {
            "kk": "Мәңгі жомарт, сүюші де сол Сен Өзіңсің.",
            "reading": "맹-그 죠-마르-트, 쉬-유-싀 뎨 쏠 쎈 외-증"
          },
          {
            "kk": "Өмірімді бір Өзіңмен толтырдың",
            "reading": "외-므-름-드 브르 외-증-몐 톨-트르-등"
          },
          {
            "kk": "Барлық мадақ тек – Саған!",
            "reading": "바를-륵 마-닥 텍 – 싸-간!"
          },
          {
            "kk": "Барлық мадақ тек - Саған!",
            "reading": "바를-륵 마-닥 텍 – 싸-간!"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "//Сен лайықсың, О, Ием, ұлы даңққа!",
            "reading": "쎈 라이-윽-씅, 오, 이-엠, 울-르 당-카"
          },
          {
            "kk": "Сен лайықсың барлық құрметке,",
            "reading": "쎈 라이-윽-씅 바를-륵 쿠르-멧-케,"
          },
          {
            "kk": "Сен үшін өмір сүрем, менде",
            "reading": "쎈 우-싄 외-므로 쒸-렘 멘-뎨"
          },
          {
            "kk": "Бардың бәрімен өміріммен,",
            "reading": "바르-등 배-르-몐 외-므-름-몐"
          },
          {
            "kk": "Табынам - Саған!//",
            "reading": "타-브-남 - 싸-간"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "//Табынам – Саған",
            "reading": "타-브-남 - 싸-간"
          },
          {
            "kk": "Құрметтейм(ін)!",
            "reading": "쿠르-멧-테-임"
          },
          {
            "kk": "Мадақтайм(ын), Сені - Ием!//",
            "reading": "마-닥-타-임, 쎄-느 - 이-옘"
          }
        ]
      }
    ]
  },
  {
    "id": "bukil-alemning-patshasy",
    "slug": "bukil-alemning-patshasy",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Бүкіл әлемнің патшасы"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Бүкіл әлемнің Патшасы",
            "reading": "부-클 앨-렘-능 팟-샤-스"
          },
          {
            "kk": "Таңғажайып тірі Құдай",
            "reading": "탕-가-쟈이-읍 트-르 쿠-다이"
          },
          {
            "kk": "Жаңа әр күнге жол ашады.",
            "reading": "장-아 애르 쿤-게 졸 아-샤-드"
          },
          {
            "kk": "Көкірекімді кернейді",
            "reading": "쾨-크-레-금-드 케르-네-이-드"
          },
          {
            "kk": "Шаттандырады көңілді",
            "reading": "샷-탄-드-라-드 쾽-을-드"
          },
          {
            "kk": "Зұлымдықты алшақтатады.",
            "reading": "줄-름-득-뜨 알-샥-타-타-드"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Басталады жаңа күн Иса Мәсіхпен",
            "reading": "바스-탈-라-드 쟝-아 쿤 이-싸 매-슥-펜"
          },
          {
            "kk": "Сәулесін төгіп нұр жаудырады.",
            "reading": "쌔울-레-쓴 퇴-급 누르 쟈우-드-라-드"
          },
          {
            "kk": "Қуантады жаңа күн Иса Мәсіхпен",
            "reading": "쿠-안-타-드 쟝-아 쿤 이-싸 매-쓱-펜"
          },
          {
            "kk": "Құдайға шүкір! Аллелуя!",
            "reading": "쿠-다이-가 쉬-크르! 알-렐-루-야!"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "2. Табиғат та сергіледі",
            "reading": "타-비-갓- 타 쎄르-글-례드 Оянады халықтар да 오야-나-드 할-륵-타르 다 Қол көтеріп Оны даңқтайды. 콜 쾨-톄-릅 오-느 당-타이-드 Аллелуя! Аллелуя! 알-렐-루-야! 알-렐-루-야! Сүйеміз Тәңірімізді 쉬-예-므즈 탱-으-르-므즈-드 Дауыстап мадақтаймыз Оны. 다우-으-스탑 마-닥-타이-므즈 오-느"
          }
        ]
      }
    ]
  },
  {
    "id": "bul-qalanyng-qudayy",
    "slug": "bul-qalanyng-qudayy",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Бұл қаланың Құдайы"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Адамдардың Патшасы",
            "reading": "아-담-다르-등 팟-샤-스"
          },
          {
            "kk": "Осы елдің Иесі, тек Сен",
            "reading": "오-쓰 옐-등 이-예-스, 텍 쎈"
          },
          {
            "kk": "Қараңғыда нұр шашқан",
            "reading": "카-랑-그-다 누르 샤싀-칸"
          },
          {
            "kk": "Жылағанды жұбатқан",
            "reading": "즐-라-간-드 주-밧-칸"
          },
          {
            "kk": "Үміт беріп құтқарған, тек Сен",
            "reading": "으-믓 베-릅 쿳-카르-간, 텍 쎈"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "/Дәл Сендей Құдай жоқ!/(*2)",
            "reading": "댈 쎈-데이 쿠-다이 족"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "/Әлі алда ұлы істер",
            "reading": "앨-르 알-다 울-르 으스-테르"
          },
          {
            "kk": "Әлі алда көрер кереметтер",
            "reading": "앨-르 알-다 쾨-례르 케-레-멧-테르"
          },
          {
            "kk": "Бұл қалада!/(*4) (осында!)",
            "reading": "불 칼-라-다! (오-쓴-다!)"
          }
        ]
      }
    ]
  },
  {
    "id": "bughy-qalay",
    "slug": "bughy-qalay",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Бұғы қалай"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Бұ ғы қалай мөлдір суды аңсаса",
            "reading": "부-그 칼-라이 묄-드르 쑤-드 앙-사-싸"
          },
          {
            "kk": "Менің жаным да",
            "reading": "몌-능 쟈-늠 다"
          },
          {
            "kk": "Сені іздеп шөліркейді Тәңір,",
            "reading": "쎄-느 으즈-뎁 숄-르르- 케이-드 탱-으르"
          },
          {
            "kk": "Сені аңсайды.",
            "reading": "쎄-느 앙-싸이-드"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Құдайым, Сен қорғанышым,",
            "reading": "쿠-다이-음, 쎈 코르-가-느-싐,"
          },
          {
            "kk": "Бар өмірім менің бар күшім",
            "reading": "바르 외-므-름 몌-능 바르 쿠-싐"
          },
          {
            "kk": "Жанымды да, өмірімді Ием,",
            "reading": "쟈-늠-드 다, 외-므-름-드 이-옘,"
          },
          {
            "kk": "Өзіңе арнадым.",
            "reading": "외-증-에 아르-나-듬"
          }
        ]
      }
    ]
  },
  {
    "id": "barimiz-qayta-tirilgenine-kuamiz",
    "slug": "barimiz-qayta-tirilgenine-kuamiz",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Бәріміз қайта тірілгеніне куәміз"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "/ Біз бәріміз - Исаға куәміз"
          },
          {
            "kk": "Жер шетіне дейін барып, Исаны жеткізейік:/(*2)"
          },
          {
            "kk": "Оның күнәқар үшін айқышқа керілгені,"
          },
          {
            "kk": "Өлім билігін жеңіп, қайта тірілгені,"
          },
          {
            "kk": "Қайтып келемін деп уәде еткенін"
          },
          {
            "kk": "Жер шетіне дейін барып, осыны жеткізейік."
          },
          {
            "kk": "2 Исаны"
          }
        ]
      }
    ]
  },
  {
    "id": "dunieni-bir-sozingmen",
    "slug": "dunieni-bir-sozingmen",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Дүниені бір сөзіңмен"
    },
    "songKey": "F",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "1.Дүниенің бір сөзіңмен жараттың",
            "chords": "[F]Дүниені бір сө-[C]зіңмен жараттың,",
            "reading": "두녜능 브르 쐬증멘 자랏뜽Әлемді шындығыңа қараттың 앨렘드 싄드긍아 카랏뜽Рухыңмен Киелі сөзің бойлатып 루흥몐 키옐르 쐬증 보일라틉Осы әнді жүрегімде ояттың 오쓰 앤드 쥐레금뎨 오얏뜽"
          },
          {
            "kk": "О, Иса Сен әлемнің тірегі, Адамзаттың тілегі,",
            "chords": "[Dm]Күллі жаратылыс-[Bb]қа нұр тараттың.",
            "reading": "오, 이싸 쎈 앨렘능 트례그, 아담잣뜽 틀레그 Өмірімнің өзегі. О, Иса! Өмір бердің өмірге. 외므름능 외졔그, 오, 이싸! 외므르 베르등 외므르게."
          },
          {
            "kk": "Сенген адам Өзіңе тірілсін деп мәңгіге",
            "chords": "[F]Сенің құдіретің [C]шексіз Тәңірім,",
            "reading": "쎈겐 아담 외증예 트를쓴 뎁 맹그게"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "2.Әлемнің сүйетінің соншалық",
            "chords": "[Bb]Саған [C]бас ие-[F]міз.",
            "reading": "두녜능 브르 쐬증멘 자랏뜽Құдайым, бердің бізге құрбандық. 앨렘드 싄드긍아 카랏뜽Иса боп дүниеге келдің Сен 루흥몐 키옐르 쐬증 보일라틉Құтқарам күнәдан деп халқыңды. 오쓰 앤드 쥐레금뎨 오얏 뜽"
          },
          {
            "kk": "О, Иса Сен әлемнің тірегі, Адамзаттың тілегі,",
            "reading": "오, 이싸 쎈 앨렘능 트례그, 아담잣뜽 틀레그 Өмірімнің өзегі. О, Иса! Өмір бердің өмірге. 외므름능 외졔그, 오, 이싸! 외므르 베르등 외므르게."
          },
          {
            "kk": "Сенген адам Өзіңе тірілсін деп мәңгіге",
            "reading": "쎈겐 아담 외증예 트를쓴 뎁 맹그게"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "3.Мадақтап құрметтеймін Өзіңді",
            "reading": "마닥탑 쿠르멧테이믄 외증드 Ғаламға жеткіземін Сөзіңді 갈람가 젯크제믄 쐬증드 Оятып Сенің Киелі Рухыңмен 오얏틉 쎄능 키엘르 루흥멘 Шындықты ашып бердің еркіңмен 싄득뜨 베르등 예르킁멘"
          },
          {
            "kk": "О, Иса Сен әлемнің тірегі, Адамзаттың тілегі,",
            "reading": "오, 이싸 쎈 앨렘능 트례그, 아담잣뜽 틀레그"
          },
          {
            "kk": "Өмірімнің өзегі. О, Иса! Өмір бердің өмірге.",
            "reading": "외므름능 외졔그, 오, 이싸! 외므르 베르등 외므르게."
          },
          {
            "kk": "Сенген адам Өзіңе тірілсін деп мәңгіге",
            "reading": "쎈겐 아담 외증예 트를쓴 뎁 맹그게"
          }
        ]
      }
    ]
  },
  {
    "id": "ey-adamdar",
    "slug": "ey-adamdar",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Ей, адамдар"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "1. Ей, адамдар, Жаралғандар",
            "reading": "에이, 아담다르, 쟈랄간다르"
          },
          {
            "kk": "Бұл дүниеде адаспаңдар.",
            "reading": "불 두네뎨 아다스팡다르."
          },
          {
            "kk": "Иса міне келді бізге,",
            "reading": "이싸 므네 켈드 브즈게"
          },
          {
            "kk": "Құтқарылат көз ашқандар.",
            "reading": "쿳카를랏 쾨즈 아싀칸다르"
          },
          {
            "kk": "Сол - Иса, Сол - Иса,",
            "reading": "쏠 이-사, 쏠 이-사"
          },
          {
            "kk": "Ол - Тәңір, Ол - Тәңір",
            "reading": "올 탱으르, 올 탱으르"
          },
          {
            "kk": "Құтқарушым, Қуанышым,",
            "reading": "쿳카루-싐, 쿠아느-싐"
          },
          {
            "kk": "Қорғанышым, Жұбанышым",
            "reading": "코르가느-싐, 주바느-싐"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "2. Ол сыйдады мәңгілікті",
            "reading": "올 쓰일라드 맹글륵뜨"
          },
          {
            "kk": "Мойнымыздан алды жүкті.",
            "reading": "모이느므즈단~ 알드 쥑뜨"
          },
          {
            "kk": "Ол сыйлады Киелі Рухты,",
            "reading": "올 쓰일라드 키엘르 루흐뜨"
          },
          {
            "kk": "Оған сенген болсын мықты.",
            "reading": "오간 쎈겐 볼쓴 먹트."
          },
          {
            "kk": "Сол Иса, Сол Иса,",
            "reading": "쏠 이-사, 쏠 이-사"
          },
          {
            "kk": "Ол Тәңір, Ол Тәңір",
            "reading": "올 탱으르, 올 탱으르"
          },
          {
            "kk": "Құтқарушым, Қуанышым,",
            "reading": "쿳카루-싐, 쿠아느-싐"
          },
          {
            "kk": "Қорғанышым, Жұбанышым",
            "reading": "코르가느-싐, 주바느-싐"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "3. Иса Тәңір, Ол - мәңгілік",
            "reading": "이싸 탱으르, 올 맹글륵"
          },
          {
            "kk": "Ол мәңгілік құрды билік.",
            "reading": "올 맹글-륵 쿠르드 빌륵"
          },
          {
            "kk": "Патшалардың Патшасы,",
            "reading": "팟샤라르등 팟샤쓰,"
          },
          {
            "kk": "Ол бәрінен тұрды биік.",
            "reading": "올 배르녠 투르드 비윽"
          },
          {
            "kk": "Сол Иса, Сол Иса,",
            "reading": "쏠 이-사, 쏠 이-사"
          },
          {
            "kk": "Ол Тәңір, Ол Тәңір",
            "reading": "올 탱으르, 올 탱으르"
          },
          {
            "kk": "Құтқарушым, Қуанышым,",
            "reading": "쿳카루-싐, 쿠아느-싐"
          },
          {
            "kk": "Қорғанышым, Жұбанышым",
            "reading": "코르가느-싐~, 주바느-싐"
          }
        ]
      }
    ]
  },
  {
    "id": "eng-aldymen",
    "slug": "eng-aldymen",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Ең алдымен"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Ең алдымен Құдайдың Патшалығына кіруге,"
          },
          {
            "kk": "Және Оның әділдігіне Ие болуға тырысыңдар."
          },
          {
            "kk": "Аллелуя, Аллелуя, Аллелуя, Аллелу Аллелуя"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Сонда ол нәрселердің Бәрі сендерге"
          },
          {
            "kk": "Қосымша беріледі. Аллелу, Аллелуя!"
          },
          {
            "kk": "Аллелуя, Аллелуя, Аллелуя, Аллелу Аллелуя"
          }
        ]
      }
    ]
  },
  {
    "id": "eng-zhoghar-eng-uly",
    "slug": "eng-zhoghar-eng-uly",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "ең жоғар ең ұлы"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Ең - жоғары, ең - ұлы! (1)"
          },
          {
            "kk": "Ең - жоғары, ең - ұлы!"
          },
          {
            "kk": "Табиғаттан және барлық адамнан!"
          },
          {
            "kk": "Даналықтан, барлық амалдан!"
          },
          {
            "kk": "Әуел бастан барсың бар болғансың!"
          },
          {
            "kk": "Патшалықтардан, тақтардан,"
          },
          {
            "kk": "Таңырқанатын, бар ғажайыптардан!"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Ең - жоғары, ең - ұлы!(2)"
          },
          {
            "kk": "Бар байлық пен інжу-маржаннан!"
          },
          {
            "kk": "Ешкім тең келмес ең ұлысың!"
          },
          {
            "kk": "//Шегеленді, қабірде жатты!"
          },
          {
            "kk": "Өлу үшін--, өмірге келді!"
          },
          {
            "kk": "Солған гүлдей, тапталған мені--,"
          },
          {
            "kk": "Жаны ашып--, көтерді, Ең - ұлы!//"
          }
        ]
      }
    ]
  },
  {
    "id": "zharatushymnyng-bar-oyyn",
    "slug": "zharatushymnyng-bar-oyyn",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Жаратушымның бар ойын"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Әзірше толық білмеймін.",
            "reading": "애-즈르-쉐 톨-륵 블-메이-믄"
          },
          {
            "kk": "Тек білерім Иса Ием,",
            "reading": "텍 블-례-름 이-싸 이-옘"
          },
          {
            "kk": "Оң жағында Құдайдың.",
            "reading": "옹 자-근-다 쿠-다이-등"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Киелі сөзден оқыдым,",
            "reading": "키-엘-르 쐬-즈-뎬 오-크-듬,"
          },
          {
            "kk": "Құтқарушым екенін.",
            "reading": "쿳-카-루-싐 예-케-는"
          },
          {
            "kk": "Санаммен Оны қабылдап,",
            "reading": "싸-남-몐 오-느 카-블-답,"
          },
          {
            "kk": "Жүрегімменен сенемін.",
            "reading": "쥐-레-금-몌-녠 쎄-녜-믄"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Көктегі орнын қалдырған,",
            "reading": "쾩-톄-그 오르-는 칼-드르-간"
          },
          {
            "kk": "Адамзат үшін жан қиған.",
            "reading": "아-담-잣 우-싄 쟌 키-간"
          },
          {
            "kk": "Түсінбей мен де бір кезде,",
            "reading": "투-슨-베이 몐 뎨 브르 케즈-뎨"
          },
          {
            "kk": "Қабылдаудан бас тартқам.",
            "reading": "카-블-다우-단 바쓰 타릇-캄"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "//Иса тірі, шын сүйеді,",
            "reading": "이-싸 트-르, 싄 쒸-예-드"
          },
          {
            "kk": "Тастамайды Ол ешқашан.",
            "reading": "타스-타-마이-드 올 예싀-카-샨"
          },
          {
            "kk": "Кеше және дәл бүгінде,",
            "reading": "케-쉐 쟈-녜 댈 뷔-근-뎨"
          },
          {
            "kk": "Мәңгілік бірге әрқашан//",
            "reading": "맹-글-륵 브르-게 애르-카-샨"
          }
        ]
      },
      {
        "id": "s5",
        "kind": "verse",
        "label": {
          "kk": "4",
          "ko": "4절"
        },
        "lines": [
          {
            "kk": "Мен үшін өліп, тірілген,",
            "reading": "몐 우-싄 욀-릅 트-를-겐"
          },
          {
            "kk": "Исаға анық сенемін.",
            "reading": "이-싸-가 아-늑 쎄-녜-믄"
          },
          {
            "kk": "Құтқарушым, Тәңірім,",
            "reading": "쿳-카-루-싐 탱-으-름"
          },
          {
            "kk": "Соңынан мәңгі еремін.",
            "reading": "쏭-으-난 맹-그 예-례-믄"
          }
        ]
      },
      {
        "id": "s6",
        "kind": "verse",
        "label": {
          "kk": "5",
          "ko": "5절"
        },
        "lines": [
          {
            "kk": "Ақ бұлтқа мініп аспаннан,",
            "reading": "악 불-트-카 므-늡 아-스-판-난"
          },
          {
            "kk": "Қайтадан жерге келеді.",
            "reading": "카이-따-단 제르-게 켈-례-드"
          },
          {
            "kk": "Тәубеге келсең бауырым,",
            "reading": "태우-베-계 켈-쎙 바우-으-름"
          },
          {
            "kk": "Мәңгілік өмір береді.",
            "reading": "맹-글-륵 외-므르 베-례-드"
          }
        ]
      }
    ]
  },
  {
    "id": "zhasyl-zhaylaugha",
    "slug": "zhasyl-zhaylaugha",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Жасыл жайлауға"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Жасыл жайлауға мені жаясың",
            "reading": "쟈-슬 쟈일-라우-가 몌-느 자-야-씅"
          },
          {
            "kk": "Жақсыны жаным жаудырасың",
            "reading": "쟉-쓰-느 쟈-느-마 쟈우-드-라-씅"
          },
          {
            "kk": "Сүт ішкендей мен еш тарықпаймын, Киелі сөзіңді іше берем.",
            "reading": "숫 으싀-켄-뎨이 몐 예-싀 타-륵-파이-믄 키-예-르 쐬-증-드 으-쉐 베-롐"
          },
          {
            "kk": "Құшағыңды жайып қарсы аласың,",
            "reading": "코-샤-긍-드 쟈이-읍 카르-쓰 알-라-씅"
          },
          {
            "kk": "Сонда мен қуанып табынамын.",
            "reading": "쏜-다 몐 쿠-아-늡 타-브-나-믄"
          },
          {
            "kk": "Бағушым менің, балаңмын Сенің мейірімді Әкем.",
            "reading": "바-쿠-싀 몌-능 발-람- 씅 쎄-능 메이-으-름-드 애케"
          }
        ]
      }
    ]
  },
  {
    "id": "zherdegi-halyqtargha",
    "slug": "zherdegi-halyqtargha",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Жердегі халықтарға"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "1 Жердегі халықтарға құтқарылу берем деп,",
            "reading": "제르-뎨-그 할-륵-타르-가 쿳-카-를-루 베-롐 뎁"
          },
          {
            "kk": "Тәңірім көз ілмейді, ұйықтамайды.",
            "reading": "탱-으-름 쾨-즈 을-메이-드, 육-타-마이-드"
          },
          {
            "kk": "Құдай жүрегіңді берші, онымен біз тұрамыз.",
            "reading": "쿠-다이 쥐-례-긍-드 베르-싀, 오-느-몐 브즈 투-라-므즈"
          },
          {
            "kk": "Соңыңнан біз ереміз",
            "reading": "쏭-응-난 브즈 예-례-므즈"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "2 Жердегі әрбір адам Құдайдың нұрын көру үшін,",
            "reading": "제르-뎨-그 애르-브르 아-담 쿠-다이-등 누-른 쾨-루- 싄"
          },
          {
            "kk": "Тәңірім жарыққа шақырады.",
            "reading": "탱-으-름 쟈-륵-카 샤-크-라-드"
          },
          {
            "kk": "Оның қолы боламыз, осы әлемді емдейміз,",
            "reading": "오-능 콜-르 볼-라-므즈, 오-쓰 앨-렘-드 옘-데이-므즈"
          },
          {
            "kk": "Оған қызмет етеміз",
            "reading": "오-간 크즈-멧 옛-톄-므즈"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Суға теңіздер толғандай",
            "reading": "쑤-가 텡-으즈-뎨르 톨-간-다이"
          },
          {
            "kk": "Тәңірдің Ұлылығы осы әлемді толтырады.",
            "reading": "탱-으르-등 울-르-르-그 오-쓰 앨-렘-드 톨-트-라-드"
          },
          {
            "kk": "Осы әлемді толтырады Ол,",
            "reading": "오-쓰 앨-렘-드 톨-트-라-드 올"
          },
          {
            "kk": "/суға теңіздер толғандай/(*3)",
            "reading": "쑤-가 텡-으즈-뎨-르 톨-간-다이"
          }
        ]
      }
    ]
  },
  {
    "id": "zhol-gholghotagha-alys",
    "slug": "zhol-gholghotagha-alys",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Жол Ғолғотаға алыс"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Жол Ғолғотаға алыс, қиналып қарадың"
          },
          {
            "kk": "Жараңнан тамшылап қаның ақты."
          },
          {
            "kk": "О, Иса қымбаттым, мен үшін қиналдың,"
          },
          {
            "kk": "Азабын Өз еркіңмен көрдің."
          },
          {
            "kk": "Ешқашан ұмыттаймын айқасқан ағашты Байланыстырдың көк пен жерді."
          },
          {
            "kk": "Өлімің жарастырды бізді Құдаймен,"
          },
          {
            "kk": "Таза қаның бізді өтеді"
          },
          {
            "kk": "03/11/2017"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Адамзат, зер салшы, әнімді тыңдашы, Не үміт күтесің бұл дүниеден? Төгілген қанына не төлем бересің? Рақымы Құдайдың бағасыз."
          },
          {
            "kk": "Ешқашан ұмыттаймын айқасқан ағашты Байланыстырдың көк пен жерді."
          },
          {
            "kk": "Өлімің жарастырды бізді Құдаймен,"
          },
          {
            "kk": "Таза қаның бізді өтеді"
          },
          {
            "kk": "03/11/2017"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Рақымдылығыңды Сен бізге жаудырдың, Соның сырын ашшы Сен бізге Нұсқаған жолыңмен Қорықпай жүрейін, Өмірдің әр қилы кезеңінде."
          },
          {
            "kk": "Ешқашан ұмыттаймын айқасқан ағашты Байланыстырдың көк пен жерді."
          },
          {
            "kk": "Өлімің жарастырды бізді Құдаймен,"
          },
          {
            "kk": "Таза қаның бізді өтеді"
          },
          {
            "kk": "03/11/2017"
          }
        ]
      }
    ]
  },
  {
    "id": "zhym-zhyrt-tun",
    "slug": "zhym-zhyrt-tun",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Жым-жырт түн"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Жым-жырт түн ғажап түн",
            "reading": "즘 즈릇 툰 가좝 툰"
          },
          {
            "kk": "Бәрі де ұйықыда",
            "reading": "배르 뎨 육크다"
          },
          {
            "kk": "Ояу тек жұбайлар тебіренген,",
            "reading": "오야우 텍 쥬바이라르"
          },
          {
            "kk": "Сүйкімді Сәбиге еміреніп",
            "reading": "쒸큼드 쌔비게 예므레늡"
          },
          {
            "kk": "/Куанышқа кенелген/ (*2) /",
            "reading": "쿠아느싀카 케녤겐/"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Жым-жырт түн ғажап түн",
            "reading": "즘 즈릇 툰 가좝 툰"
          },
          {
            "kk": "Жар салды көктен үн :",
            "reading": "쟈르 쌀드 쾩톈 운"
          },
          {
            "kk": "Қуан, Мәсіх келді дүниеге!",
            "reading": "쿠안, 매쓱 켈드 두니예게"
          },
          {
            "kk": "Амандық, құтқарылу әкелді,",
            "reading": "아만득, 쿳카를루 애켈드"
          },
          {
            "kk": "/Көктен түсті бір жарық!/(*2)",
            "reading": "쾩톈 튀스트 브르 쟈륵!"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Жым-жырт түн ғажап түн",
            "reading": "즘 즈릇 툰 가좝 툰"
          },
          {
            "kk": "Тәңір шақырды.",
            "reading": "탱으르 샤크르드"
          },
          {
            "kk": "Жан-тәнменен Оны қабылдайық.",
            "reading": "쟌-탠메녠 오느"
          },
          {
            "kk": "Мадақтасын Тәңірді барлық жұрт",
            "reading": "마닥탈쓴 탱으르드"
          },
          {
            "kk": "Құтқарушы берді Ол/ (*2) /",
            "reading": "쿳카루싀 베르드 올/"
          }
        ]
      }
    ]
  },
  {
    "id": "zhuregimmen",
    "slug": "zhuregimmen",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Жүрегіммен"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Жүрегіммен, Тәңірім, Сені аңсаймын",
            "reading": "쥐-레-금-몐 , 탱-으-름, 쎄-느 앙-싸이-믄 Жүрегіммен аңсаймын Сені 쥐-례-금-몐 앙-싸이-믄 쎄-느 Жүрегіммен дауыстаймын, Тәңірім, Саған 쥐-례-금-몐 다우-으스-타이-믄, 탱-으름, 싸- 간 Жүрегіммен үніңді естуді аңсаймын. 쥐-레-금-몐 우-능-드 예스투-드 앙-싸이-믄"
          },
          {
            "kk": "/Сен, Сен келші маған",
            "reading": "쎈, 쎈 켈-싀 마-간 Мәңгіге, мәңгіге, 맹-그-게, 맹-그- 게, Шөлімді қандыршы 숄-름-드 칸-드르- 싀 Сен, Сен келші маған 쎈 , 쎈 켈- 싀 마- 간 Менімен бірге бол 메느몐 브르-게 볼 *1Өмірдің қайнарысың / 외-므르-등 카이-나-르-씅 / 2Тәңір - өмірімнің бұлағы. 탱-으르 – 외-므-름-능 불-라-그."
          }
        ]
      }
    ]
  },
  {
    "id": "zhuregimmenning-kozin-ash",
    "slug": "zhuregimmenning-kozin-ash",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Жүрегімменнің көзін аш"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "//Жүрегімнің көзін аш, Ием",
            "reading": "쥐-례-금-능 쾨 – 즌 아-싀 !"
          },
          {
            "kk": "/Сені көргім келед/(*2)//",
            "reading": "쎄–느 쾨르–금 켈 - 롓"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Лайым даңққа бөленіп",
            "reading": "마-닥-타이-므-즈 브즈 쎄느"
          },
          {
            "kk": "Тәңірім, киелі киелі киелі!",
            "reading": "탱-으-름 키-엘-르 키-엘-르 키-엘-르 !"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "/Киелі, киелі, киелі!/(*3) /",
            "reading": "쎄-느 쾨르 – 금 켈 - 롓"
          }
        ]
      }
    ]
  },
  {
    "id": "zhuremin-sening-men-zholyngmen",
    "slug": "zhuremin-sening-men-zholyngmen",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Жүремін Сенің мен жолыңмен"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Бағытпен Құдайдың көрсеткен",
            "reading": "바그트폔 쿠다이등 코르세켄"
          },
          {
            "kk": "Жақын тануға Сені, Тәңір",
            "reading": "자-큰 타누가 쎄느-, 텡으르"
          },
          {
            "kk": "Рухыңа толтыр Киелі Рух",
            "reading": "루-흥아 톨트르 키옐르 루흐"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Өміріңді паш еттің, Қасиетті қаныңмен",
            "reading": "외므릉드 파쉬 예틍, 카씨예트 카능몐"
          },
          {
            "kk": "Иса бағыт бер,Шындық жол, Иса Ие көрсет!",
            "reading": "이싸 바그트 베르, 싄득 죠르, 이싸 이예 코르쎄트 !"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Сен деп өмір сүрем,",
            "reading": "쎈 뎁 외므르 쑤렘"
          },
          {
            "kk": "Саған ғана ерем",
            "reading": "싸간 가나 예렘"
          },
          {
            "kk": "Сенің ізгі сөзің",
            "reading": "쎄능 으즈그 쑤증"
          },
          {
            "kk": "Таралсын әлемге.",
            "reading": "타랄쓴 옐렘게"
          },
          {
            "kk": "Жеңімпаз болам мен,",
            "reading": "졩음파즈 볼람 몐"
          },
          {
            "kk": "Келеді осы күн,",
            "reading": "켈례드 오스 쿤"
          },
          {
            "kk": "Артқа шегінбеймін,",
            "reading": "아르카 쉐근베이믄"
          },
          {
            "kk": "Ұлы Патша!",
            "reading": "울르 퍄샤 !"
          }
        ]
      }
    ]
  },
  {
    "id": "iemizdi-madaqtangdar",
    "slug": "iemizdi-madaqtangdar",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Иемізді мадақтаңдар!"
    },
    "songKey": "F",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Иемізді мадақтаңдар",
            "chords": "[F]Иемізді [C]мадақтаңдар,",
            "reading": "이예-므즈-드 마-닥-탕-다르"
          },
          {
            "kk": "Барлық ұлттар.",
            "chords": "[Dm]Оның Атын [Bb]дәріптеңдер.",
            "reading": "바르-륵 울-따르"
          },
          {
            "kk": "Оны мадақтаңдар,",
            "chords": "[F]Мәңгілік [C]рақымы Оның,",
            "reading": "오-느 마-닥-탕-다르"
          },
          {
            "kk": "Күллі халықтар.",
            "chords": "[Bb]Бізбен [C]бір-[F]ге!",
            "reading": "쿨-르 할-륵-타르"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Ол зор мейірімін көрсетіп,",
            "reading": "올 조르 메이-으-르믄 쾨르-세-틉,"
          },
          {
            "kk": "Бізге мәңгілік адал болады.",
            "reading": "브즈-게 맹-글-륵 아-달 볼-라-드"
          },
          {
            "kk": "Мадақтаңдар Иемізді(аллелуя!)",
            "reading": "마-닥-탕-다르 이-예-므즈-드(할렐루야)"
          },
          {
            "kk": "Мадақтаңдар Иемізді.",
            "reading": "마-닥-탕-다르 이-예-므즈-드"
          }
        ]
      }
    ]
  },
  {
    "id": "isa",
    "slug": "isa",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Иса"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "/Иса, Иса, Киелі таңдалған Иса."
          },
          {
            "kk": "Иса, Иса, Тірілген , жоғарылаған Иса/"
          },
          {
            "kk": "Сенің Атың бал сияқты ерніме"
          },
          {
            "kk": "Сенің Рухың су сияқты жаныма"
          },
          {
            "kk": "Сенің Сөзің шам сияқты аяғыма"
          },
          {
            "kk": "Сені сүйемін, О, Иса."
          }
        ]
      }
    ]
  },
  {
    "id": "isa-aty-barlyq-zherde",
    "slug": "isa-aty-barlyq-zherde",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Иса аты барлық жерде"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Иса аты барлық жер",
            "reading": "이싸 아트 발-륵 졔르-뎨"
          },
          {
            "kk": "Жер мадаққа толады",
            "reading": "졔르 마닥-카 톨라드"
          },
          {
            "kk": "Тәңір аты жер шетінен",
            "reading": "탱으르 아트 제르 쉐트녠"
          },
          {
            "kk": "Аспанға жетеді",
            "reading": "아스판가 제톄드"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "1. Қуанар Иса жандарды тауып",
            "reading": "쿠아-나르 이-싸 쟌-다르- 드 타-웁,"
          },
          {
            "kk": "адасып жүрген бұл әлемде",
            "reading": "아-다-습 쥐르-겐 불 앨-렘-뎨"
          },
          {
            "kk": "Ән салып билеп мадақтаймыз біз,",
            "reading": "앤 쌀-릅 빌-롑 마-닥-타이-므즈 -브즈"
          },
          {
            "kk": "Құдай Патшалығына ән саламыз",
            "reading": "쿠다이 팟-샬-르그-나 앤 쌀라-므즈"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Иса аты барлық жер",
            "reading": "이싸 아트 발-륵 졔르-뎨"
          },
          {
            "kk": "Жер мадаққа толады",
            "reading": "졔르 마닥-카 톨라드"
          },
          {
            "kk": "Тәңір аты жер шетінен",
            "reading": "탱으르 아트 제르 쉐트녠"
          },
          {
            "kk": "Аспанға жетеді",
            "reading": "아스판가 제톄드"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "verse",
        "label": {
          "kk": "4",
          "ko": "4절"
        },
        "lines": [
          {
            "kk": "2. Құдай Патшалығы менің жанымда,",
            "reading": "쿠-다이 팟-샬-르-그- 몌-능 쟈-늠-다"
          },
          {
            "kk": "Жүрегімде Тәңір әрқашан",
            "reading": "쥐-레-금-뎨 탱-으르 애르-카-샨"
          },
          {
            "kk": "Иса келді бүкіл әлемге",
            "reading": "이-싸 켈-드 뷔-클 앨-렘-게"
          },
          {
            "kk": "Кез болсын сенің жаның Оған",
            "reading": "케즈- 볼-쓴 쎄-능 쟈-능 오간"
          }
        ]
      }
    ]
  },
  {
    "id": "isa-m-sih",
    "slug": "isa-m-sih",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Иса Мəсіх!"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Иса Мəсіх! Тең келмес"
          },
          {
            "kk": "бұл дүниеде ешкім,"
          },
          {
            "kk": "Бар аспан мадаққа бөленсін,"
          },
          {
            "kk": "Əр жүрек Сені дəріптесін!"
          },
          {
            "kk": "Иса Мəсіх! Құдай сонша сүйді адамды,"
          },
          {
            "kk": "Жалғыз Ұлы құрбан етті Ол,"
          },
          {
            "kk": "Сенсең, мәңгі өмірге ие бол"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Иса Мəсіх!(Қ-сы)"
          },
          {
            "kk": "Мадақта Осанна,"
          },
          {
            "kk": "Оның атын мәңгі дəріпте,"
          },
          {
            "kk": "Иса Мəсіх, мадақ Саған,"
          },
          {
            "kk": "Иса Мəсіх-ең ұлы Патша!"
          }
        ]
      }
    ]
  },
  {
    "id": "isa-meni-suyedi",
    "slug": "isa-meni-suyedi",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Иса мені сүйеді"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Иса мені сүйеді 1"
          },
          {
            "kk": "Иса мені сүйеді Нық білемін Осыны",
            "reading": "이싸 몌느 쒸이예드 늑 블례믄 오스느"
          },
          {
            "kk": "Балаларын ШаҚырып Көтереді Қолына",
            "reading": "발라라른 샤크릅 쾨퇴례드 콜른아"
          },
          {
            "kk": "Иса мені сүйеді Иса мені сүйеді.",
            "reading": "이싸 몌느 쒸이예드 이싸 몌느 쒸이예드"
          },
          {
            "kk": "Иса мені сүйеді Киелі Кітап солай дейді.",
            "reading": "이싸 몌느 쒸이예드 키옐르 크탑 쏠라이 데이드"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Иса мені сүйеді 2"
          },
          {
            "kk": "Мейірімді ЖҮрегін Айқышқа Ол Көтерді.",
            "reading": "메이름드 쥐레근 아이크싀카 올 쾨테르드"
          },
          {
            "kk": "Мен Үшін Ол Қан Төгіп Сол Қанмен Жуды.",
            "reading": "몐 우쉰 올 칸 퇴급 쏠 칸몐 주우드"
          },
          {
            "kk": "Иса мені сүйеді Иса мені сүйеді.",
            "reading": "이싸 몌느 쒸이예드 이싸 몌느 쒸이예드"
          },
          {
            "kk": "Иса мені сүйеді Киелі КІтап солай дейді.",
            "reading": "이싸 몌느 쒸이예드 키옐르 크탑 쏠라이 데이드"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Иса мені сүйеді 3"
          },
          {
            "kk": "Иса Мәңгі Менікі Қауіпсізбін мен енді.",
            "reading": "이싸 멩그 몌느크 카웁스즈븐 몐 옌드"
          },
          {
            "kk": "Менің Жаным Исада Құдай мені Сақтайді.",
            "reading": "몌능 쟈늠 이싸다 쿠다이 몌느 싹타이드"
          },
          {
            "kk": "Иса мені сүйеді Иса мені сүйеді.",
            "reading": "이싸 몌느 쒸이예드 이싸 몌느 쒸이예드"
          },
          {
            "kk": "Иса мені сүйеді Киелі Кітап солай дейді.",
            "reading": "이싸 몌느 쒸이예드 키옐르 크탑 쏠라이 데이드"
          }
        ]
      }
    ]
  },
  {
    "id": "isa-tolyp-tur",
    "slug": "isa-tolyp-tur",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Иса, толып тұр"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Иса толып тұр менің жүрегім",
            "reading": "쿳-카-루-싐 외-므-름 몌-능 쎈-씅"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Иса! Таптым мен байлықты",
            "reading": "이-싸-! 탑-뜸 몐 바일-륵-뜨"
          },
          {
            "kk": "Алтыннан да қымбат",
            "reading": "알-튼-난 다 컴-밧"
          },
          {
            "kk": "Иса, сүйемін Сені,",
            "reading": "이–싸-, 쒸-예-믄 쎄-느"
          },
          {
            "kk": "Құдайым Тәңірім.",
            "reading": "쿠-다이-음 탱-으-름"
          }
        ]
      }
    ]
  },
  {
    "id": "isa-tolyp-tur-mening-zhuregim",
    "slug": "isa-tolyp-tur-mening-zhuregim",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Иса, толып тұр менің жүрегім"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Құтқарушым өмірім менің Сенсің",
            "reading": "쿳카루싐 외므름 몌능 쎈-씅"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Иса! Таптым мен байлықты",
            "reading": "쿠다이음 탱으름"
          }
        ]
      }
    ]
  },
  {
    "id": "iya-iya-isany-men-suyem",
    "slug": "iya-iya-isany-men-suyem",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Ия, ия, Исаны мен сүйем"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "/Ия, ия, Исаны мен сүйем",
            "reading": "야, 야, 이싸느 몐 쒸옘"
          },
          {
            "kk": "Барлық жүрегіммен/ (*2)",
            "reading": "바 르 쥐레금몐"
          },
          {
            "kk": "Сүйесің бе Исаны",
            "reading": "쒸예씅 볘 이싸느"
          },
          {
            "kk": "Барлық жүрегіңмен?",
            "reading": "바 르 쥐렉긍몐?"
          },
          {
            "kk": "- Ия, Исаны мен сүйем",
            "reading": "야, 이싸느 몐 쒸엠"
          },
          {
            "kk": "Барлық жүрегіммен",
            "reading": "바 르 쥐레금몐"
          }
        ]
      }
    ]
  },
  {
    "id": "kel-kel-bizge",
    "slug": "kel-kel-bizge",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Кел Кел бізге"
    },
    "songKey": "Dm",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "//Шаттан Шаттан",
            "chords": "[Dm]Кел, кел бізге [Gm]Имануил,",
            "reading": "샤--탄 샤--탄"
          },
          {
            "kk": "Шаттан Қазақстан",
            "chords": "[C]Тұтқыннан құтқар [F]халқыңды,",
            "reading": "샤--탄 카자흐스탄"
          },
          {
            "kk": "Имануел Саған келмек//(2)",
            "chords": "[Gm]Сені зарыға [Dm]күткен,",
            "reading": "이마누엘 싸--간 켈--멕"
          }
        ]
      }
    ]
  },
  {
    "id": "kel-qazir-madaq-uaqyty",
    "slug": "kel-qazir-madaq-uaqyty",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Кел, қазір мадақ уақыты"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Кел, жүрегіңді Оған бергін.",
            "reading": "켈, 쥐-레-긍-드 오-간 베르-근,"
          },
          {
            "kk": "Кел, табынуға жаныңмен,",
            "reading": "켈, 타-브-누-가 쟈-능-멘,"
          },
          {
            "kk": "Кел, өз Тәңіріңнің алдына, кел!/",
            "reading": "켈, 외-즈 탱-으릉-능 알-드-나, 켈!"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "/Уақыт келет, мойындады барлығы,",
            "reading": "와-컷 켈-렛 모이-읜-다-드 바를-르-그,"
          },
          {
            "kk": "Тізе бүгіп Құдайсың деп.",
            "reading": "트-제 뷔-급 쿠-다이-승 뎁"
          },
          {
            "kk": "Оны тану қазына асылы",
            "reading": "오-느 타-누 카-즈-나 아-쓸-르"
          },
          {
            "kk": "Қуаныш жүректі кернеп/( *2)",
            "reading": "쿠아-느-싀 쥐-렉-뜨 케르-넵"
          }
        ]
      }
    ]
  },
  {
    "id": "kelemin-saghan",
    "slug": "kelemin-saghan",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Келемін Саған"
    },
    "songKey": "C",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "//1. Келемін Саған Жаратушым,",
            "chords": "[C]Келемін Саған, [Em]Жаратушым,",
            "reading": "켈-례-믄 싸-간 쟈-라-뚜-싐"
          },
          {
            "kk": "Сенің шексіз махаббатың,",
            "chords": "[Dm]Жүрегімді [G7]ашамын.",
            "reading": "타우-슬-마이-드 라-크-믕"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Ұлысың Сен!",
            "chords": "[C]Қабыл алшы [Em]мінажатымды,",
            "reading": "울-르-씅 쎈"
          },
          {
            "kk": "Сен ғажайып Ұлысың,",
            "chords": "[Dm]Алдыңа келіп [G7]бас ие-[C]мін.",
            "reading": "쎈 가-쟈이-읍 울-르-씅"
          },
          {
            "kk": "Сенен артық бір күш жоқ,",
            "chords": "[F]Сенің қасиетті [G]қатысуыңда,",
            "reading": "쎄-녠 아르-특 브르 쿠-싀 족"
          },
          {
            "kk": "Саған ешкім тең келмес,",
            "chords": "[Em]Жаным менің [Am]тыныштық табар.",
            "reading": "싸-간 예싀-큼 텡 켈-메스"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "/2. Келемін Саған, аңсап Сені,",
            "chords": "[Dm]Қасиетті [G7]Құда-[C]йым.",
            "reading": "맹-글-륵-케 쟈-사-싀"
          }
        ]
      }
    ]
  },
  {
    "id": "kelingder-sabige",
    "slug": "kelingder-sabige",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Келіңдер Сәбиге"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "1. Келіңдер Сәбиге адал жүрекпен,",
            "reading": "켈릉뎨르 쌔비게, 아달 쥐렉펜"
          },
          {
            "kk": "Келіңдер Оған Бетлехемге тезірек",
            "reading": "켈릉데르 오간 베트레헴게 테즈렉"
          },
          {
            "kk": "Дүниеге келді ғаламның Патшасы",
            "reading": "두니예게 켈드 갈람능 팟샤쓰"
          },
          {
            "kk": "/ Келіңдер тағзым етіңдер,/(*3)",
            "reading": "켈릉뎨르 타그즘 옛뜽뎨르"
          },
          {
            "kk": "Тәңірге!",
            "reading": "탱으르게"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "2. Жарықтан мәңгі Жарық Құдай туды Құдайдан",
            "reading": "자륵탄 맹그 쟈륵 쿠다이 투드 쿠다이단"
          },
          {
            "kk": "Пәк қыздан туды, Ол, кішіпейіл.",
            "reading": "팩 크즈단 투드, 올, 크싀-페이-을"
          },
          {
            "kk": "Адам боп келді жаралмаған Құдай.",
            "reading": "아담 봅 켈드 자랄마간 쿠다이"
          },
          {
            "kk": "/ Келіңдер тағзым етіңдер,/(*3)",
            "reading": "켈릉뎨르 타그즘 옛뜽뎨르"
          },
          {
            "kk": "Тәңірге!",
            "reading": "탱으르게"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "3. Иса, Саған келеміз, Саған сиынамыз.",
            "reading": "이싸, 싸간 켈레므즈, 싸간 씨으나므즈"
          },
          {
            "kk": "Құрметтеп, Сені мадақтап ән айтамыз",
            "reading": "쿠르멧텝, 쎄느 마닥탑 앤 아이타므즈"
          },
          {
            "kk": "Мәңгілік Сөз Адам боп жерге келді.",
            "reading": "맹글륵 쐬즈 아담 봅 제르게 겔드"
          },
          {
            "kk": "/ Келіңдер тағзым етіңдер,/(*3)",
            "reading": "켈릉뎨르 타그즘 옛뜽뎨르"
          },
          {
            "kk": "Тәңірге!",
            "reading": "탱으르게"
          }
        ]
      }
    ]
  },
  {
    "id": "kieli-kieli-tangirsing",
    "slug": "kieli-kieli-tangirsing",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Киелі киелі Тәңірсің"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Бүкіл жер толы даңқыңа Сенің",
            "reading": "부-클 졔르 톨-르 당-킁-아 쎄-능"
          },
          {
            "kk": "Барлық халық жырласын",
            "reading": "바를-륵 할-륵 즈를-라-쓴"
          },
          {
            "kk": "Құрметпен Сені мақтасын!",
            "reading": "쿠르-멧-펜 쎄-느 막-타-쓴"
          },
          {
            "kk": "Жарқырашы Сен бізге",
            "reading": "쟈르-크-라-싀 쎈 브즈-게"
          },
          {
            "kk": "Тек Өзіңді Әлем көрсін!",
            "reading": "텍 외-증-드 앨-렘 쾨르-쓴!"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Ұрандайды көк аспан:"
          },
          {
            "kk": "«Неткен әсем Құдайым!»",
            "reading": "우-란-다이-드 콕 아스-판"
          },
          {
            "kk": "Ән салад ғалам : «Аллелуя, Патша Құдай!»",
            "reading": "앤 쌀-랏 갈-람 : “알-렐-루-야, 팟-샤 쿠-다이!”"
          }
        ]
      }
    ]
  },
  {
    "id": "madaqta-isany",
    "slug": "madaqta-isany",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Мадақта Исаны!"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "/Мадақта Исаны!",
            "reading": "마-닥-타 이-싸-느 Мадақта Исаны! 마-닥-타 이-싸-느 Әр күнде, әр күнде, 애르 쿤-뎨 애르 쿤-뎨 Оның атын мадақта /(*2) 오-능 아-튼 마-닥-타"
          },
          {
            "kk": "/Еш нәрседен қорықпа",
            "reading": "예-싀 내르-세-덴 코-륵-파 Иса бірге болады 이-싸 브르-게 볼-라-드 Жеңіске сен ие боласың/(*2) 젱-으스-케 쎈 이예 볼-라-씅"
          },
          {
            "kk": "/Құдайды білу бақыт,",
            "reading": "쿠-다이-드 블-루 바-컷 Құдаймен тату болу бақыт/(*2)쿠-다이-몐 타뚜 볼루 바컷"
          }
        ]
      }
    ]
  },
  {
    "id": "madaqtayyq",
    "slug": "madaqtayyq",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Мадақтайық!"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "/Мадақтайық! Мадақтайық! /",
            "reading": "마닥타읙, 마닥타읙 Патшаны бар дауыспен 팟샤느 바르 다우스펜 мадақтайық!/(*2) 마닥타이읙/(*2)"
          },
          {
            "kk": "Мадақты қабыл ал,",
            "reading": "마닥뜨 카블 알 Бұл мадақ Саған, 불 마닥 싸간 Біздің өзгермес ғажап Құдай. 브즈등 외즈게르메스 가쟙 쿠다이 Тізе бүгіп Сені шақырамын, 트제 뷔급 쎄느 샤크라믄 /Иса - Тәңірім!/ (*3) /이싸 - 탱으름! /(*3) Аумин 아우민"
          }
        ]
      }
    ]
  },
  {
    "id": "mahabbat-zhane-kush",
    "slug": "mahabbat-zhane-kush",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Махаббат және күш"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "/Махаббат және күш",
            "reading": "마하밧 재네 쿠싀 көп өмірімде менің/(*2) 쾹 외므름뎨 메능"
          },
          {
            "kk": "Саған мен сиынам,",
            "reading": "싸간 몐 씨의남 барлық жүрегіммен 바르 쥐레금멘 Саған мен сиынам, 싸간 몐 씨의남 барлық есіммен 바르륵 예씀몐 Саған мен сиынам 싸간 몐 씨의남 барлық күшіммен 바르륵 쿠싐 몐 Сен менің Патшам 쎈 몌능 팟샴 Құдайым 쿠다이음"
          },
          {
            "kk": "19/11/2017"
          }
        ]
      }
    ]
  },
  {
    "id": "mahabbattyng-qanday",
    "slug": "mahabbattyng-qanday",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Махаббаттың қандай"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Кешірілдім, себебі айыпталдың",
            "reading": "쎈 욀 - 릅 카이- 타 트 - 를 - 등"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Махаббатың қандай ғажап,",
            "reading": "마-하-밧-틍 칸-다이 가 - 쟙"
          },
          {
            "kk": "Патша Сен өлдің мен үшін",
            "reading": "팟-샤 -쎈 욀-등 몐 우-싄 Махаббатың қандай ғажап, 마-하-밧-틍 칸-다이 가- 쟙 Қастерлеймін, қуанамын. 카스- 톄를-레이-믄 쿠아-나-믄"
          },
          {
            "kk": "Бар ісіммен құрметтеймін.",
            "reading": "바르 으-씀-멘 쿠르-멧-테이-믄"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "/Иса, Сен - Патшамсың/(*3)",
            "reading": "/이 - 사, 쎈 팟 – 샴 - 씅/"
          }
        ]
      }
    ]
  },
  {
    "id": "meyiriminge-toly",
    "slug": "meyiriminge-toly",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Мейіріміңе толы"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "/Мейіріміңе толы жер беті",
            "reading": "메이으-르-믕-에 톨-르 제르 베-트"
          },
          {
            "kk": "Мейіріміңе толы өмірім.",
            "reading": "메이으-르-믕-에 톨-르 외-므-름"
          },
          {
            "kk": "Мейірімің соттан да үстем,",
            "reading": "메이으-르-믕 쏫-탄 다 우스-템"
          },
          {
            "kk": "Құнымды төлеп, қабылдадың/(*2)",
            "reading": "쿠-늠-드 퇼-렙,카-블-다-등"
          },
          {
            "kk": "/Құтқарып Сен ақтадың",
            "reading": "쿳- 카-릅 쎈 악-타-등"
          },
          {
            "kk": "Азат еттің күнәдан/(*2)",
            "reading": "아-잣 옛-틍 쿠-내-단"
          },
          {
            "kk": "/Алғыс Саған, Иса!/(*2)",
            "reading": "알-그스 싸-간, 이-싸"
          }
        ]
      }
    ]
  },
  {
    "id": "men-saghan-oleng-aytam",
    "slug": "men-saghan-oleng-aytam",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Мен Саған өлең айтам"
    },
    "songKey": "C",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Мен Саған өлең айтамын.",
            "chords": "[C]Мен Саған өлең [G]айтамын,",
            "reading": "멘 싸-간 욀-렝 아이-타- 믄."
          },
          {
            "kk": "Тәңір, Саған табынамын.",
            "chords": "[Am]Жүректен шыққан [F]әнімді.",
            "reading": "탱-으르, 싸-간 타-브-나-믄"
          },
          {
            "kk": "Саған мәңгі ризамын мен.",
            "chords": "[C]Өйткені Сенсің [G]Құдайым,",
            "reading": "싸-간 맹-그 리-자-믄 몐"
          },
          {
            "kk": "Құтқарғаныңа қуанамын.",
            "chords": "[F]Жарық [G]еткен жо-[C]лымды.",
            "reading": "쿳-카르-가-능-아 쿠아-나-믄"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Көктен жерге келдің,",
            "reading": "쾩-텐 제르-게 켈-등"
          },
          {
            "kk": "Шын өмір беру үшін",
            "reading": "싄 외-므르 베-루 우-싄"
          },
          {
            "kk": "Киелі қаныңды төктің,",
            "reading": "키-옐-르 카-능-드 퇵-틍"
          },
          {
            "kk": "Құнымды төледің",
            "reading": "쿠-늠-드 퇼-레-등"
          },
          {
            "kk": "Өлімнен Сен тірілдің,",
            "reading": "욀-름-녠 쎈 트-를-등"
          },
          {
            "kk": "Көкке көтердің",
            "reading": "콕-케 쾨-테르-등"
          },
          {
            "kk": "Атыңды мен көтерем",
            "reading": "아-틍-드 멘 쾨-테-렘"
          }
        ]
      }
    ]
  },
  {
    "id": "mende-bar-bir-tilek",
    "slug": "mende-bar-bir-tilek",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Менде бар бір тілек"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Менде бар бір тілек - Дәріптеу Сені",
            "reading": "멘뎨 바르 브르 틀롁 – 대릅톄우 쎄느"
          },
          {
            "kk": "Жүрегіммен, Тәңір, Даңқтаймын Сені",
            "reading": "쥐레금몐, 텡으르, 당크타이믄 쎄느"
          },
          {
            "kk": "Мендегі бардың бәрі – Мадақтайт Сені",
            "reading": "몐뎨그 바르등 배르 – 마닥타잇 쎄느"
          },
          {
            "kk": "Махаббатым, Тәңір, бір Өзіңе.",
            "reading": "마하바틈, 탱으르, 브르 외증예"
          },
          {
            "kk": "Жүрегімді берем, жаныммен бірге",
            "reading": "쥐레금드 베렘, 쟈늠몐 브르게"
          },
          {
            "kk": "Тек Сен – өмірімсің",
            "reading": "텍 쎈 - 외므름씅"
          },
          {
            "kk": "Әр қадамым менің Сенімен болсын,",
            "reading": "애르 카다믐 몌능 쎄느몐 볼쓴"
          },
          {
            "kk": "Еркің Сенің орындалсын.",
            "reading": "예르킁 쎄능 오른달쓴"
          }
        ]
      }
    ]
  },
  {
    "id": "meni-qoldaysyng",
    "slug": "meni-qoldaysyng",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Мені қолдайсың"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Мені қолдайсың, Құдайым,",
            "reading": "몌-느 콜-다이-씅 쿠-다이-음"
          },
          {
            "kk": "Қорғайсың мені әрдайым,",
            "reading": "코르-가이-씅 몌-느 애르-다이-음"
          },
          {
            "kk": "Құдіретті Әкем.",
            "reading": "쿠-드-렛-뜨 애-켐"
          },
          {
            "kk": "Мен құладым, Сен көтердің,",
            "reading": "몐 쿨-라-듬 쎈 쾨-떼르-등"
          },
          {
            "kk": "Шөлдегенімде су бердің,",
            "reading": "숄-뎨-게-늠-뎨 쑤 베르-등"
          },
          {
            "kk": "Құтқарушы Ием.",
            "reading": "쿳-카-루-싀 이-옘"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Иса - Құтқарушым,",
            "reading": "이 사 쿳-카-루-싐"
          },
          {
            "kk": "Лайықсың Өзіңнің атыңа.",
            "reading": "라이-윽-씅 외-증-능 아-틍-아"
          },
          {
            "kk": "Иса - Жаратушым,",
            "reading": "이 - 사 쟈-라-뚜-싐"
          },
          {
            "kk": "Керексің Сен менің жаныма.",
            "reading": "케-렉-씅 쎈 몌-능 쟈-느-마."
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Өмірімізді өзгерттің,",
            "reading": "외-므르-므즈-드 외즈-게릇-틍"
          },
          {
            "kk": "Біз үшін өліп тірілдің,",
            "reading": "브즈 우-싄 욀-릅 트-를-등,"
          },
          {
            "kk": "Менің Ұлы Әкем",
            "reading": "몌-능 울-르 애-콈."
          },
          {
            "kk": "Күнәдан бізді босаттың,",
            "reading": "쿠-내-단 브즈-드 보-삿-틍"
          },
          {
            "kk": "Мәңгілік өмір сыйладың,",
            "reading": "맹-그-륵 외-므르 쓰-일-라-등"
          },
          {
            "kk": "Құтқарушы Ием.",
            "reading": "쿳-카-루-싀 이-옘."
          }
        ]
      },
      {
        "id": "s4",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Қай жерде болмасам да мен,",
            "reading": "카이 제르-뎨 볼-마-쌈 다 몐,"
          },
          {
            "kk": "Менің жүрегімдесің Сен,",
            "reading": "몌-능 쥐-레-금-뎨-씅 쎈,"
          },
          {
            "kk": "Жаратушы Ием.",
            "reading": "쟈-라-뚜-싀 이-옘"
          },
          {
            "kk": "Жарық бол енді жолыма,",
            "reading": "쟈-륵 볼 옌-드 졸-르-마,"
          },
          {
            "kk": "Рухыңды енгіз бойыма,",
            "reading": "루-흥-드 옌-그즈 보이-으-마,"
          },
          {
            "kk": "Жетелеші Ием.",
            "reading": "제-텔-레-싀 이-옘."
          }
        ]
      }
    ]
  },
  {
    "id": "mening-akem-qushaghynda",
    "slug": "mening-akem-qushaghynda",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Менің Әкем құшағында"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Менің Әкем құшағында",
            "reading": "몌-능 애-켐 쿠-샤 –근 - 다"
          },
          {
            "kk": "Тыныштыққа жаным бөленер",
            "reading": "트-느-싀-특 쟈늠 뵐-레-녜-르"
          },
          {
            "kk": "Құшақтап Сен қорғайсың өмірімді",
            "reading": "쿠-샥-탑 쎈 코르-가이-씅 외-므-름-드"
          },
          {
            "kk": "Бойымды тыныштық кернейді.",
            "reading": "보이-음-드 트-느-싀-특 켸르-네이-드"
          },
          {
            "kk": "Өмірімде құласам, шайқалсам да мен",
            "reading": "외- 므-름- 뎨 쿨-라-쌈, 샤이-칼-쌈 다 몐"
          },
          {
            "kk": "Бойымдасың Тәңірім мені ұстап тұрсың.",
            "reading": "보이음-다-씅 탱-으-름, 몌-느 우스-탑 투르- 씅"
          },
          {
            "kk": "Барлық ойымды бұрамын мен Саған, Сен беретін тыным киімін киемін.",
            "reading": "바를-륵 오이-음-드 부라-믄 멘 싸간, 쎈 베-레-튼 트-늠 키으-믄 키-예-믄"
          },
          {
            "kk": "Сенің уәдеңде жаным тыныштықта менікінен зор жоспарыңның барына сенемін.",
            "reading": "쎄능 와-뎽-뎨 쟈늠 트-느-싀-타 몌-느-크-녠 조르 죠스-파-릉-능 바르-나 쎄-녜-믄"
          },
          {
            "kk": "Қорқынышты жоямын тек Саған сүйенем,",
            "reading": "코르-크-느싀-뜨 죠-야-믄 텍 싸간 쒸-예-녬"
          },
          {
            "kk": "Менің жаным аман тұр, Тәңірім Сенде",
            "reading": "몌능 쟈늠 아만 투르, 탱으름 쎈뎨"
          }
        ]
      }
    ]
  },
  {
    "id": "masih-olip-tirildi",
    "slug": "masih-olip-tirildi",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Мәсіх өліп тірілді"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Мәсіх өліп тірілді, Аллилуйя!"
          },
          {
            "kk": "Ескі жылан езілді, Аллилуйя!"
          },
          {
            "kk": "Жеңіп шықты Мәсіғім, Аллилуйя!"
          },
          {
            "kk": "Ақталды үмітім, Аллилуйя!"
          },
          {
            "kk": "Аллилуйя! Аллилуйя!"
          },
          {
            "kk": "Аллилуйя! Аллилуйя!"
          }
        ]
      }
    ]
  },
  {
    "id": "manggilik-madaqtaymyn-seni",
    "slug": "manggilik-madaqtaymyn-seni",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Мәңгілік мадақтаймын Сені"
    },
    "songKey": "C",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Таулар мен өзен арқылы Сенің сүйіспеншілігің,",
            "chords": "[C]Мәңгілік мадақ-[G]таймын Сені,",
            "reading": "타우-라르 멘 외젠 아르-클-르 쎄-능 쒸-으스-펜-싈-르-긍"
          },
          {
            "kk": "Маған мәңгі жетіп тұрады – Ием",
            "chords": "[Am]Бар өмірімді [F]арнаймын.",
            "reading": "마-간 맹-그 제-틉 투-라-드 이엠"
          },
          {
            "kk": "Күнәлардан азат болып,",
            "chords": "[C]Иса Тәңірім, [G]Құтқарушым,",
            "reading": "쿠-내-라르-단 아-잣 볼-릅"
          },
          {
            "kk": "Шындыққа шексіз қуанам,",
            "chords": "[F]Саған [G]ән сала-[C]мын.",
            "reading": "싄-득-카 쉑-쓰즈 쿠-아-남"
          },
          {
            "kk": "Мадақтаймын Сені, Киелі Рухқа тола!",
            "reading": "마-닥-타이-믄 쎄-느 키-엘-르 루흐-카 톨-라!"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Мадақтаймын Сені мәңгілік!",
            "reading": "마-닥-타이-믄 쎄-느 맹-글-륵"
          },
          {
            "kk": "Дәріптеймін Сені мәңгілік!",
            "reading": "대-릅-테이-믄 쎄-느 맹-글-륵"
          },
          {
            "kk": "Махаббатыңа мен толамын,",
            "reading": "마-하-밧-틍-아 몐 톨-라-믄"
          },
          {
            "kk": "Тынбастан соны, мен айтамын!",
            "reading": "튼-바스-탄 쏘-느 몐 아이-타-믄"
          }
        ]
      }
    ]
  },
  {
    "id": "nur-alemning",
    "slug": "nur-alemning",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Нұр Әлемнің"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Нұры Әлемнің Сен түнекке келдің Көзімді аштың көремін.",
            "reading": "누-르 앨-렘-능 쎈 투-넥-케 켈-등 쾨-즘-드 아-싀-틍 쾨-례-믄"
          },
          {
            "kk": "Жүрекпен Саған табынамын Тәңірім, Сенімен мәңгі біргемін.",
            "reading": "쥐-렉-펜 싸-간 타-브-나-믄 탱-으름 쎄-느-멘 맹-그 브르-게-믄"
          },
          {
            "kk": "Осы жерде бас ием, Саған тағзым етем.",
            "reading": "오-쓰 졔르-뎨 바쓰 이옘 싸-간 타그-즘 옛-템"
          },
          {
            "kk": "Сен Құдайымсың деймін Саған.",
            "reading": "쎈 쿠-다이-음-씅 뎨이-믄 싸-간"
          },
          {
            "kk": "Сен бәрінен сүйікті, Мадаққа лайықты",
            "reading": "쎈 배-르-녠 쉬-윽-뜨 마-닥-카 라이-윽-뜨"
          },
          {
            "kk": "Бәрінен ғажапсың Сен маған",
            "reading": "배-르-녠 가-쟙-씅 쎈 마-간"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Дәуір Иесі, Сен жоғары биіксің. Көкке Атың даңқталсын,",
            "reading": "대우-르 이예-스, 쎈 조-가-르 비-윽-씅 콕-케 아-틍 당크-탈-쓴"
          },
          {
            "kk": "Жерге келдің жаратқаныңа Өзің Азап шектің біз үшін",
            "reading": "졔르-게 켈-등 쟈-랏-카-능-아 외-증 아-쟙 쉑-틍 브-즈 우-싄"
          },
          {
            "kk": "Осы жерде бас ием, Саған тағзым етем.",
            "reading": "오-쓰 제르-뎨 바-쓰 이엠 싸-간 타그-즘 옛-톔"
          },
          {
            "kk": "Сен Құдайымсың деймін Саған. Сен бәрінен сүйікті,",
            "reading": "쎈 쿠-다이-음-씅 뎨이-믄 싸- 간 쎈 배-르-녠 쉬-윽-뜨"
          },
          {
            "kk": "Мадаққа лайықты Бәрінен ғажапсың Сен маған",
            "reading": "마-닥-카 라이-윽-뜨 배-르-녠 가-쟙-씅 쎈 마-간"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Айқышқа Сен",
            "reading": "아이-크싀-카 쎈"
          },
          {
            "kk": "Күнәмді қақтың.",
            "reading": "쿠-냄-드 칵-틍"
          },
          {
            "kk": "Бағасын мен",
            "reading": "바-가-쓴 몐"
          },
          {
            "kk": "Еш білмеспін.",
            "reading": "예싀 블-몌스-픈"
          }
        ]
      }
    ]
  },
  {
    "id": "nury-alemning",
    "slug": "nury-alemning",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Нұры Әлемнің"
    },
    "songKey": "E",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Нұры Әлемнің Сен түнекке келдің",
            "chords": "[E]Нұры әлемнің, [Bsus4]Сен түнекке келдің, [F#m7] [A]",
            "reading": "누-르 앨-렘-능 쎈 투-넥-케 켈-등"
          },
          {
            "kk": "Көзімді аштың көремін.",
            "chords": "[E]Көзімді аштың, [Bsus4]көремін. [A]",
            "reading": "쾨-즘-드 아싀-틍 코-례-믄"
          },
          {
            "kk": "Жүрекпен Саған табынамын Тәңірім,",
            "chords": "[E]Жүрекпен Саған [Bsus4]табынамын, Тәңірім, [F#m7] [A]",
            "reading": "쥐-렉-펜 싸-간 타-브-나-믄 탱-으-름"
          },
          {
            "kk": "Сенімен мәңгі біргемін.",
            "chords": "[E]Сенімен мәңгі [Bsus4]біргемін. [A]",
            "reading": "쎄-느-멘 맹-그 브르-게-믄"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Нұр Әлемнің(2)"
          },
          {
            "kk": "Дәуір Иесі, Сен жоғары биіксің.",
            "reading": "대우-으르 이-예-스, 쎈 조-가-르 비-윽-씅"
          },
          {
            "kk": "Көкке Атың даңқталсын,",
            "reading": "콕-케 아-틍 당-크탈-쓴"
          },
          {
            "kk": "Жерге келдің жаратқаныңа Өзің",
            "reading": "졔르-게 켈-등 쟈-랏-카-능-아 외-증"
          },
          {
            "kk": "Азап шектің біз үшін",
            "reading": "아-쟙 쉑-틍 브즈 우-싄"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Осы жерде бас ием, Саған тағзым етем.",
            "reading": "오-쓰 졔르-뎨 바쓰 이-옘 싸-간 타그-즘 옛-톔"
          },
          {
            "kk": "Сен Құдайымсың деймін Саған.",
            "reading": "쎈 쿠-다이-음-씅 뎨이-믄 싸-간"
          },
          {
            "kk": "Сен бәрінен сүйікті,",
            "reading": "쎈 배르-녠 쒸-윽-뜨"
          },
          {
            "kk": "Мадаққа лайықты",
            "reading": "마-닥-카 라이-윽-뜨"
          },
          {
            "kk": "Бәрінен ғажапсың Сен маған",
            "reading": "배-르-녠 가-쟙-씅 쎈 마-간"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "verse",
        "label": {
          "kk": "4",
          "ko": "4절"
        },
        "lines": [
          {
            "kk": "Айқышқа Сен",
            "reading": "아이-크싀-카 쎈"
          },
          {
            "kk": "Күнәмді қақтың.",
            "reading": "쿠-냄-드 칵-틍"
          },
          {
            "kk": "Бағасын мен",
            "reading": "바-가-쓴 몐"
          },
          {
            "kk": "Еш білмеспін.",
            "reading": "예싀 블-몌스-픈"
          },
          {
            "kk": "Нұр Әлемнің(Қр)"
          }
        ]
      }
    ]
  },
  {
    "id": "o-quday-iem",
    "slug": "o-quday-iem",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "О, Құдай Ием"
    },
    "songKey": "Em",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "О, Құдай Ием Сен әлемді жараттың",
            "chords": "[Em]О, Құдай Ием, Сен әлемді [Am]жараттың,",
            "reading": "오 쿠-다이 이-엠 쎈 앨-렘-드 쟈-랏-틍"
          },
          {
            "kk": "Сен барлық бұлттардан жоғарсың",
            "chords": "[B7]Барша адамзатқа нұрыңды [Em]тараттың.",
            "reading": "쎈 바르-륵 불-타르-단 죠-가르-씅"
          },
          {
            "kk": "//Саған сиынам",
            "chords": "[Em]Сенсің менің панам, Сенсің [Am]тірегім,",
            "reading": "싸-간 씨-으-남"
          },
          {
            "kk": "Саған сиынам",
            "chords": "[B7]Мәңгі Саған соғады [Em]жүрегім.",
            "reading": "싸-간 씨-으-남"
          },
          {
            "kk": "Саған сиынам",
            "reading": "싸-간 씨-으-남"
          },
          {
            "kk": "Құдай Ием//",
            "reading": "쿠-다이 이-엠"
          }
        ]
      }
    ]
  },
  {
    "id": "o-quday-qarashy-maghan",
    "slug": "o-quday-qarashy-maghan",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "О, Құдай қарашы маған"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "О, Құдай қарашы маған",
            "reading": "오 쿠-다이 카-라-싀 마-간"
          },
          {
            "kk": "Жаным ұмтылады Саған",
            "reading": "자-늠 움-틀-라-드 싸-간"
          },
          {
            "kk": "Саған арнап мен ән айтам.",
            "reading": "싸-간 아르-납 몐 앤 아이-땀"
          },
          {
            "kk": "Оян жаным, оян рухым!",
            "reading": "오얀 쟈-늠, 오얀 루-흠"
          },
          {
            "kk": "Тыңдашы жүректің үнін",
            "reading": "틍다-싀 쥐렉틍 우는"
          },
          {
            "kk": "Таң сәріден Сені мадақтаймын.",
            "reading": "탕 새-르-덴 쎄-느 마-닥-타이-믄"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Әсем ауен, әсем ауен,",
            "reading": "애-쎔 아우-옌, 애-쎔 아우-옌"
          },
          {
            "kk": "Тәңірге әсем ауен!",
            "reading": "탱-으르-게 애-쎔 아우-옌"
          },
          {
            "kk": "Иса, Иса, Иса, Әнімсің Сен.",
            "reading": "이-싸, 이-싸, 이-싸, 애-늠-씅 쎈"
          }
        ]
      }
    ]
  },
  {
    "id": "ol-madaqtasyn",
    "slug": "ol-madaqtasyn",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Ол мадақтасын"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "//Ол мадақталсын,",
            "reading": "올 마-닥 –탈-쓴,"
          },
          {
            "kk": "Патша мадақталсын",
            "reading": "팟-샤 마-닥-탈-쓴"
          },
          {
            "kk": "Мен Оған сиынамын.//",
            "reading": "멘 오-간 씨-으-나-믄"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Ол – Тәңір, өмірді жарқыратады,",
            "reading": "올 탱-으르 외-므르-드 쟈르-크-라-타-드"
          },
          {
            "kk": "Аспан мен жер,",
            "reading": "아스-판 멘 줴르,"
          },
          {
            "kk": "Қуан Оның Киелі Атына",
            "reading": "쿠-안 오느 키-엘르 아-트-나"
          },
          {
            "kk": "Ол мадақталсын, Патша мадақталсын",
            "reading": "올 마-닥-탈-쓴, 팟-샤 마-닥-탈-쓴"
          }
        ]
      }
    ]
  },
  {
    "id": "ol-manggi",
    "slug": "ol-manggi",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Ол  мәңгі"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "//Иса, жалғыз Сен Иса!",
            "reading": "이싸, 잘그즈 쎈 이싸!"
          },
          {
            "kk": "Жанымды жұбатып, қасымда боласың!//",
            "reading": "쟈늠드 주바틉, 카씀다 볼라씅!"
          },
          {
            "kk": "Мәңгі өміріңді, сыйладың маған,",
            "reading": "맹그 외므릉드, 쓰일라등 마간 Ризамын мен Саған! 리자믄 몐 싸간!"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "//Ол мәңгі, Ол мәңгі, Ол мәңгі,",
            "reading": "올 맹그, 올 맹그, 올 맹그"
          },
          {
            "kk": "Біздің Иеміз Иса!//",
            "reading": "브즈등 이예므즈 이싸!"
          }
        ]
      }
    ]
  },
  {
    "id": "osanna-osanna",
    "slug": "osanna-osanna",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Осанна ! Осанна !"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Осанна!"
          },
          {
            "kk": "//Осанна! Осанна! Осанна көктегі Құдайға//"
          },
          {
            "kk": "Жүрекке толы Саған, алғысымды айтам"
          },
          {
            "kk": "Көтерілсін Сенің атың!"
          },
          {
            "kk": "Осанна көктегі Құдайға!"
          }
        ]
      }
    ]
  },
  {
    "id": "osanna-kordim",
    "slug": "osanna-kordim",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Осанна--Көрдім"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Осанна(1)"
          },
          {
            "kk": "1. Көрдім Ұлы Патшамыз",
            "reading": "쾨르-듬 울-르 팟-샤-므즈 Көктен жерге келгенде 쾩-톈 제르-게 켈-겐-뎨 Жер сілкініп ел дүрлігер 제르 쓸-크-늡- 옐 두를-르-게르 Көрдім рақымын төгіп 쾨르-듬 라-크-믄 퇴-급 Бар күнәдан тазартты 바르 쿠-내-단 타-자-릇 -뜨 Шаттанған жұрт мадақ айтты 샷-탄-간 주-릇 마-닥 아잇-뜨"
          },
          {
            "kk": "/Осанна! Осанна! /",
            "reading": "오-싼-나! 오-싼-나 ! Иеміз мадақталсын!/ 이예-므즈 마-닥-탈-쓴 /"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Осанна(2)"
          },
          {
            "kk": "2. Көрдім жаңа ұрпақтан",
            "reading": "쾨르-듬 쟝-아 우르-팍-탄 Қызметшілер шыққанын, 크즈-멧-쉴-례-르 싁-카-는 Жүректері отқа толы 쥐-렉-톄-르 옷-카 톨-르 Көрдім жақын арада 쾨르-듬 쟈-큰 아-라-다 Ояныштың келерін 오야-느-싀-틍 켈-례-른 Тізе бүгіп дұға етсек 트-제 부-급 두-가 옛-쎅"
          },
          {
            "kk": "/Осанна! Осанна! /",
            "reading": "오-싼-나! 오-싼-나 ! Иеміз мадақталсын!/ 이예-므즈 마-닥-탈-쓴 /"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Осанна(3)"
          },
          {
            "kk": "Жүрегімді тазартшы",
            "reading": "쥐레금드 타자릇싀 Көзімді ашшы рухи әлемге. 몐쾨즘드 아싀싀 루히 앨렘계 Үйретші маған Сендей сүюге 위렛싀 마간 쎈데이 쒸유계 Күнәдан бас тартып мен 쿠내단 바쓰 타르틉 몐 Патшам өзімді 팟샴 외즘드 Саған арнаймын 싸간 아르나이믄 Жерлік өмір жолымнан 제를륵 외므르 졸름난 Мәңгілікке 맹- 글- 륵- 케"
          }
        ]
      }
    ]
  },
  {
    "id": "osy-kundi",
    "slug": "osy-kundi",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Осы күнді"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "//1 Осы күнді Құдай жаратқан",
            "reading": "오-쓰 쿤-드 쿠-다이 쟈-랏-칸"
          },
          {
            "kk": "Шаттанамыз Оның алдында//",
            "reading": "샷-타-나-므즈 오-능 알-든-다"
          },
          {
            "kk": "//Шаттан Тәңірге//",
            "reading": "샷-탄 탱-으르-계"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "//2 Қуан, сен, Оның алдында",
            "reading": "쿠-안, 쎈, 오-능 알-든-다"
          },
          {
            "kk": "Иса лайық құрмет алуға//",
            "reading": "이-싸 라이-윽 쿠르-멧 알-루-가"
          },
          {
            "kk": "//Шаттан Тәңірге//",
            "reading": "샷-탄 탱-으르-계"
          }
        ]
      }
    ]
  },
  {
    "id": "patshalyq-saltanat",
    "slug": "patshalyq-saltanat",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Патшалық салтанат"
    },
    "songKey": "C",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Патшалық салтанат",
            "chords": "[C]Патшалық, [G]салтанат,",
            "reading": "팟-샬-륵 쌀-타-낫"
          },
          {
            "kk": "Ұлылық жарқырап",
            "chords": "[Am]Құрмет пенен [F]даңқ,",
            "reading": "울-를-륵 쟈르-크-랍"
          },
          {
            "kk": "Бәрі ән салсын",
            "chords": "[C]Саған арна-[G]лады, Иса [C]Тәңір!",
            "reading": "배-르 앤 쌀-슨"
          },
          {
            "kk": "Ғаламға жар салсын!",
            "reading": "갈-람-가 쟈르 쌀-슨!"
          },
          {
            "kk": "Өзін нұрға бөлеп",
            "reading": "외-즌 누르-가 뵐-렙"
          },
          {
            "kk": "Жасырынды түнек",
            "reading": "쟈-쓰-른-드 튀-녝"
          },
          {
            "kk": "Естіп үнін Оның",
            "reading": "예스-틉 우-는 오-능"
          },
          {
            "kk": "Иеміз - Ұлы!",
            "reading": "이예-므즈 - 울-르!"
          },
          {
            "kk": "Әнге сал бірге, Ол - ұлы",
            "reading": "앤-게 쌀 브르-게, 올 – 울-르"
          },
          {
            "kk": "Барлығы көрсін,",
            "reading": "바를-르-그 쾨르-쓴,"
          },
          {
            "kk": "Білсін Ол - ұлы!",
            "reading": "블-쓴 올 - 울 -르!"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Ғасырдан ғасырға",
            "reading": "가-쓰르-단 가-쓰르-가"
          },
          {
            "kk": "Барлығы қолында",
            "reading": "바를-르-그 콜-른-다"
          },
          {
            "kk": "Басы Ол соңы да,(*2)",
            "reading": "바-쓰 올 쏭-으 다(2)"
          },
          {
            "kk": "Үшбірліктегі Ол",
            "reading": "우싀-브를-륵-톄-그 올"
          },
          {
            "kk": "Әке Рух және Ұл",
            "reading": "애-케 루-흐 재-녜 울"
          },
          {
            "kk": "«Арыстан» да Өзі “",
            "reading": "아-르스-탄” 다 외-즈"
          },
          {
            "kk": "Келген болып «Қозы»",
            "reading": "켈-겐 볼-릅 “코-즈＂"
          },
          {
            "kk": "Иеміз - Ұлы!",
            "reading": "이예-므즈 - 울-르!"
          },
          {
            "kk": "Әнге сал бірге, Ол -ұлы",
            "reading": "앤-게 쌀 브르-게, 올 울-르"
          },
          {
            "kk": "Барлығы көрсін,",
            "reading": "바를-르-그 쾨르-쓴,"
          },
          {
            "kk": "Білсін Ол - ұлы!",
            "reading": "블-쓴 올 울-르!"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "//Есімі ең жоғары",
            "reading": "예-쓰-므 옝 죠-가-르"
          },
          {
            "kk": "Бар мадаққа лайықты,",
            "reading": "바르 마-닥-카 라이-윽-뜨"
          },
          {
            "kk": "Жан дүнием жырласын,",
            "reading": "잔 두-니옘 즈를-라-쓴,"
          },
          {
            "kk": "Ол - ұлы! //",
            "reading": "올 울-르!"
          }
        ]
      }
    ]
  },
  {
    "id": "rahmet-saghan-quday",
    "slug": "rahmet-saghan-quday",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Рахмет Саған, Құдай"
    },
    "songKey": "G",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "/Рахмет Саған, Құдай! Рахмет Саған, Құдай!",
            "chords": "[G]Рахмет Саған, [D]Құдай Әке,",
            "reading": "라크멧 싸간 쿠다이! 라크멧 싸간 쿠다이!"
          },
          {
            "kk": "Рахмет! О, Құдай Ием, Иса үшін рахмет!/ (*2)",
            "chords": "[Em]Өмірімді сыйла-[C]ғаның үшін.",
            "reading": "라크멧! 오, 쿠다이옘, 이싸 우싄 라크멧!/"
          },
          {
            "kk": "/ Енді менің күшім бар, Менің байлығым бар",
            "chords": "[G]Рахмет Саған, [D]Иса Тәңір,",
            "reading": "옌드 몌능 쿠-싐 바르, 몌능 바일-르-그-음 바르"
          },
          {
            "kk": "Мен үшін Иса өмірге келді/(*2) Рахмет!",
            "chords": "[C]Құтқарып бізді [D]алғаның [G]үшін.",
            "reading": "몐 우싄 이싸 외므르-게 켈-드/ 라크멧!"
          }
        ]
      }
    ]
  },
  {
    "id": "rahmet-saghan-quday-isa",
    "slug": "rahmet-saghan-quday-isa",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Рахмет Саған Құдай Иса"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "/Рахмет Саған Құдай Иса (*3) /",
            "reading": "라크멧 싸간 쿠다이 이싸(3)"
          },
          {
            "kk": "/ Жүрегім Саған риза(*2)/",
            "reading": "\\쥐레금 싸간 리자(2)"
          },
          {
            "kk": "Мен үшін өлгеніңе",
            "reading": "몐 우-싄 욀-게-능-에"
          },
          {
            "kk": "Қаныңды төккеніңе",
            "reading": "카-능-드 퇵-케-능-에"
          },
          {
            "kk": "Қайта тірілгеніңе",
            "reading": "카이-타 트-를-게-능-에"
          },
          {
            "kk": "Өлімді жеңгеніңе",
            "reading": "욀-름-드 졩-게-능-예"
          }
        ]
      }
    ]
  },
  {
    "id": "sen-kielising",
    "slug": "sen-kielising",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Сен киелісің"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Сен киелісің(Сен киелісің)",
            "reading": "쎈 키옐르씅(쎈 키옐르씅)"
          },
          {
            "kk": "Сен күштісің(Сен күштісің)",
            "reading": "쎈 쿠싀뜨씅(쎈 쿠싀뜨씅)"
          },
          {
            "kk": "Сен лайықсың(Сен лайықсың)",
            "reading": "쎈 라이윽씅(쎈 라이윽씅)"
          },
          {
            "kk": "Бар мадаққа(Бар мадаққа)",
            "reading": "바르 막닥카(바르 마닥카)"
          },
          {
            "kk": "Мен еремін(Мен еремін)",
            "reading": "몐 예레믄(몐 예레믄)"
          },
          {
            "kk": "Мен тыңдаймын(Мен тыңдаймын)",
            "reading": "몐 틍다이믄(몐 틍다이믄)"
          },
          {
            "kk": "Сені сүйемін(Сені сүйемін)",
            "reading": "쎄느 쒸예믄(쎄느 쒸예믄)"
          },
          {
            "kk": "Әр күнімде(Әр күнімде)",
            "reading": "애르 쿠늠뎨(얘르 쿠늠뎨)"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Патшалар патшасы",
            "reading": "팟샤라르 팟샤쓰 Иелер Иесі 이예례르 이예쓰Сен күшті Құдайсың 쎈 쿠싀트 쿠다이씅 Бәрінің Иесі 배르능 이예쓰 Сен Имануел 쎈 임마누옐 Сен ұлы Есім 쎈 울르 예씀 Менің Патшамсың 몌능 팟샴씅 Сен Тоқтысың 쎈 톡트씅 Тірісің Құдай 트르씅 쿠다이 Рақымдысың Сен 라큼드씅 쎈 Патшалығың мәңгі 팟샬르긍 맹그 Мәңгі Бар Болушы 맹그 바르 볼루싀 Сен Алғашқы, Соңғысың 쎈 알가싀크, 쏭거씅 Басы да, Соңы 바쓰 다 쏭으 Құтқарушым, Мәсіхсің 쿳카루싐, 매슥씅 Жан Досым Өзің 쟌 도씀 외증"
          },
          {
            "kk": "/Тыныштық Патшасы",
            "reading": "트느싀특 팟샤쓰 Сен үшін өмір сүремін 쎈 우싄 외므르 쉬례믄/ (*2)"
          }
        ]
      }
    ]
  },
  {
    "id": "sen-kushtising",
    "slug": "sen-kushtising",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Сен күштісің"
    },
    "songKey": "C",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Махаббат көктен келді",
            "chords": "[C]Сен күштісің, Сен [G]ұлысың,",
            "reading": "마-하-밧 쾩-톈 켈-드"
          },
          {
            "kk": "Момын Ол айқыш алды",
            "chords": "[Am]Сен менің жалғыз [F]панамсың.",
            "reading": "모-믄 올 아이-크-싀 알-드"
          },
          {
            "kk": "Күнәммен Сен ұятты алдың",
            "chords": "[C]Сенімен бірге [G]жеңемін,",
            "reading": "쿠-냄-몐 쎈 우얏-뜨 알-등"
          },
          {
            "kk": "Жеңіспен Сен тірілдің",
            "chords": "[F]Иса [G]Тәңі-[C]рім!",
            "reading": "젱-으쓰-폔 쎈 트-를-등"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Сен күштісің, Сен күштісің",
            "reading": "쿠-내-느 졩- 등, 쿳 – 카르-등 쎈"
          },
          {
            "kk": "Бұл сөз шындық: Мәсіх тірі!",
            "reading": "불 쇠-즈 싄-득 : 매 -슥 트- 르!"
          },
          {
            "kk": "Иса бәрінің Иесі.",
            "reading": "이 - 사 배-르-능 이예 - 쓰"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Адалсың Сен әрқашан",
            "reading": "아 –달-씅 쎈 애르-카-샨"
          },
          {
            "kk": "Дауылда да отта да,",
            "reading": "다울-다 다, 옷-타 다"
          },
          {
            "kk": "Бұл шындық : азат етті!",
            "reading": "불 싄-득 : 아-잣 옛-뜨"
          },
          {
            "kk": "Иса Мәсіх мендегі",
            "reading": "이-싸 매-쓱 몐- 뎨- 그"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Шексізсің, мәңгі тірі",
            "reading": "쉑 –쓰즈- 씅 맹-그 트-르"
          },
          {
            "kk": "Үмітім, қорғанышым",
            "reading": "우믓-뜸, 코르-가-느-싐"
          },
          {
            "kk": "Адасқанды құтқаруға,",
            "reading": "아-다스-칸-드 쿳-카-루-가"
          },
          {
            "kk": "Келдің Сен құн төлеуге.",
            "reading": "켈등 쎈- 쿤 퇼-례우-게"
          }
        ]
      }
    ]
  },
  {
    "id": "sen-alemdi-qutqardyng",
    "slug": "sen-alemdi-qutqardyng",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Сен әлемді құтқардың"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Сен әлемді құтқардың, Түнектен шығардың.",
            "reading": "쎈 앨-렘-드 쿳-카르-등, 튀-넥-텐 싀-가르- 등 Өшкен жүректерді жақтың, Үмітті бердің."
          },
          {
            "kk": "/Алғыс Саған Тәңір, Алғыс Саған Иса",
            "reading": "알-긋 싸-간 탱-으르 , 알-긋 싸 -간 이-사 Мейірімділігің шексіз, Махаббатың мол/ (*2) 메이-으- 름-들-르-긍 쉑-쓰즈 , 마-하-바-틍 몰"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Сен әлемді құтқардың, Түнектен шығардың.",
            "reading": "쎈 앨-렘-드 쿳-카르-등, 튀-넥-텐 싀-가르- 등"
          },
          {
            "kk": "Өшкен жүректерді жақтың, Үмітті бердің."
          },
          {
            "kk": "Саған алғысымды айтам, мадақтаймын.",
            "reading": "싸-간 알 –그- 씀- 드 아이-탐, 마-닥-타이-믄"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "/Алғыс Саған Тәңір,",
            "reading": "알-그쓰 싸-간 탱-으르"
          },
          {
            "kk": "Алғыс Саған Иса",
            "reading": "알-그쓰 싸 -간 이-사"
          },
          {
            "kk": "Мейірімділігің шексіз,",
            "reading": "메이-으름 –들-르-긍 쉑-쓰즈"
          },
          {
            "kk": "Махаббатың мол/ (*2)",
            "reading": "마-하-바-뜽 몰"
          }
        ]
      }
    ]
  },
  {
    "id": "sendey-eshkim-zhoq",
    "slug": "sendey-eshkim-zhoq",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Сендей ешкім жоқ"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Жүрегім менің тебірентетін",
            "reading": "쥐-레-금 몌-능 테-브-롄-톄-튼"
          },
          {
            "kk": "Өмір бойы іздесем де таппаймын",
            "reading": "외-므르 보이-으 으즈-뎨-쎔 뎨 탑-파이-믄"
          },
          {
            "kk": "Ием , Сендей ешкім жоқ!",
            "reading": "이-옘, 쎈-데이 예싀-큼 족"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Мейірімің судай тасқындап,",
            "reading": "메이-으-르-믕 쑤-다이 타스-큰-답"
          },
          {
            "kk": "Жарамызды емдеді.",
            "reading": "쟈-라-므즈-드 옘-뎨-드"
          },
          {
            "kk": "Жарамызды аман сақтайтын",
            "reading": "쟈-라-므즈-드 아-만 싹-타이-튼"
          }
        ]
      }
    ]
  },
  {
    "id": "senemin-men-senemin",
    "slug": "senemin-men-senemin",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "СеНеМіН МеН СеНеМіН"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Сенемін, мен сенемін ( 1 )"
          },
          {
            "kk": "Сенемін, мен сенемін ұлы",
            "reading": "쎄녜믄,몐쎄녜믄 울르 Құдайыма,쿠다이음아-"
          },
          {
            "kk": "Рақымын төткі Құдай",
            "reading": "라크믄 퇵트 쿠다이"
          },
          {
            "kk": "Жанарыма",
            "reading": "자나름아-"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Сенемін, мен сенемін(Қр.1)"
          },
          {
            "kk": "Жан-тәніммен Жаратқан Иемді мадақтаймын,",
            "reading": "잔테늠몐 자랏칸- 이옘드 마닥타이믄-"
          },
          {
            "kk": "Шын жүректен ардақтайм қасиетті атын",
            "reading": "싄 쥐렉톈 아르닥타임 카시예트 아튼-"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Сенемін, мен сенемін(Қр.2)"
          },
          {
            "kk": "Жан-тәніммен Жаратқан Иемді мадақтаймын,",
            "reading": "잔-테늠몐 자랏칸- 이옘드 마닥타이믄-"
          },
          {
            "kk": "Жасаған жақсылығын ұмытпаймын",
            "reading": "자싸간 작쓰르근 우믓트파이믄-"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "verse",
        "label": {
          "kk": "4",
          "ko": "4절"
        },
        "lines": [
          {
            "kk": "Сенемін, мен сенемін ( 2 )"
          },
          {
            "kk": "2. Ол бізді күнәмізден",
            "reading": "올 브즈드 쿠네므즈뎬"
          },
          {
            "kk": "Тазалайды-",
            "reading": "타잘라이드"
          },
          {
            "kk": "Ісімізге қарап есесін",
            "reading": "카이타르마이드"
          }
        ]
      },
      {
        "id": "s5",
        "kind": "verse",
        "label": {
          "kk": "5",
          "ko": "5절"
        },
        "lines": [
          {
            "kk": "Сенемін, мен сенемін ( 3 )"
          },
          {
            "kk": "3. Ұмтылыңдар бауырлар,",
            "reading": "움틀릉다르 바우르라르"
          },
          {
            "kk": "Құдайдың жолына,",
            "reading": "쿠다이등 졸른나-"
          },
          {
            "kk": "Мәңгілік шынайы жол Иса",
            "reading": "맹글륵 싄나이 졸- 이싸"
          },
          {
            "kk": "Иемізде",
            "reading": "이예므즈뎨-"
          }
        ]
      }
    ]
  },
  {
    "id": "sening-mahabbatyng",
    "slug": "sening-mahabbatyng",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Сенің махаббатың"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Сенің махаббатың жарқырап тұр,",
            "reading": "쎄-능 마-하-밧-틍 쟈르-크-랍 투르"
          },
          {
            "kk": "Қараңғыда жарқырап тұр.",
            "reading": "카-랑-그-다 쟈르-크-랍 투-르"
          },
          {
            "kk": "Иса, әлемге жарқырашы,",
            "reading": "이- 싸 앨-렘-계 쟈르-크-라-싀"
          },
          {
            "kk": "Сеніммен бізді босатшы,",
            "reading": "쎄-늠-몐 브즈-드 보-쌋-싀"
          },
          {
            "kk": "/Жарқырашы, Иса/ (*2)",
            "reading": "쟈르-크-라-싀 이-사 (*2)"
          },
          {
            "kk": "Жарқырашы, Иса! Әлемге жарқырашы, Иса!",
            "reading": "쟈르-크라싀, 이싸! 앨렘계 쟈르 크라싀, 이싸"
          },
          {
            "kk": "Біздің жүректер Сенің Рухыңмен толсын,",
            "reading": "브즈등 쥐렉톄르 쎄능 루흥몐 톨쓴"
          },
          {
            "kk": "Толтыр, Иса, Әлемді рақымдылығыңмен,",
            "reading": "톨 -트르, 이-싸, 앨-렘-드 라-큼-들-르-긍-몐"
          },
          {
            "kk": "Сөзіңді жібер, сонда жарық болсын!",
            "reading": "쐬-증-드 즈-볘-르, 쏜-다 쟈-륵 볼-슨"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Тәңір, мен Саған барамын.",
            "reading": "탱-으르 싸-간 바-라-믄"
          },
          {
            "kk": "Сенің жаныңда боламын.",
            "reading": "쎄-능 쟈-능- 다 볼- 라-믄"
          },
          {
            "kk": "Өзіңнің төгілген қаныңмен",
            "reading": "외-증-능 퇴-글-겐 카-능-몐"
          },
          {
            "kk": "Күнәлардан мені босатшы,",
            "reading": "쿠-내-라르- 단 몌-느 보-쌋-싀"
          },
          {
            "kk": "/Жарқырашы Иса/ (*2)",
            "reading": "쟈르-크-라-싀 이-사 (*2)"
          },
          {
            "kk": "Жарқырашы, Иса! Әлемге жарқырашы, Иса!",
            "reading": "쟈르-크-라-싀, 이-사! 앨-렘-계 쟈르 –크-라-싀, 이-사"
          },
          {
            "kk": "Біздің жүректер Сенің Рухыңмен толсын,",
            "reading": "브즈-등 쥐-렉-톄르 쎄-능 루-흥-몐 톨-쓴"
          },
          {
            "kk": "Толтыр, Иса, Әлемді рақымдылығыңмен,",
            "reading": "톨 -트르, 이-싸, 앨-렘-드 라-큼-들-르-긍-몐"
          },
          {
            "kk": "Сөзіңді жібер, сонда жарық болсын!",
            "reading": "쐬-증-드 즈-볘-르, 쏜-다 쟈-륵 볼-슨"
          }
        ]
      }
    ]
  },
  {
    "id": "sudan-sharap-zhasadyng",
    "slug": "sudan-sharap-zhasadyng",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Судан шарап жасадың"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Судан шарап жасадың",
            "reading": "쑤-단 샤-랍 쟈-싸등"
          },
          {
            "kk": "Соқырдың көзін аштың",
            "reading": "쏘-크르-등 쾨-즌 아싀-틍"
          },
          {
            "kk": "Саған тең келер",
            "reading": "싸-간 텡 켈-례르"
          },
          {
            "kk": "жоқ ешкім",
            "reading": "족 예싀-큼"
          },
          {
            "kk": "Түнекте нұрың шашып",
            "reading": "튀-넥-톄 누-릉 샤-싑"
          },
          {
            "kk": "Құтқарып алдың бізді",
            "reading": "쿳-카-릅 알-등 브즈-드"
          },
          {
            "kk": "Саған тең келер",
            "reading": "싸-간 텡 켈-례르"
          },
          {
            "kk": "жоқ ешкім",
            "reading": "족 예싀-큼"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "//Құдайым ұлы, жартастай мықты",
            "reading": "쿠-다이-음 울-르, 쟈르-타스-타이 믁-트"
          },
          {
            "kk": "Ол бәрінен де биік жоғары",
            "reading": "올 배-르-녠 뎨 비-윽 죠-가-르"
          },
          {
            "kk": "Құдіретімен сауықтырады",
            "reading": "쿠-드-렛-뜨-몐 싸-욱-트-라-드"
          },
          {
            "kk": "Біздің Құдай//",
            "reading": "브즈-등 쿠-다이"
          }
        ]
      }
    ]
  },
  {
    "id": "suyemin-seni-isa",
    "slug": "suyemin-seni-isa",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Сүйемін Сені, Иса"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Сүйемін Сені, Иса, Бар жүрегім, жаныммен.",
            "reading": "쒸-예-믄 쎄-느 이-사 바-르 쥐-레-금 자-늠-멘"
          },
          {
            "kk": "Сен – Тәңірім, Сен – Тәңірім, Сен-Бағушым Менің",
            "reading": "쎈 탱-으-름, 쎈 탱-으-름 쎈 바-구-싐 몌-능"
          },
          {
            "kk": "Құрметке Сен лайықсың,",
            "reading": "쿠르-멧-케 쎈 라이-윽-승"
          },
          {
            "kk": "Бар данққа Сен лайықсың",
            "reading": "바르 당-카 쎈 라이-윽-승"
          },
          {
            "kk": "Сен – Тәңірім, Сен – Тәңірім, Құтқарушым менің.",
            "reading": "쎈 탱-으-름, 쎈 탱-으-름 쿳-카-루-싐 몌-능"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "/Мен Сені мадақтаймын, Тәңірім менің.",
            "reading": "몐 쎄-느 마-닥-타이-믄 탱-으-름 몌-능"
          },
          {
            "kk": "Мен Сені мадақтаймын(Иса~)./(*2)",
            "reading": "몐 쎄-느 마-닥-타이-믄(이~사~)"
          }
        ]
      }
    ]
  },
  {
    "id": "tazartty-meni",
    "slug": "tazartty-meni",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Тазартты мені"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Тазартты мені Сенің қаның",
            "reading": "타자릇트 몌느 쎄능 카능"
          },
          {
            "kk": "Берді өмір, жуды күнәмды.",
            "reading": "베르드 외므르 , 주드 쿠냄드"
          },
          {
            "kk": "Сен азат еттің мені,",
            "reading": "쎈 아 잣 옛틍 몌느"
          },
          {
            "kk": "Құрбан болдың Сен мен үшін",
            "reading": "쿠르반 볼등 쎈 몐 우싄"
          },
          {
            "kk": "Сен жудың, қардан аппақ ағарттың мені",
            "reading": "쎈- 주등 카르단 압팍 아가릇틍 몌느"
          },
          {
            "kk": "Иса Ием, аяулы - құрбандық",
            "reading": "이싸 이옘 아야울르 쿠르반득"
          }
        ]
      }
    ]
  },
  {
    "id": "tamasha-tangirdi-dangqtau",
    "slug": "tamasha-tangirdi-dangqtau",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Тамаша Тәңірді даңқтау"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "1. Тамаша Тәңірді даңқтау, Ән айту құдіретті Иеге",
            "reading": "타-마-샤 탱-으르-드 당크-다-우, 앤 아이-뚜 쿠-드-렛-트 이예-게"
          },
          {
            "kk": "Жариялау күндіз Атыңды, Түнде Сенің шындығыңды.",
            "reading": "쟈-리-얄-라우 쿤-드즈 아-틍-드, 툰-뎨 쎄-능 싄-드-긍-드."
          },
          {
            "kk": "Шаттыққа мені бөледің Сен,",
            "reading": "샤-특-카 몌-느 뵐-례-등 쎈,"
          },
          {
            "kk": "Тәңірім Сені мадақтаймын.",
            "reading": "탱-으-름 쎄-느 마-닥-타이-믄"
          },
          {
            "kk": "Сенің істерің ұлы, О Әкем,",
            "reading": "쎄-능 으-스-톄-릉 울-르, 오 애-켐,"
          },
          {
            "kk": "Сен Әкемсің, Жаратушым",
            "reading": "쎈 애-켐-씅, 쟈-라-뚜-싐"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "2. Көзімді қадаймын көкке, Қолымды жоғары көтерем.",
            "reading": "쾨-즘-드 카-다이-믄 쾩-켸, 콜-름-드 죠-가르 쾨-테-롐"
          },
          {
            "kk": "Құдайым біздің Иеміз, Жер бетінде де, көкте де.",
            "reading": "쿠-다이-음 브즈-등 이예-므즈, 졔르 베-튼-데 뎨, 쾩-테 뎨."
          },
          {
            "kk": "Шаттыққа мені бөледің Сен,",
            "reading": "샤-특-카 몌-느 뵐-례-등 쎈,"
          },
          {
            "kk": "Тәңірім Сені мадақтаймын.",
            "reading": "탱-으-름 쎄-느 마-닥-타이-믄"
          },
          {
            "kk": "Сенің істерің ұлы, О Әкем,",
            "reading": "쎄-능 으-스-톄-릉 울-르, 오 애-켐,"
          },
          {
            "kk": "Сен Әкемсің, Жаратушым",
            "reading": "쎈 애-켐-씅, 쟈-라-뚜-싐"
          }
        ]
      }
    ]
  },
  {
    "id": "taular-men-ozen-arqyly",
    "slug": "taular-men-ozen-arqyly",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Таулар мен өзен арқылы"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Таулар мен өзен арқылы",
            "reading": "타우라르 몐 외젠 아르클르"
          },
          {
            "kk": "Сенің сүйіспеншілігің",
            "reading": "쎄능 쒸이스펜 슬르그"
          },
          {
            "kk": "Маған мәңгі жетіп тұрады Ием!",
            "reading": "마간 멩그 제틉 투라드 이옘 !"
          },
          {
            "kk": "Күнәлардан азат болып,",
            "reading": "쿠나 라르단 아잣 볼릅"
          },
          {
            "kk": "Шындыққа шексіз қуанам,",
            "reading": "슨득카 쉑스즈 쿠아남"
          },
          {
            "kk": "Мадақтаймын Сені,",
            "reading": "마닥타이믄 쎄느"
          },
          {
            "kk": "Киелі Рухқа тола!",
            "reading": "키옐르 루흐카 톨라 !"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "//Мадақтаймын Сені мәңгілік,",
            "reading": "마닥타이믄 쎄느 멩글륵"
          },
          {
            "kk": "Дәріптеймін Сені мәңгілік!",
            "reading": "데릅테이믄 쎄느 멩글륵"
          },
          {
            "kk": "Махаббатыңа мен толамын,",
            "reading": "마하밧틍아 몐 톨라믄"
          },
          {
            "kk": "Тынбастан соны, мен айтамын!//2",
            "reading": "튼바스탄 쏘느 몐 아이타믄"
          }
        ]
      }
    ]
  },
  {
    "id": "tang-atqanda",
    "slug": "tang-atqanda",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Таң атқанда"
    },
    "songKey": "G",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Таң атқанда оянып,",
            "chords": "[G]Таң атқанда көзімді [D]ашамын,",
            "reading": "탕-앗-칸-다 오-야-늡"
          },
          {
            "kk": "Сені шақырам,",
            "chords": "[Em]Тәңірге мадақ әнін [C]шашамын.",
            "reading": "쎄-느 샤-크-람"
          },
          {
            "kk": "Қуанып мен ән салам,",
            "chords": "[G]Сенің рақымың жаңа [D]әр күні,",
            "reading": "쿠-아-늡 몐 얜 쌀-람"
          },
          {
            "kk": "Сені жырлаймын.",
            "chords": "[C]Мадақтаймын Сені [D]әр тү-[G]ні.",
            "reading": "쎄-느 즈-를-라이-믄"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Аңсайсың Сен менің жырымды,",
            "reading": "앙-싸이-씅 쎈 몌-능 즈-름-드"
          },
          {
            "kk": "Саған арналған өмірімді,",
            "reading": "싸-간 아-르-날-간 외-므-름-드"
          },
          {
            "kk": "Күні бойы Сені мақтаймын,",
            "reading": "쿠-느 보이-으 쎄-느 막-타이-믄"
          },
          {
            "kk": "Махаббатыңды жариялаймын.",
            "reading": "마-하-밧-뜽-드 쟈-리얄-라이-믄"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "О, Иса! О, Иса! Иса!",
            "reading": "오, 이-싸! 오, 이-싸! 이-싸!"
          },
          {
            "kk": "Дәл қазір келші маған,"
          },
          {
            "kk": "сағындым мен.",
            "reading": "댈 카-즈르 켈-싀 마-간, 사-근-듬 몐"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Күні бойы Сені мақтаймын,",
            "reading": "쿠-느 보이-으 쎄느 막-타이-믄"
          },
          {
            "kk": "Махаббатыңды жариялаймын,",
            "reading": "마-하-밧-뜽-드 쟈-리-얄-라이-믄"
          },
          {
            "kk": "Аңсайсың Сен менің жырымды",
            "reading": "앙-싸이-씅 쎈 몌-능 즈-름-드"
          },
          {
            "kk": "Саған арналған өмірімді.",
            "reading": "싸-간 아-르-날-간 외-므-름-드"
          }
        ]
      }
    ]
  },
  {
    "id": "tek-qana-isanyng-qany",
    "slug": "tek-qana-isanyng-qany",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Тек қана Исаның қаны."
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Күнәдан тазартады Тек қана Исаның қаны."
          },
          {
            "kk": "Мені не жаңартады? Тек қана Исаның қаны."
          },
          {
            "kk": "Қымбат қан төгілді Аппақ қардай етті."
          },
          {
            "kk": "Мені тазартады Тек қана Исаның қаны."
          },
          {
            "kk": "Үміт берер тыныммен Тек қана Исаның қаны"
          },
          {
            "kk": "Әділдік беретін ол - Тек қана Исаның қаны."
          },
          {
            "kk": "Даңқ құрметке лайықты Тек қана Исаның қаны."
          },
          {
            "kk": "Мадақтаймын жаныммен Тек қана Исаның қанын."
          }
        ]
      }
    ]
  },
  {
    "id": "toylayyq",
    "slug": "toylayyq",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Тойлайық"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "/Тойлаймыз,",
            "reading": "토-일 – 라이- 므즈"
          },
          {
            "kk": "Бүгін біз тойлаймыз!/(*4)",
            "reading": "부-근 브즈 토-일–라이-므즈"
          },
          {
            "kk": "Ол тірілді",
            "reading": "올 트 -를 - 드"
          },
          {
            "kk": "Ол тірілді",
            "reading": "올 트 -를- 드"
          },
          {
            "kk": "Ол тірі",
            "reading": "올 트- 르"
          },
          {
            "kk": "Мәңгі тірі!",
            "reading": "맹- 그 트- 르"
          },
          {
            "kk": "Ол тірілді",
            "reading": "올 트- 를- 드"
          },
          {
            "kk": "Ол тірілді",
            "reading": "올 트- 를- 드"
          },
          {
            "kk": "Келіңдер, тойлайық",
            "reading": "켈-릉-뎨르, 토일-라이-윽!"
          },
          {
            "kk": "Тәңірімізге қуанып!",
            "reading": "탱-으르-므즈-게 쿠-아-늡!"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "/Тойлаймыз,",
            "reading": "토-일 – 라이- 므즈"
          },
          {
            "kk": "Бүгін біз тойлаймыз!/(*4)",
            "reading": "부-근 브즈 토-일–라이-므즈"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Ол тірілді",
            "reading": "올 트 -를 - 드"
          },
          {
            "kk": "Ол тірілді",
            "reading": "올 트 -를- 드"
          },
          {
            "kk": "Ол тірі",
            "reading": "올 트- 르"
          },
          {
            "kk": "Мәңгі тірі!",
            "reading": "맹- 그 트- 르"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "verse",
        "label": {
          "kk": "4",
          "ko": "4절"
        },
        "lines": [
          {
            "kk": "Ол тірілді",
            "reading": "올 트- 를- 드"
          },
          {
            "kk": "Ол тірілді",
            "reading": "올 트- 를- 드"
          },
          {
            "kk": "Келіңдер, тойлайық",
            "reading": "켈-릉-뎨르, 토일-라이-윽!"
          },
          {
            "kk": "Тәңірімізге қуанып!",
            "reading": "탱-으르-므즈-게 쿠-아-늡!"
          }
        ]
      }
    ]
  },
  {
    "id": "tangir-zholyma-zharyq-shashyp",
    "slug": "tangir-zholyma-zharyq-shashyp",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Тәңір жолыма жарық шашып"
    },
    "songKey": "E",
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "үйге ертіп келеді/(*2)",
            "chords": "[E]Тәңір жолыма [A]жарық шашып,"
          },
          {
            "kk": "Жалғыз қалсам да, жолымда адасам да,",
            "chords": "[B]Қараңғы түнектен [E]алып шықты."
          },
          {
            "kk": "Сен мені жетелейсің.",
            "chords": "[C#m]Қолымнан ұстап [F#m]жетелейді,"
          },
          {
            "kk": "Сонда қорқыныш бірден ғайып болады.",
            "chords": "[A]Мәңгілік өмірге [B]апара-[E]ды."
          },
          {
            "kk": "Тәңір мені тастама, тастама."
          },
          {
            "kk": "03/11/2017"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "үйге ертіп келеді/(*2)"
          },
          {
            "kk": "Рақымыңа мен кенелемін, о Әкем, Сенде менің бар берекем."
          },
          {
            "kk": "Жолымда менің Иса адал серігім."
          },
          {
            "kk": "Құтқарушым Ол менің, Ол менің."
          }
        ]
      }
    ]
  },
  {
    "id": "tangir-maghan-soyleding-sen",
    "slug": "tangir-maghan-soyleding-sen",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Тәңір, маған сөйледің Сен"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "//Алғыс Саған,",
            "reading": "알-그스 싸-간"
          },
          {
            "kk": "Жағыз Саған,",
            "reading": "잘-그스 싸-간"
          },
          {
            "kk": "Алғыс Саған Иса//",
            "reading": "알-그스 싸-간 이-사"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Тәңір, маған сөйледің Сен, Сол сәт өзгердім мен.",
            "reading": "탱-으르 마-간 쐬일-레-등 쎈 쏠 샛 외즈-게르-듬 몐"
          },
          {
            "kk": "Мәңгі өмір сыйладың Сен Киелі Рухыңмен.",
            "reading": "맹-그 외-므르 쓰일-라-등 쎈 키-엘-르 루-흥-몐"
          },
          {
            "kk": "О, Құдайым, өмір бұлағы Сен.",
            "reading": "오, 쿠-아이-음 외-므르 불-라-그 쎈"
          },
          {
            "kk": "Жалғыз Саған табынамын мен.",
            "reading": "쟐-그스 싸-간 타-브-나-믄 몐"
          }
        ]
      }
    ]
  },
  {
    "id": "tangirimning-aty",
    "slug": "tangirimning-aty",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Тәңірімнің Аты"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "/ Тәңірімнің Аты қамал сияқты",
            "reading": "탱-으름-능 아-트 카-말 씨-약-트"
          },
          {
            "kk": "Оған сенген адам құтқарылады./(*2)",
            "reading": "오-간 쎈- 겐 아-담 쿳- 카-를- 라 -드"
          },
          {
            "kk": "/Оның Аты мадақталсын!/ (*3)",
            "reading": "오-능 아-트 마-닥-탈-쓴!"
          },
          {
            "kk": "Жер мен көкте.",
            "reading": "제르 몐 쾩- 톄"
          },
          {
            "kk": "/Оның Аты ардақталсын!/(*3)",
            "reading": "오-능 아-트 아르-닥-탈-쓴!"
          },
          {
            "kk": "Жер мен көкте",
            "reading": "제르 몐 쾩-톄"
          }
        ]
      }
    ]
  },
  {
    "id": "shattanamyn",
    "slug": "shattanamyn",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Шаттанамын"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Шаттанамын, Ұлы Құдай жүрегімде",
            "reading": "샷-타-나-믄, 울-르 쿠- 다이 쥐-레-금-뎨"
          },
          {
            "kk": "Менің мәңгі өмір сүрсе, шаттанамын",
            "reading": "몌-능 맹-그 외-므르 쒸르-쎄, 샷-타- 나-믄"
          },
          {
            "kk": "Қуанамын, Киелі Рух жүрегімде",
            "reading": "쿠-아-나-믄, 키-엘-르 루-흐 쥐-렉-금-뎨"
          },
          {
            "kk": "Менің мәңгі өмір сүрсе, қуанамын.",
            "reading": "몌-능 맹-그 외-므르 쒸르-쎄, 쿠아-나-믄"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Махаббат жолымен бізді",
            "reading": "마-하-밧 졸-르-몐 브즈-드"
          },
          {
            "kk": "жетеледің, жетеледің,",
            "reading": "줴-텔-례-등 줴-텔-레-등"
          },
          {
            "kk": "Күнәнің торынан бізді",
            "reading": "쿠-내- 능 토-르-난 브즈-드"
          },
          {
            "kk": "азат еттің",
            "reading": "아-잣 옛-뜽"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Рәббім Иса, Сенің даңқың бар әлемде"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Махаббат жолымен бізді",
            "reading": "마-하-밧 졸-르-몐 브즈-드"
          },
          {
            "kk": "жетеледің, жетеледің,",
            "reading": "줴-텔-례-등 줴-텔-레-등"
          },
          {
            "kk": "Күнәнің торынан бізді",
            "reading": "쿠-내- 능 토-르-난 브즈-드 азат еттің 아-잣 옛-뜽"
          }
        ]
      }
    ]
  },
  {
    "id": "qazaqstan-zherine",
    "slug": "qazaqstan-zherine",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Қазақстан жеріне"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Қазақстан жеріне",
            "reading": "카-작-스-탄 졔르-녜"
          },
          {
            "kk": "Құдайдың тірі Сөзі келді.",
            "reading": "쿠-다이-등 트-르 쐬-즈 켈-드"
          },
          {
            "kk": "Алматы аспанына, құтқарылу әкелді.",
            "reading": "알-마-트 아스-파-느-나, 쿳-카-를-루 애-켈-드"
          },
          {
            "kk": "Саған айтар әніміз, ешқашан да таусылмайды",
            "reading": "사-간 아이-타르 애-느-므즈, 예싀-카-샨 다 타우-쓸-마이-드"
          },
          {
            "kk": "Даңқыңды көтереміз, Сен оған лайықтысың!",
            "reading": "당-킁-드 쾨-톄-레-므즈, 쎈 오-간 라이-윽-뜨-씅!"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Жарылқаған жерде, тұрмыз,",
            "reading": "쟈-를-카-간 졔르-뎨 투르-므즈"
          },
          {
            "kk": "Ол Киелі табан тіренішің",
            "reading": "올 키-옐-르 타-반 트-례-느-싕"
          },
          {
            "kk": "Мадақтаймыз, бәрі естісін",
            "reading": "마-닥-타이-므즈, 배-르 예스-트-쓴"
          },
          {
            "kk": "Құдай Патшалығы жақындады!",
            "reading": "쿠-다이 팟-샬-르-그 쟈-큰-다-드"
          }
        ]
      }
    ]
  },
  {
    "id": "qol-koterip",
    "slug": "qol-koterip",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Қол көтеріп"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "//Қол көтеріп мадақтайық",
            "reading": "콜 쾨-톄-릅 마-닥-타이-윽"
          },
          {
            "kk": "Бізге келген Иса Мәсіх",
            "reading": "브즈-게 켈-겐 이-사 매-슥"
          },
          {
            "kk": "Тек Сен ғана мені басқармақсың. //",
            "reading": "텍 쎈 가-나 몌-느 바스-카르-막-씅"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Дәріптейін Сені тек,",
            "reading": "대-릅-테이은 쎄-느 텍"
          },
          {
            "kk": "Бос ойымды лақтырып.",
            "reading": "보스 오이-음-드 락-트-릅"
          },
          {
            "kk": "Жаныма келші, Киелі Рух",
            "reading": "쟈-느-마 켈-싀 키-옐-르 루-흐"
          },
          {
            "kk": "Бөлеп Өзіңе толтыршы.",
            "reading": "뵐-렙 외-증-예 톨-트르-싀"
          },
          {
            "kk": "Бір Өзіңе арнаймын өмірімді.",
            "reading": "브르 외-증-예 아르-나이-믄 외-므-름-드"
          }
        ]
      }
    ]
  },
  {
    "id": "qolymdy-saghan-koterem-tangir",
    "slug": "qolymdy-saghan-koterem-tangir",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Қолымды Саған көтерем Тәңір"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Тәңір мадақты қабыл ал.",
            "reading": "탱-으르 마-닥-뜨 카-블 알."
          },
          {
            "kk": "Жүректі Саған ашамын Тәңір,",
            "reading": "쥐-렉-뜨 싸-간 아-샤-믄 탱-으르"
          },
          {
            "kk": "Тәңір мадақты қабыл ал.",
            "reading": "탱-으르 마-닥-뜨 카-블 알."
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Мені киіндірді Ол",
            "reading": "몌-느 키-은-드르-드 올"
          },
          {
            "kk": "Әділдік киіміне",
            "reading": "애-들-득 키-으-므-녜"
          },
          {
            "kk": "Күл орнына Ол маған",
            "reading": "쿨 오르-느-나 올 마간"
          },
          {
            "kk": "Патшалық салтанат берді",
            "reading": "팟-샬-륵 쌀-타-낫 베-르-드"
          }
        ]
      }
    ]
  },
  {
    "id": "quan-alem",
    "slug": "quan-alem",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Қуан, әлем"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "1. Қуан әлем, Тәңір келмек,",
            "reading": "쿠안 앨렘, 탱으르 곌멕 Жер шаттан, қарсы ал. 제르 샷탄 카르쓰 알 Ол Патшасы Патшалардың, 올 팟샤쓰 팟샬라르등 Мадақта сен ән сал, 마닥타 쎈 앤 쌀 Мадақта сен ән сал, 마닥타 쎈 앤 쌀 Мадақта, мадақта сен ән сал. 마닥타, 마닥타 쎈 앤 쌀"
          },
          {
            "kk": "2. Қуан әлем, Мәсіх келді,",
            "reading": "쿠안 앨렘, 매쓱 켈드 Қауымдар тойлауда 카움다르 토일라르다 Дала, бақша, орман, төбе. 달라, 박샤, 오르만, 툐볘 Қуанды олар да, 쿠안드 올라르 다, Қуанды олар да, 쿠안드 올라르 다, Қуанды, қуанды олар да. 쿠안-드, 쿠안-드, 올라르 다."
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "3. Күнә, қасірет болмасын,",
            "reading": "쿠내, 카쓰-렛 볼마쓴 Тікенек жаппасын. 트케녝 잡파쓴 Қарғыс оты, жайлағанда, 카르그스 오뜨 쟈일라간다 Шапағат Ол берсін, 샤파갓 올 베르쓴 Шапағат Ол берсін. 샤파갓 올 베르쓴 Шапағат, шапағат Ол берсін. 샤파갓, 샤파갓 올 베르쓴"
          },
          {
            "kk": "4. Бейбіт өмірдің рахатын,",
            "reading": "베이븟 외므르등 라하뜬 Ол Өз махаббатын 올 외즈 마하바뜬 Ұлылығын, әділдігін 울르르근, 애들드근 Сыйлады Ол бізге, 쓰일라드 올 브즈게, Сыйлады Ол бізге 쓰일라드 올 브즈게, Сыйлады, сыйлады Ол бізге. 쓰일라-드, 쓰일라-드 올 브즈게."
          }
        ]
      }
    ]
  },
  {
    "id": "quantudy-seni-isa-men-qalaymyn",
    "slug": "quantudy-seni-isa-men-qalaymyn",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Қуантуды Сені Иса мен қалаймын"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Қуантуды Сені Иса мен қалаймын",
            "reading": "쿠안뚜드 쎄느 이싸 멘 칼라이믄 Тәнімді Құдайым Сен жаңартшы. 태늠드 쿠다이음 쎈 장아릇싀 О, Тәңір бас июді армандаймын. 오, 탱으르 바쓰 이유드 아르만 다이믄 махаббат нұрын көрсету үшін 마하밧 누른 쾨르셋투 우싄"
          },
          {
            "kk": "/Бар арманым менің",
            "reading": "바르 아르마늠 몌능 Бұл әлемде 불 앨렘뎨 Қуаныш болу Тәңірге/ (*2) 쿠아느싀 볼루 탱으르게"
          },
          {
            "kk": "26/11/2017"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Қуантуды Сені Иса мен қалаймын",
            "reading": "쿠안뚜드 쎄느 이싸 멘 칼라이믄 Жүректі Құдайым Сен жаңартшы. 쥐렉트 쿠다이음 쎈 장아릇싀 О, Тәңір бас июді армандаймын. 오, 탱으르 바쓰 이유드 아르만 다이믄 махаббат нұрын көрсету үшін 마하밧 누른 쾨르셋투 우싄"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "/Бар арманым менің",
            "reading": "바르 아르마늠 몌능"
          },
          {
            "kk": "Бұл әлемде",
            "reading": "불 앨렘뎨"
          },
          {
            "kk": "Қуаныш болу Тәңірге/ (*2)",
            "reading": "쿠아느싀 볼루 탱으르게"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Кішіпейіл боп Сені мен шақырамын,",
            "reading": "크싀페일 봅 쎄느 몐 샤크라믄."
          },
          {
            "kk": "Жаным мен жүрегімді тазартшы.",
            "reading": "쟈늠 몐 즤레금드 타자릇싀"
          },
          {
            "kk": "Құдайым, Саған мен жалынамын.",
            "reading": "쿠다이음, 싸간 몐 잘르나믄."
          },
          {
            "kk": "Тағыңа Сен жол көрсетші.",
            "reading": "타긍아 쎈 졸 코르세트싀"
          }
        ]
      }
    ]
  },
  {
    "id": "quanyngdar",
    "slug": "quanyngdar",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Қуаныңдар"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "1. Қуаныңдар, бүгін қуаныңдар",
            "reading": "쿠아능다르, 부근 쿠아능다르"
          },
          {
            "kk": "Құтқарушым өмірге келген күн",
            "reading": "쿳카루싐 외므르게 켈겐 쿤"
          },
          {
            "kk": "Пайғамбарлар айтқан",
            "reading": "파이감바르라르 아잇칸"
          },
          {
            "kk": "Сағынып аңсаған уәдесі жеткен күн",
            "reading": "싸그늡 앙싸간 와뎨스 젯켄 쿤"
          },
          {
            "kk": "Келіңдер, бәрің де келіңдер",
            "reading": "켈릉뎨르, 배릉 뎨 켈릉뎨르"
          },
          {
            "kk": "Ұлылығын Тәңірдің көріңдер",
            "reading": "울를르근 탱으르등 쾨릉뎨르"
          },
          {
            "kk": "Сүйді Ол бізді бастан, Күнәға қарамастан,",
            "reading": "쒸드 올 브즈드 바스탄, 쿠내가 카라마스탄"
          },
          {
            "kk": "Махаббатты төгілген, Махаббатты төгілген",
            "reading": "마하밧뜨 퇴글겐, 마하밧뜨 퇴글겐"
          },
          {
            "kk": "03/12/2017"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "2. Шаттаныңдар, бүгін шаттаныңдар",
            "reading": "샷타능다르, 부근 샷타능다르"
          },
          {
            "kk": "Босатты бізді күнәның қолынан",
            "reading": "보쌋뜨 브즈드 쿠내-능 콜-르-난"
          },
          {
            "kk": "Жүрекке Иса кірді, рухымыз тірілді",
            "reading": "쥐렉케 이싸 크르드, 루흐므즈 트를드"
          },
          {
            "kk": "Бұрын өмірсіз болған",
            "reading": "부른 외므르쓰즈 볼-간"
          },
          {
            "kk": "Келіңдер, бәрің де келіңдер",
            "reading": "켈릉뎨르, 배릉 뎨 켈릉뎨르"
          },
          {
            "kk": "Ұлылығын Тәңірдің көріңдер",
            "reading": "울를르근 탱으르등 쾨-릉-뎨르"
          },
          {
            "kk": "Сүйді Ол бізді бастан, Күнәға қарамастан,",
            "reading": "쒸드 올 브즈드 바스탄, 쿠내가 카라마스탄"
          },
          {
            "kk": "Махаббатты төгілген, Махаббатты төгілген",
            "reading": "마하밧뜨 퇴글겐, 마하밧뜨 퇴글겐"
          },
          {
            "kk": "03/12/2017"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "3. Үйреніңдер, бәрің үйреніңдер",
            "reading": "위레능뎨르, 배릉 위레능뎨르"
          },
          {
            "kk": "Исаша дүниені сүйіңдер",
            "reading": "이사샤 두니예느 쒸응뎨르"
          },
          {
            "kk": "Мәңгілік сонда біз Мәсіхпен боламыз",
            "reading": "맹글륵 쏜다 브즈 매쓱펜 볼라므즈"
          },
          {
            "kk": "Құдай сыйын біліңдер",
            "reading": "쿠다이 쓰이읜 블릉뎨르"
          },
          {
            "kk": "Келіңдер, бәрің де келіңдер",
            "reading": "켈릉뎨르, 배릉 뎨 켈릉뎨르"
          },
          {
            "kk": "Ұлылығын Тәңірдің көріңдер",
            "reading": "울를르근 탱으르등 쾨릉뎨르"
          },
          {
            "kk": "Сүйді Ол бізді бастан, Күнәға қарамастан,",
            "reading": "쒸드 올 브즈드 바스탄, 쿠내가 카라마스탄"
          },
          {
            "kk": "Махаббатты төгілген, Махаббатты төгілген",
            "reading": "마하밧뜨 퇴글겐, 마하밧뜨 퇴글겐"
          },
          {
            "kk": "03/12/2017"
          }
        ]
      }
    ]
  },
  {
    "id": "quday-patshalyghy",
    "slug": "quday-patshalyghy",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Құдай Патшалығы"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "/Құдай Патшалығы жерде көмілген қазына."
          },
          {
            "kk": "Сол қазынаны тапқан адам",
            "reading": "쏠 카즈-나-느 탑-칸 아-담 Үйге қайтар шаттық көңілменен 위-게 카이-따르 샷-특 콩-을-몌-녠 Үй сатып, жер сатып, алтынын салып, 위 싸-틉, 제르 싸-틉, 알-트-는 쌀-릅 Сол жерді қайткен күнде алмақ сатып. 쏠 제르-드 카잇-켄 쿤-데 알-막 사-틉"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "жерде көмілген қазына.",
            "reading": "제르-뎨 코-믈-겐 카-즈-나,"
          },
          {
            "kk": "Ешкім білмейтін",
            "reading": "예싀-큼 블- 메이-튼"
          },
          {
            "kk": "жер астындағы қазына/ (сияқты)",
            "reading": "제르 아스-튼-다-그 카-즈-나(씨약트)/"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Сол қазынаны тапқан адам",
            "reading": "쏠 카즈-나-느 탑-칸 아-담 Үйге қайтар шаттық көңілменен 위-게 카이-따르 샷-특 콩-을-몌-넨 Үй сатып, жер сатып, алтынын салып, 위 사-틉, 제르 사-틉, 알-트-는 쌀-릅 Сол жерді қайткен күнде алмақ сатып. 쏠 제르-드 카잇-켄 쿤-데 알-막 사-틉"
          }
        ]
      }
    ]
  },
  {
    "id": "quday-seni-tastamaydy",
    "slug": "quday-seni-tastamaydy",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Құдай сені тастамайды"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "//Құдай сені тастамайды ешқашан",
            "reading": "쿠-다이 쎄-느 타-스타-마이-드 예싀-카-샨"
          },
          {
            "kk": "Бірге болар сенімен Ол әрқашан//",
            "reading": "브르-게 볼-라르 세-느-멘 올 애르-카-샨"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "/Бәріміз барамыз жанатқа,(жанатқа)",
            "reading": "배-르-므즈 바-라-므즈 쟈-낫-카(쟈-낫-카)"
          },
          {
            "kk": "Алғыс мадақ айтып Исаға,",
            "reading": "알-그쓰 마-닥 아이-틉 이-사-가,"
          },
          {
            "kk": "Құтқарылғанын біліп",
            "reading": "쿳-카-를-가-는 블-릅"
          },
          {
            "kk": "Тәңірдің(Тәңірдің)",
            "reading": "탱-으르-등(탱-으르-등)"
          },
          {
            "kk": "Бала болдық Әке Құдайға/",
            "reading": "발-라 볼-득 애-케 쿠-다이-가"
          }
        ]
      }
    ]
  },
  {
    "id": "quday-sonsha-zhaqsy-kordi",
    "slug": "quday-sonsha-zhaqsy-kordi",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Құдай сонша жақсы көрді"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "1. Құдай сонша жақсы көрді",
            "reading": "쿠다이 쏜샤 작스 쾨르드"
          },
          {
            "kk": "Қазақ даласын.",
            "reading": "카작 달라쓴"
          },
          {
            "kk": "Ол жіберді Өзі сүйген",
            "reading": "올 즈베르드 외즈 쒸겐"
          },
          {
            "kk": "Иса баласын",
            "reading": "이싸 발라쓴"
          },
          {
            "kk": "/ Күнәсінан құтқтарылсын",
            "reading": "쿠내쓰난 쿳카를쓴"
          },
          {
            "kk": "Аман болсын деп,",
            "reading": "아만 볼쓴 뎁"
          },
          {
            "kk": "Сүйгендіктен құрбандыққа",
            "reading": "쒸겐득톈 쿠르반득카Берді баласын./(*2) 베르드 발라쓴"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "2. О, Жаратқан неткен шексіз",
            "reading": "오, 쟈랏칸 넷켄 쉑쓰즈"
          },
          {
            "kk": "Махаббатың",
            "reading": "마하밧뜽"
          },
          {
            "kk": "Бітпес сонша бізге төгер",
            "reading": "븟페쓰 쏜샤 브즈게 퇴게르"
          },
          {
            "kk": "Шапағатың",
            "reading": "샤파갓뜽"
          },
          {
            "kk": "/ Сиынамыз бір Өзіңе",
            "reading": "씨으나므즈 브르 외증예"
          },
          {
            "kk": "Құдай Әке,",
            "reading": "쿠다이 애케"
          },
          {
            "kk": "Тыныштық та қуаныш та /",
            "reading": "트느싀특 타 쿠아느싀 타"
          },
          {
            "kk": "Бір Өзіңде/(*2)",
            "reading": "브르 외증데 /(*2)"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "3. Талай адам білмей кетті",
            "reading": "탈라이 아담 블메이 켓뜨"
          },
          {
            "kk": "Бұл шындықты.",
            "reading": "불 싄득뜨"
          },
          {
            "kk": "Білседағы қабылдамай",
            "reading": "블쎄다그 카블다마이Құрбандықты 쿠르반득뜨"
          },
          {
            "kk": "/ Ей, адамзат, аялдашы /",
            "reading": "에이, 아담잣, 아얄다싀"
          },
          {
            "kk": "Қабылдашы.",
            "reading": "카블다싀"
          },
          {
            "kk": "Иса төккен күнәң үшін",
            "reading": "이싸 퇵켄 쿠냉 우싄"
          },
          {
            "kk": "Таза қанды./(*2)",
            "reading": "타자 칸드/"
          },
          {
            "kk": "ㅡ"
          }
        ]
      }
    ]
  },
  {
    "id": "qulap-dangqymdy-qoyamyn",
    "slug": "qulap-dangqymdy-qoyamyn",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Құлап даңқымды қоямын"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Құлап даңқымды қоямын аяғына Оның.",
            "reading": "쿨-랍 당큼-드 코-야믄 아야-그-나 오-능"
          },
          {
            "kk": "Мейірім мен махаббатты сол жерден табамын.",
            "reading": "메이-으-름 몐 마-하-밧뜨 쏠 졔르-뎬 타-바-믄."
          },
          {
            "kk": "Жар саламын Киелі, Киелі (*3)",
            "reading": "쟈-르 쌀-라-믄 키-옐-르, 키-옐-르"
          },
          {
            "kk": "Ол Киелі.",
            "reading": "올 키-옐-르"
          }
        ]
      }
    ]
  },
  {
    "id": "qurmettegen",
    "slug": "qurmettegen",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Құрметтеген"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "1. Құрметтеген тек жалғыз Патшаны",
            "reading": "쿠르멧테겐 텍 잘그즈 팟샤느"
          },
          {
            "kk": "Көріп тұрмын Оған сиынған үйді.",
            "reading": "코릅 투르믄 오간 씨은간 위드"
          },
          {
            "kk": "Әлеммен бірдей Оның үйін көрем.",
            "reading": "앨렘멘 브르데이 오능 위은 코렙Құтқарылу нұрын төккен. 쿳카를루 누른 퇵켄."
          },
          {
            "kk": "Қазақстан, құтқарыласың",
            "reading": "카작스탄, 쿳카를라씅"
          },
          {
            "kk": "Махаббат нұры жарқырайды.",
            "reading": "마하밧 누르 쟈르크라이드"
          },
          {
            "kk": "Қазақстанда жалғыз Патша",
            "reading": "카작스탄다 쟐그즈 팟샤"
          },
          {
            "kk": "Жалғыз Құдай, Иса Мәсіх",
            "reading": "쟐그즈 쿠다이, 이싸 매슥"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "1. Көріп тұрмын махаббат өзенін",
            "reading": "코릅 투르믄 마하밧 외젠은"
          },
          {
            "kk": "Патшаға жол дайындаған күнді.",
            "reading": "팟샤가 졸 다이읜다간 쿤드"
          },
          {
            "kk": "Көріп тұрмын, сол күні адамзат",
            "reading": "코릅 투르믄, 쏠 쿠느 아담잣Жар салады : « Тәңірім кел» - деп. 쟈르살라드 “탱으름 켈”- 뎁."
          },
          {
            "kk": "Қазақстан, құтқарыласың",
            "reading": "카작스탄, 쿳카를라씅"
          },
          {
            "kk": "Махаббат нұры жарқырайды.",
            "reading": "마하밧 누르 쟈르크라이드"
          },
          {
            "kk": "Қазақстанда жалғыз Патша",
            "reading": "카작스탄다 쟐그즈 팟샤"
          },
          {
            "kk": "Жалғыз Құдай, Иса Мәсіх",
            "reading": "쟐그즈 쿠다이, 이싸 매슥"
          }
        ]
      }
    ]
  },
  {
    "id": "qurmetteymin-seni",
    "slug": "qurmetteymin-seni",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Құрметтеймін Сені"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Құрметтеймін Сені балаңдай"
          },
          {
            "kk": "Мадақтаймын әнменен тынбай"
          },
          {
            "kk": "Жар болшы маған Теңір"
          },
          {
            "kk": "Адалсың Сен мәңгі"
          },
          {
            "kk": "Қараңғыдан шығарған"
          },
          {
            "kk": "Рақымын мол сыйлаған"
          },
          {
            "kk": "Күнәмді кешіріп өлімнен"
          },
          {
            "kk": "мені құтқарған"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Құтқарушым менің мен Сені сүйемін"
          },
          {
            "kk": "Саған меңгі ризамын"
          },
          {
            "kk": "Жан-тәніммен Сені"
          },
          {
            "kk": "Иса жағыз Сені Мен мадақтаймын"
          },
          {
            "kk": "Құтқарушым менің мен Сені сүйемін"
          },
          {
            "kk": "Кешірші деп сұраймын"
          },
          {
            "kk": "Мейірімді Иемді жақсы адал Иемді"
          },
          {
            "kk": "Меңгі жырлаймын меңгі жырлаймын"
          }
        ]
      }
    ]
  },
  {
    "id": "qurmetteymin-seni-balangday",
    "slug": "qurmetteymin-seni-balangday",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Құрметтеймін Сені балаңдай"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Құрметтеймін Сені балаңдай",
            "reading": "쿠르멧테이믄 쎄느 발랑다이"
          },
          {
            "kk": "Мадақтаймын әнменен тынбай",
            "reading": "마닥타이믄 엔몐넨 튼바이"
          },
          {
            "kk": "Жар болшы маған Тәңір, адалсың Сен мәңгі",
            "reading": "자르 볼싀 마간 텡으르, 아달승 쎈-- 멩그--"
          },
          {
            "kk": "Қараңғыдан шығарған Рақымын мол сыйлаған",
            "reading": "카랑그단 싀가르간 라크믄 몰 쓰이라간--"
          },
          {
            "kk": "Күнәмді кешіріп, өлімнен мені құтқарған",
            "reading": "쿠넴드 케싀릅 윌름넨 몌느 쿳카르간--"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "/Құтқарушым менің, мен Сені сүйемін Саған мәңгі ризамын",
            "reading": "쿳카루싐 몌능,몐 쎄느 쒸이예믄 싸간 멩그 리자믄—"
          },
          {
            "kk": "Жан-тәніммен Сені, Иса жалғыз Сені Мен мадақтаймын!",
            "reading": "잔-테늠몐 쎄느, 이싸 잘그즈 쎄느 몐 마닥타이믄--"
          },
          {
            "kk": "Құтқарушым менің, мен Сені сүйемін кешірші деп сұраймын",
            "reading": "쿳카루싐 몌능, 몐 쎄느 쒸이예믄 케싀르싀 뎁 수라이믄--"
          },
          {
            "kk": "Мейрімді Иемді, жақсы адал Иемді Мәңгі жырлаймын",
            "reading": "메이름드 이옘드, 작쓰 아달 이옘드 멩그 즈르라이믄--"
          },
          {
            "kk": "мәңгі жырлаймын /",
            "reading": "멩그 즈르라이믄--"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Ән саламын қуанғанымнан",
            "reading": "엔 쌀라믄 쿠안가늠난"
          },
          {
            "kk": "Ешқашан кетпеші жанымнан",
            "reading": "예싀카샨 켑페싀 자늠난"
          },
          {
            "kk": "Панам болшы о Тәңір, адалсың Сен мәңгі",
            "reading": "파남 볼싀 오 텡으로, 아달승 쎈 멩그"
          },
          {
            "kk": "Тіршілікті жаратқан Ойын әске асырған",
            "reading": "트르싀륵트 자랏칸-- 오이은 에쓰케 아쓰르간--"
          },
          {
            "kk": "Өзін құрметтеген адамға Жаны ашыған.",
            "reading": "위즌 쿠르멧테겐 아담가 자느 아싀간--"
          }
        ]
      }
    ]
  },
  {
    "id": "qutqardyng-meni-isa",
    "slug": "qutqardyng-meni-isa",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Құтқардың мені Иса"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Саған ұқсас ешкім жоқ",
            "reading": "싸-간 혹-싸스 예싀-큼 족"
          },
          {
            "kk": "Әр күнімде мадақтаймын",
            "reading": "애르 쿠-늠-뎨 마-닥-타이-믄"
          },
          {
            "kk": "Ұлы махаббатыңды",
            "reading": "울-르 마-하-밧-뜽-드"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "2. Қуаныш бердің Сен",
            "reading": "쿠-아-느싀 베르-등 쎈"
          },
          {
            "kk": "Әлсіз болсам қиналмайм",
            "reading": "앨-쓰즈 볼-쌈 키-날-마-임"
          },
          {
            "kk": "Қайда болсам, не болса да",
            "reading": "카이-다 볼-쌈, 녜 볼-싸 다"
          },
          {
            "kk": "Мадақтаймын мен Сені",
            "reading": "마-닥-타이-믄 몐 쎄-느"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "//Патшамызды шын жүректен мадақтайық!",
            "reading": "팟-샤-므즈-드 싄 쥐-렉-톈 마-닥-타이-읙!"
          },
          {
            "kk": "Бүкіл әлем Исаға ән салайық!",
            "reading": "부-클 앨-렘 이-싸-가 앤 쌀-라이-읙"
          },
          {
            "kk": "Теңіз, жайлау, таулар ән салды Иса Мәсіхке,",
            "reading": "탱-으즈, 쟈일-라우, 타우-라르 앤 쌀-드"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Иса Мәсіх біз Сені мадақтаймыз.",
            "reading": "이-싸 매-슥 브즈 쎄-느 마-닥-타이-므즈"
          },
          {
            "kk": "Мәңгілікке біз Сенсіз бара аламаймыз,",
            "reading": "맹-글-륵-케 브즈 쎈-쓰즈 바-랄-마이-므즈"
          },
          {
            "kk": "Махаббатың да күшің де бізбен бірге.//",
            "reading": "마-하-밧-뜽 다 쿠-싕 뎨 브즈-벤 브르-게"
          }
        ]
      }
    ]
  },
  {
    "id": "qutqarushym-tiri",
    "slug": "qutqarushym-tiri",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Құтқарушым тірі"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Білемін мен құтқарылдым,",
            "reading": "블-레-믄 몐 쿳-카-를-듬"
          },
          {
            "kk": "Қаныңмен күнәмді жудың.",
            "reading": "카-능-몐 쿠-냄-드 주-등"
          },
          {
            "kk": "Сенемін, сенемін.",
            "reading": "쎄-녜-믄, 쎄-녜-믄"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Мендегі ұятты алдың,",
            "reading": "멘뎨그 우얏뜨 알등,"
          },
          {
            "kk": "Жараларды емдедің.",
            "reading": "쟈랄라르드 옘뎨드"
          },
          {
            "kk": "Сенемін, сенемін.",
            "reading": "쎄녜믄, 쎄녜믄."
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Жеңіске жеттім, О-о-о",
            "reading": "젱-으쓰-케 젯-뜸, 오-오-오"
          },
          {
            "kk": "Тәңірім өлімді жеңді.",
            "reading": "탱-으-름 욀-름-드 젱-드"
          }
        ]
      }
    ]
  },
  {
    "id": "uly-patsha",
    "slug": "uly-patsha",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Ұлы Патша!"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "(1)"
          },
          {
            "kk": "Жүремін Сенің мен жолыңмен,",
            "reading": "쥐레믄 쎄능 몐 졸릉몐"
          },
          {
            "kk": "Бағытпен Құдайдың көрсеткен",
            "reading": "바그트폔 쿠다이등 코르세켄"
          },
          {
            "kk": "Жақын тануға Сені, Тәңір",
            "reading": "자큰 타누가 쎄느, 텡으르"
          },
          {
            "kk": "Рухыңа толтыр Киелі Рух",
            "reading": "루흥아 톨트르 키옐르 루흐"
          },
          {
            "kk": "Өміріңді паш еттің, Қасиетті қаныңмен",
            "reading": "외므릉드 파쉬 예틍, 카씨예트 카능몐"
          },
          {
            "kk": "Иса бағыт бер,Шындық жол, Иса Ие көрсет!",
            "reading": "이싸 바그트 베르, 싄득 죠르, 이싸 이예 코르쎄트 !"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "(2)"
          },
          {
            "kk": "Сен деп өмір сүрем,",
            "reading": "쎈 뎁 외므르 쑤렘"
          },
          {
            "kk": "Саған ғана ерем",
            "reading": "싸간 가나 예렘"
          },
          {
            "kk": "Сенің ізгі сөзің",
            "reading": "쎄능 으즈그 쑤증"
          },
          {
            "kk": "Таралсын әлемге.",
            "reading": "타랄쓴 옐렘게"
          },
          {
            "kk": "Жеңімпаз болам мен,",
            "reading": "졩음파즈 볼람 몐"
          },
          {
            "kk": "Келеді осы күн,",
            "reading": "켈례드 오스 쿤"
          },
          {
            "kk": "Артқа шегінбеймін,",
            "reading": "아르카 쉐근베이믄"
          },
          {
            "kk": "Ұлы Патша!",
            "reading": "울르 퍄샤 !"
          }
        ]
      }
    ]
  },
  {
    "id": "uly-tangir",
    "slug": "uly-tangir",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Ұлы Тәңір"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Ұлы Тәңір, Сен жаратқан дүниеге",
            "reading": "울-르 탱-으르, 쎈 쟈 – 랏- 칸 두-녜-계 Көз жіберіп қараған кезімде 쾨즈 즈-베-릅 카-라-간 케-즘-뎨"
          },
          {
            "kk": "Білемін мен Әкелік махаббатыңмен",
            "reading": "블-례-믄 몐 애-켈-륵 마-하-밧-틍-몐 Тіршілікке шапағат нәр бердің. 트르-싈-륵-켸 샤-파-갓 내르 볘르-등"
          },
          {
            "kk": "/Сонда Тәңірім, Саған рухым жырлайт:",
            "reading": "쏜-다 탱-으-름, 싸-간 루-흠 즈를-라-잇"
          },
          {
            "kk": "Ұлысың Сен! Ұлысың Сен!/(*2)",
            "reading": "울-르-씅 쎈! 울-르-씅 쎈!"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Көктем келіп, табиғат гүлдегенде,",
            "reading": "쾩-톔 켈-릅, 타-비-갓 굴-뎨-곈-뎨 Естігенде сайраған бұлбұлды. 예스- 트-겐-뎨 싸이-라-간 불-불-드 Жұпар иіс кеудемді кернегенде, 쥬-파르 이-으쓰 켸-우-뎸-드 켸르-녜-곈-뎨 Ерке бұлақ, сылдырай аққанда 예르-켸 불-락 쓸-드-라이 악-칸-다"
          },
          {
            "kk": "/Сонда Тәңірім, Саған рухым жырлайт:",
            "reading": "쏜-다 탱-으-름, 싸-간 루-흠 즈를-라-잇"
          },
          {
            "kk": "Ұлысың Сен! Ұлысың Сен!/(*2)",
            "reading": "울-르-씅 쎈! 울-르-씅 쎈!"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Бізге айқышта кешірім алып берген",
            "reading": "브즈-게 아이-크싀-타 케-싀-름 알-릅 볘르-겐 Айқышта өлген ғаламның Патшасы. 아이-크싀-타 욀-곈 갈-람-능 팟-샤-스"
          },
          {
            "kk": "Жер бетінде адамның құлы болған",
            "reading": "제르 베-튼-뎨 아-담-능 쿨-르 볼-간 Момын жүзін Мәсіхтің көргенде 모-믄 주-즌 매-슥-틍 쾨르-겐-뎨"
          },
          {
            "kk": "/Сонда Тәңірім, Саған рухым жырлайт:",
            "reading": "쏜-다 탱-으-름, 싸-간 루-흠 즈를-라-잇"
          },
          {
            "kk": "Ұлысың Сен! Ұлысың Сен!/(*2)",
            "reading": "울-르-씅 쎈! 울-르-씅 쎈!"
          }
        ]
      }
    ]
  },
  {
    "id": "alsiz-aytsyn",
    "slug": "alsiz-aytsyn",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Әлсіз айтсын"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Әлсіз айтсын : «Күштімін!»",
            "reading": "앨-쓰즈 아잇-쓴 : “ 쿠싀-트-믄”"
          },
          {
            "kk": "Жарлы айтсын: «Мен баймын!»",
            "reading": "쟈를-르 아잇-쓴: “몐 바이-믄”"
          },
          {
            "kk": "Зағип айтсын: «Мен көрем!»",
            "reading": "자-깁 아잇-쓴 : “몐 쾨-렘”"
          },
          {
            "kk": "Іске асырды Тәңірім.",
            "reading": "으쓰-케 아-쓰르-드 탱-으-름"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "chorus",
        "label": {
          "kk": "Қр.",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Осанна, Осанна,",
            "reading": "오-싼-나, 오-싼-나"
          },
          {
            "kk": "Жанын қиған тоқтыға!",
            "reading": "쟈-는 키-간 톡-트-가!"
          },
          {
            "kk": "Осанна, Осанна",
            "reading": "오-싼-나, 오-싼-나"
          },
          {
            "kk": "Иса өліп тірілді.",
            "reading": "이-싸 욀-릅 트-를-드"
          }
        ]
      },
      {
        "id": "s3",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Жүзіп өттім мұхиттан,",
            "reading": "쥐-즙 욋-틈 묵-힛-탄 ,"
          },
          {
            "kk": "Арылсын күнәлардан.",
            "reading": "아-를-쓴 쿠-내-라르-단"
          },
          {
            "kk": "Махаббат мейіріне,",
            "reading": "마-하-밧 메이-으-르-녜"
          },
          {
            "kk": "Бөледі Құтқарушым.",
            "reading": "뵐-례-드 쿳-카-루-싐"
          }
        ]
      },
      {
        "id": "s4",
        "kind": "verse",
        "label": {
          "kk": "3",
          "ko": "3절"
        },
        "lines": [
          {
            "kk": "Терең судан шығарды,",
            "reading": "테-렝 쑤-단 싀-가르-드"
          },
          {
            "kk": "Сақтаушы Тәңір қолы.",
            "reading": "싹-타우-싀 탱-으르 콜-르."
          },
          {
            "kk": "Құтқару әнін салам,",
            "reading": "쿳-카-루 애-는 쌀-람"
          },
          {
            "kk": "Азат еткен Исаға",
            "reading": "아-잣 옛-켄 이-싸-가"
          }
        ]
      }
    ]
  },
  {
    "id": "an-salyp-bi-bileyik",
    "slug": "an-salyp-bi-bileyik",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Ән салып, би билейік"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Ән салып би билейік Қолымды көкке көтер.",
            "reading": "앤 쌀 – 릅 비 빌-레이 – 윽 콜- 름- 드 쾩 – 케 쾨 – 톄 르"
          },
          {
            "kk": "Біздің Құдай - шындық және өмір(шынай өмір)",
            "reading": "브즈 – 등 쿠-다이 싄–득 재–녜 외–므르 (싀-나이 외-므르)"
          },
          {
            "kk": "Мұқтаждықтар болғанда, Құдайға сен сиыншы",
            "reading": "묵-타쥬 – 득– 타르 볼 – 간 - 다 쿠- 다이-가 쎈 씨–은 - 싀"
          },
          {
            "kk": "Ол саған жауабын береді",
            "reading": "올 싸–간 자-와–븐 베 – 례 – 드"
          },
          {
            "kk": "/Себебі Ол - Иса тірі (*4)/",
            "reading": "쎄– 볘 –브 올 - 이–사 트-르"
          }
        ]
      }
    ]
  },
  {
    "id": "anmen-madaqtaymyn",
    "slug": "anmen-madaqtaymyn",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Әнмен мадақтаймын"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Әнмен мадақтаймын Атыңды Ием",
            "reading": "앤-몐 마-닥-타이-믄 아-틍-드 이-옘"
          },
          {
            "kk": "Мадақтаймын Атыңды Ием,",
            "reading": "마-닥-타이-믄 아-틍-드 이-옘"
          },
          {
            "kk": "Сенің Атыңа құрмет пен ұлылық!",
            "reading": "쎄-능 아-틍-아 쿠르-멧-펜 울-르-륵!"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Асқақтатам Сенің Атыңды, Ием!",
            "reading": "아스-칵-타-탐 쎄-능 아-틍-드 이-옘!"
          },
          {
            "kk": "Асқақтатам Атыңды, Ием!",
            "reading": "아스-칵-타-탐 아-틍-드, 이-엠!"
          },
          {
            "kk": "Сенің Атыңа құрмет пен ұлылық!",
            "reading": "쎄-능 아-틍-아 쿠르-멧 펜 울-르-륵!"
          }
        ]
      }
    ]
  },
  {
    "id": "ar-kunde-isa-maghan-qazhetsing",
    "slug": "ar-kunde-isa-maghan-qazhetsing",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Әр күнде, Иса маған қажетсің"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Әр-бір сәтте, өмірімде."
          },
          {
            "kk": "Киелі-Сенің қасыңда болғым келеді,"
          },
          {
            "kk": "Құшағыңа, алшы мені!//(*2)"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "verse",
        "label": {
          "kk": "2",
          "ko": "2절"
        },
        "lines": [
          {
            "kk": "Тәңірім-Сені мадақтаймын,"
          },
          {
            "kk": "жүзіңді аңсаймын,"
          },
          {
            "kk": "Сен-жалғыз, Сен-маған қажетсің!"
          },
          {
            "kk": "Әр күнде мен, табынамын,"
          },
          {
            "kk": "өзімді арнаймын,"
          },
          {
            "kk": "Сен-жалғыз, Сен-маған қажетсің!"
          }
        ]
      }
    ]
  },
  {
    "id": "arbir-qimylym",
    "slug": "arbir-qimylym",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Әрбір қимылым"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Әрбір қимылым Сенде, Иса,",
            "reading": "애르-브르 키-믈-름 쎈-뎨, 이싸 Жаныма қуат бердің. 쟈-느-마 쿠-앗 베르-등 Әрбір тынысым Сенде, Ием 애르-브르 트-느-씀 쎈-뎨, 이-엠 Әрбір қадамым Сенде, Иса 애르-브르 카-다-믐 쎈-뎨, 이-싸 Жүретін жолымсың, 쥐-레-튼 졸-름-씅 Әрбір қадамым Сенде, Ием! 애르-브르 카-다-믐 쎈-뎨, 이-옘!"
          },
          {
            "kk": "Ла ла ла ла Ла ла ла ла",
            "reading": "라-라-라-라 라-라-라-라"
          },
          {
            "kk": "Сенің жүзіңді көремін әрқашан",
            "reading": "쎄-능 쥐-증-드 쾨-례-믄 애르-카샨 Толқындай таусылмайды мейірің 톨큰다이 타우쓸마이드 메이으릉 Махаббатыңа толамын 마-하-바-틍-아 톨-라-믄 Әке, мұны қалай түсінем? 애-케, 무-느 칼-라이 투-쓰-녜-믄"
          }
        ]
      }
    ]
  },
  {
    "id": "omirim-sende",
    "slug": "omirim-sende",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Өмірім Сенде"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "/Өмірім Сенде, Ием,",
            "reading": "외-므름 쎈-뎨, 이-옘"
          },
          {
            "kk": "Күшім де Сенде, Ием.",
            "reading": "쿠-싐- 뎨 쎈-뎨, 이-옘"
          },
          {
            "kk": "Үмітім Сенде, Ием",
            "reading": "우-믓-뜸 쎈-뎨, 이-옘"
          },
          {
            "kk": "Сенде, тек Сенде/(*2)",
            "reading": "쎈-뎨, 텍 쎈-뎨"
          },
          {
            "kk": "Сиынам өміріммен, Ием,",
            "reading": "씨으- 남 외-므-름-몐, 이-옘"
          },
          {
            "kk": "Сиынам Саған",
            "reading": "씨으-남 싸-간 барлық күшіммен. 바를-륵 쿠싐몐"
          },
          {
            "kk": "Бар өміріммен",
            "reading": "바르 외-므름-몐"
          },
          {
            "kk": "Барлық күшіммен",
            "reading": "바를-륵 쿠-싐-몐"
          },
          {
            "kk": "Бар үмітім Сенде, Ием.",
            "reading": "바르 우-믓-뜸 셴-뎨, 이-옘"
          }
        ]
      }
    ]
  },
  {
    "id": "ote-ertede",
    "slug": "ote-ertede",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Өте ертеде"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Өте ертеде, заңғар көктерде",
            "reading": "외테 예르톄뎨, 장가르 쾩테르뎨"
          },
          {
            "kk": "Сенің атыңды Құдай атады.",
            "reading": "쎄능 아틍드 쿠다이 아타드"
          },
          {
            "kk": "Тәңір қарады, жаратып сені.",
            "reading": "텡으르 카라드, 쟈라틉 쎄느"
          },
          {
            "kk": "Ризашылықпен деді Ол сонда:",
            "reading": "리자싀륵펜 뎨드 올 쏜다 :"
          },
          {
            "kk": "«Орасан осы ғаламда барлығын",
            "reading": "오라싼 오쓰 갈람다 바를르근"
          },
          {
            "kk": "Өз қолыммен сүйіп жараттым",
            "reading": "외즈 콜름몐 쒸읍 쟈랏틈"
          },
          {
            "kk": "Саған қарап қуанып, Мен шаттанамын.",
            "reading": "싸간 카랍 쿠아늡, 몐 샤타나믄"
          },
          {
            "kk": "Еске сақта мен сүйем сені.",
            "reading": "예스케 싹타 몐 쉬엠 세느"
          },
          {
            "kk": "Сүйем сені, бата берем.",
            "reading": "쒸옘 쎄느, 바타 베렘"
          },
          {
            "kk": "Сенің жүрегіңе сыйлаймын.",
            "reading": "쎄능 쥐레긍예 쓰이라이믄."
          },
          {
            "kk": "Махаббатымды Мен».",
            "reading": "마하밧틈드 몐"
          }
        ]
      }
    ]
  },
  {
    "id": "ar-sozimning-maqsaty",
    "slug": "ar-sozimning-maqsaty",
    "event": "Бақыт қайнар · PPT 찬양집",
    "title": {
      "kk": "Әр сөзімнің мақсаты",
      "reading": "아르 쇠즘능 막싸트"
    },
    "sections": [
      {
        "id": "s1",
        "kind": "verse",
        "label": {
          "kk": "1",
          "ko": "1절"
        },
        "lines": [
          {
            "kk": "Әр сөзімнің мақсаты,",
            "reading": "아르 쇠즘능 막싸트,"
          },
          {
            "kk": "Жүрегімнің барлық қалауы —",
            "reading": "쥐레금능 바를륵 칼라우으 —"
          },
          {
            "kk": "Мадақ беру Саған, Құдайым!",
            "reading": "마닥 베루 싸간, 쿠다임!"
          },
          {
            "kk": "Әр ойымның мақсаты,",
            "reading": "아르 오임능 막싸트,"
          },
          {
            "kk": "Жүрегімнің барлық қалауы —",
            "reading": "쥐레금능 바를륵 칼라우으 —"
          },
          {
            "kk": "Мадақ беру Саған, Құдайым!",
            "reading": "마닥 베루 싸간, 쿠다임!"
          }
        ]
      },
      {
        "id": "s2",
        "kind": "chorus",
        "label": {
          "kk": "Қайырма",
          "ko": "후렴"
        },
        "lines": [
          {
            "kk": "Сен барлық ұлттардан жоғарысың,",
            "reading": "쎈 바를륵 울타르단 죠가르씅,"
          },
          {
            "kk": "Биіксің Сен адамзаттың ойынан.",
            "reading": "비익씅 쎈 아담잣틍 오이난."
          },
          {
            "kk": "Еркіндістеймін жүрегіммен,",
            "reading": "예르큰드스테이믄 쥐레금몐,"
          },
          {
            "kk": "Сенемін мен Құдайдың рақымына!",
            "reading": "쎄네믄 몐 쿠다이등 라크므나!"
          }
        ]
      }
    ]
  }
];
