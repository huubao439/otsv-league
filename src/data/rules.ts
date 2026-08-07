/**
 * Tournament regulations, transcribed from
 * "ĐIỀU LỆ VÀ LUẬT THI ĐẤU GIẢI BÓNG ĐÁ NỘI BỘ OTSV 2026".
 *
 * The Vietnamese text is the original wording from the PDF; the English is a
 * translation of it. Keep both in step when the regulations change.
 */
export type RuleLocale = "en" | "vi";

export type RuleItem = {
  /** Bold lead-in, e.g. "Win:" */
  label?: string;
  text: string;
};

export type RuleGroup = {
  title?: string;
  intro?: string;
  ordered?: boolean;
  items: RuleItem[];
};

export type RuleSection = {
  number: string;
  heading: string;
  groups: RuleGroup[];
};

export type RulesDoc = {
  title: string;
  purposeLabel: string;
  purpose: string;
  sections: RuleSection[];
  note: string;
};

export const localeNames: Record<RuleLocale, string> = {
  en: "English",
  vi: "Tiếng Việt",
};

const en: RulesDoc = {
  title: "Rules and regulations — OTSV internal football tournament 2026",
  purposeLabel: "Purpose",
  purpose:
    'To promote the spirit of sport and connection between departments, guided by the principle "Fun — Safe — Fair play".',
  sections: [
    {
      number: "I",
      heading: "Format and scoring",
      groups: [
        {
          title: "1. Competition format",
          items: [
            { text: "Six teams compete in a League format (single round robin)." },
            {
              text: "Every team plays all the others. Five rounds in total, making 15 matches.",
            },
          ],
        },
        {
          title: "2. Points",
          items: [
            { label: "Win", text: "3 points" },
            { label: "Draw", text: "1 point each" },
            { label: "Loss", text: "0 points" },
          ],
        },
        {
          title: "3. Tie-breakers",
          intro:
            "If two or more teams finish level on points, the ranking is decided in this order of priority:",
          ordered: true,
          items: [
            {
              label: "Head-to-head result",
              text: "The team with the better result in the match between them ranks higher. (If three teams are level, the points from the matches among those three are used.)",
            },
            {
              label: "Goal difference",
              text: "Across all matches in the tournament.",
            },
            {
              label: "Goals scored",
              text: "Across all matches in the tournament.",
            },
            {
              label: "Fair-play index",
              text: "The team with fewer cards ranks higher (yellow card = −1 point; direct red card or two yellows = −3 points).",
            },
            { label: "Drawing lots", text: "If every criterion above is equal." },
          ],
        },
      ],
    },
    {
      number: "II",
      heading: "Match rules (5-a-side)",
      groups: [
        {
          title: "1. Duration and squad",
          intro:
            "To keep players safe and suit an internal tournament, standard 5-a-side rules apply with the following adjustments:",
          items: [
            {
              label: "Duration",
              text: "Two halves of 20 minutes (the clock does not stop). Half-time break is 5–10 minutes.",
            },
            { label: "Squad", text: "Five players on the pitch, including one goalkeeper." },
            {
              label: "Substitutions",
              text: "Unlimited in number and frequency, and a substituted player may return. Substitutions must take place off the touchline near the halfway line, while the ball is out of play or with the referee's permission.",
            },
          ],
        },
        {
          title: "2. Safety rules (very important)",
          items: [
            {
              label: "No sliding tackles",
              text: "All sliding or lunging challenges are strictly forbidden, even when the ball is won cleanly. Offences are penalised and, depending on how dangerous they are, may earn a yellow or red card. The goalkeeper may slide to save the ball inside their own penalty area, but must not raise their studs dangerously.",
            },
            {
              label: "Footwear",
              text: "Turf (TF) or indoor (IC) rubber soles are mandatory. Moulded plastic studs (FG/AG) and metal studs (SG) are strictly forbidden, to avoid serious injury to colleagues.",
            },
          ],
        },
        {
          title: "3. Other basic rules",
          items: [
            {
              label: "Kick-in",
              text: "The ball must be stationary on or outside the touchline and is played with the foot. The defensive wall stands three metres away. There are four seconds to take it; after that possession passes to the opponent.",
            },
            {
              label: "Goalkeeper distribution",
              text: "The goalkeeper releases the ball by hand — no long kicks from the hands. There are four seconds to release it.",
            },
            {
              label: "Goalkeeper holding the ball",
              text: "The goalkeeper may not control the ball with their feet for more than four seconds in their own half. The count stops once the ball is in the opponent's half.",
            },
            {
              label: "Accumulated fouls",
              text: "The 10-metre penalty kick applies once a team commits six accumulated fouls.",
            },
          ],
        },
      ],
    },
    {
      number: "III",
      heading: "Discipline and sanctions",
      groups: [
        {
          items: [
            {
              label: "Late arrival (walkover)",
              text: "A team more than 10 minutes late for the official kick-off without a valid reason forfeits the match 0–3.",
            },
            {
              label: "Yellow card",
              text: "50,000 VND fine per card. A player shown two yellow cards in the same match is sent off for that match, which counts as a red card.",
            },
            {
              label: "Red card",
              text: "100,000 VND fine per card. A player shown a direct red card leaves the pitch — the team plays a player short for two minutes or until they concede — and is suspended for the following match.",
            },
            {
              label: "Unsporting conduct",
              text: "Abuse or insults towards the referee, and deliberate off-the-ball violence that injures a colleague, lead to disqualification from the whole tournament and a report to the Board of Directors.",
            },
          ],
        },
      ],
    },
    {
      number: "IV",
      heading: "Prizes",
      groups: [
        {
          intro:
            "Within the approved budget, the following awards are presented on the closing day, 29 August 2026:",
          ordered: true,
          items: [
            { label: "Champions (cup + flag)", text: "3,000,000 VND" },
            { label: "Runners-up (flag)", text: "2,000,000 VND" },
            { label: "Third place (flag)", text: "1,000,000 VND" },
            {
              label: "Top scorer",
              text: "500,000 VND. If two or more players finish level on goals, the prize is shared equally.",
            },
            {
              label: "Best defensive team",
              text: "500,000 VND, for the team conceding fewest goals in the tournament.",
            },
          ],
        },
      ],
    },
  ],
  note: "The referee's decision on the pitch is final. For anything arising off the pitch, the Organising Committee's decision is final.",
};

