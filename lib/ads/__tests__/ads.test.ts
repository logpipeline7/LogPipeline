import test from "node:test";
import assert from "node:assert/strict";
import {
  AD_SLOTS,
  getContextualTargeting,
  B2B_SPONSORSHIP_OFFERS,
} from "../config";
import { ActiveRefreshController } from "../refreshController";

test("ad slots have valid IAB standard dimensions and zero-CLS constraints", () => {
  const left = AD_SLOTS["sidebar-left"];
  assert.equal(left.minWidth, 300);
  assert.equal(left.minHeight, 600);
  assert.ok(left.sizes.some(([w, h]) => w === 300 && h === 600));

  const right = AD_SLOTS["sidebar-right"];
  assert.equal(right.minWidth, 160);
  assert.equal(right.minHeight, 600);

  const mid = AD_SLOTS["mid-content"];
  assert.equal(mid.minWidth, 728);
  assert.equal(mid.minHeight, 90);

  const bottom = AD_SLOTS["bottom-anchor"];
  assert.equal(bottom.minWidth, 320);
  assert.equal(bottom.minHeight, 50);
});

test("contextual B2B targeting returns high-value audience and vendor tags", () => {
  const awsTargeting = getContextualTargeting("aws", "aws-alb-access-logs");
  assert.ok(Array.isArray(awsTargeting.tech_stack));
  assert.ok((awsTargeting.tech_stack as string[]).includes("observability"));
  assert.ok((awsTargeting.vendor_context as string[]).includes("cloudwatch"));
  assert.deepEqual(awsTargeting.category, ["aws"]);
  assert.deepEqual(awsTargeting.slug, ["aws-alb-access-logs"]);
  assert.equal(awsTargeting.intent, "log_pipeline_configuration");

  const dbTargeting = getContextualTargeting("databases", "postgres-csv-log");
  assert.ok((dbTargeting.vendor_context as string[]).includes("postgresql"));
  assert.deepEqual(dbTargeting.category, ["databases"]);

  const defaultTargeting = getContextualTargeting();
  assert.deepEqual(defaultTargeting.category, ["general"]);
  assert.deepEqual(defaultTargeting.slug, ["workbench"]);
});

test("B2B sponsorship offers are defined with non-empty links and perks", () => {
  assert.equal(B2B_SPONSORSHIP_OFFERS.length, 2);
  for (const offer of B2B_SPONSORSHIP_OFFERS) {
    assert.ok(offer.sponsor.length > 0);
    assert.ok(offer.headline.length > 0);
    assert.ok(offer.targetUrl.startsWith("https://"));
    assert.ok(offer.perk.length > 0);
  }
});

test("ActiveRefreshController adheres to singleton and attention gating rules", () => {
  const controller = ActiveRefreshController.getInstance();
  const controller2 = ActiveRefreshController.getInstance();
  assert.equal(controller, controller2);

  // In Node environment (without browser window/document), attentiveness returns false
  assert.equal(controller.isUserAttentive(), false);
});
