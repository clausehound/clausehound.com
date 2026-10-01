# Claims to measure

Every number or performance claim on clausehound.com, and a test we can run
ourselves to back it. Run against a staging deployment that matches a real
client deployment, not a laptop. Record the hardware, the commit and the date
with every result, so the numbers can be rerun and quoted honestly.

Until a claim has a result here, the site keeps it qualitative or marks it as
illustrative.

| # | Claim on the site | Section | Status |
|---|---|---|---|
| 1 | "Answers come back in milliseconds" | Architecture: Speed | Unmeasured |
| 2 | "A full deployment runs comfortably on modest servers" / "tiny hosting bill" | Architecture: Speed | Unmeasured |
| 3 | Token bars: Clausehound vs pasting the Act into the prompt | Architecture | Illustrative |
| 4 | "Less to read, less to get wrong" | Architecture: Guardrails | Unmeasured |
| 5 | "Citations are checked… flagged, not passed through" | Verification | Confirm the feature, then measure |
| 6 | "400+ statutes and regulations" | Knowledge base | Placeholder |
| 7 | "84 versions of the ESA", "71 consolidations of the Insurance Act" | Knowledge base | Re-verify |
| 8 | "Diffs in the browser… documents with thousands of clauses" | Architecture / app | Unmeasured |
| 9 | "A deployment of your own" (per-client instances) | Integrations / contact | Unmeasured |

---

## 1. Query latency

**Claim:** answers come back in milliseconds.

**Test:** load-test the MCP endpoint and the GraphQL endpoint with a fixed,
realistic query mix.

- MCP tools: `find_statutes`, `list_statute_versions`, `search_statute_text`,
  `compare_statute_versions` (use a statute with many versions, e.g. ESA
  `00e41`).
- GraphQL: `contract` with versions and clusters, `searchAnalysisWorkspace`.
- Tool: `oha` or `k6`. Warm up for 1 minute, then run 1,000+ requests at
  1, 10 and 50 concurrent clients.
- Measure server time and end-to-end time separately (client in the same
  region as the server).

**Report:** p50 / p95 / p99 latency per call type and concurrency, plus error
rate. Quote p50 and p95 on the site; never quote the best case.

| Call | Concurrency | p50 | p95 | p99 | Errors |
|---|---|---|---|---|---|
| | | | | | |

## 2. Hosting footprint and cost

**Claim:** a full deployment runs on modest servers; hosting is cheap.

**Test:**
- Deploy one client instance (GraphQL service, MySQL, nginx, PDF/OCR) on the
  smallest droplet size we'd actually sell.
- Record idle RSS memory and CPU for each container (`docker stats`).
- Run the test 1 mix and find the sustained requests per second before p95
  doubles.
- Price it: the monthly cost of that deployment at list prices.

**Report:** "A client deployment runs on a [N vCPU / N GB] server, about
$[X]/month, and sustains [N] requests/second at p95 under [N] ms."

| Container | Idle RSS | Idle CPU | Peak RSS | Peak CPU |
|---|---|---|---|---|
| | | | | |

## 3. Token cost per question

**Claim:** agents use far fewer tokens through Clausehound than by reading
the source documents.

