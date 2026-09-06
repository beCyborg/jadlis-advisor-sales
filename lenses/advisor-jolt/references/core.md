# advisor-jolt — core principles, ranked by evidence

Layer: indecision / no decision. Source: The JOLT Effect (Dixon & McKenna, 2022), evidence ceiling `field-study`.
Ladder: `field-study` → `external-research` → `practitioner-n-many` → `practitioner-anecdote` → `assertion`.

Ceiling caveat that applies to every `field-study` line below: the study is a vendor-assembled,
machine-scored corpus of 2.5M recorded calls with 8,300+ tagged variables, self-reported and not
peer-reviewed; several figures were read off bar charts. These are correlations inside one corpus,
not causal identification, and the authors themselves note effects are combined and sometimes
competing. Treat every number as a direction with an order of magnitude, never as a coefficient.

---

## Tier 1 — rests on the call corpus (`field-study`)

**1. Two different diseases hide inside "no decision", and they take opposite treatments.**
Preference for the status quo (buyer does not want to change) and indecision (buyer wants to
change and cannot commit) split the inaction bucket roughly 44/56. Everything downstream depends
on getting this call right first. [JOLT:TWOFOE], [JOLT:SQTRIAGE]
*Strength:* the split is a measured corpus figure; the two-playbook prescription built on it is
the authors' synthesis, one rung weaker than the number itself.

**2. After the vision is conceded, fear-amplifying selling actively loses deals.**
Relitigating the status quo showed up on 73% of calls and tracked with a worse outcome 84% of the
time; perceived buyer effort ran about 3× typical when the seller did it. This is the single
strongest empirical claim in the tradition and the reason the phase handoff is a hard rule rather
than a style preference. [JOLT:PHASE-SWITCH], [JOLT:FEARCHOICE]
*Weakness:* "worse outcome" is a machine-scored construct, and the reverse-causation reading —
reps relitigate precisely on deals already going badly — is never tested.

**3. Taking a position beats staying neutral, and the effect is large.**
Proactive guidance: 18% → 44%. Personal advocacy: ~33% win rate when used against a 26% study
average. Diagnosis that ends in a recommendation converted at 36% versus 14% for open-ended
diagnosis with no recommendation. The lift grows with indecision level, not shrinks.
[JOLT:PROACTIVE-GUIDE], [JOLT:ADVOCACY], [JOLT:DIAGNOSE-THEN-REC], [JOLT:PREEMPT-REC]
*Weakness:* recommending is also what a confident seller does on a deal that is already going
well; the corpus cannot separate the behavior from the state that produces it.

**4. Setting a believable, deliberately conservative impact number outperforms selling the ceiling.**
20% → 51% win rate, and no expectation was set at all on 81% of calls — the largest gap between
value and usage in the dataset. [JOLT:SET-EXPECT], [JOLT:PRE-CLOSE-PLAN]

**5. Engineered downside protection converts outcome fear better than persuasion does.**
Downside-risk options moved win rate 22% → 46% and appeared on only 14% of calls; in transactional
motions the existing escape hatch was mentioned on under 15%. The blocker is seller belief (an
opt-out looks like weak confidence) and comp design (clawbacks), not buyer receptivity.
[JOLT:SAFETY-NET-ENGINEER], [JOLT:SAFETY-NET-SURFACE], [JOLT:PRO-SERV], [JOLT:START-SMALL]

**6. Unchaperoned buyer research is a loss mechanism, not diligence.**
Limiting the exploration converted at 42% versus 16% when research ran unmanaged. Objections were
stated on 69% of calls but rebutted on only 52%; closing calls with a rebuttal converted at 31%
versus 17%, and preemptive rebuttals at 40%. [JOLT:REBUT-EVERY], [JOLT:PREBUTTAL],
[JOLT:CANDOR-DECLINE], [JOLT:QUESTION-BEHIND-REQUEST], [JOLT:OWN-INFO-FLOW], [JOLT:SME-PREPCALL]

