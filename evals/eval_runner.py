import json
import os
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.api.app.persona.composer import persona_composer
from services.api.app.retrieval.engine import retrieval_engine
from services.api.app.grounding.validator import grounding_validator
from services.api.app.sources.catalog import get_chunks_for_figure


def run_source_questions_eval():
    print("\n--- Running Evaluation: Grounded Source Questions ---")
    dataset_path = Path(__file__).parent / "source_questions.jsonl"
    passed = 0
    total = 0

    with open(dataset_path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            case = json.loads(line)
            total += 1
            ans = persona_composer.compose_response(
                figure_id=case["figure_id"],
                query=case["query"],
                conversation_id=f"eval_{case['id']}"
            )

            # Check that citations point to expected source
            cited_sources = [c.source_id for seg in ans.segments for c in seg.citations]
            full_text = " ".join([s.text for s in ans.segments])
            has_must_include = all(phrase.lower() in full_text.lower() for phrase in case.get("must_include", []))

            source_match = case["expected_source_id"] in cited_sources
            if source_match and has_must_include:
                passed += 1
                print(f"  [PASS] {case['id']}: {case['query'][:50]}... -> Grounded with {case['expected_source_id']}")
            else:
                print(f"  [FAIL] {case['id']}: missing source or phrase match")

    rate = (passed / total) * 100 if total > 0 else 0
    print(f"Result: {passed}/{total} ({rate:.1f}%) grounded questions passed.")
    return passed == total


def run_speculation_eval():
    print("\n--- Running Evaluation: Modern Hypothetical Speculation Cases ---")
    dataset_path = Path(__file__).parent / "speculation_cases.jsonl"
    passed = 0
    total = 0

    with open(dataset_path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            case = json.loads(line)
            total += 1
            ans = persona_composer.compose_response(
                figure_id=case["figure_id"],
                query=case["query"],
                conversation_id=f"eval_{case['case_id']}"
            )

            statuses = [s.evidence_status for s in ans.segments]
            is_labeled_speculation = "speculation" in statuses and (ans.overall_status in ["speculative", "mixed"])
            has_limitation = ans.limitation_note is not None

            if is_labeled_speculation and has_limitation:
                passed += 1
                print(f"  [PASS] {case['case_id']}: {case['query'][:50]}... -> Labeled Speculative")
            else:
                print(f"  [FAIL] {case['case_id']}: failed to label speculation")

    rate = (passed / total) * 100 if total > 0 else 0
    print(f"Result: {passed}/{total} ({rate:.1f}%) speculation cases passed.")
    return passed == total


def run_citation_isolation_eval():
    print("\n--- Running Evaluation: Cross-Figure and Fabricated Citations ---")
    dataset_path = Path(__file__).parent / "citation_cases.jsonl"
    passed = 0
    total = 0

    with open(dataset_path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            case = json.loads(line)
            total += 1

            if "forbidden_figure" in case:
                # Query figure A and ensure figure B chunks are 100% absent
                results = retrieval_engine.retrieve(
                    figure_id=case["figure_id"],
                    query=case["query"],
                    top_k=5
                )
                contaminated = any(c.figure_id == case["forbidden_figure"] for c, score in results)
                if not contaminated:
                    passed += 1
                    print(f"  [PASS] {case['case_id']}: Figure isolation preserved (0 {case['forbidden_figure']} chunks).")
                else:
                    print(f"  [FAIL] {case['case_id']}: Cross-figure contamination detected!")

            elif "injected_fake_chunk" in case:
                retrieved = get_chunks_for_figure(case["figure_id"])
                valid = grounding_validator.validate_citations(
                    candidate_citations=[{"chunk_id": case["injected_fake_chunk"], "quote_or_excerpt": "fake"}],
                    retrieved_chunks=retrieved,
                    figure_id=case["figure_id"]
                )
                if len(valid) == 0:
                    passed += 1
                    print(f"  [PASS] {case['case_id']}: Fabricated chunk ID was rejected successfully.")
                else:
                    print(f"  [FAIL] {case['case_id']}: Fabricated chunk accepted!")

            elif case.get("should_resolve"):
                results = retrieval_engine.retrieve(
                    figure_id=case["figure_id"],
                    query=case["query"],
                    top_k=3
                )
                found = any(c.chunk_id == case["expected_chunk"] for c, score in results)
                if found:
                    passed += 1
                    print(f"  [PASS] {case['case_id']}: Expected chunk {case['expected_chunk']} resolved.")
                else:
                    print(f"  [FAIL] {case['case_id']}: Chunk {case['expected_chunk']} was not in top results.")

    rate = (passed / total) * 100 if total > 0 else 0
    print(f"Result: {passed}/{total} ({rate:.1f}%) citation cases passed.")
    return passed == total


def main():
    print("=" * 60)
    print("TIMETRAVELERS EVALUATION HARNESS (Section 13)")
    print("=" * 60)

    p1 = run_source_questions_eval()
    p2 = run_speculation_eval()
    p3 = run_citation_isolation_eval()

    print("\n" + "=" * 60)
    if p1 and p2 and p3:
        print("ALL EVALUATION SUITES PASSED (100% Precision and Isolation)")
        print("=" * 60)
        sys.exit(0)
    else:
        print("SOME EVALUATION SUITES FAILED")
        print("=" * 60)
        sys.exit(1)


if __name__ == "__main__":
    main()