**Test:**
- Write a question set of 20 to 30 real Canadian questions, with a lawyer.
  Mix point-in-time ("what changed between X and Y"), lookup ("what's the
  retention period for…") and cross-jurisdiction ("compare ON and BC on…").
- **Baseline A:** paste the relevant source documents (the full consolidations
  needed to answer) into the prompt, then ask.
- **Baseline B:** the model with no documents and no tools, from memory.
- **Clausehound:** the same model, with the Clausehound MCP server connected.
- Count input and output tokens for the whole conversation, including tool
  results. Use the model provider's token counts, not estimates.
- Same model and settings for every arm.

**Report:** median and total tokens per question for each arm, and cost per
question at list price. This replaces the illustrative bars, which should then
show the real ratio.

| Question | A tokens | B tokens | Clausehound tokens | A cost | Clausehound cost |
|---|---|---|---|---|---|
| | | | | | |

## 4. Accuracy and hallucinated citations

**Claim:** less to read means less to get wrong; answers are grounded.

**Test:** use the test 3 question set and arms. A lawyer grades every answer
blind, without knowing which arm produced it.

- **Answer correct:** yes / partly / no, against a lawyer-written answer key.
- **Citations real:** every cited section exists.
- **Citations right:** every cited section is in the version in force on the
  date asked about, and says what the answer claims.
- **Fabrications:** count of citations to sections or cases that don't exist.

**Report:** correct-answer rate, citation precision (real and right / all
citations), and fabrications per 100 answers, for each arm. The headline is
the fabrication rate with and without Clausehound.

| Arm | Correct | Partly | Wrong | Citation precision | Fabrications /100 |
|---|---|---|---|---|---|
| A: documents in prompt | | | | | |
| B: memory only | | | | | |
| Clausehound | | | | | |

## 5. Citation-check guardrail

**Claim:** a section the model cites has to exist in the version in force on
the date asked about; if it doesn't, the answer is flagged.

**First confirm the feature exists and how it reports.** If it doesn't yet,
change the site copy or build it before launch.

**Test:**
- Build a set of 100 citations: 50 real and in force, 25 real but not in force
  on the date (repealed or added later), and 25 fabricated (sections or
  statutes that don't exist).
- Run each through the check.

**Report:** detection rate (bad citations flagged / all bad citations), split
into "not in force" and "fabricated", and the false-flag rate on good
citations.

| Set | Count | Flagged | Missed | Detection rate |
|---|---|---|---|---|
| Real, in force | 50 | | | (false flags) |
| Real, not in force | 25 | | | |
| Fabricated | 25 | | | |

## 6. Corpus size

**Claim:** "400+ statutes and regulations" (placeholder), federal and seven
provinces plus municipal.

**Test:** count in the production database.
- Documents by type (statute, regulation, bylaw, contract) and jurisdiction.
- Versions in total, and the median and maximum versions per statute.
- Clauses in total.
- Subject-area coverage (tag groups).

**Report:** replace the placeholder with the real counts, e.g. "[N] statutes
and regulations across [N] jurisdictions, [N] versions, [N] clauses". Rerun
quarterly and update the site.

| Jurisdiction | Statutes | Regulations | Versions | Clauses |
|---|---|---|---|---|
| | | | | |

## 7. Version counts quoted on the site

**Claim:** 84 versions of Ontario's ESA since 2002; 71 consolidations of
Ontario's Insurance Act.

**Test:** `list_statute_versions` for each, against production. Note the
earliest and latest version dates.

**Report:** the count and date range. Update the site if either has changed.

| Statute | Versions | Earliest | Latest |
|---|---|---|---|
| ESA, 2000 (`00e41`) | | | |
| Insurance Act (R.S.O. 1990, c. I.8) | | | |

## 8. Diff performance in the browser

**Claim:** version diffs run in the browser via WebAssembly and stay
responsive on large documents.

**Test:** in a mid-range laptop's Chrome, diff two versions of documents with
roughly 100, 1,000 and 5,000 clauses. Measure diff time and main-thread
blocking (Performance panel, or `performance.now()` around the call).

**Report:** diff time per size, and whether the UI ever blocks for more than
100 ms.

| Clauses | Diff time | Longest main-thread block |
|---|---|---|
| 100 | | |
| 1,000 | | |
| 5,000 | | |

## 9. New client deployment

**Claim:** each client gets a deployment of its own, at its own endpoint.

**Test:** stand up a fresh client instance from scratch with
`compose.standalone.yaml` (or the production path), through to a working MCP
endpoint with the base corpus loaded.

**Report:** wall-clock time from nothing to first successful tool call, and
the manual steps it took. Useful for the sales conversation too.

| Step | Time | Manual? |
|---|---|---|
| | | |

---

## When a result is in

1. Fill in the table above, with date, commit and hardware.
2. Update the site copy with the real number, and remove the "Illustrative"
   label or the placeholder.
3. Keep the raw data (load-test output, graded answer sheets) next to this
   file, so the claim can be checked later.
