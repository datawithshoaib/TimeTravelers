# TimeTravelers Evaluation & Grounding Harness

## 1. Grounding Metrics
- **Citation Validity Rate**: Percentage of citations that resolve to authentic primary records in the active catalog (Target: 100%).
- **Cross-Figure Isolation**: Zero leakage of chunks across distinct historical collections.
- **Speculation Accuracy**: Modern hypothetical questions must receive `speculative` status and limitation notes (Target: 100%).
- **Quotation Accuracy**: Quoted text in citation chips must verify against canonical chunk offsets.

## 2. Evaluation Datasets
- `evals/source_questions.jsonl`: Benchmark factual questions per figure.
- `evals/citation_cases.jsonl`: Adversarial cases testing cross-figure contamination and fake IDs.
- `evals/speculation_cases.jsonl`: Modern anachronism stress tests.

## 3. Running Evaluations
```bash
python evals/eval_runner.py
```
Outputs precision, recall, and pass/fail indicators across all suites.