**7. Conversational dominance correlates with wins, within bands.**
Rep talk time 58% in wins versus 52% in losses; interruption/overtalk roughly 2× more frequent in
wins; silence in the 8–17% band tracked the best win rate, with both tails worse.
[JOLT:TALK-SHARE], [JOLT:COOP-OVERLAP], [JOLT:SILENCE-BAND], [JOLT:DEMO-PAUSE]
*Weakness:* the deltas are small (58 vs 52), the mechanism is asserted to be engagement rather
than dominance, and cooperative overlapping traces to popular-press linguistics, not to the data.

**8. Acting against your own short-term interest buys the delegate role.**
Recommending less than the buyer asked for, crediting a competitor, naming a missing capability
and saying "I don't know, I'll find out" are reported as high-performer behaviors that resolve the
principal–agent problem; claiming the product does everything tracks with skepticism and later
churn. [JOLT:NO-OVERBUY], [JOLT:COMP-CREDIT], [JOLT:GAP-ADMIT], [JOLT:DONT-KNOW]
*Note:* no isolated win-rate delta is reported for most of these — the tier rests on observation
frequency, not effect size.

**9. Indecision is near-universal and it is a seller-skill variable, not a market constant.**
Moderate-to-high indecision in 87% of opportunities; average performer versus JOLT seller at
moderate/high indecision, 26% versus 57% — the largest performance gap in the dataset. That gap is
the whole case for treating no-decision losses as coachable. [JOLT:LOSS-SPLIT], [JOLT:PERSKILLDIAG],
[JOLT:CHANNELPARITY]

**10. Channel changes how often the behaviors are used, not whether they work.**
Outbound complex sellers volunteered a recommendation 60–75% of the time versus 40–50% for inbound
peers, with comparable per-behavior impact. [JOLT:CHANNELPARITY], [JOLT:INBOUND-TRIAGE]

**11. Decidability is a qualification axis, and the best reps price it into the pipeline.**
High performers held fewer highly indecisive buyers and disqualified them disproportionately often
— but bounded at roughly 10–15% of potential buyers, which is the guardrail against using the lens
as an excuse. [JOLT:ABILITY-TO-DECIDE], [JOLT:CUT-FOR-INDECISION], [JOLT:DELAY-TYPING],
[JOLT:POWERFUL-REQUEST]

**12. "Let me think about it" is the worst signal on the board.**
Reported as the utterance most correlated with lost deals among tens of thousands isolated — worse
than an explicit no. Emotional register, not stated objection, is the detector. [JOLT:CODETECT]
*Weakness:* emotion markers came from NLP scoring; a human ear applying this to a single call is
using an instrument that was never validated at n=1.

---

## Tier 2 — borrowed from outside literature (`external-research`)

**13. The mechanism is omission bias plus loss aversion, not status-quo bias.**
Buyers prefer missing out to messing up because an error of commission is concrete, fast and
personally attributable while an error of omission is diffuse. Named sources: Samuelson &
Zeckhauser, Kahneman & Tversky (loss aversion at 2–3×), Ritov & Baron, Leach & Plaks.
This is the most solidly grounded claim in the whole lens — and it is imported, not discovered here.
[JOLT:TWOFOE], [JOLT:ADVOCACY]

**14. Three sources of indecision, and the source selects the play.**
Valuation problem → recommend. Lack of information → limit exploration. Outcome uncertainty →
de-risk. The tripartite structure replicates Germeijs & de Boeck (2003, 174 graduating seniors, a
course-choice study — not a purchasing one). [JOLT:SOURCE-TRIAGE]
*Weakness:* the transfer from student course choice to B2B committee purchasing is asserted.

**15. More options suppress action; binary filtering restores it.**
Iyengar & Lepper's jam study, Vanguard participation falling with fund count, 401(k) opt-in under
50% versus opt-out over 90%. Applied to sales as must-have filtering and default nudging — the
application is the authors' extrapolation. [JOLT:CHALK-FIELD], [JOLT:PROACTIVE-GUIDE],
[JOLT:ASK-BIZ]

**16. Consequence and time pressure amplify hesitation.**
Ladouceur's pill-sorting experiment: raising the stakes produced more hesitation and rechecking.
This is the empirical argument against your own exploding offers and discount deadlines.
[JOLT:EXACERBATOR-CHECK]

