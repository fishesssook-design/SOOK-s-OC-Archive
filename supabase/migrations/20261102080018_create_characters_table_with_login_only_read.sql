/*
# Create characters table (logged-in read only) and seed current catalog

1. New Tables
- `characters`: one row per catalog entry.
  - `id` (integer, primary key, matches the existing character numbers)
  - `dex_number`, `catchphrase`, `name`, `gender`, `species`, `height`, `job`
  - `keywords` (text array)
  - `personality`, `features`, `details`, `community`
  - `started_at` (date), `is_public` (boolean)
  - `thumbnail_url`, `full_body_url` (optional image links)
  - `growth_profiles` (JSON list of { age, profile, settings })

2. Seed data
- Inserts the six current characters. Re-running this migration does not duplicate rows.

3. Security
- Row level security is enabled on `characters`.
- Only the `authenticated` role (signed-in users) can read the table. Anonymous visitors get nothing.
- No insert, update, or delete access is granted to website visitors. Writes are reserved for later admin work.

4. Notes
- The read policy is intentionally shared: every signed-in user sees the whole catalog.
*/

CREATE TABLE IF NOT EXISTS characters (
  id integer PRIMARY KEY,
  dex_number integer NOT NULL,
  catchphrase text NOT NULL DEFAULT '',
  name text NOT NULL,
  gender text NOT NULL DEFAULT '',
  species text NOT NULL DEFAULT '',
  height text NOT NULL DEFAULT '',
  job text NOT NULL DEFAULT '',
  keywords text[] NOT NULL DEFAULT '{}',
  personality text NOT NULL DEFAULT '',
  features text NOT NULL DEFAULT '',
  details text NOT NULL DEFAULT '',
  community text NOT NULL DEFAULT '',
  started_at date NOT NULL,
  is_public boolean NOT NULL DEFAULT true,
  thumbnail_url text,
  full_body_url text,
  growth_profiles jsonb NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON characters TO authenticated;

DROP POLICY IF EXISTS "authenticated_select_characters" ON characters;
CREATE POLICY "authenticated_select_characters" ON characters FOR SELECT
  TO authenticated USING (true);

INSERT INTO characters (id, dex_number, catchphrase, name, gender, species, height, job, keywords, personality, features, details, community, started_at, is_public, growth_profiles) VALUES
(1, 1, '새벽 세 시의 마지막 손님은 언제나 환영이에요.', '서하린', '여성', '인간', '162cm', '바텐더', ARRAY['미스터리','야간','츤데레'],
 '겉으로는 무심하지만 손님의 사소한 변화를 가장 먼저 알아채는 편입니다.',
 '은색 커프스를 늘 착용하며, 칵테일을 섞을 때 노래를 흥얼거리는 버릇이 있습니다.',
 '도시 외곽의 작은 바 "새벽 한 잔"의 주인입니다. 과거의 기억은 조금씩만 공개되고 있습니다.',
 '디스코드 숙의 서버', '2019-03-14', true,
 jsonb_build_array(
   jsonb_build_object('age', 17, 'profile', '고등학생 시절의 하린입니다. 아직 바텐더가 되기 전이라 은색 커프스 대신 낡은 팔찌를 차고 다녔습니다.', 'settings', '가게 "새벽 한 잔"에서 처음 일을 돕기 시작한 해입니다. 아버지에게 술장 열쇠를 물려받았습니다.'),
   jsonb_build_object('age', 25, 'profile', '가게를 물려받은 뒤의 모습입니다. 말투는 한결 부드러워졌지만 여전히 무심한 척을 합니다.', 'settings', '과거 기억의 첫 번째 단서가 공개되는 시기입니다. 단골손님 한 명과의 약속이 이야기의 실마리가 됩니다.'))),
(2, 2, '약속은 지키는 것, 그게 제 방식입니다.', '강도윤', '남성', '늑대인간', '189cm', '기사', ARRAY['판타지','기사','무뚝뚝'],
 '말수가 적고 진중하지만, 한 번 맡은 일은 끝까지 책임지는 성격입니다.',
 '달이 뜨는 밤이면 감각이 예민해지고, 허리에는 늘 낡은 검집을 차고 다닙니다.',
 '왕국 북부 국경을 지키는 기사단의 부단장입니다. 가문의 저주를 풀기 위해 동료를 찾고 있습니다.',
 '트위터(X) 숙의 계정', '2021-07-02', true,
 jsonb_build_array(
   jsonb_build_object('age', 16, 'profile', '견습 기사 시절의 도윤입니다. 아직 변신을 제대로 다루지 못해 달빛을 피해 다녔습니다.', 'settings', '기사단에 처음 들어간 해입니다. 훈련장에서 선배 기사에게 검을 배웠습니다.'),
   jsonb_build_object('age', 24, 'profile', '부단장이 된 후의 모습입니다. 흉터가 늘었고 말투에는 여전히 변함이 없습니다.', 'settings', '가문의 저주에 대한 첫 번째 실마리를 찾은 시기입니다.'))),
(3, 3, '오늘도 꽃이 피었어요, 같이 보실래요?', '루미엘', '여성', '천사', '158cm', '정원사', ARRAY['판타지','힐링','밝음'],
 '누구에게나 다정하고 긍정적이며, 작은 생명을 돌보는 일에 진심입니다.',
 '날개는 평소에 접혀 있지만 기분이 좋아지면 꽃잎이 함께 흩날립니다.',
 '하늘과 땅의 경계에 있는 작은 정원을 관리합니다. 길을 잃은 여행자에게 쉼터를 내어주곤 합니다.',
 '개인 블로그', '2020-01-20', true,
 jsonb_build_array(
   jsonb_build_object('age', 18, 'profile', '정원을 처음 맡았을 때의 루미엘입니다. 날개가 아직 자라는 중이라 자주 땅에 걸렸습니다.', 'settings', '정원의 첫 번째 꽃이 피던 날입니다. 여행자 한 명을 처음으로 쉬게 해 주었습니다.'))),
(4, 4, '사건은 사람이 만들고, 단서는 사람이 남깁니다.', '백지후', '남성', '인간', '178cm', '형사', ARRAY['미스터리','수사','냉철'],
 '감정을 잘 드러내지 않지만 사건 앞에서는 누구보다 집요하고 정직합니다.',
 '수첩에 모든 단서를 손글씨로 기록하며, 커피는 늘 블랙으로 마십니다.',
 '연쇄 실종 사건을 쫓던 중 자신과 연결된 흔적을 발견하고, 개인적으로 조사를 이어가고 있습니다.',
 '디스코드 숙의 서버', '2022-11-08', true, '[]'::jsonb),
(5, 5, '비밀은 가격표에 적혀 있어요.', '네로', '미상', '고양이 요괴', '131cm', '골동품 상인', ARRAY['코미디','요괴','장난꾸러기'],
 '장난기가 많고 말을 돌려서 하지만, 손해 보는 거래는 절대 하지 않습니다.',
 '꼬리 끝의 방울이 울리면 근처의 물건들이 제멋대로 움직입니다.',
 '물건에 깃든 기억을 거래하는 상점을 운영합니다. 진짜 이름은 아무에게도 알려주지 않았습니다.',
 '카카오톡 오픈채팅', '2023-05-30', false, '[]'::jsonb),
(6, 6, '접속 기록은 지워도 흔적은 남습니다.', '시온', '남성', '인간(개조)', '175cm', '해커', ARRAY['SF','해커','미스터리'],
 '차갑고 계산적이지만 약자가 억울한 일을 당하면 뒤에서 조용히 돕습니다.',
 '왼쪽 눈에 장착된 렌즈가 어두운 곳에서 희미하게 빛납니다.',
 '거대 기업의 비밀 데이터를 추적하다가 스스로도 알지 못했던 자신의 기록을 발견했습니다.',
 '텔레그램 채널', '2024-02-17', false, '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;
