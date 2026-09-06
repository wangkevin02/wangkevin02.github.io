// Run against the built site served at http://127.0.0.1:4000.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

async function checkThemeAppearance(page) {
  await page.evaluate(() => Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => {}))));
  const educationLink = await page
    .locator("#background .home-highlight-title a")
    .first()
    .evaluate((a) => ({ color: getComputedStyle(a).color, weight: getComputedStyle(a).fontWeight }));
  assert.deepEqual(
    await page
      .locator("#about p a")
      .first()
      .evaluate((a) => ({ color: getComputedStyle(a).color, weight: getComputedStyle(a).fontWeight })),
    { color: educationLink.color, weight: "400" },
    "Inline links use regular weight with the same theme color"
  );
  assert.equal(educationLink.weight, "600");
  assert.equal(
    await page
      .locator("#about p a")
      .first()
      .evaluate((a) => getComputedStyle(a).color),
    (await page.locator("html").getAttribute("data-theme")) === "dark" ? "rgb(138, 184, 223)" : "rgb(36, 90, 129)"
  );
  const lowContrast = await page.evaluate(() => {
    const rgb = (value) =>
      value
        .match(/[\d.]+/g)
        .map(Number)
        .slice(0, 3);
    const luminance = (values) =>
      values.reduce((sum, value, i) => {
        const channel = value / 255;
        return sum + [0.2126, 0.7152, 0.0722][i] * (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
      }, 0);
    return [...document.querySelectorAll("#about p a, .research-topics li, .publications .links a.btn, .publications .author, .venue-tag")].flatMap(
      (element) => {
        let ancestor = element;
        while (getComputedStyle(ancestor).backgroundColor === "rgba(0, 0, 0, 0)" && ancestor.parentElement) ancestor = ancestor.parentElement;
        const foreground = luminance(rgb(getComputedStyle(element).color));
        const background = luminance(rgb(getComputedStyle(ancestor).backgroundColor));
        const ratio = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
        return ratio < 4.5 ? [{ text: element.textContent.trim().slice(0, 40), ratio }] : [];
      }
    );
  });
  assert.deepEqual(lowContrast, [], "Text and link contrast in the current theme");
  const resource = page.locator("#selected-wang2026bridging .links a[href]").first();
  const normalBackground = await resource.evaluate((a) => getComputedStyle(a).backgroundColor);
  await resource.hover();
  await page.waitForFunction(({ selector, background }) => getComputedStyle(document.querySelector(selector)).backgroundColor !== background, {
    selector: "#selected-wang2026bridging .links a[href]",
    background: normalBackground,
  });
  assert.notEqual(await resource.evaluate((a) => getComputedStyle(a).backgroundColor), normalBackground);
  await page.mouse.move(0, 0);
}

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const errors = [];
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: "light" });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:4000", { waitUntil: "networkidle" });
    assert.equal(await page.locator("h1").count(), 1);
    assert(
      await page
        .locator("#about p a")
        .first()
        .evaluate((a) => getComputedStyle(a).textDecorationLine.includes("underline")),
      "Inline links have a non-color visual cue"
    );
    assert.equal(await page.locator(".publications .bibtex[tabindex='0']").count(), 8);
    const bibtexToggle = page.locator("#selected-wang2026bridging a.bibtex");
    await bibtexToggle.focus();
    await page.keyboard.press("Enter");
    assert.equal(await bibtexToggle.getAttribute("aria-expanded"), "true");
    await page.keyboard.press(" ");
    assert.equal(await bibtexToggle.getAttribute("aria-expanded"), "false");
    assert(
      await page
        .locator(".home-main > section + section")
        .evaluateAll((sections) =>
          sections.every(
            (section) => parseFloat(getComputedStyle(section).borderTopWidth) > 0 && parseFloat(getComputedStyle(section).paddingTop) >= 24
          )
        )
    );
    await checkThemeAppearance(page);
    const aboutWidth = await page.locator("#about").boundingBox();
    const paragraphWidth = await page.locator("#about p").first().boundingBox();
    assert(Math.abs(aboutWidth.width - paragraphWidth.width) < 2, "About text uses the available right-column width");
    assert(!/Location:/.test(await page.locator(".profile-contact").innerText()));
    assert(!/Advisor:/.test(await page.locator("#background").innerText()));
    assert.equal(await page.locator(".profile-cv-link").count(), 0);
    assert.equal(await page.locator("#all-publications .bibliography > li").count(), 5);
    assert.deepEqual(
      await page
        .locator("#selected-wang2026bridging .links a")
        .allTextContents()
        .then((labels) => labels.map((label) => label.trim())),
      ["PDF", "Code", "Demo", "BibTeX"]
    );
    assert.deepEqual(
      await page
        .locator("#ke2026catch .links a")
        .allTextContents()
        .then((labels) => labels.map((label) => label.trim())),
      ["PDF", "Code", "BibTeX"]
    );
    assert.equal(await page.locator("#ke2026catch .title a").getAttribute("href"), "https://ojs.aaai.org/index.php/AAAI/article/view/40406");
    assert.equal(await page.locator("#all-publications .paper-preview-link").count(), 5);
    assert.equal(await page.locator("#ke2026catch .links a[href*='arxiv.org']").count(), 0);
    assert.equal(await page.locator("#ke2026catch .links a[href='https://ojs.aaai.org/index.php/AAAI/article/download/40406/44367']").count(), 1);
    assert.equal(await page.locator("#news a[href='https://ojs.aaai.org/index.php/AAAI/article/view/40406']").count(), 1);
    assert.deepEqual(await page.locator("#all-publications h2.bibliography").allTextContents(), ["2026", "2025", "2024"]);
    assert(
      await page
        .locator("#all-publications h2.bibliography")
        .first()
        .evaluate((heading) => {
          const list = heading.nextElementSibling;
          return parseFloat(getComputedStyle(heading).fontSize) >= 24 && parseFloat(getComputedStyle(list).borderLeftWidth) > 0;
        }),
      "Year milestones are prominent and visually connected to their paper group"
    );
    assert.match(await page.locator("#news").innerText(), /Preprint · 2026\.06/);
    assert.match(await page.locator("#experience").innerText(), /2025\.07–Present/);
    assert.match(await page.locator("#news").innerText(), /AAAI 2026/);
    const experienceBox = await page.locator("#experience").boundingBox();
    const newsBox = await page.locator("#news").boundingBox();
    assert(experienceBox.y < newsBox.y);
    assert(await page.locator(".experience-logo").evaluate((img) => img.complete && img.naturalWidth > 0));
    assert(
      await page.locator(".experience-logo").evaluate((img) => {
        const style = getComputedStyle(img);
        const box = img.getBoundingClientRect();
        return box.width === box.height && style.borderRadius === "50%" && style.objectFit === "contain";
      }),
      "Experience logo must be circular without cropping the wordmark"
    );
    const logoBox = await page.locator(".experience-logo").boundingBox();
    const companyBox = await page.locator("#experience strong").boundingBox();
    assert(logoBox.x + logoBox.width < companyBox.x, "Logo sits beside the experience text");
    const ids = await page.locator("[id]").evaluateAll((nodes) => nodes.map((n) => n.id));
    assert.equal(ids.length, new Set(ids).size, "No duplicate bibliography IDs");
    await page.locator("a[href='#all-publications']").click();
    assert.equal(new URL(page.url()).hash, "#all-publications");
    assert.equal(await page.locator(".more-authors").count(), 0);
    assert.equal(await page.locator("#publications .author-self").count(), 3);
    assert.equal(await page.locator("#selected-jiang2024bridging").count(), 1);
    assert.match(await page.locator("#wang2025know .author").innerText(), /Xianfei Li/);
    assert.match(await page.locator("#wang2026bridging .author").innerText(), /Haizhou Li/);
    assert.equal(await page.locator(".links a:not(:has(i))").count(), 0);
    assert.equal(await page.locator(".update-label:not(:has(i))").count(), 0);
    assert.equal(await page.locator("#background h2").innerText(), "Education");
    assert.equal(await page.locator(".education-logo").count(), 2);
    assert.equal(await page.locator("#experience-heading").count(), 1);
    assert.equal(await page.locator(".profile-contact i, .profile-contact .contact-icon").count(), 5);
    assert.equal(await page.locator("#publications .paper-preview-link").count(), 3);
    assert.match(await page.locator(".profile-contact").innerText(), /Email: kuangwang@link.cuhk.edu.cn/);
    const previewBox = await page.locator(".paper-preview-link").first().boundingBox();
    const paperTitleBox = await page.locator(".paper-with-preview .title").first().boundingBox();
    assert(previewBox.x + previewBox.width < paperTitleBox.x, "Desktop preview must sit beside paper details");
    assert.equal(await page.locator(".profile-contact a[href='https://huggingface.co/wangkevin02']").count(), 1);
    for (const img of await page.locator(".education-logo, .paper-preview-link img").all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate((image) => image.decode());
      assert(await img.evaluate((image) => image.naturalWidth > 0));
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    assert.equal(await page.locator("#publications .publications ol.bibliography > li").count(), 3);
    assert.equal(await page.locator(".updates-section > .updates-list > li").count(), 3);
    assert.equal(await page.locator(".updates-archive li").count(), 2);
    assert(await page.locator(".academic-avatar img").evaluate((img) => img.complete && img.naturalWidth > 0));
    await page.screenshot({ path: "_audit/home-desktop.png", fullPage: true });
    await page.locator(".updates-archive summary").focus();
    await page.keyboard.press("Enter");
    assert((await page.locator(".updates-archive").getAttribute("open")) !== null);
    await page.goto("http://127.0.0.1:4000/#publications", { waitUntil: "networkidle" });
    assert.equal(new URL(page.url()).hash, "#publications");
    await page.locator("#light-toggle").click();
    await page.locator("#light-toggle").click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.waitForFunction(() => !document.documentElement.classList.contains("transition"));
    await checkThemeAppearance(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: "_audit/home-dark.png", fullPage: true });

    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/", "/publications/", "/cv/"]) {
        const response = await page.goto("http://127.0.0.1:4000" + path, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path + " overflows at " + width);
        if (path === "/publications/") {
          assert.deepEqual(await page.locator(".bibliography > li .row > div[id]").evaluateAll((nodes) => nodes.map((n) => n.id)), [
            "wang2026bridging",
            "ke2026catch",
            "liu2026discourse",
            "wang2025know",
            "jiang2024bridging",
          ]);
          assert.equal(await page.locator(".more-authors").count(), 0);
          assert.equal(await page.locator(".author-self").count(), 5);
        }
        if (path === "/") {
          const about = await page.locator("#about").boundingBox();
          const background = await page.locator("#background").boundingBox();
          const papers = await page.locator("#publications").boundingBox();
          const news = await page.locator("#news").boundingBox();
          if (width >= 768) {
            const profile = await page.locator(".home-sidebar").boundingBox();
            assert(profile.x + profile.width < papers.x, "Profile must stay on the left");
            assert(Math.abs(about.x - papers.x) < 1, "About must be on the right");
            assert(background.x + background.width < papers.x, "Education must be on the left");
            assert(Math.abs(news.x - papers.x) < 1, "News and papers must share the right column");
          } else {
            assert(background.y < about.y && about.y < news.y && news.y < papers.y, "Mobile reading order");
          }
        }
      }
    }
    await page.locator("[data-cv-language='zh']").click();
    assert.match(await page.locator("[data-cv-object]").getAttribute("data"), /Kuang_Wang_CV_zh.pdf/);
    assert.match(await page.locator("[data-cv-open]").getAttribute("href"), /Kuang_Wang_CV_zh.pdf/);
    await page.locator("[data-cv-language='en']").click();
    assert.match(await page.locator("[data-cv-object]").getAttribute("data"), /Kuang_Wang_CV_en.pdf/);
    for (const language of ["en", "zh"]) {
      const response = await context.request.get("http://127.0.0.1:4000/assets/pdf/Kuang_Wang_CV_" + language + ".pdf");
      assert.equal(response.status(), 200);
      assert.equal((await response.body()).subarray(0, 5).toString(), "%PDF-");
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://127.0.0.1:4000", { waitUntil: "networkidle" });
    await page.locator(".navbar-toggler").click();
    assert.equal(await page.locator(".navbar-toggler").getAttribute("aria-expanded"), "true");
    await page.waitForFunction(() => document.querySelector("#navbarNav").classList.contains("show"));
    await page.locator("#light-toggle").click();
    await page.waitForFunction(() => !document.documentElement.classList.contains("transition"));
    await page.locator(".navbar-toggler").click();
    await page.waitForFunction(
      () => !document.querySelector("#navbarNav").classList.contains("show") && !document.querySelector("#navbarNav").classList.contains("collapsing")
    );
    assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: "_audit/home-mobile.png", fullPage: true });

    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const staticPage = await noJs.newPage();
    await staticPage.goto("http://127.0.0.1:4000");
    await staticPage.locator(".updates-archive summary").click();
    assert((await staticPage.locator(".updates-archive").getAttribute("open")) !== null);
    assert.equal(await staticPage.locator("#publications .publications ol.bibliography > li").count(), 3);
    assert.deepEqual(errors, []);
    console.log(
      "Verified: 3 routes at 4 widths; no overflow; 5 papers; 3 recent + 2 archived updates; keyboard expansion; section navigation; theme switch; mobile menu; both CV PDFs; content without JavaScript; no page errors."
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