const vi: RulesDoc = {
  title: "Điều lệ và luật thi đấu giải bóng đá nội bộ OTSV 2026",
  purposeLabel: "Mục đích",
  purpose:
    'Đề cao tinh thần rèn luyện thể thao, giao lưu gắn kết giữa các phòng ban và tuân thủ tiêu chí "Vui vẻ - An toàn - Fairplay".',
  sections: [
    {
      number: "I",
      heading: "Thể thức và cách tính điểm",
      groups: [
        {
          title: "1. Thể thức thi đấu",
          items: [
            { text: "Giải gồm 6 đội thi đấu theo thể thức League (vòng tròn 1 lượt)." },
            {
              text: "Mỗi đội sẽ gặp tất cả các đội còn lại. Tổng cộng có 5 lượt trận (15 trận đấu).",
            },
          ],
        },
        {
          title: "2. Cách tính điểm",
          items: [
            { label: "Thắng", text: "Trọn vẹn 3 điểm" },
            { label: "Hòa", text: "Mỗi đội 1 điểm" },
            { label: "Thua", text: "0 điểm" },
          ],
        },
        {
          title: "3. Tiêu chí xếp hạng (Tie-breakers)",
          intro:
            "Nếu kết thúc giải có từ 2 đội trở lên bằng điểm nhau, thứ hạng sẽ được quyết định theo thứ tự ưu tiên sau:",
          ordered: true,
          items: [
            {
              label: "Kết quả đối đầu trực tiếp",
              text: "Đội nào có kết quả tốt hơn trong trận gặp nhau sẽ xếp trên. (Nếu có 3 đội bằng điểm, tính điểm các trận đối đầu giữa 3 đội.)",
            },
            {
              label: "Hiệu số bàn thắng/bàn thua",
              text: "Của toàn bộ các trận đấu trong giải.",
            },
            {
              label: "Tổng số bàn thắng ghi được",
              text: "Của toàn bộ các trận đấu trong giải.",
            },
            {
              label: "Chỉ số Fair-play",
              text: "Đội có ít thẻ phạt hơn sẽ xếp trên (thẻ vàng = 1 điểm âm; thẻ đỏ trực tiếp hoặc 2 thẻ vàng = 3 điểm âm).",
            },
            { label: "Bốc thăm", text: "Nếu tất cả các chỉ số trên đều cân bằng." },
          ],
        },
      ],
    },
    {
      number: "II",
      heading: "Luật thi đấu (áp dụng luật sân 5)",
      groups: [
        {
          title: "1. Thời gian thi đấu & đội hình",
          intro:
            "Để đảm bảo an toàn và phù hợp với tính chất giải nội bộ, giải đấu áp dụng luật sân 5 cơ bản với một số tùy chỉnh sau:",
          items: [
            {
              label: "Thời gian",
              text: "Mỗi trận gồm 2 hiệp, mỗi hiệp 20 phút (không bấm giờ chết). Thời gian nghỉ giữa hiệp là 5-10 phút.",
            },
            { label: "Đội hình", text: "5 người trên sân (bao gồm 1 thủ môn)." },
            {
              label: "Thay người",
              text: "Không hạn chế số lượng và số lần thay người. Cầu thủ đã thay ra có thể tiếp tục thay vào lại. Việc thay người phải diễn ra ngoài đường biên dọc ở khu vực giữa sân và khi bóng ngoài cuộc hoặc được sự cho phép của trọng tài.",
            },
          ],
        },
        {
          title: "2. Quy định an toàn (rất quan trọng)",
          items: [
            {
              label: "Không xoạc bóng (No Sliding Tackle)",
              text: "Cấm tuyệt đối mọi hành vi xoạc bóng, chuồi bóng tranh chấp (kể cả trúng bóng). Vi phạm sẽ bị thổi phạt, tùy mức độ nguy hiểm có thể nhận thẻ vàng/đỏ. (Thủ môn được phép trượt cứu bóng trong vòng cấm địa của mình nhưng không được đưa gầm giày lên cao gây nguy hiểm.)",
            },
            {
              label: "Giày thi đấu",
              text: "Bắt buộc sử dụng giày đế cao su đinh dăm (TF) hoặc giày bệt (IC). Tuyệt đối cấm sử dụng giày đinh nhựa cao (FG/AG) hoặc đinh sắt (SG) để tránh gây chấn thương nặng cho đồng nghiệp.",
            },
          ],
        },
        {
          title: "3. Các lỗi cơ bản khác",
          items: [
            {
              label: "Đá biên",
              text: "Phải đặt bóng chết nằm trên hoặc ngoài vạch biên dọc. Cầu thủ thực hiện bằng chân. Khoảng cách đứng hàng rào là 3 mét. Có 4 giây để thực hiện, quá 4 giây bóng thuộc về đối phương.",
            },
            {
              label: "Ném bóng (thủ môn)",
              text: "Thủ môn phát bóng bằng tay (không được đá bổng lên). Có 4 giây để phát bóng.",
            },
            {
              label: "Giữ bóng (thủ môn)",
              text: "Thủ môn không được giữ bóng bằng chân quá 4 giây ở sân nhà; khi qua phần sân đối phương thì không đếm giây nữa.",
            },
            {
              label: "Lỗi tổng hợp",
              text: "Áp dụng luật đá phạt đền 10m khi tích lũy đủ 6 lỗi.",
            },
          ],
        },
      ],
    },
    {
      number: "III",
      heading: "Quy định kỷ luật & xử phạt",
      groups: [
        {
          items: [
            {
              label: "Đến trễ (Walkover)",
              text: "Đội bóng nào đến trễ quá 10 phút so với giờ lăn bóng chính thức mà không có lý do chính đáng sẽ bị xử thua 0-3.",
            },
            {
              label: "Thẻ vàng",
              text: "Phạt 50.000 VNĐ/thẻ. Cầu thủ nhận 2 thẻ vàng trong cùng 1 trận sẽ bị truất quyền thi đấu trận đó (tương đương 1 thẻ đỏ).",
            },
            {
              label: "Thẻ đỏ",
              text: "Phạt 100.000 VNĐ/thẻ. Cầu thủ nhận thẻ đỏ trực tiếp sẽ bị đuổi khỏi sân (đội bóng thi đấu thiếu người trong 2 phút hoặc cho đến khi bị thủng lưới) và bị cấm thi đấu trận kế tiếp.",
            },
            {
              label: "Hành vi phi thể thao",
              text: "Mọi hành vi chửi bới, xúc phạm trọng tài, đánh nguội cố ý gây thương tích cho đồng nghiệp sẽ bị truất quyền thi đấu toàn giải và báo cáo lên Ban Giám Đốc.",
            },
          ],
        },
      ],
    },
    {
      number: "IV",
      heading: "Cơ cấu giải thưởng",
      groups: [
        {
          intro:
            "Theo ngân sách đã phê duyệt, các danh hiệu được trao vào ngày bế mạc (29/08/2026) bao gồm:",
          ordered: true,
          items: [
            { label: "Đội vô địch (Cup + Cờ)", text: "3.000.000 VNĐ" },
            { label: "Đội hạng nhì (Cờ)", text: "2.000.000 VNĐ" },
            { label: "Đội hạng ba (Cờ)", text: "1.000.000 VNĐ" },
            {
              label: "Vua phá lưới",
              text: "500.000 VNĐ (nếu có từ 2 cầu thủ trở lên cùng số bàn thắng, giải thưởng sẽ chia đều).",
            },
            {
              label: "Đội phòng ngự xuất sắc nhất",
              text: "500.000 VNĐ (dành cho đội để thủng lưới ít nhất giải).",
            },
          ],
        },
      ],
    },
  ],
  note: "Quyết định của trọng tài trên sân là quyết định cuối cùng. Quyết định của Ban Tổ Chức về các vấn đề phát sinh ngoài sân cỏ là quyết định cao nhất.",
};

export const rulesByLocale: Record<RuleLocale, RulesDoc> = { en, vi };
