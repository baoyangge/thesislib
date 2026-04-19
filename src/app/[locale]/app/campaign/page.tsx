export const dynamic = "force-dynamic";
import { getLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import { requireUser } from "@/lib/auth";

const CONTENT = {
  zh: {
    title: "Fault期刊有奖征稿",
    subtitle: "失败不是终点，让“非完美数据”被看见",
    paragraphs: [
      "那些做坏了的实验、没跑通的数据、反常的结果，真的只能躺在文件夹里吃灰吗？",
      "未必。",
      "你以为是失败，也许正是别人少走弯路的关键；你以为不够漂亮的结果，或许正隐藏着真正有价值的信息。",
      "Fault Journal 正式开启有奖征稿活动。我们诚挚邀请你分享：错误数据、异常结果、失败实验，以及那些曾被忽视、却值得被看见的研究经验。在这里，失败不是终点，而是让科研更真实、更完整、更有启发的开始。"
    ],
    awards: {
      title: "奖项设置",
      items: [
        { icon: "🥇", text: "一等奖 1 名：200 USD" },
        { icon: "🥈", text: "二等奖 1 名：100 USD" },
        { icon: "🥉", text: "三等奖 3 名：50 USD" }
      ]
    },
    period: {
      title: "征稿时间",
      text: "本次征稿活动将于4月11日正式开启，持续时间暂定为1个月。该活动将在小红书，ins，x上同时开启。",
      note: "（活动截止时间后续可能根据实际情况调整，具体请以官方最终通知为准。）"
    },
    criteria: {
      title: "评比规则",
      desc: "本次活动将组织评审组对来稿进行综合评议，重点从以下五个方面进行考察：",
      items: [
        { name: "1. 思路可行性", desc: "考察作者对问题的分析是否合理，对实验失败或异常结果的解释是否具备逻辑依据，提出的改进思路或后续方向是否具有现实可行性。" },
        { name: "2. 表达清晰度", desc: "考察文章在结构安排、语言表达和逻辑呈现上是否清楚明确，是否能够准确传达研究背景、实验过程、结果特征及核心观点。" },
        { name: "3. 完整性", desc: "考察投稿是否包含较完整的信息链条，包括研究背景、实验目的、方法过程、结果描述、问题分析与经验总结，从而具备较强的参考价值。" },
        { name: "4. 创新性", desc: "考察投稿内容在研究问题、失败现象、异常结果或解释视角上是否具有一定的新颖性，能否为相关领域提供新的观察与思考。" },
        { name: "5. 实验量", desc: "考察投稿是否建立在相对充分的实验基础之上，是否能够体现连续性的尝试、对比或重复验证，以及作者在研究过程中的实际投入。" }
      ]
    },
    review: {
      title: "评审说明",
      text: "评审结果将基于上述五项指标进行综合评定。"
    },
    footer: [
      "请让每一次没有成功的尝试，都有机会成为推动研究前进的一步。",
      "欢迎投稿，也欢迎转发给身边正在做科研的朋友。"
    ]
  },
  en: {
    title: "Fault Journal Awarded Call for Papers",
    subtitle: "Failure is not the end, let imperfect data be seen",
    paragraphs: [
      "Do failed experiments, unusable datasets, and anomalous results really deserve to remain unseen in forgotten folders?",
      "We believe they do not.",
      "What may seem like failure can help others avoid the same mistakes. What appears to be an imperfect result may still contain valuable insight.",
      "Fault Journal is now accepting submissions for its award competition. We invite researchers to share failed experiments, anomalous results, problematic datasets, and overlooked research experiences that deserve greater visibility. At Fault Journal, failure is not the end of research, but part of what makes research more honest, complete, and enlightening."
    ],
    awards: {
      title: "Awards",
      items: [
        { icon: "🥇", text: "First Prize: 1 award, USD 200" },
        { icon: "🥈", text: "Second Prize: 1 award, USD 100" },
        { icon: "🥉", text: "Third Prize: 3 awards, USD 50 each" }
      ]
    },
    period: {
      title: "Submission Period",
      text: "The call will officially open on April 11, and the submission period is tentatively set for one month. The call will be launched simultaneously on Xiaohongshu, Instagram, and X.",
      note: "(Please note that the submission deadline may be adjusted as needed. Any updates will be announced through official channels.)"
    },
    criteria: {
      title: "Evaluation Criteria",
      desc: "Submissions will be reviewed by the editorial review committee on the basis of the following five criteria:",
      items: [
        { name: "1. Feasibility of Reasoning", desc: "Whether the analysis is logical and well grounded, and whether the proposed explanations, improvements, or future directions are realistically feasible." },
        { name: "2. Clarity of Presentation", desc: "Whether the submission is clearly written, well organized, and effective in communicating the research background, process, results, and key ideas." },
        { name: "3. Completeness", desc: "Whether the submission provides a sufficiently complete account of the study, including background, objectives, methods, results, analysis, and reflection." },
        { name: "4. Originality", desc: "Whether the submission offers a novel question, observation, failed outcome, anomalous result, or interpretive perspective that may contribute new insight." },
        { name: "5. Experimental Scope", desc: "Whether the submission reflects substantial experimental effort, including sustained attempts, comparisons, or repeated validation." }
      ]
    },
    review: {
      title: "Review Note",
      text: "Final decisions will be based on a comprehensive evaluation of the five criteria above."
    },
    footer: [
      "Let every unsuccessful attempt have the chance to become a meaningful step forward for research.",
      "We welcome your submission and encourage you to share this call with fellow researchers."
    ]
  },
  ja: {
    title: "Fault Journal 懸賞付き論文募集のお知らせ",
    subtitle: "失敗は終わりではない、「不完全なデータ」にも光を",
    paragraphs: [
      "失敗してしまった実験、期待どおりに進まなかったデータ、あるいは予想に反する結果は、ただフォルダの中に眠らせておくしかないのでしょうか。",
      "必ずしもそうとは限りません。",
      "あなたが「失敗」だと考えたものが、他の研究者にとっては同じ遠回りを避けるための重要な手がかりになるかもしれません。また、一見すると十分に整っていない結果の中にこそ、本当に価値ある知見が含まれている可能性があります。",
      "Fault Journal では、このたび懸賞付き論文募集を実施いたします。本募集では、誤ったデータ、異常な結果、失敗した実験、そしてこれまで十分に注目されてこなかったものの、共有する意義のある研究上の経験について、広く原稿を募集します。私たちは、失敗を研究の終わりではなく、研究をより誠実に、より完全に、そしてより示唆に富んだものにするための出発点として捉えています。"
    ],
    awards: {
      title: "賞金",
      items: [
        { icon: "🥇", text: "最優秀賞：1名 200 USD" },
        { icon: "🥈", text: "優秀賞：1名 100 USD" },
        { icon: "🥉", text: "三等賞：3名 各50 USD" }
      ]
    },
    period: {
      title: "募集期間",
      text: "本募集は4月11日より正式に開始し、募集期間は暫定的に1か月間を予定しております。また、本企画は小紅書、Instagram、X において同時に開始されます。",
      note: "（なお、募集締切は今後の状況に応じて変更となる場合があります。最新の情報につきましては、公式からの最終案内をご確認ください。）"
    },
    criteria: {
      title: "審査基準",
      desc: "応募原稿は、審査委員会による総合的な審査のもと、主に以下の5つの観点から評価されます。",
      items: [
        { name: "1．考察の実現可能性", desc: "問題に対する分析が妥当であるか、失敗した実験や異常結果に関する説明に十分な論理的根拠があるか、また改善案や今後の研究の方向性に現実的な実現可能性が認められるかを評価します。" },
        { name: "2．記述の明確さ", desc: "構成、表現、論理展開が明瞭であり、研究背景、実験過程、結果の特徴、および中心となる主張が的確に伝えられているかを評価します。" },
        { name: "3．内容の完整性", desc: "研究背景、研究目的、方法、結果、問題分析、考察および振り返りを含め、一連の情報が比較的完整に示されており、読者にとって十分な参考価値を有しているかを評価します。" },
        { name: "4．独創性", desc: "研究課題、失敗事例、異常結果、あるいはその解釈の視点に一定の新規性があるか、関連分野に新たな観察や考察をもたらす内容であるかを評価します。" },
        { name: "5．実験量", desc: "投稿内容が相応の実験的蓄積に基づいているか、継続的な試行、比較、再検証などが含まれているか、また研究過程における実際の取り組みが十分に反映されているかを評価します。" }
      ]
    },
    review: {
      title: "審査について",
      text: "審査結果は、上記5項目に基づく総合評価により決定されます。"
    },
    footer: [
      "成功に至らなかった一つひとつの試みが、研究を前へ進める一歩となることを願っています。",
      "皆さまからのご投稿を心よりお待ちしております。あわせて、研究に携わるご友人やご同僚にもぜひご周知ください。"
    ]
  }
};

export default async function CampaignPage() {
  const user = await requireUser();
  const dateStr = new Date().toISOString().split("T")[0];
  
  // Get locale or fallback to zh
  let locale = await getLocale();
  if (!CONTENT[locale as keyof typeof CONTENT]) {
    locale = "zh";
  }
  const content = CONTENT[locale as keyof typeof CONTENT];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar user={user} />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <article className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-blue-50 border-b border-slate-200 p-8">
            <div className="text-sm font-semibold text-blue-600 mb-2 tracking-wider">OFFICIAL ANNOUNCEMENT</div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-4 leading-snug">
              {content.title}
            </h1>
            <p className="text-lg text-blue-800 font-medium mb-4">{content.subtitle}</p>
            <div className="text-slate-500 text-sm">Date: {dateStr}</div>
          </div>
          
          <div className="p-8 text-slate-700 leading-relaxed space-y-6 text-lg">
            {content.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "font-medium text-slate-900" : ""}>
                {p}
              </p>
            ))}

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 my-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">{content.awards.title}</h3>
              <ul className="space-y-2 mb-6 font-medium">
                {content.awards.items.map((item, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-2xl mr-3">{item.icon}</span>
                    <span className="text-blue-600 ml-1">{item.text}</span>
                  </li>
                ))}
              </ul>
              
              <div className="text-sm text-slate-600">
                <p><strong>{content.period.title}：</strong>{content.period.text}</p>
                <p className="mt-1 italic">{content.period.note}</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{content.criteria.title}</h3>
              <p className="mb-4">{content.criteria.desc}</p>
              <div className="space-y-4">
                {content.criteria.items.map((item, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-1">{item.name}</h4>
                    <p className="text-base">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50/50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-bold text-slate-900 mb-2">{content.review.title}</h4>
              <p className="text-base">{content.review.text}</p>
            </div>

            <div className="text-center mt-12 space-y-4">
              <p className="font-medium text-blue-900 text-xl py-4">
                {content.footer[0]}
              </p>
              <p className="text-slate-500">
                {content.footer[1]}
              </p>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