**17. Satisficers and maximizers behave differently at the moment of commitment.**
Simon, Schwartz et al., Roets et al.; a stated intent from a satisficer can flip to maximizer
behavior at signature, because intent is free and commitment is not.
[JOLT:GOOD-ENOUGH-DEBRIEF], [JOLT:SET-EXPECT]

---

## Tier 3 — the authors' consulting practice (`practitioner-n-many`)

**18. Binary call-audit checklists mismeasure the skill.**
Competency-level scoring and separating skill-auditors from compliance-auditors come from the
authors' work overhauling QA at many companies; the industry samples ~1% of call volume, which
makes any binary score noise. [JOLT:COMPETENCY-AUDIT], [JOLT:VOC-WINLOSS]

**19. Conversation-intelligence buying needs category-building, actionability and true TCO tests.**
Grounded in 100+ interviews with early adopters — and pointed at capabilities the authors state
only their own platform ships. Read as vendor-adjacent guidance. [JOLT:CI-DILIGENCE]

**20. Hiring profiles should be reverse-engineered from your own JOLT sellers, then demoted to an input.**
[JOLT:PROFILEAUDIT]

---

## Tier 4 — single stories (`practitioner-anecdote`)

**21. Anxiety localizes, and contracting can be shaped around the localized piece.**
Carve-outs, three-tier steering, pre-quote scope reduction and post-mortem-driven reading of
backtracking each rest on one leader's or one rep's account. Useful as pattern language; not
evidence. [JOLT:CARVE-OUT], [JOLT:THREE-TIER-STEER], [JOLT:SCOPE-DOWN-PREQUOTE],
[JOLT:BACKTRACK-FLAG], [JOLT:ASK-STRAIGHT], [JOLT:GOOD-ENOUGH-DEBRIEF], [JOLT:NONSALESPOOL],
[JOLT:PASTSHOPRISK], [JOLT:HUDDLE]

---

## Tier 5 — assertion only (say so out loud when using these)

**22. The 40–70 information heuristic** is a quoted leadership maxim, not a finding; the
percentages are rhetorical. [JOLT:P4070]

**23. The indecision scorecard and its 22-point threshold** carry no reported validation study,
though the underlying dimensions do come from the corpus. Never present the number as calibrated.
[JOLT:INDECISION-SCORECARD]

**24. Management and enablement prescriptions are unmeasured.** Manager brakes in pipeline review,
overlay positioning, normalizing analogies, interview content, role-play observation, EQ-weighted
assessments, loss-type splitting in QBRs, deal post-mortems and interaction-velocity reading are
all role prescriptions, several sourced to vendor research (Challenger, CEB/Gartner's 19% coaching
claim) rather than to this study. [JOLT:MGRBRAKES], [JOLT:OVERLAY], [JOLT:NORMALIZE],
[JOLT:INDECISIONINT], [JOLT:ROLEPLAYOBS], [JOLT:EQSCREEN], [JOLT:LOSS-SPLIT], [JOLT:OPP-RETRO],
[JOLT:VELOCITY-SIGNAL], [JOLT:COACH-MIDDLE]

---

## The operating loop, in one pass

1. Is the buyer against change, or for it and frozen? [JOLT:TWOFOE] — wrong answer here makes
   everything after it harmful.
2. If frozen: stop the phase-one toolkit entirely. [JOLT:PHASE-SWITCH]
3. Name the source — valuation / information / outcome. [JOLT:SOURCE-TRIAGE]
4. Run exactly one treatment: recommend, limit, or de-risk. Running all three is noise.
5. Ask for the business only after the treatment landed. [JOLT:ASK-BIZ]

Ethical guardrail the lens itself supplies but does not enforce: advocacy, defaults and must-have
filtering work by moving decision responsibility onto the seller. They are legitimate only when the
recommendation is genuinely the buyer's best option, the default is not simply the highest-margin
one, and the must-haves are not a redescription of your own differentiators. There is no test the
seller can fail here — that omission is a real gap, recorded in myths-and-demotions.md.
